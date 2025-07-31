#!/usr/bin/env python3
"""
Comprehensive TypeScript Error Analysis Script
Parses svelte-check output and categorizes errors systematically.
"""

import re
import json
from collections import defaultdict, Counter
from pathlib import Path
import subprocess
import sys

def run_typescript_check():
    """Run TypeScript check and capture output"""
    try:
        result = subprocess.run(
            ['pnpm', 'run', 'check'], 
            capture_output=True, 
            text=True,
            encoding='utf-8',
            errors='ignore',
            cwd='.',
            timeout=300
        )
        stdout = result.stdout or ""
        stderr = result.stderr or ""
        return stdout + stderr
    except subprocess.TimeoutExpired:
        return "ERROR: TypeScript check timed out"
    except Exception as e:
        return f"ERROR: Failed to run TypeScript check: {e}"

def parse_error_output(output):
    """Parse svelte-check output into structured data"""
    errors = []
    warnings = []
    
    # Split by file paths (lines starting with k:\driplo.bg-main\)
    file_sections = re.split(r'k:\\driplo\.bg-main\\', output)
    
    current_file = None
    current_line = None
    current_column = None
    
    for section in file_sections[1:]:  # Skip first empty section
        lines = section.split('\n')
        if not lines:
            continue
            
        # Extract file path and position from first line
        first_line = lines[0]
        file_match = re.match(r'([^:]+):(\d+):(\d+)', first_line)
        
        if file_match:
            current_file = file_match.group(1)
            current_line = int(file_match.group(2))
            current_column = int(file_match.group(3))
            
            # Look for error/warning indicator in next lines
            for line in lines[1:6]:  # Check next few lines
                if 'Error' in line:
                    error_match = re.search(r'Error.*?:\s*(.+?)(?:\s+\(ts\))?$', line)
                    if error_match:
                        errors.append({
                            'file': current_file,
                            'line': current_line,
                            'column': current_column,
                            'message': error_match.group(1).strip(),
                            'type': 'Error',
                            'category': categorize_error(error_match.group(1))
                        })
                elif 'Warn' in line:
                    warn_match = re.search(r'Warn.*?:\s*(.+?)(?:\s+\([^)]+\))?$', line)
                    if warn_match:
                        warnings.append({
                            'file': current_file,
                            'line': current_line,
                            'column': current_column,
                            'message': warn_match.group(1).strip(),
                            'type': 'Warning',
                            'category': categorize_warning(warn_match.group(1))
                        })
    
    return errors, warnings

def categorize_error(message):
    """Categorize error messages by type"""
    message_lower = message.lower()
    
    if 'not assignable to type' in message_lower:
        return 'Type Assignment'
    elif 'cannot be used as an index type' in message_lower:
        return 'Index Type'
    elif 'does not exist on type' in message_lower:
        return 'Property Missing'
    elif 'expected' in message_lower and 'arguments' in message_lower:
        return 'Function Arguments'
    elif 'object literal may only specify known properties' in message_lower:
        return 'Unknown Property'
    elif 'not all code paths return a value' in message_lower:
        return 'Return Value'
    elif 'cannot find module' in message_lower:
        return 'Module Import'
    elif 'has no exported member' in message_lower:
        return 'Export Missing'
    elif 'duplicate identifier' in message_lower:
        return 'Duplicate Identifier'
    elif 'element implicitly has an' in message_lower and 'any' in message_lower:
        return 'Implicit Any'
    elif 'possibly null' in message_lower or 'possibly undefined' in message_lower:
        return 'Null/Undefined Check'
    elif 'overload' in message_lower:
        return 'Function Overload'
    elif 'generic type' in message_lower:
        return 'Generic Type'
    else:
        return 'Other'

def categorize_warning(message):
    """Categorize warning messages by type"""
    message_lower = message.lower()
    
    if 'a11y' in message_lower:
        return 'Accessibility'
    elif 'unused' in message_lower:
        return 'Unused Code'
    elif 'deprecated' in message_lower:
        return 'Deprecated'
    elif 'self-closing' in message_lower:
        return 'HTML Syntax'
    elif 'reactive' in message_lower or '$state' in message_lower:
        return 'Svelte Reactivity'
    elif 'svelte:component' in message_lower:
        return 'Svelte Component'
    elif 'label' in message_lower and 'associated' in message_lower:
        return 'Form Accessibility'
    else:
        return 'Other'

