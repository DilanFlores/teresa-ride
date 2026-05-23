export interface User {
  id_document: string;
  name: string;
  email: string;
  password: string;
  nationality: string;
  role: "admin" | "user";
  image_path?: string;
}
