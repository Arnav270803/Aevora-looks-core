import React, { useState } from 'react';
import {
  UserHorizontalNavigation,
  UIHeroNavbar,
  ToolsAvailable,
  AdCreationSection,
  HomeDashboard,
} from '../sections/UserInterface';
import type { WorkflowStepId } from '../sections/UserInterface/workflow';
import type { WorkspaceView } from '../sections/UserInterface';

const placeholderCopy: Record<Exclude<WorkspaceView, 'home' | 'create-ad'>, { title: string; copy: string }> = {
  templates: {
    title: 'Templates are coming next',
    copy: 'This area will hold reusable ad structures for beauty, fashion, food, wellness, and product launch campaigns.',
  },
  assistant: {
    title: 'AI Assistant is coming next',
    copy: 'This area will help refine prompts, rewrite scripts, compare concepts, and troubleshoot generated shots.',
  },
  'my-ads': {
    title: 'My Ads is coming next',
    copy: 'This library will show drafts, rendered videos, exports, and previous product campaigns.',
  },
  'brand-kit': {
    title: 'Brand Kit is coming next',
    copy: 'This area will store logo files, color palettes, fonts, product rules, and recurring brand guidelines.',
  },
};

const PlaceholderView = ({
  view,
  onCreateAd,
}: {
  view: Exclude<WorkspaceView, 'home' | 'create-ad'>;
  onCreateAd: () => void;
}) => {
  const content = placeholderCopy[view];

  return (
    <section style={{ padding: '32px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div
        style={{
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 12,
          background: '#ffffff',
          boxShadow: '0 12px 34px rgba(99,102,241,0.16), 0 2px 10px rgba(15,23,42,0.05)',
          padding: 30,
          maxWidth: 760,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            color: '#e8622a',
            background: '#fff4ef',
            border: '1px solid #fed7c3',
            borderRadius: 6,
            padding: '5px 10px',
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Planned workspace
        </span>
        <h1 style={{ margin: '0 0 10px', fontSize: 26, color: '#0f172a', lineHeight: 1.15 }}>
          {content.title}
        </h1>
        <p style={{ margin: '0 0 22px', color: '#66758c', fontSize: 14, lineHeight: 1.65 }}>
          {content.copy}
        </p>
        <button
          type="button"
          onClick={onCreateAd}
          style={{
            border: 'none',
            background: '#e8622a',
            color: '#ffffff',
            borderRadius: 8,
            padding: '10px 15px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 8px 18px rgba(232,98,42,0.22)',
          }}
        >
          Create an ad instead
        </button>
      </div>
    </section>
  );
};

const UserInterface = () => {
  const [activeView, setActiveView] = useState<WorkspaceView>('home');
  const [activeStep, setActiveStep] = useState<WorkflowStepId>('prompt-reference');
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  const openCreateAd = () => setActiveView('create-ad');
  const refreshDashboard = () => setDashboardRefreshKey((key) => key + 1);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <UserHorizontalNavigation activeView={activeView} onViewChange={setActiveView} />

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto',
        background: '#ffffff',
        backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.35) 1.5px, transparent 1.5px)',
        backgroundSize: '20px 20px',
      }}>
        <UIHeroNavbar onCreateAd={openCreateAd} />
        <main style={{ flex: 1 }}>
          {activeView === 'home' && <HomeDashboard onCreateAd={openCreateAd} refreshKey={dashboardRefreshKey} />}
          {activeView === 'create-ad' && (
            <>
              <ToolsAvailable activeStep={activeStep} onStepChange={setActiveStep} />
              <AdCreationSection
                activeStep={activeStep}
                onStepChange={setActiveStep}
                onWorkspaceChange={refreshDashboard}
              />
            </>
          )}
          {activeView !== 'home' && activeView !== 'create-ad' && (
            <PlaceholderView view={activeView} onCreateAd={openCreateAd} />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserInterface;
