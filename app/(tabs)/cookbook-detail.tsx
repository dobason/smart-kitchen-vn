import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { RecipeCard } from '@/components/in-app-ui/recipe-card';
import { AddRecipeModal } from '@/components/ui/add-recipe-modal';
import { CookbookDetailHeader } from '@/components/ui/cookbook-detail-header';
import { ManageActionBar } from '@/components/ui/manage-action-bar';
import { useLocale } from '@/hooks/use-locale';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';
import { Icon } from '@/components/ui/icon';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronRight, Plus, Settings, X } from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import {
  useCookbooks,
  useAddRecipeToCookbook,
  useCookbookRecipes,
  useRemoveRecipeFromCookbook,
} from '@/hooks/use-cookbook';

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
    cookbooks,
    getCookbookById,
    getRecipesByCookbook,
    assignRecipesToCookbook,
    removeRecipesFromCookbook,
  } = useSavedRecipes();

  const cookbookId = singleParam(params.id) ?? uncategorizedCookbookId;
  const passedName = singleParam(params.name) ?? '';
  const cookbook = getCookbookById(cookbookId);
  const isDefaultCookbook = cookbookId === uncategorizedCookbookId;
  const localRecipes = getRecipesByCookbook(cookbookId);
  const { data: serverRecipes = [] } = useCookbookRecipes(isDefaultCookbook ? '' : cookbookId);
  const recipes = isDefaultCookbook ? localRecipes : serverRecipes;
  const [isAddRecipeVisible, setIsAddRecipeVisible] = React.useState(false);
  const [isManageMode, setIsManageMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isMoveSheetVisible, setIsMoveSheetVisible] = React.useState(false);
  const [selectedDestinationIds, setSelectedDestinationIds] = React.useState<string[]>([]);

  const cookbookName = React.useMemo(() => {
    if (cookbook?.translationKey) {
      return String(t(cookbook.translationKey));
    }
    if (cookbook?.name) {
      return cookbook.name;
    }
    return passedName || String(t('cookbook.COOKBOOK'));
  }, [cookbook?.name, cookbook?.translationKey, passedName, t]);

  const { userId } = useAuth();
  const { data: apiCookbooks = [] } = useCookbooks(userId || '');
  const addRecipeToCookbook = useAddRecipeToCookbook();
  const removeRecipeFromCookbook = useRemoveRecipeFromCookbook();

  const destinationCookbooks = React.useMemo(
    () =>
      apiCookbooks
        .map((dbBook: any) => ({
          id: dbBook.id.toString(),
          name: dbBook.name,
        }))
        .filter((item: { id: string }) => item.id !== cookbookId),
    [apiCookbooks, cookbookId]
  );
  const recipeIdsKey = React.useMemo(() => recipes.map((recipe) => recipe.id).join('|'), [recipes]);

  const selectedRecipeCount = selectedIds.length;
  const isAllSelected = recipes.length > 0 && selectedIds.length === recipes.length;

  React.useEffect(() => {
    const recipeIdSet = new Set(recipes.map((recipe) => recipe.id));
    setSelectedIds((prev) => {
      const next = prev.filter((recipeId) => recipeIdSet.has(recipeId));
      const unchanged =
        next.length === prev.length && next.every((id, index) => id === prev[index]);

      return unchanged ? prev : next;
    });
  }, [recipeIdsKey]);

  function handleBack() {
    if (router.canGoBack()) {
      router.push('/(tabs)/recipe');
      return;
    }
    router.replace('/(tabs)/recipe');
  }

  function closeManageMode() {
    setIsManageMode(false);
    setSelectedIds([]);
    setIsMoveSheetVisible(false);
    setSelectedDestinationIds([]);
  }

  function toggleRecipeSelection(recipeId: string) {
    setSelectedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  }

  function handleSelectAll() {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(recipes.map((recipe) => recipe.id));
  }

  async function handleManageAction() {
    if (selectedRecipeCount === 0) return;

    if (isDefaultCookbook) {
      setSelectedDestinationIds([]);
      setIsMoveSheetVisible(true);
      return;
    }

    const calls = selectedIds.map((recipeId) =>
      removeRecipeFromCookbook
        .mutateAsync({
          cookbookId: Number(cookbookId),
          recipeId: Number(recipeId),
        })
        .catch((err) => console.log('DELETE error:', err.response?.data))
    );

    await Promise.all(calls);
    closeManageMode();
  }

  function toggleDestinationSelection(cookbookDestinationId: string) {
    setSelectedDestinationIds((prev) =>
      prev.includes(cookbookDestinationId)
        ? prev.filter((id) => id !== cookbookDestinationId)
        : [...prev, cookbookDestinationId]
    );
  }

  async function handleConfirmMove() {
    if (selectedDestinationIds.length === 0 || selectedIds.length === 0) {
      return;
    }

    const calls: Promise<void>[] = [];
    selectedDestinationIds.forEach((destinationId) => {
      selectedIds.forEach((recipeId) => {
        calls.push(
          addRecipeToCookbook
            .mutateAsync({
              cookbookId: Number(destinationId),
              recipeId: Number(recipeId),
            })
            .catch((err) => {
              console.log('POST error response:', err.response?.data); // ← add this
              console.log('POST error status:', err.response?.status);
            })
        );
      });
    });

    await Promise.all(calls);
    closeManageMode();
  }

  function handleRecipePress(recipe: (typeof recipes)[number]) {
    if (isManageMode) {
      toggleRecipeSelection(recipe.id);
      return;
    }

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
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <CookbookDetailHeader
        isManageMode={isManageMode}
        cookbookName={cookbookName}
        totalRecipes={recipes.length}
        onBack={handleBack}
        onCloseManage={closeManageMode}
        onEditPress={() => {}}
        canEdit={!isDefaultCookbook}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName={isManageMode ? 'pb-36 pt-3' : 'pb-28 pt-3'}>
        {!isManageMode ? (
          <Pressable
            onPress={() => setIsManageMode(true)}
            className="mx-4 mb-4 flex-row items-center justify-between rounded-[18px] border border-[#E8E8ED] bg-[#F6F6F8] px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-[#E2E2E6]">
                <Icon as={Settings} size={17} className="text-[#6D6D73]" />
              </View>
              <VietnamText className="text-[18px] font-semibold text-[#1C1C1E]">
                {t('cookbookDetail.manageCookbook')}
              </VietnamText>
            </View>
            <Icon as={ChevronRight} size={22} className="text-[#8E8E93]" />
          </Pressable>
        ) : null}
        {recipes.length === 0 ? (
          <View className="items-center px-8 py-16">
            <VietnamText className="text-center text-xl font-bold text-gray-900">
              {t('recipe.noSavedRecipesTitle')}
            </VietnamText>
            <VietnamText className="mt-2 text-center text-base text-gray-500">
              {t('recipe.noSavedRecipesDescription')}
            </VietnamText>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between px-4">
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={{ width: '48.5%', marginBottom: 16 }}
                onPress={() => handleRecipePress(recipe)}
                className="relative">
                <View pointerEvents="none">
                  <RecipeCard
                    item={recipe}
                    isSaved={true}
                    onToggleSave={() => {}}
                    showSaveButton={false}
                  />
                </View>

                {isManageMode ? (
                  <View
                    className={`absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full border-2 ${
                      selectedIds.includes(recipe.id)
                        ? 'border-[#CE232A] bg-[#CE232A]'
                        : 'border-[#D1D5DB] bg-white/90'
                    }`}>
                    {selectedIds.includes(recipe.id) ? (
                      <Icon as={Check} size={16} className="text-white" />
                    ) : null}
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {!isManageMode && !isDefaultCookbook ? (
        <Pressable
          onPress={() => setIsAddRecipeVisible(true)}
          className="absolute bottom-8 right-6 z-10 h-16 w-16 items-center justify-center rounded-full bg-[#CE232A] shadow-lg shadow-red-600/40">
          <Icon as={Plus} size={32} className="text-white" />
        </Pressable>
      ) : null}

      {isManageMode && recipes.length > 0 ? (
        <ManageActionBar
          isAllSelected={isAllSelected}
          selectedCount={selectedRecipeCount}
          onSelectAll={handleSelectAll}
          onActionPress={handleManageAction}
          actionLabel={
            isDefaultCookbook
              ? String(t('cookbookDetail.moveTo'))
              : String(t('cookbookDetail.remove'))
          }
        />
      ) : null}

      <AddRecipeModal
        visible={isAddRecipeVisible}
        onClose={() => setIsAddRecipeVisible(false)}
        targetCookbookId={cookbookId}
      />

      <Modal
        visible={isMoveSheetVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsMoveSheetVisible(false)}>
        <View className="flex-1 justify-end bg-black/45">
          <Pressable className="flex-1" onPress={() => setIsMoveSheetVisible(false)} />

          <View className="rounded-t-[30px] bg-white px-6 pb-10 pt-3">
            <View className="mb-3 h-1.5 w-16 self-center rounded-full bg-[#D2D2D7]" />

            <View className="mb-5 flex-row items-center justify-between">
              <VietnamText className="text-4xl font-black text-[#111114]">
                {t('cookbookDetail.moveTo')}
              </VietnamText>
              <Pressable
                onPress={() => setIsMoveSheetVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#ECECEF]">
                <Icon as={X} size={22} className="text-[#6E6E76]" />
              </Pressable>
            </View>

            {destinationCookbooks.length === 0 ? (
              <View className="items-center gap-2 py-8">
                <VietnamText className="text-center text-lg font-semibold text-[#6E6E76]">
                  {t('cookbookDetail.noCookbooksAvailable')}
                </VietnamText>
                <VietnamText className="text-center text-sm text-[#A7A7AC]">
                  {t('cookbookDetail.createCookbookFirst')}
                </VietnamText>
              </View>
            ) : (
              <View className="gap-3">
                {destinationCookbooks.map((destination) => {
                  const isSelected = selectedDestinationIds.includes(destination.id);
                  const displayName = destination.name;

                  return (
                    <Pressable
                      key={destination.id}
                      onPress={() => toggleDestinationSelection(destination.id)}
                      className={`flex-row items-center justify-between rounded-2xl px-4 py-4 ${
                        isSelected ? 'bg-[#FBECEE]' : 'bg-[#F3F3F6]'
                      }`}>
                      <VietnamText className="text-2xl font-semibold text-[#1C1C1E]">
                        {displayName}
                      </VietnamText>

                      <View
                        className={`h-9 w-9 items-center justify-center rounded-md border-2 ${
                          isSelected
                            ? 'border-[#CE232A] bg-[#CE232A]'
                            : 'border-[#A7A7AC] bg-transparent'
                        }`}>
                        {isSelected ? <Icon as={Check} size={20} className="text-white" /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <Pressable
              onPress={
                destinationCookbooks.length === 0
                  ? () => setIsMoveSheetVisible(false)
                  : handleConfirmMove
              }
              disabled={destinationCookbooks.length > 0 && selectedDestinationIds.length === 0}
              className={`mt-8 items-center rounded-full py-4 ${
                destinationCookbooks.length === 0
                  ? 'bg-[#CE232A]'
                  : selectedDestinationIds.length > 0
                    ? 'bg-[#CE232A]'
                    : 'bg-[#E3A4A8]'
              }`}>
              <VietnamText className="text-2xl font-bold text-white">
                {destinationCookbooks.length === 0
                  ? t('cookbookDetail.close')
                  : t('cookbookDetail.move')}
              </VietnamText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
