export type AITool =
  | 'Midjourney'
  | 'Stable Diffusion'
  | 'ComfyUI'
  | 'Runway Gen-3'
  | 'Pika Labs'
  | 'ElevenLabs'
  | 'Suno'
  | 'AnimateDiff'
  | 'Claude 3.5'
  | 'ChatGPT'
  | 'Flux.1'
  | 'ControlNet';

export type MediaType = 'image' | 'video' | 'animation' | 'audio' | 'prompt-pack';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Pro' | 'Studio';

export type Skill =
  | 'Character Consistency'
  | 'Product Photography'
  | 'Motion Design'
  | 'Lip Sync'
  | 'Voice Cloning'
  | 'Music Composition'
  | 'Storyboarding'
  | 'Prompt Engineering'
  | 'Upscaling & Retouching'
  | 'Brand Styling';

export type Specialization =
  | 'Product Ads'
  | 'Fashion & Lifestyle'
  | 'Character Design'
  | 'Animation & Motion'
  | 'Music & Voice'
  | 'Social Media Content'
  | 'Film & Storytelling';

export type StyleTag =
  | 'Photorealistic'
  | 'Cinematic'
  | 'Anime'
  | '3D Render'
  | 'Minimal'
  | 'Surreal'
  | 'Illustrated'
  | 'Retro';

export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9' | '21:9';

export type UsageChannel =
  | 'Social Media'
  | 'Website'
  | 'TV / OTT'
  | 'Print'
  | 'Out-of-Home'
  | 'Internal Use';

export type Territory = 'India' | 'Asia' | 'Global';

// Which kind of model/data the work was made with (drives the licence badge)
export type LicenseType = 'commercial-safe' | 'own-trained' | 'open-source' | 'non-commercial';

// Engagement steps, in this exact order:
// open -> shortlisted -> in_progress -> revision -> delivered
export type BriefStatus = 'open' | 'shortlisted' | 'in_progress' | 'revision' | 'delivered';

export type CreatorSortKey = 'rating' | 'rate-low' | 'rate-high' | 'projects';

// ---------- Portfolio & Creator ----------

export interface WorkflowMetadata {
  modelCheckpoint: string;
  seed: number;
  sampler?: string;
  steps?: number;
  cfgScale?: number;
  loras?: string[];
  controlNets?: string[];
  promptSnippet: string;
  negativePromptSnippet?: string;
  revisionReady: boolean; // true = creator can re-create it with small changes
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaType: MediaType;
  mediaUrl: string; // for video/audio/animation this is a poster/cover image URL
  aspectRatio: AspectRatio;
  toolsUsed: AITool[];
  workflow: WorkflowMetadata;
  commercialLicensed: boolean; // must be false when licenseType is 'non-commercial'
  licenseType: LicenseType;
}

export interface VerificationSignals {
  toolsVerified: boolean;
  workflowVerified: boolean;
  pastWorkVerified: boolean;
}

export interface Creator {
  id: string; // 'creator-1' ... 'creator-8'
  name: string;
  handle: string; // e.g. '@pixel.nomad'
  avatarUrl: string; // may be '' -> UI shows initials
  headline: string;
  bio: string;
  experienceLevel: ExperienceLevel;
  toolsUsed: AITool[];
  skills: Skill[];
  specializations: Specialization[];
  contentTypes: MediaType[];
  hourlyRate: number;
  turnaroundDays: number;
  rating: number; // 0 - 5
  completedProjects: number;
  verification: VerificationSignals;
  featuredWork: PortfolioItem[];
}

// ---------- Brief ----------

export interface CommercialUse {
  required: boolean;
  channels: UsageChannel[];
  durationMonths: number;
  territory: Territory;
  exclusive: boolean;
}

export interface ProjectBrief {
  id: string;
  brandName: string;
  title: string;
  description: string;
  deliverableType: MediaType; // the "content type"
  styleTags: StyleTag[];
  aspectRatio: AspectRatio; // the "format"
  requiredTools: AITool[];
  requiredSkills: Skill[];
  budgetMin: number;
  budgetMax: number;
  deadlineDays: number;
  commercialUse: CommercialUse;
  status: BriefStatus;
  shortlistedCreatorIds: string[];
  assignedCreatorId?: string;
  createdAt: string; // ISO date string
}

// What the Brief form / AI brief builder produces (before the system adds id, status, etc.)
export type BriefDraft = Omit<
  ProjectBrief,
  'id' | 'status' | 'shortlistedCreatorIds' | 'assignedCreatorId' | 'createdAt'
>;

export interface BriefBuilderResponse {
  draft: BriefDraft;
  source: 'ai' | 'fallback';
}

// ---------- Search, matching, app state ----------

export interface CreatorFilters {
  searchText: string;
  tools: AITool[];
  skills: Skill[];
  specializations: Specialization[];
  contentTypes: MediaType[];
  experienceLevels: ExperienceLevel[];
  verifiedOnly: boolean;
  maxHourlyRate: number | null; // null = no limit
}

export interface MatchResult {
  creatorId: string;
  score: number; // 0 - 100
  matchedTools: AITool[];
  missingTools: AITool[];
  matchedSkills: Skill[];
  missingSkills: Skill[];
  licenseConflict: boolean; // true = brief needs commercial use but creator has non-commercial work of that type
}

export interface AppContextValue {
  briefs: ProjectBrief[];
  addBrief: (draft: BriefDraft) => ProjectBrief;
  shortlistCreator: (briefId: string, creatorId: string) => void;
  assignCreator: (briefId: string, creatorId: string) => void;
  setBriefStatus: (briefId: string, status: BriefStatus) => void;
}