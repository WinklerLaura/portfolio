import { useCallback, useEffect, useRef, useState } from "react";
import { background, facts, profile, skills, type Project } from "./data";
import { useReducedMotion } from "./useReducedMotion";
import { Stars } from "./components/Stars";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { DetailOverlay } from "./components/DetailOverlay";
import { Arrow } from "./components/Arrow";

export default function App() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<{ project: Project; index: number } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openProject = useCallback((project: Project, index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpen({ project, index });
  }, []);

  const closeProject = useCallback(() => {
    setOpen(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const jumpTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    if (el.classList.contains("project")) {
      el.classList.remove("flash");
      void el.offsetWidth;
      el.classList.add("flash");
    }
  }, []);

  // Sections fade in when they scroll into view (they stay visible without JS).
  useEffect(() => {
    if (reduce) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
    });
    return () => io.disconnect();
  }, [reduce]);

  return (
    <>
      <Stars reduce={reduce} />
      {/* Section buttons: shown on phones and tablets, pinned to the top while scrolling */}
      <nav className="nav" aria-label="Sections">
        <a href="#projects">Projects</a>
        <a href="#background">Background</a>
        <a href="#contact">Contact</a>
      </nav>
      <Hero reduce={reduce} onHotspot={jumpTo} />

      <div className="content" lang="en">
        <main className="wrap">
          <div className="top">
            <div className="lead">
              <div className="intro">
                <div className="label">{profile.role}</div>
                <h1>
                  <span className="shine shine-light">{profile.firstName}</span>{" "}
                  <span className="shine">{profile.lastName}</span>
                </h1>
                <p className="lede">{profile.tagline}</p>
                <div className="status">
                  <span className="dot" aria-hidden="true" />
                  <span className="status-lines">
                    {profile.status.main.map((part) => <span key={part}><span className="nw">{part}</span> </span>)}
                    <span className="s2">
                      {profile.status.when}
                      <span className="sep"> · </span>
                      <br />
                      {profile.status.place}
                    </span>
                  </span>
                </div>
              </div>

              <section className="reveal split">
                <div className="side"><div className="label">About</div></div>
                <p>{profile.about}</p>
              </section>
            </div>

            <Projects reduce={reduce} paused={open !== null} onOpen={openProject} />
          </div>

          <section id="background" className="reveal split">
            <div className="side"><div className="label">Background</div></div>
            <ol className="bg">
              {background.map((b) => (
                <li key={b.title}>
                  <span className="meta">{b.when}</span>
                  <strong>{b.title}</strong>
                  <span className="muted">{b.where}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="reveal split">
            <div className="side"><div className="label">Skills</div></div>
            <div className="skills">
              {skills.map((g) => (
                <div key={g.title}>
                  <h3>{g.title}</h3>
                  <div className="chips">{g.items.map((i) => <span key={i} className="chip">{i}</span>)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="reveal split" id="more">
            <div className="side"><div className="label">What else</div></div>
            <ul className="facts">
              {facts.map((f) => (
                <li key={f.title}>
                  <span className="spark" aria-hidden="true" />
                  <div><strong>{f.title}</strong><p>{f.text}</p></div>
                </li>
              ))}
            </ul>
          </section>

          <section className="reveal split" id="contact">
            <div className="side"><div className="label">Contact me</div></div>
            <ul className="contact-links">
              <li><a href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<Arrow external /></a></li>
              <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub<Arrow external /></a></li>
            </ul>
          </section>

          <footer className="foot">
            <span>
              © {new Date().getFullYear()} {profile.firstName} {profile.lastName} · Vienna
              <br />
              <small className="ai-note"><a href="/imprint.html">Imprint</a> · <a href="/privacy.html">Privacy</a> · Header image AI-generated</small>
            </span>
          </footer>
        </main>
      </div>

      {open && <DetailOverlay key={open.project.id} project={open.project} startIndex={open.index} onClose={closeProject} />}
    </>
  );
}
