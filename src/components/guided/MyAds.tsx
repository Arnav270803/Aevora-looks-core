import { useEffect, useState } from 'react';
import { getProject, listProjects } from '../../api/workspaceApi';
import type { AdDraft } from '../../api/workspaceApi';
import { getApiErrorMessage } from '../../api/client';
import './guided-workspace.css';

export default function MyAds() {
  const [ads, setAds] = useState<(AdDraft & { projectName: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    void listProjects().then((projects) => Promise.all(projects.map((project) => getProject(project.id)))).then((projects) => {
      if (!canceled) setAds(projects.flatMap((project) => project.ads.map((ad) => ({ ...ad, projectName: project.name }))).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    }).catch((cause: unknown) => { if (!canceled) setError(getApiErrorMessage(cause)); }).finally(() => { if (!canceled) setLoading(false); });
    return () => { canceled = true; };
  }, []);
  return <section className="guided-workspace"><header className="gw-header"><div><h1>My Ads</h1><p>Reopen scripts, shots, edits, and final videos from your saved projects.</p></div><a className="gw-link-button" href="/app?view=create-ad">Create an ad</a></header>
    {loading && <p className="gw-empty">Loading your saved ads…</p>}{error && <p className="gw-error" role="alert">{error}</p>}
    {!loading && !error && ads.length === 0 && <p className="gw-empty">No saved ads yet. Create an ad to begin.</p>}
    <div className="gw-ad-grid">{ads.map((ad) => <article className="gw-panel" key={ad.id}><span className="gw-badge">{ad.status.toLowerCase()}</span><h2>{ad.title}</h2><p>{ad.projectName} · {ad.productName ?? 'Untitled product'}</p><small>Updated {new Date(ad.updatedAt).toLocaleString()}</small><div className="gw-toolbar"><a className="gw-link-button" href={`/app/ads/${ad.id}?step=script`}>Open workspace</a><a href={`/app/ads/${ad.id}?step=exports`}>Final videos</a></div></article>)}</div>
  </section>;
}
