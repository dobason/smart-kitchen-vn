import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '@/languages/en.json';
import vi from '@/languages/vi.json';

const i18n = new I18n({ en, vi });

i18n.locale = getLocales()?.[0]?.languageCode || 'vi';
i18n.enableFallback = true;
i18n.defaultLocale = 'vi';

export default i18n;
