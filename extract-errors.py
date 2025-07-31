#!/usr/bin/env python3
import re
import sys

def extract_typescript_errors(input_text):
    """Extract TypeScript errors from svelte-check output"""
    errors = []
    lines = input_text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Look for Error: lines
        if 'Error:' in line and '[31mError[39m:' in line:
            # Extract file path from previous lines
            file_path = ""
            for j in range(max(0, i-5), i):
                if lines[j].strip() and '[32m' in lines[j] and '[39m' in lines[j]:
                    # Extract file path
                    match = re.search(r'\[32m([^[]+)\[39m', lines[j])
                    if match:
                        file_path = match.group(1)
                        break
            
            # Extract error message
            error_match = re.search(r'\[31mError\[39m:\s*(.+)', line)
            if error_match:
                error_msg = error_match.group(1)
                errors.append({
                    'file': file_path,
                    'error': error_msg,
                    'line_content': line
                })
        
        i += 1
    
    return errors

def categorize_errors(errors):
    """Categorize errors by type"""
    categories = {
        'translation_keys': [],
        'database_queries': [],
        'component_props': [],
        'optional_chaining': [],
        'type_assignments': [],
        'other': []
    }
    
    for error in errors:
        error_msg = error['error'].lower()
        
        if "can't be used to index type 'messages'" in error_msg:
            categories['translation_keys'].append(error)
        elif "argument of type" in error_msg and ("not assignable to parameter" in error_msg):
            if "rpc" in error['file'].lower() or "database" in error['file'].lower():
                categories['database_queries'].append(error)
            else:
                categories['component_props'].append(error)
        elif "optional chaining" in error_msg:
            categories['optional_chaining'].append(error)
        elif "not assignable to type" in error_msg:
            categories['type_assignments'].append(error)
        else:
            categories['other'].append(error)
    
    return categories

if __name__ == '__main__':
    # Read from stdin or file
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            content = f.read()
    else:
        content = sys.stdin.read()
    
    errors = extract_typescript_errors(content)
    categories = categorize_errors(errors)
    
    print(f"Found {len(errors)} TypeScript errors\n")
    
    for category, error_list in categories.items():
        if error_list:
            print(f"=== {category.upper().replace('_', ' ')} ({len(error_list)} errors) ===")
            for error in error_list[:5]:  # Show first 5 of each type
                print(f"File: {error['file']}")
                print(f"Error: {error['error'][:100]}...")
                print()
            if len(error_list) > 5:
                print(f"... and {len(error_list) - 5} more\n")
            print()