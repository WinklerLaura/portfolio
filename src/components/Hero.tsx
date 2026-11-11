import { useEffect, useRef, useState } from "react";
import { hero } from "../data";

type Pt = [number, number];

interface Props {
  reduce: boolean;
  onHotspot: (targetId: string) => void;
}

/** Header image with light pulses travelling along the thread and clickable hotspots. */
export function Hero({ reduce, onHotspot }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spots, setSpots] = useState<{ x: number; y: number; visible: boolean }[]>([]);
  const [lit, setLit] = useState<boolean[]>(() => hero.hotspots.map(() => false));

  useEffect(() => {
    const inner = innerRef.current, img = imgRef.current, cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!inner || !img || !cv || !ctx) return;

    let W = 0, H = 0, raf = 0, running = false, visible = true, last = 0;
    let samples: Pt[] = [], hotPts: Pt[] = [];
    const t0 = performance.now();
    const litUntil = hero.hotspots.map(() => 0);
    let litState = litUntil.map(() => false);
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() * 0.6 + 0.2) / 100, vy: (Math.random() - 0.6) / 160, ph: Math.random() * 6.28,
    }));
    const comets = [0, 0.38, 0.71];

    const map = (fx: number, fy: number): Pt => {
      const iw = img.naturalWidth || 3168, ih = img.naturalHeight || 1021;
      const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
      const op = getComputedStyle(img).objectPosition.split(" ");
      const px = (parseFloat(op[0]) || 55) / 100, py = (parseFloat(op[1]) || 40) / 100;
      return [(W - dw) * px + fx * dw, (H - dh) * py + fy * dh];
    };
    const catmull = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
      const t2 = t * t, t3 = t2 * t;
      const f = (i: 0 | 1) => 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3);
      return [f(0), f(1)];
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000, N = samples.length;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx / 60; p.y += p.vy / 60;
          if (p.x > 1.02) p.x = -0.02;
          if (p.y < -0.02) p.y = 1.02;
          if (p.y > 1.02) p.y = -0.02;
        }
        const a = 0.18 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.6 + p.ph));
        ctx.fillStyle = `rgba(200,222,255,${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.283); ctx.fill();
      }
      const g = 0.05 + 0.05 * (0.5 + 0.5 * Math.sin(t * 1.2));
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(150,195,255,${g.toFixed(3)})`; ctx.lineWidth = 7;
      ctx.beginPath();
      samples.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      ctx.stroke();
      if (reduce) return;

      const tail = Math.round(N * 0.09);
      for (const o of comets) {
        const head = Math.floor(((t * 0.075 + o) % 1.15) * N);
        for (let k = tail; k >= 0; k--) {
          const idx = head - k;
          if (idx < 0 || idx >= N) continue;
          const f = 1 - k / tail, q = samples[idx];
          ctx.fillStyle = `rgba(205,225,255,${(f * f * 0.55).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(q[0], q[1], 0.6 + 2.4 * f, 0, 6.283); ctx.fill();
        }
        if (head >= 0 && head < N) {
          const hq = samples[head];
          const rg = ctx.createRadialGradient(hq[0], hq[1], 0, hq[0], hq[1], 26);
          rg.addColorStop(0, "rgba(255,255,255,.95)");
          rg.addColorStop(0.25, "rgba(190,215,255,.55)");
          rg.addColorStop(1, "rgba(120,170,255,0)");
          ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hq[0], hq[1], 26, 0, 6.283); ctx.fill();
          hotPts.forEach((hp, i) => {
            const dx = hq[0] - hp[0], dy = hq[1] - hp[1];
            if (dx * dx + dy * dy < 900) litUntil[i] = now + 1100;
          });
        }
      }
      const next = litUntil.map((u) => now < u);
      if (next.some((v, i) => v !== litState[i])) { litState = next; setLit(next); }
    };

    const layout = () => {
      W = inner.offsetWidth; H = inner.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const P = hero.path.map(([x, y]) => map(x, y));
      samples = [];
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
        for (let k = 0; k < 24; k++) samples.push(catmull(p0, p1, p2, p3, k / 24));
      }
      samples.push(P[P.length - 1]);
      hotPts = hero.hotspots.map((h) => map(h.fx, h.fy));
      setSpots(hotPts.map(([x, y]) => ({ x, y, visible: x >= 0 && x <= W })));
      if (reduce || !running) draw(performance.now());
    };

    const loop = (now: number) => {
      if (!running) return;
      if (now - last > 15) { draw(now); last = now; }
      raf = requestAnimationFrame(loop);
    };
    const setRunning = (on: boolean) => {
      if (reduce) return;
      if (on && !running) { running = true; raf = requestAnimationFrame(loop); }
      else if (!on) { running = false; cancelAnimationFrame(raf); }
    };
    const boot = () => { layout(); setRunning(visible && !document.hidden); };

    if (img.complete) boot(); else img.addEventListener("load", boot);
    const ro = new ResizeObserver(layout); ro.observe(inner);
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; setRunning(visible && !document.hidden); });
    io.observe(inner);
    const onVis = () => setRunning(visible && !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false; cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      img.removeEventListener("load", boot);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  return (
    <header className="hero" id="top">
      <nav className="nav" aria-label="Sections">
        <a href="#projects">Projects</a>
        <a href="#background">Background</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="stage">
        <div className="inner" ref={innerRef}>
          <img ref={imgRef} src={hero.src} alt={hero.alt} />
          <canvas ref={canvasRef} aria-hidden="true" />
          {hero.hotspots.map((h, i) => (
            <button
              key={h.label}
              type="button"
              className={lit[i] ? "hot lit" : "hot"}
              style={spots[i] ? { left: spots[i].x, top: spots[i].y } : undefined}
              hidden={spots[i] ? !spots[i].visible : true}
              aria-label={h.ariaLabel}
              onClick={() => onHotspot(h.target)}
            >
              <span className="ring" />
              <span className="tip">{h.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
