import { useEffect, useMemo, useRef, useState } from 'react';
import type { AssetRecord } from '../../api/workspaceApi';
import type { AudioTrack, TimelineContent } from '../../api/guidedWorkspaceApi';

export default function TimelinePreview({ timeline, assets }: { timeline: TimelineContent; assets: AssetRecord[] }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(360);
  const seekRequested = useRef(true);
  const clips = useMemo(() => { let start = 0; return timeline.clips.map((clip) => { const entry = { ...clip, start, end: start + clip.durationFrames }; start = entry.end; return entry; }); }, [timeline.clips]);
  const total = clips.at(-1)?.end ?? 0;
  const clip = clips.find((item) => frame >= item.start && frame < item.end) ?? clips.at(-1);
  const asset = assets.find((item) => item.id === clip?.assetId);
  const signature = JSON.stringify(timeline);
  useEffect(() => { setPlaying(false); setFrame(0); seekRequested.current = true; setError(null); }, [signature]);
  useEffect(() => {
    if (!canvas.current) return;
    const observer = new ResizeObserver(([entry]) => { if (entry) setPreviewWidth(entry.contentRect.width); });
    observer.observe(canvas.current); return () => observer.disconnect();
  }, []);
  const syncVideo = () => {
    const element = video.current;
    if (!element || !clip) return;
    element.muted = clip.muted;
    element.volume = Math.max(0, Math.min(1, clip.volume));
    if (seekRequested.current && element.readyState >= 1) {
      element.currentTime = Math.max(0, (clip.sourceInFrame + frame - clip.start) / timeline.fps);
      seekRequested.current = false;
    }
    if (playing) void element.play().catch(() => { setPlaying(false); setError('Playback was blocked or the source could not be loaded. Press play to retry.'); });
    else element.pause();
  };
  useEffect(() => { seekRequested.current = true; syncVideo(); }, [clip?.id, asset?.url]);
  useEffect(() => { syncVideo(); }, [playing, frame]);
  const advance = () => {
    if (!clip) return;
    if (clip.end < total) { setFrame(clip.end); seekRequested.current = true; }
    else { setPlaying(false); setFrame(Math.max(0, total - 1)); }
  };
  if (!clips.length) return <div className="gw-preview-empty">Add selected scene clips to preview your edit.</div>;
  return <div className="gw-preview">
    <div ref={canvas} className="gw-preview-canvas" style={{ aspectRatio: `${timeline.width} / ${timeline.height}`, maxWidth: timeline.width > timeline.height ? 760 : 360 }}>
      {asset?.url ? <video key={clip?.id} ref={video} src={asset.url} playsInline preload="metadata" style={{ objectFit: clip?.fit }}
        onLoadedMetadata={syncVideo} onError={() => { setPlaying(false); setError('This clip preview is unavailable. Reload the workspace to refresh media access.'); }} onEnded={advance}
        onTimeUpdate={() => {
          if (!clip || !video.current || !playing) return;
          const next = clip.start + Math.floor(video.current.currentTime * timeline.fps - clip.sourceInFrame);
          if (next >= clip.end) advance(); else setFrame(Math.max(clip.start, next));
        }} /> : <p>Selected source is unavailable.</p>}
      {timeline.overlays.filter((overlay) => frame >= overlay.startFrame && frame < overlay.endFrame).map((overlay) => <div key={overlay.id} className={`gw-preview-text ${overlay.position}`} style={{ fontSize: overlay.fontSize * previewWidth / timeline.width, color: overlay.color }}>{overlay.text}</div>)}
    </div>
    {timeline.audioTracks.map((track) => <PreviewAudio key={track.id} track={track} url={assets.find((item) => item.id === track.assetId)?.url ?? undefined} frame={frame} fps={timeline.fps} playing={playing} />)}
    <div className="gw-toolbar"><button type="button" disabled={!asset?.url} onClick={() => { if (!playing && frame >= total - 1) { setFrame(0); seekRequested.current = true; } setPlaying((value) => !value); }}>{playing ? 'Pause' : 'Play edit'}</button>
      <input aria-label="Timeline playhead" type="range" min={0} max={Math.max(0, total - 1)} step={1} value={Math.min(frame, total - 1)} onChange={(event) => { seekRequested.current = true; setFrame(Number(event.target.value)); }} />
      <span>{frame} / {total} frames · {(frame / timeline.fps).toFixed(2)}s</span></div>
    {error && <p className="gw-error">{error}</p>}
    <p className="gw-note">Browser edit preview. The export applies the final text rendering and audio normalization.</p>
  </div>;
}

function PreviewAudio({ track, url, frame, fps, playing }: { track: AudioTrack; url?: string; frame: number; fps: number; playing: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const offset = frame - track.startFrame;
    if (!playing || offset < 0 || offset >= track.durationFrames) { element.pause(); return; }
    const desired = (track.sourceInFrame + offset) / fps;
    if (Math.abs(element.currentTime - desired) > 0.3) element.currentTime = desired;
    const fadeIn = track.fadeInFrames ? Math.min(1, offset / track.fadeInFrames) : 1;
    const fadeOut = track.fadeOutFrames ? Math.min(1, (track.durationFrames - offset) / track.fadeOutFrames) : 1;
    element.volume = Math.max(0, Math.min(1, track.volume * fadeIn * fadeOut));
    void element.play().catch(() => undefined);
  }, [track, frame, fps, playing, url]);
  return <audio ref={audio} src={url} preload="metadata" />;
}
