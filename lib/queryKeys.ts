export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
    list: (userId: string, search?: string) =>
      ['recipes', 'list', userId, search ?? ''] as const,
    detail: (id: string) => ['recipes', id] as const,
  },
  ingredient: {
    all: ['ingredients'] as const,
    // Add more specific keys here if needed (e.g., by category)
  },
  tag: {
    all: ['tags'] as const,
    list: () => ['tags', 'list'] as const,
  },
};
