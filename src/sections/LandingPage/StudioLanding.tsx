import { useEffect, useState } from 'react';
import {
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Film,
  GripVertical,
  Menu,
  Music2,
  Pause,
  Play,
  Plus,
  Redo2,
  Scissors,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  WandSparkles,
  X,
} from 'lucide-react';
import './StudioLanding.css';

type Scene = {
  id: string;
  title: string;
  src: string;
  duration: number;
  objectPosition: string;
  scale: number;
};

const scenes: Scene[] = [
  {
    id: '01',
    title: 'Product reveal',
    src: '/assets/studio-demo/scene-01-product-hero.png',
    duration: 4,
    objectPosition: '96% center',
    scale: 1.18,
  },
  {
    id: '02',
    title: 'Hydration proof',
    src: '/assets/studio-demo/scene-02-water-proof.png',
    duration: 4,
    objectPosition: '38% center',
    scale: 1,
  },
  {
    id: '03',
    title: 'Skin benefit',
    src: '/assets/studio-demo/scene-03-skin-benefit.png',
    duration: 4,
    objectPosition: '44% center',
    scale: 1,
  },
  {
    id: '04',
    title: 'Serum detail',
    src: '/assets/studio-demo/scene-04-serum-macro.png',
    duration: 4,
    objectPosition: '56% center',
    scale: 1,
  },
  {
    id: '05',
    title: 'Closing frame',
    src: '/assets/studio-demo/scene-05-closing-product.png',
    duration: 4,
    objectPosition: '66% center',
    scale: 1,
  },
];

const voiceWave = [
  22, 42, 31, 60, 48, 36, 70, 54, 44, 63, 32, 51, 73, 43, 27, 59, 39, 67, 49, 34,
  56, 74, 38, 46, 61, 29, 52, 68, 36, 57, 42, 72, 48, 34, 64, 45, 27, 58, 70, 39,
  50, 65, 33, 55, 76, 41, 62, 35, 69, 47, 31, 58, 44, 66, 37, 53, 72, 40, 60, 29,
];

const musicWave = [
  32, 51, 43, 61, 36, 55, 46, 69, 38, 57, 42, 63, 34, 52, 72, 41, 58, 47, 65, 35,
  54, 44, 68, 39, 59, 48, 71, 36, 53, 45, 64, 33, 56, 49, 67, 40, 61, 43, 70, 37,
  55, 46, 65, 34, 58, 42, 69, 38, 52, 47, 63, 35, 57, 44, 71, 39, 60, 48, 66, 36,
];

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.min(20, seconds));
  return `00:${Math.floor(safeSeconds).toString().padStart(2, '0')}`;
};

const Waveform = ({ bars, subtle = false }: { bars: number[]; subtle?: boolean }) => (
  <span className={`studio-waveform${subtle ? ' studio-waveform--subtle' : ''}`} aria-hidden="true">
    {Array.from({ length: bars.length * 3 }, (_, index) => {
      const baseHeight = bars[index % bars.length] ?? 40;
      const variation = [0.72, 1, 0.84][index % 3] ?? 1;
      return <span key={index} style={{ height: `${baseHeight * variation}%` }} />;
    })}
  </span>
);

