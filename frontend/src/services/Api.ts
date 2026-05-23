import axios from "axios";

const baseURL: string = (import.meta as any).env.VITE_API_URL || window.location.origin;

export const api = axios.create({
  baseURL,
});

export default api;