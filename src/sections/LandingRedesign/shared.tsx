import type { ReactNode } from 'react';

export const ASSETS = {
  input: '/assets/studio-demo/aurora-input-product.webp',
  scene01: '/assets/studio-demo/scene-01-product-hero.webp',
  scene02: '/assets/studio-demo/scene-02-water-proof.webp',
  scene03: '/assets/studio-demo/scene-03-skin-benefit.webp',
  scene04: '/assets/studio-demo/scene-04-serum-macro.webp',
  scene05: '/assets/studio-demo/scene-05-closing-product.webp',
} as const;

export const goLogin = () => {
  window.location.href = '/login';
};

export const scrollToId = (id: string) => (event: { preventDefault: () => void }) => {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

type FrameProps = {
  className: string;
  label: string;
  id?: string;
  children: ReactNode;
};

/**
 * One artboard from the design reference. `.a-ratio` fixes the reference
 * aspect ratio, `.a-stage` holds the content and may grow past it.
 */
export const Frame = ({ className, label, id, children }: FrameProps) => (
  <section id={id} className={`a-frame ${className}`} aria-label={label}>
    <span className="a-ratio" aria-hidden="true" />
    <div className="a-stage">{children}</div>
  </section>
);
