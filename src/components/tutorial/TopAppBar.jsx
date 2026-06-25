import { ArrowLeft, X } from 'lucide-react';
import { APP_NAME, COLORS } from './tutorialConfig';

const TopAppBar = ({ onBack, onClose, title = APP_NAME, showBack = true }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb]/80 backdrop-blur-md h-16 flex justify-between items-center px-4 md:px-10 border-b border-[#f1f5f9]">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="text-[#006c4d]" size={24} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <div className="flex items-center gap-2">
          <img src="/kuentasklaras-logo.svg" alt={APP_NAME} className="w-7 h-7" />
          <h1 className="text-[28px] leading-9 font-bold text-[#0a192f] tracking-tight">{title}</h1>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-[#f1f5f9] rounded-full transition-colors active:scale-95"
      >
        <X className="text-[#515f78]" size={24} />
      </button>
    </header>
  );
};

export default TopAppBar;
