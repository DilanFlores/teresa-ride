import React, { useState } from 'react';
import { Trip } from './../../types/Trip';
import { Reservation } from '../../types/Reservation';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star, Clock, ArrowLeft, Users } from 'lucide-react';
import { PaymentForm } from '../payments/PaymentForm';
import { createReservation } from '../../services/ReservationService';
import { api } from '../../services/Api';

interface TripDetailsProps {
  id_document: string;
  trip: Trip;
  onBack: () => void;
  onReservationCreated?: (reservation: Reservation) => void;
}

export function TripDetails({
  id_document,
  trip,
  onBack,
  onReservationCreated
}: TripDetailsProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Construcción segura de la URL base del backend (igual que en VehicleDetails)
  const baseUrl =
    (api.defaults.baseURL as string | undefined)?.replace(/\/$/, '') ??
    window.location.origin;

  // Validación de imagen del viaje (igual que VehicleDetails)
  const imageSrc =
    trip?.image && String(trip.image).trim()
      ? /^(https?:\/\/)|^(data:)/i.test(String(trip.image))
        ? String(trip.image)
        : `${baseUrl}/${String(trip.image).replace(/^\/+/, '')}`
      : '/assets/trip-placeholder.png';

  // Función para formatear fechas
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Función para crear la reserva
  const handleReserve = async (
    paymentMethod: 'paypal' | 'google pay',
    transactionCode: string,
    currency: 'USD' | 'CRC'
  ) => {
    try {
      const newReservation: Reservation = {
        id_document,
        type: 'trip',
        id_trip: trip.id_trip,
        total_amount: trip.price * trip.people_count,
        date_reservacion: trip.start_date,
        final_date: trip.final_date,
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

  // Si se muestra el formulario de pago
  if (showPaymentForm) {
    return (
      <PaymentForm
        id_document={id_document}
        id_trip={trip.id_trip}
        itemName={trip.destination}
        pricePerDay={trip.price}
        onBack={() => setShowPaymentForm(false)}
        type="trip"
        tripStartDate={trip.start_date}
        tripEndDate={trip.final_date}
        onReservationCreated={onReservationCreated}
        onConfirm={(
          _startDate: any,
          _endDate: any,
          _total: any,
          paymentMethod: 'paypal' | 'google pay',
          transactionCode: string,
          currency: 'USD' | 'CRC'
        ) => handleReserve(paymentMethod, transactionCode, currency)}
      />
    );
  }

  // Render principal
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Catálogo
      </Button>

      <div className="max-w-2xl mx-auto">
        {/* Imagen del viaje */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-4">
          <img
            src={imageSrc}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{trip.destination}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDate(trip.start_date)} → {formatDate(trip.final_date)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl text-teal-600">${trip.price}</p>
                <p className="text-sm text-gray-500">por persona</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <span>{trip.people_count} Espacios disponibles</span>
            </div>
            <p className="text-gray-700 mb-4">{trip.description}</p>

            <Button
              onClick={() => setShowPaymentForm(true)}
              className="w-full mt-6 text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              Reservar Ahora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
