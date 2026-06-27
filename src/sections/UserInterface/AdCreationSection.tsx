import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { getApiErrorMessage } from '../../api/client';
import {
  createAd,
  createAsset,
  createPipelineJob,
  createProject,
  listProjects,
  updateAd,
  type AdDraft,
  type AssetRecord,
  type PipelineJob,
  type ProjectSummary,
  type SaveAdPayload,
} from '../../api/workspaceApi';
import { WORKFLOW_STEPS, type WorkflowStepId } from './workflow';

type AdCreationSectionProps = {
  activeStep: WorkflowStepId;
  onStepChange: (step: WorkflowStepId) => void;
  onWorkspaceChange?: () => void;
};

type DraftForm = {
  productName: string;
  brandName: string;
  category: string;
  referenceNotes: string;
  objective: string;
  platform: string;
  aspectRatio: string;
  durationSeconds: string;
  imageGuidance: string[];
};

type SaveState = 'idle' | 'saving' | 'registering-assets' | 'queueing';

const defaultForm: DraftForm = {
  productName: '',
  brandName: '',
  category: '',
  referenceNotes: '',
  objective: '',
  platform: 'Instagram Reels',
  aspectRatio: '9:16',
  durationSeconds: '15',
  imageGuidance: ['Front view'],
};

const Field = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => (
  <label style={{ display: 'block' }}>
    <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 7 }}>
      {label}
    </span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '11px 12px',
        fontSize: 13,
        color: '#172033',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        background: disabled ? '#f8fafc' : '#ffffff',
      }}
    />
  </label>
);

const SelectField = ({
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
}) => (
  <label style={{ display: 'block' }}>
    <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 7 }}>
      {label}
    </span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      style={{
        width: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '11px 12px',
        fontSize: 13,
        color: '#172033',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        background: disabled ? '#f8fafc' : '#ffffff',
      }}
    >
      {children}
    </select>
  </label>
);

