import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: TimeSlot[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }

    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required',
      });
    }

    // Parse the date
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
      });
    }

    // Get working hours for this day of week
    const dayOfWeek = targetDate.getDay();
    const { data: workingHours, error: whError } = await supabase
      .from('workingHours')
      .select('*')
      .eq('dayOfWeek', dayOfWeek)
      .single();

    if (whError) {
      // Default working hours if not configured
      return getDefaultTimeSlots(res);
    }

    if (!workingHours || workingHours.closed) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Get all bookings for this date
    const dateStr = date as string;
    const { data: bookings, error: bError } = await supabase
      .from('bookings')
      .select('timeSlot, totalDuration')
      .eq('date', dateStr)
      .in('status', ['confirmed', 'pending']);

    if (bError) throw bError;

    // Generate time slots
    const timeSlots = generateTimeSlots(
      workingHours.startTime,
      workingHours.endTime,
      30 // 30 minute intervals
    );

    // Mark booked slots
    const bookedSlots = new Set<string>();
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking: any) => {
        const startTime = booking.timeSlot;
        const duration = booking.totalDuration || 60;
        const blockedSlots = getBlockedSlots(startTime, duration);
        blockedSlots.forEach((slot) => bookedSlots.add(slot));
      });
    }

    const availableSlots = timeSlots.map((time) => ({
      time,
      available: !bookedSlots.has(time),
    }));

    return res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (error: any) {
    console.error('Available times API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}

function getBlockedSlots(startTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentMinutes = hours * 60 + minutes;
  const endMinutes = currentMinutes + durationMinutes;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    currentMinutes += 30;
  }

  return slots;
}

function getDefaultTimeSlots(res: any): any {
  // Default: 9 AM to 6 PM with 30-minute intervals
  const slots = generateTimeSlots('09:00', '18:00', 30);
  const availableSlots = slots.map((time) => ({
    time,
    available: true,
  }));

  return res.status(200).json({
    success: true,
    data: availableSlots,
  });
}
