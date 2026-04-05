import * as React from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  XIcon,
  BookOpenCheckIcon,
  MicIcon,
  ChevronRightIcon,
  CornerUpLeftIcon,
} from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { STEPS } from '@/constants/stepData';
import { useLocale } from '@/hooks/use-locale';

const TOTAL_STEPS = STEPS.length; // 6

interface CookingStepScreenProps {
  /** 1-based current step index (defaults to 1 for demo) */
  currentStep?: number;
}

export default function CookingStepScreen({ currentStep = 1 }: CookingStepScreenProps) {
  const router = useRouter();
  const [step, setStep] = React.useState(currentStep);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const stepData = STEPS[step - 1];
  const { t } = useLocale();

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      router.push('/(tabs)/cooking-ingredients');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View className="px-5 pb-2 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          {/* Close */}
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
            onPress={() => router.push('/(tabs)/cooking-ingredients')}>
            <Icon as={XIcon} size={18} className="text-gray-700" />
          </TouchableOpacity>

          {/* Step title */}
          <View className="flex-row items-baseline gap-1">
            <VietnamText className="text-lg font-bold text-gray-900">
              {t('steps.step')} {step}
            </VietnamText>
            <VietnamText className="text-lg text-gray-400">/ {TOTAL_STEPS}</VietnamText>
          </View>

          {/* Recipe icon */}
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-gray-100">
            <Icon as={BookOpenCheckIcon} size={18} className="text-gray-700" />
          </TouchableOpacity>
        </View>

        {/* ── Segment Progress Bar ── */}
        <View className="flex-row gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              className={`flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-[#E5E7EB]'} h-1`}
            />
          ))}
        </View>
      </View>

      {/* ── Content ── */}
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
            <TouchableOpacity
              className="ml-5 mt-3 h-10 w-10 items-center justify-center rounded-full bg-white/40"
              onPress={() => {
                setShowSuccess(false);
                router.push('/(tabs)/recipe-detail');
              }}>
              <Icon as={XIcon} size={20} color="#555" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Lottie high-five animation */}
          <LottieView
            source={require('@/assets/lottie-files/success-state.json')}
            autoPlay
            loop={false}
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
                router.push('/(tabs)/recipe-detail');
              }}>
              <VietnamText className="text-base text-white">{t('other.success')}</VietnamText>
            </RoundedButton>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
