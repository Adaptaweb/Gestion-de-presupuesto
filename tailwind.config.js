/** @type {import('tailwindcss').Config} */
export default {
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // brand.md: Manrope para la interfaz, Poppins para marketing.
        sans: ['Manrope Variable', 'Manrope', 'system-ui', 'sans-serif'],
        manrope: ['Manrope Variable', 'Manrope', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        kk: {
          primary: '#2DBC8B',
          secondary: '#6DE0B3',
          dark: '#0E6B57',
          light: '#E9FBF3',
          background: '#F8FFFC',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        dark: {
          darker: '#0F0F0F',
          normal: '#1A1A1A',
          lighter: '#262626',
          lightest: '#333333',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'kk-sm': '10px',
        'kk-md': '12px',
        'kk-lg': '16px',
        'kk-xl': '20px',
        'kk-2xl': '1.75rem',
      },
      boxShadow: {
        'kk-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'kk-md': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        // Curva de entrada/salida "pesada" para tarjetas y listas premium —
        // misma curva que ya usaba la animacion slide-fade, promovida a
        // utilidad reusable para hover/press/entry en toda la app.
        fluid: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'slide-down': 'slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.35s ease-out',
        'scale-in': 'scaleIn 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-from-right': 'slideInRight 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-from-left': 'slideInLeft 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-from-bottom': 'slideInBottom 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        // Se usaba en seis sitios sin estar definida en ningun lado: las vistas
        // que la llevaban aparecian de golpe.
        'slide-fade': 'slideFade 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        // Cambio de pestaña: entra desde el lado del cambio. Solo `backwards`: al
        // terminar no deja transform, que atraparia los modales fixed de dentro.
        'tab-next': 'tabNext 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'tab-prev': 'tabPrev 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards',
        'nav-pop': 'navPop 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        // Entrada escalonada por fila (usar con style={{ animationDelay }}).
        'row-enter': 'rowEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        tabNext: {
          '0%': { opacity: '0', transform: 'translateX(28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        tabPrev: {
          '0%': { opacity: '0', transform: 'translateX(-28px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        navPop: {
          '0%': { transform: 'scale(0.7) translateY(2px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        rowEnter: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
