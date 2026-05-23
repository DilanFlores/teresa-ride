import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Users, Bell, MapPin, Car, LogOut, Menu, X, Star } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { NotificationManagement } from './NotificationManagement';
import { TripManagement } from './TripManagement';
import { VehicleManagement } from './VehicleManagement';
import { LanguageSwitch } from '../Language/LanguageSwitch';
import logoUrl from '../../assets/favicon.png';
import { ReviewManagement } from './ReviewManagement';

interface AdminDashboardProps {
  name: string;
  onLogout: () => void;
}

type AdminView = 'users' | 'notifications' | 'trips' | 'vehicles' | 'reviews';

export function AdminDashboard({ name, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
              <div>
                <span className="text-xl bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                  Panel de Administrador
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2">
              <Button
                variant={currentView === 'users' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('users')}
                className={currentView === 'users' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </Button>
              <Button
                variant={currentView === 'notifications' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('notifications')}
                className={currentView === 'notifications' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
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
                variant={currentView === 'vehicles' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('vehicles')}
                className={currentView === 'vehicles' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <Car className="w-4 h-4 mr-2" />
                Vehículos
              </Button>
              <Button
                variant={currentView === 'reviews' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('reviews')}
                className={currentView === 'reviews' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}
              >
                <Star className="w-4 h-4 mr-2" />
                Reseñas
              </Button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-sm">{name}</p>
              </div>
              <LanguageSwitch />
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
                variant={currentView === 'users' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('users');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'users' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </Button>
              <Button
                variant={currentView === 'notifications' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('notifications');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'notifications' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
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
                variant={currentView === 'reviews' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentView('reviews');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${currentView === 'reviews' ? 'bg-gradient-to-r from-teal-500 to-cyan-600' : ''}`}
              >
                <Star className="w-4 h-4 mr-2" />
                Reseñas
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
        {currentView === 'users' && <UserManagement />}
        {currentView === 'notifications' && <NotificationManagement />}
        {currentView === 'trips' && <TripManagement />}
        {currentView === 'vehicles' && <VehicleManagement />}
        {currentView === 'reviews' && <ReviewManagement />}
      </main>
    </div>
  );
}
