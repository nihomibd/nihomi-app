import React, { useEffect, useRef } from 'react';
import { ZenSoundscapeType } from '../../lib/zenAudio';

interface FocusSakuraBackgroundProps {
  isActive: boolean;
  soundscapeMode: ZenSoundscapeType;
  soundActive: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  opacity: number;
  color: string;
  swayRadius: number;
  swaySpeed: number;
  swayOffset: number;
}

export const FocusSakuraBackground: React.FC<FocusSakuraBackgroundProps> = ({
  isActive,
  soundscapeMode,
  soundActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palette for delicate Japanese Sakura petals
    const petalColors = [
      'rgba(254, 205, 211, 0.65)', // rose-200
      'rgba(253, 164, 175, 0.55)', // rose-300
      'rgba(251, 113, 133, 0.45)', // rose-400
      'rgba(244, 63, 94, 0.35)',  // rose-500
      'rgba(255, 228, 230, 0.70)', // rose-100
    ];

    const petalCount = 42;
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 6,
        speedY: Math.random() * 0.8 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.35,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        swayRadius: Math.random() * 25 + 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(0, 0, p.size, p.size * 0.55, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Subtle petal midrib line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.moveTo(-p.size * 0.6, 0);
      ctx.lineTo(p.size * 0.6, 0);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // React to soundscape activity level
      const windMultiplier = soundActive && soundscapeMode === 'wind' ? 2.2 : 1.0;
      const rainMultiplier = soundActive && soundscapeMode === 'rain' ? 1.4 : 1.0;

      // Draw subtle rainfall if in rain soundscape
      if (soundActive && soundscapeMode === 'rain') {
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.12)';
        ctx.lineWidth = 1;
        for (let r = 0; r < 25; r++) {
          const rx = ((r * 73 + time * 240) % width);
          const ry = ((r * 117 + time * 450) % height);
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 16);
          ctx.stroke();
        }
      }

      // Draw and update petals
      for (const p of petals) {
        // Compute swaying and drift
        const sway = Math.sin(time * p.swaySpeed * 60 + p.swayOffset) * p.swayRadius * 0.05;
        p.x += (p.speedX + sway + (windMultiplier > 1 ? 0.8 : 0.2)) * windMultiplier;
        p.y += p.speedY * rainMultiplier;
        p.angle += p.angularSpeed * (soundActive ? 1.3 : 1.0);

        // Wrap around boundaries
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, soundscapeMode, soundActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
