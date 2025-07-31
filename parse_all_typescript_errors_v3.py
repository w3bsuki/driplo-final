#!/usr/bin/env python3
"""
Comprehensive TypeScript Error Log Parser v3
Parses all TypeScript error log files and creates a complete JSON analysis.
Handles the actual svelte-check output format correctly.
"""

import json
import re
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Set, Tuple, Optional
from collections import defaultdict

class TypeScriptErrorParser:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.errors = []
        self.warnings = []
        self.duplicated_errors = defaultdict(list)
        self.error_counts_by_category = defaultdict(int)
        self.error_counts_by_severity = defaultdict(int)
        self.errors_by_file = defaultdict(list)
        
        # ANSI color code regex
        self.ansi_escape = re.compile(r'\[(?:\d+(?:;\d+)*)?m')
        
        # Category patterns for error classification
        self.category_patterns = {
            'missing_translation_keys': [
                r"Property '[^']+' does not exist on type 'Record<string, unknown>'",
                r"m\?\.[a-zA-Z_]+ not in messages",
                r"Property '[^']+' does not exist on type.*messages",
                r"Cannot access property '[^']+' of undefined messages"
            ],
            'object_property_errors': [
                r"Property '[^']+' does not exist on type(?! 'Record<string, unknown>')",
                r"Object is possibly 'null'(?! or 'undefined')",
                r"Cannot read propert(?:y|ies) of null",
                r"Cannot read propert(?:y|ies) of undefined",
                r"Type '[^']+' has no properties in common with type",
                r"Property '[^']+' does not exist on type '[^']+'"
            ],
            'null_undefined_errors': [
                r"Object is possibly 'null' or 'undefined'",
                r"Object is possibly 'undefined'",
                r"Argument of type '[^']*undefined[^']*' is not assignable",
                r"Type 'undefined' is not assignable to type",
                r"Cannot invoke an object which is possibly 'undefined'",
                r"Possibly null reference"
            ],
            'function_return_errors': [
                r"Not all code paths return a value",
                r"Function lacks ending return statement",
                r"A function whose declared type is neither 'void' nor 'any' must return a value"
            ],
            'import_export_errors': [
                r"Cannot find module '[^']+'",
                r"Module '[^']+' has no exported member '[^']+'",
                r"Could not resolve '[^']+'",
                r"Unable to resolve path to module"
            ],
            'svelte5_syntax_errors': [
                r"on:click",
                r"<slot",
                r"export let",
                r"bind:this",
                r"use:action"
            ],
            'optional_chaining_errors': [
                r"Cannot invoke an object which is possibly 'undefined'",
                r"Cannot access property '[^']+' of undefined",
                r"Optional chain expressions can return undefined"
            ],
            'unused_variables': [
                r"'[^']+' is declared but never used",
                r"'[^']+' is assigned a value but never used",
                r"Unused label '[^']+'"
            ],
            'form_submitfunction_errors': [
                r"SubmitFunction",
                r"enhance action",
                r"ActionResult",
                r"form action"
            ],
            'parse_errors': [
                r"import\?\.meta",
                r"Unexpected token",
                r"Expected",
                r"Parsing error",
                r"Invalid or unexpected token"
            ],
            'accessibility_warnings': [
                r"A11y:",
                r"accessibility",
                r"aria-",
                r"role attribute",
                r"alt attribute",
                r"tabindex",
                r"click event must be accompanied by",
                r"should not be assigned mouse or keyboard event",
                r"should either contain text or have an `aria-label`",
                r"must have an ARIA role"
            ]
        }

    def strip_ansi_codes(self, text: str) -> str:
        """Remove ANSI color codes from text."""
        return self.ansi_escape.sub('', text)

    def normalize_path(self, path: str) -> str:
        """Normalize file path to absolute format."""
        clean_path = self.strip_ansi_codes(path)
        
        # Handle the format: k:\driplo.bg-main\[32msrc\path[39m
        # Remove color codes and ensure proper path format
        if '\\[32m' in clean_path:
            parts = clean_path.split('\\[32m')
            if len(parts) == 2:
                base = parts[0]
                relative = parts[1].replace('[39m', '')
                clean_path = f"{base}\\{relative}"
        
        # Normalize to standard path format
        if clean_path.startswith('k:\\'):
            clean_path = clean_path.replace('k:\\', 'K:\\')
        
        return clean_path.replace('/', '\\')

    def categorize_error(self, message: str) -> str:
        """Categorize error based on message patterns."""
        clean_message = self.strip_ansi_codes(message)
        
        for category, patterns in self.category_patterns.items():
            for pattern in patterns:
                if re.search(pattern, clean_message, re.IGNORECASE):
                    return category
        
        return 'other_errors'

    def parse_file(self, file_path: str) -> Tuple[int, int]:
        """Parse a single log file and return error/warning counts."""
        print(f"Parsing {file_path}...")
        errors_found = 0
        warnings_found = 0
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            i = 0
            while i < len(lines):
                if i % 1000 == 0 and i > 0:
                    print(f"  Processed {i} lines...")
                
                line = lines[i].strip()
                
                # Look for file path pattern: k:\driplo.bg-main\[32msrc\...[39m:line:col
                file_match = re.search(r'([kK]:[^:]+):(\d+):(\d+)$', line)
                if file_match and i + 1 < len(lines):
                    file_path_raw = file_match.group(1)
                    line_num = int(file_match.group(2))
                    col_num = int(file_match.group(3))
                    
                    # Look at the next line for error/warning
                    next_line = lines[i + 1].strip()
                    
                    # Check for error
                    error_match = re.search(r'\[31mError\[39m:\s*(.+?)(?:\s*\([^)]*\))?$', next_line)
                    if error_match:
                        message = error_match.group(1).strip()
                        category = self.categorize_error(message)
                        
                        error_entry = {
                            'file': self.normalize_path(file_path_raw),
                            'line': line_num,
                            'column': col_num,
                            'message': self.strip_ansi_codes(message),
                            'rawMessage': message,
                            'severity': 'error',
                            'category': category
                        }
                        
                        self.errors.append(error_entry)
                        errors_found += 1
                        
                        # Update counts
                        self.error_counts_by_category[category] += 1
                        self.error_counts_by_severity['error'] += 1
                        
                        # Add to file-based tracking
                        file_error = {
                            'line': line_num,
                            'column': col_num,
                            'message': self.strip_ansi_codes(message),
                            'category': category,
                            'severity': 'error'
                        }
                        self.errors_by_file[error_entry['file']].append(file_error)
                        
                        # Track for deduplication
                        error_key = f"{self.strip_ansi_codes(message)}:{line_num}:{col_num}"
                        self.duplicated_errors[error_key].append({
                            'file': error_entry['file'],
                            'source_log': file_path
                        })
                        
                        i += 2  # Skip both lines
                        continue
                    
                    # Check for warning
                    warning_match = re.search(r'\[33mWarn\[39m:\s*(.+?)(?:\s*\([^)]*\))?$', next_line)
                    if warning_match:
                        message = warning_match.group(1).strip()
                        category = self.categorize_error(message)
                        
                        # Set severity based on category
                        severity = 'info' if category == 'accessibility_warnings' else 'warning'
                        
                        warning_entry = {
                            'file': self.normalize_path(file_path_raw),
                            'line': line_num,
                            'column': col_num,
                            'message': self.strip_ansi_codes(message),
                            'rawMessage': message,
                            'severity': severity,
                            'category': category
                        }
                        
                        self.warnings.append(warning_entry)
                        warnings_found += 1
                        
                        # Update counts
                        self.error_counts_by_category[category] += 1
                        self.error_counts_by_severity[severity] += 1
                        
                        # Add to file-based tracking
                        file_warning = {
                            'line': line_num,
                            'column': col_num,
                            'message': self.strip_ansi_codes(message),
                            'category': category,
                            'severity': severity
                        }
                        self.errors_by_file[warning_entry['file']].append(file_warning)
                        
                        # Track for deduplication
                        error_key = f"{self.strip_ansi_codes(message)}:{line_num}:{col_num}"
                        self.duplicated_errors[error_key].append({
                            'file': warning_entry['file'],
                            'source_log': file_path
                        })
                        
                        i += 2  # Skip both lines
                        continue
                
                i += 1
        
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
            import traceback
            traceback.print_exc()
        
        print(f"  Found {errors_found} errors, {warnings_found} warnings")
        return errors_found, warnings_found

    def find_duplicates(self) -> List[Dict[str, Any]]:
        """Find and analyze duplicate errors."""
        duplicates = []
        
        for error_key, occurrences in self.duplicated_errors.items():
            if len(occurrences) > 1:
                # Extract message from key
                message = error_key.rsplit(':', 2)[0]  # Get everything except line:col
                files = list(set([occ['file'] for occ in occurrences]))
                
                duplicates.append({
                    'message': message,
                    'occurrences': len(occurrences),
                    'files': files
                })
        
        return sorted(duplicates, key=lambda x: x['occurrences'], reverse=True)

    def categorize_all_errors(self) -> Dict[str, List[Dict[str, Any]]]:
        """Organize all errors by category."""
        categorized = defaultdict(list)
        
        for error in self.errors + self.warnings:
            category = error['category']
            categorized[category].append(error)
        
        return dict(categorized)

    def generate_analysis(self, log_files: List[str]) -> Dict[str, Any]:
        """Generate the complete analysis."""
        # Parse all files
        total_errors = 0
        total_warnings = 0
        
        for log_file in log_files:
            if os.path.exists(log_file):
                errors, warnings = self.parse_file(log_file)
                total_errors += errors
                total_warnings += warnings
            else:
                print(f"Warning: File not found: {log_file}")
        
        # Generate analysis
        duplicated = self.find_duplicates()
        categorized_errors = self.categorize_all_errors()
        
        analysis = {
            'summary': {
                'totalErrors': len(self.errors),
                'totalWarnings': len(self.warnings),
                'filesAnalyzed': [f for f in log_files if os.path.exists(f)],
                'errorsByCategory': dict(self.error_counts_by_category),
                'errorsBySeverity': dict(self.error_counts_by_severity),
                'analysisDate': datetime.now().isoformat(),
                'uniqueFilesWithErrors': len(self.errors_by_file)
            },
            'errorCategories': categorized_errors,
            'errorsByFile': dict(self.errors_by_file),
            'duplicatedErrors': duplicated
        }
        
        return analysis

