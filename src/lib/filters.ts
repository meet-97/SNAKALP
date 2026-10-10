import type {
  AITool,
  BriefDraft,
  Creator,
  CreatorFilters,
  CreatorSortKey,
  MatchResult,
  ProjectBrief,
  Skill,
} from '@/types';

export const DEFAULT_FILTERS: CreatorFilters = {
  searchText: '',
  tools: [],
  skills: [],
  specializations: [],
  contentTypes: [],
  experienceLevels: [],
  verifiedOnly: false,
  maxHourlyRate: null,
};

export function filterCreators(
  creators: Creator[],
  filters: CreatorFilters
): Creator[] {
  const query = filters.searchText.trim().toLowerCase();

  return creators.filter((creator) => {
    // searchText: case-insensitive "contains"
    if (query !== '') {
      const haystack = [
        creator.name,
        creator.handle,
        creator.headline,
        creator.bio,
        ...creator.toolsUsed,
        ...creator.skills,
        ...creator.specializations,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    // tools and skills: creator must have ALL selected values (AND)
    if (!filters.tools.every((tool) => creator.toolsUsed.includes(tool))) {
      return false;
    }
    if (!filters.skills.every((skill) => creator.skills.includes(skill))) {
      return false;
    }

    // specializations, contentTypes, experienceLevels: ANY selected value (OR)
    if (
      filters.specializations.length > 0 &&
      !filters.specializations.some((s) => creator.specializations.includes(s))
    ) {
      return false;
    }
    if (
      filters.contentTypes.length > 0 &&
      !filters.contentTypes.some((t) => creator.contentTypes.includes(t))
    ) {
      return false;
    }
    if (
      filters.experienceLevels.length > 0 &&
      !filters.experienceLevels.includes(creator.experienceLevel)
    ) {
      return false;
    }

    // verifiedOnly: keep only creators with workflowVerified === true
    if (filters.verifiedOnly && creator.verification.workflowVerified !== true) {
      return false;
    }

    // maxHourlyRate: null = no limit
    if (
      filters.maxHourlyRate !== null &&
      creator.hourlyRate > filters.maxHourlyRate
    ) {
      return false;
    }

    return true;
  });
}

export function sortCreators(
  creators: Creator[],
  sortBy: CreatorSortKey
): Creator[] {
  const copy = [...creators];

  switch (sortBy) {
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'rate-low':
      return copy.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case 'rate-high':
      return copy.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case 'projects':
      return copy.sort((a, b) => b.completedProjects - a.completedProjects);
    default:
      return copy;
  }
}

export function matchCreatorToBrief(
  creator: Creator,
  brief: ProjectBrief | BriefDraft
): MatchResult {
  const requiredTools: AITool[] = brief.requiredTools;
  const requiredSkills: Skill[] = brief.requiredSkills;

  const matchedTools = requiredTools.filter((tool) =>
    creator.toolsUsed.includes(tool)
  );
  const missingTools = requiredTools.filter(
    (tool) => !creator.toolsUsed.includes(tool)
  );
  const matchedSkills = requiredSkills.filter((skill) =>
    creator.skills.includes(skill)
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !creator.skills.includes(skill)
  );

  const toolScore =
    requiredTools.length > 0 ? matchedTools.length / requiredTools.length : 1;
  const skillScore =
    requiredSkills.length > 0
      ? matchedSkills.length / requiredSkills.length
      : 1;
  const typeScore = creator.contentTypes.includes(brief.deliverableType) ? 1 : 0;
  const verifyScore =
    Object.values(creator.verification).filter((value) => value === true)
      .length / 3;

  const score = Math.round(
    100 *
      (0.5 * toolScore + 0.3 * skillScore + 0.1 * typeScore + 0.1 * verifyScore)
  );

  const licenseConflict =
    brief.commercialUse.required &&
    creator.featuredWork.some(
      (item) =>
        item.mediaType === brief.deliverableType &&
        item.commercialLicensed === false
    );

  return {
    creatorId: creator.id,
    score,
    matchedTools,
    missingTools,
    matchedSkills,
    missingSkills,
    licenseConflict,
  };
}

export function rankCreatorsForBrief(
  creators: Creator[],
  brief: ProjectBrief | BriefDraft
): MatchResult[] {
  return creators
    .map((creator) => matchCreatorToBrief(creator, brief))
    .sort((a, b) => b.score - a.score);
}