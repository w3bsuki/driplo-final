#!/usr/bin/env node

/**
 * Simple Button Migration Script
 * Migrates the most common button patterns safely
 */

import fs from 'fs';
import path from 'path';

const migrateFile = (filePath) => {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let buttonCount = 0;
  
  // Check if Button is already imported
  const hasButtonImport = content.includes("from '$lib/components/ui/button.svelte'");
  
  // Simple patterns that are safe to migrate
  const patterns = [
    // Pattern 1: Simple onclick with arrow function
    {
      regex: /<button\s+onclick=\{([^}]+)\}\s*class="([^"]*)"\s*>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, onclick, classes, text) => {
        const variant = getVariant(classes);
        const size = getSize(classes);
        const customClasses = cleanClasses(classes);
        
        let props = [];
        if (variant !== 'default') props.push(`variant="${variant}"`);
        if (size !== 'default') props.push(`size="${size}"`);
        if (customClasses) props.push(`class="${customClasses}"`);
        props.push(`onclick={${onclick}}`);
        
        return `<Button ${props.join(' ')}>${text.trim()}</Button>`;
      }
    },
    // Pattern 2: Simple button with just class
    {
      regex: /<button\s+class="([^"]*)"\s*>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, classes, text) => {
        const variant = getVariant(classes);
        const size = getSize(classes);
        const customClasses = cleanClasses(classes);
        
        let props = [];
        if (variant !== 'default') props.push(`variant="${variant}"`);
        if (size !== 'default') props.push(`size="${size}"`);
        if (customClasses) props.push(`class="${customClasses}"`);
        
        return `<Button ${props.join(' ')}>${text.trim()}</Button>`;
      }
    },
    // Pattern 3: Button with type and onclick
    {
      regex: /<button\s+type="button"\s+onclick=\{([^}]+)\}\s*>\s*([^<]+)\s*<\/button>/g,
      replacement: (match, onclick, text) => {
        return `<Button onclick={${onclick}}>${text.trim()}</Button>`;
      }
    }
  ];
  
  function getVariant(classes) {
    if (classes.includes('bg-red-') || classes.includes('destructive')) return 'destructive';
    if (classes.includes('border') && !classes.includes('bg-')) return 'outline';
    if (classes.includes('bg-gray-')) return 'secondary';
    if (classes.includes('hover:bg-') && !classes.includes('bg-')) return 'ghost';
    if (classes.includes('underline')) return 'link';
    return 'default';
  }
  
  function getSize(classes) {
    if (classes.includes('h-8') || classes.includes('text-xs')) return 'sm';
    if (classes.includes('h-12') || classes.includes('text-lg')) return 'lg';
    if (classes.includes('w-10') && classes.includes('h-10')) return 'icon';
    return 'default';
  }
  
  function cleanClasses(classes) {
    return classes
      .replace(/bg-\w+-\d+/g, '')
      .replace(/text-(xs|sm|lg|xl)/g, '')
      .replace(/h-\d+/g, '')
      .replace(/w-\d+/g, '')
      .replace(/px-\d+/g, '')
      .replace(/py-\d+/g, '')
      .replace(/hover:bg-\w+-\d+/g, '')
      .replace(/border(\s|$)/g, '')
      .replace(/rounded(-\w+)?/g, '')
      .replace(/transition(-\w+)?/g, '')
      .replace(/duration-\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Apply patterns
  patterns.forEach(pattern => {
    const matches = [...content.matchAll(pattern.regex)];
    matches.forEach(() => buttonCount++);
    content = content.replace(pattern.regex, pattern.replacement);
  });
  
  if (buttonCount === 0) {
    console.log(`  No simple buttons found`);
    return { modified: false, buttonCount: 0 };
  }
  
  // Add Button import if needed
  if (!hasButtonImport) {
    const scriptMatch = content.match(/<script[^>]*>/);
    if (scriptMatch) {
      const insertPos = scriptMatch.index + scriptMatch[0].length;
      content = content.substring(0, insertPos) + 
                "\n\timport Button from '$lib/components/ui/button.svelte';" +
                content.substring(insertPos);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`  ✅ Migrated ${buttonCount} simple buttons`);
  
  return { modified: true, buttonCount };
};

// Execute
const targetFile = process.argv[2];
if (targetFile) {
  migrateFile(targetFile);
} else {
  console.log('Usage: node scripts/migrate-buttons-simple.js <file-path>');
}