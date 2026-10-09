import type { Creator, CreatorFilters, CreatorSortKey, ProjectBrief, BriefDraft, MatchResult } from '@/types';

export const DEFAULT_FILTERS: CreatorFilters = {
  searchText: '', tools: [], skills: [], specializations: [], contentTypes: [],
  experienceLevels: [], verifiedOnly: false, maxHourlyRate: null,
};

export function filterCreators(creators: Creator[], filters: CreatorFilters): Creator[] {
  const search = filters.searchText.toLowerCase();
  return creators.filter(creator =>
    (!search || [creator.name, creator.handle, creator.headline, creator.bio, ...creator.toolsUsed, ...creator.skills, ...creator.specializations].some(value => value.toLowerCase().includes(search))) &&
    filters.tools.every(tool => creator.toolsUsed.includes(tool)) &&
    filters.skills.every(skill => creator.skills.includes(skill)) &&
    (!filters.specializations.length || filters.specializations.some(value => creator.specializations.includes(value))) &&
    (!filters.contentTypes.length || filters.contentTypes.some(value => creator.contentTypes.includes(value))) &&
    (!filters.experienceLevels.length || filters.experienceLevels.includes(creator.experienceLevel)) &&
    (!filters.verifiedOnly || creator.verification.workflowVerified) &&
    (filters.maxHourlyRate === null || creator.hourlyRate <= filters.maxHourlyRate)
  );
}

export function sortCreators(creators: Creator[], sortBy: CreatorSortKey): Creator[] {
  return [...creators].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'rate-low': return a.hourlyRate - b.hourlyRate;
      case 'rate-high': return b.hourlyRate - a.hourlyRate;
      case 'projects': return b.completedProjects - a.completedProjects;
    }
  });
}

export function matchCreatorToBrief(creator: Creator, brief: ProjectBrief | BriefDraft): MatchResult {
  const matchedTools = brief.requiredTools.filter(tool => creator.toolsUsed.includes(tool));
  const missingTools = brief.requiredTools.filter(tool => !creator.toolsUsed.includes(tool));
  const matchedSkills = brief.requiredSkills.filter(skill => creator.skills.includes(skill));
  const missingSkills = brief.requiredSkills.filter(skill => !creator.skills.includes(skill));
  const toolScore = brief.requiredTools.length ? matchedTools.length / brief.requiredTools.length : 1;
  const skillScore = brief.requiredSkills.length ? matchedSkills.length / brief.requiredSkills.length : 1;
  const typeScore = creator.contentTypes.includes(brief.deliverableType) ? 1 : 0;
  const verifyScore = Object.values(creator.verification).filter(Boolean).length / 3;
  return {
    creatorId: creator.id,
    score: Math.round(100 * (0.5 * toolScore + 0.3 * skillScore + 0.1 * typeScore + 0.1 * verifyScore)),
    matchedTools, missingTools, matchedSkills, missingSkills,
    licenseConflict: brief.commercialUse.required && creator.featuredWork.some(item => item.mediaType === brief.deliverableType && !item.commercialLicensed),
  };
}

export function rankCreatorsForBrief(creators: Creator[], brief: ProjectBrief | BriefDraft): MatchResult[] {
  return creators.map(creator => matchCreatorToBrief(creator, brief)).sort((a, b) => b.score - a.score);
}
