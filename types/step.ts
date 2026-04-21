export type StepItem = {
  id?: string;
  number?: number;
  text: string;
  tip?: string;
  time?: number;
  recipeId?: number;
  isLast?: boolean;
};

export type StepApiItem = {
  id?: string | number;
  recipeId: number;
  stepNumber: number;
  instruction: string;
  time?: number;
  tip?: string;
};

export type CreateStepRequest = {
  recipeId: number;
  stepNumber: number;
  instruction: string;
  time?: number;
  tip?: string;
};

export type UpdateStepRequest = {
  recipeId: number;
  stepNumber: number;
  instruction: string;
  time?: number;
  tip?: string;
};
