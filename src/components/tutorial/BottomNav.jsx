import { ArrowLeft, ArrowRight } from 'lucide-react';

const BottomNav = ({
  nextLabel = 'Siguiente',
  onNext,
  onPrev,
  isNextDisabled = false,
}) => {
  const handleNext = () => {
    if (isNextDisabled) return;
    if (onNext) {
      onNext();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-between items-center px-4 py-4 bg-[#f7f9fb] z-50 rounded-t-xl shadow-[0_-4px_12px_rgba(10,25,47,0.1)]">
      <button
        onClick={handlePrev}
        className="flex flex-col items-center justify-center text-[#515f78] px-6 py-2 hover:bg-[#6de0b3]/10 rounded-xl transition-all active:scale-98"
      >
        <ArrowLeft size={24} />
        <span className="text-[14px] leading-5 font-semibold">Anterior</span>
      </button>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`flex flex-col items-center justify-center bg-[#2dbc8b] text-white rounded-xl px-8 py-2 shadow-lg hover:brightness-110 transition-all active:scale-98 ${
          isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] leading-5 font-semibold">{nextLabel}</span>
          <ArrowRight size={24} />
        </div>
      </button>
    </nav>
  );
};

export default BottomNav;
