export interface ReservationResponse {
  id_reservation: number;
  date_reservacion: string;
  total_amount: string;
  final_date: string;
  is_active: boolean;
  user_name: string;
  user_email: string;
  nationality: string;

  // Campos del viaje (si aplica)
  id_trip?: number | null;
  origin?: string | null;
  destination?: string | null;
  trip_price?: string | null;
  start_date?: string | null;
  trip_end_date?: string | null;
  people_count?: number | null;
  trip_description?: string | null;

  // Campos del vehículo (si aplica)
  license_plate?: string | null;
  brand?: string | null;
  model?: string | null;
  capacity?: number | null;
  model_year?: number | null;
  price_per_day?: string | null;
  vehicle_description?: string | null;

  reservation_type: 'vehicle' | 'trip';
}
