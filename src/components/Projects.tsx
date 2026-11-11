import { useEffect, useRef, useState } from "react";
import { profile, projects, type Project } from "../data";
import { Arrow } from "./Arrow";

const GAP = 2600; // pause between two images, in ms

interface Props {
  reduce: boolean;
  paused: boolean; // true while the detail overlay is open
  onOpen: (project: Project, imageIndex: number, trigger: HTMLElement) => void;
}

/**
 * Project tiles. Only one tile plays at a time: it shows all its images
 * (with a light flash between them) and returns to its cover, then the next tile starts.
 */
export function Projects({ reduce, paused, onOpen }: Props) {
  const [indices, setIndices] = useState<number[]>(() => projects.map(() => 0));
  const [bursts, setBursts] = useState<{ key: number; x: number }[]>(() => projects.map(() => ({ key: 0, x: 50 })));
  const indicesRef = useRef(indices);
  const hoverRef = useRef<boolean[]>(projects.map(() => false));
  const seenRef = useRef<boolean[]>(projects.map(() => true));
  const pausedRef = useRef(paused);
  const tileRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  pausedRef.current = paused;

  // Play the active video slide of each tile once, pause all others.
  useEffect(() => {
    indicesRef.current = indices;
    projects.forEach((p, ti) => {
      p.slides.forEach((s, si) => {
        if (!s.video) return;
        const v = videoRefs.current[`${ti}-${si}`];
        if (!v) return;
        if (si === indices[ti] && !reduce) {
          v.loop = false;
          v.currentTime = 0;
          v.play().catch(() => {});
        } else v.pause();
      });
    });
  }, [indices, reduce]);

  // Track which tiles are on screen.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const i = tileRefs.current.indexOf(e.target as HTMLElement);
        if (i >= 0) seenRef.current[i] = e.isIntersecting;
      });
    });
    tileRefs.current.forEach((t) => t && io.observe(t));
    return () => io.disconnect();
  }, []);

  // Scheduler: one tile at a time.
  useEffect(() => {
    if (reduce) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    let turn = 0;

    const advance = (ti: number): number => {
      const p = projects[ti];
      const next = (indicesRef.current[ti] + 1) % p.slides.length;
      setBursts((b) => b.map((x, i) => (i === ti ? { key: x.key + 1, x: 25 + Math.random() * 50 } : x)));
      later(() => setIndices((idx) => idx.map((v, i) => (i === ti ? next : v))), 160);
      const slide = p.slides[next];
      if (slide.video) {
        const v = videoRefs.current[`${ti}-${next}`];
        return ((v?.duration || 4.3) * 1000) + 900;
      }
      return 0;
    };

    const runTile = (ti: number, done: () => void) => {
      let shown = 1;
      const step = () => {
        if (document.hidden || pausedRef.current || !seenRef.current[ti] || hoverRef.current[ti]) { later(step, 600); return; }
        const dur = advance(ti);
        if (shown < projects[ti].slides.length) { shown++; later(step, Math.max(GAP, dur) + 200); }
        else later(done, GAP);
      };
      step();
    };

    const cycle = () => {
      const ti = turn % projects.length; turn++;
      if (projects[ti].slides.length < 2) { later(cycle, 0); return; }
      later(() => runTile(ti, cycle), 1200);
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  return (
    <section id="projects" className="split">
      <div className="side"><div className="label">Projects</div></div>
      <div className="projects">
        {projects.map((p, ti) => (
          <article
            key={p.id}
            id={p.id}
            ref={(el) => { tileRefs.current[ti] = el; }}
            className={reduce ? "project tile" : "project tile arrive"}
            style={{ ["--d" as string]: `${0.35 + ti * 0.22}s` }}
            tabIndex={0}
            role="button"
            aria-label={`${p.title}: show more`}
            onClick={(e) => onOpen(p, indices[ti], e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(p, indices[ti], e.currentTarget); }
            }}
            onPointerEnter={() => { hoverRef.current[ti] = true; }}
            onPointerLeave={() => { hoverRef.current[ti] = false; }}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
          >
            <div className="media">
              {p.slides.map((s, si) =>
                s.video ? (
                  <video
                    key={s.src}
                    ref={(el) => { videoRefs.current[`${ti}-${si}`] = el; }}
                    className={si === indices[ti] ? "slide on" : "slide"}
                    src={s.src}
                    poster={s.poster}
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={s.alt}
                  />
                ) : (
                  <img key={s.src} className={si === indices[ti] ? "slide on" : "slide"} src={s.src} alt={s.alt} decoding="async" />
                )
              )}
              <span
                key={bursts[ti].key}
                className={bursts[ti].key ? "burst go" : "burst"}
                style={{ ["--bx" as string]: `${bursts[ti].x.toFixed(0)}%` }}
                aria-hidden="true"
              />
              <span className="badge">{p.badge}</span>
              <span className="cta">Show me more<Arrow /></span>
              <span className="dots" aria-hidden="true">
                {p.slides.map((s, si) => <i key={s.src} className={si === indices[ti] ? "on" : undefined} />)}
              </span>
            </div>
            <div className="tile-body">
              <span className="meta">{p.meta}</span>
              <h3>{p.title}</h3>
              <p>{p.teaser}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="more-cta">
        Want to know more?{" "}
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">Find me on LinkedIn<Arrow /></a>
      </p>
    </section>
  );
}
