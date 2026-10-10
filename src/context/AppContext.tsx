'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { mockBriefs } from '@/data/mockBriefs';
import type {
  AppContextValue,
  BriefDraft,
  BriefStatus,
  ProjectBrief,
} from '@/types';

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [briefs, setBriefs] = useState<ProjectBrief[]>(mockBriefs);

  const addBrief = useCallback((draft: BriefDraft): ProjectBrief => {
    const newBrief: ProjectBrief = {
      ...draft,
      id: 'brief-' + Date.now(),
      status: 'open',
      shortlistedCreatorIds: [],
      createdAt: new Date().toISOString(),
    };
    setBriefs((prev) => [newBrief, ...prev]);
    return newBrief;
  }, []);

  const shortlistCreator = useCallback(
    (briefId: string, creatorId: string): void => {
      setBriefs((prev) =>
        prev.map((brief) => {
          if (brief.id !== briefId) return brief;
          const alreadyShortlisted =
            brief.shortlistedCreatorIds.includes(creatorId);
          const shortlistedCreatorIds = alreadyShortlisted
            ? brief.shortlistedCreatorIds
            : [...brief.shortlistedCreatorIds, creatorId];
          const status: BriefStatus =
            brief.status === 'open' ? 'shortlisted' : brief.status;
          return { ...brief, shortlistedCreatorIds, status };
        })
      );
    },
    []
  );

  const assignCreator = useCallback(
    (briefId: string, creatorId: string): void => {
      setBriefs((prev) =>
        prev.map((brief) => {
          if (brief.id !== briefId) return brief;
          const shortlistedCreatorIds = brief.shortlistedCreatorIds.includes(
            creatorId
          )
            ? brief.shortlistedCreatorIds
            : [...brief.shortlistedCreatorIds, creatorId];
          return {
            ...brief,
            assignedCreatorId: creatorId,
            shortlistedCreatorIds,
            status: 'in_progress',
          };
        })
      );
    },
    []
  );

  const setBriefStatus = useCallback(
    (briefId: string, status: BriefStatus): void => {
      setBriefs((prev) =>
        prev.map((brief) =>
          brief.id === briefId ? { ...brief, status } : brief
        )
      );
    },
    []
  );

  const value = useMemo<AppContextValue>(
    () => ({
      briefs,
      addBrief,
      shortlistCreator,
      assignCreator,
      setBriefStatus,
    }),
    [briefs, addBrief, shortlistCreator, assignCreator, setBriefStatus]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error(
      'useAppState must be used inside <AppProvider>. Wrap your app in <AppProvider> in src/app/layout.tsx.'
    );
  }
  return context;
}