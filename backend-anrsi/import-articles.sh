#!/bin/bash

# Script to import articles from JSON file(s) with translations
# Usage: 
#   Single file: ./import-articles.sh [path-to-json-file]
#   Multiple files: ./import-articles.sh [file1] [file2] [file3] ...

# Default file paths (French, Arabic, and second French file)
DEFAULT_FR_FILE="/Users/mdia/Downloads/anrsi_nodes_1310_1586 (1).json"
DEFAULT_AR_FILE="/Users/mdia/Downloads/anrsi_nodes_ar (1).json"
DEFAULT_FR2_FILE="/Users/mdia/Downloads/anrsi_nodes_1310_1586 (2).json"

# Check if backend is running
if ! curl -s http://localhost:8080/api/articles > /dev/null 2>&1; then
    echo "Error: Backend server is not running on http://localhost:8080"
    echo "Please start the backend server first."
    exit 1
fi

# Determine which files to use
if [ $# -eq 0 ]; then
    # No arguments: use default files if they exist
    FILES=()
    if [ -f "$DEFAULT_FR_FILE" ]; then
        FILES+=("$DEFAULT_FR_FILE")
    fi
    if [ -f "$DEFAULT_AR_FILE" ]; then
        FILES+=("$DEFAULT_AR_FILE")
    fi
    if [ -f "$DEFAULT_FR2_FILE" ]; then
        FILES+=("$DEFAULT_FR2_FILE")
    fi
    
    if [ ${#FILES[@]} -eq 0 ]; then
        echo "Error: No default files found and no files specified"
        echo "Usage: ./import-articles.sh [file1] [file2] [file3] ..."
        echo "Or place default files in:"
        echo "  - $DEFAULT_FR_FILE"
        echo "  - $DEFAULT_AR_FILE"
        echo "  - $DEFAULT_FR2_FILE"
        exit 1
    fi
else
    # Use provided file paths
    FILES=("$@")
fi

# Validate all files exist
for FILE_PATH in "${FILES[@]}"; do
    if [ ! -f "$FILE_PATH" ]; then
        echo "Error: File not found: $FILE_PATH"
        exit 1
    fi
done

echo "Importing articles from ${#FILES[@]} file(s):"
for FILE_PATH in "${FILES[@]}"; do
    echo "  - $FILE_PATH"
done
echo ""

# Count total articles to import (approximate)
TOTAL_NODES=0
for FILE_PATH in "${FILES[@]}"; do
    if command -v jq &> /dev/null; then
        COUNT=$(jq 'length' "$FILE_PATH" 2>/dev/null || echo "0")
        TOTAL_NODES=$((TOTAL_NODES + COUNT))
    fi
done

if [ $TOTAL_NODES -gt 0 ]; then
    echo "Found approximately $TOTAL_NODES articles to import"
    echo "Note: This may take several minutes as images are being downloaded..."
    echo ""
fi

# Build JSON array of file paths
JSON_PATHS="["
for i in "${!FILES[@]}"; do
    if [ $i -gt 0 ]; then
        JSON_PATHS+=", "
    fi
    JSON_PATHS+="\"${FILES[$i]}\""
done
JSON_PATHS+="]"

# Show progress indicator
echo "Starting import... (this may take a while)"
echo ""

# Make the import request with timeout and progress
RESPONSE=$(curl -s --max-time 3600 -X POST http://localhost:8080/api/articles/import \
  -H "Content-Type: application/json" \
  -d "{\"filePaths\": $JSON_PATHS}" \
  --write-out "\nHTTP_CODE:%{http_code}\nTIME_TOTAL:%{time_total}\n")

# Extract HTTP code and response body
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d' | sed '/TIME_TOTAL:/d')

# Check if curl was successful
if [ $? -ne 0 ] || [ -z "$HTTP_CODE" ]; then
    echo "Error: Failed to connect to the backend server or request timed out"
    echo "Make sure the backend is running and try again"
    exit 1
fi

# Check HTTP status code
if [ "$HTTP_CODE" != "200" ]; then
    echo "Error: Import failed with HTTP status code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
    exit 1
fi

# Parse and display results (requires jq for pretty printing, fallback to raw output)
echo "Import Results:"
echo "==============="
if command -v jq &> /dev/null; then
    echo "$RESPONSE_BODY" | jq .
    
    # Extract and display summary if available
    if echo "$RESPONSE_BODY" | jq -e '.successCount' > /dev/null 2>&1; then
        SUCCESS=$(echo "$RESPONSE_BODY" | jq -r '.successCount')
        TOTAL=$(echo "$RESPONSE_BODY" | jq -r '.totalNodes')
        FAILURES=$(echo "$RESPONSE_BODY" | jq -r '.failureCount')
        echo ""
        echo "Summary:"
        echo "  Total nodes: $TOTAL"
        echo "  Successfully imported: $SUCCESS"
        echo "  Failed: $FAILURES"
        
        if [ "$FAILURES" -gt 0 ]; then
            echo ""
            echo "Errors:"
            echo "$RESPONSE_BODY" | jq -r '.errors[]?' 2>/dev/null | while read -r error; do
                echo "  - $error"
            done
        fi
    fi
else
    echo "$RESPONSE_BODY"
fi

echo ""
echo "Import completed!"

