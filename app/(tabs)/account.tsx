import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useAuth, useUser } from '@clerk/clerk-expo';
import i18n from '@/lib/i18n';
import { RefreshCwIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/icon';
import { useLocale } from '@/hooks/use-locale';

export default function AccountScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { t } = useLocale();


  const { initials, imageSource, displayName, userId } = React.useMemo(() => {
    const displayName =
      user?.fullName || user?.emailAddresses[0]?.emailAddress || t('account.guest') || '';
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
    const userId = user?.id ?? '';
    return { initials, imageSource, displayName, userId };
  }, [user, t]);

  async function handleSync() {
    await user?.reload();
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Profile Header */}
      <View className="flex-row items-center gap-4 px-4 py-6">
        <Avatar alt={`${displayName}'s avatar`} className="size-20">
          <AvatarImage source={imageSource} />
          <AvatarFallback>
            <VietnamText className="text-2xl font-semibold">{initials}</VietnamText>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1 gap-1">
          <VietnamText className="text-xl font-semibold">{displayName}</VietnamText>
          {userId ? (
            <VietnamText className="text-xs text-muted-foreground">UID: {userId}</VietnamText>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-start"
            onPress={handleSync}>
            <Icon as={RefreshCwIcon} className="size-3.5" />
            <VietnamText className="text-sm">{t('account.syncButton')}</VietnamText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
