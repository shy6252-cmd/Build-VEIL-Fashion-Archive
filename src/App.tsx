import { useEffect, useRef, useState } from "react";

type View = "cover" | "home" | "archive" | "detail";
type Project = {
  number: number;
  title: string;
  category: string;
  pages: number[];
  note: string;
};

const projects: Project[] = [
  {
    number: 1,
    title: "Brand Benchmarking",
    category: "Research / Strategy",
    pages: [13, 14, 15],
    note: "A comparative reading of adjacent fashion brands, visual codes and market presence.",
  },
  {
    number: 2,
    title: "VEIL Brand Planning",
    category: "Brand / Planning",
    pages: [3, 16, 17, 18, 19],
    note: "The planning framework for VEIL: unseen beauty discovered within the everyday.",
  },
  {
    number: 3,
    title: "Marketing Environment",
    category: "Research / Environment",
    pages: [4, 5, 6, 7],
    note: "Political, economic, social, cultural and natural environment source boards.",
  },
  {
    number: 4,
    title: "Market Research",
    category: "Research / Market",
    pages: [8, 9, 10, 11],
    note: "Domestic market context and VMD observations gathered in the original research.",
  },
  {
    number: 5,
    title: "Consumer Research",
    category: "Research / Consumer",
    pages: [12],
    note: "Original consumer profile and lifestyle research board.",
  },
  {
    number: 6,
    title: "Competitor Analysis",
    category: "Research / Competition",
    pages: [13, 14, 15],
    note: "Hatchingroom, SANSANGEAR and ADERERROR competitor analysis.",
  },
  {
    number: 7,
    title: "Brand Identity & Positioning",
    category: "Identity / Strategy",
    pages: [16, 17, 18, 19, 20, 21],
    note: "VEIL identity, STP, 4P and market-positioning source material.",
  },
  {
    number: 8,
    title: "Fashion Theme",
    category: "Concept / Fashion",
    pages: [22],
    note: "Brand concept and fashion theme grounded in EVERYDAY / HIDDEN / BEAUTY.",
  },
  {
    number: 9,
    title: "Season Design Concept",
    category: "Concept / S/S",
    pages: [23],
    note: "Seasonal palette, material direction and silhouette research.",
  },
  {
    number: 10,
    title: "Fashion Design",
    category: "Design / Outcome",
    pages: [24, 25, 26],
    note: "Item development and original fashion design outcomes.",
  },
  {
    number: 11,
    title: "Store Research",
    category: "VMD / Research",
    pages: [27, 28, 29, 30, 31, 32],
    note: "Hatchingroom Seongsu: structure, interior, VP / PP / IP, lighting, POP and display methods.",
  },
  {
    number: 12,
    title: "VMD Concept",
    category: "VMD / S/S",
    pages: [33],
    note: "THE ERODED SPACE — a seasonal environment formed through stone, metal and irregular volume.",
  },
  {
    number: 13,
    title: "VMD Image Map & Reference",
    category: "VMD / Material Study",
    pages: [34],
    note: "Original material map and spatial references for THE ERODED SPACE.",
  },
  {
    number: 14,
    title: "VEIL Final VP Design",
    category: "VMD / Final Outcome",
    pages: [],
    note: "Final VP design material has not yet been supplied. This is an editable exhibit placeholder.",
  },
];

const pageSrc = (page: number) => `/vmd/cutout/page-${String(page).padStart(2, "0")}.webp`;
const displayPage = (p: Project) => p.pages[Math.min(1, p.pages.length - 1)] || 35;

function Mark({ light = false, onHome }: { light?: boolean; onHome: () => void }) {
  return (
    <button className={`mark ${light ? "mark-light" : ""}`} onClick={onHome} aria-label="VEIL home">
      VEIL<span>UNSEEN</span>
    </button>
  );
}

