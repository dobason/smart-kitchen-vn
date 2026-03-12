import { LocaleContext } from '@/context/locale-context';
import * as React from 'react';

export function useLocale() {
  const context = React.useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within a LocaleProvider');
  return context;
}
