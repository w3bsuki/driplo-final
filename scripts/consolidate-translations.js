#!/usr/bin/env node

/**
 * Script to consolidate 440+ Paraglide translation files into 2 JSON files
 * Preserves Bulgarian and English translations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Paths
const paraglidePath = path.join(projectRoot, 'src/paraglide/messages');
const outputPath = path.join(projectRoot, 'src/lib/i18n/translations');

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Translation objects
const translations = {
  bg: {},
  en: {}
};

/**
 * Convert Paraglide key format to nested object
 * e.g., "common_login" -> { common: { login: "..." } }
 */
function setNestedValue(obj, key, value) {
  const parts = key.split('_');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}

/**
 * Extract translation value from Paraglide file
 */
function extractTranslation(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match: export const key = "value"
    const match = content.match(/export\s+const\s+\w+\s*=\s*["'](.+?)["']/);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process all translation files
 */
function processTranslations() {
  const languages = ['bg', 'en'];
  let totalFiles = 0;
  
  languages.forEach(lang => {
    const langPath = path.join(paraglidePath, lang);
    
    if (!fs.existsSync(langPath)) {
      console.warn(`Language directory not found: ${langPath}`);
      return;
    }
    
    const files = fs.readdirSync(langPath).filter(f => f.endsWith('.js'));
    console.log(`Processing ${files.length} ${lang} translation files...`);
    
    files.forEach(file => {
      const key = path.basename(file, '.js');
      const filePath = path.join(langPath, file);
      const value = extractTranslation(filePath);
      
      if (value) {
        setNestedValue(translations[lang], key, value);
        totalFiles++;
      }
    });
  });
  
  return totalFiles;
}

/**
 * Write consolidated JSON files
 */
function writeJsonFiles() {
  // Write Bulgarian translations
  fs.writeFileSync(
    path.join(outputPath, 'bg.json'),
    JSON.stringify(translations.bg, null, 2),
    'utf8'
  );
  
  // Write English translations
  fs.writeFileSync(
    path.join(outputPath, 'en.json'),
    JSON.stringify(translations.en, null, 2),
    'utf8'
  );
  
  console.log('✅ Translation files created:');
  console.log(`   - ${outputPath}/bg.json`);
  console.log(`   - ${outputPath}/en.json`);
}

/**
 * Create TypeScript types
 */
function createTypes() {
  const types = `// Auto-generated translation types
export type TranslationKey = ${JSON.stringify(Object.keys(translations.bg), null, 2)
    .replace(/"/g, "'")
    .replace(/\n/g, '\n  | ')
    .replace('[', '')
    .replace(']', '')};

export type Language = 'bg' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}
`;

  fs.writeFileSync(
    path.join(projectRoot, 'src/lib/i18n/types.ts'),
    types,
    'utf8'
  );
}

/**
 * Create translation helper
 */
function createHelper() {
  const helper = `import bgTranslations from './translations/bg.json';
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
    return value.replace(/\\{(\\w+)\\}/g, (_, param) => 
      params[param]?.toString() || \`{\${param}}\`
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
`;

  fs.writeFileSync(
    path.join(projectRoot, 'src/lib/i18n/index.ts'),
    helper,
    'utf8'
  );
}

// Main execution
console.log('🔄 Starting translation consolidation...\n');

const totalFiles = processTranslations();
writeJsonFiles();
createTypes();
createHelper();

console.log(`\n✨ Consolidation complete!`);
console.log(`   - Processed ${totalFiles} translation files`);
console.log(`   - Created 2 JSON files (bg.json, en.json)`);
console.log(`   - Generated TypeScript types and helpers`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Update imports: $lib/paraglide → $lib/i18n`);
console.log(`   2. Replace paraglide usage with t() function`);
console.log(`   3. Delete src/paraglide directory`);
console.log(`   4. Remove @inlang/paraglide-js from package.json`);