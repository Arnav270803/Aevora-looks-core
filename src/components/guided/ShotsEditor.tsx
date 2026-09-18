import { useState } from 'react';
import { currentRevision, findArtifact, guidedApi, orderedShots } from '../../api/guidedWorkspaceApi';
import type { GuidedWorkspace, Operation, ScriptContent, ShotContent } from '../../api/guidedWorkspaceApi';
import type { AssetRecord, ShotRecord } from '../../api/workspaceApi';
import { getApiErrorMessage } from '../../api/client';
import { EditorControls, Field } from './EditorControls';
import { useRevisionEditor } from './useRevisionEditor';

type Props = { workspace: GuidedWorkspace; accept: (workspace: GuidedWorkspace) => void; run: (operation: Operation, revisionId: string | null, shotId?: string) => Promise<void>; busy: boolean; mode: 'shots' | 'scenes'; dirty: boolean };

export default function ShotsEditor(props: Props) {
  const { workspace, accept, run, busy, mode, dirty } = props;
  const storyboard = findArtifact(workspace, 'STORYBOARD');
  const storyboardRevision = currentRevision(workspace, storyboard);
  const script = findArtifact(workspace, 'SCRIPT');
  const shots = orderedShots(workspace);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newShot, setNewShot] = useState<{ description: string; image: string; motion: string } | null>(null);
  const perform = async (request: () => Promise<GuidedWorkspace>) => {
    setWorking(true); setError(null);
    try { accept(await request()); } catch (cause) { setError(getApiErrorMessage(cause)); } finally { setWorking(false); }
  };
  const reorder = (from: number, to: number) => {
    const ids = shots.map((shot) => shot.id);
    const [id] = ids.splice(from, 1);
    if (!id) return;
    ids.splice(to, 0, id);
    void perform(() => guidedApi.saveStoryboard(workspace.ad.id, storyboard?.currentRevisionId ?? null, ids));
  };
  return <section className="gw-panel">
    <div className="gw-section-heading"><div><h2>{mode === 'shots' ? 'Shot plan & cinematic images' : 'Scene clips'}</h2><p>{mode === 'shots' ? 'Review each composition and camera direction. Generate or upload a keyframe, then explicitly choose the candidate to use.' : 'Generate each clip from its approved shot and selected keyframe. Regeneration preserves previous candidates.'}</p></div>
      {mode === 'shots' && <button type="button" disabled={busy || working || dirty || !workspace.allowedActions.includes('GENERATE_STORYBOARD') || !script?.approvedRevisionId || script.approvedRevisionId !== script.currentRevisionId} onClick={() => { void run('GENERATE_STORYBOARD', storyboard?.currentRevisionId ?? null); }}>{shots.length ? 'Generate a new shot plan' : 'Generate shot plan'}</button>}</div>
    {error && <p role="alert" className="gw-error">{error}</p>}
    <div className="gw-toolbar"><span className={`gw-badge ${storyboard?.approvedRevisionId && storyboard.approvedRevisionId === storyboard.currentRevisionId ? 'approved' : ''}`}>Storyboard {storyboardRevision ? `v${storyboardRevision.version}` : 'not created'} · {shots.length} shots</span>
      {mode === 'shots' && <><button type="button" disabled={busy || working || dirty} onClick={() => setNewShot({ description: '', image: '', motion: '' })}>Add a shot</button>
        <button type="button" disabled={!shots.length || busy || working || dirty} onClick={() => { void perform(() => guidedApi.saveStoryboard(workspace.ad.id, storyboard?.currentRevisionId ?? null, shots.map((shot) => shot.id))); }}>Save plan against current script</button>
        <button type="button" className="primary" disabled={!storyboard?.currentRevisionId || storyboard.currentRevisionId === storyboard.approvedRevisionId || busy || working || dirty} onClick={() => { if (storyboard?.currentRevisionId) void perform(() => guidedApi.approve(workspace.ad.id, storyboard.id, storyboard.currentRevisionId!)); }}>Approve storyboard order</button></>}
    </div>
    {mode === 'shots' && !script?.approvedRevisionId && <p className="gw-warning">Approve a script before asking AI to generate a shot plan. You can prepare manual shots here.</p>}
    {newShot && <form className="gw-block" onSubmit={(event) => { event.preventDefault(); void perform(async () => { const result = await guidedApi.addShot(workspace.ad.id, { ...blankShot(shots.length + 1), visualDescription: newShot.description, imagePrompt: newShot.image, videoPrompt: newShot.motion }); setNewShot(null); return result; }); }}>
      <h3>New manual shot</h3><Field label="Visual description"><textarea required value={newShot.description} onChange={(event) => setNewShot({ ...newShot, description: event.target.value })} /></Field>
      <Field label="Keyframe image prompt"><textarea required value={newShot.image} onChange={(event) => setNewShot({ ...newShot, image: event.target.value })} /></Field><Field label="Video motion prompt"><textarea required value={newShot.motion} onChange={(event) => setNewShot({ ...newShot, motion: event.target.value })} /></Field>
      <div className="gw-toolbar"><button type="submit" disabled={working}>Create shot draft</button><button type="button" onClick={() => setNewShot(null)}>Cancel</button></div>
    </form>}
    {shots.length === 0 && <p className="gw-empty">No shot plan yet. Approve your script and generate the plan, or add a manual shot.</p>}
    {shots.map((shot, index) => <div key={shot.id} className="gw-shot">
      <div className="gw-section-heading"><h3>Shot {index + 1} · {shot.role.replaceAll('_', ' ')}</h3>{mode === 'shots' && <div className="gw-toolbar">
        <button type="button" aria-label={`Move shot ${index + 1} earlier`} disabled={index === 0 || working || dirty || busy} onClick={() => reorder(index, index - 1)}>↑</button>
        <button type="button" aria-label={`Move shot ${index + 1} later`} disabled={index === shots.length - 1 || working || dirty || busy} onClick={() => reorder(index, index + 1)}>↓</button>
        <button type="button" className="danger" disabled={working || dirty || busy || shots.length <= 1} onClick={() => { if (window.confirm('Remove this shot from the current storyboard? Its revisions and media will remain in history.')) void perform(() => guidedApi.saveStoryboard(workspace.ad.id, storyboard?.currentRevisionId ?? null, shots.filter((item) => item.id !== shot.id).map((item) => item.id))); }}>Remove from plan</button>
      </div>}</div>
      <ShotEditor {...props} shot={shot} />
    </div>)}
    {storyboard && <details className="gw-history"><summary>Storyboard history</summary>{workspace.revisions.filter((revision) => revision.artifactId === storyboard.id).sort((a, b) => b.version - a.version).map((revision) => <div className="gw-toolbar" key={revision.id}><span>Version {revision.version} · {new Date(revision.createdAt).toLocaleString()}</span><button type="button" disabled={dirty || working || busy} onClick={() => { void perform(() => guidedApi.restore(workspace.ad.id, revision.id)); }}>Restore as new draft</button></div>)}</details>}
  </section>;
}

