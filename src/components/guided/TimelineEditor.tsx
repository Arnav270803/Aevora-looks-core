import { useState } from 'react';
import { currentRevision, findArtifact, guidedApi, mediaDuration, orderedShots } from '../../api/guidedWorkspaceApi';
import type { AudioTrack, GuidedWorkspace, Operation, ScriptContent, ShotContent, TimelineClip, TimelineContent } from '../../api/guidedWorkspaceApi';
import { getApiErrorMessage } from '../../api/client';
import { EditorControls, Field } from './EditorControls';
import { useRevisionEditor } from './useRevisionEditor';
import TimelinePreview from './TimelinePreview';

export default function TimelineEditor({ workspace, accept, run, busy }: {
  workspace: GuidedWorkspace; accept: (workspace: GuidedWorkspace) => void;
  run: (operation: Operation, revisionId: string | null, shotId?: string) => Promise<void>; busy: boolean;
}) {
  const artifact = findArtifact(workspace, 'TIMELINE');
  const revision = currentRevision<TimelineContent>(workspace, artifact);
  const empty = emptyTimeline(workspace.ad.aspectRatio ?? '9:16');
  const editor = useRevisionEditor({
    storageKey: `aevora:edit:${workspace.ad.id}:timeline`, revision, empty, accept,
    save: (id, content) => guidedApi.saveTimeline(workspace.ad.id, id, content),
    resolve: (next) => currentRevision<TimelineContent>(next, findArtifact(next, 'TIMELINE')),
    validate: (content) => validateTimeline(content, workspace),
  });
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addClipId, setAddClipId] = useState('');
  const [addAudioId, setAddAudioId] = useState('');
  const timeline = editor.draft;
  const durationFrames = timeline.clips.reduce((sum, clip) => sum + clip.durationFrames, 0);
  const shots = orderedShots(workspace);
  const clipAssets = shots.flatMap((shot) => {
    const asset = workspace.assets.find((item) => item.id === shot.videoAssetId && item.status === 'READY' && item.mimeType.startsWith('video/'));
    return asset ? [{ shot, asset }] : [];
  });
  const audioAssets = workspace.assets.filter((asset) => asset.status === 'READY' && asset.mimeType.startsWith('audio/'));
  const patchClip = (id: string, patch: Partial<TimelineClip>) => editor.setDraft((value) => ({ ...value, clips: value.clips.map((clip) => clip.id === id ? { ...clip, ...patch } : clip) }));
  const patchAudio = (id: string, patch: Partial<AudioTrack>) => editor.setDraft((value) => ({ ...value, audioTracks: value.audioTracks.map((track) => track.id === id ? { ...track, ...patch } : track) }));
  const reorder = (from: number, to: number) => editor.setDraft((value) => {
    const clips = [...value.clips]; const [clip] = clips.splice(from, 1); if (clip) clips.splice(to, 0, clip); return { ...value, clips };
  });
  const makeClip = (shotId: string, assetId: string): TimelineClip => {
    const shot = shots.find((item) => item.id === shotId);
    const asset = workspace.assets.find((item) => item.id === assetId);
    const plan = currentRevision<ShotContent>(workspace, findArtifact(workspace, 'SHOT_PLAN', shotId));
    const desired = plan?.content.durationSeconds ?? shot?.durationSeconds ?? 4;
    const sourceDuration = mediaDuration(asset);
    return { id: crypto.randomUUID(), shotId, assetId, sourceInFrame: 0, durationFrames: Math.max(1, Math.floor(Math.min(desired, sourceDuration || desired) * timeline.fps)), fit: 'contain', muted: false, volume: 1 };
  };
  const useSelected = () => {
    if (timeline.clips.length && !window.confirm('Replace the draft clip order with currently selected scene clips? Existing timeline revisions remain in history.')) return;
    editor.setDraft((value) => ({ ...value, clips: clipAssets.map(({ shot, asset }) => makeClip(shot.id, asset.id)) }));
  };
  const addAudio = () => {
    const asset = audioAssets.find((item) => item.id === addAudioId);
    if (!asset) return;
    const frames = Math.floor(mediaDuration(asset) * timeline.fps);
    if (!frames) { setError('Audio duration is missing. Upload the file again so its duration can be recorded.'); return; }
    editor.setDraft((value) => ({ ...value, audioTracks: [...value.audioTracks, { id: crypto.randomUUID(), assetId: asset.id, startFrame: 0, sourceInFrame: 0, durationFrames: Math.min(frames, durationFrames || frames), volume: 1, fadeInFrames: 0, fadeOutFrames: 0 }] }));
    setAddAudioId('');
  };
  const uploadAudio = async (file?: File) => {
    if (!file) return;
    if (!['audio/mpeg', 'audio/wav', 'audio/ogg'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Use an MP3, WAV, or OGG audio file up to 5MB.'); return; }
    setUploading(true); setError(null);
    try {
      const durationSeconds = await inspectAudio(file);
      await guidedApi.upload(workspace.ad.id, file, { source: 'guided-workspace', manualUpload: true, generatedRole: 'AUDIO', durationSeconds, hasAudio: true });
      accept(await guidedApi.get(workspace.ad.id));
    } catch (cause) { setError(getApiErrorMessage(cause)); } finally { setUploading(false); }
  };
  return <section className="gw-panel">
    <div className="gw-section-heading"><div><h2>Timeline & final edit</h2><p>Order clips, trim sources, add timed text and audio, then approve the saved edit for export.</p></div><span className="gw-badge">{durationFrames} frames · {(durationFrames / timeline.fps).toFixed(2)}s</span></div>
    <EditorControls adId={workspace.ad.id} artifact={artifact} revision={revision} revisions={workspace.revisions} editor={editor} accept={accept} />
    {error && <p className="gw-error" role="alert">{error}</p>}
    {previewSafe(timeline) ? <TimelinePreview timeline={timeline} assets={workspace.assets} /> : <p className="gw-preview-empty">Complete valid numeric timing and dimensions to preview the edit.</p>}
    <div className="gw-grid three">
      <Field label="Timeline frame rate"><select value={timeline.fps} onChange={(event) => { const fps = Number(event.target.value); const ratio = fps / timeline.fps; const frame = (value: number) => Math.round(value * ratio); editor.setDraft((value) => ({ ...value, fps, clips: value.clips.map((clip) => ({ ...clip, sourceInFrame: frame(clip.sourceInFrame), durationFrames: Math.max(1, frame(clip.durationFrames)) })), overlays: value.overlays.map((overlay) => ({ ...overlay, startFrame: frame(overlay.startFrame), endFrame: frame(overlay.endFrame) })), audioTracks: value.audioTracks.map((track) => ({ ...track, startFrame: frame(track.startFrame), sourceInFrame: frame(track.sourceInFrame), durationFrames: Math.max(1, frame(track.durationFrames)), fadeInFrames: frame(track.fadeInFrames), fadeOutFrames: frame(track.fadeOutFrames) })) })); }}>{[24, 25, 30, 50, 60].map((fps) => <option key={fps} value={fps}>{fps} fps</option>)}</select></Field>
      <Field label="Export width (pixels)"><input type="number" min={256} max={3840} step={2} value={timeline.width} onChange={(event) => editor.setDraft((value) => ({ ...value, width: event.target.valueAsNumber }))} /></Field>
      <Field label="Export height (pixels)"><input type="number" min={256} max={3840} step={2} value={timeline.height} onChange={(event) => editor.setDraft((value) => ({ ...value, height: event.target.valueAsNumber }))} /></Field>
    </div>
    <div className="gw-block"><div className="gw-section-heading"><h3>Clip order & source trims</h3><button type="button" disabled={!clipAssets.length || busy} onClick={useSelected}>Use selected scenes</button></div>
      <p className="gw-note">Clips play consecutively. All timing fields below are frames at {timeline.fps} fps. No source footage is looped to fill a short clip.</p>
      <div className="gw-timeline-strip" aria-label="Timeline clip order">{timeline.clips.map((clip, index) => <div key={clip.id} style={{ flexGrow: Math.max(1, clip.durationFrames) }}><strong>{index + 1}</strong><span>{(clip.durationFrames / timeline.fps).toFixed(1)}s</span></div>)}</div>
      {timeline.clips.map((clip, index) => {
        const asset = workspace.assets.find((item) => item.id === clip.assetId);
        const sourceFrames = Math.floor(mediaDuration(asset) * timeline.fps);
        return <div className="gw-beat" key={clip.id}>
          <div className="gw-section-heading"><strong>{index + 1}. {asset?.fileName ?? 'Missing clip asset'}</strong><div className="gw-toolbar"><button type="button" disabled={index === 0} onClick={() => reorder(index, index - 1)}>↑</button><button type="button" disabled={index === timeline.clips.length - 1} onClick={() => reorder(index, index + 1)}>↓</button><button type="button" className="danger" onClick={() => editor.setDraft((value) => ({ ...value, clips: value.clips.filter((item) => item.id !== clip.id) }))}>Remove</button></div></div>
          <div className="gw-grid three"><Field label={`Source in (frames${sourceFrames ? ` · source ${sourceFrames}f` : ''})`}><input type="number" min={0} step={1} value={clip.sourceInFrame} onChange={(event) => patchClip(clip.id, { sourceInFrame: event.target.valueAsNumber })} /></Field><Field label="Duration (frames)"><input type="number" min={1} step={1} value={clip.durationFrames} onChange={(event) => patchClip(clip.id, { durationFrames: event.target.valueAsNumber })} /></Field><Field label="Fit"><select value={clip.fit} onChange={(event) => patchClip(clip.id, { fit: event.target.value as TimelineClip['fit'] })}><option value="contain">Contain · preserve full frame</option><option value="cover">Cover · crop to fill</option></select></Field></div>
          <div className="gw-toolbar"><label className="gw-check"><input type="checkbox" checked={clip.muted} onChange={(event) => patchClip(clip.id, { muted: event.target.checked })} />Mute source audio</label><Field label="Source audio volume"><input type="number" min={0} max={2} step={0.05} value={clip.volume} onChange={(event) => patchClip(clip.id, { volume: event.target.valueAsNumber })} /></Field></div>
        </div>;
      })}
      <div className="gw-toolbar"><select aria-label="Selected scene to append" value={addClipId} onChange={(event) => setAddClipId(event.target.value)}><option value="">Choose a selected scene</option>{clipAssets.map(({ shot, asset }) => <option key={asset.id} value={asset.id}>Shot {shots.indexOf(shot) + 1} · {asset.fileName}</option>)}</select><button type="button" disabled={!addClipId} onClick={() => { const source = clipAssets.find(({ asset }) => asset.id === addClipId); if (source) editor.setDraft((value) => ({ ...value, clips: [...value.clips, makeClip(source.shot.id, source.asset.id)] })); setAddClipId(''); }}>Append clip</button></div>
    </div>
    <div className="gw-block"><div className="gw-section-heading"><h3>Text overlays</h3><div className="gw-toolbar"><button type="button" disabled={!durationFrames} onClick={() => editor.setDraft((value) => ({ ...value, overlays: [...value.overlays, { id: crypto.randomUUID(), text: '', startFrame: 0, endFrame: Math.min(durationFrames, timeline.fps * 3), position: 'bottom', fontSize: 48, color: '#ffffff' }] }))}>Add text</button><button type="button" disabled={!durationFrames} onClick={() => {
      const script = currentRevision<ScriptContent>(workspace, findArtifact(workspace, 'SCRIPT'));
      if (!script) { setError('No saved script captions are available.'); return; }
      if (timeline.overlays.length && !window.confirm('Replace current text overlays with the saved script captions?')) return;
      editor.setDraft((value) => ({ ...value, overlays: script.content.captions.map((caption) => ({ id: crypto.randomUUID(), text: caption.text, startFrame: Math.round(caption.startSecond * value.fps), endFrame: Math.round(caption.endSecond * value.fps), position: 'bottom', fontSize: 48, color: '#ffffff' })) }));
    }}>Import script captions</button></div></div>
      {timeline.overlays.map((overlay) => <div className="gw-beat" key={overlay.id}><Field label="Text"><textarea rows={2} value={overlay.text} onChange={(event) => editor.setDraft((value) => ({ ...value, overlays: value.overlays.map((item) => item.id === overlay.id ? { ...item, text: event.target.value } : item) }))} /></Field>
        <div className="gw-grid three">{(['startFrame', 'endFrame', 'fontSize'] as const).map((field) => <Field key={field} label={field === 'fontSize' ? 'Font size (output pixels)' : field === 'startFrame' ? 'Start frame' : 'End frame'}><input type="number" min={0} step={1} value={overlay[field]} onChange={(event) => editor.setDraft((value) => ({ ...value, overlays: value.overlays.map((item) => item.id === overlay.id ? { ...item, [field]: event.target.valueAsNumber } : item) }))} /></Field>)}</div>
        <div className="gw-toolbar"><Field label="Position"><select value={overlay.position} onChange={(event) => editor.setDraft((value) => ({ ...value, overlays: value.overlays.map((item) => item.id === overlay.id ? { ...item, position: event.target.value as 'top' | 'center' | 'bottom' } : item) }))}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select></Field><Field label="Text color"><input type="color" value={overlay.color} onChange={(event) => editor.setDraft((value) => ({ ...value, overlays: value.overlays.map((item) => item.id === overlay.id ? { ...item, color: event.target.value } : item) }))} /></Field><button type="button" className="danger" onClick={() => editor.setDraft((value) => ({ ...value, overlays: value.overlays.filter((item) => item.id !== overlay.id) }))}>Remove text</button></div>
      </div>)}
    </div>
    <div className="gw-block"><h3>Audio tracks</h3><p className="gw-note">Add recorded voiceover or music. Uploaded audio is mixed with unmuted clip audio. Volume is 0–2; browser preview caps each source at 1, while export applies the requested gain.</p>
      <Field label="Upload MP3, WAV, or OGG (up to 5MB)"><input type="file" accept="audio/mpeg,audio/wav,audio/ogg" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; void uploadAudio(file); }} /></Field>
      <div className="gw-toolbar"><select aria-label="Audio asset to add" value={addAudioId} onChange={(event) => setAddAudioId(event.target.value)}><option value="">Choose uploaded audio</option>{audioAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.fileName}</option>)}</select><button type="button" disabled={!addAudioId || uploading || !durationFrames} onClick={addAudio}>Add audio track</button></div>
      {timeline.audioTracks.map((track) => <div className="gw-beat" key={track.id}><div className="gw-section-heading"><strong>{workspace.assets.find((asset) => asset.id === track.assetId)?.fileName ?? 'Missing audio asset'}</strong><button type="button" className="danger" onClick={() => editor.setDraft((value) => ({ ...value, audioTracks: value.audioTracks.filter((item) => item.id !== track.id) }))}>Remove track</button></div>
        <div className="gw-grid three">{(['startFrame', 'sourceInFrame', 'durationFrames', 'fadeInFrames', 'fadeOutFrames'] as const).map((field) => <Field key={field} label={{ startFrame: 'Timeline start (frames)', sourceInFrame: 'Source in (frames)', durationFrames: 'Duration (frames)', fadeInFrames: 'Fade in (frames)', fadeOutFrames: 'Fade out (frames)' }[field]}><input type="number" min={0} step={1} value={track[field]} onChange={(event) => patchAudio(track.id, { [field]: event.target.valueAsNumber })} /></Field>)}<Field label="Volume"><input type="number" min={0} max={2} step={0.05} value={track.volume} onChange={(event) => patchAudio(track.id, { volume: event.target.valueAsNumber })} /></Field></div>
      </div>)}
      <label className="gw-check"><input type="checkbox" checked={timeline.normalizeAudio} onChange={(event) => editor.setDraft((value) => ({ ...value, normalizeAudio: event.target.checked }))} />Normalize mixed audio during export</label>
    </div>
    <div className="gw-toolbar"><button type="button" className="primary" disabled={busy || editor.dirty || editor.saving || !!editor.validation || !artifact?.approvedRevisionId || artifact.currentRevisionId !== artifact.approvedRevisionId || !workspace.allowedActions.includes('RENDER_EXPORT')} onClick={() => { void run('RENDER_EXPORT', artifact?.currentRevisionId ?? null); }}>Export approved edit to MP4</button><span className="gw-note">Exports use this exact revision. Previous final videos remain available.</span></div>
  </section>;
}

