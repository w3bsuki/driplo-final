#!/usr/bin/env node

/**
 * Batch migrate all button files
 */

import { execSync } from 'child_process';

// High-priority files to migrate first (most buttons)
const files = [
  'src/lib/components/shared/UnifiedFilter.svelte',
  'src/routes/(app)/listings/[id]/+page.svelte', 
  'src/lib/components/shared/CategoryDropdownFixed.svelte',
  'src/routes/(app)/browse/+page.svelte',
  'src/lib/components/shared/UnifiedSearch.svelte',
  'src/lib/components/home/HeroSearch.svelte',
  'src/lib/components/home/HeroSearchFixed.svelte',
  'src/lib/components/checkout/checkout-modal/PaymentSelector.svelte',
  'src/lib/components/listings/ListingGrid.svelte',
  'src/lib/components/home/TopSellersWithModal.svelte'
];

console.log('🚀 Batch Button Migration');
console.log(`Migrating ${files.length} high-priority files...\n`);

let totalMigrated = 0;
let successful = 0;

files.forEach((file, index) => {
  try {
    console.log(`[${index + 1}/${files.length}] ${file}`);
    
    // Use the v2 script but capture errors
    const result = execSync(`node scripts/migrate-buttons-v2.js "${file}"`, {
      encoding: 'utf8',
      timeout: 30000
    });
    
    console.log(result);
    successful++;
    
    // Extract button count from output
    const match = result.match(/Migrated (\d+) buttons/);
    if (match) {
      totalMigrated += parseInt(match[1]);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('Skipping this file...');
  }
  
  console.log('---');
});

console.log(`\n✅ Batch migration complete!`);
console.log(`Successfully processed: ${successful}/${files.length} files`);
console.log(`Total buttons migrated: ${totalMigrated}`);
console.log(`\nNext steps:`);
console.log(`1. git diff - Review changes`);
console.log(`2. pnpm run check - Verify TypeScript`);  
console.log(`3. Manual fixes for any broken files`);
console.log(`4. git commit - Save progress`);