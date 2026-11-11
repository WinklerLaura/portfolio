import { useEffect, useRef } from "react";

interface Dot { x: number; y: number; r: number; a: number; ph: number; vx: number; vy: number }

/** Sparse light dots across the page; one of them flashes every few seconds. */
export function Stars({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;

    let w = 0, h = 0, raf = 0, nextFlash = 0;
    let dots: Dot[] = [];
    let flash: { d: Dot; start: number } | null = null;

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduce) {
          d.x += d.vx; d.y += d.vy;
          if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
          if (d.x < -4) d.x = w + 4;
          if (d.x > w + 4) d.x = -4;
        }
        const a = d.a * (reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.9 + d.ph));
        ctx.fillStyle = `rgba(215,230,255,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      if (reduce) return;
      if (!flash && now > nextFlash && dots.length) flash = { d: dots[Math.floor(Math.random() * dots.length)], start: now };
      if (flash) {
        const k = (now - flash.start) / 1400;
        if (k >= 1) { flash = null; nextFlash = now + 1800 + Math.random() * 2600; return; }
        const e = Math.sin(k * Math.PI), fx = flash.d.x, fy = flash.d.y, R = 4 + 16 * e;
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, R);
        g.addColorStop(0, `rgba(255,255,255,${(0.95 * e).toFixed(3)})`);
        g.addColorStop(0.3, `rgba(190,215,255,${(0.45 * e).toFixed(3)})`);
        g.addColorStop(1, "rgba(120,170,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, R, 0, 6.283); ctx.fill();
        ctx.strokeStyle = `rgba(220,235,255,${(0.5 * e).toFixed(3)})`; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx - R * 1.3, fy); ctx.lineTo(fx + R * 1.3, fy);
        ctx.moveTo(fx, fy - R * 1.3); ctx.lineTo(fx, fy + R * 1.3);
        ctx.stroke();
      }
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(45, Math.max(18, (w * h) / 42000)));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.1 + 0.35, a: Math.random() * 0.35 + 0.15, ph: Math.random() * 6.3,
        vy: -(Math.random() * 0.06 + 0.02), vx: (Math.random() - 0.5) * 0.04,
      }));
      draw(performance.now());
    };

    const loop = (now: number) => {
      if (!document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };

    size();
    window.addEventListener("resize", size);
    if (!reduce) { nextFlash = performance.now() + 1500; raf = requestAnimationFrame(loop); }
    return () => { window.removeEventListener("resize", size); cancelAnimationFrame(raf); };
  }, [reduce]);

  return <canvas id="stars" ref={ref} aria-hidden="true" />;
}
