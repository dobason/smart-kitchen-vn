import '@/global.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

import { NAV_THEME } from '@/lib/theme';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { BeVietnamPro_400Regular, useFonts } from '@expo-google-fonts/be-vietnam-pro';
import { setTokenGetter } from '@/services/axiosClient';
import { LocaleProvider } from '@/providers/locale-provider';
import { IngredientsProvider } from '@/providers/ingredients-provider';
import { SavedRecipesProvider } from '@/providers/saved-recipes-provider';
import { UserRecipeEditsProvider } from '@/providers/user-recipe-edits-provider';
import { AIRecipeProvider } from '@/context/ai-recipe-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const queryClient = new QueryClient();
  const { setColorScheme } = useColorScheme();
  React.useEffect(() => {
    setColorScheme('light');
  }, []);
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables.');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <IngredientsProvider>
          <SavedRecipesProvider>
            <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
              <UserRecipeEditsProvider>
                <AIRecipeProvider>
                  <ThemeProvider value={NAV_THEME['light']}>
                    <StatusBar style="dark" />
                    <Routes />
                    <PortalHost />
                  </ThemeProvider>
                </AIRecipeProvider>
              </UserRecipeEditsProvider>
            </ClerkProvider>
          </SavedRecipesProvider>
        </IngredientsProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore error if splash screen is not registered (e.g., during fast refresh)
});

function Routes() {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  React.useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  const bypassAuthInDev =
    __DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH_IN_DEV?.toLowerCase() === 'true';
  const effectiveIsSignedIn = isSignedIn === true || bypassAuthInDev;
  const [isLoadedFont, errorFont] = useFonts({
    BeVietnamPro_400Regular,
  });

  React.useEffect(() => {
    if (isLoaded && (isLoadedFont || errorFont)) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore error if splash screen is already hidden
      });
    }
  }, [isLoaded, isLoadedFont, errorFont]);

  if (!isLoaded && !isLoadedFont && !errorFont) {
    return null;
  }

  return (
    <Stack>
      {/* Screens only shown when the user is NOT signed in */}
      <Stack.Protected guard={!effectiveIsSignedIn}>
        <Stack.Screen name="(auth)/sign-in" options={SIGN_IN_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/sign-up" options={SIGN_UP_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/reset-password" options={DEFAULT_AUTH_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/forgot-password" options={DEFAULT_AUTH_SCREEN_OPTIONS} />
      </Stack.Protected>

      {/* Screens only shown when the user IS signed in */}
      <Stack.Protected guard={effectiveIsSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search-results" options={{ headerShown: false }} />
        <Stack.Screen name="ai-recipe" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipe-generating"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="ingredients-picker" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Screens outside the guards are accessible to everyone (e.g. not found) */}
    </Stack>
  );
}

const SIGN_IN_SCREEN_OPTIONS = {
  headerShown: false,
  title: 'Sign in',
};

const SIGN_UP_SCREEN_OPTIONS = {
  presentation: 'modal',
  title: '',
  headerTransparent: true,
  gestureEnabled: false,
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
  title: '',
  headerShadowVisible: false,
  headerTransparent: true,
};
