"use client";

import { FormEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const photography = [
  {
    number: "01",
    title: "Natural light",
    category: "Portrait / editorial",
    image: "/images/portfolio/natural-portrait.webp",
    position: "center",
  },
  {
    number: "02",
    title: "Built environment",
    category: "Portrait / style",
    image: "/images/portfolio/editorial-portrait.webp",
    position: "center 38%",
  },
  {
    number: "03",
    title: "Alpine weather",
    category: "Landscape / Northwest",
    image: "/images/portfolio/alpine-rainbow.webp",
    position: "center",
  },
  {
    number: "04",
    title: "Moonrise",
    category: "Landscape / atmosphere",
    image: "/images/portfolio/moonrise.webp",
    position: "center",
  },
  {
    number: "05",
    title: "After light",
    category: "Portrait / editorial",
    image: "/images/portfolio/moody-portrait.webp",
    position: "center 30%",
  },
  {
    number: "06",
    title: "On the bridge",
    category: "Portrait / environment",
    image: "/images/portfolio/bridge-portrait.webp",
    position: "center",
  },
  {
    number: "07",
    title: "Open expression",
    category: "Portrait / monochrome",
    image: "/images/portfolio/monochrome-portrait.webp",
    position: "center 25%",
  },
  {
    number: "08",
    title: "Summer study",
    category: "Portrait / lifestyle",
    image: "/images/portfolio/summer-portrait.webp",
    position: "center",
  },
];

const capabilities = [
  {
    number: "01",
    title: "Portraits & editorial",
    copy: "Natural, directed portraits for artists, founders, teams, publications, and personal brands.",
  },
  {
    number: "02",
    title: "Events & culture",
    copy: "Honest coverage of gatherings, performances, and community moments—without turning the day into a photo shoot.",
  },
  {
    number: "03",
    title: "Brands & campaigns",
    copy: "A consistent set of campaign, lifestyle, and behind-the-scenes images for your website, press, social media, and launches.",
  },
  {
    number: "04",
    title: "Film & documentary",
    copy: "Select interviews, documentaries, music projects, and brand films—from planning and filming through the final edit.",
  },
];


type InquiryDraft = {
  projectType: string;
  projectSummary: string;
  location: string;
  date: string;
  usage: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
};

const emptyInquiry: InquiryDraft = {
  projectType: "",
  projectSummary: "",
  location: "",
  date: "",
  usage: "",
  budget: "",
  name: "",
  email: "",
  phone: "",
};

const projectTypes = ["Portrait", "Event", "Brand", "Documentary", "Film", "Not sure yet"];

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function TonmaySite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [inquiryStep, setInquiryStep] = useState(0);
  const [inquiryDraft, setInquiryDraft] = useState<InquiryDraft>(emptyInquiry);
  const [inquiryReady, setInquiryReady] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const restoreMenuFocusRef = useRef(false);
  const filmRef = useRef<HTMLElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress: pageProgress } = useScroll();
  const pageProgressSpring = useSpring(pageProgress, { stiffness: 120, damping: 30, mass: 0.35 });
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // This adjusts the camera framing inside a sticky stage only. Native scroll
  // remains untouched, so mobile momentum and address-bar behavior stay intact.
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "8%"]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1.025, 1.075]);
  const heroSkyY = useTransform(heroProgress, [0, 1], ["0%", "3%"]);
  // Keep the subject perfectly registered with the base image. Its duplicate
  // exists only to place Tonmay in front of the headline, never to alter him.
  const heroForegroundY = useTransform(heroProgress, [0, 1], ["0%", "8%"]);
  const heroForegroundScale = useTransform(heroProgress, [0, 1], [1.025, 1.075]);
  const heroCopyY = useTransform(heroProgress, [0, 1], ["0%", "12%"]);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.86], [1, 0.12]);
  const heroFrameY = useTransform(heroProgress, [0, 1], ["0%", "-2%"]);
  const heroFrameScale = useTransform(heroProgress, [0, 1], [1, 1.018]);
  const heroFrameOpacity = useTransform(heroProgress, [0, 0.86], [1, 0.4]);
  const { scrollYProgress: filmProgress } = useScroll({ target: filmRef, offset: ["start end", "end start"] });
  const { scrollYProgress: studioProgress } = useScroll({ target: studioRef, offset: ["start end", "end start"] });
  const { scrollYProgress: processProgress } = useScroll({ target: processRef, offset: ["start end", "end start"] });
  // Editorial images get a small camera drift, inside their own clipped frames.
  // This never changes native scroll or the pixels of the photographs.
  const filmImageY = useTransform(filmProgress, [0, 0.5, 1], ["-7%", "0%", "7%"]);
  const filmImageScale = useTransform(filmProgress, [0, 0.5, 1], [1.1, 1.025, 1.1]);
  const studioImageY = useTransform(studioProgress, [0, 0.5, 1], ["-6%", "0%", "6%"]);
  const studioImageScale = useTransform(studioProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);
  const processImageY = useTransform(processProgress, [0, 0.5, 1], ["-5%", "0%", "5%"]);
  const processImageScale = useTransform(processProgress, [0, 0.5, 1], [1.07, 1.015, 1.07]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHeaderScrolled(latest > 52);
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("tonmay-project-inquiry");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<InquiryDraft>;
        setInquiryDraft({ ...emptyInquiry, ...parsed });
      }
    } catch {
      // A blocked or malformed localStorage entry should never block the form.
    } finally {
      setInquiryReady(true);
    }
  }, []);

  useEffect(() => {
    if (!inquiryReady || inquiryStatus === "success") return;
    try {
      window.localStorage.setItem("tonmay-project-inquiry", JSON.stringify(inquiryDraft));
    } catch {
      // Autosave is a convenience; the form remains usable without storage.
    }
  }, [inquiryDraft, inquiryReady, inquiryStatus]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      if (restoreMenuFocusRef.current) {
        restoreMenuFocusRef.current = false;
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      return;
    }

    const links = Array.from(mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const firstLink = links[0];
    const lastLink = links.at(-1);
    window.requestAnimationFrame(() => firstLink?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        restoreMenuFocusRef.current = true;
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !firstLink || !lastLink) return;

      if (event.shiftKey && document.activeElement === firstLink) {
        event.preventDefault();
        menuButtonRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        menuButtonRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === menuButtonRef.current) {
        event.preventDefault();
        firstLink.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (selectedPhoto === null) return;

    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => lightboxCloseRef.current?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = lightboxRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lightboxTriggerRef.current?.focus();
    };
  }, [selectedPhoto]);

  function openPhoto(index: number, trigger: HTMLElement) {
    lightboxTriggerRef.current = trigger;
    setSelectedPhoto(index);
  }

  function keepDialogFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab" && !lightboxRef.current?.contains(document.activeElement)) {
      event.preventDefault();
      lightboxCloseRef.current?.focus();
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }


  function updateInquiry<K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) {
    setInquiryDraft((current) => ({ ...current, [key]: value }));
    if (inquiryStatus === "error") {
      setInquiryStatus("idle");
      setInquiryMessage("");
    }
  }

  function advanceInquiry() {
    if (inquiryStep === 0 && (!inquiryDraft.projectType || !inquiryDraft.projectSummary.trim())) {
      setInquiryStatus("error");
      setInquiryMessage("Choose a project type and add one sentence about what you need.");
      return;
    }
    if (inquiryStep === 1 && (!inquiryDraft.location.trim() || !inquiryDraft.usage.trim())) {
      setInquiryStatus("error");
      setInquiryMessage("Add the location and how you plan to use the work.");
      return;
    }
    setInquiryStatus("idle");
    setInquiryMessage("");
    setInquiryStep((step) => Math.min(step + 1, 2));
  }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inquiryDraft.name.trim() || !inquiryDraft.email.trim()) {
      setInquiryStatus("error");
      setInquiryMessage("Add your name and email so Tonmay can reply.");
      return;
    }

    setInquiryStatus("sending");
    setInquiryMessage("Sending your project details…");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryDraft),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your message could not be sent.");
      }

      setInquiryStatus("success");
      setInquiryMessage("Received. Tonmay has your project details and can reply from there.");
      setInquiryDraft(emptyInquiry);
      setInquiryStep(0);
      try {
        window.localStorage.removeItem("tonmay-project-inquiry");
      } catch {}
      if ("vibrate" in navigator) navigator.vibrate([45, 30, 80]);
    } catch (error) {
      setInquiryStatus("error");
      setInquiryMessage(error instanceof Error ? error.message : "Your message could not be sent. Please try again.");
      if ("vibrate" in navigator) navigator.vibrate(80);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <a className="skip-link" href="#main">Skip to main content</a>
        <motion.div className="page-progress" style={{ scaleX: pageProgressSpring }} aria-hidden="true" />

        <header className={`site-header${headerScrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}>
          <a href="#top" className="brand" onClick={closeMenu} aria-label="Tonmay Production home">
            <span className="live-dot" />
            <span>tonmay</span>
          </a>

          <nav
            id="mobile-navigation"
            ref={mobileNavRef}
            className={menuOpen ? "nav is-open" : "nav"}
            aria-label="Primary navigation"
          >
            <a href="#photography" onClick={closeMenu}>Work</a>
            <a href="/gallery" onClick={closeMenu}>Full gallery</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#contact" onClick={closeMenu} className="nav-project-link">Start a project</a>
          </nav>

          <a className="header-cta" href="#contact">
            Start a project <Arrow />
          </a>

          <button
            className="menu-button"
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </header>

        <main id="main">
          <section id="top" className="hero" ref={heroRef}>
            <div className="hero-stage">
              <div className="hero-image">
                <motion.img
                  className="hero-image-base"
                  src="/images/tonmay-mountain-hero-4k.webp"
                  alt="Tonmay standing with his camera above a sea of clouds in the mountains"
                  style={reduceMotion ? undefined : { y: heroImageY, scale: heroImageScale }}
                />
                <motion.div
                  className="hero-depth hero-depth-sky"
                  style={reduceMotion ? undefined : { y: heroSkyY }}
                  aria-hidden="true"
                >
                  <img src="/images/tonmay-mountain-hero-4k.webp" alt="" />
                </motion.div>
              </div>

              <div className="hero-wash" aria-hidden="true" />
              <motion.div
                className="hero-depth hero-depth-foreground"
                style={reduceMotion ? undefined : { y: heroForegroundY, scale: heroForegroundScale }}
                aria-hidden="true"
              >
                <img src="/images/tonmay-mountain-hero-4k.webp" alt="" />
              </motion.div>
              <motion.div
                className="hero-frame"
                style={reduceMotion ? undefined : { y: heroFrameY, scale: heroFrameScale, opacity: heroFrameOpacity }}
                aria-hidden="true"
              >
                <span>TONMAY / VISUAL STORIES</span>
                <i />
                <span>001</span>
              </motion.div>

              <div className="hero-meta" aria-hidden="true">
                <span>Seattle / Western Washington</span>
                <span>Portraits / Events / Brands</span>
                <span>Photo / Select film</span>
              </div>

              <motion.div
                className="hero-copy"
                style={reduceMotion || isMobile ? undefined : { y: heroCopyY, opacity: heroCopyOpacity }}
              >
                <p className="eyebrow">Portraits · Events · Brands · Documentary</p>
                <h1>
                  <span>Photography</span>
                  <br />
                  <em>with a point of view.</em>
                </h1>
                <div className="hero-bottom">
                  <p className="hero-deck">
                    Photography for people, teams, and organizations across Seattle and Western Washington.
                  </p>
                  <div className="hero-actions">
                    <motion.a
                      className="button button-acid"
                      href="#photography"
                      whileHover={{ y: -4, scale: 1.025 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View selected work <Arrow down />
                    </motion.a>
                    <motion.a className="text-link" href="#contact" whileHover={{ x: 5 }}>
                      Start a project <Arrow />
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              <a className="scroll-cue" href="#photography">
                Scroll to explore <Arrow down />
              </a>
            </div>
          </section>

          <div className="proof-strip" aria-label="What Tonmay photographs">
            <span>Seattle + Western Washington</span>
            <span>Portraits + events</span>
            <span>Brands + documentary</span>
            <span>Photography + select film</span>
          </div>

          <section id="photography" className="photography-section">
            <Reveal className="gallery-gateway">
              <span>01 — Recent work</span>
              <strong>Photography</strong>
              <span>Select any image to enlarge ↓</span>
            </Reveal>

            <Reveal className="section-heading photo-heading">
              <p className="eyebrow">Portraits / events / documentary</p>
              <h2>Made to feel<br />like you were there.</h2>
              <p>
                Portraits, events, and places photographed with attention to the people in them.
              </p>
            </Reveal>

            <div className="photo-grid" aria-label="Selected photography">
              {photography.map((photo, index) => (
                <motion.button
                  className={`photo-card photo-card-${index + 1}`}
                  type="button"
                  key={photo.number}
                  onClick={(event) => openPhoto(index, event.currentTarget)}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.62, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover="hover"
                  aria-label={`Open ${photo.title}`}
                >
                  <span className="photo-card-image">
                    <motion.img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: photo.position }}
                      variants={{ hover: { scale: 1.035 } }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <span className="photo-card-caption">
                    <span>{photo.number}</span>
                    <strong>{photo.title}</strong>
                    <span>{photo.category}</span>
                    <i aria-hidden="true">＋</i>
                  </span>
                </motion.button>
              ))}
            </div>

            <Reveal className="instagram-proof">
              <div>
                <p className="eyebrow">More recent work</p>
                <h3>See what I’m<br />shooting now.</h3>
              </div>
              <p>
                See the latest portraits, events, and documentary work.
              </p>
              <div className="instagram-actions">
                <motion.a
                  className="button button-dark"
                  href="/gallery"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore full gallery <Arrow />
                </motion.a>
                <a
                  className="text-link"
                  href="https://www.instagram.com/tonmayproduction/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Instagram <Arrow />
                </a>
              </div>
            </Reveal>
          </section>

          <section id="film" className="film-section" ref={filmRef}>
            <motion.div
              className="film-image parallax-frame"
              initial={{ opacity: 0.72 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src="/images/hero-seattle-film.webp"
                alt="Camera operator filming the Seattle skyline"
                loading="lazy"
                decoding="async"
                style={reduceMotion ? undefined : { y: filmImageY, scale: filmImageScale }}
              />
            </motion.div>
            <Reveal className="film-copy">
              <p className="eyebrow">02 — Film & documentary</p>
              <h2>Need more<br />than stills?</h2>
              <p>
                For interviews, documentaries, music projects, and brand films, I can handle the shoot and the edit.
              </p>
              <p className="film-note">
                Film projects are scoped individually. I can work with a small, focused setup or assemble the right crew for a larger production.
              </p>
              <a className="text-link light" href="#contact">Ask about a film project <Arrow /></a>
            </Reveal>
          </section>

          <section id="services" className="capabilities-section">
            <Reveal className="capability-intro">
              <p className="eyebrow">Ways to work together</p>
              <h2>Choose what<br />you need.</h2>
              <p>
                Choose photography, film, or both.
              </p>
            </Reveal>
            <div className="capability-list">
              {capabilities.map((item, index) => (
                <motion.article
                  className="capability"
                  key={item.number}
                  initial={{ opacity: 0, x: 34 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 8 }}
                >
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </motion.article>
              ))}
            </div>
          </section>

          <section id="about" className="studio-section">
            <div ref={studioRef}>
              <Reveal className="studio-image parallax-frame">
                <motion.img
                  src="/images/story-crew-anton-v2.webp"
                  alt="Visual storytellers collaborating on location"
                  loading="lazy"
                  decoding="async"
                  style={reduceMotion ? undefined : { y: studioImageY, scale: studioImageScale }}
                />
                <span>Built in the Pacific Northwest</span>
              </Reveal>
            </div>
            <Reveal className="studio-copy">
              <p className="eyebrow">About Tonmay</p>
              <p>
                I’m a Seattle-area photographer. I work with real people, real places, and the moments between the planned ones.
              </p>
              <p>
                I can lead a quiet portrait session, document a crowded event, build a complete image library for a brand, or expand the same point of view into a film.
              </p>
              <a className="text-link light" href="#contact">Tell me about your project <Arrow /></a>
            </Reveal>
          </section>

          <section className="process-section">
            <div ref={processRef}>
              <Reveal className="process-visual parallax-frame">
                <motion.img
                  src="/images/process-camera-anton-v2.webp"
                  alt="Hands preparing professional camera equipment"
                  loading="lazy"
                  decoding="async"
                  style={reduceMotion ? undefined : { y: processImageY, scale: processImageScale }}
                />
              </Reveal>
            </div>
            <Reveal className="process-copy">
              <p className="eyebrow">How it works</p>
              <h2>From inquiry<br />to final files.</h2>
              <ol>
                <li><span>01</span><div><strong>Tell me what you need</strong><p>Share the goal, date, location, and how you plan to use the work.</p></div></li>
                <li><span>02</span><div><strong>Get a clear plan</strong><p>I’ll confirm the approach, schedule, deliverables, and price before we begin.</p></div></li>
                <li><span>03</span><div><strong>Do the shoot</strong><p>I’ll guide what needs direction and leave room for the moments that cannot be planned.</p></div></li>
                <li><span>04</span><div><strong>Receive final files</strong><p>You’ll get a carefully edited collection, ready for the places you need to use it.</p></div></li>
              </ol>
            </Reveal>
          </section>

          <section id="contact" className="contact-section">
            <Reveal className="contact-intro">
              <p className="eyebrow">Check availability</p>
              <h2>Tell me about<br />your shoot.</h2>
              <p>
                Three quick steps. Your answers save on this device as you go, so you can come back without starting over.
              </p>
            </Reveal>

            <Reveal className="inquiry-panel">
              {inquiryStatus === "success" ? (
                <div className="inquiry-success" role="status" aria-live="polite">
                  <span aria-hidden="true">✓</span>
                  <p className="inquiry-label">Project received</p>
                  <h3>That’s it.</h3>
                  <p>{inquiryMessage}</p>
                  <button
                    className="text-link light inquiry-reset"
                    type="button"
                    onClick={() => {
                      setInquiryStatus("idle");
                      setInquiryMessage("");
                    }}
                  >
                    Send another project <Arrow />
                  </button>
                </div>
              ) : (
                <form className="project-form" onSubmit={submitInquiry}>
                  <div className="inquiry-progress" aria-label={`Step ${inquiryStep + 1} of 3`}>
                    <span>Step {inquiryStep + 1} / 3</span>
                    <div aria-hidden="true"><i style={{ width: `${((inquiryStep + 1) / 3) * 100}%` }} /></div>
                    <small>{inquiryReady ? "Autosaved on this device" : "Loading saved answers…"}</small>
                  </div>

                  {inquiryStep === 0 && (
                    <fieldset className="inquiry-step">
                      <legend>What are you making?</legend>
                      <p>Pick the closest fit, then give Tonmay one sentence.</p>
                      <div className="project-type-grid">
                        {projectTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={inquiryDraft.projectType === type ? "project-type is-selected" : "project-type"}
                            aria-pressed={inquiryDraft.projectType === type}
                            onClick={() => updateInquiry("projectType", type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <label>
                        <span>What do you need?</span>
                        <textarea
                          rows={3}
                          maxLength={500}
                          value={inquiryDraft.projectSummary}
                          onChange={(event) => updateInquiry("projectSummary", event.target.value)}
                          placeholder="Example: portraits for our new team page."
                          required
                        />
                      </label>
                    </fieldset>
                  )}

                  {inquiryStep === 1 && (
                    <fieldset className="inquiry-step">
                      <legend>Where, when, and what for?</legend>
                      <div className="form-row">
                        <label>
                          <span>Location</span>
                          <input
                            value={inquiryDraft.location}
                            onChange={(event) => updateInquiry("location", event.target.value)}
                            placeholder="Seattle, Tacoma, on-site…"
                            autoComplete="street-address"
                            required
                          />
                        </label>
                        <label>
                          <span>Date, if known</span>
                          <input
                            type="date"
                            value={inquiryDraft.date}
                            onChange={(event) => updateInquiry("date", event.target.value)}
                          />
                        </label>
                      </div>
                      <label>
                        <span>How will you use the photos or film?</span>
                        <input
                          value={inquiryDraft.usage}
                          onChange={(event) => updateInquiry("usage", event.target.value)}
                          placeholder="Website, social, campaign, personal…"
                          required
                        />
                      </label>
                      <label>
                        <span>Working budget, if known</span>
                        <input
                          value={inquiryDraft.budget}
                          onChange={(event) => updateInquiry("budget", event.target.value)}
                          placeholder="Optional"
                          inputMode="text"
                        />
                      </label>
                    </fieldset>
                  )}

                  {inquiryStep === 2 && (
                    <fieldset className="inquiry-step">
                      <legend>Where should Tonmay reply?</legend>
                      <div className="form-row">
                        <label>
                          <span>Name</span>
                          <input
                            value={inquiryDraft.name}
                            onChange={(event) => updateInquiry("name", event.target.value)}
                            autoComplete="name"
                            required
                          />
                        </label>
                        <label>
                          <span>Email</span>
                          <input
                            type="email"
                            value={inquiryDraft.email}
                            onChange={(event) => updateInquiry("email", event.target.value)}
                            autoComplete="email"
                            inputMode="email"
                            required
                          />
                        </label>
                      </div>
                      <label>
                        <span>Phone, optional</span>
                        <input
                          type="tel"
                          value={inquiryDraft.phone}
                          onChange={(event) => updateInquiry("phone", event.target.value)}
                          autoComplete="tel"
                          inputMode="tel"
                        />
                      </label>
                      <div className="inquiry-review">
                        <span>{inquiryDraft.projectType || "Project"}</span>
                        <strong>{inquiryDraft.projectSummary || "Your project details"}</strong>
                        <small>{inquiryDraft.location}{inquiryDraft.date ? ` · ${inquiryDraft.date}` : ""}</small>
                      </div>
                    </fieldset>
                  )}

                  <div className="inquiry-actions">
                    {inquiryStep > 0 && (
                      <button className="text-link light" type="button" onClick={() => setInquiryStep((step) => step - 1)}>
                        ← Back
                      </button>
                    )}
                    {inquiryStep < 2 ? (
                      <button className="button button-acid inquiry-button" type="button" onClick={advanceInquiry}>
                        Continue <Arrow />
                      </button>
                    ) : (
                      <button className="button button-acid submit-button" type="submit" disabled={inquiryStatus === "sending"}>
                        {inquiryStatus === "sending" ? "Sending…" : "Send project"} <Arrow />
                      </button>
                    )}
                  </div>

                  <p
                    className={inquiryStatus === "error" ? "form-status is-error" : "form-status"}
                    role="status"
                    aria-live="polite"
                  >
                    {inquiryMessage || "No account needed. Tonmay receives the answers by email."}
                  </p>
                </form>
              )}
            </Reveal>
          </section>
        </main>

        <footer>
          <a href="#top" className="footer-brand">tonmay<span className="live-dot" /></a>
          <div>
            <p>Portraits, events, brands, and documentary work<br />across Seattle and Western Washington.</p>
            <a href="/gallery">Full gallery <Arrow /></a>
            <a href="https://www.instagram.com/tonmayproduction/" target="_blank" rel="noreferrer">Instagram <Arrow /></a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Tonmay Production</p>
        </footer>

        <AnimatePresence>
          {selectedPhoto !== null && (
            <motion.div
              className="lightbox"
              ref={lightboxRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${photography[selectedPhoto].title} image viewer`}
              aria-describedby={`photo-caption-${selectedPhoto}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              onKeyDown={keepDialogFocus}
            >
              <motion.button
                ref={lightboxCloseRef}
                type="button"
                className="lightbox-close"
                onClick={() => setSelectedPhoto(null)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                aria-label="Close image viewer"
              >
                Close ×
              </motion.button>
              <motion.figure
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={photography[selectedPhoto].image}
                  alt={photography[selectedPhoto].title}
                  style={{ objectPosition: photography[selectedPhoto].position }}
                />
                <figcaption id={`photo-caption-${selectedPhoto}`}>
                  <span>{photography[selectedPhoto].number}</span>
                  <strong>{photography[selectedPhoto].title}</strong>
                  <span>{photography[selectedPhoto].category}</span>
                </figcaption>
              </motion.figure>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
