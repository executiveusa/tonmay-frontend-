"use client";

import { KeyboardEvent as ReactKeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
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
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHeaderScrolled(latest > 52);
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <a className="skip-link" href="#main">Skip to main content</a>
        <motion.div className="page-progress" style={{ scaleX: pageProgressSpring }} aria-hidden="true" />

        <header className={headerScrolled ? "site-header is-scrolled" : "site-header"}>
          <a href="#top" className="brand" onClick={closeMenu} aria-label="Tonmay Production home">
            <span className="live-dot" />
            <span>tonmay</span>
          </a>

          <nav
            id="mobile-navigation"
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
                style={reduceMotion ? undefined : { y: heroCopyY, opacity: heroCopyOpacity }}
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

          <section id="film" className="film-section">
            <motion.div
              className="film-image"
              initial={{ opacity: 0.72, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src="/images/hero-seattle-film.webp"
                alt="Camera operator filming the Seattle skyline"
                loading="lazy"
                decoding="async"
                initial={{ scale: 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
            <Reveal className="studio-image">
              <motion.img
                src="/images/story-crew-anton-v2.webp"
                alt="Visual storytellers collaborating on location"
                loading="lazy"
                decoding="async"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              <span>Built in the Pacific Northwest</span>
            </Reveal>
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
            <Reveal className="process-visual">
              <img src="/images/process-camera-anton-v2.webp" alt="Hands preparing professional camera equipment" loading="lazy" decoding="async" />
            </Reveal>
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
                Email the basics below. I’ll reply with availability and next steps.
              </p>
            </Reveal>

            <Reveal className="inquiry-panel">
              <p className="inquiry-label">What to include</p>
              <ol>
                <li><span>01</span><strong>What you’re making</strong></li>
                <li><span>02</span><strong>Where and when it happens</strong></li>
                <li><span>03</span><strong>How you’ll use the photos or film</strong></li>
                <li><span>04</span><strong>Your working budget, if known</strong></li>
              </ol>
              <a
                className="button button-acid inquiry-button"
                href="mailto:tonmay.production@gmail.com?subject=Tonmay%20Production%20project%20inquiry"
              >
                Email Tonmay <Arrow />
              </a>
              <p className="inquiry-note">Opens your email app to tonmay.production@gmail.com.</p>
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
