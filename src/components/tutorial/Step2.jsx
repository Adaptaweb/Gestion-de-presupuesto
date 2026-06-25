import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Info, X, CheckCircle } from 'lucide-react';

const BANK_EMAILS = "probando@kuanto.cl OR reply@info.bice.cl OR biceinforma@bancobice.cl OR bancobice@eeccvirtual.cl OR serviciodetransferencias@bancochile.cl OR enviodigital@bancochile.cl OR notificaciones@bancochile.cl OR avisos@bancochile.cl OR transferencias@bancochile.cl OR portalempresas@bancochile.cl OR confirmacion@bancochile.cl OR no-reply@bancochile.cl";

const Step2 = ({ onNext, onBack, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(BANK_EMAILS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] pb-32">
      <header className="flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50 bg-[#f7f9fb]">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-[#f1f5f9] transition-all active:scale-95">
            <ArrowLeft className="text-[#006c4d]" size={24} />
          </button>
          <h1 className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">Kuentas Klaras</h1>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-[#f1f5f9] transition-all active:scale-95">
          <X className="text-[#006c4d]" size={24} />
        </button>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-10 pt-24 space-y-8">
        <section className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center w-full max-w-md">
            <div className="flex-1 h-1.5 rounded-full bg-[#2dbc8b]"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2dbc8b] text-white text-[14px] leading-5 font-semibold mx-2">
              <Check size={16} />
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-[#2dbc8b]"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2dbc8b] text-white text-[14px] leading-5 font-semibold mx-2">2</div>
            <div className="flex-1 h-1.5 rounded-full bg-[#6de0b3]/30"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e6e8ea] text-[#515f78] text-[14px] leading-5 font-semibold mx-2">3</div>
            <div className="flex-1 h-1.5 rounded-full bg-[#6de0b3]/30"></div>
          </div>
          <p className="text-[#2dbc8b] text-[14px] leading-5 font-semibold tracking-wider">PASO 2 DE 4</p>
        </section>

        <section className="text-center space-y-2">
          <h2 className="text-[28px] leading-9 md:text-[32px] md:leading-10 font-bold text-[#0a192f]">
            PARTE 2: Crearemos un filtro para reenviar sólo emails bancarios
          </h2>
          <p className="text-[18px] leading-7 text-[#515f78] max-w-2xl mx-auto">
            Para que tus movimientos se registren automáticamente, configuraremos Gmail para que envíe copias de seguridad de tus correos bancarios a Kuanto.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] border border-[#2dbc8b]/10 hover:-translate-y-0.5 transition-all">
              <h3 className="text-[24px] leading-8 font-semibold text-[#0a192f] mb-4">1. Copiar Direcciones</h3>
              <p className="text-[16px] leading-6 text-[#515f78] mb-6">
                Este listado de correos de bancos permitirá que tus ingresos y gastos informados viajen en tiempo real. 🚀
              </p>
              <div className="relative group">
                <div className="bg-[#f1f5f9] p-4 rounded-lg font-mono text-sm text-[#3d4a43] break-all leading-relaxed h-48 overflow-y-auto border border-[#bccac0]">
                  {BANK_EMAILS}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#2dbc8b] text-white px-4 py-2 rounded-lg text-[14px] leading-5 font-semibold shadow-lg hover:scale-105 transition-transform active:scale-95"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-[#d2e0fe]/30 p-6 rounded-xl border border-[#d2e0fe] hover:-translate-y-0.5 transition-all">
              <div className="flex gap-4">
                <Info className="text-[#006c4d] flex-shrink-0 mt-1" size={24} />
                <div className="space-y-2">
                  <h4 className="text-[14px] leading-5 font-semibold text-[#0a192f]">¿Estás en tu celular?</h4>
                  <p className="text-[16px] leading-6 text-[#515f78]">
                    Envíalo por WhatsApp o Email a tu computador así lo copias y pegas fácilmente.
                  </p>
                  <a className="inline-flex items-center text-[#006c4d] text-[14px] leading-5 font-semibold hover:underline gap-1" href="#">
                    Enviar por WhatsApp <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a192f] text-white font-bold">2</span>
                <h3 className="text-[24px] leading-8 font-semibold text-[#0a192f]">Configuración en Gmail</h3>
              </div>
              <ul className="space-y-3 mb-6 text-[#3d4a43]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#2dbc8b] mt-1 flex-shrink-0" size={20} />
                  <span>Haz clic en el icono del menú <span className="bg-[#f1f5f9] px-1 rounded">⚙️</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#2dbc8b] mt-1 flex-shrink-0" size={20} />
                  <span>Clic en <strong>"Ver toda la Configuración/Ajustes"</strong></span>
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-[#f1f5f9]">
                <img className="w-full object-cover" src="/tutorial/2/screen.png" alt="Configuración Gmail" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a192f] text-white font-bold">3</span>
                <h3 className="text-[24px] leading-8 font-semibold text-[#0a192f]">Crear el Filtro</h3>
              </div>
              <ul className="space-y-3 mb-6 text-[#3d4a43]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#2dbc8b] mt-1 flex-shrink-0" size={20} />
                  <span>Ve a la pestaña <strong>"Filtros y direcciones bloqueadas"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-[#2dbc8b] mt-1 flex-shrink-0" size={20} />
                  <span>Selecciona <strong>"Crear un nuevo filtro"</strong> en la parte inferior</span>
                </li>
              </ul>
              <div className="rounded-lg overflow-hidden border border-[#f1f5f9]">
                <img className="w-full object-cover" src="/tutorial/2/screen2.png" alt="Crear filtro Gmail" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(10,25,47,0.05)] hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a192f] text-white font-bold">4</span>
                <h3 className="text-[24px] leading-8 font-semibold text-[#0a192f]">Pegar y Finalizar</h3>
              </div>
              <p className="text-[16px] leading-6 text-[#515f78] mb-4">
                Pega el texto copiado en el campo <strong>"De"</strong> y haz clic en <strong>"Crear filtro"</strong>.
              </p>
              <div className="rounded-lg overflow-hidden border border-[#f1f5f9]">
                <img className="w-full object-cover" src="/tutorial/2/screen3.png" alt="Pegar en filtro Gmail" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full flex justify-between items-center px-4 py-4 bg-[#f7f9fb] z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(10,25,47,0.1)]">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 hover:bg-[#6de0b3]/10 rounded-xl transition-all active:scale-[0.98]">
          <ArrowLeft size={24} />
          <span className="text-[14px] leading-5 font-semibold">Anterior</span>
        </button>
        <button onClick={onNext} className="flex flex-col items-center justify-center bg-[#2dbc8b] text-white rounded-xl px-6 py-2 shadow-lg hover:brightness-110 transition-all active:scale-[0.98]">
          <ArrowRight size={24} />
          <span className="text-[14px] leading-5 font-semibold">Siguiente</span>
        </button>
      </nav>
    </div>
  );
};

export default Step2;
