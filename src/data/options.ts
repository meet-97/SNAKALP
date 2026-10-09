import type { AITool, MediaType, Skill, Specialization, StyleTag, AspectRatio, UsageChannel, Territory, ExperienceLevel, BriefStatus, LicenseType } from '@/types';

export const ALL_TOOLS: AITool[] = ['Midjourney', 'Stable Diffusion', 'ComfyUI', 'Runway Gen-3', 'Pika Labs', 'ElevenLabs', 'Suno', 'AnimateDiff', 'Claude 3.5', 'ChatGPT', 'Flux.1', 'ControlNet'];
export const ALL_MEDIA_TYPES: MediaType[] = ['image', 'video', 'animation', 'audio', 'prompt-pack'];
export const ALL_SKILLS: Skill[] = ['Character Consistency', 'Product Photography', 'Motion Design', 'Lip Sync', 'Voice Cloning', 'Music Composition', 'Storyboarding', 'Prompt Engineering', 'Upscaling & Retouching', 'Brand Styling'];
export const ALL_SPECIALIZATIONS: Specialization[] = ['Product Ads', 'Fashion & Lifestyle', 'Character Design', 'Animation & Motion', 'Music & Voice', 'Social Media Content', 'Film & Storytelling'];
export const ALL_STYLE_TAGS: StyleTag[] = ['Photorealistic', 'Cinematic', 'Anime', '3D Render', 'Minimal', 'Surreal', 'Illustrated', 'Retro'];
export const ALL_ASPECT_RATIOS: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9', '21:9'];
export const ALL_USAGE_CHANNELS: UsageChannel[] = ['Social Media', 'Website', 'TV / OTT', 'Print', 'Out-of-Home', 'Internal Use'];
export const ALL_TERRITORIES: Territory[] = ['India', 'Asia', 'Global'];
export const ALL_EXPERIENCE_LEVELS: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Pro', 'Studio'];
export const BRIEF_STATUS_ORDER: BriefStatus[] = ['open', 'shortlisted', 'in_progress', 'revision', 'delivered'];
export const BRIEF_STATUS_LABELS: Record<BriefStatus, string> = { open: 'Open', shortlisted: 'Shortlisted', in_progress: 'In Progress', revision: 'Revision', delivered: 'Delivered' };
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = { image: 'Image', video: 'Video', animation: 'Animation', audio: 'Audio', 'prompt-pack': 'Prompt Pack' };
export const LICENSE_TYPE_LABELS: Record<LicenseType, string> = { 'commercial-safe': 'Commercial-safe model', 'own-trained': 'Own-trained model', 'open-source': 'Open-source model', 'non-commercial': 'Non-commercial model' };
