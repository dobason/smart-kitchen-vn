import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { LanguageToggle } from '@/components/in-app-ui/language-toggle';
import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import * as React from 'react';
import { type TextInput, View, Image } from 'react-native';
import { useLocale } from '@/hooks/use-locale';

export function SignInForm() {
  const { t } = useLocale();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        setError({ email: '', password: '' });
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }
      // TODO: Handle other statuses
      console.error(JSON.stringify(signInAttempt, null, 2));
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
      <Card className="border-border/0 bg-gray-50 bg-secondary shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <View className="flex-row items-center justify-end">
            <LanguageToggle />
          </View>
          <View className="flex-row justify-center">
            <Image className="size-24" source={require('@/assets/images/icon.png')} />
          </View>
          <CardTitle className="text-center text-xl sm:text-left">{t('signIn.appName')}</CardTitle>
          <CardDescription className="text-center sm:text-left">
            {t('signIn.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <SocialConnections />
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <VietnamText className="px-4 text-sm text-muted-foreground">
              {t('signIn.or')}
            </VietnamText>
            <Separator className="flex-1" />
          </View>
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">{t('signIn.emailLabel')}</Label>
              <Input
                id="email"
                placeholder={t('signIn.emailPlaceholder')}
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
                <Label htmlFor="password">{t('signIn.passwordLabel')}</Label>
                <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4">
                    <VietnamText className="font-normal leading-4">
                      {t('signIn.forgotPassword')}
                    </VietnamText>
                  </Button>
                </Link>
              </View>
              <Input
                ref={passwordInputRef}
                placeholder={t('signIn.passwordPlaceholder')}
                id="password"
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
              <VietnamText>{t('signIn.submit')}</VietnamText>
            </Button>
          </View>
          <VietnamText className="text-center text-sm">
            {t('signIn.noAccount')}{' '}
            <Link href="/(auth)/sign-up" className="text-sm underline underline-offset-4">
              {t('signIn.signUp')}
            </Link>
          </VietnamText>
        </CardContent>
      </Card>
    </View>
  );
}
