import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getApiErrorMessage } from '../../api/client';
import { getProject, listProjects, type AdDraft, type ProjectDetail, type ProjectSummary } from '../../api/workspaceApi';

type HomeDashboardProps = {
  onCreateAd: () => void;
  refreshKey?: number;
};

type DashboardAd = AdDraft & {
  projectName: string;
};

const Metric = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div
    style={{
      border: '1px solid #e8eaf3',
      background: '#ffffff',
      borderRadius: 10,
      padding: '16px 17px',
      boxShadow: '0 8px 22px rgba(99,102,241,0.08)',
      minHeight: 92,
      boxSizing: 'border-box',
    }}
  >
    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: '#a1adbd', textTransform: 'uppercase', marginBottom: 8 }}>
      {label}
    </div>
    <div style={{ fontSize: 25, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 8 }}>
      {value}
    </div>
    <div style={{ fontSize: 12, color: '#7b89a0', lineHeight: 1.45 }}>
      {detail}
    </div>
  </div>
);

const QuickAction = ({
  title,
  copy,
  badge,
  active = false,
  onClick,
}: {
  title: string;
  copy: string;
  badge: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      textAlign: 'left',
      border: `1px solid ${active ? '#e8622a' : '#e8eaf3'}`,
      background: active ? '#fffaf7' : '#ffffff',
      borderRadius: 10,
      padding: 18,
      cursor: 'pointer',
      fontFamily: 'inherit',
      minHeight: 148,
      boxShadow: active ? '0 14px 30px rgba(232,98,42,0.15)' : '0 8px 22px rgba(99,102,241,0.08)',
      transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
    }}
    onMouseEnter={(event) => {
      event.currentTarget.style.transform = 'translateY(-2px)';
      event.currentTarget.style.boxShadow = active ? '0 18px 34px rgba(232,98,42,0.18)' : '0 14px 28px rgba(99,102,241,0.14)';
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.transform = 'translateY(0)';
      event.currentTarget.style.boxShadow = active ? '0 14px 30px rgba(232,98,42,0.15)' : '0 8px 22px rgba(99,102,241,0.08)';
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        color: active ? '#e8622a' : '#185fa5',
        background: active ? '#fff4ef' : '#eff6ff',
        border: `1px solid ${active ? '#fed7c3' : '#dbeafe'}`,
        borderRadius: 999,
        padding: '4px 9px',
        fontSize: 10.5,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        marginBottom: 14,
      }}
    >
      {badge}
    </span>
    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8, lineHeight: 1.25 }}>
      {title}
    </div>
    <div style={{ fontSize: 12.5, color: '#718096', lineHeight: 1.55 }}>
      {copy}
    </div>
  </button>
);

const MiniProject = ({ name, status, time, detail }: { name: string; status: string; time: string; detail: string }) => (
  <button
    type="button"
    style={{
      display: 'grid',
      gridTemplateColumns: '48px 1fr auto',
      alignItems: 'center',
      gap: 13,
      width: '100%',
      border: '1px solid #e8eaf3',
      background: '#ffffff',
      borderRadius: 10,
      padding: 12,
      cursor: 'default',
      fontFamily: 'inherit',
      textAlign: 'left',
    }}
  >
    <span
      style={{
        width: 48,
        height: 48,
        borderRadius: 9,
        background: 'linear-gradient(135deg, #fff4ef 0%, #eff6ff 100%)',
        border: '1px solid #eef2ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e8622a',
        fontWeight: 900,
      }}
    >
      AD
    </span>
    <span>
      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: '#172033', marginBottom: 4 }}>
        {name}
      </span>
      <span style={{ display: 'block', fontSize: 12, color: '#8a97aa', marginBottom: 3 }}>
        {status}
      </span>
      <span style={{ display: 'block', fontSize: 11.5, color: '#a1adbd' }}>
        {detail}
      </span>
    </span>
    <span style={{ fontSize: 11.5, color: '#a1adbd', fontWeight: 700 }}>
      {time}
    </span>
  </button>
);

const InlineState = ({ title, copy, tone = 'neutral' }: { title: string; copy: string; tone?: 'neutral' | 'error' }) => (
  <div
    style={{
      border: `1px solid ${tone === 'error' ? '#fecaca' : '#e8eaf3'}`,
      background: tone === 'error' ? '#fff7f7' : '#ffffff',
      borderRadius: 10,
      padding: 16,
      color: tone === 'error' ? '#b42318' : '#66758c',
      fontSize: 12.5,
      lineHeight: 1.55,
    }}
  >
    <strong style={{ display: 'block', color: tone === 'error' ? '#b42318' : '#172033', marginBottom: 4 }}>
      {title}
    </strong>
    {copy}
  </div>
);