function emptyTimeline(aspectRatio: string): TimelineContent {
  return { fps: 24, width: aspectRatio === '9:16' ? 1080 : aspectRatio === '1:1' ? 1080 : 1920, height: aspectRatio === '9:16' ? 1920 : 1080, clips: [], overlays: [], audioTracks: [], normalizeAudio: true };
}
function validateTimeline(content: TimelineContent, workspace: GuidedWorkspace) {
  const int = (value: number, minimum = 0) => Number.isInteger(value) && value >= minimum;
  if (!int(content.fps, 1) || content.fps > 60) return 'Choose a valid timeline frame rate up to 60 fps.';
  if (![content.width, content.height].every((value) => int(value, 256) && value <= 3840 && value % 2 === 0)) return 'Output dimensions must be even numbers from 256 to 3840 pixels.';
  if (!content.clips.length) return 'Add at least one selected scene clip to the timeline.';
  if (content.clips.length > 50) return 'An edit can contain up to 50 clips.';
  const total = content.clips.reduce((sum, clip) => sum + clip.durationFrames, 0);
  if (total > content.fps * 600) return 'An edit can be at most 10 minutes long.';
  for (const [index, clip] of content.clips.entries()) {
    if (!int(clip.sourceInFrame) || !int(clip.durationFrames, 1)) return `Clip ${index + 1} needs a nonnegative source in and a positive whole-frame duration.`;
    const asset = workspace.assets.find((item) => item.id === clip.assetId);
    if (!asset || asset.status !== 'READY' || !asset.mimeType.startsWith('video/')) return `Clip ${index + 1} references unavailable video.`;
    const measured = mediaDuration(asset);
    if (measured && clip.sourceInFrame + clip.durationFrames > Math.floor(measured * content.fps + 0.001)) return `Clip ${index + 1} extends beyond its source. Shorten the trim or choose a longer candidate.`;
    if (!Number.isFinite(clip.volume) || clip.volume < 0 || clip.volume > 2) return `Clip ${index + 1} audio volume must be between 0 and 2.`;
  }
  for (const [index, overlay] of content.overlays.entries()) {
    if (!overlay.text.trim() || !int(overlay.startFrame) || !int(overlay.endFrame, 1) || overlay.endFrame <= overlay.startFrame || overlay.endFrame > total) return `Text overlay ${index + 1} needs text and a valid range within the edit.`;
    if (!int(overlay.fontSize, 8) || overlay.fontSize > 200 || !/^#[0-9a-f]{6}$/i.test(overlay.color)) return `Text overlay ${index + 1} needs a font size from 8 to 200 and a valid color.`;
  }
  for (const [index, track] of content.audioTracks.entries()) {
    if (![track.startFrame, track.sourceInFrame, track.fadeInFrames, track.fadeOutFrames].every((value) => int(value)) || !int(track.durationFrames, 1) || track.startFrame + track.durationFrames > total || track.fadeInFrames + track.fadeOutFrames > track.durationFrames) return `Audio track ${index + 1} has invalid timing or fades.`;
    const asset = workspace.assets.find((item) => item.id === track.assetId);
    if (!asset || !asset.mimeType.startsWith('audio/') || asset.status !== 'READY') return `Audio track ${index + 1} references unavailable audio.`;
    const measured = mediaDuration(asset);
    if (measured && track.sourceInFrame + track.durationFrames > Math.floor(measured * content.fps + 0.001)) return `Audio track ${index + 1} extends beyond its source.`;
    if (!Number.isFinite(track.volume) || track.volume < 0 || track.volume > 2) return `Audio track ${index + 1} volume must be between 0 and 2.`;
  }
  return null;
}
function previewSafe(content: TimelineContent) {
  const valid = (value: number, min = 0) => Number.isFinite(value) && value >= min;
  return valid(content.fps, 1) && valid(content.width, 1) && valid(content.height, 1)
    && content.clips.every((clip) => valid(clip.sourceInFrame) && valid(clip.durationFrames, 1) && valid(clip.volume))
    && content.overlays.every((overlay) => valid(overlay.startFrame) && valid(overlay.endFrame) && valid(overlay.fontSize, 1))
    && content.audioTracks.every((track) => [track.startFrame, track.sourceInFrame, track.durationFrames, track.fadeInFrames, track.fadeOutFrames, track.volume].every((value) => valid(value)));
}
function inspectAudio(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    const cleanup = () => { window.clearTimeout(timeout); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url); };
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error('Audio metadata could not be read. Try another file.')); }, 15000);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => { const duration = audio.duration; cleanup(); if (Number.isFinite(duration) && duration > 0) resolve(duration); else reject(new Error('The audio file has no readable duration.')); };
    audio.onerror = () => { cleanup(); reject(new Error('The browser cannot read this audio file.')); };
    audio.src = url;
  });
}
