import { useState } from 'react';
import type { ReactNode } from 'react';
import { guidedApi } from '../../api/guidedWorkspaceApi';
import type { CreativeArtifact, CreativeRevision, GuidedWorkspace } from '../../api/guidedWorkspaceApi';
import { getApiErrorMessage } from '../../api/client';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="gw-field"><span>{label}</span>{children}</label>;
}
export function EditorControls({ adId, artifact, revision, revisions, editor, accept }: {
  adId: string; artifact?: CreativeArtifact; revision?: CreativeRevision; revisions: CreativeRevision[];
  editor: { dirty: boolean; saving: boolean; conflict: boolean; error: string | null; validation: string | null; draft: unknown; save: () => Promise<boolean>; flush: () => Promise<CreativeRevision | undefined>; reload: () => void; rebase: () => void; undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean };
  accept: (workspace: GuidedWorkspace) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState('');
  const approved = !!revision && artifact?.approvedRevisionId === revision.id;
  const history = revisions.filter((item) => item.artifactId === artifact?.id).sort((a, b) => b.version - a.version);
  const historyRevision = history.find((item) => item.id === historyId);
  const perform = async (request: () => Promise<GuidedWorkspace>) => {
    setBusy(true); setError(null);
    try { accept(await request()); } catch (cause) { setError(getApiErrorMessage(cause)); } finally { setBusy(false); }
  };
  return <div className="gw-editor-controls">
    <div className="gw-toolbar">
      <span className={`gw-badge ${approved && !editor.dirty ? 'approved' : ''}`}>
        {editor.saving ? 'Saving…' : editor.dirty ? 'Unsaved edits · autosave' : revision ? `Version ${revision.version} · ${approved ? 'approved' : 'needs approval'}` : 'New draft'}
      </span>
      <button type="button" disabled={!editor.canUndo || editor.saving} onClick={editor.undo}>Undo</button>
      <button type="button" disabled={!editor.canRedo || editor.saving} onClick={editor.redo}>Redo</button>
      <button type="button" disabled={editor.saving || editor.conflict || !!editor.validation || (!editor.dirty && !!revision)} onClick={() => { void editor.save(); }}>Save draft</button>
      <button type="button" className="primary" disabled={(approved && !editor.dirty) || editor.conflict || busy || !!editor.validation}
        onClick={() => { void perform(async () => { const saved = await editor.flush(); if (!saved) throw new Error('Save must complete before approval. Your edits are retained.'); return guidedApi.approve(adId, saved.artifactId, saved.id); }); }}>{editor.dirty ? 'Save & approve this version' : 'Approve this version'}</button>
    </div>
    {(editor.validation || editor.error || error) && <p className="gw-error" role="alert">{editor.validation || editor.error || error}</p>}
    {editor.conflict && <div className="gw-warning" role="alert">
      <p>A newer server revision exists. Your edits are preserved. Reload the workspace to fetch its latest version, then compare before choosing.</p>
      <details><summary>Compare saved and local content</summary><div className="gw-grid"><Field label="Latest loaded server version"><textarea rows={8} readOnly value={JSON.stringify(revision?.content, null, 2) ?? ''} /></Field><Field label="Your local edits"><textarea rows={8} readOnly value={JSON.stringify(editor.draft, null, 2)} /></Field></div></details>
      <div className="gw-toolbar"><button type="button" onClick={editor.reload}>Discard local edits · load server version</button><button type="button" onClick={editor.rebase}>Keep my edits as the next draft</button></div>
    </div>}
    {history.length > 0 && <details className="gw-history"><summary>Revision history ({history.length})</summary>
      <div className="gw-toolbar"><select aria-label="Revision history" value={historyId} onChange={(event) => setHistoryId(event.target.value)}><option value="">Choose a version to inspect</option>{history.map((item) => <option key={item.id} value={item.id}>Version {item.version} · {item.origin} · {new Date(item.createdAt).toLocaleString()}</option>)}</select>
        <button type="button" disabled={!historyId || editor.dirty || editor.saving || busy} onClick={() => { void perform(() => guidedApi.restore(adId, historyId)); }}>Restore as new draft</button></div>
      {historyRevision && <pre className="gw-json">{JSON.stringify(historyRevision.content, null, 2)}</pre>}
      <small>Restoring creates a new draft. Previous approvals and generated media remain in history.</small>
    </details>}
  </div>;
}
