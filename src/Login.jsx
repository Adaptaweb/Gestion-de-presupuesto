import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Footer from './components/Footer';

const Login = ({ onLogin, onGoToRegister, isDarkMode, googleClientId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
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
        setError(data.error || 'Error al autenticar con Google');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          setNeedsVerification(true);
          setVerificationEmail(data.email);
          setError('');
          return;
        }
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendMsg('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      });
      const data = await res.json();
      setResendMsg(data.message || 'Email de verificación reenviado');
    } catch (err) {
      setResendMsg('Error al reenviar verificación');
    } finally {
      setResending(false);
    }
  };

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
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Inicia sesión para continuar</p>
            </div>

            <div className="bg-white dark:bg-dark-normal rounded-[2rem] shadow-kk-md shadow-[#2DBC8B]/10 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter p-8">
              {needsVerification ? (
                <div className="space-y-5">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-xl text-sm font-bold">
                    Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.
                  </div>
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="w-full bg-kk-primary text-white py-4 rounded-2xl font-black shadow-kk-sm hover:bg-kk-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {resending ? <Loader2 className="animate-spin" size={20} /> : 'Reenviar email de verificación'}
                  </button>
                  {resendMsg && (
                    <p className="text-kk-primary text-sm font-bold text-center">{resendMsg}</p>
                  )}
                  <button
                    onClick={() => { setNeedsVerification(false); setError(''); }}
                    className="w-full bg-slate-100 dark:bg-dark-lighter text-slate-600 dark:text-slate-300 py-3 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-dark-lightest transition-all"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-xl text-sm font-bold">
                      {error}
                    </div>
                  )}

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
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-kk-primary text-white py-4 rounded-2xl font-black shadow-kk-sm hover:bg-kk-dark transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Iniciar Sesión'}
                  </button>

                  {googleClientId && (
                    <>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-dark-lighter"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white dark:bg-dark-normal px-3 text-slate-400 font-black uppercase">O continúa con</span>
                        </div>
                      </div>
                      <div ref={googleBtnRef} className="flex justify-center w-full min-h-[40px]"></div>
                    </>
                  )}
                </form>
              )}

              {!needsVerification && (
                <div className="mt-6 text-center">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    ¿No tienes cuenta?{' '}
                    <button onClick={onGoToRegister} className="text-kk-primary dark:text-kk-secondary font-black hover:underline">
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
