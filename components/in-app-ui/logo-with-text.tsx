import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle, View } from 'react-native';
import { useLocale } from '@/hooks/use-locale';

const LOGO = {
  light: require('@/assets/images/adaptive-icon.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const LOGO_STYLE: ImageStyle = {
  height: 84,
  width: 84,
};

export function LogoWithText() {
  const { colorScheme } = useColorScheme();
  const { t } = useLocale();

  return (
    <View className="flex-col items-center justify-center gap-1">
      <Image source={LOGO[colorScheme ?? 'light']} style={LOGO_STYLE} resizeMode="contain" />
      <VietnamText numberOfLines={1} className="text-center text-[18px] font-bold text-[#333333]">
        {t('appName')}
      </VietnamText>
    </View>
  );
}
