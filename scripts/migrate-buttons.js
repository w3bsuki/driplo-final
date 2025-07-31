#!/usr/bin/env node

/**
 * Script to help migrate raw <button> elements to Button component
 * Usage: node scripts/migrate-buttons.js [file-path]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Button variant mapping based on common class patterns
const getVariant = (classes) => {
  if (!classes) return 'default';
  
  if (classes.includes('destructive') || classes.includes('error') || classes.includes('delete') || classes.includes('danger')) {
    return 'destructive';
  }
  if (classes.includes('outline') || classes.includes('border') && !classes.includes('bg-')) {
    return 'outline';
  }
  if (classes.includes('secondary') || classes.includes('gray-100')) {
    return 'secondary';
  }
  if (classes.includes('ghost') || classes.includes('hover:bg-') && !classes.includes('bg-')) {
    return 'ghost';
  }
  if (classes.includes('link') || classes.includes('underline')) {
    return 'link';
  }
  return 'default';
};

// Size mapping based on common patterns
const getSize = (classes) => {
  if (!classes) return 'default';
  
  if (classes.includes('text-xs') || classes.includes('h-6') || classes.includes('h-7')) return 'xs';
  if (classes.includes('text-sm') && (classes.includes('h-8') || classes.includes('h-9'))) return 'sm';
  if (classes.includes('text-lg') || classes.includes('h-12') || classes.includes('h-14')) return 'lg';
  if (classes.includes('h-11')) return 'lg';
  if (classes.includes('w-10') && classes.includes('h-10')) return 'icon';
  if (classes.includes('w-8') && classes.includes('h-8')) return 'icon';
  
  return 'default';
};

// Extract and clean class names
const extractClasses = (classStr) => {
  if (!classStr) return '';
  
  // Remove size/variant related classes that will be handled by the component
  const excludePatterns = [
    /h-\d+/g,
    /text-(xs|sm|base|lg|xl)/g,
    /px-\d+/g,
    /py-\d+/g,
    /p-\d+/g,
    /bg-(brand|gray|error|red|blue|green)-\d+/g,
    /hover:bg-[^\s]+/g,
    /border-(transparent|gray-\d+)/g,
    /inline-flex/g,
    /items-center/g,
    /justify-center/g,
    /font-medium/g,
    /transition-[^\s]+/g,
    /duration-\d+/g,
    /rounded(-sm|-md|-lg)?/g,
  ];
  
  let cleaned = classStr;
  excludePatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Clean up multiple spaces
  return cleaned.replace(/\s+/g, ' ').trim();
};

const migrateFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let buttonCount = 0;
  
  // Check if Button is already imported
  const hasButtonImport = content.includes("from '$lib/components/ui/button.svelte'") ||
                         content.includes('from "$lib/components/ui/button.svelte"');
  
  // More sophisticated pattern to match button elements with proper attribute handling
  const buttonPattern = /<button\s+([\s\S]*?)>([\s\S]*?)<\/button>/g;
  
  const replacer = (match, attributes, children) => {
    buttonCount++;
    
    // Parse attributes more carefully
    const attrs = {};
    
    // Handle onclick={...} patterns specially
    const onclickMatch = attributes.match(/onclick=\{([^}]+)\}/);
    if (onclickMatch) {
      attrs.onclick = onclickMatch[1];
      attributes = attributes.replace(onclickMatch[0], '');
    }
    
    // Handle other event handlers
    const eventHandlers = ['onmouseenter', 'onmouseleave', 'onfocus', 'onblur'];
    eventHandlers.forEach(handler => {
      const handlerMatch = attributes.match(new RegExp(`${handler}=\\{([^}]+)\\}`));
      if (handlerMatch) {
        attrs[handler] = handlerMatch[1];
        attributes = attributes.replace(handlerMatch[0], '');
      }
    });
    
    // Parse remaining attributes
    const attrPattern = /(\w+[-\w]*)(?:=(?:"([^"]*)"|'([^']*)'|{([^}]*)}|([^"\s]+)))?/g;
    let attrMatch;
    
    while ((attrMatch = attrPattern.exec(attributes))) {
      const key = attrMatch[1];
      const value = attrMatch[2] || attrMatch[3] || attrMatch[4] || attrMatch[5] || true;
      if (!attrs[key]) { // Don't override already parsed event handlers
        attrs[key] = value;
      }
    }
    
    // Extract variant and size
    const variant = getVariant(attrs.class);
    const size = getSize(attrs.class);
    const customClasses = extractClasses(attrs.class);
    
    // Build new Button component
    let buttonTag = '<Button';
    
    // Add variant if not default
    if (variant !== 'default') {
      buttonTag += ` variant="${variant}"`;
    }
    
    // Add size if not default
    if (size !== 'default') {
      buttonTag += ` size="${size}"`;
    }
    
    // Add custom classes if any remain
    if (customClasses) {
      buttonTag += ` class="${customClasses}"`;
    }
    
    // Add other attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') return; // Already handled
      
      if (key === 'onclick' || eventHandlers.includes(key)) {
        buttonTag += ` ${key}={${value}}`;
      } else if (key === 'type' && value !== 'button') {
        buttonTag += ` ${key}="${value}"`;
      } else if (key === 'disabled' || key.startsWith('aria-')) {
        if (value === true) {
          buttonTag += ` ${key}`;
        } else {
          buttonTag += ` ${key}={${value}}`;
        }
      }
    });
    
    buttonTag += '>';
    
    // Close the button
    return `${buttonTag}\n\t${children.trim()}\n</Button>`;
  };
  
  // Replace all button instances
  let newContent = content.replace(buttonPattern, replacer);
  
  if (buttonCount > 0) {
    modified = true;
    
    // Add import if not present
    if (!hasButtonImport) {
      // Find script tag
      const scriptMatch = newContent.match(/<script[^>]*>/);
      if (scriptMatch) {
        const scriptEnd = scriptMatch.index + scriptMatch[0].length;
        newContent = newContent.slice(0, scriptEnd) + 
          "\n\timport Button from '$lib/components/ui/button.svelte';" +
          newContent.slice(scriptEnd);
      }
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Migrated ${buttonCount} buttons in ${path.basename(filePath)}`);
  }
  
  return { modified, buttonCount };
};

// Main execution
const targetFile = process.argv[2];

if (targetFile) {
  // Single file mode
  const result = migrateFile(targetFile);
  if (!result.modified) {
    console.log('No buttons to migrate in this file.');
  }
} else {
  // Batch mode - show files that need migration
  console.log('No file specified. Run with a file path to migrate:');
  console.log('node scripts/migrate-buttons.js path/to/file.svelte');
  console.log('\nOr use the batch migration script (migrate-buttons-batch.js)');
}