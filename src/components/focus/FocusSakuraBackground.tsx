import React, { useEffect, useRef } from 'react';
import { ZenSoundscapeType } from '../../lib/zenAudio';

export type FocusAmbientTheme = 'Kyoto Rainy' | 'Tokyo Neon' | 'Zen Garden';

export interface FocusSakuraBackgroundProps {
  isActive: boolean;
  soundscapeMode: ZenSoundscapeType;
  soundActive: boolean;
  themePreset?: FocusAmbientTheme;
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
  type?: 'petal' | 'neon_spark' | 'zen_leaf';
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const FocusSakuraBackground: React.FC<FocusSakuraBackgroundProps> = ({
  isActive,
  soundscapeMode,
  soundActive,
  themePreset = 'Kyoto Rainy',
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

    // Color palettes by ambient preset
    const kyotoRainyColors = [
      'rgba(224, 231, 255, 0.65)', // indigo-100
      'rgba(254, 205, 211, 0.55)', // soft rose
      'rgba(199, 210, 254, 0.50)', // indigo-200
      'rgba(147, 197, 253, 0.45)', // sky-300
    ];

    const tokyoNeonColors = [
      'rgba(34, 211, 238, 0.85)',  // neon cyan
      'rgba(244, 63, 94, 0.85)',   // neon pink
      'rgba(168, 85, 247, 0.80)',  // electric violet
      'rgba(251, 191, 36, 0.75)',  // amber gold
    ];

    const zenGardenColors = [
      'rgba(254, 205, 211, 0.70)', // sakura rose
      'rgba(253, 164, 175, 0.60)', // rose-300
      'rgba(251, 191, 36, 0.55)',  // warm bamboo amber
      'rgba(134, 239, 172, 0.50)', // matcha green leaf
    ];

    let currentPalette = kyotoRainyColors;
    if (themePreset === 'Tokyo Neon') currentPalette = tokyoNeonColors;
    else if (themePreset === 'Zen Garden') currentPalette = zenGardenColors;

    const petalCount = themePreset === 'Tokyo Neon' ? 50 : 42;
    const petals: Petal[] = [];
    const ripples: Ripple[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 5,
        speedY: Math.random() * 0.8 + 0.5,
        speedX: Math.random() * 0.6 - 0.3,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.35,
        color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
        swayRadius: Math.random() * 25 + 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
        type: themePreset === 'Tokyo Neon' && Math.random() > 0.6 ? 'neon_spark' : 'petal',
      });
    }

    let time = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      if (themePreset === 'Tokyo Neon') {
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
      }

      ctx.beginPath();
      ctx.fillStyle = p.color;

      if (p.type === 'neon_spark') {
        // High-tech hexagonal particle
        const r = p.size * 0.6;
        for (let a = 0; a < 6; a++) {
          const angle = (a * Math.PI) / 3;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Organic Japanese Sakura Petal
        ctx.ellipse(0, 0, p.size, p.size * 0.55, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Subtle petal midrib line
        ctx.beginPath();
        ctx.strokeStyle = themePreset === 'Tokyo Neon' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.moveTo(-p.size * 0.6, 0);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.stroke();
      }

      ctx.restore();
    };

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. THEME-SPECIFIC BACKGROUND ACCENTS
      if (themePreset === 'Kyoto Rainy') {
        // Subtle rainfall streaks
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.16)';
        ctx.lineWidth = 1;
        for (let r = 0; r < 35; r++) {
          const rx = ((r * 67 + time * 320) % (width + 50)) - 25;
          const ry = ((r * 131 + time * 540) % (height + 50)) - 25;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 22);
          ctx.stroke();

          // Occasional ground ripple
          if (Math.random() < 0.015 && ripples.length < 15) {
            ripples.push({
              x: rx,
              y: height - Math.random() * 40,
              radius: 1,
              maxRadius: 14 + Math.random() * 8,
              opacity: 0.35,
            });
          }
        }

        // Render water ripple rings
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.radius += 0.4;
          rip.opacity -= 0.01;
          if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.strokeStyle = `rgba(186, 230, 253, ${rip.opacity})`;
          ctx.lineWidth = 0.8;
          ctx.ellipse(rip.x, rip.y, rip.radius, rip.radius * 0.35, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (themePreset === 'Tokyo Neon') {
        // Cyber beam pulses across screen
        const beamY = ((time * 60) % (height + 200)) - 100;
        const grad = ctx.createLinearGradient(0, beamY, width, beamY);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
        grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.03)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, beamY - 40, width, 80);
      } else if (themePreset === 'Zen Garden') {
        // Meditative gentle circular wind current
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const zenRadius = 180 + Math.sin(time * 0.5) * 30;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.04)';
        ctx.lineWidth = 2;
        ctx.ellipse(centerX, centerY, zenRadius, zenRadius * 0.6, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. PETAL PARTICLES SIMULATION
      const windMultiplier = soundActive && soundscapeMode === 'wind' ? 2.2 : 1.0;
      const rainMultiplier = soundActive && soundscapeMode === 'rain' ? 1.4 : 1.0;

      for (const p of petals) {
        // Swaying and wind physics
        const sway = Math.sin(time * p.swaySpeed * 60 + p.swayOffset) * p.swayRadius * 0.05;
        let driftX = p.speedX + sway + (windMultiplier > 1 ? 0.8 : 0.2);
        let driftY = p.speedY * rainMultiplier;

        // Theme-specific kinetic drift
        if (themePreset === 'Zen Garden') {
          // Zen circular orbital drift component
          const dx = p.x - width * 0.5;
          const dy = p.y - height * 0.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            driftX += (-dy / dist) * 0.35;
            driftY += (dx / dist) * 0.2;
          }
        } else if (themePreset === 'Tokyo Neon') {
          driftX *= 1.2;
          driftY *= 0.9;
        }

        p.x += driftX * windMultiplier;
        p.y += driftY;
        p.angle += p.angularSpeed * (soundActive ? 1.3 : 1.0);

        // Boundary wrap
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) {
          p.x = -20;
        } else if (p.x < -25) {
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
  }, [isActive, soundscapeMode, soundActive, themePreset]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      id="nihomi-focus-sakura-canvas"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      style={{
        mixBlendMode: themePreset === 'Tokyo Neon' ? 'screen' : 'screen',
      }}
    />
  );
};