function Header({
  view,
  setView,
  light = false,
}: {
  view: View;
  setView: (v: View) => void;
  light?: boolean;
}) {
  return (
    <header className={`header ${light ? "header-light" : ""}`}>
      <Mark light={light} onHome={() => setView("cover")} />
      <div className="header-rule" />
      <nav aria-label="Primary navigation">
        <button
          className={view === "cover" || view === "home" ? "active" : ""}
          onClick={() => setView("cover")}
        >
          {view === "archive" ? "home" : "Exhibition"}
        </button>
        <button className={view === "archive" ? "active" : ""} onClick={() => setView("archive")}>
          Archive <sup>14</sup>
        </button>
      </nav>
    </header>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "left" ? "←" : "→"}</span>;
}

type DustParticle = {
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  targetX: number;
  targetY: number;
  radius: number;
  opacity: number;
  delay: number;
  duration: number;
  phase: number;
  color: string;
};

function LogoParticleIntro({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logoRect, setLogoRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const targetLogo = document.querySelector<HTMLImageElement>(".cover-logo");
    if (!canvas || !targetLogo) {
      onComplete();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const timer = window.setTimeout(onComplete, 60);
      return () => window.clearTimeout(timer);
    }

    let frame = 0;
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;
      const parentRect = targetLogo.parentElement?.getBoundingClientRect();
      const width = targetLogo.offsetWidth;
      const height = targetLogo.offsetHeight;
      const rect = parentRect
        ? new DOMRect(
            parentRect.left + (parentRect.width - width) / 2,
            parentRect.top + (parentRect.height - height) / 2,
            width,
            height,
          )
        : targetLogo.getBoundingClientRect();
      setLogoRect(rect);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext("2d");
      if (!context) {
        onComplete();
        return;
      }
      context.scale(dpr, dpr);

      const mask = document.createElement("canvas");
      mask.width = image.naturalWidth;
      mask.height = image.naturalHeight;
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      if (!maskContext) {
        onComplete();
        return;
      }
      maskContext.drawImage(image, 0, 0);
      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const particleCount = window.innerWidth < 700 ? 1100 : 2400;
      const particles: DustParticle[] = [];
      const palette = ["#8f8a82", "#b6afa4", "#d2cbc0", "#e1dad0"];
      const spread = Math.min(window.innerWidth, window.innerHeight) * 0.45;
      let attempts = 0;

      while (particles.length < particleCount && attempts < particleCount * 30) {
        attempts += 1;
        const sourceX = Math.floor(Math.random() * mask.width);
        const sourceY = Math.floor(Math.random() * mask.height);
        const alpha = pixels[(sourceY * mask.width + sourceX) * 4 + 3];
        if (alpha < 46 || Math.random() > alpha / 255) continue;

        const targetX = rect.left + (sourceX / mask.width) * rect.width;
        const targetY = rect.top + (sourceY / mask.height) * rect.height;
        const angle = Math.random() * Math.PI * 2;
        const distance = 45 + Math.pow(Math.random(), 0.58) * spread;
        const startX = targetX + Math.cos(angle) * distance;
        const startY = targetY + Math.sin(angle) * distance * 0.66;
        const radius = 0.35 + Math.pow(Math.random(), 2.1) * 1.35;
        const midpointX = (startX + targetX) / 2;
        const midpointY = (startY + targetY) / 2;
        const curve = (Math.random() - 0.5) * (50 + distance * 0.22);

        particles.push({
          startX,
          startY,
          controlX: midpointX - Math.sin(angle) * curve,
          controlY: midpointY + Math.cos(angle) * curve,
          targetX,
          targetY,
          radius,
          opacity: 0.24 + Math.random() * 0.58,
          delay: 560 + Math.random() * 460,
          duration: 1350 + radius * 480 + Math.random() * 420,
          phase: Math.random() * Math.PI * 2,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }

      const startedAt = performance.now();
      const render = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startedAt;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const particle of particles) {
          const rawProgress = Math.max(
            0,
            Math.min(1, (elapsed - particle.delay) / particle.duration),
          );
          const eased =
            rawProgress < 0.5
              ? 4 * rawProgress * rawProgress * rawProgress
              : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
          const inverse = 1 - eased;
          const floatAmount =
            rawProgress === 0 ? Math.sin(elapsed * 0.0013 + particle.phase) * 3 : 0;
          let x =
            inverse * inverse * particle.startX +
            2 * inverse * eased * particle.controlX +
            eased * eased * particle.targetX;
          let y =
            inverse * inverse * particle.startY +
            2 * inverse * eased * particle.controlY +
            eased * eased * particle.targetY +
            floatAmount;
          if (elapsed > 3000 && particle.radius < 0.55) {
            const drift = Math.min(1, (elapsed - 3000) / 800);
            x += Math.cos(particle.phase) * 7 * drift;
            y += Math.sin(particle.phase) * 4 * drift - 3 * drift;
          }
          const settlingFade = elapsed < 2850 ? 1 : Math.max(0, 1 - (elapsed - 2850) / 760);
          const arrivalOpacity = rawProgress === 0 ? 0.38 : 0.45 + eased * 0.55;

          context.globalAlpha = particle.opacity * arrivalOpacity * settlingFade;
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(x, y, particle.radius * (0.82 + eased * 0.18), 0, Math.PI * 2);
          context.fill();
        }

        context.globalAlpha = 1;
        if (elapsed < 4000) {
          frame = requestAnimationFrame(render);
        }
      };
      frame = requestAnimationFrame(render);
    };

    image.onerror = onComplete;
    image.src = "/veil-logo.png";
    const completionTimer = window.setTimeout(onComplete, 4000);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(completionTimer);
    };
  }, [onComplete]);

  return (
    <div className="logo-particle-intro" aria-hidden="true">
      <canvas ref={canvasRef} />
      {logoRect && (
        <img
          className="particle-final-logo"
          src="/veil-logo.png"
          alt=""
          style={{
            left: logoRect.left,
            top: logoRect.top,
            width: logoRect.width,
            height: logoRect.height,
          }}
        />
      )}
    </div>
  );
}

