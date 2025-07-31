#!/usr/bin/env python3
"""
Debug parser to understand the exact format with proper ANSI handling
"""

import re

def debug_file(filename):
    print(f"\n=== Debugging {filename} ===")
    
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    # Look for lines with errors using proper ANSI escape codes
    for i, line in enumerate(lines):
        if '\x1b[31mError\x1b[39m' in line:
            print(f"\nFound error at line {i+1}:")
            print(f"Line {i}: {repr(line.strip())}")
            if i > 0:
                print(f"Line {i-1}: {repr(lines[i-1].strip())}")
            if i < len(lines) - 1:
                print(f"Line {i+1}: {repr(lines[i+1].strip())}")
            return True
    
    # Look for lines with warnings  
    for i, line in enumerate(lines):
        if '\x1b[33mWarn\x1b[39m' in line:
            print(f"\nFound warning at line {i+1}:")
            print(f"Line {i}: {repr(line.strip())}")
            if i > 0:
                print(f"Line {i-1}: {repr(lines[i-1].strip())}")
            if i < len(lines) - 1:
                print(f"Line {i+1}: {repr(lines[i+1].strip())}")
            return True
    
    return False

# Debug the main file
found = debug_file('K:\\driplo.bg-main\\current-typescript-check.txt')

if not found:
    print("Still not found. Let's examine raw bytes:")
    with open('K:\\driplo.bg-main\\current-typescript-check.txt', 'rb') as f:
        content = f.read()
    
    # Look for Error patterns in bytes
    if b'Error' in content:
        print("Found 'Error' in bytes")
        # Find the context
        error_pos = content.find(b'Error')
        start = max(0, error_pos - 100)
        end = min(len(content), error_pos + 100)
        context = content[start:end]
        print(f"Context: {repr(context)}")