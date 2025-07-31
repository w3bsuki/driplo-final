import re
from collections import defaultdict

errors = defaultdict(list)
warnings = defaultdict(list)
current_file = None
current_line = None

with open('full-typescript-errors.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
for i, line in enumerate(lines):
    # Match file paths
    if 'k:\\driplo.bg-main\\' in line:
        match = re.search(r'k:\\driplo.bg-main\\(.+?)\[39m:(\d+):(\d+)', line)
        if match:
            current_file = match.group(1).replace('[32m', '').replace('\\', '/')
            current_line = match.group(2)
    
    # Match errors and warnings
    if '[31mError[39m:' in line:
        error_msg = line.split('[31mError[39m:')[1].strip()
        if current_file:
            errors[error_msg].append(f"{current_file}:{current_line}")
    
    elif '[33mWarn[39m:' in line:
        warn_msg = line.split('[33mWarn[39m:')[1].strip()
        if current_file:
            warnings[warn_msg].append(f"{current_file}:{current_line}")

# Print summary
print('# TypeScript Errors and Warnings Analysis\n')
print(f'**Total unique error types:** {len(errors)}')
print(f'**Total unique warning types:** {len(warnings)}')
print(f'**Total error occurrences:** {sum(len(v) for v in errors.values())}')
print(f'**Total warning occurrences:** {sum(len(v) for v in warnings.values())}\n')

# Sort by frequency
sorted_errors = sorted(errors.items(), key=lambda x: len(x[1]), reverse=True)
sorted_warnings = sorted(warnings.items(), key=lambda x: len(x[1]), reverse=True)

print('## Errors (sorted by frequency)\n')
for i, (msg, locations) in enumerate(sorted_errors):
    print(f'### {i+1}. {msg} ({len(locations)} occurrences)')
    print('**Files affected:**')
    # Show first 10 locations
    for loc in locations[:10]:
        print(f'- {loc}')
    if len(locations) > 10:
        print(f'- ... and {len(locations) - 10} more\n')
    else:
        print()

print('\n## Warnings (sorted by frequency)\n')
for i, (msg, locations) in enumerate(sorted_warnings):
    print(f'### {i+1}. {msg} ({len(locations)} occurrences)')
    print('**Files affected:**')
    # Show first 10 locations
    for loc in locations[:10]:
        print(f'- {loc}')
    if len(locations) > 10:
        print(f'- ... and {len(locations) - 10} more\n')
    else:
        print()