const StudioLanding = () => {
  const [activeScene, setActiveScene] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeSceneData = scenes[activeScene] ?? scenes[0]!;

  useEffect(() => {
    document.title = 'Aevora | AI Video Studio';
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setCurrentTime((previous) => {
        const next = previous + 0.1;

        if (next >= 20) {
          setIsPlaying(false);
          setActiveScene(0);
          return 0;
        }

        setActiveScene(Math.min(scenes.length - 1, Math.floor(next / 4)));
        return next;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const chooseScene = (index: number) => {
    setActiveScene(index);
    setCurrentTime(index * 4);
    setIsPlaying(false);
  };

  const startWorkflow = () => {
    setActiveScene(0);
    setCurrentTime(0);
    setIsPlaying(true);
    document.querySelector('#studio-preview')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const seekTimeline = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - bounds.left) / bounds.width) * 20;
    setCurrentTime(Math.max(0, Math.min(20, next)));
    setActiveScene(Math.min(scenes.length - 1, Math.floor(Math.min(19.99, next) / 4)));
  };

  const playheadPosition = `${(currentTime / 20) * 100}%`;

  return (
    <main className="studio-landing">
      <section className="studio-stage" aria-label="Aevora AI video studio">
        <header className="studio-header">
          <div className="studio-header__left">
            <a className="studio-brand" href="/" aria-label="Aevora home">
              Aevora
            </a>
            <nav className="studio-nav" aria-label="Primary navigation">
              <a href="#studio-preview">Product</a>
              <a href="#timeline">Workflow</a>
              <a href="#pricing">Pricing</a>
            </nav>
          </div>

          <div className="studio-header__actions">
            <button className="studio-sign-in" type="button" onClick={goToLogin}>
              Sign in
            </button>
            <button className="studio-create-ad" type="button" onClick={goToLogin}>
              <span>Create an ad</span>
              <ChevronRight size={20} strokeWidth={2} />
            </button>
            <button
              className="studio-mobile-menu"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={27} /> : <Menu size={29} />}
            </button>
            <button className="studio-mobile-create" type="button" onClick={goToLogin} aria-label="Create an ad">
              <Sparkles size={23} />
            </button>
          </div>

          {isMenuOpen && (
            <nav className="studio-mobile-nav" aria-label="Mobile navigation">
              <a href="#studio-preview" onClick={() => setIsMenuOpen(false)}>Product</a>
              <a href="#timeline" onClick={() => setIsMenuOpen(false)}>Workflow</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <button type="button" onClick={goToLogin}>Sign in</button>
            </nav>
          )}
        </header>

        <div className="studio-stage__body">
          <div className="studio-copy-pane">
            <div className="studio-copy">
              <p className="studio-eyebrow">AI video studio</p>
              <h1>
                <span className="studio-heading-line">AI video ads</span>
                {' '}
                <span className="studio-heading-line">from one product image.</span>
              </h1>
              <p className="studio-subtitle">
                Upload a product. Direct the story.<br />
                Export ready-to-run videos.
              </p>
              <div className="studio-copy__actions">
                <button className="studio-primary-cta" type="button" onClick={goToLogin}>
                  <span>Create a video</span>
                  <ChevronRight size={23} strokeWidth={1.8} />
                </button>
                <button className="studio-watch" type="button" onClick={startWorkflow}>
                  <span className="studio-watch__icon">
                    {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
                  </span>
                  Watch workflow
                </button>
              </div>
            </div>
          </div>

          <div id="studio-preview" className="studio-preview-pane">
            <img
              key={activeSceneData.id}
              src={activeSceneData.src}
              alt={`${activeSceneData.title} campaign frame`}
              style={{ objectPosition: activeSceneData.objectPosition, transform: `scale(${activeSceneData.scale})` }}
            />
            <div className="studio-preview-pane__shade" aria-hidden="true" />
          </div>

          <aside className="studio-scene-rail" aria-label="Video scenes">
            <div className="studio-scene-rail__inner">
              <div className="studio-scene-rail__heading">
                <span>Scenes</span>
                <button type="button" title="Add scene" aria-label="Add scene">
                  <Plus size={19} />
                </button>
              </div>
              <div className="studio-scenes">
                {scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    className={`studio-scene${activeScene === index ? ' studio-scene--active' : ''}`}
                    type="button"
                    onClick={() => chooseScene(index)}
                    aria-label={`Select scene ${scene.id}: ${scene.title}`}
                  >
                    <span className="studio-scene__number">{scene.id}</span>
                    <img src={scene.src} alt="" style={{ objectPosition: scene.objectPosition }} />
                    <span className="studio-scene__duration">0:04</span>
                    <GripVertical className="studio-scene__grip" size={17} />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="timeline" className="studio-editor" aria-label="Video timeline editor">
        <div className="studio-editor__toolbar">
          <div className="studio-editor__title">Timeline</div>
          <div className="studio-editor__tools">
            <button type="button" title="Undo" aria-label="Undo"><Undo2 size={18} /></button>
            <button type="button" title="Redo" aria-label="Redo"><Redo2 size={18} /></button>
            <span className="studio-tool-divider" />
            <button type="button" title="Split scene" aria-label="Split scene"><Scissors size={18} /></button>
            <button type="button" title="Duplicate scene" aria-label="Duplicate scene"><Copy size={17} /></button>
            <button type="button" title="Delete scene" aria-label="Delete scene"><Trash2 size={17} /></button>
            <span className="studio-tool-divider" />
            <button type="button" title="Enhance" aria-label="Enhance"><WandSparkles size={18} /></button>
          </div>
          <div className="studio-editor__toolbar-spacer" />
        </div>

        <div className="studio-mobile-playbar">
          <button type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <span>{formatTime(currentTime)} / 00:20</span>
        </div>

        <div className="studio-editor__body">
          <div className="studio-track-labels" aria-hidden="true">
            <div className="studio-track-labels__ruler" />
            <div className="studio-track-label"><Film size={17} /><span>Scenes</span><ChevronDown size={15} /></div>
            <div className="studio-track-label"><AudioLines size={18} /><span>Voiceover</span></div>
            <div className="studio-track-label"><Type size={18} /><span>Text</span></div>
            <div className="studio-track-label"><Music2 size={18} /><span>Music</span></div>
          </div>

          <div className="studio-timeline">
            <div className="studio-ruler">
              {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((second) => (
                <span key={second} style={{ left: `${(second / 20) * 100}%` }}>{formatTime(second)}</span>
              ))}
            </div>

            <div className="studio-scene-track" onClick={seekTimeline} role="presentation">
              {scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  className={activeScene === index ? 'studio-scene-clip studio-scene-clip--active' : 'studio-scene-clip'}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    chooseScene(index);
                  }}
                  aria-label={`Jump to ${scene.title}`}
                >
                  <img src={scene.src} alt="" style={{ objectPosition: scene.objectPosition }} />
                </button>
              ))}
            </div>

            <div className="studio-voice-track">
              <span>Clean, calm, and made to balance.</span>
              <Waveform bars={voiceWave} />
            </div>

            <div className="studio-text-track">
              <span>Clarify</span>
              <span>Balance</span>
              <span>Glow</span>
            </div>

            <div className="studio-music-track">
              <Waveform bars={musicWave} subtle />
            </div>

            <div className="studio-playhead" style={{ left: playheadPosition }} aria-hidden="true">
              <span />
            </div>
          </div>

          <aside className="studio-render-controls">
            <button className="studio-generate" type="button" onClick={goToLogin}>
              <Sparkles size={20} />
              <span>Generate</span>
            </button>
            <button className="studio-format" type="button" aria-label="Choose video format">
              <Smartphone size={18} />
              <span>9:16</span>
              <ChevronDown size={17} />
            </button>
            <div className="studio-ready">
              <span><Check size={12} strokeWidth={3} /></span>
              Ready
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default StudioLanding;
