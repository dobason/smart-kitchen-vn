import * as React from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (lang: string) => void;
  t: (key: string, options?: object) => string;
}

export const LocaleContext = React.createContext<LocaleContextType | undefined>(undefined);
