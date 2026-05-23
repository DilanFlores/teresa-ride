import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './auth/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { User } from './types/User';
import { Reservation } from './types/Reservation';
import { Toaster, toast } from 'sonner';

type View = 'home' | 'login' | 'dashboard' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Callback cuando el login es exitoso
 const handleLoginSuccess = (loggedUser: User) => {
  const normalized: User = {
    ...loggedUser,
    id_document: String(loggedUser.id_document ?? "").trim(),
    role: (loggedUser.role ?? "user").toLowerCase() === "admin" ? "admin" : "user",
  };

  if (!normalized.id_document) {
    console.warn("id_document vacío tras login. Verifica respuesta del backend.");
  }

  setUser(normalized);
  setCurrentView(normalized.role === "admin" ? "admin" : "dashboard");
};

  const handleRegisterSuccess = () => {
    toast.success('Registro exitoso. Por favor, inicia sesión.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    console.log('Logout ejecutado. Usuario anterior:', user);
    setUser(null);
    setCurrentView('home');
  };

  const addReservation = (reservation: Reservation) => {
    const newReservation = { ...reservation, reviewStatus: 'pending' as const };
    setReservations([...reservations, newReservation]);

    setTimeout(() => {
      setReservations((prev) =>
        prev.map((r) =>
          r.license_plate === newReservation.id_document ? { ...r, status: 'completed' as const } : r
        )
      );
    }, 5000);
  };

  const updateReservation = (reservationId: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.date_reservacion=== reservationId ? { ...r, ...updates } : r))
    );
  };

  return (
    <LanguageProvider>
      <Toaster position="top-right" />

      {currentView === 'home' && (
        <HomePage onNavigateToLogin={() => setCurrentView('login')} />
      )}

      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setCurrentView('home')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

     {currentView === 'admin' && (
  <AdminDashboard name={user!.name.split(" ")[0]} onLogout={handleLogout} />
)}

{currentView === 'dashboard' && (
  <Dashboard
    user={user!}
    onLogout={handleLogout}
    reservations={reservations}
    addReservation={addReservation}
    onUpdateReservation={updateReservation}
  />
)}
    </LanguageProvider>
  );
}

export default App;