def assess_fix_complexity(error):
    """Assess the complexity of fixing an error"""
    message = error['message'].lower()
    category = error['category']
    
    # Easy fixes
    if category in ['Function Arguments', 'HTML Syntax', 'Form Accessibility']:
        return 'Easy'
    elif 'missing' in message or 'expected' in message:
        return 'Easy'
    elif category in ['Unused Code', 'Deprecated']:
        return 'Easy'
    
    # Medium fixes  
    elif category in ['Type Assignment', 'Property Missing', 'Unknown Property']:
        return 'Medium'
    elif category in ['Null/Undefined Check', 'Svelte Reactivity']:
        return 'Medium'
    elif 'cannot find module' in message:
        return 'Medium'
    
    # Hard fixes
    elif category in ['Generic Type', 'Function Overload', 'Index Type']:
        return 'Hard'
    elif category in ['Module Import', 'Export Missing']:
        return 'Hard'
    elif 'duplicate identifier' in message:
        return 'Hard'
    
    else:
        return 'Medium'  # Default

def generate_analysis(errors, warnings):
    """Generate comprehensive analysis"""
    analysis = {
        'executive_summary': {
            'total_errors': len(errors),
            'total_warnings': len(warnings),
            'total_issues': len(errors) + len(warnings),
            'files_with_errors': len(set(e['file'] for e in errors)),
            'files_with_warnings': len(set(w['file'] for w in warnings))
        },
        'error_patterns': {},
        'warning_patterns': {},
        'file_breakdown': defaultdict(lambda: {'errors': 0, 'warnings': 0, 'issues': []}),
        'complexity_breakdown': {'Easy': 0, 'Medium': 0, 'Hard': 0},
        'fix_priorities': []
    }
    
    # Count error patterns
    error_categories = Counter(e['category'] for e in errors)
    error_messages = Counter(e['message'][:100] + '...' if len(e['message']) > 100 else e['message'] for e in errors)
    
    analysis['error_patterns']['by_category'] = dict(error_categories.most_common())
    analysis['error_patterns']['by_message'] = dict(error_messages.most_common(20))
    
    # Count warning patterns  
    warning_categories = Counter(w['category'] for w in warnings)
    warning_messages = Counter(w['message'][:100] + '...' if len(w['message']) > 100 else w['message'] for w in warnings)
    
    analysis['warning_patterns']['by_category'] = dict(warning_categories.most_common())
    analysis['warning_patterns']['by_message'] = dict(warning_messages.most_common(20))
    
    # File breakdown
    for error in errors:
        file_key = error['file']
        analysis['file_breakdown'][file_key]['errors'] += 1
        analysis['file_breakdown'][file_key]['issues'].append({
            'type': 'Error',
            'line': error['line'],
            'category': error['category'],
            'message': error['message'][:100] + '...' if len(error['message']) > 100 else error['message']
        })
        
        complexity = assess_fix_complexity(error)
        analysis['complexity_breakdown'][complexity] += 1
    
    for warning in warnings:
        file_key = warning['file']
        analysis['file_breakdown'][file_key]['warnings'] += 1
        analysis['file_breakdown'][file_key]['issues'].append({
            'type': 'Warning', 
            'line': warning['line'],
            'category': warning['category'],
            'message': warning['message'][:100] + '...' if len(warning['message']) > 100 else warning['message']
        })
    
    # Convert defaultdict to regular dict and sort by total issues
    analysis['file_breakdown'] = dict(sorted(
        analysis['file_breakdown'].items(),
        key=lambda x: x[1]['errors'] + x[1]['warnings'],
        reverse=True
    ))
    
    # Generate fix priorities
    # Priority 1: Easy fixes with high frequency
    easy_categories = [cat for cat, count in error_categories.items() 
                      if any(assess_fix_complexity({'category': cat, 'message': ''}) == 'Easy' for _ in [1])]
    
    # Priority order based on impact and ease
    priority_order = [
        ('Function Arguments', 'Easy - Missing or incorrect function parameters'),
        ('HTML Syntax', 'Easy - Self-closing tag fixes'),  
        ('Form Accessibility', 'Easy - Add labels and ARIA attributes'),
        ('Type Assignment', 'Medium - Fix type mismatches'),
        ('Property Missing', 'Medium - Add missing object properties'),
        ('Null/Undefined Check', 'Medium - Add null checks'),
        ('Svelte Reactivity', 'Medium - Fix $state and reactivity issues'),
        ('Unknown Property', 'Medium - Remove or fix unknown properties'),
        ('Return Value', 'Medium - Add missing return statements'),
        ('Module Import', 'Hard - Fix import/export issues'),
        ('Generic Type', 'Hard - Complex type system fixes'),
        ('Index Type', 'Hard - Fix index signature issues')
    ]
    
    for category, description in priority_order:
        if category in error_categories:
            analysis['fix_priorities'].append({
                'category': category,
                'count': error_categories[category],
                'description': description,
                'files': list(set(e['file'] for e in errors if e['category'] == category))[:10]
            })
    
    return analysis

