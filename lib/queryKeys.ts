export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
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
};
