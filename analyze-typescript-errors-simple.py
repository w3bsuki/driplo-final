#!/usr/bin/env python3
"""
Simple TypeScript Error Analysis Script
Analyzes all TypeScript compilation error log files and provides detailed categorization and reporting.
"""

import re
import os
import json
from collections import defaultdict, Counter
from pathlib import Path
from typing import Dict, List, Tuple, Set

class TypeScriptErrorAnalyzer:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.error_files = [
            "current-typescript-check.txt",
            "typescript-errors-full.txt", 
            "full-typescript-errors.txt",
            "check-output.txt",
            "phase3-final-check.txt",
            "typescript-check-full.txt",
            "typescript-errors-complete.txt",
            "current-complete-errors.txt"
        ]
        
        # Error categorization patterns
        self.error_categories = {
            'translation_keys': [
                r'Property \'m\.',
                r'Cannot find name \'m\'',
                r'message.*key.*missing',
                r'translation.*key',
                r'Argument of type.*is not assignable.*message'
            ],
            'database_rpc': [
                r'p_[a-z_]+.*not assignable',
                r'Parameter.*p_[a-z_]+',
                r'RPC.*parameter',
                r'database.*parameter'
            ],
            'type_assignment': [
                r'Type .* is not assignable to type',
                r'Argument of type .* is not assignable to parameter',
                r'Cannot assign to .* because it is a read-only property'
            ],
            'property_access': [
                r'Property .* does not exist on type',
                r'Cannot access .* before initialization',
                r'Property .* is missing in type'
            ],
            'function_arguments': [
                r'Expected \d+ arguments?, but got \d+',
                r'Expected .* arguments?, but got',
                r'No overload matches this call'
            ],
            'null_safety': [
                r'Object is possibly \'undefined\'',
                r'Object is possibly \'null\'',
                r'Cannot read propert.* of undefined',
                r'Argument of type .* undefined .* is not assignable'
            ],
            'svelte_props': [
                r'Object literal may only specify known properties',
                r'does not exist in type.*Props',
                r'Svelte component.*prop'
            ],
            'import_module': [
                r'Cannot find module',
                r'Module.*has no exported member',
                r'Cannot resolve module'
            ],
            'svelte5_syntax': [
                r'on:.*is deprecated',
                r'export let.*deprecated',
                r'slot.*deprecated',
                r'createEventDispatcher.*deprecated'
            ],
            'unused_variables': [
                r'is declared but its value is never read',
                r'is assigned a value but never used',
                r'Parameter.*is declared but its value is never read'
            ],
            'return_paths': [
                r'Not all code paths return a value',
                r'Function lacks ending return statement'
            ],
            'html_template': [
                r'Invalid HTML',
                r'Unknown element',
                r'Unknown attribute'
            ],
            'optional_chaining': [
                r'Invalid optional chain',
                r'Optional chain.*new expression'
            ],
            'construct_signatures': [
                r'has no construct signatures',
                r'Cannot use.*as a constructor'
            ]
        }
        
        self.errors = []
        self.file_errors = defaultdict(list)
        self.category_counts = defaultdict(int)
        self.error_patterns = Counter()
        
    def clean_ansi_codes(self, text: str) -> str:
        """Remove ANSI color codes from text"""
        ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        # Also handle the [32m, [39m, [31m, [33m patterns
        color_codes = re.compile(r'\[3[0-9]m|\[39m')
        text = ansi_escape.sub('', text)
        text = color_codes.sub('', text)
        return text
    
    def parse_file_path(self, line: str) -> Tuple[str, int, int]:
        """Extract file path, line number, and column from error line"""
        # Pattern: k:\driplo.bg-main\[32msrc\path\to\file.svelte[39m:line:column
        pattern = r'k:\\driplo\.bg-main\\(?:\[[0-9]+m)?([^:]+?)(?:\[[0-9]+m)?:(\d+):(\d+)'
        match = re.search(pattern, line)
        if match:
            file_path = match.group(1).replace('\\', '/')
            line_num = int(match.group(2))
            col_num = int(match.group(3))
            return file_path, line_num, col_num
        return "", 0, 0
    
    def categorize_error(self, error_message: str) -> str:
        """Categorize error based on message content"""
        error_lower = error_message.lower()
        
        for category, patterns in self.error_categories.items():
            for pattern in patterns:
                if re.search(pattern, error_message, re.IGNORECASE):
                    return category
        
        return 'other'
    
    def extract_error_pattern(self, error_message: str) -> str:
        """Extract a generalized pattern from the error message"""
        # Remove specific identifiers and types to find patterns
        pattern = re.sub(r"'[^']*'", "'IDENTIFIER'", error_message)
        pattern = re.sub(r'"[^"]*"', '"STRING"', pattern)
        pattern = re.sub(r'\b\d+\b', 'NUMBER', pattern)
        return pattern
    
    def parse_error_file(self, file_path: str) -> List[Dict]:
        """Parse a single error log file and extract TypeScript errors"""
        errors = []
        current_error = None
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                clean_line = self.clean_ansi_codes(line)
                
                # Check if this line contains a file path with line:column
                if 'driplo.bg-main' in line and ':' in line and i+1 < len(lines) and ('Error' in lines[i+1] or 'Error' in line):
                    file_path, line_num, col_num = self.parse_file_path(line)
                    if file_path:
                        current_error = {
                            'file': file_path,
                            'line': line_num,
                            'column': col_num,
                            'message': '',
                            'type': '',
                            'source_file': os.path.basename(file_path)
                        }
                
                # Check if this is an error line
                elif 'Error:' in clean_line or '[31mError[39m:' in line:
                    if current_error:
                        # Extract error message
                        error_msg = clean_line.replace('Error:', '').strip()
                        
                        # Look ahead for continuation lines and check for (ts) ending
                        full_message = error_msg
                        j = i + 1
                        while j < len(lines) and not lines[j].strip().startswith('k:\\') and not 'Error:' in lines[j]:
                            next_line = self.clean_ansi_codes(lines[j]).strip()
                            if next_line and not next_line.startswith('http'):
                                full_message += ' ' + next_line
                            if '(ts)' in next_line:
                                break
                            j += 1
                        
                        # Only include TypeScript errors
                        if '(ts)' in full_message:
                            current_error['message'] = full_message.replace('(ts)', '').strip()
                            current_error['type'] = 'typescript'
                            current_error['category'] = self.categorize_error(current_error['message'])
                            current_error['pattern'] = self.extract_error_pattern(current_error['message'])
                            errors.append(current_error.copy())
                
                i += 1
                
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
        
        return errors
    
    def analyze_all_files(self):
        """Analyze all TypeScript error files"""
        print("Analyzing TypeScript error files...")
        
        all_errors = []
        unique_errors = set()
        
        for error_file in self.error_files:
            file_path = self.project_root / error_file
            if file_path.exists():
                print(f"Processing {error_file}...")
                file_errors = self.parse_error_file(str(file_path))
                
                # Deduplicate errors
                for error in file_errors:
                    error_key = (error['file'], error['line'], error['message'])
                    if error_key not in unique_errors:
                        unique_errors.add(error_key)
                        all_errors.append(error)
                        self.file_errors[error['file']].append(error)
                        self.category_counts[error['category']] += 1
                        self.error_patterns[error['pattern']] += 1
        
        self.errors = all_errors
        print(f"Found {len(all_errors)} unique TypeScript errors across {len(self.error_files)} files")
    
    def generate_report(self) -> Dict:
        """Generate comprehensive error analysis report"""
        if not self.errors:
            return {}
        
        # File statistics
        files_with_errors = list(self.file_errors.keys())
        files_by_error_count = sorted(
            [(file, len(errors)) for file, errors in self.file_errors.items()],
            key=lambda x: x[1], reverse=True
        )
        
        # Most common patterns
        top_patterns = self.error_patterns.most_common(20)
        
        # Category breakdown
        category_breakdown = dict(self.category_counts)
        
        # File extensions analysis
        extension_counts = Counter()
        for file_path in files_with_errors:
            ext = os.path.splitext(file_path)[1]
            extension_counts[ext] += len(self.file_errors[file_path])
        
        report = {
            'summary': {
                'total_unique_errors': len(self.errors),
                'files_with_errors': len(files_with_errors),
                'error_files_analyzed': len([f for f in self.error_files if (self.project_root / f).exists()])
            },
            'category_breakdown': category_breakdown,
            'top_20_files_by_errors': files_by_error_count[:20],
            'most_frequent_patterns': top_patterns,
            'file_extension_breakdown': dict(extension_counts),
            'detailed_file_errors': {}
        }
        
        # Add detailed errors for each file
        for file_path, errors in self.file_errors.items():
            report['detailed_file_errors'][file_path] = [
                {
                    'line': error['line'],
                    'column': error['column'],
                    'message': error['message'],
                    'category': error['category']
                }
                for error in errors
            ]
        
        return report
    
    def print_summary_report(self, report: Dict):
        """Print a human-readable summary of the analysis"""
        print("\n" + "="*80)
        print("COMPREHENSIVE TYPESCRIPT ERROR ANALYSIS REPORT")
        print("="*80)
        
        # Summary
        summary = report['summary']
        print(f"\nSUMMARY:")
        print(f"   Total unique TypeScript errors: {summary['total_unique_errors']}")
        print(f"   Files with errors: {summary['files_with_errors']}")
        print(f"   Error log files analyzed: {summary['error_files_analyzed']}")
        
        # Category breakdown
        print(f"\nERROR CATEGORIES:")
        for category, count in sorted(report['category_breakdown'].items(), key=lambda x: x[1], reverse=True):
            percentage = (count / summary['total_unique_errors']) * 100
            print(f"   {category.replace('_', ' ').title()}: {count} ({percentage:.1f}%)")
        
        # Top files with most errors
        print(f"\nTOP 20 FILES WITH MOST ERRORS:")
        for i, (file_path, error_count) in enumerate(report['top_20_files_by_errors'], 1):
            print(f"   {i:2d}. {file_path} ({error_count} errors)")
        
        # File extension breakdown
        print(f"\nERRORS BY FILE TYPE:")
        for ext, count in sorted(report['file_extension_breakdown'].items(), key=lambda x: x[1], reverse=True):
            print(f"   {ext or '(no extension)'}: {count} errors")
        
        # Most frequent error patterns
        print(f"\nMOST FREQUENT ERROR PATTERNS:")
        for i, (pattern, count) in enumerate(report['most_frequent_patterns'][:10], 1):
            print(f"   {i:2d}. ({count}x) {pattern[:100]}{'...' if len(pattern) > 100 else ''}")
        
        # Priority recommendations
        print(f"\nPRIORITY RECOMMENDATIONS:")
        
        # Identify high-impact fixes
        category_priorities = {
            'translation_keys': 'HIGH - Fix missing translation keys (systematic)',
            'unused_variables': 'MEDIUM - Remove unused imports/variables (cleanup)',
            'null_safety': 'HIGH - Add null safety checks (critical for runtime)',
            'type_assignment': 'MEDIUM - Fix type mismatches (type safety)',
            'function_arguments': 'HIGH - Fix function call signatures (breaking)',
            'property_access': 'HIGH - Fix property access errors (breaking)',
            'svelte5_syntax': 'MEDIUM - Modernize to Svelte 5 syntax',
            'database_rpc': 'HIGH - Fix database RPC parameter types',
            'return_paths': 'MEDIUM - Add missing return statements'
        }
        
        for category, count in sorted(report['category_breakdown'].items(), key=lambda x: x[1], reverse=True):
            if category in category_priorities:
                print(f"   {category_priorities[category]} ({count} errors)")
            else:
                print(f"   REVIEW - {category.replace('_', ' ').title()} ({count} errors)")
    
    def save_detailed_report(self, output_file: str = "typescript_errors_complete_analysis.json"):
        """Save detailed report to JSON file"""
        report = self.generate_report()
        output_path = self.project_root / output_file
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\nDetailed report saved to: {output_path}")
        return report

def main():
    project_root = "K:\\driplo.bg-main"
    
    analyzer = TypeScriptErrorAnalyzer(project_root)
    analyzer.analyze_all_files()
    
    report = analyzer.save_detailed_report()
    analyzer.print_summary_report(report)
    
    # Additional file-by-file breakdown
    print(f"\nDETAILED FILE-BY-FILE BREAKDOWN:")
    print("-" * 80)
    
    for file_path, errors in sorted(analyzer.file_errors.items(), key=lambda x: len(x[1]), reverse=True)[:20]:
        print(f"\n{file_path} ({len(errors)} errors):")
        
        # Group errors by category for this file
        file_categories = defaultdict(list)
        for error in errors:
            file_categories[error['category']].append(error)
        
        for category, cat_errors in file_categories.items():
            print(f"  {category.replace('_', ' ').title()}: {len(cat_errors)} errors")
            for error in cat_errors[:3]:  # Show first 3 errors of each category
                print(f"    Line {error['line']}: {error['message'][:80]}{'...' if len(error['message']) > 80 else ''}")
            if len(cat_errors) > 3:
                print(f"    ... and {len(cat_errors) - 3} more")

if __name__ == "__main__":
    main()