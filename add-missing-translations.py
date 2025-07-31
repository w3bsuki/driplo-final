import json
import sys

# Read existing messages
with open('messages/en.json', 'r') as f:
    messages = json.load(f)

# Read missing keys
missing_keys = []
with open('missing-translation-keys.txt', 'r') as f:
    for key in f:
        key = key.strip()
        if key and key not in messages:
            # Convert snake_case to proper title case
            display = key.replace('_', ' ').title()
            # Special formatting for common keys
            if key == 'full_name':
                display = 'Full Name'
            elif key == 'phone_number':
                display = 'Phone Number'
            elif key == 'address_line_1':
                display = 'Address Line 1'
            elif key == 'address_line_2':
                display = 'Address Line 2'
            elif key == 'postal_code':
                display = 'Postal Code'
            elif key == 'payment_method':
                display = 'Payment Method'
            elif key == 'shipping_address':
                display = 'Shipping Address'
            elif key == 'order_summary':
                display = 'Order Summary'
            elif key == 'card_details':
                display = 'Card Details'
            elif key == 'processing_payment':
                display = 'Processing Payment...'
            elif key == 'payment_successful':
                display = 'Payment Successful'
            elif key == 'payment_failed':
                display = 'Payment Failed'
            elif key == 'try_again':
                display = 'Try Again'
            elif key == 'close_modal':
                display = 'Close'
            elif key.startswith('_'):
                continue  # Skip invalid keys starting with underscore
            
            messages[key] = display
            missing_keys.append(key)

# Write updated messages
with open('messages/en.json', 'w') as f:
    json.dump(messages, f, indent='\t', ensure_ascii=False)

print(f"Added {len(missing_keys)} missing translation keys")
for key in missing_keys[:10]:
    print(f"  - {key}: {messages[key]}")
if len(missing_keys) > 10:
    print(f"  ... and {len(missing_keys) - 10} more")
