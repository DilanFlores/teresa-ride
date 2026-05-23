import { Review } from "../types/Review";
import { api } from "./Api";

const BASE = "/api/reviews";

type Relaxed<T> = Omit<T, "date_review" | "rating"> & {
  date_review: Date | string;
  rating: number | string;
};

export type ReviewCreatePayload = Omit<Relaxed<Review>, "id_review">;
export type ReviewUpdatePayload = Partial<Omit<Relaxed<Review>, "id_review">>;

function serialize(payload: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined || v === null) continue;
    if (k === "rating") out.rating = Number(v);
    else if (k === "date_review")
      out.date_review = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
    else out[k] = v;
  }
  return out;
}

export const list = async (): Promise<Review[]> => {
  const res = await api.get<Review[]>(BASE);
  return res.data;
};

export const getById = async (id: string | number): Promise<Review> => {
  const res = await api.get<Review>(`${BASE}/${encodeURIComponent(id)}`);
  return res.data;
};

export const create = async (payload: ReviewCreatePayload): Promise<Review> => {
  const body = serialize(payload);
  const res = await api.post<Review>(BASE, body);
  return res.data;
};

export const update = async (
  id: string | number,
  changes: ReviewUpdatePayload
): Promise<Review> => {
  const body = serialize(changes);
  const res = await api.put<Review>(`${BASE}/${encodeURIComponent(id)}`, body);
  return res.data;
};

export const remove = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${BASE}/${encodeURIComponent(id)}`);
  } catch (error: any) {
    console.error("Error deleting review:", error?.message ?? error);
    throw new Error("Error deleting review");
  }
};

export async function getReservationsWithoutReview(id_document: string) {
  const res = await api.get(
    `/api/reservations/without-review/${encodeURIComponent(id_document)}`
  );
  const data = res.data;

  if (Array.isArray(data)) return data;
  if (data == null) return [];
  if (typeof data === "object") return [data];
  return [];
}

