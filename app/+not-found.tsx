import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View>
        <VietnamText>This screen doesn't exist.</VietnamText>

        <Link href="/">
          <VietnamText>Go to home screen!</VietnamText>
        </Link>
      </View>
    </>
  );
}
