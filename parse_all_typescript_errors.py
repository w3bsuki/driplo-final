#!/usr/bin/env python3
"""
Comprehensive TypeScript Error Log Parser
Parses all TypeScript error log files and creates a complete JSON analysis.
"""

import json
import re
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Set, Tuple
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
        self.ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
        
        # Error/Warning line patterns - Updated based on actual log format
        self.error_pattern = re.compile(
            r'([kK]:[^:]+):(\d+):(\d+)\s*\n\[31mError\[39m:\s*(.+)'
        )
        self.warning_pattern = re.compile(
            r'([kK]:[^:]+):(\d+):(\d+)\s*\n\[33mWarn\[39m:\s*(.+)'
        )
        
        # Single line patterns for errors and warnings
        self.single_line_error_pattern = re.compile(
            r'\[31mError\[39m:\s*(.+)'
        )
        self.single_line_warning_pattern = re.compile(
            r'\[33mWarn\[39m:\s*(.+)'
        )
        
        # File path pattern to capture the preceding file path line
        self.file_path_pattern = re.compile(
            r'([kK]:[^:]+\[[32m[^\[]+\[39m):(\d+):(\d+)'
        )
        
        # Category patterns
        self.category_patterns = {
            'missing_translation_keys': [
                r"Property '[^']+' does not exist on type 'Record<string, unknown>'",
                r"m\?\.[a-zA-Z_]+ not in messages",
                r"Property '[^']+' does not exist on type.*messages",
                r"Cannot access property '[^']+' of undefined messages"
            ],
            'object_property_errors': [
                r"Property '[^']+' does not exist on type",
                r"Object is possibly 'null'(?! or 'undefined')",
                r"Cannot read propert(?:y|ies) of null",
                r"Cannot read propert(?:y|ies) of undefined",
                r"Type '[^']+' has no properties in common with type"
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
                r"tabindex"
            ]
        }

    def strip_ansi_codes(self, text: str) -> str:
        """Remove ANSI color codes from text."""
        return self.ansi_escape.sub('', text)

    def normalize_path(self, path: str) -> str:
        """Normalize file path to absolute format."""
        # Remove ANSI codes first
        clean_path = self.strip_ansi_codes(path)
        
        # Handle different path formats
        if clean_path.startswith('k:\\') or clean_path.startswith('K:\\'):
            return clean_path.replace('\\', '\\').replace('k:\\', 'K:\\')
        elif clean_path.startswith('./') or clean_path.startswith('src/'):
            return str(self.base_path / clean_path.lstrip('./'))
        elif not clean_path.startswith('K:\\'):
            return str(self.base_path / clean_path)
        
        return clean_path

    def categorize_error(self, message: str) -> str:
        """Categorize error based on message patterns."""
        clean_message = self.strip_ansi_codes(message)
        
        for category, patterns in self.category_patterns.items():
            for pattern in patterns:
                if re.search(pattern, clean_message, re.IGNORECASE):
                    return category
        
        return 'other_errors'

    def parse_line(self, line: str) -> Tuple[Dict[str, Any], str]:
        """Parse a single line for errors or warnings."""
        clean_line = self.strip_ansi_codes(line)
        
        # Try error patterns
        for pattern in [self.error_pattern, self.alt_error_pattern]:
            match = pattern.search(line)
            if match:
                file_path, line_num, col_num, message = match.groups()
                return {
                    'file': self.normalize_path(file_path),
                    'line': int(line_num),
                    'column': int(col_num),
                    'message': self.strip_ansi_codes(message).strip(),
                    'rawMessage': message.strip(),
                    'severity': 'error'
                }, 'error'
        
        # Try warning patterns
        for pattern in [self.warning_pattern, self.alt_warning_pattern]:
            match = pattern.search(line)
            if match:
                file_path, line_num, col_num, message = match.groups()
                severity = 'info' if self.categorize_error(message) == 'accessibility_warnings' else 'warning'
                return {
                    'file': self.normalize_path(file_path),
                    'line': int(line_num),
                    'column': int(col_num),
                    'message': self.strip_ansi_codes(message).strip(),
                    'rawMessage': message.strip(),
                    'severity': severity
                }, 'warning'
        
        return None, None

    def parse_file(self, file_path: str) -> Tuple[int, int]:
        """Parse a single log file and return error/warning counts."""
        print(f"Parsing {file_path}...")
        errors_found = 0
        warnings_found = 0
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line_num, line in enumerate(f, 1):
                    if line_num % 1000 == 0:
                        print(f"  Processed {line_num} lines...")
                    
                    parsed_error, error_type = self.parse_line(line)
                    if parsed_error:
                        category = self.categorize_error(parsed_error['message'])
                        parsed_error['category'] = category
                        
                        # Add to appropriate list
                        if error_type == 'error':
                            self.errors.append(parsed_error)
                            errors_found += 1
                        else:
                            self.warnings.append(parsed_error)
                            warnings_found += 1
                        
                        # Update counts
                        self.error_counts_by_category[category] += 1
                        self.error_counts_by_severity[parsed_error['severity']] += 1
                        
                        # Add to file-based tracking
                        file_error = {
                            'line': parsed_error['line'],
                            'column': parsed_error['column'],
                            'message': parsed_error['message'],
                            'category': category,
                            'severity': parsed_error['severity']
                        }
                        self.errors_by_file[parsed_error['file']].append(file_error)
                        
                        # Track for deduplication
                        error_key = f"{parsed_error['message']}:{parsed_error['line']}:{parsed_error['column']}"
                        self.duplicated_errors[error_key].append({
                            'file': parsed_error['file'],
                            'source_log': file_path
                        })
        
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
        
        print(f"  Found {errors_found} errors, {warnings_found} warnings")
        return errors_found, warnings_found

    def find_duplicates(self) -> List[Dict[str, Any]]:
        """Find and analyze duplicate errors."""
        duplicates = []
        
        for error_key, occurrences in self.duplicated_errors.items():
            if len(occurrences) > 1:
                # Extract message from key
                message = error_key.split(':')[0]
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
    
    print("Starting comprehensive TypeScript error analysis...")
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

if __name__ == '__main__':
    main()