const Pill = ({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    style={{
      border: `1px solid ${active ? '#e8622a' : '#e2e8f0'}`,
      background: active ? '#fff4ef' : '#ffffff',
      color: active ? '#e8622a' : '#60708a',
      borderRadius: 999,
      padding: '7px 11px',
      fontSize: 12,
      fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    {children}
  </button>
);

const MiniUpload = ({
  files,
  disabled,
  onFilesSelected,
}: {
  files: File[];
  disabled: boolean;
  onFilesSelected: (files: File[]) => void;
}) => (
  <label
    style={{
      border: '1.5px dashed #cbd5e1',
      borderRadius: 10,
      minHeight: 236,
      background: '#fbfdff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 10,
      color: '#64748b',
      textAlign: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.65 : 1,
    }}
  >
    <input
      type="file"
      multiple
      accept="image/*"
      disabled={disabled}
      onChange={(event) => {
        const nextFiles = Array.from(event.target.files ?? []);
        onFilesSelected(nextFiles);
        event.currentTarget.value = '';
      }}
      style={{ display: 'none' }}
    />
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 14,
      background: '#fff4ef',
      color: '#e8622a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M17 8l-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 750, color: '#172033', marginBottom: 4 }}>
        Select product and reference images
      </div>
      <div style={{ fontSize: 12.5, color: '#8a97aa' }}>
        File metadata is saved now. Binary upload comes in a later loop.
      </div>
    </div>
    <div style={{ fontSize: 11.5, color: '#a1adbd' }}>
      {files.length > 0 ? `${files.length} local file${files.length === 1 ? '' : 's'} selected` : 'JPG, PNG, WebP metadata up to 20MB'}
    </div>
  </label>
);

const ThumbnailRail = ({ files, registeredAssets }: { files: File[]; registeredAssets: AssetRecord[] }) => {
  const labels = files.length > 0 ? files.map((file) => file.name) : ['Front', 'Detail', 'Lifestyle', 'Pack'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      {labels.slice(0, 4).map((label, index) => {
        const registered = registeredAssets.some((asset) => asset.fileName === label);

        return (
          <div
            key={`${label}-${index}`}
            style={{
              minHeight: 78,
              border: `1px solid ${registered ? '#bbf7d0' : '#e2e8f0'}`,
              borderRadius: 8,
              background: registered ? '#ecfdf5' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 6,
              color: registered ? '#059669' : '#9aa7ba',
              fontSize: 11.5,
              fontWeight: 700,
              padding: 8,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M21 15l-4-4-7 7" />
            </svg>
            <span style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{registered ? 'Registered' : label}</span>
          </div>
        );
      })}
    </div>
  );
};

const Checklist = ({ items }: { items: string[] }) => (
  <div style={{ display: 'grid', gap: 10 }}>
    {items.map((item, index) => (
      <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: index === 0 ? '#fff4ef' : '#f8fafc',
          color: index === 0 ? '#e8622a' : '#94a3b8',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <span style={{ fontSize: 12.5, color: '#66758c', lineHeight: 1.45 }}>
          {item}
        </span>
      </div>
    ))}
  </div>
);

const PreviewPhone = ({ label }: { label: string }) => (
  <div style={{
    width: 154,
    height: 274,
    borderRadius: 18,
    border: '1px solid #dfe5ef',
    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
    color: '#9aa7ba',
    margin: '0 auto',
  }}>
    <div style={{
      width: 46,
      height: 46,
      borderRadius: '50%',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
    }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="#94a3b8">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
    <span style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
  </div>
);

const InlineStatus = ({ tone, children }: { tone: 'success' | 'error' | 'info'; children: ReactNode }) => {
  const palette = {
    success: { border: '#bbf7d0', background: '#ecfdf5', color: '#047857' },
    error: { border: '#fecaca', background: '#fff7f7', color: '#b42318' },
    info: { border: '#dbeafe', background: '#eff6ff', color: '#185fa5' },
  }[tone];

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        borderRadius: 8,
        padding: '10px 12px',
        fontSize: 12.5,
        lineHeight: 1.5,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
};

const PromptReferenceStep = ({
  form,
  projects,
  selectedProjectId,
  newProjectName,
  files,
  registeredAssets,
  disabled,
  onFormChange,
  onProjectChange,
  onNewProjectNameChange,
  onFilesSelected,
}: {
  form: DraftForm;
  projects: ProjectSummary[];
  selectedProjectId: string;
  newProjectName: string;
  files: File[];
  registeredAssets: AssetRecord[];
  disabled: boolean;
  onFormChange: (patch: Partial<DraftForm>) => void;
  onProjectChange: (projectId: string) => void;
  onNewProjectNameChange: (value: string) => void;
  onFilesSelected: (files: File[]) => void;
}) => {
  const guidanceOptions = ['Front view', 'Lifestyle', 'Packaging', 'Texture detail'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)', gap: 24 }}>
      <div style={{ display: 'grid', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <SelectField label="Project" value={selectedProjectId} onChange={onProjectChange} disabled={disabled}>
            <option value="">Create or select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </SelectField>
          <Field
            label="New Project Name"
            placeholder="e.g. Spring serum launch"
            value={newProjectName}
            onChange={onNewProjectNameChange}
            disabled={disabled || Boolean(selectedProjectId)}
          />
        </div>

        <MiniUpload files={files} disabled={disabled} onFilesSelected={onFilesSelected} />
        <ThumbnailRail files={files} registeredAssets={registeredAssets} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Product Name" placeholder="e.g. Glow serum bottle" value={form.productName} onChange={(productName) => onFormChange({ productName })} disabled={disabled} />
          <Field label="Brand Name" placeholder="e.g. Aevora Beauty" value={form.brandName} onChange={(brandName) => onFormChange({ brandName })} disabled={disabled} />
          <Field label="Category" placeholder="e.g. Skincare, beverage, wellness" value={form.category} onChange={(category) => onFormChange({ category })} disabled={disabled} />
          <Field label="Objective" placeholder="e.g. Product launch, retargeting ad" value={form.objective} onChange={(objective) => onFormChange({ objective })} disabled={disabled} />
          <Field label="Platform" placeholder="e.g. Instagram Reels" value={form.platform} onChange={(platform) => onFormChange({ platform })} disabled={disabled} />
          <Field label="Duration Seconds" placeholder="15" value={form.durationSeconds} onChange={(durationSeconds) => onFormChange({ durationSeconds })} disabled={disabled} />
        </div>

        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 7 }}>
            Reference Notes
          </span>
          <textarea
            value={form.referenceNotes}
            onChange={(event) => onFormChange({ referenceNotes: event.target.value })}
            placeholder="Add visual notes such as product angle, label visibility, packaging, or mood."
            rows={3}
            disabled={disabled}
            style={{
              width: '100%',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '11px 12px',
              fontSize: 13,
              color: '#172033',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              background: disabled ? '#f8fafc' : '#ffffff',
            }}
          />
        </label>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#27324a', marginBottom: 9 }}>
            Image Guidance
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {guidanceOptions.map((option) => (
              <Pill
                key={option}
                active={form.imageGuidance.includes(option)}
                disabled={disabled}
                onClick={() => {
                  const next = form.imageGuidance.includes(option)
                    ? form.imageGuidance.filter((item) => item !== option)
                    : [...form.imageGuidance, option];
                  onFormChange({ imageGuidance: next });
                }}
              >
                {option}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <aside style={{
        borderLeft: '1px solid #edf1f7',
        paddingLeft: 24,
        display: 'grid',
        alignContent: 'start',
        gap: 22,
      }}>
        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#172033' }}>
            Backend Draft Preview
          </h3>
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            background: '#f8fafc',
            minHeight: 180,
            padding: 16,
            color: '#66758c',
            fontSize: 12.5,
            lineHeight: 1.6,
          }}>
            <strong style={{ display: 'block', color: '#172033', fontSize: 14, marginBottom: 8 }}>
              {form.productName || 'Untitled product ad'}
            </strong>
            {form.brandName || 'Brand not set'} / {form.category || 'Category not set'}
            <br />
            {files.length} selected file{files.length === 1 ? '' : 's'}
            <br />
            {registeredAssets.length} registered asset record{registeredAssets.length === 1 ? '' : 's'}
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#172033' }}>
            What happens next
          </h3>
          <Checklist items={[
            'Save or update the backend ad draft without losing form data on failure.',
            'Register selected file metadata against the saved ad draft.',
            'Queue a pipeline job record. Real generation is intentionally not implemented yet.',
          ]} />
        </div>
      </aside>
    </div>
  );
};

const ShotStep = ({ latestJob }: { latestJob: PipelineJob | null }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div>
      {latestJob && (
        <div style={{ marginBottom: 16 }}>
          <InlineStatus tone="info">
            Generation job {latestJob.id.slice(0, 8)} is {latestJob.status.toLowerCase()}. Cinematic shots will appear after the future pipeline service is connected.
          </InlineStatus>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 18 }}>
        {['Hero macro', 'Lifestyle angle', 'Packaging reveal'].map((shot, index) => (
          <div key={shot} style={{
            minHeight: 168,
            border: `1px solid ${index === 0 ? '#e8622a' : '#e2e8f0'}`,
            borderRadius: 10,
            background: index === 0 ? '#fffaf7' : '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: index === 0 ? '#e8622a' : '#94a3b8',
            fontSize: 13,
            fontWeight: 800,
            textAlign: 'center',
            padding: 16,
          }}>
            {latestJob ? `${shot} pending` : shot}
          </div>
        ))}
      </div>
      <Checklist items={[
        'A queued job record exists, but no AI image generation runs in this loop.',
        'The next service can claim the job and update step statuses.',
        'Keep editing and saving the draft while generation infrastructure is separate.',
      ]} />
    </div>
    <PreviewPhone label="Shot preview pending" />
  </div>
);

const ScriptStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', gap: 12 }}>
      {['Hook', 'Problem', 'Benefit', 'Proof', 'CTA'].map((line, index) => (
        <div key={line} style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr',
          gap: 12,
          alignItems: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          background: '#ffffff',
          padding: '12px',
        }}>
          <span style={{ fontSize: 12, color: '#e8622a', fontWeight: 800 }}>
            {index + 1}. {line}
          </span>
          <span style={{ height: 10, borderRadius: 999, background: '#eef2f7', display: 'block' }} />
        </div>
      ))}
    </div>
    <PreviewPhone label="Script timing" />
  </div>
);

const SceneStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', gap: 12 }}>
      {['Scene 01', 'Scene 02', 'Scene 03', 'Scene 04'].map((scene, index) => (
        <div key={scene} style={{
          display: 'grid',
          gridTemplateColumns: '96px 1fr 84px',
          gap: 14,
          alignItems: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          background: '#ffffff',
          padding: '12px',
        }}>
          <div style={{ height: 52, borderRadius: 8, background: index === 0 ? '#fff4ef' : '#f1f5f9' }} />
          <div>
            <div style={{ fontSize: 13, color: '#172033', fontWeight: 800, marginBottom: 6 }}>{scene}</div>
            <div style={{ height: 8, width: '78%', borderRadius: 999, background: '#eef2f7' }} />
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>0:0{index + 3}</span>
        </div>
      ))}
    </div>
    <PreviewPhone label="Scene preview" />
  </div>
);

const FinalVideoStep = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 24 }}>
    <div style={{ display: 'grid', alignContent: 'start', gap: 16 }}>
      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        background: '#f8fafc',
        minHeight: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: 14,
        fontWeight: 800,
      }}>
        Final timeline and export controls
      </div>
      <Checklist items={[
        'Final video generation is outside this loop.',
        'The queued job record is ready for the future pipeline service.',
        'Render outputs will be attached by backend records later.',
      ]} />
    </div>
    <PreviewPhone label="Final video" />
  </div>
);

