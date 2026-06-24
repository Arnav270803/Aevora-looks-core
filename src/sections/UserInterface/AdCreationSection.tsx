import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { WORKFLOW_STEPS, type WorkflowStepId } from './workflow';

type AdCreationSectionProps = {
  activeStep: WorkflowStepId;
  onStepChange: (step: WorkflowStepId) => void;
};

const Field = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label style={{ display: 'block' }}>
    <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 7 }}>
      {label}
    </span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '11px 12px',
        fontSize: 13,
        color: '#172033',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        background: '#ffffff',
      }}
    />
  </label>
);

const Pill = ({ children, active = false }: { children: ReactNode; active?: boolean }) => (
  <button
    type="button"
    style={{
      border: `1px solid ${active ? '#e8622a' : '#e2e8f0'}`,
      background: active ? '#fff4ef' : '#ffffff',
      color: active ? '#e8622a' : '#60708a',
      borderRadius: 999,
      padding: '7px 11px',
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'inherit',
    }}
  >
    {children}
  </button>
);

const MiniUpload = () => (
  <div style={{
    border: '1.5px dashed #cbd5e1',
    borderRadius: 10,
    minHeight: 236,
    background: '#fbfdff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
    color: '#64748b',
    textAlign: 'center',
  }}>
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      background: '#fff4ef',
      color: '#e8622a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M17 8l-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 750, color: '#172033', marginBottom: 4 }}>
        Upload product and reference images
      </div>
      <div style={{ fontSize: 12.5, color: '#8a97aa' }}>
        Drag images here or click to browse
      </div>
    </div>
    <div style={{ fontSize: 11.5, color: '#a1adbd' }}>
      JPG, PNG, WebP up to 20MB
    </div>
  </div>
);

const ThumbnailRail = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
    {['Front', 'Detail', 'Lifestyle', 'Pack'].map((label) => (
      <div
        key={label}
        style={{
          minHeight: 78,
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
          color: '#9aa7ba',
          fontSize: 11.5,
          fontWeight: 700,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M21 15l-4-4-7 7" />
        </svg>
        {label}
      </div>
    ))}
  </div>
);

const Checklist = ({ items }: { items: string[] }) => (
  <div style={{ display: 'grid', gap: 10 }}>
    {items.map((item, index) => (
      <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: index === 0 ? '#fff4ef' : '#f8fafc',
          color: index === 0 ? '#e8622a' : '#94a3b8',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <span style={{ fontSize: 12.5, color: '#66758c', lineHeight: 1.45 }}>
          {item}
        </span>
      </div>
    ))}
  </div>
);

const PreviewPhone = ({ label }: { label: string }) => (
  <div style={{
    width: 154,
    height: 274,
    borderRadius: 18,
    border: '1px solid #dfe5ef',
    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
    color: '#9aa7ba',
    margin: '0 auto',
  }}>
    <div style={{
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
    }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="#94a3b8">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
  </div>
);

const PromptReferenceStep = () => {
  const [productName, setProductName] = useState('');
  const [brandCategory, setBrandCategory] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)', gap: 24 }}>
      <div style={{ display: 'grid', gap: 18 }}>
        <MiniUpload />
        <ThumbnailRail />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Product Name" placeholder="e.g. Glow serum bottle" value={productName} onChange={setProductName} />
          <Field label="Brand / Category" placeholder="e.g. Skincare, beauty, wellness" value={brandCategory} onChange={setBrandCategory} />
        </div>

        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 7 }}>
            Reference Notes
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add visual notes such as product angle, label visibility, packaging, or mood."
            rows={3}
            style={{
              width: '100%',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '11px 12px',
              fontSize: 13,
              color: '#172033',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              background: '#ffffff',
            }}
          />
        </label>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 9 }}>
            Image Guidance
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill active>Front view</Pill>
            <Pill>Lifestyle</Pill>
            <Pill>Packaging</Pill>
            <Pill>Texture detail</Pill>
          </div>
        </div>
      </div>

      <aside style={{
        borderLeft: '1px solid #edf1f7',
        paddingLeft: 24,
        display: 'grid',
        alignContent: 'start',
        gap: 22,
      }}>
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#172033' }}>
            Reference Preview
          </h3>
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            background: '#f8fafc',
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9aa7ba',
            fontSize: 12.5,
            fontWeight: 700,
          }}>
            Images will appear here
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#172033' }}>
            What happens next
          </h3>
          <Checklist items={[
            'Generate cinematic shot options from the selected references.',
            'Write hook, scene, caption, and voiceover lines.',
            'Build the scene sequence and prepare the final video.',
          ]} />
        </div>
      </aside>
    </div>
  );
};

const ShotStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 18 }}>
        {['Hero macro', 'Lifestyle angle', 'Packaging reveal'].map((shot, index) => (
          <div key={shot} style={{
            minHeight: 168,
            border: `1px solid ${index === 0 ? '#e8622a' : '#e2e8f0'}`,
            borderRadius: 10,
            background: index === 0 ? '#fffaf7' : '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: index === 0 ? '#e8622a' : '#94a3b8',
            fontSize: 13,
            fontWeight: 800,
          }}>
            {shot}
          </div>
        ))}
      </div>
      <Checklist items={[
        'Select the shots that best explain the product.',
        'Regenerate weak shots before moving to script.',
        'Keep 3 to 5 strong frames for the scene builder.',
      ]} />
    </div>
    <PreviewPhone label="Shot preview" />
  </div>
);

const ScriptStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', gap: 12 }}>
      {['Hook', 'Problem', 'Benefit', 'Proof', 'CTA'].map((line, index) => (
        <div key={line} style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr',
          gap: 12,
          alignItems: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          background: '#ffffff',
          padding: '12px',
        }}>
          <span style={{ fontSize: 12, color: '#e8622a', fontWeight: 800 }}>
            {index + 1}. {line}
          </span>
          <span style={{ height: 10, borderRadius: 999, background: '#eef2f7', display: 'block' }} />
        </div>
      ))}
    </div>
    <PreviewPhone label="Script timing" />
  </div>
);

const SceneStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', gap: 12 }}>
      {['Scene 01', 'Scene 02', 'Scene 03', 'Scene 04'].map((scene, index) => (
        <div key={scene} style={{
          display: 'grid',
          gridTemplateColumns: '96px 1fr 84px',
          gap: 14,
          alignItems: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          background: '#ffffff',
          padding: '12px',
        }}>
          <div style={{ height: 52, borderRadius: 8, background: index === 0 ? '#fff4ef' : '#f1f5f9' }} />
          <div>
            <div style={{ fontSize: 13, color: '#172033', fontWeight: 800, marginBottom: 6 }}>{scene}</div>
            <div style={{ height: 8, width: '78%', borderRadius: 999, background: '#eef2f7' }} />
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>0:0{index + 3}</span>
        </div>
      ))}
    </div>
    <PreviewPhone label="Scene preview" />
  </div>
);

const FinalVideoStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', alignContent: 'start', gap: 16 }}>
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        background: '#f8fafc',
        minHeight: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: 14,
        fontWeight: 800,
      }}>
        Final timeline and export controls
      </div>
      <Checklist items={[
        'Review the generated video before export.',
        'Adjust pacing, captions, or ending frame if needed.',
        'Download the final creative for publishing.',
      ]} />
    </div>
    <PreviewPhone label="Final video" />
  </div>
);

const stepContent: Record<WorkflowStepId, ReactNode> = {
  'prompt-reference': <PromptReferenceStep />,
  'cinematic-shots': <ShotStep />,
  'script-writing': <ScriptStep />,
  'scene-generation': <SceneStep />,
  'final-video': <FinalVideoStep />,
};

const AdCreationSection = ({ activeStep, onStepChange }: AdCreationSectionProps) => {
  const activeIndex = WORKFLOW_STEPS.findIndex((step) => step.id === activeStep);
  const fallbackStep = WORKFLOW_STEPS[0];

  if (!fallbackStep) {
    return null;
  }

  const current = WORKFLOW_STEPS[activeIndex] ?? fallbackStep;
  const previous = WORKFLOW_STEPS[activeIndex - 1];
  const next = WORKFLOW_STEPS[activeIndex + 1];

  const ctaLabel = useMemo(() => {
    if (activeStep === 'prompt-reference') return 'Generate Cinematic Shots';
    if (activeStep === 'cinematic-shots') return 'Continue to Script Writing';
    if (activeStep === 'script-writing') return 'Generate Scenes';
    if (activeStep === 'scene-generation') return 'Build Final Video';
    return 'Export Final Video';
  }, [activeStep]);

  const panelStyle: CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(99,102,241,0.22)',
    borderRadius: 12,
    boxShadow: '0 12px 34px rgba(99,102,241,0.18), 0 2px 10px rgba(15,23,42,0.05)',
    padding: 24,
  };

  return (
    <section style={{ padding: '0 32px 36px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={panelStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          paddingBottom: 18,
          borderBottom: '1px solid #edf1f7',
          marginBottom: 22,
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: current.accent,
              background: current.accent + '12',
              border: `1px solid ${current.accent}30`,
              borderRadius: 999,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 800,
              marginBottom: 10,
            }}>
              STEP {current.num} - Current
            </div>
            <h2 style={{ margin: '0 0 7px', fontSize: 21, lineHeight: 1.2, color: '#0f172a', letterSpacing: '-0.2px' }}>
              {current.title}
            </h2>
            <p style={{ margin: 0, color: '#7b89a0', fontSize: 13, lineHeight: 1.55, maxWidth: 650 }}>
              {current.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              type="button"
              disabled={!previous}
              onClick={() => previous && onStepChange(previous.id)}
              style={{
                border: '1px solid #e2e8f0',
                background: previous ? '#ffffff' : '#f8fafc',
                color: previous ? '#475569' : '#a9b4c5',
                borderRadius: 8,
                padding: '9px 13px',
                fontSize: 12.5,
                fontWeight: 750,
                cursor: previous ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
              }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => next && onStepChange(next.id)}
              style={{
                border: 'none',
                background: current.accent,
                color: '#ffffff',
                borderRadius: 8,
                padding: '10px 15px',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: `0 8px 18px ${current.accent}30`,
              }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>

        {stepContent[activeStep]}
      </div>
    </section>
  );
};

export default AdCreationSection;
