import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { AddRecipeModal } from '@/components/ui/add-recipe-modal';
import { CookbookDetailHeader } from '@/components/ui/cookbook-detail-header';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { Icon } from '@/components/ui/icon';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CookbookDetailParams = {
  id?: string | string[];
  name?: string | string[];
};

function singleParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default function CookbookDetailScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useLocalSearchParams<CookbookDetailParams>();
  const {
    uncategorizedCookbookId,
    getCookbookById,
    getRecipesByCookbook,
    savedRecipeIds,
    toggleSavedRecipe,
  } = useSavedRecipes();

  const cookbookId = singleParam(params.id) ?? uncategorizedCookbookId;
  const passedName = singleParam(params.name) ?? '';
  const cookbook = getCookbookById(cookbookId);
  const recipes = getRecipesByCookbook(cookbookId);
  const [isAddRecipeVisible, setIsAddRecipeVisible] = React.useState(false);

  const cookbookName = React.useMemo(() => {
    if (cookbook?.translationKey) {
      return String(t(cookbook.translationKey));
    }
    if (cookbook?.name) {
      return cookbook.name;
    }
    return passedName || String(t('cookbook.COOKBOOK'));
  }, [cookbook?.name, cookbook?.translationKey, passedName, t]);

  const isDefaultCookbook = cookbookId === uncategorizedCookbookId;

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/recipe');
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <CookbookDetailHeader
        isManageMode={false}
        cookbookName={cookbookName}
        totalRecipes={recipes.length}
        onBack={handleBack}
        onCloseManage={() => {}}
        onEditPress={() => {}}
        canEdit={false}
      />

      <ScrollView className="flex-1" contentContainerClassName="pb-32 pt-3">
        {recipes.length === 0 ? (
          <View className="items-center px-8 py-16">
            <VietnamText className="text-xl font-bold text-gray-900 text-center">
              {t('recipe.noSavedRecipesTitle')}
            </VietnamText>
            <VietnamText className="mt-2 text-center text-base text-gray-500">
              {t('recipe.noSavedRecipesDescription')}
            </VietnamText>
          </View>
        ) : (
          <View className="px-4 flex-row flex-wrap justify-between">
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={{ width: '48.5%', marginBottom: 16 }}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/recipe-detail',
                    params: {
                      recipeId: recipe.id,
                      recipeName: recipe.name,
                      recipeDescription: recipe.description,
                      recipeCalories: String(recipe.calories),
                      recipeTimeMinutes: String(recipe.timeMinutes),
                      recipeImageUrl: recipe.imageUrl,
                    },
                  })
                }>
                <RecipeCard
                  item={recipe}
                  isSaved={savedRecipeIds.has(recipe.id)}
                  onToggleSave={(id) => {
                    if (id === recipe.id) {
                      toggleSavedRecipe(recipe);
                    }
                  }}
                />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {!isDefaultCookbook ? (
        <Pressable
          onPress={() => setIsAddRecipeVisible(true)}
          className="absolute bottom-8 right-6 bg-[#CE232A] w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-600/40 z-10">
          <Icon as={Plus} size={32} className="text-white" />
        </Pressable>
      ) : null}

      <AddRecipeModal
        visible={isAddRecipeVisible}
        onClose={() => setIsAddRecipeVisible(false)}
        targetCookbookId={cookbookId}
      />
    </SafeAreaView>
  );
}
