import * as React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CameraIcon,
  PlusIcon,
  XIcon,
  PencilIcon,
  GripVerticalIcon,
  PinIcon,
  ChevronRightIcon,
} from 'lucide-react-native';

import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { Icon } from '@/components/ui/icon';
import { CircleButton } from '@/components/in-app-ui/circle-button';
import { RoundedButton } from '@/components/in-app-ui/rounded-button';
import { useLocale } from '@/hooks/use-locale';
import { IngredientItem, IngredientGroup } from '@/types/ingredient';
import { StepItem } from '@/types/step';
import { INITIAL_GROUPS } from '@/constants/ingredientData';
import { INITIAL_STEPS } from '@/constants/stepData';

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
    <View className="flex-row items-center justify-between mb-2.5 mt-[18px]">
      <View className="flex-row items-center">
        <VietnamText className="text-sm font-extrabold text-gray-900 tracking-[0.5px]">{title}</VietnamText>
        {required && (
          <VietnamText className="text-red-500 text-sm font-bold ml-1">
            *
          </VietnamText>
        )}
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
      <VietnamText className="text-[11px] text-gray-500 mb-1 font-medium">{label}</VietnamText>
      <View className="flex-row items-center bg-gray-100 rounded-[10px] px-2.5 py-2 gap-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          className="flex-1 text-sm text-gray-800 p-0"
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
  item: IngredientItem;
  onRemove: () => void;
  onChangeQty: (v: string) => void;
  onChangeUnit: (v: string) => void;
  onChangeName: (v: string) => void;
}) {
  return (
    <View className="flex-row items-center gap-1.5 mb-1.5">
      <TextInput
        value={item.qty}
        onChangeText={onChangeQty}
        className="w-[50px] bg-gray-100 rounded-lg px-2 py-2 text-center text-sm text-gray-800"
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
        keyboardType="decimal-pad"
      />
      <TextInput
        value={item.unit}
        onChangeText={onChangeUnit}
        className="w-[68px] bg-gray-100 rounded-lg px-2 py-2 text-center text-sm text-gray-800"
        style={{ fontFamily: 'BeVietnamPro_400Regular' }}
      />
      <TextInput
        value={item.name}
        onChangeText={onChangeName}
        className="flex-1 bg-gray-100 rounded-lg px-2.5 py-2 text-sm text-gray-800"
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
    <View className="flex-row mb-3">
      {/* Step Number Badge */}
      <View className="w-7 h-7 rounded-full items-center justify-center mr-2.5 mt-2.5 bg-brand">
        <VietnamText className="text-[13px] font-bold text-white">{index + 1}</VietnamText>
      </View>

      {/* Content */}
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-start bg-gray-100 rounded-xl px-3 py-2.5 gap-1.5">
          <TextInput
            value={step.text}
            onChangeText={onChangeText}
            multiline
            className="flex-1 text-sm text-gray-800 min-h-[44px]"
            style={{ fontFamily: 'BeVietnamPro_400Regular' }}
            placeholder="Nhập bước nấu..."
          />
          <TouchableOpacity onPress={onRemove} className="p-0.5 mt-0.5">
            <Icon as={XIcon} size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Tip card */}
        {step.tip ? (
          <View className="flex-row bg-[#FEFDE8] rounded-xl px-3 py-2.5 gap-1.5">
            <VietnamText className="text-base">📌</VietnamText>
            <TextInput
              value={step.tip}
              onChangeText={onChangeTip}
              multiline
              className="flex-1 text-[13px] text-gray-600 min-h-[36px]"
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

  /* ── Name ── */
  const [name, setName] = React.useState('Mì nước cay kiểu Á');
  const MAX_NAME = 50;

  /* ── Info ── */
  const [time, setTime] = React.useState('25');
  const [cost, setCost] = React.useState('120000');
  const [saved, setSaved] = React.useState('100000');
  const [calories, setCalories] = React.useState('550');
  const [protein, setProtein] = React.useState('28');
  const [carbs, setCarbs] = React.useState('65');
  const [fats, setFats] = React.useState('18');

  /* ── Cookbook ── */
  const [cookbook] = React.useState('Dinner');

  /* ── Ingredients ── */
  const [groups, setGroups] = React.useState<IngredientGroup[]>(INITIAL_GROUPS);

  /* ── Steps ── */
  const [steps, setSteps] = React.useState<StepItem[]>(INITIAL_STEPS);

  /* ─── Ingredient Helpers ─── */
  const updateIngredient = (
    gIdx: number,
    iIdx: number,
    field: keyof IngredientItem,
    value: string
  ) => {
    setGroups((prev) => {
      const next = prev.map((g, gi) =>
        gi !== gIdx
          ? g
          : {
              ...g,
              items: g.items.map((item, ii) =>
                ii !== iIdx ? item : { ...item, [field]: value }
              ),
            }
      );
      return next;
    });
  };

  const removeIngredient = (gIdx: number, iIdx: number) => {
    setGroups((prev) =>
      prev.map((g, gi) =>
        gi !== gIdx ? g : { ...g, items: g.items.filter((_, ii) => ii !== iIdx) }
      )
    );
  };

  const addIngredient = (gIdx: number) => {
    const newItem: IngredientItem = {
      id: Date.now().toString(),
      qty: '',
      unit: '',
      name: '',
    };
    setGroups((prev) =>
      prev.map((g, gi) => (gi !== gIdx ? g : { ...g, items: [...g.items, newItem] }))
    );
  };

  /* ─── Step Helpers ─── */
  const removeStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: keyof StepItem, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i !== idx ? s : { ...s, [field]: value })));
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { id: Date.now().toString(), text: '', tip: '' },
    ]);
  };

  const handleSave = () => {
    Alert.alert(t('other.successSave'), t('other.successUpdate'), [
      { text: 'OK', onPress: () => router.push('/(tabs)/recipe-detail') },
    ]);
  };

  /* ─── Render ─── */
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* ── Top Bar ── */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <CircleButton variant="ghost" className="h-10 w-10 items-center justify-center rounded-full p-1" onPress={() => router.push('/(tabs)/recipe-detail')}>
          <Icon as={ArrowLeftIcon} size={22} color="#1f2937" />
        </CircleButton>

        <VietnamText className="text-base font-bold text-gray-900 tracking-[1px]">{t('other.edit')}</VietnamText>

        <RoundedButton onPress={handleSave} className="rounded-full px-5 py-2">
          <VietnamText className="text-white font-semibold text-sm">{t('other.save')}</VietnamText>
        </RoundedButton>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ── Hero Photo ── */}
        <View className="flex-[220px] h-[220px] relative">
          <Image
            source={{
              uri: 'https://images.squarespace-cdn.com/content/v1/66628bdc6b0b0d52d914a921/1752754499896-E9EAAEK78ESN8KAJV33G/unsplash-image-_33r6H_hiz4.jpg?format=1500w',
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Change Photo overlay */}
          <TouchableOpacity className="absolute bottom-0 left-0 right-0 bg-black/45 flex-row items-center justify-center py-2.5 gap-2">
            <Icon as={CameraIcon} size={18} color="white" />
            <VietnamText className="text-white font-semibold text-[15px]">{t('other.changePhoto')}</VietnamText>
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-[18px]">
          {/* ── NAME ── */}
          <SectionHeader title={t('recipe.name')} required />
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3.5 py-2.5 mb-1">
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
            <InfoField label={t('other.time')} value={time} unit="min" onChangeText={setTime} keyboardType="numeric" />
            <InfoField label={t('other.cost')} value={cost} unit="đ" onChangeText={setCost} keyboardType="numeric" />
            <InfoField label={t('other.saved')} value={saved} unit="đ" onChangeText={setSaved} keyboardType="numeric" />
          </View>
          <View className="flex-row gap-2 mt-2">
            <InfoField label="Calories" value={calories} unit="kal" onChangeText={setCalories} keyboardType="numeric" />
            <InfoField label="Protein" value={protein} unit="g" onChangeText={setProtein} keyboardType="numeric" />
            <InfoField label="Carbs" value={carbs} unit="g" onChangeText={setCarbs} keyboardType="numeric" />
            <InfoField label="Fats" value={fats} unit="g" onChangeText={setFats} keyboardType="numeric" />
          </View>

          {/* ── COOKBOOK ── */}
          <SectionHeader title={t('cookbook.COOKBOOK')} actionLabel={t('other.edit')} onAction={() => {}} />
          <View className="flex-row mb-1">
            <View className="bg-gray-100 rounded-full px-3.5 py-[7px]">
              <VietnamText className="text-sm italic text-gray-700">📁 {cookbook}</VietnamText>
            </View>
          </View>

          {/* ── INGREDIENTS ── */}
          <SectionHeader title={t('ingredients.INGREDIENTS')} actionLabel={t('other.reOrder')} onAction={() => {}} />

          {groups.map((group, gIdx) => (
            <View key={group.id} className="mb-3">
              {/* Group Label */}
              <View className="flex-row items-center mb-1.5 gap-1.5">
                <VietnamText className="text-[13px] text-gray-500 font-medium">{group.label}</VietnamText>
                <TouchableOpacity className="p-0.5">
                  <Icon as={PencilIcon} size={13} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-auto w-[26px] h-[26px] rounded-full items-center justify-center bg-brand"
                  onPress={() => addIngredient(gIdx)}>
                  <Icon as={PlusIcon} size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* Ingredient rows */}
              {group.items.map((item, iIdx) => (
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
          <SectionHeader title={t('steps.STEPS')} actionLabel={t('other.reOrder')} onAction={() => {}} />

          {steps.map((step, idx) => (
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
          <RoundedButton onPress={addStep} variant="ghost" className="text-black border-black border-2" size={"lg"}>
            <Icon as={PlusIcon} size={16} />
            <VietnamText  className="text-black">{t('steps.addStep')}</VietnamText>
          </RoundedButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


