#!/bin/bash

# Script to import appels candidatures from JSON file
# Usage: ./import-appels-candidatures.sh [file-path]

FILE_PATH="${1:-appelalacandidature.json}"
BASE_URL="${2:-http://localhost:8080}"

# Get absolute path
if [[ ! "$FILE_PATH" = /* ]]; then
    FILE_PATH="$(pwd)/$FILE_PATH"
fi

echo "Importing appels candidatures from: $FILE_PATH"
echo "API URL: $BASE_URL"

# You need to be authenticated as ADMIN
# Replace YOUR_ADMIN_TOKEN with your actual JWT token
TOKEN="${ADMIN_TOKEN:-YOUR_ADMIN_TOKEN}"

curl -X POST "$BASE_URL/api/admin/appels-candidatures/import?filePath=$FILE_PATH" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

echo ""
echo "Import completed. Check the response above for status."

