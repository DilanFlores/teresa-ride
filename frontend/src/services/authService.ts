import { User } from "../types/User";
import { api } from "./Api";

type AnyObj = Record<string, any>;

function normalizeRole(data: AnyObj): User["role"] {
  const raw =
    typeof data.role === "string"
      ? data.role.toLowerCase()
      : data.admin === true || data.is_admin === true || data.role === 1
      ? "admin"
      : "user";
  return raw === "admin" ? "admin" : "user";
}

function normalizeUser(data: AnyObj, fallbackEmail?: string): User {
  const idDoc =
    data.id_document ??
    data.document ??
    data.cedula ??
    data.id_documento ??
    data.id ??
    "";

  return {
    id_document: String(idDoc).trim(),
    name: data.name ?? data.fullName ?? "",
    email: data.email ?? fallbackEmail ?? "",
    password: "",
    nationality: data.nationality ?? "",
    role: normalizeRole(data),
  };
}

interface LoginResponse {
  token: string;
  user: AnyObj;
}

export function logout() {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("authToken");
}

export async function login(email: string, password: string): Promise<User> {
  try {
    // Limpia tokens viejos por si el backend falla si ve Authorization en /login
    logout();

    const res = await api.post<LoginResponse>("/api/users/login", { email, password });
    const { token, user } = res.data;

    localStorage.setItem("authToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return normalizeUser(user, email);
  } catch (err: any) {
    const status = err?.response?.status;
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (status === 401 ? "Credenciales inválidas" : "Error al iniciar sesión");
    console.error("Login error:", { status, data: err?.response?.data });
    throw new Error(msg);
  }
}

export async function registerUser(payload: {
  id_document: string;
  name: string;
  email: string;
  password: string;
  nationality: string;
  role?: "admin" | "user";
}): Promise<User> {
  const body: AnyObj = {
    id_document: payload.id_document,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    nationality: payload.nationality,
    role: payload.role ?? "user",
  };
  const res = await api.post<{ user: AnyObj }>("/api/users/register", body);
  return normalizeUser(res.data.user);
}
