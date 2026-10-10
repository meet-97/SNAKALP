import type {
  AITool,
  AspectRatio,
  BriefDraft,
  MediaType,
  Skill,
  StyleTag,
  UsageChannel,
} from '@/types';

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}s?\\b`).test(text));
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function makeTitle(idea: string): string {
  const firstSentence = idea.split(/[.!?\n]/)[0].trim();
  const base = firstSentence === '' ? idea.trim() : firstSentence;
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
  return capitalized.length > 60
    ? capitalized.slice(0, 57).trimEnd() + '...'
    : capitalized;
}

export function buildFallbackDraft(idea: string): BriefDraft {
  const text = idea.trim().toLowerCase();

  const isSocial = hasAny(text, ['reel', 'instagram', 'short', 'tiktok']);
  const isWide = hasAny(text, ['youtube', 'website', 'banner']);
  const isMusic = hasAny(text, ['music', 'song', 'jingle']);
  const isVoice = hasAny(text, ['voice', 'narration']);
  const isVideo = hasAny(text, ['reel', 'short', 'tiktok', 'video']);
  const isProduct = hasAny(text, ['product']);
  const isCharacter = hasAny(text, ['character']);

  // Content type: audio first, then video, otherwise image (default)
  let deliverableType: MediaType = 'image';
  if (isMusic || isVoice) {
    deliverableType = 'audio';
  } else if (isVideo) {
    deliverableType = 'video';
  }

  // Format: social formats win, then wide formats, otherwise 1:1 (default)
  let aspectRatio: AspectRatio = '1:1';
  if (isSocial) {
    aspectRatio = '9:16';
  } else if (isWide) {
    aspectRatio = '16:9';
  }

  // Usage channels
  const channels: UsageChannel[] = [];
  if (isSocial) channels.push('Social Media');
  if (isWide) channels.push('Website');
  if (channels.length === 0) channels.push('Social Media');

  // Tools
  const requiredTools: AITool[] = [];
  if (isMusic) requiredTools.push('Suno');
  if (isVoice) requiredTools.push('ElevenLabs');
  if (requiredTools.length === 0) {
    requiredTools.push(
      deliverableType === 'video' ? 'Runway Gen-3' : 'Midjourney'
    );
  }

  // Skills
  const requiredSkills: Skill[] = [];
  if (isVoice) requiredSkills.push('Voice Cloning');
  if (isProduct) requiredSkills.push('Product Photography');
  if (isCharacter) requiredSkills.push('Character Consistency');
  if (isMusic) requiredSkills.push('Music Composition');
  if (requiredSkills.length === 0) requiredSkills.push('Prompt Engineering');

  // Style tags
  const styleTags: StyleTag[] = isProduct
    ? ['Photorealistic', 'Minimal']
    : ['Photorealistic'];

  return {
    brandName: 'Your Brand',
    title: makeTitle(idea),
    description: idea.trim(),
    deliverableType,
    styleTags: unique(styleTags),
    aspectRatio,
    requiredTools: unique(requiredTools),
    requiredSkills: unique(requiredSkills),
    budgetMin: 200,
    budgetMax: 800,
    deadlineDays: 7,
    commercialUse: {
      required: true,
      channels: unique(channels),
      durationMonths: 6,
      territory: 'India',
      exclusive: false,
    },
  };
}