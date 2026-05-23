import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSwitch } from '../components/Language/LanguageSwitch';
import { login, registerUser } from '../services/authService';
import { User } from '../types/User';
import logoUrl from '../assets/favicon.png';
interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToHome?: () => void;
  onRegisterSuccess?: () => void;
}

const nationalities = [
  'Estados Unidos',
  'Canadá',
  'México',
  'Alemania',
  'Reino Unido',
  'Francia',
  'España',
  'Italia',
  'Costa Rica',
];

export function LoginPage({ onLoginSuccess, onBackToHome, onRegisterSuccess }: LoginPageProps) {
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerIdDocument, setRegisterIdDocument] = useState('');
  const [registerNationality, setRegisterNationality] = useState(nationalities[0]);

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validations
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.trim().length >= 6;
  const validateName = (name: string) => name.trim().length >= 3;
  const validateIdDocument = (id: string, nationality: string) => {
    if (nationality === 'Costa Rica') return /^\d{9,10}$/.test(id);
    return /^[a-zA-Z0-9]{4,20}$/.test(id);
  };

  // Login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!loginEmail.trim()) newErrors.loginEmail = 'El correo electrónico es requerido';
    else if (!validateEmail(loginEmail)) newErrors.loginEmail = 'Correo electrónico inválido';

    if (!loginPassword) newErrors.loginPassword = 'La contraseña es requerida';
    else if (!validatePassword(loginPassword)) newErrors.loginPassword = 'La contraseña debe tener al menos 6 caracteres y no debería contener espacios';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const user = await login(loginEmail, loginPassword);
      toast.success('¡Bienvenido de vuelta!');
      onLoginSuccess(user);
      const token = localStorage.getItem('token');
      localStorage.setItem('userId', user.id_document);
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  // Register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateName(registerName)) newErrors.registerName = 'Nombre debe tener al menos 3 caracteres';
    if (!validateEmail(registerEmail)) newErrors.registerEmail = 'Correo inválido';
    if (!validatePassword(registerPassword)) newErrors.registerPassword = 'Contraseña mínimo 6 caracteres y sin espacios';
    if (registerPassword !== registerConfirmPassword) newErrors.registerConfirmPassword = 'Las contraseñas no coinciden';
    if (!validateIdDocument(registerIdDocument, registerNationality)) newErrors.registerIdDocument = 'Documento inválido según la nacionalidad';
    if (!registerNationality) newErrors.registerNationality = 'Nacionalidad requerida';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const newUser = await registerUser({
        id_document: registerIdDocument,
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        nationality: registerNationality,
        role: 'user'
      });
      toast.success('¡Cuenta creada exitosamente!');
      onRegisterSuccess?.();
    } catch (error: any) {
      toast.error('Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center p-4">
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-4 left-4 text-white hover:text-gray-200 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio
        </button>
      )}

      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="text-white space-y-6 hidden md:block">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={logoUrl} alt="Teseride Ride Transport" className="w-64 h-auto" />
            <h1 className="text-4xl text-center">Teseride Ride Transport</h1>
          </div>
          <p className="text-xl opacity-90">
            Tu aventura comienza aquí. Explora destinos increíbles con nuestros servicios de transporte.
          </p>
        </div>

        {/* Right side */}
        <Card className="w-full shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4 md:hidden">
              <img src={"logo"} alt="Teseride Ride Transport" className="w-48 h-auto" />
            </div>
            <CardTitle className="text-center">Bienvenido a Teseride Ride</CardTitle>
            <CardDescription className="text-center">
              Inicia sesión o crea una cuenta para comenzar tu aventura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo Electrónico</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); if (errors.loginEmail) setErrors({ ...errors, loginEmail: '' }); }}
                      className={errors.loginEmail ? 'border-red-500' : ''}
                    />
                    {errors.loginEmail && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.loginEmail}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); if (errors.loginPassword) setErrors({ ...errors, loginPassword: '' }); }}
                      className={errors.loginPassword ? 'border-red-500' : ''}
                    />
                    {errors.loginPassword && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.loginPassword}</span>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                    Iniciar Sesión
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTER */}
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre Completo</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => { setRegisterName(e.target.value); if (errors.registerName) setErrors({ ...errors, registerName: '' }); }}
                      className={errors.registerName ? 'border-red-500' : ''}
                    />
                    {errors.registerName && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerName}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo Electrónico</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => { setRegisterEmail(e.target.value); if (errors.registerEmail) setErrors({ ...errors, registerEmail: '' }); }}
                      className={errors.registerEmail ? 'border-red-500' : ''}
                    />
                    {errors.registerEmail && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => { setRegisterPassword(e.target.value); if (errors.registerPassword) setErrors({ ...errors, registerPassword: '' }); }}
                      className={errors.registerPassword ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                    </button>
                    {errors.registerPassword && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2 relative">
                    <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerConfirmPassword}
                      onChange={(e) => { setRegisterConfirmPassword(e.target.value); if (errors.registerConfirmPassword) setErrors({ ...errors, registerConfirmPassword: '' }); }}
                      className={errors.registerConfirmPassword ? 'border-red-500' : ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                    </button>
                    {errors.registerConfirmPassword && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerConfirmPassword}</span>
                      </div>
                    )}
                  </div>

                  {/* Documento */}
                  <div className="space-y-2">
                    <Label htmlFor="register-id">Cédula / Pasaporte</Label>
                    <Input
                      id="register-id"
                      type="text"
                      placeholder="Documento"
                      value={registerIdDocument}
                      onChange={(e) => { setRegisterIdDocument(e.target.value); if (errors.registerIdDocument) setErrors({ ...errors, registerIdDocument: '' }); }}
                      className={errors.registerIdDocument ? 'border-red-500' : ''}
                    />
                    {errors.registerIdDocument && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerIdDocument}</span>
                      </div>
                    )}
                  </div>

                  {/* Nacionalidad */}
                  <div className="space-y-2">
                    <Label htmlFor="register-nationality">Nacionalidad</Label>
                    <select
                      id="register-nationality"
                      value={registerNationality}
                      onChange={(e) => setRegisterNationality(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300"
                    >
                      {nationalities.map((nat) => (
                        <option key={nat} value={nat}>{nat}</option>
                      ))}
                    </select>
                    {errors.registerNationality && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.registerNationality}</span>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700">
                    Crear Cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
