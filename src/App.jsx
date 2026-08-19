import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePushNotifications } from './hooks/usePushNotifications.js';
import { useInstallPrompt } from './hooks/useInstallPrompt.js';

// Cada ruta viaja en su propio paquete. Antes todo, incluido el panel de
// administracion y el tablero de 2.958 lineas, iba en el mismo archivo que
// descargaba cualquier visitante de la portada.
const Landing = lazy(() => import('./landing/Landing.jsx'));
const Login = lazy(() => import('./Login.jsx'));
const Register = lazy(() => import('./Register.jsx'));
const AdminPanel = lazy(() => import('./AdminPanel.jsx'));
const Dashboard = lazy(() => import('./Dashboard.jsx'));
const TutorialFlow = lazy(() => import('./components/TutorialFlow.jsx'));
const TerminosCondiciones = lazy(() => import('./components/TerminosCondiciones.jsx'));
const PoliticaPrivacidad = lazy(() => import('./components/PoliticaPrivacidad.jsx'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-kk-background dark:bg-dark-darker flex items-center justify-center font-sans transition-colors duration-300">
    <Loader2 className="animate-spin text-kk-primary" size={40} />
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const push = usePushNotifications(token);
  const install = useInstallPrompt();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialHasMailbox, setTutorialHasMailbox] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored !== null) {
      setIsDarkMode(stored === 'dark');
    }
  }, [location.pathname]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Invalid token');
        })
        .then(data => {
          setUser(data.user);
          setToken(storedToken);
          setAuthReady(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthReady(true);
        });
    } else {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (authReady) {
      const el = document.getElementById('splash');
      if (el) {
        if (user && dashboardReady) {
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 500);
        } else if (!user) {
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 500);
        }
      }
    }
  }, [authReady, user, dashboardReady]);

  useEffect(() => {
    if (authReady && user) {
      const publicPaths = ['/', '/login', '/register'];
      if (publicPaths.includes(window.location.pathname)) {
        navigate('/app', { replace: true });
      }
    }
  }, [user, authReady]);

  const [googleClientId, setGoogleClientId] = useState(null);

  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(data => setGoogleClientId(data.googleClientId))
      .catch(() => {});
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setDashboardReady(false);
    navigate('/login', { replace: true });
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
      <Route path="/" element={
        !authReady ? null :
        user ? <Navigate to="/app" replace /> :
        <Landing onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
      } />
      <Route path="/login" element={
        user ? <Navigate to="/app" replace /> : <Login onLogin={handleLogin} onGoToRegister={() => navigate('/register')} isDarkMode={isDarkMode} googleClientId={googleClientId} />
      } />
      <Route path="/register" element={
        user ? <Navigate to="/app" replace /> : <Register onRegister={handleLogin} onGoToLogin={() => navigate('/login')} isDarkMode={isDarkMode} googleClientId={googleClientId} />
      } />
      <Route path="/terminos" element={<TerminosCondiciones />} />
      <Route path="/privacidad" element={<PoliticaPrivacidad />} />
      <Route path="/admin" element={
        !authReady ? <LoadingSpinner /> :
        user ? <AdminPanel token={token} onBack={() => navigate('/app')} /> : <Navigate to="/login" replace />
      } />
      <Route path="/app" element={
        !authReady ? <LoadingSpinner /> :
        user ? (
          <>
            <Dashboard
              user={user}
              token={token}
              onLogout={handleLogout}
              onOpenAdmin={() => navigate('/admin')}
              onOpenTutorial={(hasMailbox) => { setTutorialHasMailbox(hasMailbox ?? false); setShowTutorial(true); }}
              isPushSubscribed={push.isSubscribed}
              isPushLoading={push.loading}
              onToggleNotifications={() => {
                if (push.isSubscribed) push.unsubscribe();
                else push.subscribe();
              }}
              isInstallable={install.isInstallable}
              onInstall={install.install}
              onDashboardReady={() => setDashboardReady(true)}
            />
            {showTutorial && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-[#f7f9fb] rounded-2xl w-full max-w-5xl mx-4 h-[90vh] max-h-[900px] shadow-2xl overflow-hidden">
                  <TutorialFlow user={user} onClose={() => setShowTutorial(false)} hasMailboxConfigured={tutorialHasMailbox} />
                </div>
              </div>
            )}
          </>
        ) : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