def main():
    base_path = r'K:\driplo.bg-main'
    
    # Target files to parse
    log_files = [
        r'K:\driplo.bg-main\check-output.txt',
        r'K:\driplo.bg-main\full-typescript-errors.txt', 
        r'K:\driplo.bg-main\typescript-check-full.txt',
        r'K:\driplo.bg-main\phase3-final-check.txt',
        r'K:\driplo.bg-main\current-typescript-check.txt',
        r'K:\driplo.bg-main\typescript-errors-full.txt'
    ]
    
    print("Starting comprehensive TypeScript error analysis v3...")
    print(f"Target files: {len(log_files)}")
    
    # Initialize parser
    parser = TypeScriptErrorParser(base_path)
    
    # Generate analysis
    analysis = parser.generate_analysis(log_files)
    
    # Write results
    output_file = r'K:\driplo.bg-main\TYPESCRIPT_ERRORS_COMPLETE_ANALYSIS.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)
    
    print(f"\nAnalysis complete!")
    print(f"Output written to: {output_file}")
    print(f"Total errors: {analysis['summary']['totalErrors']}")
    print(f"Total warnings: {analysis['summary']['totalWarnings']}")
    print(f"Unique files with errors: {analysis['summary']['uniqueFilesWithErrors']}")
    print(f"Duplicate error patterns: {len(analysis['duplicatedErrors'])}")
    
    print("\nTop error categories:")
    for category, count in sorted(analysis['summary']['errorsByCategory'].items(), 
                                key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {category}: {count}")
    
    # Show sample errors for debugging
    if analysis['summary']['totalErrors'] > 0:
        print(f"\nSample errors found:")
        for i, error in enumerate(parser.errors[:5]):
            print(f"  {i+1}. {error['file']}:{error['line']}:{error['column']} - {error['message']}")

if __name__ == '__main__':
    main()