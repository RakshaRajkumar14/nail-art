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
        query = query.ilike('status', status as string);
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

      // Trigger Confirmation Email directly via Resend (avoid self-fetch on Vercel)
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const serviceList = selectedServices
            .map((s: any) => s.title || s.bookingName || s.name || 'Service')
            .join(', ');

          const emailHtml = `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff8f5;padding:40px 24px">
              <h1 style="color:#c5856a;font-size:1.8rem;text-align:center;margin-bottom:8px">Shivya's Nail Studio</h1>
              <p style="text-align:center;color:#888;margin-bottom:32px">Appointment Confirmation</p>
              <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #f0e0d8">
                <p style="font-size:1.1rem;color:#1a1a1a">Hi ${customerName},</p>
                <p style="color:#444">Your appointment has been confirmed! Here are your details:</p>
                <table style="width:100%;margin:20px 0;border-collapse:collapse">
                  <tr><td style="padding:8px 0;color:#888;width:40%">Booking Ref</td><td style="color:#1a1a1a;font-weight:600">#${savedBooking.id.substring(0,8).toUpperCase()}</td></tr>
                  <tr><td style="padding:8px 0;color:#888">Date</td><td style="color:#1a1a1a">${date}</td></tr>
                  <tr><td style="padding:8px 0;color:#888">Time</td><td style="color:#1a1a1a">${timeSlot}</td></tr>
                  <tr><td style="padding:8px 0;color:#888">Services</td><td style="color:#1a1a1a">${serviceList}</td></tr>
                  <tr><td style="padding:8px 0;color:#888">Total</td><td style="color:#c5856a;font-weight:700">€${totalPrice}</td></tr>
                </table>
              </div>
              <p style="text-align:center;color:#888;font-size:0.85rem;margin-top:32px">© 2026 Shivya's Nail Studio · hello@shivyasnailstudio.com</p>
            </div>
          `;

          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'onboarding@resend.dev',
              to: customerEmail,
              subject: "Booking Confirmed - Shivya's Nail Studio",
              html: emailHtml,
            }),
          });
        } else {
          console.warn('[EMAIL] RESEND_API_KEY missing — email not sent');
        }
      } catch (err) {
        console.error('Failed to send confirmation email:', err);
      }

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
