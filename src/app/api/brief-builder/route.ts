import { NextResponse } from 'next/server';
import {
  ALL_ASPECT_RATIOS,
  ALL_MEDIA_TYPES,
  ALL_SKILLS,
  ALL_STYLE_TAGS,
  ALL_TERRITORIES,
  ALL_TOOLS,
  ALL_USAGE_CHANNELS,
} from '@/data/options';
import { buildFallbackDraft } from '@/lib/briefBuilderFallback';
import type { BriefBuilderResponse, BriefDraft } from '@/types';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-5-5';
const REQUEST_TIMEOUT_MS = 20000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickOne<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | undefined {
  if (typeof value !== 'string') return undefined;
  return allowed.find((option) => option === value);
}

function pickMany<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const picked: T[] = [];
  for (const entry of value) {
    const match = pickOne(entry, allowed);
    if (match !== undefined && !picked.includes(match)) {
      picked.push(match);
    }
  }
  return picked;
}

function pickText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }
  return fallback;
}

function pickPositiveNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  return fallback;
}

// Keep only allowed values; fill every missing or invalid field from the fallback.
function cleanDraft(raw: unknown, fallback: BriefDraft): BriefDraft {
  if (!isRecord(raw)) return fallback;

  const rawCommercial = isRecord(raw.commercialUse) ? raw.commercialUse : {};

  let budgetMin = pickPositiveNumber(raw.budgetMin, fallback.budgetMin);
  let budgetMax = pickPositiveNumber(raw.budgetMax, fallback.budgetMax);
  if (budgetMax < budgetMin) {
    budgetMin = fallback.budgetMin;
    budgetMax = fallback.budgetMax;
  }

  const styleTags = pickMany(raw.styleTags, ALL_STYLE_TAGS);
  const channels = pickMany(rawCommercial.channels, ALL_USAGE_CHANNELS);
  const requiredTools = pickMany(raw.requiredTools, ALL_TOOLS);
  const requiredSkills = pickMany(raw.requiredSkills, ALL_SKILLS);

  return {
    brandName: pickText(raw.brandName, fallback.brandName),
    title: pickText(raw.title, fallback.title),
    description: pickText(raw.description, fallback.description),
    deliverableType:
      pickOne(raw.deliverableType, ALL_MEDIA_TYPES) ?? fallback.deliverableType,
    styleTags:
      styleTags !== undefined && styleTags.length > 0
        ? styleTags
        : fallback.styleTags,
    aspectRatio:
      pickOne(raw.aspectRatio, ALL_ASPECT_RATIOS) ?? fallback.aspectRatio,
    requiredTools: requiredTools ?? fallback.requiredTools,
    requiredSkills: requiredSkills ?? fallback.requiredSkills,
    budgetMin,
    budgetMax,
    deadlineDays: pickPositiveNumber(raw.deadlineDays, fallback.deadlineDays),
    commercialUse: {
      required:
        typeof rawCommercial.required === 'boolean'
          ? rawCommercial.required
          : fallback.commercialUse.required,
      channels:
        channels !== undefined && channels.length > 0
          ? channels
          : fallback.commercialUse.channels,
      durationMonths: pickPositiveNumber(
        rawCommercial.durationMonths,
        fallback.commercialUse.durationMonths
      ),
      territory:
        pickOne(rawCommercial.territory, ALL_TERRITORIES) ??
        fallback.commercialUse.territory,
      exclusive:
        typeof rawCommercial.exclusive === 'boolean'
          ? rawCommercial.exclusive
          : fallback.commercialUse.exclusive,
    },
  };
}

function buildSystemPrompt(): string {
  return [
    'You turn a short project idea into a structured creative brief for an AI creator marketplace.',
    'Reply with ONE JSON object only. No explanation, no markdown, no code fences.',
    'Use exactly this shape:',
    '{"brandName": string, "title": string, "description": string, "deliverableType": string, "styleTags": string[], "aspectRatio": string, "requiredTools": string[], "requiredSkills": string[], "budgetMin": number, "budgetMax": number, "deadlineDays": number, "commercialUse": {"required": boolean, "channels": string[], "durationMonths": number, "territory": string, "exclusive": boolean}}',
    'Use ONLY these allowed values:',
    `deliverableType: ${JSON.stringify(ALL_MEDIA_TYPES)}`,
    `styleTags: ${JSON.stringify(ALL_STYLE_TAGS)}`,
    `aspectRatio: ${JSON.stringify(ALL_ASPECT_RATIOS)}`,
    `requiredTools: ${JSON.stringify(ALL_TOOLS)}`,
    `requiredSkills: ${JSON.stringify(ALL_SKILLS)}`,
    `commercialUse.channels: ${JSON.stringify(ALL_USAGE_CHANNELS)}`,
    `commercialUse.territory: ${JSON.stringify(ALL_TERRITORIES)}`,
    'Budget values are plain numbers in dollars. deadlineDays and durationMonths are whole numbers.',
    'If the brand name is not mentioned, use "Your Brand".',
  ].join('\n');
}

function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    const parsed: unknown = JSON.parse(text.slice(start, end + 1));
    return parsed;
  } catch {
    return null;
  }
}

// Returns a cleaned draft from the AI, or null for ANY problem (no key, network, bad JSON).
async function requestAiDraft(
  idea: string,
  fallback: BriefDraft
): Promise<BriefDraft | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: [{ role: 'user', content: idea.slice(0, 2000) }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.content)) return null;

    const text = data.content
      .map((block: unknown) =>
        isRecord(block) && block.type === 'text' && typeof block.text === 'string'
          ? block.text
          : ''
      )
      .join('');

    const parsed = extractJson(text);
    if (parsed === null) return null;

    return cleanDraft(parsed, fallback);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let idea = '';
  try {
    const body: unknown = await request.json();
    if (isRecord(body) && typeof body.idea === 'string') {
      idea = body.idea.trim();
    }
  } catch {
    idea = '';
  }

  if (idea === '') {
    return NextResponse.json({ error: 'idea is required' }, { status: 400 });
  }

  const fallback = buildFallbackDraft(idea);
  const aiDraft = await requestAiDraft(idea, fallback);

  if (aiDraft !== null) {
    const aiResult: BriefBuilderResponse = { draft: aiDraft, source: 'ai' };
    return NextResponse.json(aiResult);
  }

  const fallbackResult: BriefBuilderResponse = {
    draft: fallback,
    source: 'fallback',
  };
  return NextResponse.json(fallbackResult);
}