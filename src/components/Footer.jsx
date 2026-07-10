import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/KKiso.svg" alt="Kuentas Klaras" className="h-6 w-auto" />
            <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
              © {new Date().getFullYear()} Kuentas Klaras. Todos los derechos reservados.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/terminos"
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-kk-primary dark:hover:text-kk-secondary font-medium transition-colors"
            >
              <FileText size={14} />
              Términos y Condiciones
            </Link>
            <Link
              to="/privacidad"
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-kk-primary dark:hover:text-kk-secondary font-medium transition-colors"
            >
              <Shield size={14} />
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
