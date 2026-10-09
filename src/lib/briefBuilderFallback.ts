import type { BriefDraft, AITool, Skill } from '@/types';

export function buildFallbackDraft(idea: string): BriefDraft {
  const text = idea.toLowerCase();
  const social = /\b(reels?|instagram|shorts|tiktok)\b/.test(text);
  const landscape = /\b(youtube|website|banner)\b/.test(text);
  const music = /\b(music|songs?|jingles?)\b/.test(text);
  const voice = /\b(voice|narration)\b/.test(text);
  const product = /\bproducts?\b/.test(text);
  const character = /\bcharacters?\b/.test(text);
  const video = social || /\b(videos?|films?)\b/.test(text);
  const animation = /\b(animation|animated)\b/.test(text);
  const requiredTools: AITool[] = [];
  const requiredSkills: Skill[] = [];
  if (music) { requiredTools.push('Suno'); requiredSkills.push('Music Composition'); }
  if (voice) { requiredTools.push('ElevenLabs'); requiredSkills.push('Voice Cloning'); }
  if (product) requiredSkills.push('Product Photography');
  if (character) requiredSkills.push('Character Consistency');

  return {
    brandName: 'Your Brand',
    title: idea.trim().slice(0, 80) || 'New creative project',
    description: idea.trim() || 'Create an original visual for your brand.',
    deliverableType: music || voice ? 'audio' : animation ? 'animation' : video ? 'video' : 'image',
    styleTags: product ? ['Photorealistic', 'Minimal'] : [],
    aspectRatio: social ? '9:16' : landscape ? '16:9' : '1:1',
    requiredTools,
    requiredSkills,
    budgetMin: 200,
    budgetMax: 800,
    deadlineDays: 7,
    commercialUse: {
      required: true,
      channels: social ? ['Social Media'] : /\bwebsite\b/.test(text) ? ['Website'] : [],
      durationMonths: 12,
      territory: 'India',
      exclusive: false,
    },
  };
}
