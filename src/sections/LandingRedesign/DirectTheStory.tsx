import { ASSETS, Frame, goLogin } from './shared';

const SCENES = [
  { id: '01', src: ASSETS.scene01, alt: 'Product reveal thumbnail' },
  { id: '02', src: ASSETS.scene02, alt: 'Hydration proof thumbnail' },
  { id: '03', src: ASSETS.scene03, alt: 'Skin benefit thumbnail' },
  { id: '04', src: ASSETS.scene04, alt: 'Serum detail thumbnail' },
  { id: '05', src: ASSETS.scene05, alt: 'Closing frame thumbnail' },
];

const DirectTheStory = () => (
  <Frame className="a-direct" id="workflow" label="Aevora video editor and timeline">
    <p className="a-section-tag a-section-tag-light">
      <span>02</span> DIRECT THE STORY
    </p>
    <h2 className="a-direct-title">
      <span>CREATE.</span>
      <span>EDIT.</span>
      <span>DELIVER.</span>
    </h2>

    <div
      className="a-editor-window"
      role="img"
      aria-label="Aevora editor with five scenes, timeline, voiceover, text, music and generate controls"
    >
      <div className="a-editor-topbar">
        <span className="a-editor-brand">Aevora / Studio</span>
        <span>Aurora launch · 00:20</span>
        <button type="button" onClick={goLogin}>
          Export <span>↗</span>
        </button>
      </div>

      <div className="a-editor-preview">
        <img src={ASSETS.scene02} alt="Current hydration proof scene" loading="lazy" />
        <span className="a-editor-time">00:08 / 00:20</span>
        <button className="a-editor-play" type="button" aria-label="Play video" onClick={goLogin}>
          ▶
        </button>
      </div>

      <aside className="a-editor-scenes">
        <div className="a-editor-scenes-title">
          <span>Scenes</span>
          <span>+</span>
        </div>
        {SCENES.map((scene, i) => (
          <div key={scene.id} className={`a-scene-row${i === 0 ? ' is-active' : ''}`}>
            <span>{scene.id}</span>
            <img src={scene.src} alt={scene.alt} loading="lazy" />
            <em>04s</em>
          </div>
        ))}
      </aside>

      <div className="a-editor-tools">
        <span>SCENES</span>
        <span>VOICEOVER</span>
        <span>TEXT</span>
        <span>MUSIC</span>
      </div>

      <div className="a-editor-timeline">
        <div className="a-timecodes">
          <span>00:00</span>
          <span>00:04</span>
          <span>00:08</span>
          <span>00:12</span>
          <span>00:16</span>
          <span>00:20</span>
        </div>
        <div className="a-filmstrip">
          {SCENES.map((scene) => (
            <img key={scene.id} src={scene.src} alt="" loading="lazy" />
          ))}
        </div>
        <div className="a-waveform">
          <strong>Clean, calm, and made to balance.</strong>
          <span />
        </div>
        <div className="a-playhead" aria-hidden="true" />
      </div>

      <div className="a-editor-generate">
        <button type="button" onClick={goLogin}>✦  Generate</button>
        <span>9:16</span>
      </div>
    </div>

    <p className="a-direct-note">
      The editor is proof, not decoration.
      <br />
      Every frame stays directable.
    </p>

    <span className="a-frame-number a-frame-number-light">04 / 08</span>
  </Frame>
);

export default DirectTheStory;
