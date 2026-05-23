import { Trip } from '../types/Trip';
import { api } from './Api';

export type TripCreatePayload = Omit<Trip, "image" | "id_trip"> & {
  image?: File | Blob | string | null;
};

export type TripUpdatePayload = Partial<Omit<Trip, "image" | "id_trip">> & {
  image?: File | Blob | string | null;
};

// Construye FormData para enviar archivos
function buildFormData(payload: Record<string, any>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (key === "image") {
      if (value instanceof Blob) {
        const fileName = (value as any).name ?? "image.jpg";
        fd.append("image", value, fileName);
      } else if (typeof value === "string") {
        fd.append("image", value);
      }
      continue;
    }

    // Convierte boolean y number a string
    if (typeof value === "number" || typeof value === "boolean") {
      fd.append(key, String(value));
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

export class TripService {
  static async List(): Promise<Trip[]> {
    const res = await api.get<Trip[]>('/api/trips');
    return res.data;
  }

  static async GetById(id: string | number): Promise<Trip> {
    const res = await api.get<Trip>(`/api/trips/${encodeURIComponent(id)}`);
    return res.data;
  }

  static async create(trip: TripCreatePayload): Promise<Trip> {
    const formData = buildFormData(trip);
    const res = await api.post<Trip>('/api/trips', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async update(id: string | number, trip: TripUpdatePayload): Promise<Trip> {
    const formData = buildFormData(trip);
    const res = await api.put<Trip>(`/api/trips/${encodeURIComponent(id)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  static async delete(id: string | number): Promise<void> {
    await api.delete(`/api/trips/${encodeURIComponent(id)}`);
  }
}
