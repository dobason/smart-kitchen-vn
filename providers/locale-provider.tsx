import i18n from '@/lib/i18n';
import { LocaleContext } from '@/context/locale-context';
import * as React from 'react';

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use state to track the locale and trigger re-renders
  const [locale, _setLocale] = React.useState(i18n.locale);

  const setLocale = (lang: string) => {
    i18n.locale = lang; // Update the actual i18n instance
    _setLocale(lang); // Update React state to trigger UI refresh
  };

  // Memoize the value to prevent unnecessary re-renders of the Provider
  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string, options?: object) => i18n.t(key, options),
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
