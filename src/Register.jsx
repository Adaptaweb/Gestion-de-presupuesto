import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import Footer from './components/Footer';

const Register = ({ onRegister, onGoToLogin,isDarkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
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

  return (
    <div className="min-h-screen bg-kk-background dark:bg-dark-darker flex flex-col font-sans transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center p-4">
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

              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1.5 block">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                    placeholder="Tu nombre"
                  />
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-kk-light/50 dark:bg-dark-lighter border-2 border-slate-100 dark:border-dark-lightest rounded-xl px-4 py-3 pl-11 font-bold outline-none focus:border-kk-primary transition-all dark:text-slate-200"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
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
      <Footer />
    </div>
  );
};

export default Register;

