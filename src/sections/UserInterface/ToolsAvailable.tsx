import { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { WORKFLOW_STEPS, type WorkflowStepId, type WorkflowTransition } from './workflow';

type ToolsAvailableProps = {
  activeStep: WorkflowStepId;
  transitionEdge?: WorkflowTransition;
  onStepChange: (step: WorkflowStepId) => void;
};

const iconMap: Record<WorkflowStepId, ReactElement> = {
  'prompt-reference': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 15l-4.5-4.5L9 18" />
    </svg>
  ),
  'cinematic-shots': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v16M16 4v16M4 9h16M4 15h16" />
    </svg>
  ),
  'script-writing': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  ),
  'scene-generation': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="7" height="7" rx="1" />
      <rect x="14" y="4" width="7" height="7" rx="1" />
      <rect x="3" y="15" width="7" height="5" rx="1" />
      <rect x="14" y="15" width="7" height="5" rx="1" />
    </svg>
  ),
  'final-video': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12l-7 4V8l7 4z" />
      <rect x="2" y="6" width="13" height="12" rx="2" />
    </svg>
  ),
};

const ToolsAvailable = ({ activeStep, transitionEdge = null, onStepChange }: ToolsAvailableProps) => {
  const [hovered, setHovered] = useState<WorkflowStepId | null>(null);
  const transitionFromIndex = transitionEdge
    ? WORKFLOW_STEPS.findIndex((step) => step.id === transitionEdge.from)
    : -1;
  const transitionToIndex = transitionEdge
    ? WORKFLOW_STEPS.findIndex((step) => step.id === transitionEdge.to)
    : -1;
  const activeSegmentIndex = transitionToIndex === transitionFromIndex + 1 ? transitionFromIndex : -1;

  const summaryGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(132px, 205px))',
    columnGap: 18,
    rowGap: 10,
    justifyContent: 'space-between',
  };

  return (
    <div style={{ padding: '32px 32px 18px', fontFamily: "'Work Sans', -apple-system, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, gap: 24 }}>
        <div>
          <span style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#e8622a', background: '#fff4ef', padding: '4px 9px', borderRadius: 5,
            display: 'inline-flex', marginBottom: 8,
          }}>
            Workflow
          </span>
          <h1 style={{ fontSize: 23, fontWeight: 750, color: '#0f172a', margin: 0, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
            Build an ad from product to final video
          </h1>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 270, textAlign: 'right', lineHeight: 1.5 }}>
          The cards below summarize your pipeline. Open a step to edit its details.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            top: '50%',
            transform: 'translateY(-50%)',
            height: 2,
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(203,213,225,0.42), rgba(148,163,184,0.7), rgba(203,213,225,0.42))',
            zIndex: 0,
          }}
        />
        {activeSegmentIndex >= 0 && (
          <div
            aria-hidden="true"
            className="workflow-chain-glow"
            style={{
              '--segment-index': activeSegmentIndex,
              position: 'absolute',
              left: 'calc(10% + (20% * var(--segment-index)))',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20%',
              height: 2,
              borderRadius: 999,
              zIndex: 0,
            } as CSSProperties}
          />
        )}
      <div style={summaryGrid}>
        {WORKFLOW_STEPS.map((step) => {
          const isActive = step.id === activeStep;
          const isHovered = hovered === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(step.id)}
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textAlign: 'left',
                border: `1px solid ${isActive ? '#111827' : isHovered ? '#cbd5e1' : '#e6e9f0'}`,
                background: '#ffffff',
                borderRadius: 8,
                padding: '13px 14px 14px',
                minHeight: 112,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: isActive
                  ? '0 12px 26px rgba(15,23,42,0.10), 0 1px 0 rgba(15,23,42,0.03)'
                  : isHovered
                    ? '0 10px 22px rgba(15,23,42,0.08), 0 1px 0 rgba(15,23,42,0.03)'
                    : '0 1px 2px rgba(15,23,42,0.04)',
                transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: isActive ? step.accent : 'transparent',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 22, height: 2, borderRadius: 99, background: isActive ? step.accent : '#e2e8f0', marginTop: 13 }} />
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? '#111827' : '#8a97aa',
                  background: isActive ? '#f3f4f6' : '#f8fafc',
                  border: '1px solid #eef2f7',
                  flexShrink: 0,
                }}>
                  {iconMap[step.id]}
                </div>
              </div>

              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.25, marginBottom: 6 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 11.5, color: '#7b8798', lineHeight: 1.45 }}>
                {step.summary}
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default ToolsAvailable;
