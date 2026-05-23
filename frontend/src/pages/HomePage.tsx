import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Car, MapPin, Shield, Clock, Star, Mail, Phone, MapPinIcon, Menu, X, Users, Award, Headphones } from 'lucide-react';
import { LanguageSwitch } from '../components/Language/LanguageSwitch';
import { useLanguage } from '../contexts/LanguageContext';
import logoUrl from '../assets/favicon.png';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

export function HomePage({ onNavigateToLogin }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <img src={logoUrl} alt="Logo" className="h-12 w-auto mb-4" />
              <div className="hidden md:block">
                <h1 className="text-xl bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  TeresaRide
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('home')}
                className={`hover:text-teal-600 transition-colors ${activeSection === 'home' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.home')}
              </button>
              <button
                onClick={() => scrollToSection('quienes-somos')}
                className={`hover:text-teal-600 transition-colors ${activeSection === 'quienes-somos' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.whoWeAre')}
              </button>
              <button
                onClick={() => scrollToSection('servicios')}
                className={`hover:text-teal-600 transition-colors ${activeSection === 'servicios' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.services')}
              </button>
              <button
                onClick={() => scrollToSection('contactanos')}
                className={`hover:text-teal-600 transition-colors ${activeSection === 'contactanos' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.contactUs')}
              </button>
              <LanguageSwitch />
              <Button
                id="btn-login"
                onClick={onNavigateToLogin}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
              >
                {t('common.login')}
              </Button>
            </div>

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

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <button
                onClick={() => scrollToSection('home')}
                className={`block w-full text-left px-4 py-2 hover:bg-teal-50 rounded ${activeSection === 'home' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.home')}
              </button>
              <button
                onClick={() => scrollToSection('quienes-somos')}
                className={`block w-full text-left px-4 py-2 hover:bg-teal-50 rounded ${activeSection === 'quienes-somos' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.whoWeAre')}
              </button>
              <button
                onClick={() => scrollToSection('servicios')}
                className={`block w-full text-left px-4 py-2 hover:bg-teal-50 rounded ${activeSection === 'servicios' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.services')}
              </button>
              <button
                onClick={() => scrollToSection('contactanos')}
                className={`block w-full text-left px-4 py-2 hover:bg-teal-50 rounded ${activeSection === 'contactanos' ? 'text-teal-600' : 'text-gray-700'}`}
              >
                {t('home.contactUs')}
              </button>
              <div className="px-4 pt-2 space-y-2">
                <div className="flex justify-center">
                  <LanguageSwitch />
                </div>
                <Button id="btn-login"
                  onClick={onNavigateToLogin}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                >
                  {t('common.login')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl leading-tight">
                {t('home.heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onNavigateToLogin}
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8"
                >
                  {t('home.reserveNow')}
                </Button>
                <Button
                  onClick={() => scrollToSection('servicios')}
                  size="lg"
                  variant="outline"
                  className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8"
                >
                  {t('home.viewServices')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
              
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img src={logoUrl} alt="Logo" style={{ height: 400 }} className="w-auto mb-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Características Destacadas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg mb-2">{t('home.guaranteedSecurity')}</h3>
              <p className="text-gray-600 text-sm">{t('home.guaranteedSecurityDesc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg mb-2">{t('home.availability247')}</h3>
              <p className="text-gray-600 text-sm">{t('home.availability247Desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg mb-2">{t('home.continuousSupport')}</h3>
              <p className="text-gray-600 text-sm">{t('home.continuousSupportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                {t('home.aboutUs')}
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">{t('home.aboutUsDesc')}</p>
                <p>{t('home.aboutUsPara1')}</p>
                <p>{t('home.aboutUsPara2')}</p>
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('home.yearsExperience')}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('home.premiumVehicles')}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('home.certifiedDrivers')}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{t('home.satisfiedCustomers')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzZXJ2aWNlfGVufDF8fHx8MTc2MDA3MTIyNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="TeresaRide"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              {t('home.services')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.servicesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <CardTitle>{t('home.vehicleRental')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t('home.vehicleRentalDesc')}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.modernVehicles')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.competitivePrices')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.insuranceIncluded')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle>{t('home.customTours')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t('home.customToursDesc')}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.expertGuides')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.flexibleItineraries')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.allInclusive')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle>{t('home.groupTransport')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t('home.groupTransportDesc')}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.luxuryVansBuses')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.capacityUp50')}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                    {t('home.professionalCoordination')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={onNavigateToLogin}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-lg px-8"
            >
              {t('home.exploreServices')}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              {t('home.testimonials')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.testimonialsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                </p>
                <p></p>
                <p className="text-sm text-gray-500"></p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                </p>
                <p></p>
                <p className="text-sm text-gray-500"></p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                </p>
                <p></p>
                <p className="text-sm text-gray-500"></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contáctanos */}
      <section id="contactanos" className="py-20 bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{t('home.contact')}</h2>
            <p className="text-xl opacity-90">{t('home.contactDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-2">{t('home.phone')}</h3>
              <p className="opacity-90">+1 (555) 123-4567</p>
              <p className="opacity-90 text-sm">{t('home.phoneSchedule')}</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-2">{t('home.email')}</h3>
              <p className="opacity-90">info@bluejaytransport.com</p>
              <p className="opacity-90 text-sm">{t('home.emailResponse')}</p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl mb-2">{t('home.location')}</h3>
              <p className="opacity-90">123 {t('home.mainAvenue')}</p>
              <p className="opacity-90 text-sm">Ciudad Turística, CT 12345</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={onNavigateToLogin}
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8"
            >
              {t('home.reserveNow')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
              <span className="text-lg">TeresaRide</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 TeresaRide. {t('home.allRightsReserved')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
