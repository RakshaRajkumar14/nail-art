import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, date, time, reminder_sent, status')
    .order('created_at', { ascending: false })
    .limit(5);

  const now = new Date();
  
  const debugData = data?.map(b => {
    const start = new Date(`${b.date}T${b.time}`);
    const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return {
      id: b.id,
      date: b.date,
      time: b.time,
      reminder_sent: b.reminder_sent,
      status: b.status,
      diffHours: diffHours,
      willTriggerCron: diffHours > 0 && diffHours <= 48 && !b.reminder_sent && (b.status === 'confirmed' || b.status === 'pending')
    };
  });

  res.status(200).json({ error, now: now.toISOString(), bookings: debugData });
}
