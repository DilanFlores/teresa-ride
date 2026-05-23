export interface Reservation {
  id_document: string;
  type: 'vehicle' | 'trip'; 
  id_trip?: string;
  license_plate?: string;
  total_amount: number;
  date_reservacion: string;
  final_date?: string;      
  payment_method: 'paypal' | 'google pay'; 
  transaction_code: string;
  currency: 'USD' | 'CRC' ; 
}
