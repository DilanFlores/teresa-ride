import { User } from "../types/User";
import { api } from "./Api";

const BASE = "/api/users";

export class UserService {
  static async List(): Promise<User[]> {
    const res = await api.get<User[]>(BASE);
    return res.data;
  }

  static async GetById(id: string): Promise<User> {
    const res = await api.get<User>(`${BASE}/${encodeURIComponent(id)}`);
    return res.data;
  }

  static async create(user: User): Promise<User> {
    const res = await api.post<{ user: User }>(`${BASE}/register`, user);
    return res.data.user;
  }
  static async createUserAdmin(user: User): Promise<User> {
    const res = await api.post<{ user: User }>(`${BASE}/registerAdmin`, user);
    return res.data.user;
  }

  static async createUserAdminWithImage(form: FormData): Promise<User> {
    const res = await api.post<{ user: User }>(`${BASE}/registerAdmin`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.user;
  }

  static async update(id: string, user: User): Promise<User> {
    const res = await api.put<User>(`${BASE}/${encodeURIComponent(id)}`, user);
    return res.data;
  }

  static async updateWithImage(id: string, form: FormData): Promise<User> {
    const res = await api.put<{ user: User }>(`${BASE}/${encodeURIComponent(id)}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.user;
  }

  static async delete(id: string): Promise<void> {
    await api.delete(`${BASE}/${encodeURIComponent(id)}`);
  }

  static async getMe(): Promise<User> {
    const res = await api.get<User>(`${BASE}/me`);
    return res.data;
  }

  static async updateMe(form: FormData): Promise<{ user: User }> {
    const res = await api.put<{ user: User }>(`${BASE}/me`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
}

