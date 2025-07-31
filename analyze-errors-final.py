import re
from collections import defaultdict

errors = defaultdict(list)
warnings = defaultdict(list)

with open('full-typescript-errors.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Check if this line contains a file path
    if 'src\\lib\\' in line or 'src\\routes\\' in line or 'src\\hooks' in line or '.svelte-kit\\' in line:
        # Extract file path and line number
        match = re.search(r'\\(.+?)\[39m:(\d+):(\d+)', line)
        if match:
            file_path = match.group(1).replace('[32m', '').replace('\\', '/')
            line_num = match.group(2)
            
            # Check next line for error/warning
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                
                # Check for Error
                if next_line.startswith('[31mError[39m:'):
                    error_msg = next_line[14:].strip()  # Skip the "[31mError[39m:" part
                    location = f"{file_path}:{line_num}"
                    errors[error_msg].append(location)
                
                # Check for Warning
                elif next_line.startswith('[33mWarn[39m:'):
                    warn_msg = next_line[13:].strip()  # Skip the "[33mWarn[39m:" part
                    location = f"{file_path}:{line_num}"
                    warnings[warn_msg].append(location)
    
    i += 1

# Print markdown report
print('# TypeScript Errors and Warnings - Complete Analysis\n')
print(f'## Summary\n')
print(f'- **Total unique error types:** {len(errors)}')
print(f'- **Total unique warning types:** {len(warnings)}')
print(f'- **Total error occurrences:** {sum(len(v) for v in errors.values())}')
print(f'- **Total warning occurrences:** {sum(len(v) for v in warnings.values())}\n')

# Process errors
if errors:
    print('## TypeScript Errors (by frequency)\n')
    sorted_errors = sorted(errors.items(), key=lambda x: len(x[1]), reverse=True)
    
    for i, (msg, locations) in enumerate(sorted_errors, 1):
        # Clean message
        clean_msg = msg.split(' (ts)')[0].split(' (svelte)')[0].strip()
        print(f'### {i}. {clean_msg}')
        print(f'**Count:** {len(locations)} occurrences\n')
        
        # Group by file
        files = defaultdict(list)
        for loc in locations:
            file_path, line_num = loc.rsplit(':', 1)
            files[file_path].append(line_num)
        
        print('**Locations:**')
        for file_path, line_nums in sorted(files.items()):
            if len(line_nums) > 10:
                print(f'- `{file_path}`: lines {", ".join(line_nums[:10])}, ... ({len(line_nums)} total)')
            else:
                print(f'- `{file_path}`: lines {", ".join(line_nums)}')
        print()

# Process warnings
if warnings:
    print('\n## Accessibility & Svelte Warnings (by frequency)\n')
    sorted_warnings = sorted(warnings.items(), key=lambda x: len(x[1]), reverse=True)
    
    for i, (msg, locations) in enumerate(sorted_warnings, 1):
        # Clean message
        clean_msg = msg.split('https://')[0].strip()
        print(f'### {i}. {clean_msg}')
        print(f'**Count:** {len(locations)} occurrences\n')
        
        # Group by file
        files = defaultdict(list)
        for loc in locations:
            file_path, line_num = loc.rsplit(':', 1)
            files[file_path].append(line_num)
        
        print('**Locations:**')
        for file_path, line_nums in sorted(files.items()):
            if len(line_nums) > 10:
                print(f'- `{file_path}`: lines {", ".join(line_nums[:10])}, ... ({len(line_nums)} total)')
            else:
                print(f'- `{file_path}`: lines {", ".join(line_nums)}')
        print()

# Add file summary
print('\n## Files with Most Issues\n')
file_issues = defaultdict(lambda: {'errors': 0, 'warnings': 0})

for locations in errors.values():
    for loc in locations:
        file_path = loc.rsplit(':', 1)[0]
        file_issues[file_path]['errors'] += 1

for locations in warnings.values():
    for loc in locations:
        file_path = loc.rsplit(':', 1)[0]
        file_issues[file_path]['warnings'] += 1

sorted_files = sorted(file_issues.items(), key=lambda x: x[1]['errors'] + x[1]['warnings'], reverse=True)

print('| File | Errors | Warnings | Total |')
print('|------|--------|----------|-------|')
for file_path, counts in sorted_files[:20]:
    total = counts['errors'] + counts['warnings']
    print(f'| `{file_path}` | {counts["errors"]} | {counts["warnings"]} | {total} |')