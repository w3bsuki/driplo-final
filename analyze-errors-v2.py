import re
from collections import defaultdict

errors = defaultdict(list)
warnings = defaultdict(list)
current_file = None
current_line = None

with open('full-typescript-errors.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by line but keep line breaks
lines = content.split('\n')

i = 0
while i < len(lines):
    line = lines[i]
    
    # Match file paths
    if 'k:\\driplo.bg-main\\' in line:
        match = re.search(r'k:\\driplo.bg-main\\(.+?)\[39m:(\d+):(\d+)', line)
        if match:
            current_file = match.group(1).replace('[32m', '').replace('\\', '/')
            current_line = match.group(2)
            
            # Check next line for error/warning
            if i + 1 < len(lines):
                next_line = lines[i + 1]
                
                if '[31mError[39m:' in next_line:
                    error_msg = next_line.split('[31mError[39m:')[1].strip()
                    errors[error_msg].append(f"{current_file}:{current_line}")
                
                elif '[33mWarn[39m:' in next_line:
                    warn_msg = next_line.split('[33mWarn[39m:')[1].strip()
                    warnings[warn_msg].append(f"{current_file}:{current_line}")
    
    i += 1

# Print markdown output
print('# TypeScript Errors and Warnings Analysis\n')
print(f'**Total unique error types:** {len(errors)}')
print(f'**Total unique warning types:** {len(warnings)}')
print(f'**Total error occurrences:** {sum(len(v) for v in errors.values())}')
print(f'**Total warning occurrences:** {sum(len(v) for v in warnings.values())}\n')

# Sort by frequency
sorted_errors = sorted(errors.items(), key=lambda x: len(x[1]), reverse=True)
sorted_warnings = sorted(warnings.items(), key=lambda x: len(x[1]), reverse=True)

print('## Errors by Type (sorted by frequency)\n')
for i, (msg, locations) in enumerate(sorted_errors):
    # Clean up the message
    clean_msg = msg.split(' (ts)')[0].split(' (svelte)')[0]
    print(f'### {i+1}. {clean_msg} ({len(locations)} occurrences)\n')
    
    # Group by file
    files = defaultdict(list)
    for loc in locations:
        file_path, line_num = loc.rsplit(':', 1)
        files[file_path].append(line_num)
    
    print('**Files affected:**')
    for file_path, line_nums in sorted(files.items()):
        if len(line_nums) > 5:
            print(f'- `{file_path}`: lines {", ".join(line_nums[:5])}, ... ({len(line_nums)} total)')
        else:
            print(f'- `{file_path}`: lines {", ".join(line_nums)}')
    print()

print('\n## Warnings by Type (sorted by frequency)\n')
for i, (msg, locations) in enumerate(sorted_warnings):
    # Clean up the message
    clean_msg = msg.split(' (ts)')[0].split(' (svelte)')[0]
    print(f'### {i+1}. {clean_msg} ({len(locations)} occurrences)\n')
    
    # Group by file
    files = defaultdict(list)
    for loc in locations:
        file_path, line_num = loc.rsplit(':', 1)
        files[file_path].append(line_num)
    
    print('**Files affected:**')
    for file_path, line_nums in sorted(files.items()):
        if len(line_nums) > 5:
            print(f'- `{file_path}`: lines {", ".join(line_nums[:5])}, ... ({len(line_nums)} total)')
        else:
            print(f'- `{file_path}`: lines {", ".join(line_nums)}')
    print()