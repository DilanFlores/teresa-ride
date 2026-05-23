import React, { useState } from 'react';
import { Reservation } from '../../types/Reservation';
import { Vehicle } from '../../types/Vehicle';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Users } from 'lucide-react';
import { PaymentForm } from '../payments/PaymentForm';
import { createReservation } from '../../services/ReservationService';
import { api } from '../../services/Api';

interface VehicleDetailsProps {
  id_document: string;
  vehicle: Vehicle;
  onBack: () => void;
  onReservationCreated?: (reservation: Reservation) => void;
}

export function VehicleDetails({
  id_document,
  vehicle,
  onBack,
  onReservationCreated
}: VehicleDetailsProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const baseUrl =
    (api.defaults.baseURL as string | undefined)?.replace(/\/$/, '') ??
    window.location.origin;

  const imageSrc =
    vehicle?.image && String(vehicle.image).trim()
      ? /^(https?:\/\/)|^(data:)/i.test(String(vehicle.image))
        ? String(vehicle.image)
        : `${baseUrl}/${String(vehicle.image).replace(/^\/+/, '')}`
      : '/assets/vehicle-placeholder.png';

  const isInactive =
    vehicle?.is_active === false ||
    (vehicle as any)?.is_active === 0 ||
    String((vehicle as any)?.is_active).toLowerCase() === 'false';

  // Función para crear la reserva
  const handleReserve = async (
    startDate: string,
    endDate: string,
    total: number,
    paymentMethod: 'paypal' | 'google pay',
    transactionCode: string,
    currency: 'USD' | 'CRC'
  ) => {
    if (isInactive) return;
    try {
      const newReservation: Reservation = {
        id_document,
        type: 'vehicle',
        license_plate: vehicle.license_plate,
        total_amount: total,
        date_reservacion: startDate,
        final_date: endDate,
        payment_method: paymentMethod,
        transaction_code: transactionCode,
        currency
      };

      const createdReservation = await createReservation(newReservation);

      if (onReservationCreated) onReservationCreated(createdReservation);

      setShowPaymentForm(false);
      onBack();
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('No se pudo crear la reserva. Intenta nuevamente.');
    }
  };

  if (showPaymentForm) {
    return (
      <PaymentForm
        id_document={id_document}
        license_plate={vehicle.license_plate}
        itemName={vehicle.model}
        pricePerDay={vehicle.price_per_day}
        onBack={() => setShowPaymentForm(false)}
        type="vehicle"
        onReservationCreated={onReservationCreated}
        onConfirm={(startDate, endDate, total, paymentMethod, transactionCode, currency) =>
          handleReserve(startDate, endDate, total, paymentMethod, transactionCode, currency)
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Catálogo
      </Button>

      <div className="max-w-2xl mx-auto">
        {isInactive && (
          <div className="mb-4 rounded border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3">
            Este vehículo no está disponible por el momento. No se pueden realizar reservas.
          </div>
        )}
        <div className="relative h-96 rounded-lg overflow-hidden mb-4">
          <img src={imageSrc} alt={vehicle.brand} className="w-full h-full object-cover" />
          {isInactive && (
            <Badge className="absolute top-4 left-4 bg-gray-200 text-gray-700">
              No disponible
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{vehicle.brand}</CardTitle>
                <Badge className="mt-2">Modelo:{vehicle.model}</Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl text-teal-600">${vehicle.price_per_day}</p>
                <p className="text-sm text-gray-500">por día</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <span>Capacidad: {vehicle.capacity} personas</span>
            </div>
            <p className="text-gray-700 mb-4">{vehicle.description}</p>

            <Button
              onClick={() => { if (!isInactive) setShowPaymentForm(true); }}
              disabled={isInactive}
              aria-disabled={isInactive}
              title={isInactive ? 'Vehículo inactivo' : undefined}
              className={`w-full mt-6 ${isInactive
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none select-none'
                : 'text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
                }`}
            >
              Reservar Ahora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
