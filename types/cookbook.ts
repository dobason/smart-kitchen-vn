export type CookbookDetail = {
  id: string;
  name: string;
  userId: string;
};

export type CreateCookbookRequest = {
  name: string;
  userId: string;
};

export type UpdateCookbookRequest = {
  name: string;
};