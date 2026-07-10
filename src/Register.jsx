import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react';
import Footer from './components/Footer';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const Register = ({ onRegister, onGoToLogin, isDarkMode, googleClientId }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const googleBtnRef = useRef(null);
  const initializedRef = useRef(false);

  const handleGoogleCredential = async (credential) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrarse con Google');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onRegister(data.user);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId || initializedRef.current) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      initializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => handleGoogleCredential(response.credential),
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          shape: 'pill',
          theme: 'outline',
          text: 'continue_with',
          size: 'large',
          width: googleBtnRef.current.offsetWidth || 340,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }

    initGoogle();
  }, [googleClientId]);

  const evaluatePassword = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) score++;

    if (score < 2) return { score, label: 'Débil', color: 'bg-rose-500' };
    if (score < 4) return { score, label: 'Media', color: 'bg-amber-500' };
    return { score, label: 'Fuerte', color: 'bg-emerald-500' };
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    setPasswordStrength(evaluatePassword(pass));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y un caracter especial');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen bg-kk-background dark:bg-dark-darker flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-b from-kk-background dark:from-dark-darker via-white dark:via-dark-normal to-kk-light/30 dark:to-dark-darker">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
              <div className="bg-white dark:bg-dark-normal rounded-[2rem] shadow-kk-md shadow-[#2DBC8B]/10 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter p-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">¡Casi listo!</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                  Te hemos enviado un email de verificación a <strong className="text-kk-primary">{email}</strong>.
                  Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                <button
                  onClick={onGoToLogin}
                  className="w-full bg-kk-primary text-white py-4 rounded-2xl font-black shadow-kk-sm hover:bg-kk-dark transition-all"
                >
                  Ir a iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-kk-background dark:bg-dark-darker flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <section className="relative flex-1 flex items-center overflow-hidden bg-gradient-to-b from-kk-background dark:from-dark-darker via-white dark:via-dark-normal to-kk-light/30 dark:to-dark-darker">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kk-primary/5 dark:bg-kk-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-kk-secondary/10 dark:bg-kk-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-block mb-4">
                <img src={isDarkMode ? '/Logo-black.svg' : '/logo.svg'} alt="Kuentas Klaras" className="h-12 w-auto" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Crea tu cuenta gratuita</p>
            </div>

            <div className="bg-white dark:bg-dark-normal rounded-[2rem] shadow-kk-md shadow-[#2DBC8B]/10 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm font-bold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                        placeholder="Juan"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Apellido</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        required
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-slate-200 dark:bg-dark-lighter'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                      placeholder="Repite tu contraseña"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-kk-primary text-white py-4 rounded-2xl font-black shadow-kk-sm hover:bg-kk-dark transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear Cuenta'}
                </button>

                {googleClientId && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-dark-lighter"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-dark-normal px-3 text-slate-400 font-black uppercase">O regístrate con</span>
                      </div>
                    </div>
                    <div ref={googleBtnRef} className="flex justify-center w-full min-h-[40px]"></div>
                  </>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  ¿Ya tienes cuenta?{' '}
                  <button onClick={onGoToLogin} className="text-kk-primary dark:text-kk-secondary font-black hover:underline">
                    Inicia sesión
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Register;
