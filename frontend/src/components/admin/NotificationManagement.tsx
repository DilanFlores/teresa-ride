import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Pencil, Trash2, Search, AlertCircle, Paperclip } from 'lucide-react';
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
import { Notification } from '../../types/notification';
import { NotificationService } from '../../services/notificationService';
import { UserService } from "../../services/UserService";
import { User } from '../../types/User';
//pruebas de jenkins
export function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const [formData, setFormData] = useState<Omit<Notification, 'id_notification'> & {
    trip_destination?: string;
    trip_date?: string;
    payment_amount?: string;
    payment_transactionId?: string;
    payment_date?: string;
  }>({
    email_subject: '',
    description: '',
    shipping_date: '',
    attachment_path: '',
    type: 'PAYMENT_CONFIRMATION',
    trip_destination: '',
    trip_date: '',
    payment_amount: '',
    payment_transactionId: '',
    payment_date: '',
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await NotificationService.list();
        setNotifications(data);
      } catch (err) {
        toast.error('Error al cargar notificaciones');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.List();
        setUsers(data);
      } catch {
        toast.error('Error al cargar usuarios');
      }
    };
    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email_subject.trim()) newErrors.email_subject = 'El asunto es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.shipping_date) newErrors.shipping_date = 'La fecha es requerida';
    if (formData.type === "TRIP_REMINDER") {
      if (!formData.trip_destination?.trim()) newErrors.trip_destination = 'El destino es requerido';
      if (!formData.trip_date) newErrors.trip_date = 'La fecha del viaje es requerida';
    }
    if (formData.type === "PAYMENT_CONFIRMATION") {
      if (!formData.payment_amount) newErrors.payment_amount = 'El monto es requerido';
      if (!formData.payment_transactionId?.trim()) newErrors.payment_transactionId = 'El ID de transacción es requerido';
      if (!formData.payment_date) newErrors.payment_date = 'La fecha de pago es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (notification?: Notification) => {
    if (notification) {
      setEditingNotification(notification);
      setFormData({
        email_subject: notification.email_subject,
        description: notification.description,
        shipping_date: notification.shipping_date.slice(0, 10),
        attachment_path: notification.attachment_path || '',
        type: notification.type,
      });
    } else {
      setEditingNotification(null);
      setFormData({
        email_subject: '',
        description: '',
        shipping_date: '',
        attachment_path: '',
        type: 'PAYMENT_CONFIRMATION',
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFormData({ ...formData, attachment_path: file.name });
    } else {
      setSelectedFile(null);
      setFormData({ ...formData, attachment_path: '' });
      toast.error("Solo se permiten archivos PDF.");
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores');
      return;
    }
    const user = users.find(u => u.id_document === selectedUserId);
    if (!user) {
      toast.error('Debes seleccionar un usuario destinatario');
      return;
    }
    const email = user.email;

    const form = new FormData();
    form.append('email', email);
    form.append('email_subject', formData.email_subject);
    form.append('description', formData.description);
    form.append('shipping_date', formData.shipping_date);
    form.append('type', formData.type);

    if (selectedFile) {
      form.append('file', selectedFile);
    }

    try {
      if (formData.type === "PAYMENT_CONFIRMATION") {
        form.append('paymentDetails', JSON.stringify({
          amount: Number(formData.payment_amount) || 0,
          transactionId: formData.payment_transactionId || "",
          date: formData.payment_date || ""
        }));
        await NotificationService.SendPaymentConfirmation(form);
        toast.success('Confirmación de pago enviada');
      } else {
        form.append('tripDetails', JSON.stringify({
          destination: formData.trip_destination || "San José",
          date: formData.trip_date || "2025-10-30"
        }));
        await NotificationService.SendTripReminder(form);
        toast.success('Recordatorio de viaje enviado');
      }
      setIsDialogOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al enviar notificación');
    }
  };

  const handleDelete = async () => {
    if (!notificationToDelete) return;
    try {
      await NotificationService.delete(notificationToDelete.id_notification);
      setNotifications(notifications.filter(n => n.id_notification !== notificationToDelete.id_notification));
      toast.success('Notificación eliminada');
    } catch {
      toast.error('Error al eliminar notificación');
    } finally {
      setIsDeleteDialogOpen(false);
      setNotificationToDelete(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (priority: string) => {
    return priority;
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.email_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center py-10 text-gray-500">Cargando notificaciones...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Notificaciones</h1>
          <p className="text-gray-600">Administra las notificaciones del sistema</p>
        </div>
        <Button
          id='notification-create-button'
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Notificación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id='notification-search'
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" id="notification-list">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha de Envío</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Adjunto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron notificaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notification) => (
                    <TableRow key={notification.id_notification}>
                      <TableCell className="max-w-xs">{notification.email_subject}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{notification.description}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(notification.shipping_date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        {notification.id_notification}
                        {notification.type === "PAYMENT_CONFIRMATION"
                          ? "Confirmación de Pago"
                          : "Recordatorio de Viaje"}
                      </TableCell>
                      <TableCell>
                        {notification.attachment_path && (
                          <div className="flex items-center gap-1 text-sm">
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate max-w-[100px]">{notification.attachment_path}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            id={`notification-edit-${notification.id_notification}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(notification)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            id={`notification-delete-${notification.id_notification}`}
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setNotificationToDelete(notification);
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNotification ? 'Editar Notificación' : 'Nueva Notificación'}
            </DialogTitle>
            <DialogDescription>
              {editingNotification ? 'Actualiza la información de la notificación' : 'Ingresa los datos de la nueva notificación'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email_subject">Asunto</Label>
              <Input
                id="email_subject"
                value={formData.email_subject}
                onChange={(e) => {
                  setFormData({ ...formData, email_subject: e.target.value });
                  if (errors.email_subject) setErrors({ ...errors, email_subject: '' });
                }}
                className={errors.email_subject ? 'border-red-500' : ''}
              />
              {errors.email_subject && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email_subject}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={4}
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

            <div className="space-y-2">
              <Label htmlFor="shipping_date">Fecha de Envío</Label>
              <Input
                id="shipping_date"
                type="date"
                value={formData.shipping_date}
                onChange={(e) => {
                  setFormData({ ...formData, shipping_date: e.target.value });
                  if (errors.shipping_date) setErrors({ ...errors, shipping_date: '' });
                }}
                className={errors.shipping_date ? 'border-red-500' : ''}
              />
              {errors.shipping_date && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.shipping_date}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, type: value as 'PAYMENT_CONFIRMATION' | 'TRIP_REMINDER' })
                }
                
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="payment_confirmation" value="PAYMENT_CONFIRMATION">Confirmación de Pago</SelectItem>
                  <SelectItem id="trip_reminder" value="TRIP_REMINDER">Recordatorio de Viaje</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment_path">Adjunto (PDF)</Label>
              <Input
                id="attachment_path"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <div className="text-sm text-gray-700 mt-1">
                  Archivo seleccionado: <span className="font-semibold">{selectedFile.name}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="user">Usuario destinatario</Label>
              <select
                id="user"
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Seleccione un usuario...</option>
                {users.map(user => (
                  <option key={user.id_document} value={user.id_document}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {formData.type === "TRIP_REMINDER" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="trip_destination">Destino del viaje</Label>
                  <Input
                    id="trip_destination"
                    value={formData.trip_destination || ""}
                    onChange={e => setFormData({ ...formData, trip_destination: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trip_date">Fecha del viaje</Label>
                  <Input
                    id="trip_date"
                    type="date"
                    value={formData.trip_date || ""}
                    onChange={e => setFormData({ ...formData, trip_date: e.target.value })}
                  />
                </div>
              </>
            )}

            {formData.type === "PAYMENT_CONFIRMATION" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="payment_amount">Monto del pago</Label>
                  <Input
                    id="payment_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payment_amount || ""}
                    onChange={e => setFormData({ ...formData, payment_amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_transactionId">ID de transacción</Label>
                  <Input
                    id="payment_transactionId"
                    value={formData.payment_transactionId || ""}
                    onChange={e => setFormData({ ...formData, payment_transactionId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_date">Fecha de pago</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date || ""}
                    onChange={e => setFormData({ ...formData, payment_date: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              id={editingNotification ? 'notification-update-submit' : 'notification-create-submit'}
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              {editingNotification ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la notificación{' '}
              <span className="font-semibold">{notificationToDelete?.email_subject}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              id='notification-delete-button-confirm'
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
