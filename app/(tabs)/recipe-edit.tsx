import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, CameraIcon, PlusIcon, XIcon, PencilIcon } from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { CircleButton } from '@/components/in-app-ui/circle-button';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { useLocale } from '@/hooks/use-locale';
import { EditableIngredientItem } from '@/types/ingredient';
import { StepItem } from '@/types/step';
import { INITIAL_GROUPS } from '@/constants/ingredientData';
import { INITIAL_STEPS } from '@/constants/stepData';
import { useRecipeDetail, useUpdateRecipe, useRecipeForm } from '@/hooks/use-recipe';

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionHeader({
  title,
  actionLabel,
  onAction,
  required,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  required?: boolean;
}) {
  return (
    <View className="mb-2.5 mt-[18px] flex-row items-center justify-between">
      <View className="flex-row items-center">
        <VietnamText className="text-sm font-extrabold tracking-[0.5px] text-gray-900">
          {title}
        </VietnamText>
        {required && <VietnamText className="ml-1 text-sm font-bold text-red-500">*</VietnamText>}
      </View>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <VietnamText className="text-[13px] font-bold">{actionLabel}</VietnamText>
        </TouchableOpacity>
      )}
    </View>
  );
}

function InfoField({
  label,
  value,
  unit,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  unit?: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}) {
  return (
    <View className="flex-1">
      <VietnamText className="mb-1 text-[11px] font-medium text-gray-500">{label}</VietnamText>
      <View className="flex-row items-center gap-1 rounded-[10px] bg-gray-100 px-2.5 py-2">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 p-0 text-sm text-gray-800"
          style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        />
        {unit ? <VietnamText className="text-[11px] text-gray-400">{unit}</VietnamText> : null}
      </View>
    </View>
  );
}