function ShotEditor({ workspace, accept, run, busy, mode, shot }: Props & { shot: ShotRecord }) {
  const artifact = findArtifact(workspace, 'SHOT_PLAN', shot.id);
  const revision = currentRevision<ShotContent>(workspace, artifact);
  const editor = useRevisionEditor({
    storageKey: `aevora:edit:${workspace.ad.id}:shot:${shot.id}`, revision, empty: blankShot(shot.shotNumber), accept,
    save: (id, content) => guidedApi.saveShot(workspace.ad.id, shot.id, id, content),
    resolve: (next) => currentRevision<ShotContent>(next, findArtifact(next, 'SHOT_PLAN', shot.id)), validate: validateShot,
  });
  const patch = (value: Partial<ShotContent>) => editor.setDraft((content) => ({ ...content, ...value }));
  const script = currentRevision<ScriptContent>(workspace, findArtifact(workspace, 'SCRIPT'));
  const images = workspace.assets.filter((asset) => asset.status === 'READY' && asset.mimeType.startsWith('image/'));
  const kind = mode === 'shots' ? 'KEYFRAME' : 'CLIP';
  const approved = artifact?.approvedRevisionId && artifact.approvedRevisionId === artifact.currentRevisionId;
  const storyboard = findArtifact(workspace, 'STORYBOARD');
  const storyboardApproved = !!storyboard?.approvedRevisionId && storyboard.approvedRevisionId === storyboard.currentRevisionId;
  return <>
    <details open={mode === 'shots'} className="gw-shot-details"><summary>Shot script, prompts & camera directions</summary>
      <EditorControls adId={workspace.ad.id} artifact={artifact} revision={revision} revisions={workspace.revisions} editor={editor} accept={accept} />
      <div className="gw-grid">
        <Field label="Role"><select value={editor.draft.role} onChange={(event) => patch({ role: event.target.value as ShotContent['role'] })}>{['hook', 'problem', 'product_hero', 'benefit', 'proof', 'cta'].map((role) => <option key={role} value={role}>{role.replaceAll('_', ' ')}</option>)}</select></Field>
        <Field label="Requested duration (seconds)"><input type="number" min={0.1} max={120} step={0.1} value={editor.draft.durationSeconds} onChange={(event) => patch({ durationSeconds: event.target.valueAsNumber })} /></Field>
      </div>
      <Field label="Visual description"><textarea rows={2} value={editor.draft.visualDescription} onChange={(event) => patch({ visualDescription: event.target.value })} /></Field>
      <div className="gw-grid three">{(['framing', 'movement', 'lensFeel'] as const).map((name) => <Field key={name} label={name === 'lensFeel' ? 'Lens feel' : `Camera ${name}`}><input value={editor.draft.camera[name]} onChange={(event) => patch({ camera: { ...editor.draft.camera, [name]: event.target.value } })} /></Field>)}</div>
      <div className="gw-grid"><Field label="Lighting"><input value={editor.draft.lighting} onChange={(event) => patch({ lighting: event.target.value })} /></Field><Field label="Environment"><input value={editor.draft.environment} onChange={(event) => patch({ environment: event.target.value })} /></Field></div>
      <Field label="Image composition prompt"><textarea rows={3} value={editor.draft.imagePrompt} onChange={(event) => patch({ imagePrompt: event.target.value })} /></Field>
      <Field label="Video motion prompt"><textarea rows={3} value={editor.draft.videoPrompt} onChange={(event) => patch({ videoPrompt: event.target.value })} /></Field>
      <Field label="Negative prompt"><textarea rows={2} value={editor.draft.negativePrompt} onChange={(event) => patch({ negativePrompt: event.target.value })} /></Field>
      <Field label="Objects (one per line)"><textarea rows={2} value={editor.draft.objects.join('\n')} onChange={(event) => patch({ objects: event.target.value.split('\n') })} /></Field>
      <Field label="Product continuity rules (one per line)"><textarea rows={2} value={editor.draft.productContinuityNotes.join('\n')} onChange={(event) => patch({ productContinuityNotes: event.target.value.split('\n') })} /></Field>
      <Field label="Caption for this shot"><input value={editor.draft.captionText} onChange={(event) => patch({ captionText: event.target.value })} /></Field>
      <fieldset><legend>Reference images</legend><div className="gw-reference-list">{images.map((asset) => <label key={asset.id}><input type="checkbox" checked={editor.draft.referenceAssetIds.includes(asset.id)} onChange={(event) => patch({ referenceAssetIds: event.target.checked ? [...editor.draft.referenceAssetIds, asset.id] : editor.draft.referenceAssetIds.filter((id) => id !== asset.id) })} />{asset.url && <img src={asset.url} alt="" loading="lazy" />}{asset.fileName}</label>)}</div></fieldset>
      {script && <fieldset><legend>Linked voiceover beats</legend>{script.content.voiceover.map((beat) => <label className="gw-check" key={beat.id}><input type="checkbox" checked={editor.draft.scriptBeatIds?.includes(beat.id) ?? false} onChange={(event) => patch({ scriptBeatIds: event.target.checked ? [...(editor.draft.scriptBeatIds ?? []), beat.id] : editor.draft.scriptBeatIds?.filter((id) => id !== beat.id) })} />{beat.startSecond}–{beat.endSecond}s · {beat.text}</label>)}</fieldset>}
    </details>
    <div className="gw-toolbar"><span className="gw-note">{kind === 'KEYFRAME' ? 'Choose the image that will condition this shot.' : 'Choose the clip to include in the timeline.'}</span>
      <button type="button" className="primary" disabled={busy || editor.dirty || editor.saving || !approved || !storyboardApproved || !workspace.allowedActions.includes(kind === 'KEYFRAME' ? 'GENERATE_KEYFRAME' : 'GENERATE_CLIP') || (kind === 'CLIP' && (!shot.keyframeAssetId || shot.keyframeCompatible === false))} onClick={() => { void run(kind === 'KEYFRAME' ? 'GENERATE_KEYFRAME' : 'GENERATE_CLIP', artifact?.currentRevisionId ?? null, shot.id); }}>Generate new {kind === 'KEYFRAME' ? 'keyframe' : 'clip'} candidate</button>
    </div>
    {!approved && <p className="gw-note">Save and approve this shot before generation. Uploaded images can be prepared now.</p>}
    {!storyboardApproved && <p className="gw-note">Approve the current storyboard order in the Shots tab before generating media.</p>}
    {kind === 'CLIP' && !shot.keyframeAssetId && <p className="gw-warning">Select a keyframe in the Shots tab before generating this clip.</p>}
    <MediaCandidates workspace={workspace} shot={shot} revisionId={artifact?.currentRevisionId ?? null} kind={kind} disabled={busy || editor.dirty || editor.saving} accept={accept} />
  </>;
}

