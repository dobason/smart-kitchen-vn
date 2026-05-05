
import aiAxiosClient from './aiAxiosClient';
import type {
  DetectIngredientsResponse,
  GenerateRecipeRequest,
  AIRecipe,
} from '@/types/aiRecipe';

/** Ngôn ngữ phản hồi được AI Server hỗ trợ */
export type AILanguage = 'en' | 'vi';

// ─────────────────────────────────────────────────────────────
// 1. Nhận diện nguyên liệu từ ảnh
// ─────────────────────────────────────────────────────────────

export async function detectIngredients(
  imageUri: string,
  language: AILanguage = 'vi'
): Promise<DetectIngredientsResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  } as unknown as Blob); 

  const { data } = await aiAxiosClient.post<DetectIngredientsResponse>(
    '/recipe/ingredients',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept-Language': language,
      },
    }
  );

  return data;
}

// ─────────────────────────────────────────────────────────────
// 2. Sinh công thức nấu ăn từ danh sách nguyên liệu
// ─────────────────────────────────────────────────────────────

export async function generateRecipe(
  payload: GenerateRecipeRequest,
  language: AILanguage = 'vi'
): Promise<AIRecipe> {
  const { data } = await aiAxiosClient.post<AIRecipe>(
    '/recipe/instruction',
    payload, // Gửi JSON: { ingredients: [...], preference?: {...} }
    {
      headers: {
        'Accept-Language': language,
      },
    }
  );

  if (data.dish && !data.name) {
    data.name = data.dish;
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// Default export — object API để dễ mock trong unit test
// ─────────────────────────────────────────────────────────────

const aiRecipeApi = {
  detectIngredients,
  generateRecipe,
};

export default aiRecipeApi;
