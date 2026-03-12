import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { useLocale } from '@/hooks/use-locale';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';

export function SignUpForm() {
  const { t } = useLocale();
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      router.push(`/(auth)/sign-up/verify-email?email=${email}`);
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes('identifier') ||
          err.message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: err.message } : { password: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">{t('signUp.title')}</CardTitle>
          <CardDescription className="text-center sm:text-left">
            {t('signUp.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">{t('signUp.emailLabel')}</Label>
              <Input
                id="email"
                placeholder={t('signUp.emailPlaceholder')}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onChangeText={setEmail}
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
              />
              {error.email ? (
                <VietnamText className="text-sm font-medium text-destructive">
                  {error.email}
                </VietnamText>
              ) : null}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">{t('signUp.passwordLabel')}</Label>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                placeholder={t('signUp.passwordPlaceholder')}
                secureTextEntry
                onChangeText={setPassword}
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
              {error.password ? (
                <VietnamText className="text-sm font-medium text-destructive">
                  {error.password}
                </VietnamText>
              ) : null}
            </View>
            <Button className="w-full" onPress={onSubmit}>
              <VietnamText>{t('signUp.submit')}</VietnamText>
            </Button>
          </View>
          <VietnamText className="text-center text-sm">
            {t('signUp.hasAccount')}{' '}
            <Link href="/(auth)/sign-in" dismissTo className="text-sm underline underline-offset-4">
              {t('signUp.signIn')}
            </Link>
          </VietnamText>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <VietnamText className="px-4 text-sm text-muted-foreground">{t('signUp.or')}</VietnamText>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
