import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { TripCreatePayload, TripService,TripUpdatePayload } from '../../services/TripService';
import { Trip } from '../../types/Trip';
import { api } from '../../services/Api';
export function TripManagement() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isErrorDialogOpen, setIsErrorDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    price: '',
    people_count: '',
    start_date: '',
    final_date: '',
    description: '',
    image: '' as File | string | '',
  });

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
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await TripService.List();
        setTrips(data);
      } catch (error) {
        toast.error(`Error al cargar viajes: ${(error as Error).message}`);
      }
    };
    fetchTrips();
  }, []);
// Agregar este useEffect después de los otros useEffect
useEffect(() => {
  let objectUrl: string | undefined;
  const baseUrl = 
    (api.defaults.baseURL as string | undefined)?.replace(/\/$/, '') ?? 
    window.location.origin;

  if (formData.image instanceof File) {
    objectUrl = URL.createObjectURL(formData.image);
    setImagePreview(objectUrl);
  } else if (typeof formData.image === 'string' && formData.image.trim()) {
    const val = formData.image.trim();
    const isAbsolute = /^(https?:\/\/|data:)/i.test(val);
    setImagePreview(isAbsolute ? val : `${baseUrl}/${val.replace(/^\/+/, '')}`);
  } else {
    setImagePreview(null);
  }

  // Cleanup
  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [formData.image]);
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validaciones existentes
    if (!formData.origin.trim()) newErrors.origin = 'El origen es requerido';
    if (!formData.destination.trim()) newErrors.destination = 'El destino es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.start_date) newErrors.start_date = 'La fecha de salida es requerida';
    if (!formData.final_date) newErrors.final_date = 'La fecha de llegada es requerida';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.people_count || parseInt(formData.people_count) <= 0) newErrors.people_count = 'Los cupos deben ser mayor a 0';

    // Validación de fechas en zona horaria de Costa Rica (UTC-6)
    const getLocalDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // Mes empieza en 0
    };

    if (formData.start_date) {
      const startDate = getLocalDate(formData.start_date);

      // Obtener fecha actual de Costa Rica
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const costaRicaOffset = -6 * 60; // UTC-6
      const today = new Date(utc + costaRicaOffset * 60000);
      today.setHours(0, 0, 0, 0); // Ignorar horas, comparar solo la fecha

      if (startDate < today) {
        newErrors.start_date = 'La fecha de salida no puede ser anterior a la fecha actual';
      }
    }

    if (formData.start_date && formData.final_date) {
      const startDate = getLocalDate(formData.start_date);
      const finalDate = getLocalDate(formData.final_date);

      if (finalDate < startDate) {
        newErrors.final_date = 'La fecha de llegada no puede ser anterior a la fecha de salida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleOpenDialog = (trip?: Trip) => {
  if (trip) {
    setEditingTrip(trip);
    setFormData({
      origin: trip.origin,
      destination: trip.destination,
      price: trip.price.toString(),
      people_count: trip.people_count.toString(),
      start_date: trip.start_date,
      final_date: trip.final_date,
      description: trip.description,
      image: trip.image || '', // Manejar la imagen existente
    });
  } else {
    setEditingTrip(null);
    setFormData({
      origin: '',
      destination: '',
      price: '',
      people_count: '',
      start_date: '',
      final_date: '',
      description: '',
      image: '',
    });
    setImagePreview(null); // Limpiar la previsualización
  }
  setErrors({});
  setIsDialogOpen(true);
};

  const handleSave = async (tripData: TripCreatePayload) => {
    try {
      if (!validateForm()) return;
      const newTrip = await TripService.create(tripData as Trip);
      if (newTrip) {
        setTrips(prev => [...prev, newTrip]);
        toast.success('Viaje creado exitosamente');
        setIsDialogOpen(false);
        setIsSuccessDialogOpen(true);
      } else {
        toast.error('Error al crear el viaje');
      }
    } catch (error) {
      toast.error(`No se pudo crear el viaje: ${(error as Error).message}`);
      setErrorMessage("No se pudo crear el viaje. Inténtelo de nuevo.");
      setIsErrorDialogOpen(true);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleUpdate = async (id_trip: string, tripData: TripUpdatePayload) => {
    try {
      if (!validateForm()) return;
      const updatedTrip = await TripService.update(id_trip, tripData as Trip);
      if (updatedTrip) {
        setTrips(prev => prev.map(trip => trip.id_trip === id_trip ? updatedTrip : trip));
        toast.success('Viaje actualizado exitosamente');
        setIsDialogOpen(false);
        setIsSuccessDialogOpen(true);
      } else {
        toast.error('Error al actualizar el viaje');
        setErrorMessage("No se pudo crear el viaje. Inténtelo de nuevo.");
        setIsErrorDialogOpen(true);
      }
    } catch (error) {
      toast.error(`No se pudo actualizar el viaje: ${(error as Error).message}`);
    } finally {
      setIsDialogOpen(false);
      setEditingTrip(null);
    }
  };

  const handleDelete = async (id_trip: string) => {
    try {
      await TripService.delete(id_trip);
      setTrips(trips.filter(trip => trip.id_trip !== id_trip));
      toast.success('Viaje eliminado exitosamente');
    } catch (error) {
      toast.error(`No se pudo eliminar el viaje: ${(error as Error).message}`);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
 const tripPayload: TripCreatePayload = {
  origin: formData.origin,
  destination: formData.destination,
  description: formData.description,
  start_date: formData.start_date,
  final_date: formData.final_date,
  price: parseFloat(formData.price),
  people_count: parseInt(formData.people_count),
  image: formData.image instanceof File ? formData.image : formData.image || null,
};
 return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Viajes</h1>
          <p className="text-gray-600">Administra los viajes disponibles</p>
        </div>

        {/* ID PARA SELENIUM */}
        <Button id="btn-new-trip"
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Nuevo Viaje
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input id="trip-search"
              placeholder="Buscar viajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destino</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Llegada</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Cupos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron viajes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map(trip => (
                    <TableRow key={trip.id_trip}>

                      <TableCell>{trip.destination}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{trip.description}</p>
                      </TableCell>
                      <TableCell>{formatDate(trip.start_date)}</TableCell>
                      <TableCell>{formatDate(trip.final_date)}</TableCell>
                      <TableCell className="text-teal-600">${trip.price}</TableCell>
                      <TableCell>{trip.people_count}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">

                          {/* BOTÓN EDITAR CON ID PARA SELENIUM */}
                          <Button
                            id={`btn-edit-trip-${trip.id_trip}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(trip)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          {/* BOTÓN ELIMINAR CON ID PARA SELENIUM */}
                          <Button
                            id={`btn-delete-trip-${trip.id_trip}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setTripToDelete(trip);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>

                        </div>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CREAR / EDITAR DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>{editingTrip ? 'Editar Viaje' : 'Nuevo Viaje'}</DialogTitle>
            <DialogDescription>
              {editingTrip ? 'Actualiza la información del viaje' : 'Ingresa los datos del nuevo viaje'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">

            <div className="space-y-2">
              <Label>Origen</Label>
              <Input id="trip-origin"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                className={errors.origin ? 'border-red-500' : ''}
              />
              {errors.origin && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.origin}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Destino</Label>
              <Input id="trip-destination"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className={errors.destination ? 'border-red-500' : ''}
              />
              {errors.destination && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.destination}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea id="trip-description"
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.description}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Salida</Label>
              <Input id="trip-start-date"
                type="datetime-local"
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className={errors.start_date ? 'border-red-500' : ''}
              />
              {errors.start_date && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.start_date}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Fecha de Llegada</Label>
              <Input id="trip-final-date"
                type="datetime-local"
                value={formData.final_date}
                onChange={e => setFormData({ ...formData, final_date: e.target.value })}
                className={errors.final_date ? 'border-red-500' : ''}
              />
              {errors.final_date && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.final_date}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Precio ($)</Label>
              <Input id="trip-price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.price}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cupos</Label>
              <Input id="trip-people"
                type="number"
                min="1"
                value={formData.people_count}
                onChange={e => setFormData({ ...formData, people_count: e.target.value })}
                className={errors.people_count ? 'border-red-500' : ''}
              />
              {errors.people_count && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />{errors.people_count}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Imagen</Label>
              <Input id="trip-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({ ...formData, image: file });
                }}
              />

              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Previsualización"
                    className="h-40 w-full object-cover rounded border"
                  />
                </div>
              )}
            </div>

          </div>

          <DialogFooter>

            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button> 

            {/* Defensa Carlos front*/}
            <Button id="btn-save-trip"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              onClick={() => {
                if (!validateForm()) {
                  toast.error("Corrige los errores antes de continuar", { duration: 5000 });
                  return;
                }

                if (editingTrip) {
                  handleUpdate(editingTrip.id_trip, tripPayload as TripUpdatePayload);
                } else {
                  handleSave(tripPayload);
                }
              }}
            >
              {editingTrip ? 'Actualizar' : 'Crear'}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el viaje a{' '}
              <span className="font-semibold">{tripToDelete?.destination}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel id="btn-cancel-delete">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction id="btn-confirm-delete"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => tripToDelete && handleDelete(tripToDelete.id_trip)}
            >
              Eliminar
            </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
