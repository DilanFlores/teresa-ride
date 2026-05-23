import { useState, useEffect } from 'react';
import { User } from '../types/User';
import { Reservation } from '../types/Reservation';
import logoUrl from '../assets/favicon.png';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Car, MapPin, List, LogOut, Menu, X } from 'lucide-react';
import { VehicleCatalog } from '../components/vehicles/VehicleCatalog';
import { TripCatalog } from '../components/trips/TripCatalog';
import { MyReservations } from '../components/reservations/MyReservations';
import { LanguageSwitch } from '../components/Language/LanguageSwitch';
import { getReservationsWithoutReview } from "../services/ReviewService";
import { create as createReview } from "../services/ReviewService";
import { toast } from 'sonner';
import { Review } from '../types/Review';
import { UserProfile } from "../components/Profile/UserProfile";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  onUpdateReservation: (reservationId: string, updates: Partial<Reservation>) => void;
}

type View = 'vehicles' | 'trips' | 'reservations' | 'profile';

export function Dashboard({ user, onLogout, reservations, addReservation, onUpdateReservation }: DashboardProps) {

  const [currentView, setCurrentView] = useState<View>('vehicles');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    id_reservation: "" as number | string,
    comment: "",
    rating: 5,
    date_review: new Date().toISOString().slice(0, 10),
    type: 'Trip' as Review['type'],
  });
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id_document) return;
      try {
        const list = await getReservationsWithoutReview(user.id_document);
        if (cancelled) return;
        if (Array.isArray(list) && list.length > 0) {
          setPendingReviews(list);
          const first = list[0];
          setReviewForm((prev) => ({
            ...prev,
            id_reservation: first?.id_reservation ?? first?.id ?? "",
            type: (first?.type as Review['type']) ?? 'Trip',
          }));
          setPromptOpen(true);
        }
      } catch (e: any) {
        console.error("Verificación de reseñas pendientes falló:", e?.message ?? e);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id_document]);

  const handlePromptYes = () => {
    setPromptOpen(false);
    setFormOpen(true);
  };

  const handlePromptNo = () => {
    setPromptOpen(false);
    toast.message("Podrás dejar tu reseña más tarde desde Mis Reservaciones.");
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.id_reservation) return toast.error("No se encontró la reservación a reseñar");
    if (!reviewForm.comment.trim()) return toast.error("El comentario es requerido");
    if (reviewForm.rating < 1 || reviewForm.rating > 5) return toast.error("La calificación debe ser entre 1 y 5");

    try {
      await createReview({
        id_reservation: String(reviewForm.id_reservation),
        comment: reviewForm.comment.trim(),
        rating: reviewForm.rating,
        date_review: reviewForm.date_review,
        type: reviewForm.type ?? "",
      });
      toast.success("¡Gracias por tu reseña!");
      setFormOpen(false);

      const next = pendingReviews.slice(1);
      setPendingReviews(next);
      if (next.length > 0) {
        const first = next[0];
        setReviewForm({
          id_reservation: first?.id_reservation ?? first?.id ?? "",
          comment: "",
          rating: 5,
          date_review: new Date().toISOString().slice(0, 10),
          type: first?.type ?? "",
        });
        setPromptOpen(true);
      }
    } catch (e: any) {
      console.error(e);
      toast.error("No se pudo enviar la reseña");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Prompt: ¿Deseas reseñar? */}
      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Deseas dejar una reseña?</DialogTitle>
            <DialogDescription>
              Detectamos que realizaste una reservación ayer y aún no tiene reseña. ¿Te gustaría evaluarla?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handlePromptNo}>No ahora</Button>
            <Button onClick={handlePromptYes} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
              Sí, evaluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulario de Reseña */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Reseña</DialogTitle>
            <DialogDescription>Cuéntanos tu experiencia</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Calificación (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: Math.max(1, Math.min(5, Number(e.target.value || 0))) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">¿Qué tipo de servicio fue?</Label>
              <select
                id="type"
                className="w-full p-2 rounded border border-gray-300"
                value={reviewForm.type}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, type: e.target.value as Review['type'] })
                }
              >
                <option value="Vehicle">Vehículo</option>
                <option value="Trip">Viaje</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comentario</Label>
              <Textarea
                id="comment"
                rows={4}
                placeholder="Escribe tu experiencia..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmitReview} className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
              Enviar reseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-12 w-auto mb-4" />
              <span className="text-xl bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                TeresaRide
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2">
              <Button
                variant={currentView === 'vehicles' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('vehicles')}
                className={currentView === 'vehicles' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <Car className="w-4 h-4 mr-2" />
                Vehículos
              </Button>
              <Button
                variant={currentView === 'trips' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('trips')}
                className={currentView === 'trips' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Viajes
              </Button>
              <Button
                variant={currentView === 'reservations' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('reservations')}
                className={currentView === 'reservations' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <List className="w-4 h-4 mr-2" />
                Mis Reservaciones
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('profile')}
              >
                Perfil
              </Button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Bienvenido,</p>
                <p>{user.name}</p>
              </div>
              <Button variant="outline" onClick={onLogout} className="hidden md:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <Button
                variant={currentView === 'vehicles' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('vehicles');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'vehicles' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <Car className="w-4 h-4 mr-2" />
                Vehículos
              </Button>
              <Button
                variant={currentView === 'trips' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('trips');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'trips' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Viajes
              </Button>
              <Button
                variant={currentView === 'reservations' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('reservations');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'reservations' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <List className="w-4 h-4 mr-2" />
                Mis Reservaciones
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('profile');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'profile' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                Perfil
              </Button>
              <div className="flex justify-center pb-2">
                <LanguageSwitch />
              </div>
              <Button variant="outline" onClick={onLogout} className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'vehicles' && <VehicleCatalog user={user} addReservation={addReservation} />}
        {currentView === 'trips' && <TripCatalog user={user} addReservation={addReservation} />}
        {currentView === 'reservations' && (
          <MyReservations
            id_document={user.id_document}
          />
        )}
        {currentView === 'profile' && (
          <div className="max-w-2xl mx-auto py-8">
            <UserProfile />
          </div>
        )}
      </main>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <UserProfile />
        </DialogContent>
      </Dialog>
    </div>
  );
}
