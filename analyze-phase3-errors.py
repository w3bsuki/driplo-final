#!/usr/bin/env python3

import re
import json
from collections import defaultdict

def analyze_type_errors():
    errors = defaultdict(list)
    
    # Read the full TypeScript error output
    with open('current-typescript-errors.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match type assignment errors
    patterns = {
        'string_undefined': r"Type 'string \| undefined' is not assignable to type 'string'",
        'null_string': r"Type 'null' is not assignable to type 'string'",
        'string_null': r"Type 'string \| null' is not assignable to type 'string'",
        'arg_string_undefined': r"Argument of type 'string \| undefined' is not assignable to parameter of type 'string'",
        'arg_string_null': r"Argument of type 'string \| null' is not assignable to parameter of type 'string'",
        'array_type': r"Type '.*\[\]' is not assignable to type '.*\[\]'",
        'other_type': r"Type '.*' is not assignable to type '.*'"
    }
    
    # Extract file paths and line numbers for each error type
    lines = content.split('\n')
    current_file = None
    
    for i, line in enumerate(lines):
        # Check if this is a file path line
        if '\x1b[32m' in line and '\x1b[39m' in line:
            match = re.search(r'\x1b\[32m(.+?)\x1b\[39m:(\d+):(\d+)', line)
            if match:
                current_file = match.group(1)
                line_num = match.group(2)
                col_num = match.group(3)
                
                # Look for error message in next few lines
                for j in range(i+1, min(i+10, len(lines))):
                    if '\x1b[31mError\x1b[39m:' in lines[j]:
                        error_msg = lines[j].replace('\x1b[31mError\x1b[39m:', '').strip()
                        
                        # Categorize the error
                        for error_type, pattern in patterns.items():
                            if re.search(pattern, error_msg):
                                errors[error_type].append({
                                    'file': current_file,
                                    'line': line_num,
                                    'column': col_num,
                                    'message': error_msg
                                })
                                break
                        break
    
    # Count errors by type
    summary = {}
    for error_type, error_list in errors.items():
        summary[error_type] = {
            'count': len(error_list),
            'files': list(set(e['file'] for e in error_list))
        }
    
    # Write detailed results
    with open('phase3-type-errors.json', 'w') as f:
        json.dump({
            'summary': summary,
            'errors': errors
        }, f, indent=2)
    
    # Print summary
    print("=== PHASE 3: TYPE ASSIGNMENT ERRORS ANALYSIS ===\n")
    total = 0
    for error_type, info in summary.items():
        print(f"{error_type}: {info['count']} errors in {len(info['files'])} files")
        total += info['count']
    
    print(f"\nTOTAL: {total} type assignment errors")
    
    # Print detailed breakdown by error type
    print("\n=== DETAILED BREAKDOWN ===\n")
    
    # Group by file for easier fixing
    files_to_fix = defaultdict(list)
    for error_type, error_list in errors.items():
        for error in error_list:
            files_to_fix[error['file']].append({
                'type': error_type,
                'line': error['line'],
                'message': error['message']
            })
    
    # Sort files by error count
    sorted_files = sorted(files_to_fix.items(), key=lambda x: len(x[1]), reverse=True)
    
    print("Files to fix (sorted by error count):")
    for file, file_errors in sorted_files[:20]:  # Top 20 files
        print(f"\n{file}: {len(file_errors)} errors")
        # Group errors by type
        type_counts = defaultdict(int)
        for e in file_errors:
            type_counts[e['type']] += 1
        for etype, count in type_counts.items():
            print(f"  - {etype}: {count}")

if __name__ == '__main__':
    analyze_type_errors()