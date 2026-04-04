import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAdminToken } from '@/lib/auth';
import { findScheduleConflict } from '@/lib/bookingTimeUtils';
import {
  BookingRow,
  getSelectedServicesDuration,
  mapBookingRow,
  normalizeSelectedServices,
} from '@/lib/supabaseMappers';

interface ApiResponse {
  success: boolean;
  data?: any;
  booking?: any;
  bookingId?: string;
  message?: string;
  error?: string;
  code?: string;
}

function normalizeDate(value: unknown) {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.split('T')[0];
  }

  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().split('T')[0];
}

function normalizeTimeSlot(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'time' in value) {
    return String((value as { time?: string }).time || '');
  }

  return '';
}

function buildBookingPayload(body: any) {
  const selectedServices = normalizeSelectedServices(
    body.services || body.selectedServices || body.serviceIds
  );

  const customerName = body.customerName || body.customerDetails?.name || '';
  const customerEmail = body.customerEmail || body.customerDetails?.email || '';
  const customerPhone = body.customerPhone || body.customerDetails?.phone || '';
  const notes = body.notes ?? body.customerDetails?.notes ?? '';
  const date = normalizeDate(body.date);
  const timeSlot = normalizeTimeSlot(body.timeSlot);
  const totalDuration =
    Number(body.totalDuration || 0) || getSelectedServicesDuration(selectedServices);
  const totalPrice =
    Number(body.totalPrice || 0) ||
    selectedServices.reduce((total, service) => total + Number(service.price || 0), 0);

  return {
    customerName,
    customerEmail,
    customerPhone,
    selectedServices,
    date,
    timeSlot,
    totalDuration,
    totalPrice,
    notes,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method === 'GET') {
      // Fetch all bookings (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { startDate, endDate, customerName, status } = req.query;

      let query = supabase.from('bookings').select('*');

      if (startDate) {
        query = query.gte('date', startDate as string);
      }
      if (endDate) {
        query = query.lte('date', endDate as string);
      }
      if (customerName) {
        query = query.ilike('customer_name', `%${customerName as string}%`);
      }
      if (status) {
        query = query.eq('status', status as string);
      }

      const { data, error } = await query
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: ((data || []) as BookingRow[]).map(mapBookingRow),
      });
    }

    if (req.method === 'POST') {
      // Create new booking
      const {
        customerName,
        customerEmail,
        customerPhone,
        selectedServices,
        date,
        timeSlot,
        totalDuration,
        totalPrice,
        notes,
      } = buildBookingPayload(req.body);

      if (
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        !date ||
        !timeSlot ||
        !selectedServices.length
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const { data: sameDayBookings, error: conflictReadError } = await supabase
        .from('bookings')
        .select('id, date, time, selected_services, status')
        .eq('date', date)
        .in('status', ['confirmed', 'pending']);

      if (conflictReadError) {
        throw conflictReadError;
      }

      const conflict = findScheduleConflict(timeSlot, totalDuration, sameDayBookings || []);

      if (conflict.conflict) {
        return res.status(409).json({
          success: false,
          error:
            'That time is no longer available — it overlaps an existing appointment. Please pick another slot.',
          code: 'SLOT_CONFLICT',
        });
      }

      const { data, error } = await supabase.from('bookings').insert([
        {
          customer_name: customerName,
          email: customerEmail,
          phone: customerPhone,
          selected_services: selectedServices,
          date,
          time: timeSlot,
          total_price: totalPrice,
          notes,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]).select().single();

      if (error) throw error;

      const savedBooking = mapBookingRow(data as BookingRow);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        bookingId: savedBooking.id,
        booking: {
          id: savedBooking.id,
          services: savedBooking.services,
          date,
          timeSlot:
            req.body?.timeSlot && typeof req.body.timeSlot === 'object'
              ? req.body.timeSlot
              : {
                  id: `slot-${timeSlot}`,
                  time: timeSlot,
                  available: true,
                },
          customerDetails: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            notes,
          },
          totalDuration,
          totalPrice,
          status: savedBooking.status,
        },
        data: savedBooking,
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Bookings API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
