import { useEffect, useRef, useState } from "react";
import type { Project } from "../data";
import { Arrow } from "./Arrow";

interface Props {
  project: Project;
  startIndex: number;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/** Large project view: image/video gallery plus the full description. */
export function DetailOverlay({ project, startIndex, onClose }: Props) {
  const [gi, setGi] = useState(Math.min(startIndex, project.gallery.length - 1));
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const g = project.gallery;
  const go = (n: number) => setGi((n + g.length) % g.length);
  const item = g[gi];
  const d = project.detail;

  useEffect(() => {
    document.body.classList.add("locked");
    closeRef.current?.focus();
    overlayRef.current?.scrollTo(0, 0);
    return () => document.body.classList.remove("locked");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft" && g.length > 1) go(gi - 1);
      if (e.key === "ArrowRight" && g.length > 1) go(gi + 1);
      if (e.key === "Tab" && sheetRef.current) {
        // Keep keyboard focus inside the dialog.
        const els = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hidden);
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <div className="overlay" ref={overlayRef} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        <button type="button" className="close" ref={closeRef} aria-label="Close" onClick={onClose}>×</button>
        <div className="viewer">
          {item.video ? (
            <video key={item.src} src={item.src} poster={item.poster} muted loop playsInline controls autoPlay aria-label={item.alt} />
          ) : (
            <img key={item.src} src={item.src} alt={item.alt} />
          )}
          {g.length > 1 && (
            <>
              <button type="button" className="nav-btn prev" aria-label="Previous image" onClick={() => go(gi - 1)}>‹</button>
              <button type="button" className="nav-btn next" aria-label="Next image" onClick={() => go(gi + 1)}>›</button>
            </>
          )}
        </div>
        {g.length > 1 && (
          <div className="thumbs">
            {g.map((m, i) => (
              <button key={m.src} type="button" className={i === gi ? "on" : undefined} aria-label={`Show image ${i + 1}`} onClick={() => go(i)}>
                <img src={m.video ? m.poster : m.src} alt="" />
              </button>
            ))}
          </div>
        )}
        <div className="sheet-body">
          <div className="detail-body">
            <span className="meta">{d.meta}</span>
            <h3 id="sheetTitle">{project.title}</h3>
            {d.paragraphs.slice(0, 1).map((t) => <p key={t}>{t}</p>)}
            {d.points.length > 0 && <ul className="points">{d.points.map((t) => <li key={t}>{t}</li>)}</ul>}
            {d.metrics.length > 0 && (
              <div className="metrics">
                {d.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}
              </div>
            )}
            {d.paragraphs.slice(1).map((t) => <p key={t}>{t}</p>)}
            <div className="tags">{d.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
            <div className="row">
              {d.links.map((l) => (
                <a key={l.href} className="more" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<Arrow /></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
