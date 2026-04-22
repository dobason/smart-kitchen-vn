import axios from 'axios';
import { Platform } from 'react-native';

const AI_API_BASE_URL =
	process.env.EXPO_PUBLIC_AI_API_URL?.trim() || 'https://smart-kitchen-ai.onrender.com';

export type AIRequestLanguage = 'en' | 'vi';

export interface IngredientDetectionResponse {
	image_obj?: {
		image_name?: string;
		presigned_url?: string;
		bucket_name?: string;
	};
	ingredients: string[];
}

export interface RecipePreferencePayload {
	dietary_restrictions?: string | null;
	cuisine_preferences?: string | null;
	flavor_profiles?: string | null;
	time_constraints?: string | null;
	specific_note?: string | null;
}

export interface RecipeInstructionResponse {
	ingredients: string[];
	dish: string | null;
	steps: string[];
	time: string | null;
}

interface DetectIngredientsParams {
	imageUri: string;
	mimeType?: string;
	language?: AIRequestLanguage;
}

interface GenerateInstructionParams {
	ingredients: string[];
	preference?: RecipePreferencePayload | null;
	language?: AIRequestLanguage;
}

function normalizeLanguage(language?: string): AIRequestLanguage {
	return String(language || '').toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

export function getAiRecipeErrorMessage(error: unknown) {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		const responseData = error.response?.data;
		const responseText =
			typeof responseData === 'string'
				? responseData
				: responseData
					? JSON.stringify(responseData)
					: '';

		return [
			status ? `HTTP ${status}` : null,
			error.message || null,
			responseText || null,
		].filter(Boolean).join(' - ');
	}

	if (error instanceof Error) {
		return error.message;
	}

	return String(error ?? 'Unknown error');
}

async function appendImageToFormData(
	formData: FormData,
	imageUri: string,
	fileName: string,
	mimeType?: string
) {
	if (Platform.OS === 'web') {
		const response = await fetch(imageUri);
		if (!response.ok) {
			throw new Error(`Failed to read image data (${response.status})`);
		}

		const blob = await response.blob();
		formData.append('file', blob, fileName);
		return;
	}

	formData.append('file', {
		uri: imageUri,
		name: fileName,
		type: mimeType || 'image/jpeg',
	} as any);
}

export async function detectIngredientsFromImage({
	imageUri,
	mimeType,
	language,
}: DetectIngredientsParams): Promise<IngredientDetectionResponse> {
	const formData = new FormData();
	await appendImageToFormData(formData, imageUri, 'ingredients.jpg', mimeType);

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 30000);

	try {
		const response = await fetch(`${AI_API_BASE_URL}/api/v1/recipe/ingredients`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Accept-Language': normalizeLanguage(language),
			},
			body: formData,
			signal: controller.signal,
		});

		const responseText = await response.text();
		let responseData: IngredientDetectionResponse | null = null;

		if (responseText) {
			try {
				responseData = JSON.parse(responseText) as IngredientDetectionResponse;
			} catch {
				throw new Error(`Invalid ingredient response: ${responseText}`);
			}
		}

		if (!response.ok) {
			throw new Error(
				`Ingredient API failed${response.status ? ` (HTTP ${response.status})` : ''}${responseText ? `: ${responseText}` : ''}`
			);
		}

		return {
			ingredients: Array.isArray(responseData?.ingredients) ? responseData.ingredients : [],
			image_obj: responseData?.image_obj,
		};
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function generateRecipeFromInstruction({
	ingredients,
	preference,
	language,
}: GenerateInstructionParams): Promise<RecipeInstructionResponse> {
	const sanitizedIngredients = ingredients
		.map((item) => String(item || '').trim())
		.filter((item) => item.length > 0);

	const response = await axios.post<RecipeInstructionResponse>(
		`${AI_API_BASE_URL}/api/v1/recipe/instruction`,
		{
			ingredients: sanitizedIngredients,
			preference: preference ?? null,
		},
		{
			headers: {
				Accept: 'application/json',
				'Accept-Language': normalizeLanguage(language),
			},
			timeout: 30000,
		}
	);

	return {
		ingredients: Array.isArray(response.data?.ingredients) ? response.data.ingredients : [],
		dish: response.data?.dish ?? null,
		steps: Array.isArray(response.data?.steps) ? response.data.steps : [],
		time: response.data?.time ?? null,
	};
}
