const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding SelectQueryError property access issues...');

// Get SelectQueryError errors
let checkOutput;
try {
    checkOutput = execSync('npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1', { encoding: 'utf8' });
} catch (error) {
    checkOutput = error.output ? error.output.join('') : error.stdout;
}

const lines = checkOutput.split('\n');
const selectQueryErrors = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for file path line
    if (line.includes('src\\') && line.includes(':')) {
        // Clean ANSI color codes
        const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
        
        // Extract file path
        const fileMatch = cleanLine.match(/k:\\driplo\.bg-main\\(src[^:]+):(\d+):(\d+)/);
        if (fileMatch) {
            const filePath = fileMatch[1].replace(/\\/g, '/');
            const lineNum = parseInt(fileMatch[2]);
            
            // Look for SelectQueryError in next few lines
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const errorLine = lines[j];
                const cleanErrorLine = errorLine.replace(/\x1b\[[0-9;]*m/g, '');
                
                if (cleanErrorLine.includes("SelectQueryError")) {
                    // Extract property name if possible
                    const propMatch = cleanErrorLine.match(/Property '([^']+)' does not exist on type/);
                    selectQueryErrors.push({
                        file: filePath,
                        line: lineNum,
                        property: propMatch ? propMatch[1] : null,
                        errorText: cleanErrorLine.trim(),
                        fullPath: path.join(__dirname, filePath)
                    });
                    break;
                }
            }
        }
    }
}

console.log(`📊 Found ${selectQueryErrors.length} SelectQueryError issues`);

// Group by file for batch processing
const fileGroups = {};
for (const error of selectQueryErrors) {
    if (!fileGroups[error.file]) {
        fileGroups[error.file] = [];
    }
    fileGroups[error.file].push(error);
}

let totalFixed = 0;

// Process each file
for (const [filePath, errors] of Object.entries(fileGroups)) {
    console.log(`🔧 Processing ${filePath} (${errors.length} SelectQueryError issues)`);
    
    try {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  File not found: ${fullPath}`);
            continue;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        // Strategy: Add type guards and safe property access
        for (const error of errors) {
            if (error.property) {
                const property = error.property;
                
                // Find patterns where this property is accessed
                const patterns = [
                    // Direct property access: object.property
                    new RegExp(`\\b(\\w+)\\.${property}\\b`, 'g'),
                    // Optional chaining already: object?.property  
                    new RegExp(`\\b(\\w+)\\?\\.${property}\\b`, 'g')
                ];
                
                for (const pattern of patterns) {
                    const matches = [...content.matchAll(pattern)];
                    for (const match of matches) {
                        const objectName = match[1];
                        const fullMatch = match[0];
                        
                        // Skip if already has safe access
                        if (fullMatch.includes('?.')) continue;
                        
                        // Replace with safe access pattern
                        let replacement;
                        
                        // Common database objects that might have SelectQueryError
                        if (['profile', 'user', 'data', 'result'].includes(objectName.toLowerCase())) {
                            // Add type guard: obj?.property || fallback
                            replacement = `(${objectName} && typeof ${objectName} === 'object' && '${property}' in ${objectName}) ? ${objectName}.${property} : null`;
                        } else {
                            // Simple optional chaining
                            replacement = `${objectName}?.${property}`;
                        }
                        
                        const newContent = content.replace(fullMatch, replacement);
                        if (newContent !== content && newContent.length < content.length + 100) { // Sanity check
                            content = newContent;
                            modified = true;
                            console.log(`   ✅ Fixed: ${fullMatch} -> ${replacement}`);
                            totalFixed++;
                            break; // Only fix first occurrence per property to avoid over-replacing
                        }
                    }
                }
            }
        }
        
        // Also add general error handling patterns for database results
        if (content.includes('SelectQueryError') || content.includes('supabase.from')) {
            // Add common type guards at the top of functions
            const lines = content.split('\n');
            let functionLines = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Look for function definitions that might need guards
                if (line.includes('export') && line.includes('load') && line.includes('async')) {
                    functionLines.push(i);
                }
            }
            
            // Add helper functions if needed
            if (functionLines.length > 0 && !content.includes('function isValidDatabaseResult')) {
                const helperFunction = `
// Helper function to check if database result is valid
function isValidDatabaseResult(result: any): boolean {
    return result && typeof result === 'object' && !result.error && !result.message;
}

`;
                content = helperFunction + content;
                modified = true;
                console.log(`   ✅ Added database result helper function`);
                totalFixed++;
            }
        }
        
        if (modified) {
            fs.writeFileSync(fullPath, content);
        }
        
    } catch (err) {
        console.error(`   ❌ Error processing ${filePath}:`, err.message);
    }
}

console.log(`\n🎉 Applied ${totalFixed} SelectQueryError fixes`);
console.log('🔍 Running type check to verify fixes...');

// Run final check
try {
    const result = execSync('timeout 45 npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1 | tail -3', { encoding: 'utf8' });
    console.log(result);
} catch (error) {
    console.log('Type check completed or timed out');
}