import { useRef, useEffect } from 'react';

const PARTICLE_COUNT = 55;

function createParticle(canvasWidth, canvasHeight, randomY = true) {
  return {
    x: Math.random() * canvasWidth,
    y: randomY ? Math.random() * canvasHeight : canvasHeight + Math.random() * 40,
    radius: 0.3 + Math.random() * 1.0,       // 0.3–1.3px
    opacity: 0.1 + Math.random() * 0.5,       // 0.1–0.6
    speedY: 0.25 + Math.random() * 0.45,      // upward drift
    speedX: (Math.random() - 0.5) * 0.25,    // slight horizontal drift
  };
}

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();

    let particles = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height, true)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y + p.radius < 0) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height, true)
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0D0D0D]">

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      />

      {/* Radial vignette — subtle depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-28 max-w-screen-xl w-full mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-5 mb-14">
          <div className="w-10 h-px bg-white/30" />
          <span
            className="text-white/40 tracking-[0.18em] uppercase"
            style={{ fontSize: '11px', fontFamily: '"DM Sans", sans-serif' }}
          >
            Dallas, Texas
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white font-light leading-[0.92] tracking-[-0.03em] mb-10"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(56px, 8vw, 120px)',
          }}
        >
          We build<br />
          <span className="italic">businesses</span><br />
          that last.
        </h1>

        {/* Sub */}
        <p
          className="text-white/45 leading-relaxed mb-14 max-w-md"
          style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}
        >
          Partner Equity is a holding company that scales high-potential
          businesses through capital, operational expertise, and strategic
          networks.
        </p>

        {/* CTA */}
        <a
          href="#cta"
          className="group relative inline-flex items-center overflow-hidden border border-white/20 text-white/80 uppercase tracking-[0.14em] cursor-pointer select-none"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            padding: '20px 52px',
          }}
        >
          {/* fill on hover */}
          <span
            className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[600ms]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
          />
          <span className="relative z-10 group-hover:text-[#0D0D0D] transition-colors duration-[600ms]">
            Get in touch
          </span>
        </a>

      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div
          className="w-px bg-white/20 animate-[grow_2s_ease-in-out_infinite]"
          style={{ height: '40px' }}
        />
      </div>

      <style>{`
        @keyframes grow {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
