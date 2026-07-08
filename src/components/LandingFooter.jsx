import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const NAV_LINKS = [
  { text: 'Inicio', url: '/' },
  { text: 'Términos', url: '/terminos' },
  { text: 'Privacidad', url: '/privacidad' },
];

const LandingFooter = () => {
  return (
    <footer className="relative z-1 w-full bg-black/40 backdrop-blur-xl border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] py-20">
      <div className="mx-auto w-full max-w-[1400px] px-6 2xl:max-w-[1600px] min-[2000px]:max-w-[2000px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
          <img
            src="/kuentasklaras-logo.svg"
            alt="Kuentas Klaras"
            className="h-10 md:h-9 w-auto grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>

        <div className="mt-8 border-t border-white/10" />

        <div className="mt-8 flex flex-col gap-10 md:flex-row md:gap-16 md:justify-between pb-8">
          <div className="flex flex-col gap-3 md:max-w-xs w-full">
            <p className="text-sm font-semibold text-white/80">
              Kuentas Klaras
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              Tus finanzas claras, bajo control. Organiza tus gastos de forma simple y eficiente.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 md:gap-x-20 self-start">
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.url}
                    className="text-sm font-bold uppercase tracking-wide text-white/40 hover:text-kk-primary transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Kuentas Klaras
          </p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/Adaptaweb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ '--brand': '#ffffff' }}
              className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
              />
              <svg className="size-5 sm:size-6 text-white transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/60 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                /adaptaweb
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/alejandro-tamayo-e/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ '--brand': '#0a66c2' }}
              className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
              />
              <svg className="size-5 sm:size-6 text-[#0a66c2] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/60 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                /Alejandro
              </span>
            </a>
            <a
              href="https://adaptaweb.cl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AdaptaWeb"
              style={{ '--brand': '#45FF8C' }}
              className="group relative flex min-h-11 items-center justify-center gap-2 px-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-10 -translate-y-1/2 rounded-full bg-[var(--brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
              />
              <Globe className="size-5 sm:size-6 text-kk-primary transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:[filter:drop-shadow(0_0_12px_var(--brand))]" />
              <span className="relative text-xs sm:text-sm font-semibold tracking-wider text-white/60 transition-colors duration-300 after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[var(--brand)] after:transition-all after:duration-300 group-hover:text-white group-hover:after:w-full hidden md:inline">
                /adaptaweb.cl
              </span>
            </a>
          </div>
          <p className="text-xs text-white/40 text-center sm:text-right">
            Kuentas Klaras
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
