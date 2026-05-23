import React from 'react';
import { Trip } from '../../types/Trip';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Clock } from 'lucide-react';
import { api } from '../../services/Api';

interface TripCardProps {
  trip: Trip;
  onSelect: () => void;
}

export function TripCard({ trip, onSelect }: TripCardProps) {
  const baseUrl = (api.defaults.baseURL as string | undefined)?.replace(/\/$/, "") ?? window.location.origin;

  const imageSrc =
    trip?.image && String(trip.image).trim()
      ? /^(https?:\/\/)|^(data:)/i.test(String(trip.image))
        ? String(trip.image)
        : `${baseUrl}/${String(trip.image).replace(/^\/+/, '')}`
      : '/assets/trip-placeholder.png';

  
  function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={trip.origin}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl mb-2">Destino: {trip.destination}</h3>

        
        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Punto de Partida: </span>
          <Badge className="ml-1">{trip.origin}</Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span>Hora de salida: {formatDate(trip.start_date)}</span>
          <Clock className="w-4 h-4" />
          <span>Hora de llegada: {formatDate(trip.final_date)}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl text-teal-600">${trip.price}</p>
            <p className="text-xs text-gray-500">por persona</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
