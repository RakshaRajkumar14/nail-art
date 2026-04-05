import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

// In Next.js on Vercel, the CRON triggers will have an Authorization header with a Bearer token matching CRON_SECRET.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Authenticate Cron Job
  const authHeader = req.headers.authorization;
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
  }

  try {
    // 2. Fetch bookings that might need a reminder.
    // We fetch any booking that is confirmed or pending, and hasn't been sent a reminder yet.
    // Note: this requires `reminder_sent` column to exist in Supabase! If it doesn't, this query might fail.
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, email, customer_name, date, time, selected_services, reminder_sent')
      .in('status', ['confirmed', 'pending'])
      // Assuming you added `reminder_sent` via SQL, we only want unsent ones:
      .is('reminder_sent', false);

    if (error) {
      console.log('Error fetching bookings (Ensure reminder_sent column exists!)', error);
      throw error;
    }

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ success: true, message: 'No upcoming bookings need reminders.' });
    }

    const now = new Date();
    let sentCount = 0;

    // Resolve base URL for local fetching to our own API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // 3. Check each booking and send email if it's within 3 hours.
    for (const booking of bookings) {
      // Parse date and time in local parsing (assuming Berlin time, but simple JS Date is UTC/Local mix).
      // For a robust system, use a library like date-fns-tz. Here we do a simple string combine.
      const bookingStart = new Date(`${booking.date}T${booking.time}`);
      
      const diffMs = bookingStart.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Send reminder if the appointment is between 1h and 2h away
      if (diffHours > 0 && diffHours <= 2) {
        
        let servicesStr = 'Your booked enhancements';
        try {
           if (Array.isArray(booking.selected_services)) {
              servicesStr = booking.selected_services.map((s: any) => typeof s === 'string' ? s : s.name).join(', ');
           }
        } catch { /* ignore */ }

        // Send Email via our own API
        const emailRes = await fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
             to: booking.email,
             subject: `Reminder: Nail Art Appointment at Shivya's Studio`,
             templateType: 'booking-reminder',
             data: {
                customerName: booking.customer_name,
                bookingRef: booking.id.split('-').shift()?.toUpperCase() || booking.id,
                date: booking.date,
                time: booking.time,
                services: servicesStr,
             }
          })
        });

        if (emailRes.ok) {
           // Update database to mark as sent
           await supabase
             .from('bookings')
             .update({ reminder_sent: true })
             .eq('id', booking.id);
             
           sentCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Cron executed. Sent ${sentCount} reminders.`,
    });
  } catch (err: any) {
    console.error('Cron error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
