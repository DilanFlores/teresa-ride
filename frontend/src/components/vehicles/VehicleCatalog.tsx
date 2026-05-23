import React, { useState } from "react";
import { Vehicle } from "../../types/Vehicle";
import { VehicleCard } from "../vehicles/VehicleCard";
import { VehicleDetails } from "../vehicles/VehicleDetails";
import { Reservation } from "../../types/Reservation";
import { getVehicles } from "../../services/VehicleService";
import { useEffect } from "react";
import { User } from "../../types/User";

interface VehicleCatalogProps {
  user: User;
  addReservation: (reservation: Reservation) => void;
}

export function VehicleCatalog({user,
  addReservation,
}: VehicleCatalogProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getVehicles(); 
        setVehicles(list);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error loading vehicles");
        }
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  return (
    <div>
      {!selectedVehicle ? (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Catálogo de Vehículos</h1>
            <p className="text-gray-600">Encuentra el vehículo perfecto para tu aventura</p>
          </div>

          {loading ? (
            <p className="text-gray-600">Cargando vehículos...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : vehicles.length === 0 ? (
            <p className="text-gray-600">No se encontraron vehículos.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle, idx) => (
                <VehicleCard
                  key={String((vehicle as any).id ?? (vehicle as any).license_plate ?? idx)}
                  vehicle={vehicle}
                  onSelect={() => setSelectedVehicle(vehicle)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <VehicleDetails
          id_document={user.id_document}
          vehicle={selectedVehicle}
          onBack={() => setSelectedVehicle(null)}
        
        />
      )}
    </div>
  );
}