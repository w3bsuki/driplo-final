#!/usr/bin/env python3
"""
Detailed debug to find the exact patterns
"""

import re

def find_actual_patterns():
    with open('K:\\driplo.bg-main\\current-typescript-check.txt', 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    print("=== Looking for actual error/warning patterns ===")
    
    # Look for any line containing Error or Warn
    found_patterns = []
    for i, line in enumerate(lines):
        if 'Error' in line or 'Warn' in line:
            # Get context
            start = max(0, i-2)
            end = min(len(lines), i+3)
            context = lines[start:end]
            
            found_patterns.append({
                'line_num': i,
                'context': context
            })
            
            if len(found_patterns) >= 10:  # Get first 10 patterns
                break
    
    for pattern in found_patterns:
        print(f"\n--- Pattern at line {pattern['line_num']} ---")
        for j, line in enumerate(pattern['context']):
            marker = ">>>" if j == 2 else "   "  # Mark the main line
            print(f"{marker} {repr(line.rstrip())}")
    
    # Also check for file path patterns
    print("\n=== File path patterns ===")
    file_patterns = []
    for i, line in enumerate(lines):
        if re.search(r'k:\\.*:\\d+:\\d+', line, re.IGNORECASE):
            file_patterns.append((i, line.strip()))
            if len(file_patterns) >= 5:
                break
    
    for line_num, line in file_patterns:
        print(f"Line {line_num}: {repr(line)}")

find_actual_patterns()