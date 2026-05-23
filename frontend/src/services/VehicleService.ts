import { Vehicle } from "../types/Vehicle";
import { api } from "./Api";

export type VehicleCreatePayload = Omit<Vehicle, "image"> & {
  image?: File | Blob | string | null;
};

export type VehicleUpdatePayload = Partial<Omit<Vehicle, "image">> & {
  image?: File | Blob | string | null;
};

function buildFormData(
  payload: Record<string, any>
): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    if (key === "image") {
      if (value instanceof Blob) {
        const fileName = (value as any).name ?? "image.jpg";
        fd.append("image", value, fileName);
      } else if (typeof value === "string") {
        fd.append("image", value);
      }
      continue;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      fd.append(key, String(value));
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await api.get("/api/vehicles");
    return response.data as Vehicle[];
  } catch (error) {
    if ((error as any).isAxiosError) {
      console.error("Error fetching vehicles:", (error as any).message);
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};

export const getVehicleById = async (id: string | number): Promise<Vehicle> => {
  try {
    const response = await api.get(`/api/vehicles/${id}`);
    return response.data as Vehicle;
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 404) {
      throw new Error("Vehicle not found");
    }
    throw new Error("Error fetching vehicle");
  }
};

export const create = async (vehicle: VehicleCreatePayload): Promise<Vehicle> => {
  try {
    const formData = buildFormData(vehicle);
    const response = await api.post("/api/vehicles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data as Vehicle;
  } catch (error) {
    if ((error as any).isAxiosError) {
      console.error("Error creating vehicle:", (error as any).message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Error creating vehicle");
  }
};

export const update = async (
  license_plate: string,
  changes: VehicleUpdatePayload
): Promise<Vehicle> => {
  try {
    const formData = buildFormData(changes);
    const response = await api.put(
      `/api/vehicles/${encodeURIComponent(license_plate)}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data as Vehicle;
  } catch (error) {
    if ((error as any).isAxiosError) {
      console.error("Error updating vehicle:", (error as any).message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Error updating vehicle");
  }
};

export const remove = async (license_plate: string): Promise<void> => {
  try {
    await api.delete(`/api/vehicles/${encodeURIComponent(license_plate)}`);
  } catch (error) {
    if ((error as any).isAxiosError) {
      console.error("Error deleting vehicle:", (error as any).message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Error deleting vehicle");
  }
};

