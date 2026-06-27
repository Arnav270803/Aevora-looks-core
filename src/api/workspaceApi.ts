import { apiRequest, ApiError } from './client';
import { tokenStorage } from '../auth/tokenStorage';

export type ProjectSummary = {
  id: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    ads: number;
  };
};

export type AdStatus = 'DRAFT' | 'READY' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';

export type AdDraft = {
  id: string;
  projectId: string;
  title: string;
  status: AdStatus;
  productName?: string | null;
  brandName?: string | null;
  category?: string | null;
  referenceNotes?: string | null;
  objective?: string | null;
  platform?: string | null;
  aspectRatio?: string | null;
  durationSeconds?: number | null;
  creativeBrief?: Record<string, unknown> | null;
  pipelineSpec?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assets: number;
    pipelineJobs: number;
    renderOutputs: number;
  };
};

export type ProjectDetail = ProjectSummary & {
  ads: AdDraft[];
};

export type AssetKind = 'PRODUCT_IMAGE' | 'REFERENCE_IMAGE' | 'LOGO' | 'BRAND_GUIDE' | 'OTHER';

export type AssetRecord = {
  id: string;
  adId: string;
  kind: AssetKind;
  status: 'REGISTERED' | 'READY' | 'FAILED';
  fileName: string;
  mimeType: string;
  sizeBytes?: number | null;
  storageProvider: string;
  storageKey: string;
  url?: string | null;
  checksum?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type PipelineStepRun = {
  id: string;
  jobId: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'SKIPPED';
  sequence: number;
  inputPayload?: Record<string, unknown> | null;
  outputPayload?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type PipelineJob = {
  id: string;
  adId: string;
  requestedById: string;
  type: 'AD_GENERATION' | 'RENDER_EXPORT';
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
  priority: number;
  provider?: string | null;
  requestPayload?: Record<string, unknown> | null;
  resultPayload?: Record<string, unknown> | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  stepRuns?: PipelineStepRun[];
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export type SaveAdPayload = {
  title?: string;
  productName?: string;
  brandName?: string;
  category?: string;
  referenceNotes?: string;
  objective?: string;
  platform?: string;
  aspectRatio?: string;
  durationSeconds?: number;
  creativeBrief?: Record<string, unknown>;
  pipelineSpec?: Record<string, unknown>;
};

export type CreateAssetPayload = {
  kind?: AssetKind;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
  checksum?: string;
  metadata?: Record<string, unknown>;
};

export type CreatePipelineJobPayload = {
  type?: 'AD_GENERATION' | 'RENDER_EXPORT';
  priority?: number;
  provider?: string;
  requestPayload?: Record<string, unknown>;
  steps?: Array<{
    name: string;
    sequence?: number;
    inputPayload?: Record<string, unknown>;
  }>;
};

export function createProject(payload: CreateProjectPayload) {
  return protectedRequest<{ project: ProjectSummary }>('/projects', {
    method: 'POST',
    body: payload,
  }).then((response) => response.project);
}

export function listProjects() {
  return protectedRequest<{ projects: ProjectSummary[] }>('/projects').then((response) => response.projects);
}

export function getProject(projectId: string) {
  return protectedRequest<{ project: ProjectDetail }>(`/projects/${projectId}`).then((response) => response.project);
}

export function createAd(projectId: string, payload: SaveAdPayload) {
  return protectedRequest<{ ad: AdDraft }>(`/projects/${projectId}/ads`, {
    method: 'POST',
    body: payload,
  }).then((response) => response.ad);
}

export function getAd(adId: string) {
  return protectedRequest<{ ad: AdDraft }>(`/ads/${adId}`).then((response) => response.ad);
}

export function updateAd(adId: string, payload: SaveAdPayload & { status?: AdStatus }) {
  return protectedRequest<{ ad: AdDraft }>(`/ads/${adId}`, {
    method: 'PATCH',
    body: payload,
  }).then((response) => response.ad);
}

export function createAsset(adId: string, payload: CreateAssetPayload) {
  return protectedRequest<{ asset: AssetRecord }>(`/ads/${adId}/assets`, {
    method: 'POST',
    body: payload,
  }).then((response) => response.asset);
}

export function listAssets(adId: string) {
  return protectedRequest<{ assets: AssetRecord[] }>(`/ads/${adId}/assets`).then((response) => response.assets);
}

export function createPipelineJob(adId: string, payload: CreatePipelineJobPayload) {
  return protectedRequest<{ job: PipelineJob }>(`/ads/${adId}/pipeline-jobs`, {
    method: 'POST',
    body: payload,
  }).then((response) => response.job);
}

export function listPipelineJobs(adId: string) {
  return protectedRequest<{ jobs: PipelineJob[] }>(`/ads/${adId}/pipeline-jobs`).then((response) => response.jobs);
}

export function getPipelineJob(jobId: string) {
  return protectedRequest<{ job: PipelineJob }>(`/pipeline-jobs/${jobId}`).then((response) => response.job);
}

function protectedRequest<T>(path: string, options: Parameters<typeof apiRequest<T>>[1] = {}) {
  const accessToken = tokenStorage.getAccessToken();

  if (!accessToken) {
    throw new ApiError('Please log in to continue.', 401);
  }

  return apiRequest<T>(path, {
    ...options,
    accessToken,
  });
}
