import React from 'react';
import { Vehicle } from '../../types/Vehicle';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';
import { api } from '../../services/Api'; // <-- casing correcto

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: () => void;
}

export function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  const inactive =
    vehicle?.is_active === false ||
    (vehicle as any)?.is_active === 0 ||
    String((vehicle as any)?.is_active).toLowerCase() === 'false';

  const baseUrl = (api.defaults.baseURL as string | undefined)?.replace(/\/$/, "") ?? window.location.origin;
  const imageSrc =
    vehicle?.image && String(vehicle.image).trim()
      ? /^(https?:\/\/)|^(data:)/i.test(String(vehicle.image))
        ? String(vehicle.image)
        : `${baseUrl}/${String(vehicle.image).replace(/^\/+/, '')}`
      : '/assets/vehicle-placeholder.png';

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group ${inactive ? 'opacity-80' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={vehicle.brand}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 bg-white text-gray-900">
          {vehicle.model}
        </Badge>
        {inactive && (
          <Badge className="absolute top-4 left-4 bg-gray-200 text-gray-700">
            No disponible
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl mb-2">{vehicle.brand}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{vehicle.capacity} personas</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl text-teal-600">${vehicle.price_per_day}</p>
            <p className="text-xs text-gray-500">por día</p>
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
