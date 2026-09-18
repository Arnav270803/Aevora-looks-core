import { currentRevision, findArtifact, guidedApi } from '../../api/guidedWorkspaceApi';
import type { GuidedWorkspace, Operation, ScriptContent } from '../../api/guidedWorkspaceApi';
import { EditorControls, Field } from './EditorControls';
import { useRevisionEditor } from './useRevisionEditor';

const emptyScript: ScriptContent = { voiceover: [], captions: [] };
export default function ScriptEditor({ workspace, accept, run, busy }: {
  workspace: GuidedWorkspace; accept: (workspace: GuidedWorkspace) => void;
  run: (operation: Operation, revisionId: string | null, shotId?: string) => Promise<void>; busy: boolean;
}) {
  const artifact = findArtifact(workspace, 'SCRIPT');
  const revision = currentRevision<ScriptContent>(workspace, artifact);
  const editor = useRevisionEditor({
    storageKey: `aevora:edit:${workspace.ad.id}:script`, revision, empty: emptyScript, accept,
    save: (id, content) => guidedApi.saveScript(workspace.ad.id, id, content),
    resolve: (next) => currentRevision<ScriptContent>(next, findArtifact(next, 'SCRIPT')),
    validate: (content) => validateScript(content, workspace.ad.durationSeconds ?? 600),
  });
  const patchBeat = (kind: 'voiceover' | 'captions', index: number, patch: Record<string, string | number>) => {
    editor.setDraft((draft) => ({ ...draft, [kind]: draft[kind].map((beat, position) => position === index ? { ...beat, ...patch } : beat) }));
  };
  const append = (kind: 'voiceover' | 'captions') => editor.setDraft((draft) => {
    const start = draft[kind].at(-1)?.endSecond ?? 0;
    const beat = { id: crypto.randomUUID(), startSecond: start, endSecond: Math.min(start + 3, workspace.ad.durationSeconds ?? 600), text: '', ...(kind === 'voiceover' ? { delivery: 'Natural and clear' } : { emphasis: '' }) };
    return { ...draft, [kind]: [...draft[kind], beat] };
  });
  return <section className="gw-panel">
    <div className="gw-section-heading"><div><h2>Script writing</h2><p>Edit timed voiceover and captions, then approve the version used to plan your shots.</p></div>
      <button type="button" disabled={busy || editor.dirty || editor.saving || !workspace.allowedActions.includes('GENERATE_SCRIPT')} onClick={() => { void run('GENERATE_SCRIPT', artifact?.currentRevisionId ?? null); }}>{revision ? 'Generate a new script draft' : 'Generate script'}</button></div>
    <EditorControls adId={workspace.ad.id} artifact={artifact} revision={revision} revisions={workspace.revisions} editor={editor} accept={accept} />
    {(['voiceover', 'captions'] as const).map((kind) => <div key={kind} className="gw-block">
      <div className="gw-section-heading"><h3>{kind === 'voiceover' ? 'Voiceover beats' : 'On-screen captions'}</h3><button type="button" onClick={() => append(kind)}>Add {kind === 'voiceover' ? 'beat' : 'caption'}</button></div>
      {editor.draft[kind].length === 0 && <p className="gw-empty">No {kind === 'voiceover' ? 'voiceover beats' : 'captions'} yet. Generate a script or add your own.</p>}
      {editor.draft[kind].map((beat, index) => <div className="gw-beat" key={beat.id}>
        <div className="gw-toolbar"><strong>{index + 1}</strong><Field label="Start (seconds)"><input type="number" min={0} step={0.1} value={beat.startSecond} onChange={(event) => patchBeat(kind, index, { startSecond: event.target.valueAsNumber })} /></Field><Field label="End (seconds)"><input type="number" min={0} step={0.1} value={beat.endSecond} onChange={(event) => patchBeat(kind, index, { endSecond: event.target.valueAsNumber })} /></Field>
          <button type="button" className="danger" onClick={() => editor.setDraft((draft) => ({ ...draft, [kind]: draft[kind].filter((_, position) => position !== index) }))}>Remove</button></div>
        <Field label={kind === 'voiceover' ? 'Spoken text' : 'Caption text'}><textarea rows={2} value={beat.text} onChange={(event) => patchBeat(kind, index, { text: event.target.value })} /></Field>
        {kind === 'voiceover' ? <Field label="Delivery"><input value={'delivery' in beat ? beat.delivery : ''} onChange={(event) => patchBeat(kind, index, { delivery: event.target.value })} /></Field> : <Field label="Emphasis (optional)"><input value={'emphasis' in beat ? beat.emphasis ?? '' : ''} onChange={(event) => patchBeat(kind, index, { emphasis: event.target.value })} /></Field>}
      </div>)}
    </div>)}
    <p className="gw-note">Voiceover text is the creative script. Spoken audio is included in the export when an audio asset is added to the timeline; writing text alone does not synthesize a voice.</p>
  </section>;
}
function validateScript(content: ScriptContent, duration: number) {
  if (!Array.isArray(content.voiceover) || !Array.isArray(content.captions)) return 'This draft has an unsupported script format. Load the server version.';
  if (!content.voiceover.length && !content.captions.length) return 'Add at least one voiceover beat or caption.';
  for (const [kind, beats] of Object.entries(content)) {
    for (let index = 0; index < beats.length; index++) {
      const beat = beats[index];
      if (!beat || !beat.text.trim()) return `Enter text for ${kind} ${index + 1}.`;
      if (!Number.isFinite(beat.startSecond) || !Number.isFinite(beat.endSecond) || beat.startSecond < 0 || beat.endSecond <= beat.startSecond || beat.endSecond > duration) return `${kind} ${index + 1} must have a valid time range within ${duration} seconds.`;
      if (kind === 'voiceover' && index > 0 && beat.startSecond < (beats[index - 1]?.endSecond ?? 0)) return 'Voiceover beats must be ordered without overlapping.';
    }
  }
  return null;
}
