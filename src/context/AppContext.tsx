'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode, ReactElement } from 'react';
import type { AppContextValue, BriefDraft, BriefStatus, ProjectBrief } from '@/types';
import { mockBriefs } from '@/data/mockBriefs';

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }): ReactElement {
  const [briefs, setBriefs] = useState<ProjectBrief[]>(mockBriefs);
  const addBrief = useCallback((draft: BriefDraft): ProjectBrief => {
    const brief: ProjectBrief = { ...draft, id: 'brief-' + Date.now(), status: 'open', shortlistedCreatorIds: [], createdAt: new Date().toISOString() };
    setBriefs(previous => [brief, ...previous]);
    return brief;
  }, []);
  const shortlistCreator = useCallback((briefId: string, creatorId: string) => {
    setBriefs(previous => previous.map(brief => brief.id === briefId ? {
      ...brief,
      shortlistedCreatorIds: brief.shortlistedCreatorIds.includes(creatorId) ? brief.shortlistedCreatorIds : [...brief.shortlistedCreatorIds, creatorId],
      status: brief.status === 'open' ? 'shortlisted' : brief.status,
    } : brief));
  }, []);
  const assignCreator = useCallback((briefId: string, creatorId: string) => {
    setBriefs(previous => previous.map(brief => brief.id === briefId ? {
      ...brief, assignedCreatorId: creatorId, status: 'in_progress',
      shortlistedCreatorIds: brief.shortlistedCreatorIds.includes(creatorId) ? brief.shortlistedCreatorIds : [...brief.shortlistedCreatorIds, creatorId],
    } : brief));
  }, []);
  const setBriefStatus = useCallback((briefId: string, status: BriefStatus) => {
    setBriefs(previous => previous.map(brief => brief.id === briefId ? { ...brief, status } : brief));
  }, []);
  const value = useMemo(() => ({ briefs, addBrief, shortlistCreator, assignCreator, setBriefStatus }), [briefs, addBrief, shortlistCreator, assignCreator, setBriefStatus]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used inside <AppProvider>.');
  return context;
}
