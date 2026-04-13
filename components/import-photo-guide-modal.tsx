import * as React from 'react';
import { View, Image, Pressable, ScrollView, Dimensions } from 'react-native';
import { X, Image as ImageIcon, Camera, ChevronRight } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { PHOTO_STEPS, CAMERA_STEPS } from '@/constants/stepData';
import { CircleButton } from '@/components/in-app-ui/circle-button';
import { useLocale } from '@/hooks/use-locale';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GuideContentProps {
  title: string;
  accentColor: string;
  iconName: 'photo' | 'camera';
  steps: { step: number; title: string; image: any }[];
  buttonLabel: string;
  onClose: () => void;
  onAction: () => void;
}

function GuideContent({ title, accentColor, iconName, steps, buttonLabel, onClose, onAction }: GuideContentProps) {
  const { t } = useLocale();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '92%',
      }}>
      {/* Floating icon header */}
      <View style={{ alignItems: 'center', marginTop: -36 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            backgroundColor: accentColor + '22',
            borderWidth: 3,
            borderColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 8,
          }}>
          {iconName === 'photo'
            ? <Icon as={ImageIcon} size={36} />
            : <Icon as={Camera} size={36} />
          }
        </View>
      </View>

      {/* Close button */}
      <CircleButton
        onPress={onClose}
        className="absolute left-4 h-14 w-11 items-center justify-center bg-gray-100"
        variant="ghost"
      >
        <Icon as={X} size={18} className="text-gray-500" />
      </CircleButton>

      {/* Title */}
      <VietnamText
        style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#111111',
          marginTop: 11,
          marginBottom: 4,
          paddingHorizontal: 24,
        }}>
        {title}
      </VietnamText>

      {/* Scrollable steps */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {steps.map((item) => (
          <View key={item.step} style={{ marginTop: 24 }}>
            <VietnamText
              style={{
                fontSize: 17,
                color: '#111111',
                marginBottom: 4,
              }}>
              {t('steps.step')} {item.step}
            </VietnamText>
            <VietnamText
              style={{ fontSize: 14, color: '#444444', marginBottom: 12, lineHeight: 20 }}>
              {item.title}
            </VietnamText>
            <View
              style={{
                backgroundColor: '#EDF7F0',
                borderRadius: 20,
                overflow: 'hidden',
                alignItems: 'center',
                padding: 4,
              }}>
              <Image
                source={item.image}
                style={{
                  width: SCREEN_WIDTH - 56,
                  height: (SCREEN_WIDTH - 56) * 0.7,
                  borderRadius: 16,
                }}
                resizeMode="cover"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Sticky action button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          paddingHorizontal: 20,
          paddingBottom: 32,
          paddingTop: 12,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        }}>
        <Pressable
          onPress={onAction}
          style={{
            backgroundColor: accentColor,
            borderRadius: 50,
            paddingVertical: 16,
            alignItems: 'center',
          }}>
          <VietnamText
            style={{ color: 'white', fontSize: 16, fontFamily: 'BeVietnamPro_700Bold' }}>
            {buttonLabel}
          </VietnamText>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Photo guide ──────────────────────────────────────────────────────────────

interface ImportPhotoGuideContentProps {
  onClose: () => void;
  onGoToImport: () => void;
}

/** Photo import guide — no Modal wrapper. Embed inside an existing Modal. */
export function ImportPhotoGuideContent({ onClose, onGoToImport }: ImportPhotoGuideContentProps) {
  const { t } = useLocale();
  return (
    <GuideContent
      title= {t('other.importPhoto')}
      accentColor="#f02a2aff"
      iconName="photo"
      steps={PHOTO_STEPS}
      buttonLabel= {t('other.goToImport')}
      onClose={onClose}
      onAction={onGoToImport}
    />
  );
}

// ─── Camera guide ─────────────────────────────────────────────────────────────

interface ImportCameraGuideContentProps {
  onClose: () => void;
  onGoToImport: () => void;
}

/** Camera import guide — no Modal wrapper. Embed inside an existing Modal. */
export function ImportCameraGuideContent({ onClose, onGoToImport }: ImportCameraGuideContentProps) {
  const { t } = useLocale();
  return (
    <GuideContent
      title= {t('other.importCamera')}
      accentColor="#D97706"
      iconName="camera"
      steps={CAMERA_STEPS}
      buttonLabel= {t('other.openCamera')}
      onClose={onClose}
      onAction={onGoToImport}
    />
  );
}

// ─── Instruction list (Picture 1) ─────────────────────────────────────────────

interface ImportInstructionListProps {
  onClose: () => void;
  onSelectPhoto: () => void;
  onSelectCamera: () => void;
}

/** Two-item instruction list that appears after tapping "Recipe import guide". */
export function ImportInstructionList({ onClose, onSelectPhoto, onSelectCamera }: ImportInstructionListProps) {
  const { t } = useLocale();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: '#F4F6F4',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingBottom: 40,
      }}>
      {/* Handle bar */}
      <View style={{ alignItems: 'center', paddingTop: 12, marginBottom: 4 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB' }} />
      </View>

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 14,
        }}>
        <Pressable
          onPress={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon as={X} size={18} className="text-gray-600" />
        </Pressable>
        <VietnamText
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            color: '#111111',
          }}>
          {t('other.howToImport')}
        </VietnamText>
        {/* spacer to balance the X */}
        <View style={{ width: 34 }} />
      </View>

      {/* Items */}
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {/* Import from a Photo */}
        <Pressable
          onPress={onSelectPhoto}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E0F2FE',
            borderRadius: 18,
            padding: 14,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#E0F2FE',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon as={ImageIcon} size={26} />
          </View>
          <VietnamText
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 15,
            }}>
            {t('other.importPhoto')}
          </VietnamText>
          <Icon as={ChevronRight} size={20} className="text-gray-400" />
        </Pressable>

        {/* Take Picture to Import */}
        <Pressable
          onPress={onSelectCamera}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor:'#FEF3C7',
            borderRadius: 18,
            padding: 14,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#FEF3C7',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon as={Camera} size={26} />
          </View>
          <VietnamText
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 15,
            }}>
            {t('other.importCamera')}
          </VietnamText>
          <Icon as={ChevronRight} size={20} className="text-gray-400" />
        </Pressable>
      </View>
    </View>
  );
}
