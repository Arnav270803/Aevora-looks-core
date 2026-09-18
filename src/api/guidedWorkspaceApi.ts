import { protectedRequest } from './workspaceApi';
import type { AdDraft, AssetRecord, RenderOutputRecord, ShotRecord } from './workspaceApi';

export type ArtifactKind = 'SCRIPT' | 'STORYBOARD' | 'SHOT_PLAN' | 'TIMELINE';
export type Operation = 'GENERATE_SCRIPT' | 'GENERATE_STORYBOARD' | 'GENERATE_KEYFRAME' | 'GENERATE_CLIP' | 'RENDER_EXPORT';
export type CreativeArtifact = {
  id: string; adId: string; kind: ArtifactKind; shotId: string | null;
  currentRevisionId: string | null; approvedRevisionId: string | null;
};
export type CreativeRevision<T = unknown> = {
  id: string; artifactId: string; version: number; content: T;
  sourceRevisionIds: string[]; origin: string; createdAt: string;
};
export type VoiceoverBeat = { id: string; startSecond: number; endSecond: number; text: string; delivery: string };
export type CaptionBeat = { id: string; startSecond: number; endSecond: number; text: string; emphasis?: string };
export type ScriptContent = { voiceover: VoiceoverBeat[]; captions: CaptionBeat[] };
export type ShotContent = {
  shotId?: string; shotNumber: number; role: 'hook' | 'problem' | 'product_hero' | 'benefit' | 'proof' | 'cta';
  durationSeconds: number; visualDescription: string; camera: { framing: string; movement: string; lensFeel: string };
  lighting: string; environment: string; objects: string[]; productContinuityNotes: string[];
  captionText: string; imagePrompt: string; videoPrompt: string; negativePrompt: string;
  referenceAssetIds: string[]; scriptBeatIds?: string[];
};
export type StoryboardContent = { shots: { shotId: string; revisionId: string }[] };
export type TimelineClip = {
  id: string; shotId: string; assetId: string; sourceInFrame: number; durationFrames: number;
  fit: 'contain' | 'cover'; muted: boolean; volume: number;
};
export type TextOverlay = {
  id: string; text: string; startFrame: number; endFrame: number;
  position: 'top' | 'center' | 'bottom'; fontSize: number; color: string;
};
export type AudioTrack = {
  id: string; assetId: string; startFrame: number; sourceInFrame: number; durationFrames: number;
  volume: number; fadeInFrames: number; fadeOutFrames: number;
};
export type TimelineContent = {
  fps: number; width: number; height: number; clips: TimelineClip[]; overlays: TextOverlay[];
  audioTracks: AudioTrack[]; normalizeAudio: boolean;
};
export type GuidedJob = {
  id: string; status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  type: string; operation?: Operation; shotId?: string; errorCode?: string | null; errorMessage?: string | null;
  createdAt: string; updatedAt?: string; cancelRequested?: boolean;
  retryAction?: { operation: Operation; shotId?: string; expectedRevisionId: string | null; idempotencyKey: string; settings?: { providerMode?: string; imageProvider?: string } };
  requestPayload?: { guided?: { operation?: Operation; shot?: { shotId?: string } } };
  stepRuns?: { id: string; name: string; status: string }[];
};
export type GuidedWorkspace = {
  ad: AdDraft; artifacts: CreativeArtifact[]; revisions: CreativeRevision[];
  shots: ShotRecord[]; assets: AssetRecord[]; jobs: GuidedJob[]; renderOutputs: RenderOutputRecord[];
  allowedActions: Operation[]; warnings: (string | { message: string; code?: string })[];
};
type WorkspaceResponse = { workspace: GuidedWorkspace };
const workspaceResult = (request: Promise<WorkspaceResponse>) => request.then(({ workspace }) => workspace);
const adPath = (adId: string) => `/ads/${encodeURIComponent(adId)}`;

