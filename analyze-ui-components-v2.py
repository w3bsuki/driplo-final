#!/usr/bin/env python3
"""
Improved UI Component Usage Analysis for SvelteKit Project
Better regex patterns to catch all usage scenarios
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

def get_component_name_from_path(file_path):
    """Extract component name from file path"""
    path = Path(file_path)
    if path.suffix == '.svelte':
        return path.stem
    return None

def find_all_ui_components(ui_dir):
    """Find all UI components in the ui directory"""
    components = []
    ui_path = Path(ui_dir)
    
    for file_path in ui_path.rglob("*.svelte"):
        component_name = get_component_name_from_path(file_path)
        if component_name:
            components.append({
                'name': component_name,
                'path': str(file_path),
                'relative_path': str(file_path.relative_to(ui_path.parent.parent.parent))
            })
    
    return components

def search_for_component_usage(src_dir, component_name):
    """Search for component usage with improved patterns"""
    usage_data = {
        'imports': [],
        'template_usage': [],
        'total_imports': 0,
        'total_template_usage': 0
    }
    
    src_path = Path(src_dir)
    
    # Improved search patterns
    import_patterns = [
        rf"import\s+.*\b{component_name}\b",
        rf"import\s*\{{\s*[^}}]*\b{component_name}\b[^}}]*\}}",
        rf"from\s+['\"][^'\"]*{component_name}[^'\"]*['\"]",
    ]
    
    # Better template patterns - more comprehensive
    template_patterns = [
        rf"<{component_name}(?:\s|>|/>|$)",  # Tag opening
        rf"<{component_name}\s+[^>]*>",      # Tag with attributes  
        rf"<{component_name}\s*/\s*>",       # Self-closing tag
        rf"<{component_name}[^A-Za-z0-9]",   # Component name followed by non-alphanumeric
    ]
    
    # Search in all relevant files
    for file_path in src_path.rglob("*"):
        if file_path.suffix in ['.svelte', '.ts', '.js']:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check for imports
                    for pattern in import_patterns:
                        matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                        for match in matches:
                            usage_data['imports'].append({
                                'file': str(file_path),
                                'line': content[:match.start()].count('\n') + 1,
                                'match': match.group().strip()
                            })
                            usage_data['total_imports'] += 1
                    
                    # Check for template usage (only in .svelte files)
                    if file_path.suffix == '.svelte':
                        for pattern in template_patterns:
                            matches = re.finditer(pattern, content, re.IGNORECASE | re.MULTILINE)
                            for match in matches:
                                usage_data['template_usage'].append({
                                    'file': str(file_path),
                                    'line': content[:match.start()].count('\n') + 1,
                                    'match': match.group().strip()
                                })
                                usage_data['total_template_usage'] += 1
                                
            except (UnicodeDecodeError, PermissionError):
                continue
    
    return usage_data

def analyze_components():
    """Main analysis function"""
    project_root = Path("K:/driplo.bg-main")
    ui_dir = project_root / "src/lib/components/ui"
    src_dir = project_root / "src"
    
    print("Starting improved UI component analysis...")
    print(f"UI Components directory: {ui_dir}")
    print(f"Source directory: {src_dir}")
    print()
    
    # Find all UI components
    components = find_all_ui_components(ui_dir)
    print(f"Found {len(components)} UI components")
    print()
    
    analysis_results = {
        'total_components': len(components),
        'components': {},
        'unused_components': [],
        'minimally_used_components': [],
        'well_used_components': [],
        'summary': {}
    }
    
    # Analyze each component
    for i, component in enumerate(components, 1):
        component_name = component['name']
        print(f"[{i}/{len(components)}] Analyzing: {component_name}")
        
        usage_data = search_for_component_usage(src_dir, component_name)
        
        component_analysis = {
            'name': component_name,
            'path': component['path'],
            'relative_path': component['relative_path'],
            'usage': usage_data
        }
        
        analysis_results['components'][component_name] = component_analysis
        
        # Categorize based on usage
        total_usage = usage_data['total_template_usage']
        if total_usage == 0:
            analysis_results['unused_components'].append(component_name)
        elif total_usage <= 3:
            analysis_results['minimally_used_components'].append({
                'name': component_name,
                'usage_count': total_usage
            })
        else:
            analysis_results['well_used_components'].append({
                'name': component_name,
                'usage_count': total_usage
            })
    
    # Generate summary statistics
    analysis_results['summary'] = {
        'total_analyzed': len(components),
        'unused_count': len(analysis_results['unused_components']),
        'minimally_used_count': len(analysis_results['minimally_used_components']),
        'well_used_count': len(analysis_results['well_used_components'])
    }
    
    return analysis_results

def generate_detailed_report(analysis_results):
    """Generate a comprehensive report"""
    print("\n" + "="*80)
    print("COMPREHENSIVE UI COMPONENT USAGE ANALYSIS REPORT")
    print("="*80)
    
    summary = analysis_results['summary']
    print(f"\nEXECUTIVE SUMMARY:")
    print(f"   - Total UI components analyzed: {summary['total_analyzed']}")
    print(f"   - Completely unused components: {summary['unused_count']} ({summary['unused_count']/summary['total_analyzed']*100:.1f}%)")
    print(f"   - Minimally used components (1-3 uses): {summary['minimally_used_count']} ({summary['minimally_used_count']/summary['total_analyzed']*100:.1f}%)")
    print(f"   - Well-used components (4+ uses): {summary['well_used_count']} ({summary['well_used_count']/summary['total_analyzed']*100:.1f}%)")
    
    # Cleanup potential calculation
    cleanup_candidates = summary['unused_count'] + summary['minimally_used_count']
    potential_savings = cleanup_candidates / summary['total_analyzed'] * 100
    print(f"   - Cleanup potential: {cleanup_candidates} components ({potential_savings:.1f}% of codebase)")
    
    # Most used components (top 15)
    well_used = []
    for component_name, data in analysis_results['components'].items():
        usage_count = data['usage']['total_template_usage']
        well_used.append((component_name, usage_count))
    
    well_used.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\nTOP 15 MOST USED COMPONENTS:")
    for i, (component, count) in enumerate(well_used[:15], 1):
        print(f"   {i:2d}. {component}: {count} uses")
    
    # Completely Unused Components
    if analysis_results['unused_components']:
        print(f"\nCOMPLETELY UNUSED COMPONENTS ({len(analysis_results['unused_components'])}):")
        print("These components have 0 template usage and can likely be removed:")
        
        for component in sorted(analysis_results['unused_components']):
            comp_data = analysis_results['components'][component]
            print(f"   X {component}")
            print(f"     Path: {comp_data['relative_path']}")
            print(f"     Imports found: {comp_data['usage']['total_imports']}")
            print()
    
    # Minimally Used Components
    if analysis_results['minimally_used_components']:
        print(f"\nMINIMALLY USED COMPONENTS ({len(analysis_results['minimally_used_components'])}):")
        print("These components have very limited usage and may be candidates for consolidation:")
        
        # Sort by usage count
        minimal_sorted = sorted(analysis_results['minimally_used_components'], 
                              key=lambda x: x['usage_count'])
        
        for component_info in minimal_sorted:
            component = component_info['name']
            usage_count = component_info['usage_count']
            comp_data = analysis_results['components'][component]
            print(f"   ! {component} ({usage_count} uses)")
            print(f"     Path: {comp_data['relative_path']}")
            
            # Show where it's used
            if comp_data['usage']['template_usage']:
                print(f"     Used in:")
                for usage in comp_data['usage']['template_usage'][:3]:  # Limit to 3 examples
                    try:
                        rel_path = Path(usage['file']).relative_to(Path("K:/driplo.bg-main"))
                        print(f"       - {rel_path}:{usage['line']}")
                    except ValueError:
                        print(f"       - {usage['file']}:{usage['line']}")
                if len(comp_data['usage']['template_usage']) > 3:
                    print(f"       ... and {len(comp_data['usage']['template_usage']) - 3} more")
            print()
    
    # Component categories analysis
    print(f"\nCOMPONENT CATEGORIES ANALYSIS:")
    
    categories = {
        'alert': [],
        'button': [],
        'card': [],
        'dialog': [],
        'dropdown': [],
        'form': [],
        'table': [],
        'navigation': [],
        'layout': [],
        'other': []
    }
    
    for component_name in analysis_results['components'].keys():
        name_lower = component_name.lower()
        if 'alert' in name_lower:
            categories['alert'].append(component_name)
        elif 'button' in name_lower:
            categories['button'].append(component_name)
        elif 'card' in name_lower:
            categories['card'].append(component_name)
        elif 'dialog' in name_lower:
            categories['dialog'].append(component_name)
        elif 'dropdown' in name_lower or 'menu' in name_lower:
            categories['dropdown'].append(component_name)
        elif any(word in name_lower for word in ['input', 'select', 'textarea', 'form', 'radio', 'switch']):
            categories['form'].append(component_name)
        elif 'table' in name_lower:
            categories['table'].append(component_name)
        elif any(word in name_lower for word in ['nav', 'breadcrumb', 'pagination']):
            categories['navigation'].append(component_name)
        elif any(word in name_lower for word in ['sheet', 'popover', 'tooltip', 'tab']):
            categories['layout'].append(component_name)
        else:
            categories['other'].append(component_name)
    
    for category, components in categories.items():
        if components:
            unused_in_category = len([c for c in components if c in analysis_results['unused_components']])
            print(f"   {category.title()}: {len(components)} components ({unused_in_category} unused)")
    
    print(f"\nCLEANUP RECOMMENDATIONS:")
    print(f"   HIGH PRIORITY CLEANUP:")
    if analysis_results['unused_components']:
        print(f"   - Remove {len(analysis_results['unused_components'])} completely unused components")
        
    print(f"   MEDIUM PRIORITY REVIEW:")
    if analysis_results['minimally_used_components']:
        print(f"   - Review {len(analysis_results['minimally_used_components'])} minimally used components")
        print(f"   - Consider consolidating similar functionality")
        
    # File size estimation
    total_files = len(analysis_results['unused_components']) + len(analysis_results['minimally_used_components'])
    print(f"   ESTIMATED IMPACT:")
    print(f"   - Files to review/remove: {total_files}")
    print(f"   - Potential codebase reduction: {potential_savings:.1f}%")
    print(f"   - Maintenance burden reduction: Significant")
    
    if cleanup_candidates == 0:
        print("   - All components appear to be well-utilized!")

def save_results(analysis_results, filename="ui_component_analysis_v2_detailed.json"):
    """Save detailed results to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2, ensure_ascii=False)
    print(f"\nDetailed analysis results saved to: {filename}")

if __name__ == "__main__":
    try:
        results = analyze_components()
        generate_detailed_report(results)
        save_results(results)
    except Exception as e:
        print(f"Error during analysis: {e}")
        import traceback
        traceback.print_exc()