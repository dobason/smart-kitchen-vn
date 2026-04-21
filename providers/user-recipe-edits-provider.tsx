import {
  UserRecipeDraft,
  UserRecipeEditsContext,
  UserRecipeEditsContextValue,
} from '@/context/user-recipe-edits-context';
import { useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

type DraftMapByRecipeId = Record<string, UserRecipeDraft>;
type DraftMapByUserId = Record<string, DraftMapByRecipeId>;
const USER_RECIPE_DRAFTS_STORAGE_KEY = 'user-recipe-drafts.v1';

export const UserRecipeEditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [draftsByUser, setDraftsByUser] = React.useState<DraftMapByUserId>({});
  const [isStorageHydrated, setIsStorageHydrated] = React.useState(false);
  const activeUserKey = userId ?? 'guest';

  React.useEffect(() => {
    let isCancelled = false;

    const hydrateFromStorage = async () => {
      try {
        const rawValue = await SecureStore.getItemAsync(USER_RECIPE_DRAFTS_STORAGE_KEY);

        if (!rawValue || isCancelled) {
          return;
        }

        const parsed = JSON.parse(rawValue) as DraftMapByUserId;

        if (parsed && typeof parsed === 'object') {
          setDraftsByUser(parsed);
        }
      } catch (error) {
        console.error('Failed to hydrate user recipe drafts:', error);
      } finally {
        if (!isCancelled) {
          setIsStorageHydrated(true);
        }
      }
    };

    hydrateFromStorage();

    return () => {
      isCancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!isStorageHydrated) {
      return;
    }

    SecureStore.setItemAsync(USER_RECIPE_DRAFTS_STORAGE_KEY, JSON.stringify(draftsByUser)).catch(
      (error) => {
        console.error('Failed to persist user recipe drafts:', error);
      }
    );
  }, [draftsByUser, isStorageHydrated]);

  const activeUserDrafts = React.useMemo(
    () => draftsByUser[activeUserKey] ?? {},
    [activeUserKey, draftsByUser]
  );

  const getRecipeDraft = React.useCallback(
    (recipeId: string) => activeUserDrafts[String(recipeId)],
    [activeUserDrafts]
  );

  const upsertRecipeDraft = React.useCallback(
    (draft: Omit<UserRecipeDraft, 'updatedAt'>) => {
      const normalizedRecipeId = String(draft.recipeId);

      setDraftsByUser((prev) => {
        const currentUserDrafts = prev[activeUserKey] ?? {};

        return {
          ...prev,
          [activeUserKey]: {
            ...currentUserDrafts,
            [normalizedRecipeId]: {
              ...draft,
              recipeId: normalizedRecipeId,
              updatedAt: Date.now(),
            },
          },
        };
      });
    },
    [activeUserKey]
  );

  const removeRecipeDraft = React.useCallback(
    (recipeId: string) => {
      const normalizedRecipeId = String(recipeId);

      setDraftsByUser((prev) => {
        const currentUserDrafts = prev[activeUserKey];

        if (!currentUserDrafts || !currentUserDrafts[normalizedRecipeId]) {
          return prev;
        }

        const nextUserDrafts = { ...currentUserDrafts };
        delete nextUserDrafts[normalizedRecipeId];

        if (Object.keys(nextUserDrafts).length === 0) {
          const next = { ...prev };
          delete next[activeUserKey];
          return next;
        }

        return {
          ...prev,
          [activeUserKey]: nextUserDrafts,
        };
      });
    },
    [activeUserKey]
  );

  const getRecipeDraftMap = React.useCallback(() => activeUserDrafts, [activeUserDrafts]);

  const value = React.useMemo<UserRecipeEditsContextValue>(
    () => ({
      getRecipeDraft,
      upsertRecipeDraft,
      removeRecipeDraft,
      getRecipeDraftMap,
    }),
    [getRecipeDraft, getRecipeDraftMap, removeRecipeDraft, upsertRecipeDraft]
  );

  return <UserRecipeEditsContext.Provider value={value}>{children}</UserRecipeEditsContext.Provider>;
};
