import { NextApiRequest, NextApiResponse } from 'next';
import supabase from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Check if user is authenticated and is an admin
 */
export async function checkAdminAuth(req: NextApiRequest): Promise<AdminUser | null> {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return null;
    }

    // Check admin role from user metadata or custom claims
    const isAdmin =
      data.user.user_metadata?.role === 'admin' ||
      data.user.app_metadata?.role === 'admin' ||
      data.user.email === process.env.ADMIN_EMAIL;

    if (!isAdmin) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      isAdmin: true,
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

/**
 * Middleware to protect admin routes
 */
export async function adminMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  handler: (admin: AdminUser, req: NextApiRequest, res: NextApiResponse) => Promise<void>
): Promise<void> {
  // For development, you can add a simple check
  const adminToken = req.headers.authorization?.split('Bearer ')[1];
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev && process.env.ADMIN_SECRET && adminToken === process.env.ADMIN_SECRET) {
    // Allow in development with secret
    const mockAdmin: AdminUser = {
      id: 'dev-admin',
      email: 'admin@example.com',
      isAdmin: true,
    };
    return handler(mockAdmin, req, res);
  }

  const admin = await checkAdminAuth(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return handler(admin, req, res);
}

/**
 * Simple admin check for development/demo
 * In production, replace with Supabase auth check
 */
export function isAdminToken(token: string | undefined): boolean {
  if (!token) return false;

  const adminToken = process.env.ADMIN_SECRET;
  if (!adminToken) return false;

  return token === `Bearer ${adminToken}`;
}
