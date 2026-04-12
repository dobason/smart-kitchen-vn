export const INITIAL_COOKBOOKS = [
  { id: 'uncategorized', translationKey: 'cookbookDetail.uncategorized', count: 0, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
  { id: 'desserts', translationKey: 'cookbookDetail.desserts', count: 0, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80' },
  { id: 'dinner', translationKey: 'cookbookDetail.dinner', count: 0, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80' },
];

export let GLOBAL_RECIPES = [
  { id: '1', folderId: 'dinner', name: 'Mì nước cay kiểu Á', description: 'mì sợi, thịt heo...', calories: 550, timeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500' },
  { id: '2', folderId: 'dinner', name: 'Pizza phô mai và rau củ', description: 'bột bánh pizza, phô mai...', calories: 250, timeMinutes: 30, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
  { id: '3', folderId: 'desserts', name: 'Bánh Cupcake dâu tây', description: 'Bột mì, dâu tây, kem tươi...', calories: 350, timeMinutes: 45, imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500' },
  { id: '4', folderId: 'uncategorized', name: 'Salad gà nướng', description: 'Ức gà, xà lách, sốt mè rang...', calories: 220, timeMinutes: 15, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
  { id: '5', folderId: 'uncategorized', name: 'Cá nướng hun khói', description: 'cá nướng, tỏi băm, gia vị...', calories: 300, timeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500' },
  { id: '6', folderId: 'uncategorized', name: 'Sinh tố xoài', description: 'Xoài chín, sữa tươi, đá...', calories: 150, timeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500' },
];

export const updateGlobalRecipes = (newData: any[]) => {
  GLOBAL_RECIPES = newData;
};