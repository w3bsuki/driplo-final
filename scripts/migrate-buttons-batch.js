#!/usr/bin/env node

/**
 * Batch migration script for converting raw buttons to Button component
 * Usage: node scripts/migrate-buttons-batch.js [--dry-run] [--limit=N]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

// High-priority files to migrate first (most buttons)
const priorityFiles = [
  'src/lib/components/shared/UnifiedFilter.svelte',
  'src/routes/(app)/listings/[id]/+page.svelte',
  'src/lib/components/shared/CategoryDropdownFixed.svelte',
  'src/routes/(app)/browse/+page.svelte',
  'src/lib/components/shared/CategoryDropdown.svelte',
  'src/lib/components/shared/UnifiedSearch.svelte',
  'src/lib/components/home/HeroSearch.svelte',
  'src/lib/components/home/HeroSearchFixed.svelte',
  'src/lib/components/checkout/checkout-modal/PaymentSelector.svelte',
  'src/lib/components/listings/ListingGrid.svelte'
];

// Files to skip (legitimate raw button usage)
const skipFiles = [
  'badge.svelte',
  'switch.svelte',
  'alert-dialog',
  'dialog.svelte',
  'chip.svelte',
  'tooltip',
  'popover',
  'button.svelte' // The Button component itself
];

const shouldSkip = (filePath) => {
  return skipFiles.some(skip => filePath.includes(skip));
};

const findButtonFiles = () => {
  console.log('🔍 Finding files with raw button elements...\n');
  
  try {
    // Use grep to find files with <button
    const result = execSync(
      `grep -r "<button" --include="*.svelte" src/lib/components src/routes 2>/dev/null || true`,
      { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 }
    );
    
    const files = result
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split(':')[0])
      .filter(file => !shouldSkip(file))
      .filter((file, index, self) => self.indexOf(file) === index); // Remove duplicates
    
    // Sort by priority
    const sortedFiles = [
      ...priorityFiles.filter(f => files.includes(f)),
      ...files.filter(f => !priorityFiles.includes(f))
    ];
    
    return sortedFiles;
  } catch (error) {
    console.error('Error finding files:', error.message);
    return [];
  }
};

const processFile = (filePath) => {
  if (dryRun) {
    console.log(`[DRY RUN] Would process: ${filePath}`);
    return;
  }
  
  try {
    execSync(`node scripts/migrate-buttons.js "${filePath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
};

// Main execution
console.log('🚀 Button Migration Tool\n');
console.log(`Mode: ${dryRun ? 'DRY RUN' : 'ACTUAL MIGRATION'}`);
if (limit) console.log(`Limit: ${limit} files`);
console.log('\n---\n');

const files = findButtonFiles();
console.log(`Found ${files.length} files with raw button elements\n`);

if (files.length === 0) {
  console.log('No files to process!');
  process.exit(0);
}

const filesToProcess = limit ? files.slice(0, limit) : files;

console.log(`Processing ${filesToProcess.length} files...\n`);

filesToProcess.forEach((file, index) => {
  console.log(`\n[${index + 1}/${filesToProcess.length}] Processing ${file}`);
  processFile(file);
});

console.log('\n✅ Migration complete!');

if (!dryRun) {
  console.log('\n📋 Next steps:');
  console.log('1. Review the changes with: git diff');
  console.log('2. Test the application: pnpm run dev');
  console.log('3. Run type checking: pnpm run check');
  console.log('4. Commit when satisfied: git commit -m "refactor: migrate raw buttons to Button component"');
}