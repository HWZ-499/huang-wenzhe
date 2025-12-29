import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

const DailyCheckIn: React.FC = () => {
  const { performDailyCheckIn, isCheckedInToday } = useApp();
  const [animating, setAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCheckedInToday) {
      setAnimating(false);
    }
  }, [isCheckedInToday]);

  const handleCheckIn = () => {
    if (isCheckedInToday) return;
    setAnimating(true);
    
    // Simulate animation time before committing state
    setTimeout(() => {
      performDailyCheckIn();
      setAnimating(false);
      setShowConfetti(true);
      
      // Clear confetti after animation ends
      setTimeout(() => setShowConfetti(false), 1000);
    }, 1200); // Slightly longer for the anticipation
  };

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 40 }).map((_, i) => {
    const angle = Math.random() * 360;
    const distance = 60 + Math.random() * 100;
    const tx = Math.cos(angle * (Math.PI / 180)) * distance;
    const ty = Math.sin(angle * (Math.PI / 180)) * distance;
    const r = Math.random() * 720 - 360;
    const color = ['#FFFFFF', '#FFD700', '#FF9500', '#FF3B30'][Math.floor(Math.random() * 4)];
    const size = 4 + Math.random() * 6;

    return { i, tx, ty, r, color, size };
  });

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-200/50 p-6 text-white mb-8 transition-transform duration-300 hover:scale-[1.01]">
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 text-center">
        {!isCheckedInToday ? (
          <>
            <h2 className="text-2xl font-bold tracking-tight">准备好迎接今天了吗？</h2>
            <p className="text-orange-100 max-w-xs">每天的一小步都会带来巨大的改变。现在记录你的进步吧。</p>
            
            <div className="relative mt-2">
                {/* Ripple Effect Backgrounds */}
                {animating && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ripple"></div>
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ripple" style={{ animationDelay: '0.4s' }}></div>
                  </>
                )}

                <button
                  onClick={handleCheckIn}
                  disabled={animating}
                  className={`relative z-20 flex items-center justify-center w-20 h-20 rounded-full bg-white text-orange-500 shadow-xl transition-all duration-500 ${
                    animating ? 'scale-90 shadow-inner bg-orange-50' : 'hover:scale-105 active:scale-95'
                  }`}
                >
                   {animating ? (
                      <div className="absolute inset-0 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                   ) : (
                     <div className="w-12 h-12 rounded-full border-4 border-orange-100 flex items-center justify-center group hover:bg-orange-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-500 group-hover:scale-110 transition-transform shadow-sm"></div>
                     </div>
                   )}
                </button>
            </div>
          </>
        ) : (
          <div className="py-4 animate-fade-in flex flex-col items-center relative">
             {/* Celebration Confetti */}
             {showConfetti && (
               <div className="absolute top-8 left-1/2 w-0 h-0">
                 {confettiPieces.map((p) => (
                   <div
                     key={p.i}
                     className="absolute rounded-full animate-confetti"
                     style={{
                       width: `${p.size}px`,
                       height: `${p.size}px`,
                       backgroundColor: p.color,
                       left: '-50%',
                       top: '-50%',
                       // Pass CSS variables for the keyframes to use
                       // @ts-ignore
                       '--tx': `${p.tx}px`,
                       '--ty': `${p.ty}px`,
                       '--r': `${p.r}deg`,
                     }}
                   />
                 ))}
               </div>
             )}

             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg animate-bounce-small">
                <Check className="w-8 h-8 text-orange-500" strokeWidth={4} />
             </div>
             <h2 className="text-3xl font-bold">太棒了！</h2>
             <p className="text-orange-100 mt-2">你今天已经打卡了。</p>
          </div>
        )}
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export default DailyCheckIn;