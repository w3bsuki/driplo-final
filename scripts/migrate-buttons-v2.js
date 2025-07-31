#!/usr/bin/env node

/**
 * Robust Button Migration Script v2
 * Migrates raw <button> elements to Button component
 */

import fs from 'fs';
import path from 'path';

const getVariantFromClasses = (classStr) => {
  if (!classStr) return 'default';
  
  // Check for specific variant patterns
  if (classStr.includes('bg-red-') || classStr.includes('bg-error-') || classStr.includes('destructive')) {
    return 'destructive';
  }
  if (classStr.includes('border') && !classStr.includes('bg-') && !classStr.includes('transparent')) {
    return 'outline';
  }
  if (classStr.includes('bg-gray-') && !classStr.includes('bg-gray-900')) {
    return 'secondary';
  }
  if (classStr.includes('hover:bg-') && !classStr.includes('bg-')) {
    return 'ghost';
  }
  if (classStr.includes('underline') || classStr.includes('text-blue-') || classStr.includes('text-brand-')) {
    return 'link';
  }
  
  return 'default';
};

const getSizeFromClasses = (classStr) => {
  if (!classStr) return 'default';
  
  if (classStr.includes('text-xs') || classStr.includes('h-6') || classStr.includes('h-7')) return 'xs';
  if (classStr.includes('h-8') || classStr.includes('h-9')) return 'sm';
  if (classStr.includes('h-12') || classStr.includes('h-14') || classStr.includes('text-lg')) return 'lg';
  if (classStr.includes('w-10') && classStr.includes('h-10')) return 'icon';
  if (classStr.includes('w-8') && classStr.includes('h-8')) return 'icon';
  
  return 'default';
};

const cleanClasses = (classStr) => {
  if (!classStr) return '';
  
  // Remove classes that Button component handles
  const toRemove = [
    // Size related
    /h-\d+/g, /w-\d+/g, /text-(xs|sm|base|lg|xl)/g, /px-\d+/g, /py-\d+/g, /p-\d+/g,
    // Color related  
    /bg-(brand|blue|red|gray|green|yellow|error|success)-\d+/g,
    /hover:bg-[^\s]+/g, /text-(white|black|gray-\d+)/g,
    // Layout
    /inline-flex/g, /flex/g, /items-center/g, /justify-center/g,
    // Style
    /font-medium/g, /font-semibold/g, /rounded(-sm|-md|-lg)?/g,
    /transition(-all|-colors)?/g, /duration-\d+/g,
    // Border
    /border(-\w+)?/g, /border-(transparent|gray-\d+)/g
  ];
  
  let cleaned = classStr;
  toRemove.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned.replace(/\s+/g, ' ').trim();
};

const migrateFile = (filePath) => {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let buttonCount = 0;
  let changes = [];
  
  // Check if Button is already imported
  const hasButtonImport = content.includes("from '$lib/components/ui/button.svelte'");
  
  // Find all button elements with a more precise regex
  const buttonRegex = /<button\s+([^>]*?)>((?:[^<]|<(?!\/button>))*?)<\/button>/gs;
  
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const [fullMatch, attributes, children] = match;
    buttonCount++;
    
    // Parse attributes more carefully
    const attrs = new Map();
    
    // Handle onclick specially - look for the full function
    const onclickMatch = attributes.match(/onclick=\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
    if (onclickMatch) {
      attrs.set('onclick', onclickMatch[1]);
    }
    
    // Handle other attributes
    const attrRegex = /(\w+(?:-\w+)*)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}|([^\s]+))/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributes)) !== null) {
      const key = attrMatch[1];
      const value = attrMatch[2] || attrMatch[3] || attrMatch[4] || attrMatch[5];
      if (key !== 'onclick') { // Don't override onclick
        attrs.set(key, value);
      }
    }
    
    // Handle boolean attributes
    const boolAttrs = attributes.match(/\b(disabled|aria-expanded|aria-selected)\b/g);
    if (boolAttrs) {
      boolAttrs.forEach(attr => {
        if (!attrs.has(attr)) {
          attrs.set(attr, true);
        }
      });
    }
    
    // Determine variant and size
    const classStr = attrs.get('class') || '';
    const variant = getVariantFromClasses(classStr);
    const size = getSizeFromClasses(classStr);
    const customClasses = cleanClasses(classStr);
    
    // Build Button component
    let buttonProps = [];
    
    if (variant !== 'default') buttonProps.push(`variant="${variant}"`);
    if (size !== 'default') buttonProps.push(`size="${size}"`);
    if (customClasses) buttonProps.push(`class="${customClasses}"`);
    
    // Add other props
    for (const [key, value] of attrs) {
      if (key === 'class') continue; // Already handled
      
      if (key === 'onclick') {
        buttonProps.push(`onclick={${value}}`);
      } else if (key === 'type' && value !== 'button') {
        buttonProps.push(`type="${value}"`);
      } else if (key === 'disabled') {
        if (value === true) {
          buttonProps.push('disabled');
        } else {
          buttonProps.push(`disabled={${value}}`);
        }
      } else if (key.startsWith('aria-')) {
        if (value === true) {
          buttonProps.push(key);
        } else {
          buttonProps.push(`${key}="${value}"`);
        }
      }
    }
    
    const propsStr = buttonProps.length > 0 ? ' ' + buttonProps.join(' ') : '';
    const newButton = `<Button${propsStr}>\n\t${children.trim()}\n</Button>`;
    
    changes.push({
      original: fullMatch,
      replacement: newButton,
      position: match.index
    });
  }
  
  if (buttonCount === 0) {
    console.log(`  No buttons found`);
    return { modified: false, buttonCount: 0 };
  }
  
  // Apply changes in reverse order to maintain positions
  changes.reverse().forEach(change => {
    content = content.substring(0, change.position) + 
              change.replacement + 
              content.substring(change.position + change.original.length);
  });
  
  // Add Button import if needed
  if (!hasButtonImport) {
    const scriptMatch = content.match(/<script[^>]*(?:\s+lang="ts")?[^>]*>/);
    if (scriptMatch) {
      const insertPos = scriptMatch.index + scriptMatch[0].length;
      content = content.substring(0, insertPos) + 
                "\n\timport Button from '$lib/components/ui/button.svelte';" +
                content.substring(insertPos);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Migrated ${buttonCount} buttons`);
  
  return { modified: true, buttonCount };
};

// Main execution
const targetFile = process.argv[2];

if (targetFile) {
  const result = migrateFile(targetFile);
  if (!result.modified) {
    console.log('No changes needed.');
  }
} else {
  console.log('Usage: node scripts/migrate-buttons-v2.js <file-path>');
}