export type SearchTagOption = {
  value: string;
  labelKey: string;
};

export type SearchTimeFilterOption = {
  maxMinutes: number;
  labelKey: string;
};

export type SearchCaloriesFilterOption = {
  maxCalories: number;
  labelKey: string;
};

export type SearchCookwareFilterOption = {
  id: string;
  labelKey: string;
  emoji: string;
};

export const SEARCH_TAG_OPTIONS: SearchTagOption[] = [
  { value: 'Low Calorie', labelKey: 'searchResults.options.tags.lowCalorie' },
  { value: 'High Protein', labelKey: 'searchResults.options.tags.highProtein' },
  { value: 'Low Fat', labelKey: 'searchResults.options.tags.lowFat' },
  { value: 'Lunch', labelKey: 'searchResults.options.tags.lunch' },
  { value: 'Dinner', labelKey: 'searchResults.options.tags.dinner' },
  { value: 'Snack', labelKey: 'searchResults.options.tags.snack' },
  { value: 'Breakfast', labelKey: 'searchResults.options.tags.breakfast' },
  { value: 'Soup', labelKey: 'searchResults.options.tags.soup' },
  { value: 'High Fiber', labelKey: 'searchResults.options.tags.highFiber' },
  { value: 'Family Friendly', labelKey: 'searchResults.options.tags.familyFriendly' },
  { value: 'Side Dish', labelKey: 'searchResults.options.tags.sideDish' },
  { value: 'Kid Friendly', labelKey: 'searchResults.options.tags.kidFriendly' },
  { value: 'Lazy Cook', labelKey: 'searchResults.options.tags.lazyCook' },
  { value: 'One Pot', labelKey: 'searchResults.options.tags.onePot' },
  { value: 'Gluten Free', labelKey: 'searchResults.options.tags.glutenFree' },
  { value: 'Keto Friendly', labelKey: 'searchResults.options.tags.ketoFriendly' },
  { value: 'Vegan', labelKey: 'searchResults.options.tags.vegan' },
  { value: 'Vegetarian', labelKey: 'searchResults.options.tags.vegetarian' },
  { value: 'Egg Free', labelKey: 'searchResults.options.tags.eggFree' },
  { value: 'Shellfish Free', labelKey: 'searchResults.options.tags.shellfishFree' },
];

export const SEARCH_TIME_FILTER_OPTIONS: SearchTimeFilterOption[] = [
  { labelKey: 'searchResults.options.time.under5', maxMinutes: 5 },
  { labelKey: 'searchResults.options.time.under10', maxMinutes: 10 },
  { labelKey: 'searchResults.options.time.under20', maxMinutes: 20 },
  { labelKey: 'searchResults.options.time.under30', maxMinutes: 30 },
];

export const SEARCH_CALORIES_FILTER_OPTIONS: SearchCaloriesFilterOption[] = [
  { labelKey: 'searchResults.options.calories.lt200', maxCalories: 200 },
  { labelKey: 'searchResults.options.calories.lt500', maxCalories: 500 },
  { labelKey: 'searchResults.options.calories.lt1000', maxCalories: 1000 },
];

export const SEARCH_COOKWARE_FILTER_OPTIONS: SearchCookwareFilterOption[] = [
  { id: 'frying-pan', labelKey: 'searchResults.options.cookware.fryingPan', emoji: '🍳' },
  { id: 'skillet', labelKey: 'searchResults.options.cookware.skillet', emoji: '🍳' },
  { id: 'microwave', labelKey: 'searchResults.options.cookware.microwave', emoji: '📟' },
  { id: 'air-fryer', labelKey: 'searchResults.options.cookware.airFryer', emoji: '🍟' },
  { id: 'oven', labelKey: 'searchResults.options.cookware.oven', emoji: '♨️' },
  { id: 'blender', labelKey: 'searchResults.options.cookware.blender', emoji: '🥤' },
  { id: 'slow-cooker', labelKey: 'searchResults.options.cookware.slowCooker', emoji: '🍲' },
];
