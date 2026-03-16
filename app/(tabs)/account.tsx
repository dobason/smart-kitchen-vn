import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 p-4">
        <VietnamText variant="h1" className="text-3xl font-medium">
          Account
        </VietnamText>
        <VietnamText className="text-center text-sm text-muted-foreground">
          Your account settings will appear here.
        </VietnamText>
      </View>
    </SafeAreaView>
  );
}
