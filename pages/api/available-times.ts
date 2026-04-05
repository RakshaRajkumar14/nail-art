import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import {
  findScheduleConflict,
  DEFAULT_SLOT_INTERVAL_MINUTES,
} from '@/lib/bookingTimeUtils';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: TimeSlot[];
  error?: string;
}

async function fetchBlockingBookingsForDate(dateStr: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, time, selected_services, status')
    .eq('date', dateStr)
    .in('status', ['confirmed', 'pending']);

  if (error) {
    throw error;
  }

  return data || [];
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

function slotsWithAvailability(
  timeSlots: string[],
  bookings: Array<{ id?: string; time: string; selected_services?: unknown; status?: string | null }>,
  requestedDuration: number
): TimeSlot[] {
  return timeSlots.map((time) => {
    const { conflict } = findScheduleConflict(time, requestedDuration, bookings as any[]);
    return {
      time,
      available: !conflict,
    };
  });
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

    const { date, duration } = req.query;

    if (!date || typeof date !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required',
      });
    }

    const requestedDuration = Number(duration) || 60; // Default to fallback

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format',
      });
    }

    const dateStr = date as string;
    const dayOfWeek = targetDate.getDay();

    let bookings: Array<{ id?: string; time: string; selected_services?: unknown; status?: string | null }>;
    try {
      bookings = await fetchBlockingBookingsForDate(dateStr);
    } catch (e: any) {
      console.error('available-times: bookings fetch failed', e);
      return res.status(500).json({
        success: false,
        error: e.message || 'Failed to load availability',
      });
    }

    const { data: workingHours, error: whError } = await supabase
      .from('workingHours')
      .select('*')
      .eq('dayOfWeek', dayOfWeek)
      .single();

    if (workingHours?.closed) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const startTime =
      !whError && workingHours?.startTime ? workingHours.startTime : '09:00';
    const endTime = !whError && workingHours?.endTime ? workingHours.endTime : '18:00';

    const timeSlots = generateTimeSlots(
      startTime,
      endTime,
      DEFAULT_SLOT_INTERVAL_MINUTES
    );

    return res.status(200).json({
      success: true,
      data: slotsWithAvailability(timeSlots, bookings, requestedDuration),
    });
  } catch (error: any) {
    console.error('Available times API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
