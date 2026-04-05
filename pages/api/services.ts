import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAdminToken } from '@/lib/auth';
import { mapServiceRow, ServiceRow } from '@/lib/supabaseMappers';

interface Service {
  id?: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
      // Fetch all services (public)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: ((data || []) as ServiceRow[]).map(mapServiceRow),
      });
    }

    if (req.method === 'POST') {
      // Create new service (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { title, description, price, duration, category, imageUrl }: Service = req.body;

      if (!title || !price || !duration || !category) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: title, price, duration, category',
        });
      }

      const { data, error } = await supabase.from('services').insert([
        {
          title,
          description: description || '',
          price,
          duration,
          category,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]).select().single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data: data ? mapServiceRow(data as ServiceRow) : { title, description, price, duration },
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Services API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
