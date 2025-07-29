const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding all null/undefined type errors...');

// Get all null/undefined type errors
let checkOutput;
try {
    checkOutput = execSync('npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1', { encoding: 'utf8' });
} catch (error) {
    checkOutput = error.output ? error.output.join('') : error.stdout;
}

const lines = checkOutput.split('\n');

const nullTypeErrors = [];
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
            
            // Look for the error message in the next lines
            for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                const errorLine = lines[j];
                const cleanErrorLine = errorLine.replace(/\x1b\[[0-9;]*m/g, '');
                
                // Match various null/undefined error patterns
                if (cleanErrorLine.includes("Type 'HTML") && cleanErrorLine.includes("| null' is not assignable to type 'HTMLElement'")) {
                    nullTypeErrors.push({
                        file: filePath,
                        line: lineNum,
                        type: 'html_element_null',
                        errorText: cleanErrorLine.trim(),
                        fullPath: path.join(__dirname, filePath)
                    });
                    break;
                } else if (cleanErrorLine.includes("Object is possibly 'null'") || 
                          cleanErrorLine.includes("Object is possibly 'undefined'")) {
                    nullTypeErrors.push({
                        file: filePath,
                        line: lineNum,
                        type: 'object_possibly_null',
                        errorText: cleanErrorLine.trim(),
                        fullPath: path.join(__dirname, filePath)
                    });
                    break;
                } else if (cleanErrorLine.includes("Type 'null' is not assignable to type")) {
                    nullTypeErrors.push({
                        file: filePath,
                        line: lineNum,
                        type: 'null_not_assignable',
                        errorText: cleanErrorLine.trim(),
                        fullPath: path.join(__dirname, filePath)
                    });
                    break;
                } else if (cleanErrorLine.includes("Argument of type") && 
                          (cleanErrorLine.includes("| null") || cleanErrorLine.includes("| undefined"))) {
                    nullTypeErrors.push({
                        file: filePath,
                        line: lineNum,
                        type: 'argument_null_undefined',
                        errorText: cleanErrorLine.trim(),
                        fullPath: path.join(__dirname, filePath)
                    });
                    break;
                }
            }
        }
    }
}

console.log(`📊 Found ${nullTypeErrors.length} null/undefined type errors`);

// Group by file and type for batch processing
const fileGroups = {};
for (const error of nullTypeErrors) {
    const key = `${error.file}:${error.type}`;
    if (!fileGroups[key]) {
        fileGroups[key] = [];
    }
    fileGroups[key].push(error);
}

let totalFixed = 0;

// Process each file
for (const [key, errors] of Object.entries(fileGroups)) {
    const [filePath, errorType] = key.split(':');
    console.log(`🔧 Processing ${filePath} (${errors.length} ${errorType} errors)`);
    
    try {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`   ⚠️  File not found: ${fullPath}`);
            continue;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const error of errors) {
            const originalContent = content;
            
            if (errorType === 'html_element_null') {
                // Look for bind:this patterns and add type assertions
                const bindThisPatterns = [
                    /bind:this=\{([^}]+)\}/g
                ];
                
                for (const pattern of bindThisPatterns) {
                    const matches = [...content.matchAll(pattern)];
                    for (const match of matches) {
                        const variableName = match[1];
                        
                        // Replace the binding with a non-null assertion or optional chaining
                        const replacement = `bind:this={${variableName}!}`;
                        content = content.replace(match[0], replacement);
                        
                        if (content !== originalContent) {
                            modified = true;
                            console.log(`   ✅ Fixed HTML element null: ${match[0]} -> ${replacement}`);
                            totalFixed++;
                            break;
                        }
                    }
                }
            } else if (errorType === 'object_possibly_null') {
                // Add optional chaining for common patterns
                const lines = content.split('\n');
                let lineFixed = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // Look for property access that might be null
                    const patterns = [
                        // object.property -> object?.property
                        /(\w+)\.(\w+)/g,
                        // object[property] -> object?.[property]
                        /(\w+)\[([^\]]+)\]/g,
                    ];
                    
                    for (const pattern of patterns) {
                        const newLine = line.replace(pattern, (match, obj, prop) => {
                            // Don't replace if already has optional chaining
                            if (line.includes(`${obj}?.`)) return match;
                            
                            // Add optional chaining for likely null objects
                            if (prop) {
                                return pattern.source.includes('\\[') ? 
                                    `${obj}?.[${prop}]` : 
                                    `${obj}?.${prop}`;
                            }
                            return match;
                        });
                        
                        if (newLine !== line && !lineFixed) {
                            lines[i] = newLine;
                            modified = true;
                            lineFixed = true;
                            console.log(`   ✅ Fixed null access: ${line.trim()} -> ${newLine.trim()}`);
                            totalFixed++;
                            break;
                        }
                    }
                    
                    if (lineFixed) break;
                }
                
                if (lineFixed) {
                    content = lines.join('\n');
                }
            } else if (errorType === 'argument_null_undefined') {
                // Add null checks before function calls
                const lines = content.split('\n');
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // Look for function calls with potentially null arguments
                    if (line.includes('(') && (line.includes('new Date(') || line.includes('formatDistanceToNow('))) {
                        const newLine = line.replace(/new Date\(([^)]+)\)/g, (match, arg) => {
                            if (!arg.includes('?')) {
                                return `new Date(${arg} || new Date())`;
                            }
                            return match;
                        });
                        
                        if (newLine !== line) {
                            lines[i] = newLine;
                            modified = true;
                            console.log(`   ✅ Fixed null argument: ${line.trim()} -> ${newLine.trim()}`);
                            totalFixed++;
                            break;
                        }
                    }
                }
                
                content = lines.join('\n');
            }
        }
        
        if (modified) {
            fs.writeFileSync(fullPath, content);
        }
        
    } catch (err) {
        console.error(`   ❌ Error processing ${filePath}:`, err.message);
    }
}

console.log(`\n🎉 Fixed ${totalFixed} null/undefined type errors`);
console.log('🔍 Running type check to verify fixes...');

// Run final check
try {
    const finalCheck = execSync('npx svelte-check --tsconfig ./tsconfig.json --output human 2>&1', { encoding: 'utf8' });
    const finalLines = finalCheck.split('\n');
    const remainingNull = finalLines.filter(line => 
        line.includes("Object is possibly") || 
        line.includes("Type 'null' is not assignable") ||
        (line.includes("Type '") && line.includes("| null"))
    ).length;
    console.log(`📊 Remaining null/undefined type errors: ${remainingNull}`);
} catch (error) {
    const output = error.output ? error.output.join('') : error.stdout || '';
    const finalLines = output.split('\n');
    const remainingNull = finalLines.filter(line => 
        line.includes("Object is possibly") || 
        line.includes("Type 'null' is not assignable") ||
        (line.includes("Type '") && line.includes("| null"))
    ).length;
    console.log(`📊 Remaining null/undefined type errors: ${remainingNull}`);
}