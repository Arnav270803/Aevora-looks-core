import React, { useEffect, useMemo, useState } from 'react';
import {
  UserHorizontalNavigation,
  UIHeroNavbar,
  ToolsAvailable,
  AdCreationSection,
  HomeDashboard,
} from '../sections/UserInterface';
import { getApiErrorMessage } from '../api/client';
import {
  getAd,
  getProject,
  listProjects,
  type RenderOutputRecord,
} from '../api/workspaceApi';
import type { WorkflowStepId, WorkflowTransition } from '../sections/UserInterface/workflow';
import type { WorkspaceView } from '../sections/UserInterface';

const placeholderCopy: Record<Exclude<WorkspaceView, 'home' | 'create-ad' | 'library' | 'videos' | 'debugging'>, { title: string; copy: string }> = {
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

const storedVideos = [
  {
    id: 'drink-commercial-demo',
    title: 'Drink Commercial - Daniel Schiffer style',
    source: '/DRINK COMMERCIAL - Daniel Schiffer style.mp4',
    type: 'Precreated demo',
    detail: 'Bundled workspace video stored in the frontend public assets.',
  },
];

const PlaceholderView = ({
  view,
  onCreateAd,
}: {
  view: Exclude<WorkspaceView, 'home' | 'create-ad' | 'library' | 'videos' | 'debugging'>;
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

const PageShell = ({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) => (
  <section style={{ padding: '32px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
    <div style={{ maxWidth: 1120 }}>
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
          marginBottom: 12,
        }}
      >
        {eyebrow}
      </span>
      <h1 style={{ margin: '0 0 8px', fontSize: 28, color: '#0f172a', lineHeight: 1.12 }}>
        {title}
      </h1>
      <p style={{ margin: '0 0 22px', color: '#66758c', fontSize: 14, lineHeight: 1.65, maxWidth: 760 }}>
        {copy}
      </p>
      {children}
    </div>
  </section>
);

const StatCard = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div
    style={{
      border: '1px solid #e8eaf3',
      background: '#ffffff',
      borderRadius: 10,
      padding: 16,
      boxShadow: '0 8px 22px rgba(99,102,241,0.08)',
    }}
  >
    <div style={{ fontSize: 10.5, color: '#a1adbd', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
      {label}
    </div>
    <div style={{ color: '#0f172a', fontSize: 24, fontWeight: 850, marginBottom: 6 }}>
      {value}
    </div>
    <div style={{ color: '#718096', fontSize: 12.5, lineHeight: 1.5 }}>
      {detail}
    </div>
  </div>
);

const LibraryView = ({ onCreateAd }: { onCreateAd: () => void }) => (
  <PageShell
    eyebrow="Library"
    title="Assets"
    copy="Library is now an assets workspace for reusable video, image, brand, and generated output records."
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, marginBottom: 22 }}>
      <StatCard label="Section" value="Library" detail="Browse asset groups from one place." />
      <StatCard label="Videos" value={String(storedVideos.length)} detail="Precreated videos ready to preview." />
      <StatCard label="Brand Kit" value="Ready" detail="Logo and brand rules section remains available." />
      <StatCard label="Generated" value="Live" detail="Render outputs appear after pipeline runs." />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
      {[
        ['Videos', 'Precreated and generated video assets for ads.'],
        ['My Ads', 'Drafts, jobs, and completed ad records.'],
        ['Brand Kit', 'Brand files, colors, and recurring guidelines.'],
      ].map(([title, copy]) => (
        <div key={title} style={{ border: '1px solid #e8eaf3', background: '#ffffff', borderRadius: 10, padding: 18 }}>
          <div style={{ color: '#172033', fontSize: 15, fontWeight: 850, marginBottom: 8 }}>{title}</div>
          <div style={{ color: '#718096', fontSize: 12.5, lineHeight: 1.55 }}>{copy}</div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onCreateAd}
      style={{
        marginTop: 20,
        border: 'none',
        background: '#e8622a',
        color: '#ffffff',
        borderRadius: 8,
        padding: '10px 15px',
        fontSize: 13,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      Create New Asset Source
    </button>
  </PageShell>
);

const VideosView = () => {
  const [generatedVideos, setGeneratedVideos] = useState<RenderOutputRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const projects = await listProjects();
        const details = await Promise.all(projects.map((project) => getProject(project.id)));
        const ads = details.flatMap((project) => project.ads);
        const adDetails = await Promise.all(ads.map((ad) => getAd(ad.id)));
        const videos = adDetails
          .flatMap((ad) => ad.renderOutputs ?? [])
          .filter((output) => output.kind === 'VIDEO');

        if (!cancelled) {
          setGeneratedVideos(videos);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError, 'Unable to load generated videos.'));
          setGeneratedVideos([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  const allVideos = useMemo(() => {
    return [
      ...storedVideos.map((video) => ({ ...video, origin: 'stored' as const })),
      ...generatedVideos.map((video) => ({
        id: video.id,
        title: String(video.metadata?.title ?? video.storageKey.split('/').at(-1) ?? 'Generated video'),
        source: video.mimeType?.startsWith('video/') ? video.url ?? '' : '',
        type: 'Generated render',
        detail: `${video.width ?? 1080}x${video.height ?? 1920}${video.durationMs ? ` / ${Math.round(video.durationMs / 1000)}s` : ''}${video.mimeType ? ` / ${video.mimeType}` : ''}`,
        origin: 'generated' as const,
      })),
    ];
  }, [generatedVideos]);

  return (
    <PageShell
      eyebrow="Assets / Library"
      title="Videos"
      copy="All precreated stored videos and generated render records are collected here for preview and reuse."
    >
      {error && (
        <div style={{ border: '1px solid #fecaca', background: '#fff7f7', color: '#b42318', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, marginBottom: 14 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        {allVideos.map((video) => (
          <div key={`${video.origin}-${video.id}`} style={{ border: '1px solid #e8eaf3', background: '#ffffff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 22px rgba(99,102,241,0.08)' }}>
            {video.source ? (
              <video src={video.source} controls muted playsInline style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', background: '#0f172a' }} />
            ) : (
              <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: 13, fontWeight: 800 }}>
                Render URL pending
              </div>
            )}
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: video.origin === 'stored' ? '#e8622a' : '#185fa5', marginBottom: 6 }}>
                {video.type}
              </div>
              <div style={{ fontSize: 14, color: '#172033', fontWeight: 850, marginBottom: 6 }}>{video.title}</div>
              <div style={{ fontSize: 12.5, color: '#718096', lineHeight: 1.5 }}>{video.detail}</div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div style={{ marginTop: 14, color: '#64748b', fontSize: 12.5, fontWeight: 700 }}>Loading generated render records...</div>}
    </PageShell>
  );
};

const DebuggingView = () => (
  <PageShell
    eyebrow="Tools"
    title="Debugging"
    copy="A focused place for pipeline diagnostics, worker state, failed steps, provider traces, and local smoke-test checks."
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
      <StatCard label="Backend" value="Health" detail="Check API status, auth, projects, ads, and pipeline writes." />
      <StatCard label="Worker" value="Mock" detail="Inspect claimed jobs, stage outputs, generated assets, and render metadata." />
      <StatCard label="Frontend" value="Polling" detail="Verify workspace state, step output display, videos, and final delivery records." />
    </div>
    <div style={{ marginTop: 18, border: '1px solid #e8eaf3', background: '#ffffff', borderRadius: 10, padding: 18 }}>
      <div style={{ fontSize: 14, color: '#172033', fontWeight: 850, marginBottom: 8 }}>Debug checklist</div>
      <div style={{ display: 'grid', gap: 8, color: '#66758c', fontSize: 12.5, lineHeight: 1.5 }}>
        {[
          'Confirm backend /api/health returns ok.',
          'Create a local dev session from the login page.',
          'Queue a generation job from Create Ad.',
          'Watch the worker move the job to SUCCEEDED.',
          'Open Videos to confirm stored and generated render records.',
        ].map((item, index) => (
          <div key={item} style={{ display: 'flex', gap: 9 }}>
            <span style={{ color: '#e8622a', fontWeight: 900 }}>{index + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </PageShell>
);

const UserInterface = () => {
  const [activeView, setActiveView] = useState<WorkspaceView>('home');
  const [activeStep, setActiveStep] = useState<WorkflowStepId>('prompt-reference');
  const [stepTransition, setStepTransition] = useState<WorkflowTransition>(null);
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
              <ToolsAvailable activeStep={activeStep} transitionEdge={stepTransition} onStepChange={setActiveStep} />
              <AdCreationSection
                activeStep={activeStep}
                onStepChange={setActiveStep}
                onStepTransitionChange={setStepTransition}
                onWorkspaceChange={refreshDashboard}
              />
            </>
          )}
          {activeView === 'library' && <LibraryView onCreateAd={openCreateAd} />}
          {activeView === 'videos' && <VideosView />}
          {activeView === 'debugging' && <DebuggingView />}
          {activeView !== 'home' && activeView !== 'create-ad' && activeView !== 'library' && activeView !== 'videos' && activeView !== 'debugging' && (
            <PlaceholderView view={activeView} onCreateAd={openCreateAd} />
          )}
        </main>
      </div>
    </div>
  );
};

export default UserInterface;
