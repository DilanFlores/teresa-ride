import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { UserService } from "../../services/UserService";
import { User } from '../../types/User';
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

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id_document: '',
    nationality: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.List();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let objectUrl: string | undefined;
    
    if (imageFile) {
      objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
    } else if (editingUser?.image_path) {
      setImagePreview(`/api/uploads/users/${editingUser.image_path}`);
    } else {
      setImagePreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageFile, editingUser]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.id_document.trim()) {
      newErrors.id_document = 'La cédula o pasaporte es requerida';
    } else if (formData.nationality === "Costa Rica") {
      if (!/^\d{9}$/.test(formData.id_document)) {
        newErrors.id_document = 'La cédula costarricense debe tener exactamente 9 dígitos';
      }
    } else if (!/^\d{8,13}$/.test(formData.id_document)) {
      newErrors.id_document = 'Debe tener entre 8 y 13 dígitos';
    }
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'La nacionalidad es requerida';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!editingUser && formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    if ((!editingUser && formData.password) || (editingUser && formData.password)) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    if (!editingUser && !imageFile) {
      newErrors.image = 'La imagen de perfil es obligatoria';
    }
    if (imageFile && !imageFile.type.startsWith("image/")) {
      newErrors.image = 'Solo se permiten archivos de imagen (jpg, png, etc.)';
    }
    if (editingUser && !editingUser.image_path && !imageFile) {
      newErrors.image = 'Debes seleccionar una imagen de perfil';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        id_document: user.id_document,
        nationality: user.nationality,
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        id_document: '',
        nationality: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });
    }
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores');
      return;
    }

    try {
      const { id_document, nationality, name, email, role } = formData;
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("id_document", id_document);
      form.append("nationality", nationality);
      form.append("role", role);
      form.append("password", formData.password);
      if (imageFile) form.append("image", imageFile);

      if (editingUser) {
        await UserService.updateWithImage(editingUser.id_document, form);
        toast.success('Usuario actualizado');
      } else {
        await UserService.createUserAdminWithImage(form);
        toast.success('Usuario creado');
      }
      setIsDialogOpen(false);
      fetchUsers(); 
    } catch (err: any) {
      console.error(err);
      const backendMsg = err?.response?.data?.error || err?.response?.data?.message;
      toast.error(backendMsg || 'Error al guardar usuario');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await UserService.delete(userToDelete.id_document);
      setUsers(users.filter(u => u.id_document !== userToDelete.id_document));
      toast.success('Usuario eliminado');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar usuario');
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id_document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen (jpg, png, etc.)");
      setImageFile(null);
      setErrors(prev => ({ ...prev, image: 'Solo se permiten archivos de imagen (jpg, png, etc.)' }));
      if (e.target.value) e.target.value = "";
      return;
    }
    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Cargando usuarios...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuarios..."
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
                  <TableHead>Imagen</TableHead>
                  <TableHead>Cédula/Pasaporte</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Nacionalidad</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead> 
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id_document}>
                      <TableCell>
                        {user.image_path ? (
                          <img
                            src={user.image_path ? `/api/uploads/users/${user.image_path}` : "/default-avatar.png"}
                            alt="Perfil"
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-400">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.id_document}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.nationality}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</TableCell> {/* Mostrar rol */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToDelete(user);
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
            <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Actualiza la información del usuario' : 'Ingresa los datos del nuevo usuario'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id_document">Cédula o Pasaporte</Label>
              <Input
                id="id_document"
                value={formData.id_document}
                onChange={(e) => {
                  setFormData({ ...formData, id_document: e.target.value });
                  if (errors.id_document) setErrors({ ...errors, id_document: '' });
                }}
                className={errors.id_document ? 'border-red-500' : ''}
              />
              {errors.id_document && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.id_document}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidad</Label>
              <select
                id="nationality"
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                className={`w-full border rounded px-2 py-1 ${errors.nationality ? 'border-red-500' : ''}`}
              >
                <option value="">Seleccione...</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Panamá">Panamá</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="México">México</option>
                <option value="España">España</option>

              </select>
              {errors.nationality && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.nationality}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? 'Nueva Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <select
                  id="nationality"
                  value={formData.nationality}
                  onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  className={`w-full border rounded px-2 py-1 ${errors.nationality ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccione...</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Panamá">Panamá</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="México">México</option>
                  <option value="España">España</option>
                </select>
                {errors.nationality && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.nationality}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="role">Rol</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className={`w-full border rounded px-2 py-1 ${errors.role ? 'border-red-500' : ''}`}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.role}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen de Perfil</Label>
              {imagePreview && (
                <div className="flex justify-center mb-2">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.image}</span>
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
              disabled={!!errors.image}
            >
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{userToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              id='user-delete-button'
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
