import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle, View } from 'react-native';
import { useLocale } from '@/hooks/use-locale';

const LOGO = {
  light: require('@/assets/images/adaptive-icon.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const LOGO_STYLE: ImageStyle = {
  height: 100,
  width: 100,
};

export function LogoWithText() {
  const { colorScheme } = useColorScheme();
  const { t } = useLocale();

  return (
    <View className="flex-col items-center justify-center gap-1">
      <Image source={LOGO[colorScheme ?? 'light']} style={LOGO_STYLE} resizeMode="contain" />
      <VietnamText variant="h1" className="text-center text-xl">
        {t('appName')}
      </VietnamText>
    </View>
  );
}
