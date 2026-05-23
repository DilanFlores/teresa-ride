import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
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
import { getVehicles, create, update as updateVehicle, remove as removeVehicle } from '../../services/VehicleService';
import { useEffect } from 'react';
import { Vehicle } from '../../types/Vehicle';
import { api } from '../../services/Api';


export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sanitizePlate = (val: string) =>
    val.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10);

  const ALLOWED_IMAGE_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]);
  const isAllowedImage = (f: File) => ALLOWED_IMAGE_TYPES.has(f.type.toLowerCase());

  const [formData, setFormData] = useState({
    license_plate: '',
    brand: '',
    model: '',
    capacity: '',
    model_year: '',
    is_active: 'true' as 'true' | 'false',
    description: '',
    image: '' as File | string | '',
    price_per_day: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  }, [formData.image]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const list = await getVehicles();
        if (!mounted) return;
        setVehicles(list);
      } catch (err) {
        console.error('Error cargando vehículos:', err);
        toast.error('No se pudieron cargar los vehículos');
        setVehicles([]);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const plateExists = (plate: string) => {
    const normalized = plate.trim().toUpperCase();
    return vehicles.some(v => {
      const vPlate = v.license_plate.trim().toUpperCase();
      if (editingVehicle) {
        const current = editingVehicle.license_plate.trim().toUpperCase();
        if (vPlate === current && normalized === current) return false;
      }
      return vPlate === normalized;
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const normalizedPlate = sanitizePlate(formData.license_plate);
    if (!normalizedPlate) newErrors.license_plate = 'La placa es requerida';
    else if (!/^[A-Z0-9]+$/.test(normalizedPlate))
      newErrors.license_plate = 'La placa solo debe contener letras y números';
    else if (normalizedPlate.length > 10)
      newErrors.license_plate = 'La placa debe tener máximo 10 caracteres';
    else if (plateExists(normalizedPlate))
      newErrors.license_plate = 'Ya existe un vehículo con esa placa';

    if (!formData.brand.trim()) newErrors.brand = 'La marca es requerida';
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido';

    const capacityNum = parseInt(formData.capacity);
    if (!formData.capacity || isNaN(capacityNum) || capacityNum <= 0)
      newErrors.capacity = 'La capacidad debe ser mayor a 0';

    const yearNum = parseInt(formData.model_year);
    if (!formData.model_year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100)
      newErrors.model_year = 'Año inválido';

    const priceNum = formData.price_per_day ? Number(formData.price_per_day) : 0;
    if (formData.price_per_day !== '' && (isNaN(priceNum) || priceNum < 0))
      newErrors.price_per_day = 'Precio inválido';

    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';

    if (formData.image instanceof File && !isAllowedImage(formData.image)) {
      newErrors.image = 'Formato de imagen no permitido. Usa JPG, JPEG, PNG, WEBP o GIF';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        license_plate: vehicle.license_plate,
        brand: vehicle.brand,
        model: vehicle.model,
        capacity: String(vehicle.capacity),
        model_year: String(vehicle.model_year),
        is_active: vehicle.is_active ? 'true' : 'false',
        description: vehicle.description ?? '',
        image: vehicle.image ?? '',
        price_per_day: vehicle.price_per_day != null ? String(vehicle.price_per_day) : '',
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        license_plate: '',
        brand: '',
        model: '',
        capacity: '',
        model_year: '',
        is_active: 'true',
        description: '',
        image: '',
        price_per_day: '',
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores');
      return;
    }

    const payload = {
      license_plate: sanitizePlate(formData.license_plate), 
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      capacity: parseInt(formData.capacity, 10),
      model_year: parseInt(formData.model_year, 10),
      is_active: formData.is_active === 'true',
      description: formData.description.trim(),
      price_per_day:
        formData.price_per_day === '' ? 0 : Number(formData.price_per_day),
      image: formData.image === '' ? null : formData.image,
    };
    try {
      if (editingVehicle) {
        const updatedVehicle = await updateVehicle(editingVehicle.license_plate, payload);
        setVehicles((prev) =>
          prev.map((it) =>
            it.license_plate === editingVehicle.license_plate ? updatedVehicle : it
          )
        );
        toast.success('Vehículo actualizado');
      } else {
        const created = await create(payload);
        setVehicles((prev) => [created, ...prev]);
        toast.success('Vehículo creado');
      }
      setIsDialogOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Error saving vehicle');
    }
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await removeVehicle(vehicleToDelete.license_plate);
      setVehicles((prev) =>
        prev.filter((v) => v.license_plate !== vehicleToDelete.license_plate)
      );
      toast.success('Vehículo eliminado');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al eliminar el vehículo');
    } finally {
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const getActiveColor = (active: boolean) =>
    active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const filteredVehicles = vehicles.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.license_plate.toLowerCase().includes(term) ||
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Vehículos</h1>
          <p className="text-gray-600">Administra la flota de vehículos</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vehículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar vehículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron vehículos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((v) => (
                    <TableRow key={v.license_plate}>
                      <TableCell>{v.license_plate}</TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>{v.model}</TableCell>
                      <TableCell>{v.model_year}</TableCell>
                      <TableCell>{v.capacity} personas</TableCell>
                      <TableCell>
                        <Badge className={getActiveColor(v.is_active)}>
                          {v.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(v)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setVehicleToDelete(v);
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
            <DialogDescription>
              {editingVehicle ? 'Actualiza la información del vehículo' : 'Ingresa los datos del nuevo vehículo'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">Placa</Label>
              <Input
                id="license_plate"
                value={formData.license_plate}
                onChange={(e) => {
                  const sanitized = sanitizePlate(e.target.value);
                  setFormData({ ...formData, license_plate: sanitized });
                  if (errors.license_plate) setErrors({ ...errors, license_plate: '' });
                }}
                maxLength={10}
                className={errors.license_plate ? 'border-red-500' : ''}
              />
              {errors.license_plate && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.license_plate}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => {
                  setFormData({ ...formData, brand: e.target.value });
                  if (errors.brand) setErrors({ ...errors, brand: '' });
                }}
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.brand}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => {
                  setFormData({ ...formData, model: e.target.value });
                  if (errors.model) setErrors({ ...errors, model: '' });
                }}
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.model}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model_year">Año</Label>
              <Input
                id="model_year"
                type="number"
                min="1900"
                max="2100"
                value={formData.model_year}
                onChange={(e) => {
                  setFormData({ ...formData, model_year: e.target.value });
                  if (errors.model_year) setErrors({ ...errors, model_year: '' });
                }}
                className={errors.model_year ? 'border-red-500' : ''}
              />
              {errors.model_year && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.model_year}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad (personas)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => {
                  setFormData({ ...formData, capacity: e.target.value });
                  if (errors.capacity) setErrors({ ...errors, capacity: '' });
                }}
                className={errors.capacity ? 'border-red-500' : ''}
              />
              {errors.capacity && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.capacity}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Activo</Label>
              <Select
                value={formData.is_active}
                onValueChange={(value: 'true' | 'false') => setFormData({ ...formData, is_active: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_day">Precio por día</Label>
              <Input
                id="price_per_day"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_day}
                onChange={(e) => {
                  setFormData({ ...formData, price_per_day: e.target.value });
                  if (errors.price_per_day) setErrors({ ...errors, price_per_day: '' });
                }}
                className={errors.price_per_day ? 'border-red-500' : ''}
              />
              {errors.price_per_day && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.price_per_day}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen</Label>
              <Input
                id="image_file"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!isAllowedImage(file)) {
                      setErrors({ ...errors, image: 'Formato de imagen no permitido. Usa JPG, JPEG, PNG, WEBP o GIF' });
                      return;
                    }
                    setErrors({ ...errors, image: '' });
                    setFormData({ ...formData, image: file });
                  }
                }}
              />
              {errors.image && (
                <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.image}</span>
                </div>
              )}
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

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              {editingVehicle ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo con placa{' '}
              <span className="font-semibold">{vehicleToDelete?.license_plate}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
