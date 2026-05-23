import { api } from "./Api";
import { Reservation } from "../types/Reservation";
import { ReservationResponse } from "../types/ReservationResponse";

export async function createReservation(reservation: Reservation): Promise<Reservation> {
  const response = await api.post<Reservation>("/api/reservations", reservation);
  return response.data;
}   

export async function getReservationsByDocument(id_document: string): Promise<Reservation[] | null> {
  const response = await api.get<Reservation[]>(`/api/reservations/${id_document}`);
  return response.data;
}

export async function cancelReservation(id_reservation: string): Promise<void> {
  await api.delete(`/api/reservations/${id_reservation}`);
}
export async function updateReservation(
  id_reservation: number,
  updatedDates: { new_date_reservacion: string; new_final_date: string }
): Promise<void> {
  await api.put(`/api/reservations/${id_reservation}`, updatedDates);
}

export async function getReservationsById(id_reservation: string): Promise<Reservation | null> {
  const response = await api.get<Reservation>(`/api/reservations/getById/${id_reservation}`);
  return response.data;
}

