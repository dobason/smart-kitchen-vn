import {
  SavedRecipesContext,
  type CookbookItem,
  type SavedRecipesContextValue,
} from '@/context/saved-recipes-context';
import type { SearchRecipeItem } from '@/types/recipe';
import * as React from 'react';

const UNCATEGORIZED_COOKBOOK_ID = 'uncategorized';

const DEFAULT_COOKBOOK_IMAGE =
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80';

const DEFAULT_COOKBOOKS: CookbookItem[] = [
  {
    id: UNCATEGORIZED_COOKBOOK_ID,
    name: 'Uncategorized',
    image: DEFAULT_COOKBOOK_IMAGE,
    isDefault: true,
    translationKey: 'cookbookDetail.uncategorized',
  },
];

function normalizeCookbookIds(value: string[] | string | undefined): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
}

export const SavedRecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = React.useState<SearchRecipeItem[]>([]);
  const [cookbooks, setCookbooks] = React.useState<CookbookItem[]>(DEFAULT_COOKBOOKS);
  const [recipeCookbookMap, setRecipeCookbookMap] = React.useState<Record<string, string[]>>({});

  const saveRecipe = React.useCallback((recipe: SearchRecipeItem) => {
    setSavedRecipes((prev) => {
      if (prev.some((item) => item.id === recipe.id)) {
        return prev;
      }
      return [recipe, ...prev];
    });
  }, []);

  const clearRecipeAssignment = React.useCallback((recipeId: string) => {
    setRecipeCookbookMap((prev) => {
      if (!(recipeId in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[recipeId];
      return next;
    });
  }, []);

  const removeSavedRecipe = React.useCallback((recipeId: string) => {
    setSavedRecipes((prev) => prev.filter((item) => item.id !== recipeId));
    clearRecipeAssignment(recipeId);
  }, [clearRecipeAssignment]);

  const toggleSavedRecipe = React.useCallback((recipe: SearchRecipeItem) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      if (exists) {
        clearRecipeAssignment(recipe.id);
        return prev.filter((item) => item.id !== recipe.id);
      }
      return [recipe, ...prev];
    });
  }, [clearRecipeAssignment]);

  const savedRecipeIds = React.useMemo(
    () => new Set(savedRecipes.map((item) => item.id)),
    [savedRecipes]
  );

  const isSaved = React.useCallback(
    (recipeId: string) => savedRecipeIds.has(recipeId),
    [savedRecipeIds]
  );

  const getSavedRecipeById = React.useCallback(
    (recipeId: string) => savedRecipes.find((item) => item.id === recipeId),
    [savedRecipes]
  );

  const getCookbookById = React.useCallback(
    (cookbookId: string) => cookbooks.find((cookbook) => cookbook.id === cookbookId),
    [cookbooks]
  );

  const getRecipeCookbookIds = React.useCallback(
    (recipeId: string) => {
      const mappedIds = normalizeCookbookIds(recipeCookbookMap[recipeId]);
      const validSecondaryIds = Array.from(
        new Set(
          mappedIds.filter(
            (mappedId) =>
              mappedId !== UNCATEGORIZED_COOKBOOK_ID &&
              cookbooks.some((cookbook) => cookbook.id === mappedId)
          )
        )
      );

      return [UNCATEGORIZED_COOKBOOK_ID, ...validSecondaryIds];
    },
    [cookbooks, recipeCookbookMap]
  );

  const getRecipeCookbooks = React.useCallback(
    (recipeId: string) => {
      return getRecipeCookbookIds(recipeId)
        .map((cookbookId) => getCookbookById(cookbookId))
        .filter((cookbook): cookbook is CookbookItem => Boolean(cookbook));
    },
    [getCookbookById, getRecipeCookbookIds]
  );

  const getRecipesByCookbook = React.useCallback(
    (cookbookId: string) => {
      if (cookbookId === UNCATEGORIZED_COOKBOOK_ID) {
        return savedRecipes;
      }

      return savedRecipes.filter((recipe) =>
        normalizeCookbookIds(recipeCookbookMap[recipe.id]).includes(cookbookId)
      );
    },
    [recipeCookbookMap, savedRecipes]
  );

  const getCookbookCount = React.useCallback(
    (cookbookId: string) => {
      if (cookbookId === UNCATEGORIZED_COOKBOOK_ID) {
        return savedRecipes.length;
      }

      return savedRecipes.reduce((count, recipe) => {
        return normalizeCookbookIds(recipeCookbookMap[recipe.id]).includes(cookbookId)
          ? count + 1
          : count;
      }, 0);
    },
    [recipeCookbookMap, savedRecipes]
  );

  const createCookbook = React.useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return null;
    }

    const newCookbook: CookbookItem = {
      id: `cookbook-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
      image:
        'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
      isDefault: false,
    };

    setCookbooks((prev) => [...prev, newCookbook]);
    return newCookbook;
  }, []);

  const renameCookbook = React.useCallback((cookbookId: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName || cookbookId === UNCATEGORIZED_COOKBOOK_ID) {
      return;
    }

    setCookbooks((prev) =>
      prev.map((cookbook) =>
        cookbook.id === cookbookId
          ? {
              ...cookbook,
              name: trimmedName,
              translationKey: undefined,
            }
          : cookbook
      )
    );
  }, []);

  const deleteCookbook = React.useCallback((cookbookId: string) => {
    if (cookbookId === UNCATEGORIZED_COOKBOOK_ID) {
      return;
    }

    setCookbooks((prev) => prev.filter((cookbook) => cookbook.id !== cookbookId));
    setRecipeCookbookMap((prev) => {
      const next: Record<string, string[]> = {};

      Object.entries(prev).forEach(([recipeId, mappedCookbookIds]) => {
        const filteredIds = Array.from(
          new Set(
            normalizeCookbookIds(mappedCookbookIds).filter(
              (mappedId) =>
                mappedId !== cookbookId && mappedId !== UNCATEGORIZED_COOKBOOK_ID
            )
          )
        );

        if (filteredIds.length > 0) {
          next[recipeId] = filteredIds;
        }
      });

      return next;
    });
  }, []);

  const assignRecipesToCookbook = React.useCallback(
    (recipeIds: string[], targetCookbookId: string) => {
      if (recipeIds.length === 0) {
        return;
      }

      const targetExists = cookbooks.some((cookbook) => cookbook.id === targetCookbookId);
      if (!targetExists) {
        return;
      }

      if (targetCookbookId === UNCATEGORIZED_COOKBOOK_ID) {
        return;
      }

      setRecipeCookbookMap((prev) => {
        const next = { ...prev };

        recipeIds.forEach((recipeId) => {
          if (!savedRecipeIds.has(recipeId)) {
            return;
          }

          const currentIds = normalizeCookbookIds(next[recipeId]).filter(
            (mappedId) => mappedId !== UNCATEGORIZED_COOKBOOK_ID
          );
          const uniqueIds = new Set(currentIds);
          uniqueIds.add(targetCookbookId);
          next[recipeId] = Array.from(uniqueIds);
        });

        return next;
      });
    },
    [cookbooks, savedRecipeIds]
  );

  const value = React.useMemo<SavedRecipesContextValue>(
    () => ({
      uncategorizedCookbookId: UNCATEGORIZED_COOKBOOK_ID,
      cookbooks,
      savedRecipes,
      savedRecipeIds,
      isSaved,
      saveRecipe,
      removeSavedRecipe,
      toggleSavedRecipe,
      getSavedRecipeById,
      getCookbookById,
      getCookbookCount,
      getRecipesByCookbook,
      getRecipeCookbookIds,
      getRecipeCookbooks,
      createCookbook,
      renameCookbook,
      deleteCookbook,
      assignRecipesToCookbook,
    }),
    [
      cookbooks,
      savedRecipes,
      savedRecipeIds,
      isSaved,
      saveRecipe,
      removeSavedRecipe,
      toggleSavedRecipe,
      getSavedRecipeById,
      getCookbookById,
      getCookbookCount,
      getRecipesByCookbook,
      getRecipeCookbookIds,
      getRecipeCookbooks,
      createCookbook,
      renameCookbook,
      deleteCookbook,
      assignRecipesToCookbook,
    ]
  );

  return <SavedRecipesContext.Provider value={value}>{children}</SavedRecipesContext.Provider>;
};