export const guidedApi = {
  get: (adId: string) => workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/workspace`)),
  saveScript: (adId: string, expectedRevisionId: string | null, content: ScriptContent) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/script`, { method: 'PATCH', body: { expectedRevisionId, content } })),
  saveStoryboard: (adId: string, expectedRevisionId: string | null, shotIds: string[]) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/storyboard`, { method: 'PATCH', body: { expectedRevisionId, shotIds } })),
  addShot: (adId: string, content: ShotContent) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/shots`, { method: 'POST', body: { content } })),
  saveShot: (adId: string, shotId: string, expectedRevisionId: string | null, content: ShotContent) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/shots/${shotId}`, { method: 'PATCH', body: { expectedRevisionId, content } })),
  saveTimeline: (adId: string, expectedRevisionId: string | null, content: TimelineContent) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/timeline`, { method: 'PATCH', body: { expectedRevisionId, content } })),
  approve: (adId: string, artifactId: string, revisionId: string) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/approvals`, { method: 'POST', body: { artifactId, revisionId } })),
  restore: (adId: string, revisionId: string) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/revisions/${revisionId}/restore`, { method: 'POST' })),
  selectAsset: (adId: string, shotId: string, kind: 'KEYFRAME' | 'CLIP', assetId: string, expectedRevisionId: string | null) =>
    workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/shots/${shotId}/select-asset`, { method: 'POST', body: { kind, assetId, expectedRevisionId } })),
  action: (adId: string, operation: Operation, expectedRevisionId: string | null, shotId?: string, idempotencyKey: string = crypto.randomUUID()) =>
    protectedRequest<{ job: GuidedJob }>(`${adPath(adId)}/actions`, { method: 'POST', body: { operation, expectedRevisionId, shotId, idempotencyKey } }).then(({ job }) => job),
  cancel: (jobId: string) => protectedRequest<{ job: GuidedJob }>(`/pipeline-jobs/${jobId}/cancel`, { method: 'POST' }).then(({ job }) => job),
  retry: (adId: string, action: NonNullable<GuidedJob['retryAction']>) => protectedRequest<{ job: GuidedJob }>(`${adPath(adId)}/actions`, { method: 'POST', body: action }).then(({ job }) => job),
  importLegacy: (adId: string) => workspaceResult(protectedRequest<WorkspaceResponse>(`${adPath(adId)}/import-legacy`, { method: 'POST' })),
  upload: (adId: string, file: File, metadata: Record<string, unknown>) => fileBase64(file).then((dataBase64) =>
    protectedRequest<{ asset: AssetRecord }>(`${adPath(adId)}/assets/upload`, {
      method: 'POST', body: { kind: 'OTHER', fileName: file.name, mimeType: file.type, sizeBytes: file.size, dataBase64, metadata },
    }).then(({ asset }) => asset)),
};

export function findArtifact(workspace: GuidedWorkspace, kind: ArtifactKind, shotId?: string) {
  return workspace.artifacts.find((item) => item.kind === kind && (shotId ? item.shotId === shotId : !item.shotId));
}
export function currentRevision<T>(workspace: GuidedWorkspace, artifact?: CreativeArtifact): CreativeRevision<T> | undefined {
  return workspace.revisions.find((item) => item.id === artifact?.currentRevisionId) as CreativeRevision<T> | undefined;
}
export function orderedShots(workspace: GuidedWorkspace) {
  const storyboard = currentRevision<StoryboardContent>(workspace, findArtifact(workspace, 'STORYBOARD'));
  return storyboard ? storyboard.content.shots.flatMap(({ shotId }) => workspace.shots.filter((shot) => shot.id === shotId)) : workspace.shots;
}
export function mediaDuration(asset?: AssetRecord) {
  const seconds = Number(asset?.metadata?.durationSeconds);
  const millis = Number(asset?.metadata?.durationMs);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : Number.isFinite(millis) && millis > 0 ? millis / 1000 : 0;
}
function fileBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The selected file could not be read.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.readAsDataURL(file);
  });
}
