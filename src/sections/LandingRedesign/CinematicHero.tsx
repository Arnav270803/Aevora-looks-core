import { useLayoutEffect, useRef } from 'react';
import { goLogin, scrollToId } from './shared';
import './CinematicHero.css';

const ArrowUpRight = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const CinematicHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const knockoutRef = useRef<HTMLSpanElement>(null);

  // Align the knockout line's background with the hero background so the
  // outlined letters reveal the exact same (undarkened) region of the frame.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const line = knockoutRef.current;

    if (!hero || !line) {
      return undefined;
    }

    const align = () => {
      const heroBounds = hero.getBoundingClientRect();
      const lineBounds = line.getBoundingClientRect();
      line.style.backgroundSize = `${heroBounds.width}px ${heroBounds.height}px`;
      line.style.backgroundPosition = `${heroBounds.left - lineBounds.left}px ${heroBounds.top - lineBounds.top}px`;
    };

    align();

    const observer = new ResizeObserver(align);
    observer.observe(hero);
    observer.observe(line);
    document.fonts?.ready.then(align).catch(() => undefined);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cine-hero" ref={heroRef} aria-label="Aevora AI video campaigns">
      <div className="cine-hero__bg" aria-hidden="true" />

      <header className="cine-hero__nav">
        <a className="cine-hero__brand" href="/" aria-label="Aevora home">
          Aevora<span>.</span>
        </a>
        <nav className="cine-hero__links" aria-label="Primary navigation">
          <a href="#product" onClick={scrollToId('product')}>Product</a>
          <a href="#workflow" onClick={scrollToId('workflow')}>Workflow</a>
          <a href="#pricing" onClick={scrollToId('pricing')}>Pricing</a>
        </nav>
        <div className="cine-hero__actions">
          <button className="cine-hero__signin" type="button" onClick={goLogin}>
            Sign in
          </button>
          <button className="cine-hero__cta" type="button" onClick={goLogin}>
            <span>Create a video</span>
            <ArrowUpRight />
          </button>
        </div>
      </header>

      <div className="cine-hero__content">
        <h1 className="cine-hero__title">
          <span className="cine-hero__line cine-hero__line--solid">Make the ad</span>
          <span className="cine-hero__line cine-hero__line--knockout" ref={knockoutRef}>
            Before the shoot.
          </span>
        </h1>
        <p className="cine-hero__tagline">AI video campaigns from one brief.</p>
        <button className="cine-hero__cta cine-hero__cta--large" type="button" onClick={goLogin}>
          <span>Create a video</span>
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="cine-hero__marker" aria-hidden="true">
        <span>01</span>
        <em>/</em>
        <span>Hero</span>
      </div>
    </section>
  );
};

export default CinematicHero;
