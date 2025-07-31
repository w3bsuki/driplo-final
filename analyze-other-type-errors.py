#!/usr/bin/env python3

import json

# Read the phase3 type errors
with open('phase3-type-errors.json', 'r') as f:
    data = json.load(f)

other_errors = data['errors']['other_type']

# Group errors by pattern
patterns = {
    'version_mismatch': [],
    'component_type': [],
    'form_data_entry': [],
    'user_profile': [],
    'request_handler': [],
    'status_type': [],
    'generic_type': [],
    'other': []
}

for error in other_errors:
    msg = error['message']
    if '2024-06-20' in msg or '2025-06-30.basil' in msg:
        patterns['version_mismatch'].append(error)
    elif 'ComponentType<SvelteComponent' in msg:
        patterns['component_type'].append(error)
    elif 'FormDataEntryValue' in msg:
        patterns['form_data_entry'].append(error)
    elif 'UserProfile | null' in msg:
        patterns['user_profile'].append(error)
    elif 'RequestHandler' in msg:
        patterns['request_handler'].append(error)
    elif 'completed' in msg and 'status' in msg:
        patterns['status_type'].append(error)
    elif 'Type \'T' in msg or 'Type \'unknown' in msg:
        patterns['generic_type'].append(error)
    else:
        patterns['other'].append(error)

# Print analysis
print("=== OTHER TYPE ERRORS ANALYSIS ===\n")
for pattern, errors in patterns.items():
    if errors:
        print(f"{pattern}: {len(errors)} errors")
        for e in errors[:3]:  # Show first 3 examples
            print(f"  - {e['file']}:{e['line']} - {e['message'][:100]}...")
        print()

# Print fix order
print("\n=== SUGGESTED FIX ORDER ===")
print("1. Version mismatches (3 errors) - Update Stripe API version")
print("2. UserProfile type (2 errors) - Fix type imports") 
print("3. FormDataEntry (2 errors) - Add type assertions")
print("4. Component types (2 errors) - Fix lazy loading types")
print("5. Status type (1 error) - Add 'completed' to union type")
print("6. Request handler (1 error) - Fix return type")
print("7. Generic types (4 errors) - Fix type parameters")
print("8. Other complex types (8 errors) - Individual fixes")