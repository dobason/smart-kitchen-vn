/**
 * types/aiRecipe.ts
 *
 * Định nghĩa TypeScript interfaces cho tính năng AI Recipe:
 *
 *  A) Nhận diện nguyên liệu (Detect Ingredients)
 *     — Endpoint: POST /api/v1/recipe/ingredients
 *
 *  B) Sinh công thức nấu ăn (Generate Recipe)
 *     — Endpoint: POST /api/v1/recipe/instruction
 *     — Format mới: { name, ingredients: [{name, amount}], steps }
 */

// ═════════════════════════════════════════════════════════════
// A. Detect Ingredients
// ═════════════════════════════════════════════════════════════

/**
 * Metadata của ảnh đã được upload lên MinIO / object storage.
 * Ánh xạ từ `ImageObject` (schemas/ingredient.py).
 */
export interface AIImageObject {
  /** Tên file ảnh trên server, thường có dạng `<uuid>.jpg` */
  image_name: string;
  /**
   * Presigned URL tạm thời để truy cập ảnh từ MinIO.
   * Dùng để hiển thị preview ảnh đã chụp trong UI.
   */
  presigned_url: string;
  /** Tên bucket MinIO lưu trữ ảnh, ví dụ: `"smart-kitchen"` */
  bucket_name: string;
}

/**
 * Phản hồi đầy đủ từ `POST /api/v1/recipe/ingredients`.
 * Ánh xạ từ `IngredientsResponse` (schemas/ingredient.py).
 */
export interface DetectIngredientsResponse {
  /** Metadata của ảnh đã upload */
  image_obj: AIImageObject;
  /**
   * Danh sách tên nguyên liệu nhận diện được từ ảnh.
   * @example ['thịt gà', 'tỏi', 'hành tây', 'ớt']
   */
  ingredients: string[];
}

// ═════════════════════════════════════════════════════════════
// B. Generate Recipe — Request
// ═════════════════════════════════════════════════════════════

/**
 * Tùy chọn nấu ăn cá nhân hóa gửi kèm khi sinh công thức.
 * Ánh xạ từ `Preference` (schemas/preference.py).
 */
export interface AIRecipePreference {
  dietary_restrictions?: string;
  cuisine_preferences?: string;
  flavor_profiles?: string;
  time_constraints?: string;
  specific_note?: string;
}

/**
 * Payload JSON gửi lên `POST /api/v1/recipe/instruction`.
 */
export interface GenerateRecipeRequest {
  ingredients: string[];
  preference?: AIRecipePreference;
}

// ═════════════════════════════════════════════════════════════
// C. Generate Recipe — Response (Format mới)
// ═════════════════════════════════════════════════════════════

/**
 * Một nguyên liệu trong công thức AI — gồm tên và lượng dùng.
 * Ánh xạ từ `RecipeIngredientItem` (schemas/recipe.py).
 *
 * @example { name: "Thịt gà", amount: "300g" }
 * @example { name: "Nước tương", amount: "2 muỗng canh" }
 */
export interface AIRecipeIngredient {
  /** Tên nguyên liệu */
  name: string;
  /** Lượng dùng, ví dụ: "100g", "2 muỗng", "1/2 củ" */
  amount: string;
}

/**
 * Phản hồi đầy đủ từ `POST /api/v1/recipe/instruction` (format mới).
 * Ánh xạ từ `RecipeResponse` (schemas/recipe.py).
 *
 * @example
 * {
 *   name: "Gà xào tỏi",
 *   ingredients: [
 *     { name: "Ức gà", amount: "300g" },
 *     { name: "Tỏi", amount: "3 tép" }
 *   ],
 *   steps: [
 *     "Bước 1: Sơ chế nguyên liệu...",
 *     "Bước 2: Ướp thịt 15 phút..."
 *   ]
 * }
 */
export interface AIRecipe {
  /**
   * Tên món ăn AI gợi ý.
   * Có thể là `null` nếu AI không xác định được.
   */
  name: string | null;
  /**
   * Tên món ăn AI trả về dưới key dish (nếu có).
   */
  dish?: string | null;
  /**
   * Danh sách nguyên liệu với tên và lượng dùng.
   * AI có thể thêm gia vị ngoài danh sách đầu vào.
   */
  ingredients: AIRecipeIngredient[];
  /**
   * Các bước nấu ăn theo thứ tự từ 1 đến n.
   * Mỗi phần tử là chuỗi mô tả một bước thực hiện.
   */
  steps: string[];
}

// ═════════════════════════════════════════════════════════════
// D. Utility Types
// ═════════════════════════════════════════════════════════════

/**
 * Trạng thái toàn bộ pipeline AI: phát hiện nguyên liệu → sinh công thức.
 */
export interface AIPipelineState {
  imageUri: string | null;
  detectResult: DetectIngredientsResponse | null;
  recipe: AIRecipe | null;
}