function Cover({
  setView,
  onRevealStart,
}: {
  setView: (v: View) => void;
  onRevealStart: () => void;
}) {
  const [isOpening, setIsOpening] = useState(false);
  const enterTimer = useRef<number | null>(null);
  const [showLogoIntro, setShowLogoIntro] = useState(() => {
    try {
      const key = "veil-logo-intro-played-cinematic-v2";
      if (window.sessionStorage.getItem(key)) return false;
      window.sessionStorage.setItem(key, "true");
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (enterTimer.current !== null) {
        window.clearTimeout(enterTimer.current);
      }
    };
  }, []);

  const enterArchive = () => {
    if (isOpening) return;
    setIsOpening(true);
    onRevealStart();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    enterTimer.current = window.setTimeout(() => setView("archive"), reducedMotion ? 50 : 2150);
  };

  return (
    <main className={`cover-shell ${isOpening ? "is-opening" : ""}`}>
      {showLogoIntro && <LogoParticleIntro onComplete={() => setShowLogoIntro(false)} />}
      <div className="archive-veil-transition" aria-hidden="true">
        <span className="archive-veil-sheet archive-veil-main" />
        <span className="archive-veil-sheet archive-veil-trail" />
        <span className="archive-veil-sheet archive-veil-edge" />
      </div>
      <section className="cover-stage" aria-label="VEIL home">
        <header className="simple-home-header">
          <p>DIMA / VMD</p>
        </header>

        <div className="simple-home-center">
          <p className="simple-home-kicker">202343022 오상규</p>
          <div className="logo-stage">
            <div className="logo-dust-wind" aria-hidden="true">
              <span className="dust-cloud dust-cloud-a" />
              <span className="dust-cloud dust-cloud-b" />
              <span className="dust-cloud dust-cloud-c" />
            </div>
            <h1>
              <img className="cover-logo" src="/veil-logo.png" alt="VEIL" />
            </h1>
          </div>
          <p className="simple-home-statement">
            Discovering subtle beauty hidden within ordinary everyday life.
          </p>
        </div>

        <footer className="simple-home-footer">
          <div className="simple-home-keywords" aria-label="VEIL concept keywords">
            <span>Everyday.</span>
            <i />
            <span>Hidden.</span>
            <i />
            <span>Beauty.</span>
          </div>
          <button className="cover-enter" onClick={enterArchive} disabled={isOpening}>
            <span>{isOpening ? "Entering" : "Enter the Archive"}</span>
            <Arrow direction="right" />
          </button>
        </footer>
      </section>
    </main>
  );
}

