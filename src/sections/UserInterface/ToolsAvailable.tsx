import { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { WORKFLOW_STEPS, type WorkflowStepId } from './workflow';

type ToolsAvailableProps = {
  activeStep: WorkflowStepId;
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

const getStatus = (index: number, activeIndex: number) => {
  if (index === activeIndex) return 'Current';
  if (index < activeIndex) return 'Done';
  if (index === activeIndex + 1) return 'Next';
  return 'Pending';
};

const ToolsAvailable = ({ activeStep, onStepChange }: ToolsAvailableProps) => {
  const [hovered, setHovered] = useState<WorkflowStepId | null>(null);
  const activeIndex = WORKFLOW_STEPS.findIndex((step) => step.id === activeStep);

  const summaryGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(150px, 1fr))',
    gap: 12,
  };

  return (
    <div style={{ padding: '32px 32px 18px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
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

      <div style={summaryGrid}>
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = step.id === activeStep;
          const isHovered = hovered === step.id;
          const status = getStatus(index, activeIndex);
          const statusColor = status === 'Current' ? step.accent : status === 'Done' ? '#059669' : '#94a3b8';

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(step.id)}
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textAlign: 'left',
                border: `1px solid ${isActive ? step.accent : isHovered ? step.accent + '55' : '#e8eaf3'}`,
                background: isActive ? '#fffaf7' : '#ffffff',
                borderRadius: 10,
                padding: '15px 16px',
                minHeight: 142,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: isActive
                  ? '0 12px 30px rgba(232,98,42,0.16), 0 2px 8px rgba(15,23,42,0.06)'
                  : isHovered
                    ? '0 10px 24px rgba(99,102,241,0.16), 0 2px 8px rgba(15,23,42,0.05)'
                    : '0 4px 14px rgba(99,102,241,0.08)',
                transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: isActive ? step.accent : 'transparent',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#a9b4c5', fontWeight: 800, letterSpacing: '0.08em', marginBottom: 6 }}>
                    STEP {step.num}
                  </div>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: statusColor,
                    background: status === 'Current' ? step.accent + '12' : status === 'Done' ? '#ecfdf5' : '#f8fafc',
                    border: `1px solid ${status === 'Current' ? step.accent + '30' : status === 'Done' ? '#bbf7d0' : '#e2e8f0'}`,
                    borderRadius: 999,
                    padding: '3px 8px',
                  }}>
                    {status}
                  </span>
                </div>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isActive ? step.accent : '#94a3b8',
                  background: isActive ? step.accent + '12' : '#f8fafc',
                  flexShrink: 0,
                }}>
                  {iconMap[step.id]}
                </div>
              </div>

              <div style={{ fontSize: 13.5, fontWeight: 750, color: '#0f172a', lineHeight: 1.25, marginBottom: 8 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 12, color: '#8794aa', lineHeight: 1.5 }}>
                {step.summary}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToolsAvailable;
