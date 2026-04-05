type JsonValue = Record<string, any>;

export interface ServiceRow {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  price: number;
  image_url: string | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface BookingRow {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  selected_services: JsonValue[] | null;
  date: string;
  time: string;
  status: string | null;
  notes: string | null;
  total_price: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface StoredSelectedService {
  id?: string;
  title: string;
  price: number;
  duration: number;
  category?: string;
  description?: string;
}

export function mapServiceRow(row: ServiceRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    duration: row.duration,
    price: Number(row.price || 0),
    imageUrl: row.image_url || '',
    category: row.category || '',
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export function normalizeSelectedServices(
  services: any[] | undefined | null
): StoredSelectedService[] {
  if (!Array.isArray(services)) {
    return [];
  }

  return services.map((service) => {
    if (typeof service === 'string') {
      return {
        id: service,
        title: service,
        price: 0,
        duration: 0,
      };
    }

    return {
      id: service.id,
      title: service.title || service.name || 'Service',
      price: Number(service.price || 0),
      duration: Number(service.duration || 0),
      category: service.category,
      description: service.description,
    };
  });
}

export function getSelectedServicesDuration(
  services: StoredSelectedService[] | JsonValue[] | null | undefined
) {
  return normalizeSelectedServices(services as any[]).reduce(
    (total, service) => total + Number(service.duration || 0),
    0
  );
}

export function mapBookingRow(row: BookingRow) {
  const selectedServices = normalizeSelectedServices(row.selected_services);
  const totalDuration = getSelectedServicesDuration(selectedServices);

  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.email,
    customerPhone: row.phone,
    selectedServices,
    services: selectedServices.map((service) => ({
      id: service.id || service.title,
      name: service.title,
      duration: Number(service.duration || 0),
      price: Number(service.price || 0),
      description: service.description,
      category: service.category,
    })),
    date: row.date,
    timeSlot: row.time,
    totalDuration,
    totalPrice: Number(row.total_price || 0),
    notes: row.notes || '',
    status: row.status || 'pending',
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}
