// Fuente unica del tema claro/oscuro. El script inline de index.html aplica lo
// mismo antes del primer pintado; estas funciones lo mantienen sincronizado
// cuando el usuario alterna, para que <html> nunca quede en un modo distinto al
// que muestra React.
export const THEME_BG = { light: '#F8FFFC', dark: '#0F0F0F' };

export function getInitialDarkMode() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyDarkMode(dark, { persist = false } = {}) {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
  root.style.backgroundColor = dark ? THEME_BG.dark : THEME_BG.light;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = dark ? THEME_BG.dark : THEME_BG.light;
    meta.removeAttribute('media');
  }

  if (persist) localStorage.setItem('theme', dark ? 'dark' : 'light');
}
