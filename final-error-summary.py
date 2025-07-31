#!/usr/bin/env python3
"""
Final TypeScript Error Analysis and Report Generation (ASCII version)
Creates a clean comprehensive report of all TypeScript errors
"""

import re
import os
import json
from collections import defaultdict, Counter
from pathlib import Path

def clean_ansi_codes(text: str) -> str:
    """Remove ANSI color codes from text"""
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    color_codes = re.compile(r'\[3[0-9]m|\[39m')
    text = ansi_escape.sub('', text)
    text = color_codes.sub('', text)
    return text

def main():
    project_root = Path("K:/driplo.bg-main")
    
    # Load the generated analysis
    analysis_file = project_root / "typescript_errors_complete_analysis.json"
    
    if not analysis_file.exists():
        print("Analysis file not found. Run the analysis script first.")
        return
    
    with open(analysis_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create clean report
    print("="*80)
    print("COMPREHENSIVE TYPESCRIPT ERROR ANALYSIS REPORT")
    print("DRIPLO.BG MARKETPLACE - FINAL ERROR BREAKDOWN")
    print("="*80)
    
    summary = data['summary']
    print(f"\nEXECUTIVE SUMMARY:")
    print(f"- Total unique TypeScript errors: {summary['total_unique_errors']}")
    print(f"- Files affected: {summary['files_with_errors']}")
    print(f"- Error log files analyzed: {summary['error_files_analyzed']}")
    
    # Category breakdown with priorities
    print(f"\nERROR BREAKDOWN BY CATEGORY:")
    category_priorities = {
        'translation_keys': ('CRITICAL', 'Missing translation keys - breaks i18n'),
        'function_arguments': ('CRITICAL', 'Function argument mismatches - runtime errors'),
        'property_access': ('HIGH', 'Property access errors - potential runtime crashes'),
        'null_safety': ('HIGH', 'Null safety issues - potential runtime crashes'),
        'type_assignment': ('MEDIUM', 'Type mismatches - type safety issues'),
        'import_module': ('MEDIUM', 'Import/module resolution issues'),
        'svelte_props': ('MEDIUM', 'Component prop type mismatches'),
        'unused_variables': ('LOW', 'Code cleanup - unused variables/imports'),
        'return_paths': ('MEDIUM', 'Missing return statements'),
        'optional_chaining': ('MEDIUM', 'Optional chaining syntax issues'),
        'construct_signatures': ('MEDIUM', 'Constructor usage errors'),
        'other': ('REVIEW', 'Uncategorized errors requiring review')
    }
    
    total_errors = summary['total_unique_errors']
    for category, count in sorted(data['category_breakdown'].items(), key=lambda x: x[1], reverse=True):
        priority, description = category_priorities.get(category, ('REVIEW', 'Unknown category'))
        percentage = (count / total_errors) * 100
        print(f"   [{priority:8}] {category.replace('_', ' ').title():20} | {count:3d} errors ({percentage:5.1f}%) | {description}")
    
    # Top problematic files
    print(f"\nTOP 20 MOST PROBLEMATIC FILES:")
    for i, (file_path_raw, error_count) in enumerate(data['top_20_files_by_errors'], 1):
        # Clean the file path
        file_path = clean_ansi_codes(file_path_raw).strip()
        if file_path.startswith('\x1b'):  # Additional cleanup
            file_path = file_path[5:]  # Remove remaining escape sequences
        print(f"   {i:2d}. {file_path:60} ({error_count:2d} errors)")
    
    # Extension analysis
    print(f"\nERRORS BY FILE TYPE:")
    for ext, count in sorted(data['file_extension_breakdown'].items(), key=lambda x: x[1], reverse=True):
        print(f"   {ext or '(no extension)':15} {count:3d} errors")
    
    # Most frequent patterns
    print(f"\nTOP 10 ERROR PATTERNS (generalized):")
    for i, (pattern, count) in enumerate(data['most_frequent_patterns'][:10], 1):
        clean_pattern = pattern.replace('IDENTIFIER', '[ID]').replace('STRING', '[STR]').replace('NUMBER', '[NUM]')
        print(f"   {i:2d}. ({count:2d}x) {clean_pattern[:70]}{'...' if len(clean_pattern) > 70 else ''}")
    
    # Priority action items
    print(f"\nPRIORITY ACTION ITEMS:")
    print(f"\nCRITICAL (Fix First):")
    critical_count = data['category_breakdown'].get('translation_keys', 0) + data['category_breakdown'].get('function_arguments', 0)
    print(f"   - Fix {data['category_breakdown'].get('translation_keys', 0)} missing translation keys")
    print(f"   - Fix {data['category_breakdown'].get('function_arguments', 0)} function argument errors")
    print(f"   Total: {critical_count} errors")
    
    print(f"\nHIGH PRIORITY (Fix Next):")
    high_count = data['category_breakdown'].get('property_access', 0) + data['category_breakdown'].get('null_safety', 0)
    print(f"   - Fix {data['category_breakdown'].get('property_access', 0)} property access errors") 
    print(f"   - Fix {data['category_breakdown'].get('null_safety', 0)} null safety issues")
    print(f"   Total: {high_count} errors")
    
    print(f"\nMEDIUM PRIORITY:")
    medium_categories = ['type_assignment', 'import_module', 'svelte_props', 'return_paths', 'optional_chaining', 'construct_signatures']
    medium_count = sum(data['category_breakdown'].get(cat, 0) for cat in medium_categories)
    print(f"   - Type assignments, imports, component props, etc.")
    print(f"   Total: {medium_count} errors")
    
    print(f"\nLOW PRIORITY (Cleanup):")
    low_count = data['category_breakdown'].get('unused_variables', 0)
    print(f"   - Remove {low_count} unused variables/imports")
    
    other_count = data['category_breakdown'].get('other', 0)
    print(f"\nREQUIRES REVIEW:")
    print(f"   - {other_count} unategorized errors need manual review")
    
    # File-specific recommendations
    print(f"\nTOP 5 FILES TO FIX FIRST:")
    
    # Get detailed errors for top files
    detailed_errors = data.get('detailed_file_errors', {})
    top_files = data['top_20_files_by_errors'][:5]
    
    for i, (file_path_raw, error_count) in enumerate(top_files, 1):
        file_path = clean_ansi_codes(file_path_raw).strip()
        if file_path.startswith('\x1b'):
            file_path = file_path[5:]
        
        print(f"\n{i}. {file_path} ({error_count} errors)")
        
        # Get errors for this file
        file_errors = detailed_errors.get(file_path_raw, [])
        if not file_errors:
            # Try without ANSI codes
            file_errors = detailed_errors.get(file_path, [])
        
        # Group by category
        categories = defaultdict(list)
        for error in file_errors:
            categories[error['category']].append(error)
        
        for category, errors in sorted(categories.items(), key=lambda x: len(x[1]), reverse=True):
            priority, _ = category_priorities.get(category, ('REVIEW', ''))
            print(f"   [{priority:8}] {category.replace('_', ' ').title()}: {len(errors)} errors")
            
            # Show first 2 specific errors
            for error in errors[:2]:
                print(f"     Line {error['line']:3d}: {error['message'][:60]}{'...' if len(error['message']) > 60 else ''}")
            
            if len(errors) > 2:
                print(f"     ... and {len(errors) - 2} more")
    
    print(f"\n" + "="*80)
    print("SYSTEMATIC FIX STRATEGY RECOMMENDATIONS:")
    print("="*80)
    
    print(f"\nPhase 1: Critical Runtime Issues ({critical_count} errors)")
    print(f"  1. Fix all translation key errors - likely missing imports or incorrect keys")
    print(f"  2. Fix function argument mismatches - check API signatures")
    
    print(f"\nPhase 2: Type Safety Issues ({high_count} errors)")
    print(f"  3. Add null checks and optional chaining where needed")
    print(f"  4. Fix property access errors - check type definitions")
    
    print(f"\nPhase 3: Code Quality ({medium_count} errors)")
    print(f"  5. Fix type assignments and component prop types")
    print(f"  6. Resolve import/module issues")
    print(f"  7. Add missing return statements")
    
    print(f"\nPhase 4: Cleanup ({low_count} errors)")
    print(f"  8. Remove unused variables and imports")
    
    print(f"\nReview Phase: Manual Investigation ({other_count} errors)")
    print(f"  9. Manually review and categorize remaining errors")
    
    print(f"\nTotal estimated effort: {total_errors} errors across {summary['files_with_errors']} files")
    print(f"Recommended approach: Fix by priority, test incrementally")
    
    # Generate specific file lists for systematic fixes
    print(f"\n" + "="*80)
    print("FILES BY ERROR CATEGORY (for systematic fixes):")
    print("="*80)
    
    # Organize files by dominant error type
    file_categories = defaultdict(list)
    detailed_errors = data.get('detailed_file_errors', {})
    
    for raw_file_path, errors in detailed_errors.items():
        clean_file_path = clean_ansi_codes(raw_file_path).strip()
        if clean_file_path.startswith('\x1b'):
            clean_file_path = clean_file_path[5:]
        
        # Count errors by category for this file
        cat_counts = defaultdict(int)
        for error in errors:
            cat_counts[error['category']] += 1
        
        # Find dominant category
        if cat_counts:
            dominant_category = max(cat_counts.items(), key=lambda x: x[1])
            file_categories[dominant_category[0]].append((clean_file_path, len(errors), dominant_category[1]))
    
    # Print files by category
    priority_order = ['translation_keys', 'function_arguments', 'property_access', 'null_safety', 
                     'type_assignment', 'import_module', 'svelte_props', 'unused_variables', 'other']
    
    for category in priority_order:
        if category in file_categories:
            files = sorted(file_categories[category], key=lambda x: x[1], reverse=True)
            priority, desc = category_priorities.get(category, ('REVIEW', ''))
            print(f"\n{category.replace('_', ' ').title().upper()} ({priority}) - {len(files)} files:")
            for file_path, total_errors, category_errors in files[:10]:  # Top 10 per category
                print(f"   {file_path:50} ({category_errors}/{total_errors} errors)")
            if len(files) > 10:
                print(f"   ... and {len(files) - 10} more files")

if __name__ == "__main__":
    main()