import React, { useState, useEffect } from 'react';
import { ReservationResponse } from '../../types/ReservationResponse';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Calendar, Car, MapPin } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { ReviewDialog } from '../reviews/ReviewDialog';
import { getReservationsByDocument, cancelReservation, updateReservation } from '../../services/ReservationService';
import { toast } from 'sonner';

interface MyReservationsProps {
  id_document: string;
}

export function MyReservations({ id_document }: MyReservationsProps) {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationResponse | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [reservationToUpdate, setReservationToUpdate] = useState<ReservationResponse | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  useEffect(() => {
  if (!id_document) return;
  (async () => {
    try {
      setLoading(true);
      const data = await getReservationsByDocument(id_document);

    
      const fixedData = data?.map((r: any) => ({
        ...r,
        is_active: r.is_active === true || r.is_active === 1,
      }));

      setReservations(fixedData || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  })();
}, [id_document]);


  const handleOpenReview = (reservation: ReservationResponse) => {
    setSelectedReservation(reservation);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    if (selectedReservation) {
      console.log('Enviar reseña para', selectedReservation.id_reservation, rating, comment);
      setReviewDialogOpen(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId.toString());
      setReservations((prev) =>
        prev.map((r) => r.id_reservation === reservationId ? { ...r, is_active: false } : r)
      );
      toast.success('Reserva cancelada correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cancelar la reserva');
    }
  };

  const handleUpdateReservationDates = async (
    reservationId: number,
    newStartDate: string,
    newEndDate: string
  ) => {
    try {
      await updateReservation(reservationId, {
        new_date_reservacion: newStartDate,
        new_final_date: newEndDate,
      });
      setReservations((prev) =>
        prev.map((r) =>
          r.id_reservation === reservationId
            ? { ...r, date_reservacion: newStartDate, final_date: newEndDate }
            : r
        )
      );
      toast.success('Fechas actualizadas correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar fechas');
    }
  };

  const openDateDialog = (reservation: ReservationResponse) => {
    setReservationToUpdate(reservation);
    setNewStartDate(reservation.date_reservacion || reservation.start_date || '');
    setNewEndDate(reservation.final_date || reservation.trip_end_date || '');
    setIsDateDialogOpen(true);
  };

  const handleConfirmDateUpdate = () => {
    if (!reservationToUpdate || !newStartDate || !newEndDate) return;
    handleUpdateReservationDates(reservationToUpdate.id_reservation, newStartDate, newEndDate);
    setIsDateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'canceled': return 'Cancelada';
      default: return status;
    }
  };

  const getStartDate = (reservation: ReservationResponse) =>
    reservation.reservation_type === 'vehicle'
      ? reservation.date_reservacion
      : reservation.start_date;

  const getEndDate = (reservation: ReservationResponse) =>
    reservation.reservation_type === 'vehicle'
      ? reservation.final_date
      : reservation.trip_end_date;

  if (loading) return <p>Cargando reservaciones...</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Mis Reservaciones</h1>
        <p className="text-gray-600">Gestiona todas tus reservaciones en un solo lugar</p>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 rounded-full p-6">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl mb-2">No tienes reservaciones aún</h3>
            <p className="text-gray-600 mb-6">Explora nuestro catálogo de vehículos y viajes para comenzar tu aventura</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id_reservation} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full p-2">
                      {reservation.reservation_type === 'vehicle' ? (
                        <Car className="w-5 h-5 text-white" />
                      ) : (
                        <MapPin className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {reservation.reservation_type === 'vehicle'
                          ? `${reservation.brand} ${reservation.model}`
                          : `${reservation.origin} → ${reservation.destination}`}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {reservation.reservation_type === 'vehicle' ? 'Vehículo' : 'Viaje'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={getStatusColor(reservation.is_active ? 'confirmed' : 'canceled')}
                    >
                      {getStatusText(reservation.is_active ? 'confirmed' : 'canceled')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de inicio</p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {getStartDate(reservation)
                        ? new Date(getStartDate(reservation)!).toLocaleDateString('es-ES')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha de fin</p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {getEndDate(reservation)
                        ? new Date(getEndDate(reservation)!).toLocaleDateString('es-ES')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                    <p className="text-xl text-teal-600">${reservation.total_amount}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {reservation.is_active && reservation.reservation_type === 'vehicle' && (
                    <Button
                      onClick={() => openDateDialog(reservation)}
                      variant="outline"
                      className="flex-1 sm:flex-none px-3 py-1 text-sm border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      Actualizar fechas
                    </Button>
                  )}

                  {reservation.is_active && (
                    <Button
                      onClick={() => handleCancelReservation(reservation.id_reservation)}
                      variant="destructive"
                      className="flex-1 sm:flex-none px-3 py-1 text-sm"
                    >
                      Cancelar reserva
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedReservation && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          reservationName={
            selectedReservation.reservation_type === 'vehicle'
              ? `${selectedReservation.brand} ${selectedReservation.model}`
              : `${selectedReservation.origin} → ${selectedReservation.destination}`
          }
          onSubmitReview={handleSubmitReview}
          onRemindLater={() => setReviewDialogOpen(false)}
        />
      )}

      {/* Dialog para actualizar fechas */}
      <AlertDialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Actualizar Fechas</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona las nuevas fechas de tu reserva. Esto no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Fecha de inicio</Label>
              <Input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Fecha de fin</Label>
              <Input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                min={newStartDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleConfirmDateUpdate} className="bg-teal-500 hover:bg-teal-600 text-white">
                Confirmar fecha
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
