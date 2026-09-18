import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, getApiErrorMessage } from '../../api/client';
import { currentRevision, findArtifact, guidedApi } from '../../api/guidedWorkspaceApi';
import type { GuidedWorkspace, Operation } from '../../api/guidedWorkspaceApi';
import ScriptEditor from './ScriptEditor';
import ShotsEditor from './ShotsEditor';
import TimelineEditor from './TimelineEditor';
import './guided-workspace.css';

const steps = [
  { id: 'script', title: 'Script writing', kind: 'SCRIPT' },
  { id: 'shots', title: 'Shots & keyframes', kind: 'STORYBOARD' },
  { id: 'scenes', title: 'Scene clips', kind: null },
  { id: 'timeline', title: 'Timeline editor', kind: 'TIMELINE' },
  { id: 'exports', title: 'Final videos', kind: null },
] as const;
type Step = typeof steps[number]['id'];
function readStep(): Step {
  const requested = new URLSearchParams(window.location.search).get('step');
  return steps.find((step) => step.id === requested)?.id ?? 'script';
}

export default function GuidedAdWorkspace({ adId }: { adId: string }) {
  const [workspace, setWorkspace] = useState<GuidedWorkspace | null>(null);
  const [step, setStep] = useState<Step>(readStep);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const dirtyEditors = useRef(new Set<string>());
  const requestEpoch = useRef(0);
  const mounted = useRef(true);
  const runningAction = useRef(false);
  const actionKeys = useRef(readPendingActionKeys(adId));
  const persistKeys = () => { try { sessionStorage.setItem(`aevora:actions:${adId}`, JSON.stringify([...actionKeys.current])); } catch { /* Request remains idempotent in this mounted workspace. */ } };
  const accept = useCallback((next: GuidedWorkspace) => { requestEpoch.current++; if (mounted.current) setWorkspace(next); }, []);
  const refresh = useCallback(async (showError = true) => {
    const epoch = ++requestEpoch.current;
    try {
      const next = await guidedApi.get(adId);
      if (mounted.current && epoch === requestEpoch.current) { setWorkspace(next); if (showError) setError(null); }
    } catch (cause) { if (mounted.current && epoch === requestEpoch.current && showError) setError(getApiErrorMessage(cause, 'Unable to load the saved workspace.')); }
    finally { if (mounted.current) setLoading(false); }
  }, [adId]);
  useEffect(() => {
    mounted.current = true; void refresh();
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') void refresh(false); }, 4000);
    const onFocus = () => { void refresh(false); };
    window.addEventListener('focus', onFocus);
    return () => { mounted.current = false; requestEpoch.current++; window.clearInterval(interval); window.removeEventListener('focus', onFocus); };
  }, [refresh]);
  useEffect(() => {
    const change = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; dirty: boolean }>).detail;
      if (!detail) return;
      if (detail.dirty) dirtyEditors.current.add(detail.key); else dirtyEditors.current.delete(detail.key);
      setDirty(dirtyEditors.current.size > 0);
    };
    const popstate = () => { setStep(readStep()); };
    window.addEventListener('aevora-editor-dirty', change);
    window.addEventListener('popstate', popstate);
    return () => { window.removeEventListener('aevora-editor-dirty', change); window.removeEventListener('popstate', popstate); };
  }, []);
  const changeStep = (next: Step) => {
    if (dirty) { setNotice('Save or discard the current edits before changing tabs. Valid edits autosave after a short pause.'); return; }
    const url = new URL(window.location.href); url.searchParams.set('step', next);
    window.history.pushState({}, '', url); setStep(next); setNotice(null);
  };
  const run = async (operation: Operation, revisionId: string | null, shotId?: string) => {
    if (runningAction.current) return;
    if (dirty) { setError('Save and approve your edits before starting generation.'); return; }
    const identity = `${operation}:${shotId ?? 'ad'}:${revisionId ?? 'new'}`;
    const key = actionKeys.current.get(identity) ?? crypto.randomUUID();
    actionKeys.current.set(identity, key);
    persistKeys();
    runningAction.current = true; setBusy(true); setError(null); setNotice(null);
    try {
      const job = await guidedApi.action(adId, operation, revisionId, shotId, key);
      actionKeys.current.delete(identity);
      persistKeys();
      setNotice(`Request ${job.id.slice(0, 8)} is ${job.status.toLowerCase()}. Progress is saved, so you can return to this workspace later.`);
      await refresh(false);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status >= 400 && cause.status < 500 && cause.status !== 408 && cause.status !== 429) actionKeys.current.delete(identity);
      persistKeys();
      setError(getApiErrorMessage(cause));
      // Keep the same key after an uncertain network failure; retry cannot create a second paid request.
    } finally { runningAction.current = false; setBusy(false); }
  };
  const importLegacy = async () => {
    setBusy(true); setError(null);
    try { accept(await guidedApi.importLegacy(adId)); setNotice('Available legacy material was imported as editable drafts. Review and approve it before generation. Existing final videos are preserved.'); }
    catch (cause) { setError(getApiErrorMessage(cause)); } finally { setBusy(false); }
  };
  if (loading && !workspace) return <div className="guided-workspace"><p className="gw-empty">Loading saved ad workspace…</p></div>;
  if (!workspace) return <div className="guided-workspace"><p className="gw-error" role="alert">{error ?? 'Workspace not found.'}</p><button type="button" onClick={() => { void refresh(); }}>Retry loading</button><a href="/app?view=my-ads">Back to My Ads</a></div>;
  const activeJobs = workspace.jobs.filter((job) => job.status === 'QUEUED' || job.status === 'RUNNING');
  const generationBusy = busy || activeJobs.length > 0;
  const legacy = workspace.ad.workflowMode === 'LEGACY_AUTOMATIC' || workspace.artifacts.length === 0 && workspace.renderOutputs.length > 0;
  return <div className="guided-workspace">
    <header className="gw-header"><div><a href="/app?view=my-ads">← My Ads</a><h1>{workspace.ad.title}</h1><p>{workspace.ad.productName ?? 'Ad workspace'} · {workspace.ad.aspectRatio ?? 'Aspect ratio unset'} · {workspace.ad.durationSeconds ?? '—'}s target</p></div><div className="gw-toolbar"><span className="gw-badge">{dirty ? 'Local edits pending' : 'Saved workspace'}</span><button type="button" onClick={() => { void refresh(); }}>Reload workspace</button></div></header>
    <nav className="gw-tabs" aria-label="Ad editing stages">{steps.map((item, index) => {
      const artifact = item.kind ? findArtifact(workspace, item.kind) : undefined;
      const approved = !!artifact?.currentRevisionId && artifact.currentRevisionId === artifact.approvedRevisionId;
      return <button type="button" key={item.id} aria-current={step === item.id ? 'step' : undefined} onClick={() => changeStep(item.id)}><span>{index + 1}</span>{item.title}{approved && <small>Approved</small>}</button>;
    })}</nav>
    {error && <div className="gw-error" role="alert">{error}</div>}{notice && <div className="gw-notice" role="status">{notice}</div>}
    {workspace.warnings.map((warning, index) => <div className="gw-warning" key={index}>{typeof warning === 'string' ? warning : warning.message}</div>)}
    {legacy && <div className="gw-warning"><p>This ad comes from the automatic workflow. Import available scripts and shots to create reviewable drafts. Saved final videos stay accessible even when intermediate inputs are missing.</p><button type="button" disabled={generationBusy || dirty} onClick={() => { void importLegacy(); }}>Import legacy material into guided editing</button></div>}
    {workspace.jobs.length > 0 && <details className="gw-job-panel" open={activeJobs.length > 0}><summary>{activeJobs.length ? `${activeJobs.length} active job${activeJobs.length === 1 ? '' : 's'}` : 'Generation history'}</summary>
      {workspace.jobs.slice(0, 20).map((job) => <div className="gw-job" key={job.id}><div><strong>{(job.operation ?? job.requestPayload?.guided?.operation ?? job.type).replaceAll('_', ' ')}</strong><span className="gw-badge">{job.status.toLowerCase()}{job.cancelRequested ? ' · cancellation requested' : ''}</span><small>{new Date(job.createdAt).toLocaleString()} · {job.id.slice(0, 8)}</small>{job.errorMessage && <p className="gw-error">{job.errorMessage}</p>}{job.stepRuns?.length ? <p className="gw-note">{job.stepRuns.map((item) => `${item.name.replaceAll('_', ' ')}: ${item.status.toLowerCase()}`).join(' · ')}</p> : null}</div>
        {(job.status === 'QUEUED' || job.status === 'RUNNING') && job.operation && <button type="button" disabled={busy || job.cancelRequested} onClick={() => { setBusy(true); void guidedApi.cancel(job.id).then(() => refresh(false)).catch((cause: unknown) => setError(getApiErrorMessage(cause))).finally(() => setBusy(false)); }}>Request cancellation</button>}
        {job.status === 'FAILED' && job.retryAction && <div><button type="button" disabled={generationBusy || dirty} onClick={() => {
          if (!job.retryAction || runningAction.current) return;
          runningAction.current = true; setBusy(true); setError(null);
          void guidedApi.retry(adId, job.retryAction).then(() => { setNotice('The original request is being resumed with its saved inputs and idempotency key.'); return refresh(false); }).catch((cause: unknown) => setError(getApiErrorMessage(cause))).finally(() => { runningAction.current = false; setBusy(false); });
        }}>Retry / resume this request</button>{job.errorCode?.includes('UNCERTAIN') && <p className="gw-note">Submission status is uncertain. Resume first reconciles the saved provider attempt; it does not authorize a blind replacement request.</p>}</div>}
      </div>)}
    </details>}
    {step === 'script' && <ScriptEditor workspace={workspace} accept={accept} run={run} busy={generationBusy} />}
    {(step === 'shots' || step === 'scenes') && <ShotsEditor workspace={workspace} accept={accept} run={run} busy={generationBusy} mode={step} dirty={dirty} />}
    {step === 'timeline' && <TimelineEditor workspace={workspace} accept={accept} run={run} busy={generationBusy} />}
    {step === 'exports' && <section className="gw-panel"><div className="gw-section-heading"><div><h2>Final videos & exports</h2><p>Each export keeps its exact media and timeline version. Making a new edit does not remove previous videos.</p></div><button type="button" onClick={() => changeStep('timeline')}>Open timeline editor</button></div>
      {workspace.renderOutputs.filter((output) => output.kind === 'VIDEO').length === 0 && <p className="gw-empty">No final video yet. Select clips, save and approve a timeline, then export the edit.</p>}
      <div className="gw-exports">{workspace.renderOutputs.filter((output) => output.kind === 'VIDEO').map((output) => <article key={output.id} className="gw-export">
        {output.url && output.mimeType?.startsWith('video/') ? <video src={output.url} controls playsInline preload="metadata" /> : <p className="gw-empty">Video file unavailable for this render record.</p>}
        <div><h3>{String(output.metadata?.title ?? `Export ${output.id.slice(0, 8)}`)}</h3><p>{new Date(output.createdAt).toLocaleString()} · {output.width ?? '?'} × {output.height ?? '?'}{output.durationMs ? ` · ${(output.durationMs / 1000).toFixed(2)}s` : ''}</p>
          {Boolean(output.metadata?.timelineRevisionId) && <small>Timeline revision: {String(output.metadata?.timelineRevisionId)}</small>}
          {output.url && <div className="gw-toolbar"><button type="button" className="primary" disabled={downloadingId !== null} onClick={() => { setDownloadingId(output.id); setError(null); void downloadMedia(output.url!, `aevora-${output.id}.mp4`).catch((cause: unknown) => setError(getApiErrorMessage(cause))).finally(() => setDownloadingId(null)); }}>{downloadingId === output.id ? 'Downloading…' : 'Download MP4'}</button><a href={output.url} target="_blank" rel="noreferrer">Open original</a></div>}
        </div>
      </article>)}</div>
    </section>}
  </div>;
}
function readPendingActionKeys(adId: string) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(`aevora:actions:${adId}`) ?? '[]') as unknown;
    if (Array.isArray(saved)) return new Map<string, string>(saved.filter((entry): entry is [string, string] => Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'string'));
  } catch { /* Browser storage is optional. */ }
  return new Map<string, string>();
}
async function downloadMedia(url: string, fileName: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('The video download failed. Reload the workspace to refresh its media URL, then retry.');
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = objectUrl; link.download = fileName;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
