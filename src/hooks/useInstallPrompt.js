import { useState, useEffect, useCallback } from 'react';

// El navegador dispara beforeinstallprompt una sola vez, apenas carga la pagina.
// Se guarda a nivel de modulo para que cualquier componente montado despues
// (la landing es lazy) pueda ofrecer "Instalar" con el mismo evento.
let promptGuardado = null;
const suscriptores = new Set();
const avisar = () => suscriptores.forEach(fn => fn());

if (typeof window !== 'undefined') {
  // Capturado por el script de index.html si llego antes que este modulo.
  promptGuardado = window.__kkPrompt || null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    promptGuardado = e;
    window.__kkPrompt = e;
    avisar();
  });
  window.addEventListener('appinstalled', () => {
    promptGuardado = null;
    window.__kkPrompt = null;
    avisar();
  });
}

const enModoApp = () => typeof window !== 'undefined' && (
  window.matchMedia('(display-mode: standalone)').matches
  || window.navigator.standalone
  || document.referrer.includes('android-app://')
);

export function useInstallPrompt() {
  const [hayPrompt, setHayPrompt] = useState(() => !!promptGuardado);
  const [isInstalled, setIsInstalled] = useState(enModoApp);
  const [descartado, setDescartado] = useState(false);

  useEffect(() => {
    const sync = () => setHayPrompt(!!promptGuardado);
    suscriptores.add(sync);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const onChange = (e) => { if (e.matches) setIsInstalled(true); };
    mediaQuery.addEventListener('change', onChange);

    return () => {
      suscriptores.delete(sync);
      mediaQuery.removeEventListener('change', onChange);
    };
  }, []);

  const install = useCallback(async () => {
    const e = promptGuardado;
    if (!e) return false;
    // prompt() solo se puede llamar una vez por evento.
    promptGuardado = null;
    window.__kkPrompt = null;
    avisar();
    e.prompt();
    const result = await e.userChoice;
    if (result.outcome === 'accepted') setIsInstalled(true);
    return result.outcome === 'accepted';
  }, []);

  const dismissInstall = useCallback(() => setDescartado(true), []);

  return { isInstallable: hayPrompt && !isInstalled && !descartado, isInstalled, install, dismissInstall };
}
