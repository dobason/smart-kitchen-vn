export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
    list: (userId: string, search?: string) =>
      ['recipes', 'list', userId, search ?? ''] as const,
    detail: (id: string) => ['recipes', id] as const,
  },
};
