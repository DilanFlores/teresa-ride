import React, { useEffect, useState } from 'react';
import { Trip } from '../../types/Trip';
import { Reservation } from '../../types/Reservation';
import { TripCard } from './TripCard';
import { TripDetails } from './TripDetails';
import { TripService } from '../../services/TripService';
import { User } from '../../types/User';

interface TripCatalogProps {
  user: User;
  addReservation: (reservation: Reservation) => void;

}

export function TripCatalog({ user, addReservation }: TripCatalogProps) {
  // Mover los hooks dentro del componente
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await TripService.List();
        setTrips(data);
      } catch (error) {
        console.error("Error al listar viajes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);
  console.log("TripCatalog - Usuario recibido:", user);

  if (loading) {
    return <div>Cargando viajes...</div>;
  }

  return (
    <div>
      {!selectedTrip ? (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl mb-2">Catálogo de Viajes</h1>
            <p className="text-gray-600">Descubre experiencias únicas e inolvidables</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips
              .filter((trip) => trip.people_count > 0) // 👈 filtra los viajes con people_count > 0
              .map((trip) => (
                <TripCard
                  key={trip.id_trip}
                  trip={trip}
                  onSelect={() => setSelectedTrip(trip)}
                />
              ))}
          </div>
        </div>
      ) : (
        <TripDetails
          id_document={user.id_document}
          trip={selectedTrip}
          onBack={() => setSelectedTrip(null)}

        />
      )}
    </div>
  );
}
