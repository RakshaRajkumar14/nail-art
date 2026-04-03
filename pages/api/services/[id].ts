import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { isAdminToken } from '@/lib/auth';

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
      error: 'Invalid service ID',
    });
  }

  try {
    if (req.method === 'GET') {
      // Fetch single service
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }

    if (req.method === 'PUT') {
      // Update service (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { title, description, price, duration, category, imageUrl } = req.body;

      const { data, error } = await supabase
        .from('services')
        .update({
          title,
          description,
          price,
          duration,
          category,
          imageUrl,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({
          success: false,
          error: 'Service not found',
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }

    if (req.method === 'DELETE') {
      // Delete service (admin only)
      const authHeader = req.headers.authorization;
      if (!isAdminToken(authHeader)) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized - Admin access required',
        });
      }

      const { error } = await supabase.from('services').delete().eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: { message: 'Service deleted successfully' },
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  } catch (error: any) {
    console.error('Service API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
