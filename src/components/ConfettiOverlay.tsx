import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, X } from 'lucide-react';

interface ConfettiOverlayProps {
  isActive: boolean;
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
  durationMs?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: 'rect' | 'circle' | 'ribbon';
  delay: number;
  duration: number;
}

const FESTIVAL_COLORS = [
  '#DC2626', // Crimson Red
  '#F59E0B', // Tokyo Gold
  '#10B981', // Emerald
  '#3B82F6', // Azure
  '#EC4899', // Sakura Pink
  '#8B5CF6', // Royal Purple
  '#FBBF24'  // Golden Yellow
];

export const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  isActive,
  onComplete,
  title = '🎉 Milestone Celebration!',
  subtitle = 'You hit a major Japanese learning achievement on Nihomi!',
  durationMs = 5000
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const newParticles: Particle[] = [];
    const count = 65;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: 6 + Math.random() * 8,
        color: FESTIVAL_COLORS[Math.floor(Math.random() * FESTIVAL_COLORS.length)],
        rotation: Math.random() * 360,
        shape: i % 3 === 0 ? 'ribbon' : i % 2 === 0 ? 'circle' : 'rect',
        delay: Math.random() * 0.8,
        duration: 2.5 + Math.random() * 2
      });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [isActive, durationMs, onComplete]);

  if (!visible) return null;

  return (
    <div
      id="nihomi-confetti-celebration-overlay"
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start pt-20 overflow-hidden"
    >
      {/* Particles Layer */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: p.shape === 'ribbon' ? `${p.size * 0.5}px` : `${p.size}px`,
            height: p.shape === 'ribbon' ? `${p.size * 2}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'ribbon' ? '2px' : '3px',
            transform: `rotate(${p.rotation}deg)`,
            animation: `fallAndSway ${p.duration}s linear ${p.delay}s forwards`,
            opacity: 0.95
          }}
        />
      ))}

      {/* Floating Milestone Achievement Banner */}
      <div className="pointer-events-auto bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white border-2 border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-2xl max-w-md mx-4 text-center space-y-3 animate-in zoom-in-95 slide-in-from-top-6 duration-300">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950">
            Achievement Unlocked
          </span>
          <button
            onClick={() => {
              setVisible(false);
              if (onComplete) onComplete();
            }}
            className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold font-serif text-white">{title}</h3>
          <p className="text-xs text-stone-300 mt-1">{subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+50 Bonus Milestone XP Added</span>
        </div>
      </div>

      <style>{`
        @keyframes fallAndSway {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(45vh) rotate(180deg) translateX(25px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
