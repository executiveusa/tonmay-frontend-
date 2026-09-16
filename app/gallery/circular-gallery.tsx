"use client";

import { CSSProperties, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
  position?: string;
}

interface CircularGalleryProps {
  items: GalleryItem[];
  autoRotateSpeed?: number;
}

export default function CircularGallery({
  items,
  autoRotateSpeed = 0.025,
}: CircularGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const autoRotatePausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const anglePerItem = 360 / items.length;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (rotation: number) => {
      rotationRef.current = rotation;
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotateY(${rotation}deg)`;
      }
      const normalized = ((-rotation / anglePerItem) % items.length + items.length) % items.length;
      setActiveIndex(Math.round(normalized) % items.length);
    };

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const start = section.offsetTop;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      isScrollingRef.current = true;
      paint(progress * -360);

      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 180);
    };

    const animate = () => {
      if (!isScrollingRef.current && !autoRotatePausedRef.current && !reducedMotionRef.current && window.innerWidth > 760) {
        paint(rotationRef.current - autoRotateSpeed);
      }
      frameRef.current = window.requestAnimationFrame(animate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [anglePerItem, autoRotateSpeed, items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => lightboxCloseRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
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
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lightboxTriggerRef.current?.focus();
    };
  }, [selectedIndex]);

  const openImage = (index: number, trigger: HTMLElement) => {
    lightboxTriggerRef.current = trigger;
    setSelectedIndex(index);
  };

  const keepDialogFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" && !lightboxRef.current?.contains(document.activeElement)) {
      event.preventDefault();
      lightboxCloseRef.current?.focus();
    }
  };

  const rotateBy = (direction: number) => {
    isScrollingRef.current = true;
    autoRotatePausedRef.current = true;
    rotationRef.current -= direction * anglePerItem;
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
    }
    const next = ((activeIndex + direction) % items.length + items.length) % items.length;
    setActiveIndex(next);
    window.setTimeout(() => {
      isScrollingRef.current = false;
      autoRotatePausedRef.current = false;
    }, 500);
  };

  return (
    <div className="archive-shell">
      <a className="skip-link" href="#archive">Skip to archive</a>

      <header className="archive-header">
        <Link className="brand" href="/" aria-label="Tonmay Production home">
          <span className="live-dot" />
          <span>tonmay</span>
        </Link>
        <span className="archive-header-label">Photography archive</span>
        <Link className="archive-home-link" href="/">Back home ↙</Link>
      </header>

      <main id="archive">
        <section className="circular-scroll" ref={sectionRef}>
          <div className="circular-sticky">
            <div className="archive-title">
              <p>Selected archive · Seattle / Western Washington</p>
              <h1>More ways<br /><em>of seeing.</em></h1>
            </div>

            <div
              className="circular-stage"
              aria-label="Circular photography gallery"
              onPointerEnter={() => { autoRotatePausedRef.current = true; }}
              onPointerLeave={() => { autoRotatePausedRef.current = false; }}
              onFocusCapture={() => { autoRotatePausedRef.current = true; }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) autoRotatePausedRef.current = false;
              }}
            >
              <div className="circular-wheel" ref={wheelRef}>
                {items.map((item, index) => (
                  <button
                    className="circular-card"
                    type="button"
                    key={item.image}
                    onClick={(event) => openImage(index, event.currentTarget)}
                    aria-label={`Open ${item.title}`}
                    style={{
                      "--item-angle": `${index * anglePerItem}deg`,
                    } as CSSProperties}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: item.position || "center" }}
                    />
                    <span className="circular-card-copy">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item.title}</strong>
                      <small>{item.category}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="archive-controls" aria-label="Gallery controls">
              <button type="button" onClick={() => rotateBy(-1)} aria-label="Previous image">←</button>
              <span aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => rotateBy(1)} aria-label="Next image">→</button>
            </div>

            <p className="archive-scroll-cue">Scroll to rotate ↓</p>

            <div className="archive-mobile-grid" aria-label="Photography archive">
              {items.map((item, index) => (
                <button
                  type="button"
                  className="archive-mobile-card"
                  key={item.image}
                  onClick={(event) => openImage(index, event.currentTarget)}
                  aria-label={`Open ${item.title}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: item.position || "center" }}
                  />
                  <span>
                    <small>{String(index + 1).padStart(2, "0")} · {item.category}</small>
                    <strong>{item.title}</strong>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="archive-closing">
          <p>Need a photographer with a point of view?</p>
          <h2>Let’s make<br />something real.</h2>
          <Link className="button button-acid" href="/#contact">Check availability ↗</Link>
        </section>
      </main>

      <footer className="archive-footer">
        <Link href="/" className="footer-brand">tonmay<span className="live-dot" /></Link>
        <p>Photography and select film work<br />across Western Washington.</p>
      </footer>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="archive-lightbox"
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${items[selectedIndex].title} image viewer`}
            aria-describedby={`archive-caption-${selectedIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            onKeyDown={keepDialogFocus}
          >
            <button
              ref={lightboxCloseRef}
              type="button"
              className="lightbox-close"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close image viewer"
            >
              Close ×
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={items[selectedIndex].image}
                alt={items[selectedIndex].title}
                style={{ objectPosition: items[selectedIndex].position || "center" }}
              />
              <figcaption id={`archive-caption-${selectedIndex}`}>
                <span>{String(selectedIndex + 1).padStart(2, "0")}</span>
                <strong>{items[selectedIndex].title}</strong>
                <span>{items[selectedIndex].category} · Photograph by Tonmay</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
