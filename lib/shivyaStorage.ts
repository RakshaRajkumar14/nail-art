import {
  SHIVYA_DEFAULT_SERVICE,
  SHIVYA_ENHANCEMENTS,
  SHIVYA_SERVICES,
  ShivyaService,
} from './shivyaContent';

export const SELECTED_SERVICE_KEY = 'shivya:selected-service';
export const SELECTED_SERVICES_KEY = 'shivya:selected-services';
export const SELECTED_ENHANCEMENTS_KEY = 'shivya:selected-enhancements';
const BOOKING_CONFIRMATION_KEY = 'shivya:booking-confirmation';

export function getServiceById(id: string | null | undefined) {
  if (!id) {
    return null;
  }

  return [...SHIVYA_SERVICES, ...SHIVYA_ENHANCEMENTS].find((service) => service.id === id) || null;
}

export function storeSelectedService(serviceId: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SELECTED_SERVICE_KEY, serviceId);
}

export function readSelectedService(): ShivyaService {
  if (typeof window === 'undefined') {
    return SHIVYA_DEFAULT_SERVICE;
  }

  return getServiceById(window.localStorage.getItem(SELECTED_SERVICE_KEY)) || SHIVYA_DEFAULT_SERVICE;
}

export function storeSelectedServices(serviceIds: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SELECTED_SERVICES_KEY, JSON.stringify(serviceIds));
  // Keep legacy key in sync with first selected service
  if (serviceIds.length > 0) {
    window.localStorage.setItem(SELECTED_SERVICE_KEY, serviceIds[0]);
  } else {
    window.localStorage.removeItem(SELECTED_SERVICE_KEY);
  }
}

export function readSelectedServices(): ShivyaService[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(SELECTED_SERVICES_KEY);
  // Key present (including "[]") = authoritative multi-select list; do not fall through to legacy.
  if (raw !== null && raw !== '') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((id) => getServiceById(id))
          .filter((s): s is ShivyaService => Boolean(s));
      }
      if (typeof parsed === 'string') {
        const one = getServiceById(parsed);
        return one ? [one] : [];
      }
    } catch {
      // Invalid JSON: fall through to legacy
    }
  }

  const legacy = getServiceById(window.localStorage.getItem(SELECTED_SERVICE_KEY));
  return legacy ? [legacy] : [];
}

export function toggleEnhancement(serviceId: string) {
  if (typeof window === 'undefined') return;

  const current = new Set(readSelectedEnhancements().map((item) => item.id));
  if (current.has(serviceId)) {
    current.delete(serviceId);
  } else {
    current.add(serviceId);
  }

  window.localStorage.setItem(
    SELECTED_ENHANCEMENTS_KEY,
    JSON.stringify(Array.from(current))
  );
}

export function readSelectedEnhancements(): ShivyaService[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(SELECTED_ENHANCEMENTS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const ids = JSON.parse(raw) as string[];
    return ids
      .map((id) => getServiceById(id))
      .filter((service): service is ShivyaService => Boolean(service));
  } catch {
    return [];
  }
}

export function clearSelectedEnhancements() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SELECTED_ENHANCEMENTS_KEY);
}

export function clearAllSelections() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SELECTED_SERVICES_KEY);
  window.localStorage.removeItem(SELECTED_SERVICE_KEY);
  window.localStorage.removeItem(SELECTED_ENHANCEMENTS_KEY);
}

export function storeBookingConfirmation(data: unknown) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(BOOKING_CONFIRMATION_KEY, JSON.stringify(data));
}

export function readBookingConfirmation<T>() {
  if (typeof window === 'undefined') {
    return null as T | null;
  }

  const raw = window.sessionStorage.getItem(BOOKING_CONFIRMATION_KEY);
  if (!raw) return null as T | null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null as T | null;
  }
}
