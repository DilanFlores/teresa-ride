export interface Notification {
  id_notification: number;
  email_subject: string;
  description: string;
  shipping_date: string;
  attachment_path?: string;
  type: "PAYMENT_CONFIRMATION" | "TRIP_REMINDER";
}
