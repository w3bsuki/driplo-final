const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing broken import statements...');

// List of files that likely have broken imports based on the fixes
const filesToFix = [
    'src/lib/components/listings/CreateListingForm/steps/ShippingStep.svelte',
    'src/lib/components/onboarding/ProfileSetupWizard.svelte',
    'src/lib/components/brands/BrandOnboardingWizard.svelte',
    'src/lib/components/shared/UnifiedFilter.svelte',
    'src/lib/components/category/CategoryLanding.svelte',
    'src/lib/components/messaging/ConversationList.svelte',
    'src/lib/components/messaging/ConversationListEnhanced.svelte',
    'src/lib/components/messaging/MessageSearch.svelte',
    'src/lib/components/onboarding/WelcomeModal.svelte',
    'src/lib/components/upload/ImageUpload.svelte',
    'src/routes/(auth)/forgot-password/+page.svelte',
    'src/routes/(auth)/register/+page.svelte',
    'src/routes/(auth)/reset-password/+page.svelte'
];

let totalFixed = 0;

for (const filePath of filesToFix) {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`   ⚠️  File not found: ${filePath}`);
        continue;
    }
    
    console.log(`🔧 Processing ${filePath}`);
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Fix broken import paths with ?.
        const fixes = [
            // Remove ?. from .svelte imports
            { 
                pattern: /from\s+['"]([^'"]+)\?\.svelte['"]/g,
                replacement: "from '$1.svelte'"
            },
            // Remove ?. from .ts imports  
            {
                pattern: /from\s+['"]([^'"]+)\?\.svelte\.ts['"]/g,
                replacement: "from '$1.svelte.ts'"
            },
            // Remove ?. from .js imports
            {
                pattern: /from\s+['"]([^'"]+)\?\.js['"]/g,
                replacement: "from '$1.js'"
            },
            // Fix specific patterns like m?.something() back to m.something()
            {
                pattern: /\bm\?\./g,
                replacement: 'm.'
            },
            // Fix specific patterns like console?.error back to console.error
            {
                pattern: /\bconsole\?\./g,
                replacement: 'console.'
            },
            // Fix document?.activeElement back to document.activeElement
            {
                pattern: /\bdocument\?\./g,
                replacement: 'document.'
            },
            // Fix z?.object back to z.object
            {
                pattern: /\bz\?\./g,
                replacement: 'z.'
            },
            // Fix Intl?.NumberFormat back to Intl.NumberFormat
            {
                pattern: /\bIntl\?\./g,
                replacement: 'Intl.'
            }
        ];
        
        for (const fix of fixes) {
            const newContent = content.replace(fix.pattern, fix.replacement);
            if (newContent !== content) {
                console.log(`   ✅ Fixed: ${fix.pattern.source}`);
                content = newContent;
                totalFixed++;
            }
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content);
        }
        
    } catch (err) {
        console.error(`   ❌ Error processing ${filePath}:`, err.message);
    }
}

console.log(`\n🎉 Fixed ${totalFixed} broken import/access patterns`);
console.log('🔍 Running quick type check...');

// Run a quick check to see if we reduced errors
try {
    const result = execSync('timeout 30 npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1 | tail -3', { encoding: 'utf8' });
    console.log(result);
} catch (error) {
    console.log('Type check timed out or failed');
}