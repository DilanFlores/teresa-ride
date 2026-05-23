import { Notification } from "../types/notification";
import { api } from "./Api";

const BASE = "/api/notifications";

export class NotificationService {
  static async list(): Promise<Notification[]> {
    const res = await api.get<Notification[]>(BASE);
    return res.data;
  }

  static async getById(id: number): Promise<Notification> {
    const res = await api.get<Notification>(`${BASE}/${id}`);
    return res.data;
  }

  static async SendPaymentConfirmation(formData: FormData): Promise<Notification> {
    const res = await api.post<Notification>(`${BASE}/payment-confirmation`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  static async SendTripReminder(formData: FormData): Promise<Notification> {
    const res = await api.post<Notification>(`${BASE}/trip-reminder`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  static async update(id: number, notification: Partial<Notification>): Promise<Notification> {
    const res = await api.put<Notification>(`${BASE}/${id}`, notification);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  }
}