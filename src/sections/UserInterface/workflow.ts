export type WorkflowStepId =
  | 'prompt-reference'
  | 'cinematic-shots'
  | 'script-writing'
  | 'scene-generation'
  | 'final-video';

export type WorkflowStep = {
  id: WorkflowStepId;
  num: string;
  title: string;
  summary: string;
  accent: string;
};

export type WorkflowTransition = {
  from: WorkflowStepId;
  to: WorkflowStepId;
} | null;

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'prompt-reference',
    num: '01',
    title: 'Prompt + Reference Image',
    summary: 'Add product visuals and the core product details.',
    accent: '#e8622a',
  },
  {
    id: 'cinematic-shots',
    num: '02',
    title: 'Cinematic Shot Images',
    summary: 'Create the strongest visual shots for the ad.',
    accent: '#2563eb',
  },
  {
    id: 'script-writing',
    num: '03',
    title: 'Script Writing',
    summary: 'Shape hooks, voiceover lines, and captions.',
    accent: '#7c3aed',
  },
  {
    id: 'scene-generation',
    num: '04',
    title: 'Scene Generation',
    summary: 'Turn scripts and shots into ordered scenes.',
    accent: '#059669',
  },
  {
    id: 'final-video',
    num: '05',
    title: 'Final Video',
    summary: 'Preview, refine, and export the finished ad.',
    accent: '#0f172a',
  },
];