def create_markdown_report(analysis):
    """Create structured markdown report"""
    
    md = f"""# Complete Systematic Error Analysis

## Executive Summary

- **Total Issues**: {analysis['executive_summary']['total_issues']}
- **Errors**: {analysis['executive_summary']['total_errors']} 
- **Warnings**: {analysis['executive_summary']['total_warnings']}
- **Files with Errors**: {analysis['executive_summary']['files_with_errors']}
- **Files with Warnings**: {analysis['executive_summary']['files_with_warnings']}

## Error Pattern Analysis

### By Category
"""
    
    for category, count in analysis['error_patterns']['by_category'].items():
        md += f"- **{category}**: {count} errors\n"
    
    md += f"""
### Top 20 Most Frequent Error Messages
"""
    
    for i, (message, count) in enumerate(analysis['error_patterns']['by_message'].items(), 1):
        md += f"{i}. `{message}` ({count}x)\n"
    
    md += f"""
## Warning Pattern Analysis

### By Category
"""
    
    for category, count in analysis['warning_patterns']['by_category'].items():
        md += f"- **{category}**: {count} warnings\n"
    
    md += f"""
## Fix Complexity Breakdown

- **Easy Fixes**: {analysis['complexity_breakdown']['Easy']} errors
- **Medium Fixes**: {analysis['complexity_breakdown']['Medium']} errors  
- **Hard Fixes**: {analysis['complexity_breakdown']['Hard']} errors

## Priority-Ordered Fix Sequence

"""
    
    for i, priority in enumerate(analysis['fix_priorities'], 1):
        md += f"""### {i}. {priority['category']} ({priority['count']} errors)
**Difficulty**: {priority['description']}

**Top affected files**:
"""
        for file in priority['files'][:5]:
            md += f"- `{file}`\n"
        md += "\n"
    
    md += f"""
## File-by-File Breakdown

### Top 20 Files by Error Count
"""
    
    sorted_files = list(analysis['file_breakdown'].items())[:20]
    for file, data in sorted_files:
        total_issues = data['errors'] + data['warnings']
        md += f"""
#### `{file}` ({total_issues} issues)
- Errors: {data['errors']}
- Warnings: {data['warnings']}

**Top Issues**:
"""
        for issue in data['issues'][:3]:
            md += f"- Line {issue['line']}: [{issue['category']}] {issue['message']}\n"
    
    md += f"""
## Automated vs Manual Fix Opportunities

### Automated Fixes (Estimated {analysis['complexity_breakdown']['Easy']} errors)
- Function argument corrections
- HTML self-closing tag fixes
- Missing accessibility attributes
- Basic type annotations

### Semi-Automated Fixes (Estimated {analysis['complexity_breakdown']['Medium']} errors)  
- Type assignment corrections
- Null/undefined checks
- Property additions
- Svelte reactivity updates

### Manual Fixes Required (Estimated {analysis['complexity_breakdown']['Hard']} errors)
- Complex type system issues
- Import/export restructuring  
- Generic type definitions
- Architecture changes

## Recommended Action Plan

1. **Phase 1 - Quick Wins** (Est. 2-4 hours)
   - Fix all "Easy" category errors
   - Focus on Function Arguments and HTML Syntax
   - Use automated tools where possible

2. **Phase 2 - Type System** (Est. 1-2 days)
   - Address Type Assignment errors
   - Fix Property Missing issues
   - Add null/undefined checks

3. **Phase 3 - Architecture** (Est. 2-3 days)
   - Resolve Module Import issues
   - Fix complex Generic Type problems
   - Address remaining hard issues

4. **Phase 4 - Quality** (Est. 1 day)
   - Fix accessibility warnings
   - Remove unused code
   - Update deprecated patterns
"""
    
    return md

def main():
    """Main execution function"""
    print("Running TypeScript check...")
    output = run_typescript_check()
    
    if output.startswith("ERROR:"):
        print(output)
        return 1
    
    print("Parsing errors...")
    errors, warnings = parse_error_output(output)
    
    print(f"Found {len(errors)} errors and {len(warnings)} warnings")
    
    print("Generating analysis...")
    analysis = generate_analysis(errors, warnings)
    
    print("Creating markdown report...")
    report = create_markdown_report(analysis)
    
    # Write report
    with open('COMPLETE_SYSTEMATIC_ERROR_ANALYSIS.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    # Write raw data
    with open('error_analysis_data.json', 'w', encoding='utf-8') as f:
        json.dump({
            'errors': errors,
            'warnings': warnings,
            'analysis': analysis
        }, f, indent=2, ensure_ascii=False)
    
    print("Analysis complete! Check COMPLETE_SYSTEMATIC_ERROR_ANALYSIS.md")
    return 0

if __name__ == "__main__":
    sys.exit(main())