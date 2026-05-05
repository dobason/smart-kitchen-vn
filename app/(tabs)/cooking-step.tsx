import * as React from 'react';
import { View, ScrollView, Modal, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  XIcon,
  BookOpenCheckIcon,
  ChevronRightIcon,
  CornerUpLeftIcon,
} from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { CircleButton } from '@/components/in-app-ui/circle-button';
import { useLocale } from '@/hooks/use-locale';
import { useStepList } from '@/hooks/use-step';
import { useSavedRecipes } from '@/hooks/use-saved-recipes';

interface CookingStepScreenProps {
  /** 1-based current step index (defaults to 1 for demo) */
  currentStep?: number;
}

type CookingStepParams = {
  recipeId?: string | string[];
  serves?: string | string[];
  baseServes?: string | string[];
};

export default function CookingStepScreen({ currentStep = 1 }: CookingStepScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<CookingStepParams>();
  const recipeId = Array.isArray(params.recipeId) ? params.recipeId[0] : params.recipeId;
  const serves = Array.isArray(params.serves) ? params.serves[0] : params.serves;
  const baseServes = Array.isArray(params.baseServes) ? params.baseServes[0] : params.baseServes;
  const [step, setStep] = React.useState(currentStep);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { data: apiSteps, isLoading } = useStepList(recipeId);

  const { getSavedRecipeById } = useSavedRecipes();
  const savedRecipe = typeof recipeId === 'string' ? getSavedRecipeById(recipeId) : undefined;
  const isAiRecipe = typeof recipeId === 'string' && recipeId.startsWith('ai-');

  const aiSteps = React.useMemo(() => {
    if (isAiRecipe && savedRecipe?.aiSteps) {
      return savedRecipe.aiSteps.map((text: string, idx: number) => ({
        id: String(idx),
        text,
        tip: '',
      }));
    }
    return null;
  }, [isAiRecipe, savedRecipe?.aiSteps]);

  const steps = isAiRecipe ? (aiSteps ?? []) : (apiSteps ?? []);
  const finalIsLoading = isAiRecipe ? false : isLoading;

  const totalSteps = steps.length;
  const stepData = steps[step - 1];
  const displayedStep = totalSteps === 0 ? 0 : step;

  const { t } = useLocale();

  React.useEffect(() => {
    if (totalSteps === 0) {
      setStep(0);
      return;
    }

    setStep((prev) => Math.min(Math.max(prev, 1), totalSteps));
  }, [totalSteps]);

  const goToIngredients = React.useCallback(() => {
    if (recipeId) {
      router.push({
        pathname: '/(tabs)/cooking-ingredients',
        params: {
          recipeId,
          ...(serves ? { serves } : {}),
          ...(baseServes ? { baseServes } : {}),
        },
      });
      return;
    }

    router.push('/(tabs)/cooking-ingredients');
  }, [baseServes, recipeId, router, serves]);

  const goToRecipeDetail = React.useCallback(() => {
    if (recipeId) {
      router.push({
        pathname: '/(tabs)/recipe-detail',
        params: { recipeId },
      });
      return;
    }

    router.push('/(tabs)/recipe-detail');
  }, [recipeId, router]);

  const handleNext = () => {
    if (totalSteps === 0) {
      return;
    }

    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      goToIngredients();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="px-5 pb-2 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          {/* Close */}
          <CircleButton
            variant="ghost"
            className="h-9 w-9 items-center justify-center bg-gray-100"
            onPress={goToIngredients}>
            <Icon as={XIcon} size={18} className="text-gray-700" />
          </CircleButton>

          {/* Step title */}
          <View className="flex-row items-baseline gap-1">
            <VietnamText className="text-lg font-bold text-gray-900">
              {t('steps.step')} {displayedStep}
            </VietnamText>
            <VietnamText className="text-lg text-gray-400">/ {totalSteps}</VietnamText>
          </View>

          {/* Recipe icon */}
          <CircleButton className="h-9 w-9 items-center justify-center bg-gray-100" variant="ghost">
            <Icon as={BookOpenCheckIcon} size={18} className="text-gray-700" />
          </CircleButton>
        </View>

        {/* ── Segment Progress Bar ── */}
        <View className="flex-row gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              className={`flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-[#E5E7EB]'} h-1`}
            />
          ))}
        </View>
      </View>

      {/* ── Content ── */}
      {finalIsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00B075" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Main instruction */}
          <VietnamText className="mb-6 text-2xl leading-relaxed text-gray-900">
            {stepData?.text}
          </VietnamText>

          {/* Tip card */}
          {stepData?.tip ? (
            <View className="rounded-2xl p-4" style={{ backgroundColor: '#FEFDE8' }}>
              <VietnamText className="text-lg leading-relaxed text-gray-700">
                📌 {stepData.tip}
              </VietnamText>
            </View>
          ) : null}
        </ScrollView>
      )}
      {/* ── Footer Navigation ── */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-3 bg-background px-5 pb-6 pt-3">
        {/* Back button */}
        <RoundedButton className="flex-1 flex-row items-center justify-center" onPress={handleBack}>
          <Icon as={CornerUpLeftIcon} size={18} color="white" />
          <VietnamText className="text-base text-white">{t('other.back')}</VietnamText>
        </RoundedButton>

        {/* Next button */}
        <RoundedButton className="flex-row items-center justify-center" onPress={handleNext}>
          <VietnamText className="text-base text-white">{t('other.next')}</VietnamText>
          <Icon as={ChevronRightIcon} size={18} color="white" />
        </RoundedButton>
      </View>

      {/* ── Success Overlay ── */}
      <Modal visible={showSuccess} animationType="fade" transparent={false} statusBarTranslucent>
        <View className="flex-1" style={{ backgroundColor: '#D6EFE8' }}>
          {/* Close button */}
          <SafeAreaView edges={['top']}>
            <CircleButton
              variant="ghost"
              className="ml-5 mt-5 h-10 w-10 items-center justify-center bg-white/40"
              onPress={() => {
                setShowSuccess(false);
                goToRecipeDetail();
              }}>
              <Icon as={XIcon} size={20} color="#555" />
            </CircleButton>
          </SafeAreaView>

          {/* Lottie high-five animation */}
          <LottieView
            source={require('@/assets/lottie-files/success-state.json')}
            autoPlay
            loop={true}
            style={{ flex: 1, width: '100%' }}
            resizeMode="cover"
          />

          {/* Text & button */}
          <View className="px-8 pb-12" style={{ backgroundColor: '#D6EFE8' }}>
            <VietnamText className="mb-3 text-center text-3xl font-bold text-gray-900">
              {t('other.congratulations')}
            </VietnamText>
            <VietnamText className="mb-8 text-center text-base text-gray-700">
              {t('other.congratulationsMessage')}
            </VietnamText>

            <RoundedButton
              size="lg"
              onPress={() => {
                setShowSuccess(false);
                goToRecipeDetail();
              }}>
              <VietnamText className="text-base text-white">{t('other.success')}</VietnamText>
            </RoundedButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
