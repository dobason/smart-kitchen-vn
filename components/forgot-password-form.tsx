import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import { useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import * as React from 'react';
import { View } from 'react-native';

export function ForgotPasswordForm() {
  const { t } = useLocale();
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = React.useState(emailParam);
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  const onSubmit = async () => {
    if (!email) {
      setError({ email: 'Email is required' });
      return;
    }
    if (!isLoaded) {
      return;
    }

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      router.push(`/(auth)/reset-password?email=${email}`);
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        setError({ email: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">{t('forgotPassword.title')}</CardTitle>
          <CardDescription className="text-center sm:text-left">
            {t('forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">{t('forgotPassword.emailLabel')}</Label>
              <Input
                id="email"
                defaultValue={email}
                placeholder={t('forgotPassword.emailPlaceholder')}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onSubmit}
                returnKeyType="send"
              />
              {error.email ? (
                <VietnamText className="text-sm font-medium text-destructive">{error.email}</VietnamText>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit}>
              <VietnamText>{t('forgotPassword.submit')}</VietnamText>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
