import { getSelectedServicesDuration } from '@/lib/supabaseMappers';

export const DEFAULT_SLOT_INTERVAL_MINUTES = 30;
export const FALLBACK_BOOKING_DURATION_MIN = 60;

/** Statuses that occupy the schedule (block the slot for other customers). */
export function isScheduleBlockingStatus(status: string | null | undefined): boolean {
  const s = (status || 'pending').toLowerCase();
  return s === 'pending' || s === 'confirmed';
}

export function normalizeTimeToHHMM(time: string): string {
  const raw = String(time || '').trim();
  if (!raw) return '';
  const parts = raw.split(':').map((p) => parseInt(p, 10));
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return '';
  let h = parts[0];
  let m = parts[1];
  h = ((h % 24) + 24) % 24;
  m = Math.min(59, Math.max(0, m));
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function timeToMinutes(time: string): number {
  const normalized = normalizeTimeToHHMM(time);
  if (!normalized) return 0;
  const [h, m] = normalized.split(':').map(Number);
  return h * 60 + m;
}

export function rangesOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return start1 < end2 && end1 > start2;
}

export function getBookingIntervalMinutes(
  startTime: string,
  durationMinutes: number
): { start: number; end: number } {
  const start = timeToMinutes(startTime);
  const dur = Math.max(1, durationMinutes || FALLBACK_BOOKING_DURATION_MIN);
  return { start, end: start + dur };
}

export type BookingSlotRow = {
  id?: string;
  date: string;
  time: string;
  selected_services?: unknown;
  status?: string | null;
};

/**
 * True if a new booking would overlap an existing blocking booking on the same calendar date.
 */
export function findScheduleConflict(
  newTime: string,
  newDurationMinutes: number,
  existingBookings: BookingSlotRow[],
  options?: { excludeBookingId?: string }
): { conflict: boolean; conflictingId?: string } {
  const newNorm = normalizeTimeToHHMM(newTime);
  if (!newNorm) {
    return { conflict: false };
  }

  const { start: nStart, end: nEnd } = getBookingIntervalMinutes(
    newNorm,
    newDurationMinutes
  );

  for (const b of existingBookings) {
    if (options?.excludeBookingId && b.id === options.excludeBookingId) {
      continue;
    }
    if (!isScheduleBlockingStatus(b.status)) {
      continue;
    }
    const existingDur =
      getSelectedServicesDuration(b.selected_services as any[]) ||
      FALLBACK_BOOKING_DURATION_MIN;
    const { start: oStart, end: oEnd } = getBookingIntervalMinutes(b.time, existingDur);

    if (rangesOverlap(nStart, nEnd, oStart, oEnd)) {
      return { conflict: true, conflictingId: b.id };
    }
  }

  return { conflict: false };
}

/** 30-minute grid slots covered by [startTime, startTime + duration). */
export function getBlockedSlotStarts(
  startTime: string,
  durationMinutes: number,
  intervalMinutes: number = DEFAULT_SLOT_INTERVAL_MINUTES
): string[] {
  const slots: string[] = [];
  const { start, end } = getBookingIntervalMinutes(startTime, durationMinutes);
  let cursor = start;
  while (cursor < end) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    cursor += intervalMinutes;
  }
  return slots;
}

export function buildBookedSlotSet(
  bookings: Array<{ time: string; selected_services?: unknown; status?: string | null }>,
  intervalMinutes: number = DEFAULT_SLOT_INTERVAL_MINUTES
): Set<string> {
  const booked = new Set<string>();
  for (const booking of bookings) {
    if (!isScheduleBlockingStatus(booking.status)) {
      continue;
    }
    const duration =
      getSelectedServicesDuration(booking.selected_services as any[]) ||
      FALLBACK_BOOKING_DURATION_MIN;
    for (const slot of getBlockedSlotStarts(booking.time, duration, intervalMinutes)) {
      booked.add(slot);
    }
  }
  return booked;
}

export function formatDurationDisplay(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 mins';
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const minsRemaining = minutes % 60;
  if (minsRemaining === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${hrs} hr ${minsRemaining} mins`;
}
