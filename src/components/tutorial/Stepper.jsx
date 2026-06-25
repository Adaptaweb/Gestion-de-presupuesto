import React from 'react';
import { Check } from 'lucide-react';
import { TUTORIAL_CONFIG } from './tutorialConfig';

const Stepper = ({ current, total = TUTORIAL_CONFIG.TOTAL_STEPS }) => {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <section className="flex flex-col items-center justify-center space-y-4 mb-8 pt-24">
      <div className="flex items-center w-full max-w-md mx-auto">
        {steps.map((s, idx) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm mx-2 ${
                s < current
                  ? 'bg-[#2dbc8b] text-white'
                  : s === current
                  ? 'border-2 border-[#2dbc8b] text-[#2dbc8b]'
                  : 'bg-[#e0e3e5] text-[#515f78]'
              }`}
            >
              {s < current ? <Check size={16} /> : s}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1.5 rounded-full ${
                  s < current ? 'bg-[#2dbc8b]' : 'bg-[#6de0b3]/30'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-[#2dbc8b] font-semibold text-sm tracking-wider uppercase">
        PASO {current} DE {total}
      </p>
    </section>
  );
};

export default Stepper;