function Home({
  active,
  setActive,
  open,
  setView,
}: {
  active: number;
  setActive: (n: number) => void;
  open: (n: number) => void;
  setView: (v: View) => void;
}) {
  const p = projects[active];
  const positions = [
    { x: -38, y: -8, r: -7, s: 0.64 },
    { x: -23, y: 20, r: 5, s: 0.55 },
    { x: 34, y: -13, r: 8, s: 0.6 },
    { x: 28, y: 22, r: -5, s: 0.51 },
    { x: -11, y: -22, r: 3, s: 0.48 },
    { x: 10, y: 25, r: 6, s: 0.45 },
  ];
  const satellites = [1, 2, 3, 4, 5, 6].map((d) => (active + d) % projects.length);
  const shift = (delta: number) => setActive((active + delta + projects.length) % projects.length);
  return (
    <main className="home-shell">
      <Header view="home" setView={setView} light />
      <section className="home-stage" aria-label="Featured project exhibition">
        <div className="exhibit-meta">
          <p className="eyebrow">Digital Fashion Archive · 2024</p>
          <h1>{p.title}</h1>
          <p className="intro">{p.note}</p>
          <div className="meta-row">
            <span>{String(p.number).padStart(2, "0")} / 14</span>
            <span>{p.category}</span>
          </div>
        </div>
        <div className="composition">
          {satellites.map((idx, i) => {
            const q = projects[idx];
            const pos = positions[i];
            return (
              <button
                key={q.number}
                className="satellite"
                onClick={() => setActive(idx)}
                style={
                  {
                    "--x": `${pos.x}vw`,
                    "--y": `${pos.y}vh`,
                    "--r": `${pos.r}deg`,
                    "--s": pos.s,
                  } as React.CSSProperties
                }
                aria-label={`Feature ${q.title}`}
              >
                <img src={pageSrc(displayPage(q))} alt="" />
                <span>{String(q.number).padStart(2, "0")}</span>
              </button>
            );
          })}
          <button className="hero-work" onClick={() => open(active)} aria-label={`Open ${p.title}`}>
            {p.pages.length ? (
              <img src={pageSrc(displayPage(p))} alt={`${p.title} original project board`} />
            ) : (
              <div className="placeholder">
                <span>VEIL</span>
                <small>Awaiting original VP material</small>
              </div>
            )}
            <span className="enter">
              Enter project <Arrow direction="right" />
            </span>
          </button>
        </div>
        <div className="home-controls">
          <button onClick={() => shift(-1)}>
            <Arrow direction="left" /> Previous
          </button>
          <span>
            {String(active + 1).padStart(2, "0")} — {String(projects.length).padStart(2, "0")}
          </span>
          <button onClick={() => shift(1)}>
            Next <Arrow direction="right" />
          </button>
        </div>
      </section>
    </main>
  );
}

