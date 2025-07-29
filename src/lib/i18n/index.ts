import bgTranslations from './translations/bg.json';
import enTranslations from './translations/en.json';
import type { Language } from './types';

const translations = {
  bg: bgTranslations,
  en: enTranslations
};

/**
 * Get translation by key and language
 * @param key - Dot-notation key (e.g., 'common.login')
 * @param lang - Language code ('bg' or 'en')
 * @param params - Optional parameters for interpolation
 */
export function t(
  key: string, 
  lang: Language = 'bg',
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key; // Return key if translation not found
  }
  
  // Simple parameter interpolation
  if (params && typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (_, param) => 
      params[param]?.toString() || `{${param}}`
    );
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a namespace
 */
export function getNamespace(namespace: string, lang: Language = 'bg') {
  return translations[lang]?.[namespace] || {};
}

/**
 * Check if translation exists
 */
export function hasTranslation(key: string, lang: Language = 'bg'): boolean {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return false;
  }
  
  return typeof value === 'string';
}

// Re-export types
export type { Language } from './types';
