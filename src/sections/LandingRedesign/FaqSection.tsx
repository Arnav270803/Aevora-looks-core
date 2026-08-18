import { useState } from 'react';
import { ASSETS, Frame } from './shared';

const QUESTIONS = [
  {
    q: 'What is Aevora and how does it work?',
    a: 'Aevora turns a single product image into a finished campaign. Upload the shot, describe the story, and the studio directs five scenes, adds voiceover, text and music, then exports every format you need.',
  },
  {
    q: 'Do I need video editing skills?',
    a: 'No. Every scene is generated for you and stays editable — swap a shot, retime the cut, or rewrite the voiceover from the same timeline you see above.',
  },
  {
    q: 'What output formats are supported?',
    a: 'Each render exports at 9:16, 1:1, 4:5 and 16:9 in up to 4K, so the same campaign is ready for Reels, paid social, retail screens and your product page.',
  },
  {
    q: 'Can I use my own brand assets?',
    a: 'Yes. Lock your colour, type and logo once and Aevora holds them across every scene, so the product stays recognisable no matter how the world around it changes.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Starter is free forever and includes three exports a month at 720p. Upgrade only when your creative cadence needs more.',
  },
  {
    q: 'How is Aevora different?',
    a: 'Most tools generate a clip. Aevora generates a campaign — a directed, brand-locked set of scenes built from your real product, ready to publish in under five minutes.',
  },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Frame className="a-faq" id="faq" label="Aevora frequently asked questions">
      <p className="a-section-tag">
        <span>05</span> THE LAST QUESTIONS
      </p>
      <h2 className="a-faq-title">
        <span>QUESTIONS,</span>
        <span>ANSWERED.</span>
      </h2>

      <figure className="a-faq-image">
        <img src={ASSETS.scene04} alt="Macro serum texture" loading="lazy" />
        <figcaption>Product truth, in every frame.</figcaption>
      </figure>

      <div className="a-faq-list">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          const id = `a-faq-answer-${i}`;
          return (
            <div key={item.q} className={`a-faq-item${isOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{item.q}</strong>
                <em aria-hidden="true">+</em>
              </button>
              <div className="a-faq-answer" id={id} role="region">
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="a-faq-side-note">
        Still curious?
        <br />
        <a href="mailto:hello@aevora.ai">hello@aevora.ai</a>
      </p>

      <span className="a-frame-number">07 / 08</span>
    </Frame>
  );
};

export default FaqSection;
