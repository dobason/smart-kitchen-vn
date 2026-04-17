export const queryKeys = {
  recipe: {
    all: ['recipes'] as const,
    detail: (id: string) => ['recipes', id] as const,
  },
};
