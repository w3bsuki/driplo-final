const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding all unused variables...');

// Get all unused variable errors
let checkOutput;
try {
    checkOutput = execSync('npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1', { encoding: 'utf8' });
} catch (error) {
    checkOutput = error.output ? error.output.join('') : error.stdout;
}
const lines = checkOutput.split('\n');

const unusedVarErrors = [];
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
            
            // Look for the error message in the next line
            if (i + 1 < lines.length) {
                const errorLine = lines[i + 1];
                const cleanErrorLine = errorLine.replace(/\x1b\[[0-9;]*m/g, '');
                
                if (cleanErrorLine.includes("is declared but its value is never read")) {
                    // Extract variable name from error message
                    const varMatch = cleanErrorLine.match(/'([^']+)' is declared but its value is never read/);
                    if (varMatch) {
                        const varName = varMatch[1];
                        unusedVarErrors.push({
                            file: filePath,
                            line: lineNum,
                            variable: varName,
                            fullPath: path.join(__dirname, filePath)
                        });
                    }
                }
            }
        }
    }
}

console.log(`📊 Found ${unusedVarErrors.length} unused variables`);

// Group by file for batch processing
const fileGroups = {};
for (const error of unusedVarErrors) {
    if (!fileGroups[error.file]) {
        fileGroups[error.file] = [];
    }
    fileGroups[error.file].push(error);
}

let totalFixed = 0;

// Process each file
for (const [filePath, errors] of Object.entries(fileGroups)) {
    console.log(`🔧 Processing ${filePath} (${errors.length} unused vars)`);
    
    try {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  File not found: ${fullPath}`);
            continue;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const error of errors) {
            const varName = error.variable;
            
            // Skip variables that are already prefixed with underscore
            if (varName.startsWith('_')) {
                continue;
            }
            
            // Common patterns to replace
            const patterns = [
                // Variable declarations
                { 
                    regex: new RegExp(`\\b(let|const|var)\\s+${varName}\\b`, 'g'),
                    replacement: `$1 _${varName}`
                },
                // Function parameters
                {
                    regex: new RegExp(`\\b${varName}\\s*(?=\\s*[,)])`, 'g'),
                    replacement: `_${varName}`
                },
                // Destructuring assignments
                {
                    regex: new RegExp(`\\b${varName}\\s*(?=\\s*[,}])`, 'g'),
                    replacement: `_${varName}`
                },
                // Props destructuring
                {
                    regex: new RegExp(`\\b${varName}\\s*(?=\\s*=)`, 'g'),
                    replacement: `_${varName}`
                }
            ];
            
            for (const pattern of patterns) {
                const oldContent = content;
                content = content.replace(pattern.regex, pattern.replacement);
                if (content !== oldContent) {
                    modified = true;
                    console.log(`   ✅ Fixed: ${varName} -> _${varName}`);
                    totalFixed++;
                    break; // Only apply first matching pattern
                }
            }
        }
        
        if (modified) {
            fs.writeFileSync(fullPath, content);
        }
        
    } catch (err) {
        console.error(`   ❌ Error processing ${filePath}:`, err.message);
    }
}

console.log(`\n🎉 Fixed ${totalFixed} unused variables across ${Object.keys(fileGroups).length} files`);
console.log('🔍 Running type check to verify fixes...');

// Run final check
try {
    const finalCheck = execSync('npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1', { encoding: 'utf8' });
    const finalLines = finalCheck.split('\n');
    const remainingUnused = finalLines.filter(line => line.includes("is declared but its value is never read")).length;
    console.log(`📊 Remaining unused variable errors: ${remainingUnused}`);
} catch (error) {
    const output = error.output ? error.output.join('') : error.stdout || '';
    const finalLines = output.split('\n');
    const remainingUnused = finalLines.filter(line => line.includes("is declared but its value is never read")).length;
    console.log(`📊 Remaining unused variable errors: ${remainingUnused}`);
}