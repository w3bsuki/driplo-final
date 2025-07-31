#!/usr/bin/env python3
"""
Debug parser to understand the exact format
"""

import re

def debug_file(filename):
    print(f"\n=== Debugging {filename} ===")
    
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Look for lines with errors
    for i, line in enumerate(lines):
        if '[31mError[39m' in line:
            print(f"\nFound error at line {i+1}:")
            print(f"Line {i}: {repr(line.strip())}")
            if i > 0:
                print(f"Line {i-1}: {repr(lines[i-1].strip())}")
            if i < len(lines) - 1:
                print(f"Line {i+1}: {repr(lines[i+1].strip())}")
            break
    
    # Look for lines with warnings  
    for i, line in enumerate(lines):
        if '[33mWarn[39m' in line:
            print(f"\nFound warning at line {i+1}:")
            print(f"Line {i}: {repr(line.strip())}")
            if i > 0:
                print(f"Line {i-1}: {repr(lines[i-1].strip())}")
            if i < len(lines) - 1:
                print(f"Line {i+1}: {repr(lines[i+1].strip())}")
            break
    
    # Look for file path patterns
    file_pattern = re.compile(r'[kK]:[^:]+:\d+:\d+')
    for i, line in enumerate(lines):
        if file_pattern.search(line):
            print(f"\nFound file pattern at line {i+1}:")
            print(f"Line {i}: {repr(line.strip())}")
            if i < len(lines) - 1:
                next_line = lines[i+1].strip()
                if '[31mError[39m' in next_line or '[33mWarn[39m' in next_line:
                    print(f"Line {i+1}: {repr(next_line)}")
                    return True
            break
    
    return False

# Debug the main file
found = debug_file('K:\\driplo.bg-main\\current-typescript-check.txt')

if not found:
    print("\nNo errors found, let's look for raw patterns:")
    with open('K:\\driplo.bg-main\\current-typescript-check.txt', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Look for any error-like patterns
    if 'Error' in content:
        lines = content.split('\n')
        for i, line in enumerate(lines[:100]):  # First 100 lines
            if 'Error' in line:
                print(f"Line {i}: {repr(line)}")