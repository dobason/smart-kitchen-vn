export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
    list: (userId: string, search?: string) =>
      ['recipes', 'list', userId, search ?? ''] as const,
    detail: (id: string) => ['recipes', id] as const,
  },
  cookbook: {
    all: ['cookbooks'] as const,
    detail: (id: string) => ['cookbooks','list', id] as const,
  },
  ingredient: {
    all: ['ingredients'] as const,
    detail: (id?: string) => ['ingredients','list', id || 'all_items'] as const,
  },
  tag: {
    all: ['tags'] as const,
    list: () => ['tags', 'list'] as const,
  },
  step: {
    all: ['steps'] as const,
    byRecipe: (recipeId: string | number) => ['steps', 'recipe', String(recipeId)] as const,
    detail: (id: string | number) => ['steps', String(id)] as const,
  },
  recipeIngredient: {
    all: ['recipe-ingredients'] as const,
    byRecipe: (recipeId: string | number) =>
      ['recipe-ingredients', 'recipe', String(recipeId)] as const,
    detail: (recipeId: string | number, ingredientId: string | number) =>
      ['recipe-ingredients', 'recipe', String(recipeId), 'ingredient', String(ingredientId)] as const,
  },
};
