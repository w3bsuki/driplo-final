#\!/bin/bash
while read -r key; do
  # Convert snake_case to readable text  
  display=$(echo "$key" | sed 's/_/ /g' | sed 's/\b./\U&/g')
  echo "  \"$key\": \"$display\","
done < missing-translation-keys.txt
