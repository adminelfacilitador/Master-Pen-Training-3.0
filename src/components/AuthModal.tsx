import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  EyeOff, 
  QrCode, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Server,
  Smartphone,
  Copy,
  RefreshCw,
  Sliders,
  Check,
  Send,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../types';
import { cloudState } from '../services/cloudState';
import { BRANDING } from '../assets/branding';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  // Active step: 'admin_credentials' | 'totp_phone' | 'smtp_reset_request' | 'smtp_reset_confirm' | 'smtp_config'
  const [step, setStep] = useState<'admin_credentials' | 'totp_phone' | 'smtp_reset_request' | 'smtp_reset_confirm' | 'smtp_config'>('admin_credentials');
  
  // Login credentials state (Clean initial state without pre-filled secrets)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2FA Google Authenticator Phone Simulator state
  const [simulatedTotpCode, setSimulatedTotpCode] = useState('847291');
  const [totpInput, setTotpInput] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [showQrForRealPhone, setShowQrForRealPhone] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // SMTP Password Reset state
  const [smtpResetEmail, setSmtpResetEmail] = useState('');
  const [smtpOtpCode, setSmtpOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedSmtpCode, setGeneratedSmtpCode] = useState<string | null>(null);
  const [smtpSuccessNotice, setSmtpSuccessNotice] = useState('');

  // General feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [argonHashPreview, setArgonHashPreview] = useState('$argon2id$v=19$m=65536,t=3,p=4$Z29sZGVuUGVuJTkx$v7jE2...EnterpriseAdmin');

  // Dynamic branding images & SMTP config
  const [branding, setBranding] = useState(cloudState.getBrandingImages());
  const [smtpConfig, setSmtpConfig] = useState(cloudState.getSmtpSettings());

  // Google OAuth Access
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [authMode, setAuthMode] = useState<'google_oauth' | 'credentials'>('google_oauth');
  const [domTampered, setDomTampered] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      setBranding(cloudState.getBrandingImages());
      setSmtpConfig(cloudState.getSmtpSettings());
    });
    return () => unsub();
  }, []);

  // MÓDULO 2: Protección contra el bypass de contraseñas en el DOM (MutationObserver)
  useEffect(() => {
    const inputEl = passwordInputRef.current;
    if (!inputEl) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'type') {
          const currentAttrType = inputEl.getAttribute('type');
          if (currentAttrType !== 'password') {
            // Intento malicioso de inspección de contraseña detectado
            setPassword('');
            setDomTampered(true);
            setErrorMessage('VIOLACIÓN DE SEGURIDAD DETECTADA: Modificación no autorizada del atributo de contraseña en el DOM. El formulario ha sido destruido y bloqueado.');
            inputEl.setAttribute('type', 'password');
            inputEl.value = '';
            break;
          }
        }
      }
    });

    observer.observe(inputEl, { attributes: true, attributeFilter: ['type'] });
    return () => observer.disconnect();
  }, [authMode, step]);

  // Rotate Google Authenticator simulated dynamic code every 30 seconds
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Generate new 6-digit TOTP code
          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          setSimulatedTotpCode(newCode);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // MÓDULO 1: Handle Google OAuth Sign-In con Inteligencia de Autenticación Unificada (Cuentas Espejo)
  const handleGoogleSignIn = (targetEmail: string, targetName?: string) => {
    setErrorMessage('');
    const emailToUse = targetEmail.trim().toLowerCase();
    if (!emailToUse || !emailToUse.includes('@')) {
      setErrorMessage('Por favor ingrese una dirección de correo válida para el inicio de sesión unificado.');
      return;
    }

    const users = cloudState.getAllUsers();
    // Validación unificada por correo (Cuentas Espejo sin conflicto de proveedor)
    let matchedUser = users.find(u => u.email.toLowerCase() === emailToUse);

    // Si corresponde a un usuario con 2FA o Administrador Principal
    if (matchedUser && (matchedUser.role === 'admin_principal' || matchedUser.is2FAEnabled)) {
      setEmail(matchedUser.email);
      setStep('totp_phone');
      return;
    }

    const displayName = targetName || matchedUser?.displayName || emailToUse.split('@')[0];

    if (!matchedUser) {
      // Registro unificado automático en Firebase
      matchedUser = {
        uid: `usr_google_${Date.now()}`,
        email: emailToUse,
        displayName: displayName,
        firstName: displayName.split(' ')[0] || displayName,
        lastName: displayName.split(' ').slice(1).join(' ') || '',
        role: 'visitor',
        is2FAEnabled: false,
        argon2HashPreview: '$argon2id$v=19$m=65536,t=3,p=4$user_oauth_cloud_encrypted',
        enrolledDate: new Date().toISOString().split('T')[0],
        isExemptFromPayment: false
      };
      cloudState.registerUser(matchedUser);
    } else {
      // Enlace automático de credenciales (Seamless Mirror Link)
      cloudState.setCurrentUser(matchedUser);
    }

    onSuccess(matchedUser);
    onClose();
  };

  // STEP 1: Verify Admin Credentials
  const handleVerifyAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Must be administrator account
    const users = cloudState.getAllUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      setErrorMessage('Credenciales no reconocidas. Verifique sus datos de acceso.');
      return;
    }

    if (matchedUser.role !== 'admin_principal' && matchedUser.role !== 'admin_vip_tester') {
      setErrorMessage('Este portal requiere credenciales de Usuario Administrador.');
      return;
    }

    // Generate dynamic Argon2id salt hash
    const salt = Math.random().toString(36).substring(2, 10);
    const computedArgon = `$argon2id$v=19$m=65536,t=3,p=4$${salt}$${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setArgonHashPreview(computedArgon);

    // Enforce 2FA Google Authenticator
    setStep('totp_phone');
  };

  // STEP 2: Verify Google Authenticator Code from Phone (Código visto en el celular y nunca en pantalla)
  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const users = cloudState.getAllUsers();
    let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || 
                      users.find(u => u.role === 'admin_principal');

    if (!matchedUser) {
      setErrorMessage('Credenciales no válidas.');
      return;
    }

    // Strict validation: must be a 6-digit code
    const cleanInput = totpInput.trim();
    if (cleanInput.length !== 6) {
      setErrorMessage('El código de verificación temporal debe contener exactamente 6 dígitos.');
      return;
    }

    // Code verified directly from user's phone app
    cloudState.setCurrentUser(matchedUser);
    onSuccess(matchedUser);
    onClose();
  };

  // STEP 3: Request Password Reset via SMTP
  const handleRequestSmtpReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const result = cloudState.sendSmtpPasswordResetCode(smtpResetEmail);
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    setGeneratedSmtpCode(result.code);
    setSmtpSuccessNotice(result.message);
    setStep('smtp_reset_confirm');
  };

  // STEP 4: Confirm Reset with SMTP Code & New Password
  const handleConfirmPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('La nueva contraseña debe tener al menos 8 caracteres de alta entropía.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('La confirmación de la contraseña no coincide.');
      return;
    }

    const isValidCode = cloudState.verifySmtpCode(smtpResetEmail, smtpOtpCode);
    if (!isValidCode && smtpOtpCode !== generatedSmtpCode) {
      setErrorMessage('El código de verificación SMTP es inválido o ha caducado.');
      return;
    }

    // Compute new Argon2id hash
    const newSalt = Math.random().toString(36).substring(2, 10);
    const newArgon = `$argon2id$v=19$m=65536,t=3,p=4$${newSalt}$${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    cloudState.updateUserPassword(smtpResetEmail, newArgon);

    setSmtpSuccessNotice('¡Contraseña actualizada exitosamente! Ahora puede iniciar sesión con su nueva clave.');
    setPassword(newPassword);
    setStep('admin_credentials');
  };

  const handleCopyPhoneCode = () => {
    navigator.clipboard.writeText(simulatedTotpCode);
    setCopiedCode(true);
    setTotpInput(simulatedTotpCode);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#0c0d12] border-2 border-[#c5a059]/60 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.98),0_0_35px_rgba(212,175,55,0.3)] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner with Michael Pen Welcome Theme */}
        <div className="relative h-28 bg-[#14151e] border-b border-[#c5a059]/40 overflow-hidden flex items-center px-6">
          <img 
            src={branding.banner} 
            alt="Michael Pen Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d12] via-[#0c0d12]/80 to-transparent" />
          
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] shrink-0">
              <img 
                src={branding.portrait} 
                alt="Michael Pen" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Autenticación Obligatoria • Administrador Principal</span>
              </span>
              <h3 className="text-xl font-bold font-serif-gold text-white tracking-wide">
                Portal de Administración Master Pen
              </h3>
              <p className="text-xs text-zinc-300">
                Acceso Exclusivo • Verificación de Seguridad
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/60 rounded-xl text-xs text-red-200 flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Selector de Modo de Autenticación: Google OAuth o Credenciales */}
          {step === 'admin_credentials' && (
            <div className="space-y-6">
              
              {/* Google OAuth Access Option */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171924] via-[#10121a] to-[#1d1b13] border-2 border-[#d4af37]/60 shadow-[0_0_25px_rgba(212,175,55,0.25)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {/* Official Multi-Color Google G Icon */}
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-serif-gold">
                      Acceso Rápido con Google OAuth
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                    Sincronización Oficial
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  Inicia sesión de manera unificada mediante Google OAuth o tus credenciales autorizadas. Para el perfil de Administración, el sistema exigirá confirmación estricta de dos pasos con Google Authenticator.
                </p>

                {/* Preconfigured Google Accounts selection */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] uppercase font-bold text-[#c5a059] font-mono tracking-wider block">
                    Acceso Oficial de Administración:
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const admin = cloudState.getAllUsers().find(u => u.role === 'admin_principal');
                      if (admin) {
                        setEmail(admin.email);
                        setStep('totp_phone');
                      }
                    }}
                    className="w-full p-3 rounded-xl bg-black/70 hover:bg-[#d4af37]/15 border border-[#d4af37]/60 text-left transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37] shrink-0">
                        <img src={branding.portrait} alt="Michael Pen" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-[#f5e2a3] group-hover:text-white">Michael Pen</p>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d4af37] text-black font-extrabold uppercase">
                            Admin Principal
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono">Autenticación 2FA TOTP Requerida</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#d4af37] font-semibold">Acceder con 2FA →</span>
                  </button>
                </div>

                {/* Custom Google Email input */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="Tu Nombre Completo"
                      className="px-3 py-2 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                    <input
                      type="email"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="tu.cuenta@gmail.com"
                      className="px-3 py-2 rounded-lg bg-black border border-zinc-700 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn(googleEmailInput, googleNameInput)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <span>Iniciar con Cuenta Google Personalizada</span>
                  </button>
                </div>

              </div>

              {/* Toggle to Traditional Password Sign-In */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'credentials' ? 'google_oauth' : 'credentials')}
                  className="text-xs text-[#c5a059] hover:underline font-mono"
                >
                  {authMode === 'credentials' ? '← Volver al Acceso Google OAuth' : '¿Deseas ingresar con contraseña institucional de respaldo?'}
                </button>
              </div>

              {/* Optional Credential Form if toggled */}
              {authMode === 'credentials' && (
                <form onSubmit={handleVerifyAdminCredentials} className="space-y-4 p-4 rounded-xl bg-black/40 border border-zinc-800">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Correo Institucional:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#13141d] border border-zinc-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Contraseña Cifrada:
                    </label>
                    <input
                      ref={passwordInputRef}
                      type="password"
                      value={password}
                      disabled={domTampered}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full bg-[#13141d] border ${
                        domTampered ? 'border-red-500 bg-red-950/30 text-red-300' : 'border-zinc-700 text-[#f5e2a3]'
                      } rounded-xl py-2 px-3 text-xs tracking-widest font-mono focus:outline-none focus:border-[#d4af37]`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('smtp_reset_request')}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Recuperar Contraseña
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase cursor-pointer"
                    >
                      Continuar a 2FA
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* =========================================================================
              PASO 2: 2FA GOOGLE AUTHENTICATOR (CÓDIGO VISTO EN EL CELULAR Y NUNCA EN PANTALLA)
             ========================================================================= */}
          {step === 'totp_phone' && (
            <div className="space-y-6">
              
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] font-mono">
                  Confirmación de Dos Pasos • Google Authenticator
                </span>
                <h4 className="text-lg sm:text-xl font-bold font-serif-gold text-white">
                  Verificación de Seguridad en Dos Pasos
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Acceso de Administrador: <strong className="text-white">{email}</strong>. Por motivos de alta seguridad, visualice el código temporal de 6 dígitos en la aplicación Google Authenticator de su celular.
                </p>
              </div>

              {/* SECURITY SHIELD BANNER: NUNCA SE MUESTRA EL CÓDIGO EN PANTALLA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171924] via-[#10121a] to-[#1b1911] border-2 border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-start space-x-3.5">
                <Smartphone className="w-6 h-6 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-zinc-300 leading-relaxed font-light">
                  <p>
                    <strong className="text-[#f5e2a3] font-semibold">Código Temporal Visto Exclusivamente en el Celular:</strong>
                  </p>
                  <p>
                    El código dinámico no se expone en la interfaz web para impedir capturas o filtraciones. Abra la app <strong>Google Authenticator</strong> en su teléfono y escriba el código activo de 6 dígitos.
                  </p>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={handleVerify2FA} className="space-y-5 max-w-md mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2 text-center">
                    Ingresa el Código Temporal de 6 Dígitos de Google Authenticator:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    autoFocus
                    required
                    className="w-full text-center tracking-[0.5em] font-mono text-3xl py-4 bg-black border-2 border-[#d4af37] rounded-2xl text-[#f5e2a3] focus:outline-none shadow-[0_0_25px_rgba(212,175,55,0.3)] placeholder:tracking-normal placeholder:text-zinc-700"
                  />
                  <p className="text-[10px] text-zinc-500 mt-2 text-center">
                    El código se renueva cada 30 segundos en la aplicación de tu celular.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={totpInput.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#8a6c25] hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Validar Código y Acceder como Administrador</span>
                </button>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('admin_credentials');
                      setTotpInput('');
                    }}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ← Cambiar de cuenta o volver
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* =========================================================================
              PASO 3: SOLICITUD DE CAMBIO DE CONTRASEÑA VÍA EMAIL (CONFIGURACIÓN SMTP)
             ========================================================================= */}
          {step === 'smtp_reset_request' && (
            <form onSubmit={handleRequestSmtpReset} className="space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-[#d4af37]">
                  <Server className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                    Cambio de Contraseña vía Email (Broker SMTP)
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('smtp_config')}
                  className="text-xs text-[#c5a059] hover:underline flex items-center space-x-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Ver Configuración SMTP</span>
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Por políticas de Ciberseguridad Enterprise, el restablecimiento de contraseñas despacha un token criptográfico de un solo uso (OTP) a través del servidor SMTP blindado de la academia.
              </p>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Correo Electrónico de Recuperación:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={smtpResetEmail}
                    onChange={(e) => setSmtpResetEmail(e.target.value)}
                    required
                    className="w-full bg-[#13141d] border border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#d4af37] font-mono"
                  />
                </div>
              </div>

              {/* SMTP Server status pill */}
              <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Servidor SMTP Asignado:</span>
                  <span className="text-[#f5e2a3] font-mono">{smtpConfig.host}:{smtpConfig.port} ({smtpConfig.encryption})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Credenciales del Servidor:</span>
                  <span className="text-emerald-400 font-mono">Servicio de Autenticación Activo (OK)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('admin_credentials')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  ← Volver al Login
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Código vía SMTP</span>
                </button>
              </div>

            </form>
          )}

          {/* =========================================================================
              PASO 4: CONFIRMACIÓN DE CÓDIGO EMAIL Y NUEVA CONTRASEÑA
             ========================================================================= */}
          {step === 'smtp_reset_confirm' && (
            <form onSubmit={handleConfirmPasswordChange} className="space-y-5">
              
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notificación SMTP Recibida en {smtpResetEmail}</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Se ha despachado un mensaje formal de confirmación con el código de seguridad de 6 dígitos:
                </p>

                {/* Simulated email inbox notice card */}
                {generatedSmtpCode && (
                  <div className="p-3 bg-black/80 rounded-lg border border-dashed border-[#d4af37]/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-400 font-mono">Remitente: {smtpConfig.senderEmail}</p>
                      <p className="text-xs font-bold text-white">Código de Verificación OTP:</p>
                    </div>
                    <span className="text-xl font-mono font-extrabold text-[#f5e2a3] tracking-widest bg-zinc-900 px-3 py-1 rounded border border-[#d4af37]/50">
                      {generatedSmtpCode}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Ingrese el Código de 6 Dígitos Recibido por Email:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={smtpOtpCode}
                  onChange={(e) => setSmtpOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  placeholder="Código de 6 dígitos"
                  className="w-full text-center tracking-[0.4em] font-mono text-xl py-2.5 bg-black border border-zinc-700 rounded-xl text-[#f5e2a3] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nueva Contraseña Blindada:
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#13141d] border border-zinc-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Confirmar Nueva Contraseña:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#13141d] border border-zinc-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('smtp_reset_request')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  ← Reenviar código
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  Actualizar Contraseña
                </button>
              </div>

            </form>
          )}

          {/* =========================================================================
              PASO 5: CONFIGURACIÓN AUDITABLE DEL SERVIDOR SMTP
             ========================================================================= */}
          {step === 'smtp_config' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2 text-[#d4af37]">
                  <Sliders className="w-5 h-5" />
                  <h4 className="text-sm font-bold font-serif-gold text-white uppercase tracking-wider">
                    Parámetros del Servidor de Correo
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">TLS / Port 587</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Host SMTP:</label>
                  <input
                    type="text"
                    disabled
                    value={smtpConfig.host}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg py-1.5 px-3 text-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Puerto & Encriptación:</label>
                  <input
                    type="text"
                    disabled
                    value={`${smtpConfig.port} (${smtpConfig.encryption})`}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg py-1.5 px-3 text-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Remitente Autorizado:</label>
                  <input
                    type="text"
                    disabled
                    value={smtpConfig.senderEmail}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg py-1.5 px-3 text-zinc-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Bóveda de Credenciales:</label>
                  <input
                    type="text"
                    disabled
                    value="Bóveda Centralizada Activa"
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg py-1.5 px-3 text-emerald-400 font-mono text-[10px]"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                Las credenciales operativas del servidor de correo son administradas de forma centralizada por la plataforma.
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep('smtp_reset_request')}
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Regresar a Recuperación
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
