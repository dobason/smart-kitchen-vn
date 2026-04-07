import { I18n } from 'i18n-js';

import en from '@/languages/en.json';
import vi from '@/languages/vi.json';

const i18n = new I18n({ en, vi });

i18n.locale = 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
