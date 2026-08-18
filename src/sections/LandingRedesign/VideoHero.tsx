import { useEffect, useRef } from 'react';
import { ASSETS, Frame, goLogin, scrollToId } from './shared';

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React sets `muted` as a property, which some browsers evaluate too late to
    // allow autoplay — set it before the first play attempt.
    video.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
  }, []);

  return (
    <Frame className="a-video-hero" label="Aevora — your product, in motion">
      <div className="a-video-media" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero/hero-poster.jpg"
        >
          <source src="/assets/hero/hero-loop.webm" type="video/webm" />
          <source src="/assets/hero/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="a-video-shade" aria-hidden="true" />

      <header className="a-video-nav">
        <div className="a-wordmark a-wordmark-light">
          Aevora<span className="a-wordmark-dot">.</span>
        </div>
        <nav className="a-video-nav-links" aria-label="Primary navigation">
          <a href="#product" onClick={scrollToId('product')}>Product</a>
          <a href="#workflow" onClick={scrollToId('workflow')}>Workflow</a>
          <a href="#pricing" onClick={scrollToId('pricing')}>Pricing</a>
        </nav>
        <div className="a-video-nav-actions">
          <a href="/login">Sign in</a>
          <button type="button" className="a-video-cta" onClick={goLogin}>
            Create a video <span>↗</span>
          </button>
        </div>
      </header>

      <div className="a-video-cards" aria-hidden="true">
        <figure className="a-video-card a-video-card-1">
          <img src={ASSETS.scene02} alt="" loading="eager" />
        </figure>
        <figure className="a-video-card a-video-card-2">
          <img src={ASSETS.scene04} alt="" loading="eager" />
        </figure>
        <figure className="a-video-card a-video-card-3">
          <img src={ASSETS.scene01} alt="" loading="eager" />
        </figure>
      </div>

      <div className="a-video-copy">
        <h1>
          <span>YOUR PRODUCT.</span>
          <span>IN MOTION.</span>
        </h1>
        <p className="a-video-sub">Create campaign-ready AI videos from one brief.</p>
        <div className="a-video-actions">
          <button type="button" className="a-video-cta" onClick={goLogin}>
            Create a video <span>↗</span>
          </button>
          <button type="button" className="a-video-watch" onClick={scrollToId('workflow')}>
            <b>▶</b> Watch 00:20
          </button>
        </div>
      </div>
    </Frame>
  );
};

export default VideoHero;
