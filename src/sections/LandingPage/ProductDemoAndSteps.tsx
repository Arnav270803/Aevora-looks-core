import { useState } from 'react';
import { Check, Volume2, VolumeX } from 'lucide-react';
import './ProductDemoAndSteps.css';

const TABS = ['Create', 'Edit', 'Collaborate', 'Translate', 'Publish'];

const FILM_FRAMES = [
  {
    src: '/assets/studio-demo/scene-01-product-hero.png',
    alt: 'Aevora serum product reveal',
    objectPosition: '96% center',
  },
  {
    src: '/assets/studio-demo/scene-02-water-proof.png',
    alt: 'Aevora serum surrounded by water',
    objectPosition: '38% center',
  },
  {
    src: '/assets/studio-demo/scene-03-skin-benefit.png',
    alt: 'Skincare benefit close-up',
    objectPosition: '44% center',
  },
  {
    src: '/assets/studio-demo/scene-04-serum-macro.png',
    alt: 'Macro serum texture',
    objectPosition: '56% center',
  },
  {
    src: '/assets/studio-demo/scene-05-closing-product.png',
    alt: 'Aevora serum closing frame',
    objectPosition: '66% center',
  },
];

const ProductDemoAndSteps = () => {
  const [activeTab, setActiveTab] = useState('Edit');
  const [muted, setMuted] = useState(true);

  return (
    <section className="workflow-showcase" aria-label="Aevora workflow video">
      <div className="workflow-transition" aria-label="20 second ad ready to publish">
        <div className="workflow-transition__rail" aria-hidden="true" />

        <div className="workflow-filmstrip">
          <div className="workflow-filmstrip__frames">
            {FILM_FRAMES.map((frame) => (
              <div className="workflow-filmstrip__frame" key={frame.src}>
                <img
                  src={frame.src}
                  alt={frame.alt}
                  style={{ objectPosition: frame.objectPosition }}
                />
              </div>
            ))}
          </div>
          <span className="workflow-filmstrip__playhead" aria-hidden="true" />
        </div>

        <div className="workflow-render-status">
          <span>20 sec ad</span>
          <span className="workflow-render-status__divider" aria-hidden="true" />
          <span className="workflow-render-status__ready">
            <Check size={14} strokeWidth={3} aria-hidden="true" />
            Ready to publish
          </span>
        </div>
      </div>

      <div className="workflow-showcase__content">
        <div className="workflow-media-shell">
          <div className="workflow-media-shell__controls">
            <div className="workflow-tabs" role="tablist" aria-label="Aevora workflow stages">
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    className={isActive ? 'workflow-tab workflow-tab--active' : 'workflow-tab'}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <button
              className="workflow-media-shell__sound"
              type="button"
              onClick={() => setMuted((isMuted) => !isMuted)}
              aria-label={muted ? 'Unmute demo video' : 'Mute demo video'}
              title={muted ? 'Unmute video' : 'Mute video'}
            >
              {muted ? <VolumeX size={21} /> : <Volume2 size={21} />}
            </button>
          </div>

          <div className="workflow-video">
            <video
              src="/DRINK COMMERCIAL - Daniel Schiffer style.mp4"
              autoPlay
              loop
              muted={muted}
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoAndSteps;
