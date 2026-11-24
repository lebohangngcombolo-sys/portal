/**
 * i18next setup.
 *
 * Locales are bundled (not fetched from portal-config) because they're
 * small and translation is essential for initial paint — a network
 * fetch would delay every first load. Large legal documents are loaded
 * on demand from portal-config via /legal/{doc}.md.
 *
 * On first load, the language is selected as:
 * 1. The stored preferred language (if any)
 * 2. The browser's language (matching supported locales)
 * 3. The DEFAULT_LOCALE from build-time env
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enOnboarding from './locales/en/onboarding.json';
import enKyc from './locales/en/kyc.json';
import enAdmin from './locales/en/admin.json';
import enErrors from './locales/en/errors.json';

import ptCommon from './locales/pt/common.json';
import ptAuth from './locales/pt/auth.json';
import ptOnboarding from './locales/pt/onboarding.json';
import ptKyc from './locales/pt/kyc.json';
import ptAdmin from './locales/pt/admin.json';
import ptErrors from './locales/pt/errors.json';

import { Storage, StorageKeys } from 'tb-state';
import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from '../common/constants/languages.js';

const SUPPORTED = Array.isArray(process.env.SUPPORTED_LOCALES?.split(','))
  ? process.env.SUPPORTED_LOCALES.split(',')
  : LANGUAGE_CODES;

const resources = {
  en: {
    translation: {
      ...enCommon,
      auth: enAuth,
      onboarding: enOnboarding,
      kyc: enKyc,
      admin: enAdmin,
      errors: enErrors,
    },
  },
  pt: {
    translation: {
      ...ptCommon,
      auth: ptAuth,
      onboarding: ptOnboarding,
      kyc: ptKyc,
      admin: ptAdmin,
      errors: ptErrors,
    },
  },
};

function detectLanguage() {
  try {
    const storage = new Storage();
    const stored = storage.get(StorageKeys.LANGUAGE);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  const browserLang = (navigator.language || '').split('-')[0];
  if (browserLang && SUPPORTED.includes(browserLang)) return browserLang;
  return process.env.DEFAULT_LOCALE || DEFAULT_LANGUAGE;
}

export async function initI18n() {
  if (i18n.isInitialized) return i18n;

  await i18n.use(initReactI18next).init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false }, // React handles escaping
    react: { useSuspense: false },
    returnNull: false,
  });

  return i18n;
}

/**
 * Change the active language and persist the choice.
 */
export async function changeLanguage(languageCode) {
  if (!SUPPORTED.includes(languageCode)) return;
  await i18n.changeLanguage(languageCode);
  try {
    const storage = new Storage();
    storage.set(StorageKeys.LANGUAGE, languageCode);
  } catch {
    /* ignore */
  }
}

export default i18n;