function IngredientItemRow({
  item,
  onRemove,
  onChangeQty,
  onChangeUnit,
  onChangeName,
}: {
  item: EditableIngredientItem;
  onRemove: () => void;
  onChangeQty: (v: string) => void;
  onChangeUnit: (v: string) => void;
  onChangeName: (v: string) => void;
}) {
  return (
    <View className="mb-1.5 flex-row items-center gap-1.5">
      <TextInput
        value={item.qty}
        onChangeText={onChangeQty}
        className="w-[50px] rounded-lg bg-gray-100 px-2 py-2 text-center text-sm text-gray-800"
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        keyboardType="decimal-pad"
      />
      <TextInput
        value={item.unit}
        onChangeText={onChangeUnit}
        className="w-[68px] rounded-lg bg-gray-100 px-2 py-2 text-center text-sm text-gray-800"
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
      />
      <TextInput
        value={item.name}
        onChangeText={onChangeName}
        className="flex-1 rounded-lg bg-gray-100 px-2.5 py-2 text-sm text-gray-800"
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
      />
      <TouchableOpacity onPress={onRemove} className="p-1">
        <Icon as={XIcon} size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

function StepRow({
  step,
  index,
  onRemove,
  onChangeText,
  onChangeTip,
}: {
  step: StepItem;
  index: number;
  onRemove: () => void;
  onChangeText: (v: string) => void;
  onChangeTip: (v: string) => void;
}) {
  return (
    <View className="mb-3 flex-row">
      {/* Step Number Badge */}
      <View className="bg-brand mr-2.5 mt-2.5 h-7 w-7 items-center justify-center rounded-full">
        <VietnamText className="text-[13px] font-bold text-white">{index + 1}</VietnamText>
      </View>

      {/* Content */}
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-start gap-1.5 rounded-xl bg-gray-100 px-3 py-2.5">
          <TextInput
            value={step.text}
            onChangeText={onChangeText}
            multiline
            className="min-h-[44px] flex-1 text-sm text-gray-800"
            style={{ fontFamily: 'BeVietnamPro_400Regular' }}
            placeholder="Nhập bước nấu..."
          />
          <TouchableOpacity onPress={onRemove} className="mt-0.5 p-0.5">
            <Icon as={XIcon} size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Tip card */}
        {step.tip ? (
          <View className="flex-row gap-1.5 rounded-xl bg-[#FEFDE8] px-3 py-2.5">
            <VietnamText className="text-base">📌</VietnamText>
            <TextInput
              value={step.tip}
              onChangeText={onChangeTip}
              multiline
              className="min-h-[36px] flex-1 text-[13px] text-gray-600"
              style={{ fontFamily: 'BeVietnamPro_400Regular' }}
              placeholder="Mẹo nhỏ..."
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────── */

export default function RecipeEditScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const { recipeId } = useLocalSearchParams();
  const MAX_NAME = 50;

  const [cookbook, setCookbook] = React.useState('Dinner');

  const { data: recipeData, isLoading } = useRecipeDetail(recipeId as string);
  const updateMutation = useUpdateRecipe(recipeId as string);

  const {
    name,
    setName,
    time,
    setTime,
    calories,
    setCalories,
    protein,
    setProtein,
    carbs,
    setCarbs,
    fats,
    setFats,
    groups,
    steps,
    updateIngredient,
    removeIngredient,
    addIngredient,
    updateStep,
    removeStep,
    addStep,
    buildPayload,
  } = useRecipeForm(recipeData);

  const handleSave = () => {
    if (!recipeId) return;
    const payload = buildPayload();

    updateMutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert(t('other.successSave'), t('other.successUpdate'), [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: (error) => {
        console.error('Lỗi khi lưu:', error);
        Alert.alert('Thất bại', 'Không thể cập nhật công thức. Vui lòng thử lại.');
      },
    });
  };

  /* ─── Render UI ─── */
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <CircleButton
          variant="ghost"
          className="h-10 w-10 items-center justify-center rounded-full p-1"
          onPress={() => router.push('/(tabs)/recipe-detail')}>
          <Icon as={ArrowLeftIcon} size={22} color="#1f2937" />
        </CircleButton>

        <VietnamText className="text-base font-bold tracking-[1px] text-gray-900">
          {t('other.edit')}
        </VietnamText>

        {/* Nút Save có hiệu ứng loading */}
        <RoundedButton
          onPress={handleSave}
          className="rounded-full px-5 py-2"
          disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <VietnamText className="text-sm font-semibold text-white">
              {t('other.save')}
            </VietnamText>
          )}
        </RoundedButton>
      </View>

      {/* Hiển thị Loading che màn hình nếu đang lấy dữ liệu */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="relative h-[220px] flex-[220px]">
            <Image
              source={{
                uri: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w',
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
            {/* Change Photo overlay */}
            <TouchableOpacity className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-2 bg-black/45 py-2.5">
              <Icon as={CameraIcon} size={18} color="white" />
              <VietnamText className="text-[15px] font-semibold text-white">
                {t('other.changePhoto')}
              </VietnamText>
            </TouchableOpacity>
          </View>

          <View className="px-4 pt-[18px]">
            {/* ── NAME ── */}
            <SectionHeader title={t('recipe.name')} required />
            <View className="mb-1 flex-row items-center rounded-xl bg-gray-100 px-3.5 py-2.5">
              <TextInput
                value={name}
                onChangeText={(v) => v.length <= MAX_NAME && setName(v)}
                className="flex-1 text-[15px] text-gray-800"
                style={{ fontFamily: 'BeVietnamPro_400Regular' }}
                maxLength={MAX_NAME}
              />
              <VietnamText className="text-xs font-semibold">
                {name.length}/{MAX_NAME}
              </VietnamText>
            </View>

            {/* ── INFORMATION ── */}
            <SectionHeader title={t('other.info')} required />
            <View className="flex-row gap-2">
              <InfoField
                label={t('other.time')}
                value={time}
                unit="min"
                onChangeText={setTime}
                keyboardType="numeric"
              />
            </View>
            <View className="mt-2 flex-row gap-2">
              <InfoField
                label="Calories"
                value={calories}
                unit="kal"
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <InfoField
                label="Protein"
                value={protein}
                unit="g"
                onChangeText={setProtein}
                keyboardType="numeric"
              />
              <InfoField
                label="Carbs"
                value={carbs}
                unit="g"
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
              <InfoField
                label="Fats"
                value={fats}
                unit="g"
                onChangeText={setFats}
                keyboardType="numeric"
              />
            </View>

            {/* ── COOKBOOK ── */}
            <SectionHeader
              title={t('cookbook.COOKBOOK')}
              actionLabel={t('other.edit')}
              onAction={() => {}}
            />
            <View className="mb-1 flex-row">
              <View className="rounded-full bg-gray-100 px-3.5 py-[7px]">
                <VietnamText className="text-sm italic text-gray-700">📁 {cookbook}</VietnamText>
              </View>
            </View>

            {/* ── INGREDIENTS ── */}
            <SectionHeader
              title={t('ingredients.INGREDIENTS')}
              actionLabel={t('other.reOrder')}
              onAction={() => {}}
            />

            {groups?.map((group, gIdx) => (
              <View key={group.id} className="mb-3">
                {/* Group Label */}
                <View className="mb-1.5 flex-row items-center gap-1.5">
                  <VietnamText className="text-[13px] font-medium text-gray-500">
                    {group.label}
                  </VietnamText>
                  <TouchableOpacity className="p-0.5">
                    <Icon as={PencilIcon} size={13} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-brand ml-auto h-[26px] w-[26px] items-center justify-center rounded-full"
                    onPress={() => addIngredient(gIdx)}>
                    <Icon as={PlusIcon} size={16} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Ingredient rows */}
                {group.items?.map((item, iIdx) => (
                  <IngredientItemRow
                    key={item.id}
                    item={item}
                    onRemove={() => removeIngredient(gIdx, iIdx)}
                    onChangeQty={(v) => updateIngredient(gIdx, iIdx, 'qty', v)}
                    onChangeUnit={(v) => updateIngredient(gIdx, iIdx, 'unit', v)}
                    onChangeName={(v) => updateIngredient(gIdx, iIdx, 'name', v)}
                  />
                ))}
              </View>
            ))}

            {/* ── STEPS ── */}
            <SectionHeader
              title={t('steps.STEPS')}
              actionLabel={t('other.reOrder')}
              onAction={() => {}}
            />

            {steps?.map((step, idx) => (
              <StepRow
                key={step.id}
                step={step}
                index={idx}
                onRemove={() => removeStep(idx)}
                onChangeText={(v) => updateStep(idx, 'text', v)}
                onChangeTip={(v) => updateStep(idx, 'tip', v)}
              />
            ))}

            {/* Add step button */}
            <RoundedButton
              onPress={addStep}
              variant="ghost"
              className="border-2 border-black text-black"
              size={'lg'}>
              <Icon as={PlusIcon} size={16} />
              <VietnamText className="text-black">{t('steps.addStep')}</VietnamText>
            </RoundedButton>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