function MediaCandidates({ workspace, shot, revisionId, kind, disabled, accept }: {
  workspace: GuidedWorkspace; shot: ShotRecord; revisionId: string | null; kind: 'KEYFRAME' | 'CLIP'; disabled: boolean; accept: (workspace: GuidedWorkspace) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedId = kind === 'KEYFRAME' ? shot.keyframeAssetId : shot.videoAssetId;
  const selectedCompatible = kind === 'KEYFRAME' ? shot.keyframeCompatible : shot.videoCompatible;
  const candidates = workspace.assets.filter((asset) => asset.id === selectedId || (asset.metadata?.shotId === shot.id && asset.metadata?.generatedRole === kind));
  const references = workspace.assets.filter((asset) => asset.status === 'READY' && asset.mimeType.startsWith('image/') && (asset.kind === 'PRODUCT_IMAGE' || asset.kind === 'REFERENCE_IMAGE'));
  const select = async (asset: AssetRecord) => {
    setBusy(true); setError(null);
    try { accept(await guidedApi.selectAsset(workspace.ad.id, shot.id, kind, asset.id, revisionId)); } catch (cause) { setError(getApiErrorMessage(cause)); } finally { setBusy(false); }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP image no larger than 5MB.'); return; }
    setBusy(true); setError(null);
    try {
      await guidedApi.upload(workspace.ad.id, file, { source: 'guided-workspace', manualUpload: true, shotId: shot.id, generatedRole: 'KEYFRAME' });
      accept(await guidedApi.get(workspace.ad.id));
    } catch (cause) { setError(getApiErrorMessage(cause)); } finally { setBusy(false); }
  };
  return <div className="gw-block">
    {kind === 'KEYFRAME' && <><Field label="Upload a manual keyframe"><input type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled || busy} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; void upload(file); }} /></Field><p className="gw-note">Manual uploads remain candidates until selected. AI keyframes require an image provider configured on the worker; any configuration error is shown with the job.</p></>}
    {error && <p role="alert" className="gw-error">{error}</p>}
    {candidates.length === 0 && <p className="gw-empty">No {kind === 'KEYFRAME' ? 'keyframe' : 'clip'} candidates yet.</p>}
    <div className="gw-candidates">{candidates.map((asset) => {
      const manual = asset.metadata?.manualUpload === true || asset.metadata?.localUpload === true;
      const stale = asset.id === selectedId && selectedCompatible === false;
      const olderRevision = !!asset.metadata?.sourceRevisionId && asset.metadata.sourceRevisionId !== revisionId && !manual;
      return <article className={`gw-candidate ${asset.id === selectedId ? 'selected' : ''}`} key={asset.id}>
        {asset.url && asset.status === 'READY' ? kind === 'KEYFRAME' ? <img src={asset.url} alt={`Keyframe candidate for shot ${shot.shotNumber}`} loading="lazy" /> : <video src={asset.url} controls playsInline preload="metadata" /> : <div className="gw-empty">Media {asset.status.toLowerCase()} · preview unavailable</div>}
        <div className="gw-candidate-body"><strong>{asset.id === selectedId ? 'Selected' : 'Candidate'}{manual ? ' · manual upload' : ''}{stale ? ' · needs review' : ''}</strong><small>{new Date(asset.createdAt).toLocaleString()}{stale ? ' · selection needs compatibility review' : olderRevision ? ' · older revision; the server checks compatibility on selection' : ''}</small>
          <button type="button" disabled={disabled || busy || asset.status !== 'READY' || (asset.id === selectedId && selectedCompatible !== false)} onClick={() => { void select(asset); }}>{stale ? 'Re-accept this' : 'Use this'} {kind === 'KEYFRAME' ? 'keyframe' : 'clip'}</button>{asset.url && <a href={asset.url} target="_blank" rel="noreferrer">Open original</a>}
        </div></article>;
    })}</div>
    {kind === 'KEYFRAME' && references.length > 0 && <details className="gw-history"><summary>Use an existing uploaded reference as the keyframe</summary><p className="gw-note">This deliberately uses the uploaded image directly instead of generating a new composition.</p><div className="gw-reference-list">{references.map((asset) => <div key={asset.id}>{asset.url && <img src={asset.url} alt={asset.fileName} />}<span>{asset.fileName}</span><button type="button" disabled={disabled || busy || (asset.id === selectedId && selectedCompatible !== false)} onClick={() => { void select(asset); }}>Use uploaded image</button></div>)}</div></details>}
  </div>;
}

function blankShot(shotNumber: number): ShotContent {
  return { shotNumber, role: 'product_hero', durationSeconds: 4, visualDescription: '', camera: { framing: 'Medium shot', movement: 'Slow push in', lensFeel: 'Natural perspective' }, lighting: 'Soft studio light', environment: 'Product studio', objects: [], productContinuityNotes: [], captionText: '', imagePrompt: '', videoPrompt: '', negativePrompt: '', referenceAssetIds: [], scriptBeatIds: [] };
}
function validateShot(content: ShotContent) {
  if (!content.visualDescription.trim() || !content.imagePrompt.trim() || !content.videoPrompt.trim()) return 'Enter a visual description, image prompt, and video motion prompt.';
  if (!Number.isFinite(content.durationSeconds) || content.durationSeconds <= 0 || content.durationSeconds > 120) return 'Shot duration must be greater than zero and no more than 120 seconds. The video provider may impose a narrower limit.';
  if (!content.camera.framing.trim() || !content.camera.movement.trim() || !content.camera.lensFeel.trim()) return 'Complete the camera framing, movement, and lens fields.';
  return null;
}
