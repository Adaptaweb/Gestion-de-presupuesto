import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle, X } from 'lucide-react';

const BANCOS = [
  { id: 'banco-chile', nombre: 'Banco Chile', logo: '/bancos/banco-de-chile.png', fallback: '/chile-icons/bancos/banco_de_chile.png' },
  { id: 'bci', nombre: 'BCI', logo: '/chile-icons/bancos/bci.png' },
  { id: 'santander', nombre: 'Santander', logo: '/chile-icons/bancos/santander.png' },
  { id: 'scotiabank', nombre: 'Scotia', logo: '/chile-icons/bancos/scotiabank.png' },
  { id: 'itau', nombre: 'Itaú', logo: '/chile-icons/bancos/itau.png' },
  { id: 'mach', nombre: 'Mach', logo: '/chile-icons/medios-pago/mach.png' },
];

const Step4 = ({ onNext, onBack, onClose }) => {
  const [selectedBank, setSelectedBank] = useState(null);

  const handleSelect = (id) => {
    setSelectedBank(id);
  };

  return (
    <div className="bg-[#f7f9fb] h-full flex flex-col overflow-hidden relative">
      <header className="bg-[#f7f9fb] sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 flex-shrink-0">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f1f5f9] transition-all active:scale-95">
          <ArrowLeft className="text-[#006c4d]" size={24} />
        </button>
        <span className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">Kuentas Klaras</span>
        <button onClick={onClose} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f1f5f9] transition-all active:scale-95">
          <X className="text-[#006c4d]" size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto max-w-[1200px] mx-auto w-full px-4 md:px-10 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white">
              <Check size={18} />
            </div>
            <div className="w-12 h-[2px] bg-[#2dbc8b]"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white">
              <Check size={18} />
            </div>
            <div className="w-12 h-[2px] bg-[#2dbc8b]"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#2dbc8b] flex items-center justify-center text-white">
              <Check size={18} />
            </div>
            <div className="w-12 h-[2px] bg-[#2dbc8b]"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#2dbc8b] flex items-center justify-center font-bold text-[14px] leading-5 text-[#2dbc8b]">
              4
            </div>
          </div>
        </div>

        <div className="mb-6 bg-[#6de0b3]/10 border border-[#2dbc8b]/20 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle className="text-[#006c4d]" size={24} />
          <span className="text-[14px] leading-5 font-semibold text-[#006c4d]">¡LISTA LA REGLA DE REENVÍO!</span>
        </div>

        <div className="text-center mb-8">
          <p className="text-[#006c4d] font-bold tracking-wider uppercase text-[12px] leading-4 font-medium mb-1">PARTE 3</p>
          <h1 className="text-[24px] leading-8 font-semibold text-[#0a192f] mb-4">Revisar configuración de notificaciones por email en tu banco</h1>
          <p className="text-[#515f78] text-[14px] leading-5 font-semibold">Elige Banco a configurar</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {BANCOS.map((banco) => {
            const isSelected = selectedBank === banco.id;
            return (
              <label key={banco.id} className="group relative cursor-pointer">
                <input
                  type="radio"
                  name="bank"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => handleSelect(banco.id)}
                />
                <div
                  className={`bg-white border rounded-xl p-4 flex flex-col items-center justify-between h-48 transition-all hover:border-[#2dbc8b] ${
                    isSelected
                      ? 'border-[#2dbc8b] shadow-[0_4px_12px_rgba(45,188,139,0.2)] -translate-y-0.5'
                      : 'border-[#bccac0]'
                  }`}
                >
                  <div className="flex-1 flex items-center justify-center w-full">
                    <img
                      className="max-h-20 w-auto object-contain"
                      src={banco.logo}
                      alt={banco.nombre}
                      onError={(e) => {
                        if (banco.fallback && e.target.src !== banco.fallback) {
                          e.target.src = banco.fallback;
                        }
                      }}
                    />
                  </div>
                  <div className="w-full flex items-center gap-2 mt-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#2dbc8b]' : 'border-[#bccac0] group-hover:border-[#2dbc8b]'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#2dbc8b]"></div>}
                    </div>
                    <span className={`text-[14px] leading-5 font-semibold ${
                      isSelected ? 'text-[#006c4d]' : 'text-[#515f78] group-hover:text-[#006c4d]'
                    }`}>{banco.nombre}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </main>

      <nav className="flex justify-between items-center px-4 py-4 bg-[#f7f9fb] shadow-[0_-4px_12px_rgba(10,25,47,0.1)] rounded-t-xl flex-shrink-0">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 hover:bg-[#6de0b3]/10 rounded-xl transition-all active:scale-95">
          <ArrowLeft size={24} className="mb-1" />
          <span className="text-[14px] leading-5 font-semibold">Anterior</span>
        </button>
        <button
          onClick={onNext}
          disabled={!selectedBank}
          className={`flex items-center justify-center rounded-xl px-12 py-3 shadow-lg transition-all ${
            selectedBank
              ? 'bg-[#2dbc8b] text-white hover:shadow-[#2dbc8b]/20 active:scale-95'
              : 'bg-[#e0e3e5] text-[#515f78] opacity-50 cursor-not-allowed'
          }`}
        >
          <span className="text-[14px] leading-5 font-semibold mr-2">Siguiente</span>
          <ArrowRight size={24} />
        </button>
      </nav>

      <div className="absolute top-20 right-[-5%] w-64 h-64 bg-[#6de0b3] opacity-5 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-20 left-[-5%] w-80 h-80 bg-[#006c4d] opacity-5 blur-[140px] pointer-events-none rounded-full"></div>
    </div>
  );
};

export default Step4;
