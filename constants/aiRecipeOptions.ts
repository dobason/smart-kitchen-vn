export type AIOption = {
  id: string;
  labelKey: string;
  emoji: string;
};

export const COOKWARE_OPTIONS: AIOption[] = [
  { id: 'frying-pan', labelKey: 'aiRecipe.options.cookware.fryingPan', emoji: '🍳' },
  { id: 'skillet', labelKey: 'aiRecipe.options.cookware.skillet', emoji: '🍳' },
  { id: 'microwave', labelKey: 'aiRecipe.options.cookware.microwave', emoji: '📟' },
  { id: 'air-fryer', labelKey: 'aiRecipe.options.cookware.airFryer', emoji: '🍟' },
  { id: 'oven', labelKey: 'aiRecipe.options.cookware.oven', emoji: '♨️' },
  { id: 'blender', labelKey: 'aiRecipe.options.cookware.blender', emoji: '🥤' },
  { id: 'slow-cooker', labelKey: 'aiRecipe.options.cookware.slowCooker', emoji: '🍲' },
];

export const DISH_TYPE_OPTIONS: AIOption[] = [
  { id: 'breakfast', labelKey: 'aiRecipe.options.dishType.breakfast', emoji: '🥐' },
  { id: 'lunch', labelKey: 'aiRecipe.options.dishType.lunch', emoji: '🥪' },
  { id: 'dinner', labelKey: 'aiRecipe.options.dishType.dinner', emoji: '🍜' },
  { id: 'snack', labelKey: 'aiRecipe.options.dishType.snack', emoji: '🍿' },
  { id: 'dessert', labelKey: 'aiRecipe.options.dishType.dessert', emoji: '🍰' },
  { id: 'drink', labelKey: 'aiRecipe.options.dishType.drink', emoji: '🍹' },
];

export const DIET_OPTIONS: AIOption[] = [
  { id: 'vegan', labelKey: 'aiRecipe.options.diet.vegan', emoji: '🥕' },
  { id: 'vegetarian', labelKey: 'aiRecipe.options.diet.vegetarian', emoji: '🥗' },
  { id: 'keto', labelKey: 'aiRecipe.options.diet.ketoFriendly', emoji: '🥑' },
  { id: 'low-carb', labelKey: 'aiRecipe.options.diet.lowCarb', emoji: '🥬' },
  { id: 'low-calorie', labelKey: 'aiRecipe.options.diet.lowCalorie', emoji: '🥒' },
  { id: 'low-fat', labelKey: 'aiRecipe.options.diet.lowFat', emoji: '🚫' },
  { id: 'high-protein', labelKey: 'aiRecipe.options.diet.highProtein', emoji: '💪' },
  { id: 'high-fiber', labelKey: 'aiRecipe.options.diet.highFiber', emoji: '🌾' },
  { id: 'pet-food', labelKey: 'aiRecipe.options.diet.petFood', emoji: '🐾' },
];

export const CUISINE_OPTIONS: AIOption[] = [
  { id: 'american', labelKey: 'aiRecipe.options.cuisine.american', emoji: '🍔' },
  { id: 'mexican', labelKey: 'aiRecipe.options.cuisine.mexican', emoji: '🌮' },
  { id: 'chinese', labelKey: 'aiRecipe.options.cuisine.chinese', emoji: '🥟' },
  { id: 'italian', labelKey: 'aiRecipe.options.cuisine.italian', emoji: '🍕' },
  { id: 'japanese', labelKey: 'aiRecipe.options.cuisine.japanese', emoji: '🍱' },
  { id: 'korean', labelKey: 'aiRecipe.options.cuisine.korean', emoji: '🍲' },
  { id: 'spicy', labelKey: 'aiRecipe.options.cuisine.spicy', emoji: '🌶️' },
  { id: 'sweet', labelKey: 'aiRecipe.options.cuisine.sweet', emoji: '🍯' },
  { id: 'savory', labelKey: 'aiRecipe.options.cuisine.savory', emoji: '🧂' },
];

export const ALLERGEN_FREE_OPTIONS: AIOption[] = [
  { id: 'nut-free', labelKey: 'aiRecipe.options.allergenFree.nutFree', emoji: '🥜' },
  { id: 'egg-free', labelKey: 'aiRecipe.options.allergenFree.eggFree', emoji: '🥚' },
  { id: 'soy-free', labelKey: 'aiRecipe.options.allergenFree.soyFree', emoji: '🫛' },
  {
    id: 'shellfish-free',
    labelKey: 'aiRecipe.options.allergenFree.shellfishFree',
    emoji: '🦐',
  },
];

export const TIME_OPTIONS: AIOption[] = [
  { id: '15', labelKey: 'aiRecipe.options.time.lt15', emoji: '⏱️' },
  { id: '30', labelKey: 'aiRecipe.options.time.lt30', emoji: '⏱️' },
  { id: '60', labelKey: 'aiRecipe.options.time.lt60', emoji: '⏱️' },
];