const HomeDashboard = ({ onCreateAd, refreshKey = 0 }: HomeDashboardProps) => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextProjects = await listProjects();
        const details = await Promise.all(nextProjects.slice(0, 6).map((project) => getProject(project.id)));

        if (!cancelled) {
          setProjects(nextProjects);
          setProjectDetails(details);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError, 'Unable to load your workspace.'));
          setProjects([]);
          setProjectDetails([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const recentAds = useMemo<DashboardAd[]>(() => {
    return projectDetails
      .flatMap((project) => project.ads.map((ad) => ({ ...ad, projectName: project.name })))
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      .slice(0, 4);
  }, [projectDetails]);

  const adCount = projects.reduce((total, project) => total + (project._count?.ads ?? 0), 0);
  const queuedJobs = projectDetails.reduce((total, project) => {
    return total + project.ads.reduce((adTotal, ad) => adTotal + (ad._count?.pipelineJobs ?? 0), 0);
  }, 0);
  const registeredAssets = projectDetails.reduce((total, project) => {
    return total + project.ads.reduce((adTotal, ad) => adTotal + (ad._count?.assets ?? 0), 0);
  }, 0);

  return (
    <section style={{ padding: '32px 32px 42px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(360px, 0.9fr)',
          gap: 22,
          alignItems: 'stretch',
          marginBottom: 22,
        }}
      >
        <div
          style={{
            border: '1px solid rgba(99,102,241,0.20)',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ffffff 0%, #fffaf7 48%, #eff6ff 100%)',
            boxShadow: '0 14px 34px rgba(99,102,241,0.14), 0 2px 10px rgba(15,23,42,0.04)',
            padding: 28,
            minHeight: 300,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
                marginBottom: 18,
              }}
            >
              Aevora workspace
            </span>
            <h1 style={{ margin: '0 0 12px', fontSize: 34, lineHeight: 1.08, color: '#0f172a', letterSpacing: 0, fontWeight: 820 }}>
              Welcome back, {firstName}. Build your next product ad from one place.
            </h1>
            <p style={{ margin: 0, color: '#66758c', fontSize: 14, lineHeight: 1.65, maxWidth: 620 }}>
              {loading
                ? 'Loading your latest projects and ad drafts from the backend.'
                : projects.length > 0
                  ? `You have ${projects.length} project${projects.length === 1 ? '' : 's'} and ${adCount} ad draft${adCount === 1 ? '' : 's'} in this workspace.`
                  : 'Create your first backend project, then save ad drafts, asset metadata, and queued generation jobs.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            <button
              type="button"
              onClick={onCreateAd}
              style={{
                border: 'none',
                background: '#e8622a',
                color: '#ffffff',
                borderRadius: 8,
                padding: '11px 17px',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 10px 22px rgba(232,98,42,0.24)',
              }}
            >
              Create New Ad
            </button>
            <button
              type="button"
              onClick={onCreateAd}
              style={{
                border: '1px solid #dbeafe',
                background: '#ffffff',
                color: '#185fa5',
                borderRadius: 8,
                padding: '10px 15px',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Upload References
            </button>
          </div>
        </div>

        <div
          style={{
            border: '1px solid rgba(99,102,241,0.20)',
            borderRadius: 12,
            background: '#ffffff',
            overflow: 'hidden',
            boxShadow: '0 14px 34px rgba(99,102,241,0.12)',
            minHeight: 300,
          }}
        >
          <video
            src="/DRINK COMMERCIAL - Daniel Schiffer style.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: 210,
              display: 'block',
              objectFit: 'cover',
              background: '#0f172a',
            }}
          />
          <div style={{ padding: '17px 18px 19px' }}>
            <div style={{ fontSize: 14, fontWeight: 850, color: '#172033', marginBottom: 7 }}>
              Pipeline preview
            </div>
            <div style={{ fontSize: 12.5, color: '#718096', lineHeight: 1.55, marginBottom: 14 }}>
              This loop queues generation jobs only. The separate AI/video pipeline will consume those records later.
            </div>
            <button
              type="button"
              onClick={onCreateAd}
              style={{
                border: '1px solid #fed7c3',
                background: '#fff4ef',
                color: '#e8622a',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Open Create Ad
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 22 }}>
          <InlineState title="Workspace could not load" copy={error} tone="error" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 22 }}>
        <Metric label="Projects" value={loading ? '-' : String(projects.length)} detail="Backend projects owned by your account." />
        <Metric label="Ad drafts" value={loading ? '-' : String(adCount)} detail="Drafts saved through the Create Ad workflow." />
        <Metric label="Assets / Jobs" value={loading ? '-' : `${registeredAssets}/${queuedJobs}`} detail="Registered metadata records and queued jobs." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 850 }}>Start from here</h2>
              <p style={{ margin: '5px 0 0', color: '#8a97aa', fontSize: 12.5 }}>Each option opens the backend-connected Create Ad workflow.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
            <QuickAction
              active
              badge="Fastest"
              title="Start with product images"
              copy="Select local references and register their metadata with an ad draft."
              onClick={onCreateAd}
            />
            <QuickAction
              badge="Guided"
              title="Build a cinematic concept"
              copy="Save product details, notes, platform, and shot direction as draft data."
              onClick={onCreateAd}
            />
            <QuickAction
              badge="Queued"
              title="Prepare generation"
              copy="Create a pending pipeline job record for the future generation service."
              onClick={onCreateAd}
            />
          </div>
        </div>

        <aside>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: '#0f172a', fontWeight: 850 }}>Recent work</h2>
            <button
              type="button"
              onClick={onCreateAd}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#e8622a',
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              New
            </button>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {loading && <InlineState title="Loading projects" copy="Fetching your projects and latest ad drafts." />}
            {!loading && !error && recentAds.length === 0 && (
              <InlineState title="No ad drafts yet" copy="Create a project and save your first ad draft to see it here." />
            )}
            {!loading && recentAds.map((ad) => (
              <MiniProject
                key={ad.id}
                name={ad.title || ad.productName || 'Untitled ad'}
                status={`${ad.status.toLowerCase()} in ${ad.projectName}`}
                detail={`${ad._count?.assets ?? 0} assets, ${ad._count?.pipelineJobs ?? 0} jobs`}
                time={formatRelativeDate(ad.updatedAt)}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

function formatRelativeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Updated';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return 'Now';
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default HomeDashboard;