const AdCreationSection = ({ activeStep, onStepChange, onWorkspaceChange }: AdCreationSectionProps) => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [form, setForm] = useState<DraftForm>(defaultForm);
  const [adDraft, setAdDraft] = useState<AdDraft | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [registeredAssets, setRegisteredAssets] = useState<AssetRecord[]>([]);
  const [latestJob, setLatestJob] = useState<PipelineJob | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeIndex = WORKFLOW_STEPS.findIndex((step) => step.id === activeStep);
  const fallbackStep = WORKFLOW_STEPS[0];
  const busy = saveState !== 'idle';

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setProjectsLoading(true);
      setError(null);

      try {
        const nextProjects = await listProjects();

        if (!cancelled) {
          setProjects(nextProjects);
          setSelectedProjectId((current) => current || nextProjects[0]?.id || '');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getApiErrorMessage(loadError, 'Unable to load projects.'));
        }
      } finally {
        if (!cancelled) {
          setProjectsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!fallbackStep) {
    return null;
  }

  const current = WORKFLOW_STEPS[activeIndex] ?? fallbackStep;
  const previous = WORKFLOW_STEPS[activeIndex - 1];
  const next = WORKFLOW_STEPS[activeIndex + 1];

  const ctaLabel = useMemo(() => {
    if (activeStep === 'prompt-reference') {
      if (saveState === 'queueing') return 'Queueing Shots...';
      if (latestJob?.status === 'QUEUED') return 'Shots Queued';
      return 'Generate Cinematic Shots';
    }

    if (activeStep === 'cinematic-shots') return 'Continue to Script Writing';
    if (activeStep === 'script-writing') return 'Generate Scenes';
    if (activeStep === 'scene-generation') return 'Build Final Video';
    return 'Export Final Video';
  }, [activeStep, latestJob?.status, saveState]);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

  const panelStyle: CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(99,102,241,0.22)',
    borderRadius: 12,
    boxShadow: '0 12px 34px rgba(99,102,241,0.18), 0 2px 10px rgba(15,23,42,0.05)',
    padding: 24,
  };

  const setFormPatch = (patch: Partial<DraftForm>) => {
    setForm((currentForm) => ({ ...currentForm, ...patch }));
    setError(null);
    setSuccess(null);
  };

  const handleFilesSelected = (nextFiles: File[]) => {
    if (nextFiles.length === 0) {
      return;
    }

    setFiles((currentFiles) => {
      const existing = new Set(currentFiles.map(fileKey));
      const additions = nextFiles.filter((file) => !existing.has(fileKey(file)));
      return [...currentFiles, ...additions];
    });
    setError(null);
    setSuccess(null);
  };

  const ensureProject = async () => {
    if (selectedProjectId) {
      return selectedProjectId;
    }

    const name = newProjectName.trim() || form.productName.trim();

    if (!name) {
      throw new Error('Select a project or enter a new project name before saving.');
    }

    const project = await createProject({
      name,
      description: form.objective.trim() || undefined,
      metadata: {
        source: 'create-ad-ui',
      },
    });
    setProjects((currentProjects) => [project, ...currentProjects]);
    setSelectedProjectId(project.id);
    setNewProjectName('');
    onWorkspaceChange?.();

    return project.id;
  };

  const saveDraft = async () => {
    setSaveState('saving');
    setError(null);
    setSuccess(null);

    try {
      const projectId = await ensureProject();
      const payload = buildAdPayload(form, activeStep);
      const savedAd = adDraft
        ? await updateAd(adDraft.id, payload)
        : await createAd(projectId, payload);

      setAdDraft(savedAd);
      setSuccess(adDraft ? 'Draft updates saved.' : 'Ad draft saved to the backend.');
      onWorkspaceChange?.();

      return savedAd;
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, 'Unable to save the ad draft.'));
      throw saveError;
    } finally {
      setSaveState('idle');
    }
  };

  const registerSelectedAssets = async (draftOverride?: AdDraft) => {
    const draft = draftOverride ?? adDraft;

    if (!draft) {
      throw new Error('Save the ad draft before registering assets.');
    }

    if (files.length === 0) {
      setSuccess('No local files selected. Draft is saved and ready.');
      return registeredAssets;
    }

    setSaveState('registering-assets');
    setError(null);
    setSuccess(null);

    try {
      const alreadyRegistered = new Set(registeredAssets.map((asset) => asset.metadata?.localFileKey).filter(Boolean));
      const pendingFiles = files.filter((file) => !alreadyRegistered.has(fileKey(file)));
      const newAssets = await Promise.all(pendingFiles.map((file, index) => createAsset(draft.id, {
        kind: index === 0 && registeredAssets.length === 0 ? 'PRODUCT_IMAGE' : 'REFERENCE_IMAGE',
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size || undefined,
        metadata: {
          source: 'create-ad-ui',
          localFileKey: fileKey(file),
          lastModified: file.lastModified,
        },
      })));

      const nextAssets = [...registeredAssets, ...newAssets];
      setRegisteredAssets(nextAssets);
      setSuccess(newAssets.length > 0 ? `${newAssets.length} asset metadata record${newAssets.length === 1 ? '' : 's'} registered.` : 'Selected assets were already registered.');
      onWorkspaceChange?.();

      return nextAssets;
    } catch (assetError) {
      setError(getApiErrorMessage(assetError, 'Unable to register asset metadata.'));
      throw assetError;
    } finally {
      setSaveState('idle');
    }
  };

  const handleSaveClick = async () => {
    await saveDraft().catch(() => undefined);
  };

  const handleRegisterAssetsClick = async () => {
    try {
      const draft = adDraft ?? await saveDraft();
      await registerSelectedAssets(draft);
    } catch {
      // Inline error state is set by save/register helpers.
    }
  };

  const handlePrimaryClick = async () => {
    if (activeStep !== 'prompt-reference') {
      if (next) {
        onStepChange(next.id);
      }
      return;
    }

    setSaveState('queueing');
    setError(null);
    setSuccess(null);

    try {
      const draft = await saveDraft();
      await registerSelectedAssets(draft);
      const job = await createPipelineJob(draft.id, {
        type: 'AD_GENERATION',
        priority: 0,
        provider: 'future-pipeline',
        requestPayload: {
          source: 'create-ad-ui',
          workflow: 'default-product-ad',
          adId: draft.id,
          selectedAssetCount: files.length,
          generationImplemented: false,
        },
        steps: [
          { name: 'shot_generation', sequence: 1, inputPayload: { status: 'pending_implementation' } },
          { name: 'script_generation', sequence: 2, inputPayload: { status: 'pending_implementation' } },
          { name: 'scene_generation', sequence: 3, inputPayload: { status: 'pending_implementation' } },
          { name: 'final_video', sequence: 4, inputPayload: { status: 'pending_implementation' } },
        ],
      });

      setLatestJob(job);
      setSuccess(`Pipeline job queued. Status: ${job.status}. Generation is not implemented in this loop.`);
      onWorkspaceChange?.();
      onStepChange('cinematic-shots');
    } catch (jobError) {
      setError(getApiErrorMessage(jobError, 'Unable to queue the generation job.'));
    } finally {
      setSaveState('idle');
    }
  };

  const stepContent: Record<WorkflowStepId, ReactNode> = {
    'prompt-reference': (
      <PromptReferenceStep
        form={form}
        projects={projects}
        selectedProjectId={selectedProjectId}
        newProjectName={newProjectName}
        files={files}
        registeredAssets={registeredAssets}
        disabled={busy}
        onFormChange={setFormPatch}
        onProjectChange={(projectId) => {
          setSelectedProjectId(projectId);
          setAdDraft(null);
          setRegisteredAssets([]);
          setLatestJob(null);
          setError(null);
          setSuccess(null);
        }}
        onNewProjectNameChange={setNewProjectName}
        onFilesSelected={handleFilesSelected}
      />
    ),
    'cinematic-shots': <ShotStep latestJob={latestJob} />,
    'script-writing': <ScriptStep />,
    'scene-generation': <SceneStep />,
    'final-video': <FinalVideoStep />,
  };

  return (
    <section style={{ padding: '0 32px 36px', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={panelStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          paddingBottom: 18,
          borderBottom: '1px solid #edf1f7',
          marginBottom: 22,
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: current.accent,
              background: current.accent + '12',
              border: `1px solid ${current.accent}30`,
              borderRadius: 999,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 800,
              marginBottom: 10,
            }}>
              STEP {current.num} - Current
            </div>
            <h2 style={{ margin: '0 0 7px', fontSize: 21, lineHeight: 1.2, color: '#0f172a', letterSpacing: '-0.2px' }}>
              {current.title}
            </h2>
            <p style={{ margin: 0, color: '#7b89a0', fontSize: 13, lineHeight: 1.55, maxWidth: 650 }}>
              {projectsLoading
                ? 'Loading your backend projects before saving.'
                : selectedProject
                  ? `Saving into project: ${selectedProject.name}.`
                  : current.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              disabled={!previous || busy}
              onClick={() => previous && onStepChange(previous.id)}
              style={buttonStyle({
                border: '1px solid #e2e8f0',
                background: previous && !busy ? '#ffffff' : '#f8fafc',
                color: previous && !busy ? '#475569' : '#a9b4c5',
                cursor: previous && !busy ? 'pointer' : 'not-allowed',
              })}
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy || projectsLoading}
              onClick={handleSaveClick}
              style={buttonStyle({
                border: '1px solid #dbeafe',
                background: busy || projectsLoading ? '#f8fafc' : '#ffffff',
                color: busy || projectsLoading ? '#a9b4c5' : '#185fa5',
                cursor: busy || projectsLoading ? 'not-allowed' : 'pointer',
              })}
            >
              {saveState === 'saving' ? 'Saving...' : adDraft ? 'Update Draft' : 'Save Draft'}
            </button>
            <button
              type="button"
              disabled={busy || projectsLoading}
              onClick={handleRegisterAssetsClick}
              style={buttonStyle({
                border: '1px solid #fed7c3',
                background: busy || projectsLoading ? '#f8fafc' : '#fff4ef',
                color: busy || projectsLoading ? '#a9b4c5' : '#e8622a',
                cursor: busy || projectsLoading ? 'not-allowed' : 'pointer',
              })}
            >
              {saveState === 'registering-assets' ? 'Registering...' : 'Register Assets'}
            </button>
            <button
              type="button"
              disabled={busy || projectsLoading}
              onClick={handlePrimaryClick}
              style={buttonStyle({
                border: 'none',
                background: busy || projectsLoading ? '#a9b4c5' : current.accent,
                color: '#ffffff',
                cursor: busy || projectsLoading ? 'not-allowed' : 'pointer',
                boxShadow: `0 8px 18px ${current.accent}30`,
              })}
            >
              {ctaLabel}
            </button>
          </div>
        </div>

        {(error || success || latestJob) && (
          <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
            {error && <InlineStatus tone="error">{error}</InlineStatus>}
            {success && <InlineStatus tone="success">{success}</InlineStatus>}
            {latestJob && (
              <InlineStatus tone="info">
                Latest job: {latestJob.status}. This is a backend record only; no real generation runs yet.
              </InlineStatus>
            )}
          </div>
        )}

        {stepContent[activeStep]}
      </div>
    </section>
  );
};

function buildAdPayload(form: DraftForm, activeStep: WorkflowStepId): SaveAdPayload {
  const duration = Number(form.durationSeconds);

  return pruneEmpty({
    title: form.productName ? `${form.productName} Ad Draft` : undefined,
    productName: form.productName,
    brandName: form.brandName,
    category: form.category,
    referenceNotes: form.referenceNotes,
    objective: form.objective,
    platform: form.platform,
    aspectRatio: form.aspectRatio,
    durationSeconds: Number.isInteger(duration) && duration > 0 ? duration : undefined,
    creativeBrief: {
      imageGuidance: form.imageGuidance,
      source: 'create-ad-ui',
    },
    pipelineSpec: {
      currentStep: activeStep,
      generationImplemented: false,
    },
  });
}

function pruneEmpty<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ''),
  ) as T;
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function buttonStyle(overrides: CSSProperties): CSSProperties {
  return {
    borderRadius: 8,
    padding: '10px 15px',
    fontSize: 12.5,
    fontWeight: 800,
    fontFamily: 'inherit',
    ...overrides,
  };
}

export default AdCreationSection;
