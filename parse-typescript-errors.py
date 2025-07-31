import re
from collections import defaultdict

# Read the file
with open('full-typescript-errors.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove ANSI escape sequences
ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
content_clean = ansi_escape.sub('', content)

# Split into lines
lines = content_clean.split('\n')

# Storage for errors and warnings
errors = defaultdict(list)
warnings = defaultdict(list)

# Parse line by line
i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Look for file paths
    if 'k:\\driplo.bg-main\\' in line:
        # Extract file path and line number
        match = re.search(r'k:\\driplo.bg-main\\(.+?):(\d+):(\d+)', line)
        if match:
            file_path = match.group(1).replace('\\', '/')
            line_num = match.group(2)
            col_num = match.group(3)
            
            # Check next line for error/warning
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                
                if next_line.startswith('Error:'):
                    error_msg = next_line[6:].strip()
                    errors[error_msg].append(f"{file_path}:{line_num}:{col_num}")
                elif next_line.startswith('Warn:'):
                    warn_msg = next_line[5:].strip()
                    warnings[warn_msg].append(f"{file_path}:{line_num}:{col_num}")
    
    i += 1

# Generate report
print('# TypeScript Errors and Warnings - Complete Analysis\n')
print('## Summary\n')
print(f'- **Total unique error types:** {len(errors)}')
print(f'- **Total unique warning types:** {len(warnings)}')
print(f'- **Total error occurrences:** {sum(len(v) for v in errors.values())}')
print(f'- **Total warning occurrences:** {sum(len(v) for v in warnings.values())}\n')

# TypeScript Errors
if errors:
    print('## TypeScript Errors\n')
    sorted_errors = sorted(errors.items(), key=lambda x: len(x[1]), reverse=True)
    
    for i, (msg, locations) in enumerate(sorted_errors, 1):
        # Clean up message
        clean_msg = msg.split(' (ts)')[0].split(' (svelte)')[0].strip()
        if 'https://' in clean_msg:
            clean_msg = clean_msg.split('https://')[0].strip()
        
        print(f'### {i}. {clean_msg}')
        print(f'**Count:** {len(locations)} occurrences\n')
        
        # Group by file
        files_dict = defaultdict(list)
        for loc in locations:
            parts = loc.rsplit(':', 2)
            if len(parts) >= 3:
                file_path = parts[0]
                line_num = parts[1]
                files_dict[file_path].append(line_num)
        
        print('**Affected files:**')
        for file_path, line_nums in sorted(files_dict.items()):
            unique_lines = sorted(set(line_nums), key=int)
            if len(unique_lines) > 10:
                print(f'- `{file_path}`: lines {", ".join(unique_lines[:10])}, ... ({len(unique_lines)} total)')
            else:
                print(f'- `{file_path}`: lines {", ".join(unique_lines)}')
        print()

# Warnings
if warnings:
    print('\n## Warnings (Accessibility & Code Quality)\n')
    sorted_warnings = sorted(warnings.items(), key=lambda x: len(x[1]), reverse=True)
    
    for i, (msg, locations) in enumerate(sorted_warnings, 1):
        # Clean up message
        clean_msg = msg.split(' (ts)')[0].split(' (svelte)')[0].strip()
        if 'https://' in clean_msg:
            clean_msg = clean_msg.split('https://')[0].strip()
        
        print(f'### {i}. {clean_msg}')
        print(f'**Count:** {len(locations)} occurrences\n')
        
        # Group by file
        files_dict = defaultdict(list)
        for loc in locations:
            parts = loc.rsplit(':', 2)
            if len(parts) >= 3:
                file_path = parts[0]
                line_num = parts[1]
                files_dict[file_path].append(line_num)
        
        print('**Affected files:**')
        for file_path, line_nums in sorted(files_dict.items()):
            unique_lines = sorted(set(line_nums), key=int)
            if len(unique_lines) > 10:
                print(f'- `{file_path}`: lines {", ".join(unique_lines[:10])}, ... ({len(unique_lines)} total)')
            else:
                print(f'- `{file_path}`: lines {", ".join(unique_lines)}')
        print()

# File summary
print('\n## Files with Most Issues\n')
file_counts = defaultdict(lambda: {'errors': 0, 'warnings': 0})

for locations in errors.values():
    for loc in locations:
        file_path = loc.rsplit(':', 2)[0]
        file_counts[file_path]['errors'] += 1

for locations in warnings.values():
    for loc in locations:
        file_path = loc.rsplit(':', 2)[0]
        file_counts[file_path]['warnings'] += 1

sorted_files = sorted(file_counts.items(), key=lambda x: x[1]['errors'] + x[1]['warnings'], reverse=True)

print('| File | Errors | Warnings | Total |')
print('|------|--------|----------|-------|')
for file_path, counts in sorted_files[:30]:
    total = counts['errors'] + counts['warnings']
    print(f'| `{file_path}` | {counts["errors"]} | {counts["warnings"]} | {total} |')