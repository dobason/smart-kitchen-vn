import { SearchRecipeItem } from "@/types/recipe";

export const SEARCH_RECIPES: SearchRecipeItem[] = [
  {
    id: 'pho-bo',
    name: 'Súp phở',
    description: '600ml nước,100g bánh phở...',
    calories: 300,
    timeMinutes: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1000&q=80',
    tags: ['pho', 'bo', 'nuoc dung'],
    cookware: ['slow-cooker', 'skillet'],
  },
  {
    id: 'bo-mong-co',
    name: 'Thịt bò Mông Cổ và Hành lá',
    description: '2 thìa cà phê dầu thực vật...',
    calories: 391,
    timeMinutes: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    tags: ['bo', 'hanh la', 'xao'],
    cookware: ['frying-pan', 'skillet'],
  },
  {
    id: 'banh-xa-lach-cuon',
    name: 'Bánh xá lách cuộn kiểu Á nhanh',
    description: '4 cốc nước,2 cốc gạo trắng...',
    calories: 245,
    timeMinutes: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    tags: ['xa lach', 'salad', 'nhanh'],
    cookware: ['frying-pan'],
  },
  {
    id: 'salad-ga-kieu-a',
    name: 'Salad Gà Kiểu Á',
    description: '1/4 cốc dầu thực vật,3 muỗng...',
    calories: 180,
    timeMinutes: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1000&q=80',
    tags: ['salad', 'ga', 'healthy'],
    cookware: ['blender'],
  },
  {
    id: 'bun-thit-nuong',
    name: 'Bún thịt nướng',
    description: 'Bún tươi, thịt heo ướp sả...',
    calories: 620,
    timeMinutes: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80',
    tags: ['bun', 'nuong', 'heo'],
    cookware: ['air-fryer', 'oven'],
  },
];
