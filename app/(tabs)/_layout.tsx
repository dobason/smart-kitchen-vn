import { useLocale } from '@/hooks/use-locale';
import { NAV_THEME } from '@/lib/theme';
import { Tabs } from 'expo-router';
import { UtensilsIcon, UserIcon, ChefHatIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];
  const { t } = useLocale();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.explore').toUpperCase(),
          tabBarIcon: ({ color, size }) => <UtensilsIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="recipe"
        options={{
          title: t('tabs.recipe').toUpperCase(),
          tabBarIcon: ({ color, size }) => <ChefHatIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account').toUpperCase(),
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