function Archive({
  open,
  setView,
  revealing = false,
}: {
  open: (n: number) => void;
  setView: (v: View) => void;
  revealing?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <main className={`archive-shell ${revealing ? "archive-revealing" : ""}`}>
      <Header view="archive" setView={setView} />
      <section className="archive-intro">
        <h1>
          <span className="fg-inline-italic">VEIL</span>
        </h1>
      </section>
      <section
        className={`orbit ${hover !== null ? "is-hovering" : ""}`}
        aria-label="Circular project archive"
      >
        <div className="orbit-center">
          <img className="archive-logo" src="/veil-logo.png" alt="VEIL" />
          <span>UNSEEN</span>
          <i>14 PROJECTS</i>
        </div>
        {projects.map((p, i) => {
          const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 41;
          const y = 50 + Math.sin(angle) * 39;
          return (
            <button
              key={p.number}
              className={`orbit-item item-${i} ${hover === i ? "hovered" : ""}`}
              style={
                {
                  "--left": `${x}%`,
                  "--top": `${y}%`,
                  "--rot": `${(i % 2 ? 1 : -1) * (3 + (i % 4) * 2)}deg`,
                  "--i": i,
                } as React.CSSProperties
              }
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onClick={() => open(i)}
            >
              <span className="orbit-image">
                {p.pages.length ? (
                  <img src={pageSrc(displayPage(p))} alt="" />
                ) : (
                  <span className="mini-placeholder">VEIL</span>
                )}
              </span>
              <span className="orbit-caption">
                <b>{String(p.number).padStart(2, "0")}</b>
                {p.title}
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

function VmdConcept() {
  return (
    <section className="concept-section">
      <div className="section-label">
        <span>Project 12</span>
        <span>Exhibition direction</span>
      </div>
      <div className="concept-grid">
        <div>
          <p className="eyebrow">Main theme</p>
          <h2>
            THE ERODED
            <br />
            <em>SPACE</em>
          </h2>
          <p className="korean">침식된 공간</p>
        </div>
        <dl>
          <div>
            <dt>Season</dt>
            <dd>S / S</dd>
          </div>
          <div>
            <dt>Period</dt>
            <dd>2.1 — 3.31</dd>
          </div>
          <div>
            <dt>Material</dt>
            <dd>
              Stone-inspired objects
              <br />
              Metallic textures
              <br />
              Irregular sculptures
            </dd>
          </div>
        </dl>
      </div>
      <div className="palette">
        <span style={{ background: "#d8d4cc" }} />
        <span style={{ background: "#a8a49d" }} />
        <span style={{ background: "#312f2d" }} />
        <span style={{ background: "#6f302d" }} />
        <p>Main / Sub / Point color</p>
      </div>
      <div className="promotion-grid">
        <article>
          <span>01 / GIFT</span>
          <h3>Offline purchase benefit</h3>
          <p>
            VEIL scarf gift for offline purchases over <strong>KRW 200,000</strong>.
          </p>
        </article>
        <article>
          <span>02 / LAUNCH</span>
          <h3>Season opening</h3>
          <p>
            <strong>10% launch discount</strong> for two weeks.
          </p>
        </article>
        <article>
          <span>03 / SOUND</span>
          <h3>Music direction</h3>
          <p>
            Seasonal music direction and event planning remain as documented in the original concept
            board.
          </p>
        </article>
      </div>
    </section>
  );
}

function StoreExhibit() {
  const items = [
    ["store-interior-display.jpg", "Interior", "Display furniture and product arrangement."],
    ["store-interior-space.jpg", "Structure", "Seongsu store circulation and spatial character."],
    ["store-vp.jpg", "VP", "Visual presentation and primary focal display."],
    ["store-pp.jpg", "PP", "Point presentation and coordinated styling."],
    ["store-ip.jpg", "IP", "Item presentation and product grouping."],
    [
      "store-lighting-pop.jpg",
      "Lighting / POP",
      "Lighting observations, signage and display methods.",
    ],
  ];
  return (
    <section className="store-section">
      <div className="section-label">
        <span>Field research</span>
        <span>Hatchingroom · Seongsu</span>
      </div>
      <div className="store-grid">
        {items.map(([src, title, caption], i) => (
          <figure className={`store-figure figure-${i}`} key={src}>
            <img src={`/vmd/exhibits/${src}`} alt={`${title} original store research photograph`} />
            <figcaption>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{title}</b>
                <p>{caption}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Detail({
  index,
  open,
  back,
  setView,
}: {
  index: number;
  open: (n: number) => void;
  back: () => void;
  setView: (v: View) => void;
}) {
  const p = projects[index];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);
  return (
    <main className="detail-shell">
      <Header view="detail" setView={setView} />
      <section className="detail-hero">
        <div className="detail-number">{String(p.number).padStart(2, "0")}</div>
        <div className="detail-heading">
          <p className="eyebrow">{p.category} · VEIL Archive</p>
          <h1>{p.title}</h1>
          <p>{p.note}</p>
        </div>
        <div className="detail-cover">
          {p.pages.length ? (
            <img src={pageSrc(displayPage(p))} alt={`${p.title} original project board`} />
          ) : (
            <div className="placeholder large">
              <span>EDITABLE EXHIBIT</span>
              <small>Original final VP content has not been supplied</small>
            </div>
          )}
        </div>
        <button
          className="scroll-cue"
          onClick={() =>
            document.getElementById("materials")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          View materials <span>↓</span>
        </button>
      </section>
      {p.number === 11 && <StoreExhibit />}
      {p.number === 12 && <VmdConcept />}
      {p.number === 13 && (
        <section className="material-map">
          <div>
            <p className="eyebrow">Material direction</p>
            <h2>
              Stone / Metal
              <br />
              Irregular volume
            </h2>
            <p>
              The original image map pairs eroded mineral surfaces with brushed metal, rough plaster
              and sculptural spatial references.
            </p>
          </div>
          <img src="/vmd/exhibits/vmd-material-map.webp" alt="Original VMD material map" />
          <img src="/vmd/exhibits/vmd-reference.webp" alt="Original VMD spatial references" />
        </section>
      )}
      <section className="boards" id="materials">
        <div className="section-label">
          <span>Original content · reorganized</span>
          <span>
            {p.pages.length ? `${p.pages.length} source sections` : "Editable placeholder"}
          </span>
        </div>
        {p.pages.length ? (
          <div className="board-list">
            {p.pages.map((page, i) => (
              <figure className={`source-piece source-piece-${i % 3}`} key={page}>
                <figcaption>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b>{p.title}</b>
                </figcaption>
                <div className="source-content">
                  <img
                    src={pageSrc(page)}
                    alt={`${p.title} original source content ${i + 1}`}
                    loading="lazy"
                  />
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <div className="empty-board">
            <span>14</span>
            <h2>Original outcome pending</h2>
            <p>
              Drop the final VP material into this exhibit when it becomes available. No outcome has
              been invented.
            </p>
          </div>
        )}
      </section>
      <footer className="detail-footer">
        <button onClick={() => open((index + 13) % 14)}>
          <span>Previous</span>
          {projects[(index + 13) % 14].title}
        </button>
        <button className="back-archive" onClick={back}>
          Back to Archive
        </button>
        <button className="next" onClick={() => open((index + 1) % 14)}>
          <span>Next</span>
          {projects[(index + 1) % 14].title}
        </button>
      </footer>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<View>("cover");
  const [active, setActive] = useState(11);
  const [detail, setDetail] = useState(11);
  const [archiveRevealing, setArchiveRevealing] = useState(false);
  const archiveRevealTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (archiveRevealTimer.current !== null) {
        window.clearTimeout(archiveRevealTimer.current);
      }
    },
    [],
  );
  const open = (index: number) => {
    setDetail(index);
    setView("detail");
  };
  const changeView = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const beginArchiveReveal = () => {
    setArchiveRevealing(true);
    if (archiveRevealTimer.current !== null) {
      window.clearTimeout(archiveRevealTimer.current);
    }
    archiveRevealTimer.current = window.setTimeout(() => {
      setArchiveRevealing(false);
      archiveRevealTimer.current = null;
    }, 2500);
  };
  return (
    <>
      {view === "cover" && (
        <>
          <Archive open={open} setView={changeView} revealing={archiveRevealing} />
          <Cover setView={changeView} onRevealStart={beginArchiveReveal} />
        </>
      )}
      {view === "home" && (
        <Home active={active} setActive={setActive} open={open} setView={changeView} />
      )}{" "}
      {view === "archive" && (
        <Archive open={open} setView={changeView} revealing={archiveRevealing} />
      )}{" "}
      {view === "detail" && (
        <Detail
          index={detail}
          open={open}
          back={() => changeView("archive")}
          setView={changeView}
        />
      )}
    </>
  );
}
