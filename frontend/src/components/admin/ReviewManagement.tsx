import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { list as listReviews, remove as deleteReview } from '../../services/ReviewService';
import { api } from '../../services/Api';
import { User } from '../../types/User';
import { Review } from '../../types/Review';
import { UserService } from '../../services/UserService';
import { getReservationsById } from '../../services/ReservationService';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';

type FilterType = 'all' | 'Vehicle' | 'Trip';

export function ReviewManagement() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const today = new Date().toISOString().slice(0, 10);
    const [ratingFilter, setRatingFilter] = useState<string>('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [deleting, setDeleting] = useState(false);


    // Diálogo de usuario
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await listReviews();
                if (!mounted) return;
                setReviews(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                toast.error('No se pudieron cargar las reseñas');
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        let out = reviews;

        if (filterType !== 'all') {
            out = out.filter(r => r.type === filterType);
        }

        if (dateFrom) {
            const from = new Date(`${dateFrom}T00:00:00`);
            out = out.filter(r => {
                const d = new Date(String(r.date_review));
                return !isNaN(d.getTime()) && d >= from;
            });
        }

        if (dateTo) {
            const to = new Date(`${dateTo}T23:59:59.999`);
            out = out.filter(r => {
                const d = new Date(String(r.date_review));
                return !isNaN(d.getTime()) && d <= to;
            });
        }

        if (ratingFilter) {
            out = out.filter(r => r.rating === Number(ratingFilter));
        }

        return out;
    }, [reviews, filterType, dateFrom, dateTo, ratingFilter]);

    const typeToBadge = (t: Review['type']) =>
        t === 'Vehicle'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-amber-100 text-amber-800';

    const typeToLabelEs = (t: Review['type']) =>
        t === 'Vehicle' ? 'Vehículo' : 'Viaje';

    const formatDate = (d: Review['date_review']) => {
        const date = new Date(String(d));
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-CR');
    };

    // Cargar datos del usuario: por id_reservation => reservation => id_document => user
    const handleViewUser = async (review: Review) => {
        setUserInfo(null);
        setUserLoading(true);
        setUserDialogOpen(true);
        try {
            // 1) obtener la reservación para conocer el id_document
            const reservation = await getReservationsById(review.id_reservation);
            const idDoc: string | undefined = reservation?.id_document;
            if (!idDoc) {
                toast.error('No se encontró el documento del usuario');
                setUserLoading(false);
                return;
            }

            // 2) obtener el usuario por id_document
            const user = await UserService.GetById(String(idDoc));
            setUserInfo(user);
        } catch (e) {
            console.error(e);
            toast.error('No se pudo cargar la información del usuario');
        } finally {
            setUserLoading(false);
        }
    };

    const openDelete = (r: Review) => {
        setReviewToDelete(r);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        try {
            setDeleting(true);
            await deleteReview(reviewToDelete.id_review);
            setReviews((prev) => prev.filter((x) => x.id_review !== reviewToDelete.id_review));
            toast.success('Reseña eliminada');
            setIsDeleteDialogOpen(false);
            setReviewToDelete(null);
        } catch (e) {
            console.error(e);
            toast.error('No se pudo eliminar la reseña');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl mb-2">Reseñas</h1>
                    <p className="text-gray-600">Listado de reseñas registradas</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="w-56">
                        <Label className="text-sm text-gray-600 mb-1 block">Tipo de reseña</Label>
                        <Select value={filterType} onValueChange={(v: FilterType) => setFilterType(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="Vehicle">Vehículos</SelectItem>
                                <SelectItem value="Trip">Viajes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 items-end">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Desde</label>
                            <Input
                                type="date"
                                value={dateFrom}
                                max={today}
                                onChange={(e) => {
                                    let v = e.target.value || '';
                                    if (v && v > today) v = today;
                                    if (dateTo && v && dateTo < v) setDateTo(v);
                                    setDateFrom(v);
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Hasta</label>
                            <Input
                                type="date"
                                value={dateTo}
                                min={dateFrom || undefined}
                                max={today}
                                onChange={(e) => {
                                    let v = e.target.value || '';
                                    if (v && v > today) v = today;
                                    if (dateFrom && v && v < dateFrom) setDateFrom(v);
                                    setDateTo(v);
                                }}
                            />
                        </div>
                        <div className="w-40">
                            <label className="text-sm text-gray-600 mb-1 block">Calificación</label>
                            <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v)}>
                                <SelectTrigger className="data-[placeholder]:text-gray-400 text-gray-800">
                                    <SelectValue placeholder="Filtrar por calificación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5">5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilterType('all');
                                setDateFrom('');
                                setDateTo('');
                                setRatingFilter('');
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader />
                <CardContent>
                    {loading ? (
                        <div className="py-10 text-center text-gray-500">Cargando reseñas...</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">No hay reseñas</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Calificación</TableHead>
                                        <TableHead>Comentario</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Reserva</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((r) => (
                                        <TableRow key={r.id_review}>
                                            <TableCell>{r.id_review}</TableCell>
                                            <TableCell>
                                                <Badge className={typeToBadge(r.type)}>{typeToLabelEs(r.type)}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono">{r.rating}</span>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate" title={r.comment}>
                                                {r.comment}
                                            </TableCell>
                                            <TableCell>{formatDate(r.date_review)}</TableCell>
                                            <TableCell>{r.id_reservation}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <div className="flex justify-end gap-2 flex-wrap">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewUser(r)}>
                                                        Ver usuario
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => openDelete(r)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Información del usuario</DialogTitle>
                        <DialogDescription>
                            Detalles del usuario que realizó la reseña
                        </DialogDescription>
                    </DialogHeader>

                    {userLoading ? (
                        <div className="py-8 text-center text-gray-500">Cargando...</div>
                    ) : userInfo ? (
                        <div className="space-y-2">
                            <div><span className="text-gray-500">Nombre:</span> {userInfo.name}</div>
                            <div><span className="text-gray-500">Correo:</span> {userInfo.email}</div>
                            <div><span className="text-gray-500">Documento:</span> {userInfo.id_document}</div>
                            <div><span className="text-gray-500">Nacionalidad:</span> {userInfo.nationality}</div>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-500">No se pudo cargar el usuario.</div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar reseña</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. ¿Deseas eliminar la reseña {reviewToDelete?.id_review}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}