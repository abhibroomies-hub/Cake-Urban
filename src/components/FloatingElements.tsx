import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export function FloatingElements() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let pr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pr;
      canvas.height = height * pr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(pr, pr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Light-weight particle list (No React state triggers!)
    const particles: Particle[] = [];
    const colors = ['#DFB15B', '#DE9088', '#FAD390', '#FFFDFB', '#E8DDD7'];

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // Prevent lag on touch drag/scroll on mobile dev

      const x = e.clientX;
      const y = e.clientY;
      const now = Date.now();

      // Only spawn particles if mouse moved at least 5px or 35ms has passed to avoid cluttering space
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 6 && now - lastTime < 35) return;
      
      lastX = x;
      lastY = y;
      lastTime = now;

      // Spawn 1-2 glowing sparkles
      const spawnCount = Math.random() > 0.6 ? 2 : 1;
      for (let i = 0; i < spawnCount; i++) {
        const size = Math.random() * 8 + 6;
        const speedMultiplier = Math.random() * 0.8 + 0.2;
        const angle = Math.random() * Math.PI * 2;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speedMultiplier,
          vy: Math.sin(angle) * speedMultiplier - 0.4, // slight upward drift
          size,
          maxSize: size,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          life: 1,
          maxLife: Math.random() * 30 + 35 // lifetime in frames
        });
      }
    };

    // Drawing a highly polished 4-pointed sparkle star shape (vector based)
    const drawSparkle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      
      // Add a glorious subtle glow effect using canvas context shadow metrics
      c.shadowBlur = size * 1.2;
      c.shadowColor = color;

      c.beginPath();
      // Draw 4-pointed luxury star curve
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    };

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Loop and render particles backwards so we can safely splice
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        
        // Quad ease-out opacity fade out
        const ratio = p.life / p.maxLife;
        p.opacity = ratio * ratio * ratio; // nice accelerated fade-out
        p.size = p.maxSize * ratio;

        drawSparkle(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      }

      animationId = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[120] overflow-hidden">
      {/* Background drifting luxury icons - replaced motion with hyper-fast hardware accelerated CSS keyframes */}
      <div className="absolute inset-0 opacity-[0.035] select-none">
        {[
          { icon: '❤️', top: '15%', left: '10%', delay: '0s', dur: '12s' },
          { icon: '⭐', top: '45%', left: '85%', delay: '2s', dur: '16s' },
          { icon: '✨', top: '75%', left: '8%', delay: '4s', dur: '14s' },
          { icon: '❤️', top: '25%', left: '80%', delay: '1s', dur: '15s' },
          { icon: '⭐', top: '85%', left: '70%', delay: '3s', dur: '18s' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="absolute transition-transform select-none pointer-events-none font-sans text-xl"
            style={{
              top: item.top,
              left: item.left,
              animation: `float-slow ${item.dur} ease-in-out ${item.delay} infinite alternate`
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* GPU Accelerated HTML5 Canvas for butter smooth sparkles trail */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Injecting CSS Keyframes into document to avoid heavy framer-motion loops or extra inline style blocks */}
      <style>{`
        @keyframes float-slow {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-40px) rotate(25deg);
          }
        }
      `}</style>
    </div>
  );
}
