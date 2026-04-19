export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
    detail: (id: string) => ['recipes', id] as const,
  },
  step: {
    all: ['steps'] as const,
    byRecipe: (recipeId: string | number) => ['steps', 'recipe', String(recipeId)] as const,
    detail: (id: string | number) => ['steps', String(id)] as const,
  },
};
