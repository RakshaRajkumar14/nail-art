import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAdminToken } from '@/lib/auth';

interface Booking {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceIds: string[];
  date: string;
  timeSlot: string;
  totalDuration: number;
  totalPrice: number;
  notes?: string;
  status?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
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
        query = query.ilike('customerName', `%${customerName as string}%`);
      }
      if (status) {
        query = query.eq('status', status as string);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    }

    if (req.method === 'POST') {
      // Create new booking
      const { customerName, customerEmail, customerPhone, serviceIds, date, timeSlot, totalDuration, totalPrice, notes }: Booking = req.body;

      if (!customerName || !customerEmail || !date || !timeSlot || !serviceIds?.length) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      const { data, error } = await supabase.from('bookings').insert([
        {
          customerName,
          customerEmail,
          customerPhone,
          serviceIds,
          date,
          timeSlot,
          totalDuration,
          totalPrice,
          notes,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data: data?.[0] || {
          customerName,
          customerEmail,
          date,
          timeSlot,
          status: 'pending',
        },
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
