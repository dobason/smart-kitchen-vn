import { Button } from '@/components/ui/button';
import { VietnamText } from '@/components/in-app-ui/vietnam-text';
import { LocaleContext } from '@/context/locale-context';
import { useContext } from 'react';

const LANGUAGES: Record<string, { label: string; flag: string }> = {
  vi: { label: 'VI', flag: '🇻🇳' },
  en: { label: 'EN', flag: '🇬🇧' },
};

export function LanguageToggle() {
  const context = useContext(LocaleContext);
  if (!context) {
    return null;
  }
  const { locale = 'en', setLocale } = context;
  const next = locale === 'vi' ? 'en' : 'vi';
  const current = LANGUAGES[locale] ?? LANGUAGES.en;

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-row items-center gap-1.5"
      onPress={() => setLocale(next)}>
      <VietnamText>{current.flag}</VietnamText>
      <VietnamText className="text-xs">{current.label}</VietnamText>
    </Button>
  );
}
