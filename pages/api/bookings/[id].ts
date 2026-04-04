import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAdminToken } from '@/lib/auth';
import { BookingRow, mapBookingRow } from '@/lib/supabaseMappers';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid booking ID',
    });
  }

  try {
    if (req.method === 'GET') {
      // Fetch single booking (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: mapBookingRow(data as BookingRow),
      });
    }

    if (req.method === 'PUT') {
      // Update booking (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { status, customerName, customerEmail, customerPhone, notes } = req.body;

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (status) updateData.status = status;
      if (customerName) updateData.customer_name = customerName;
      if (customerEmail) updateData.email = customerEmail;
      if (customerPhone) updateData.phone = customerPhone;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: mapBookingRow(data as BookingRow),
      });
    }

    if (req.method === 'DELETE') {
      // Delete booking (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { error } = await supabase.from('bookings').delete().eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: { message: 'Booking deleted successfully' },
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Booking API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
