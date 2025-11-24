# Article Import Guide

This guide explains how to import articles from JSON file(s) into the database with support for multiple language translations.

## Overview

The import functionality allows you to import articles from one or more JSON files containing node data. Articles are matched by `node_id` across different language files, and all available translations (FR, AR, EN) are merged into a single Article entity with multiple ArticleTranslation entries.

## JSON File Format

The JSON file should contain an array of nodes with the following structure:

```json
[
  {
    "node_id": 1310,
    "url": "https://anrsi.mr/fr/?q=fr/node/1310",
    "title": "Article Title",
    "date": "",
    "image": "https://anrsi.mr/image.jpg",
    "content_html": "<div>HTML content</div>",
    "content_text": "Plain text content"
  }
]
```

## Import Methods

### Method 1: Using REST API with Multiple Language Files (Recommended)

1. Start the backend application
2. Make a POST request to the import endpoint with multiple file paths:

**Import with French and Arabic translations:**

```bash
curl -X POST http://localhost:8080/api/articles/import \
  -H "Content-Type: application/json" \
  -d '{
    "filePaths": [      
      "/Users/mdia/Downloads/anrsi_nodes_ar (1).json",
      "/Users/mdia/Downloads/anrsi_nodes_1310_1586 (2).json"
    ]
  }'
```

**Single file (backward compatible):**

```bash
curl -X POST http://localhost:8080/api/articles/import \
  -H "Content-Type: application/json" \
  -d '{"filePath": "/Users/mdia/Downloads/anrsi_nodes_1310_1586 (1).json"}'
```

**Response:**
```json
{
  "success": true,
  "totalNodes": 277,
  "successCount": 277,
  "failureCount": 0,
  "errors": [],
  "filesProcessed": 3
}
```

### Method 2: Using the Import Script

The import script automatically detects and uses default files if they exist:

```bash
cd backend-anrsi
./import-articles.sh
```

Or specify custom file paths:

```bash
./import-articles.sh \
  "/path/to/french.json" \
  "/path/to/arabic.json" \
  "/path/to/english.json"
```

### Method 3: Using Java Code

You can also call the import service directly from Java code:

**Multiple files (recommended):**

```java
@Autowired
private ArticleImportService importService;

public void importArticles() {
    List<String> filePaths = List.of(
        "/Users/mdia/Downloads/anrsi_nodes_1310_1586 (1).json",
        "/Users/mdia/Downloads/anrsi_nodes_ar (1).json",
        "/Users/mdia/Downloads/anrsi_nodes_1310_1586 (2).json"
    );
    
    ArticleImportService.ImportResult result = 
        importService.importArticlesFromMultipleFiles(filePaths);
    
    System.out.println("Total nodes: " + result.getTotalNodes());
    System.out.println("Success: " + result.getSuccessCount());
    System.out.println("Failures: " + result.getFailureCount());
    if (!result.getErrors().isEmpty()) {
        System.out.println("Errors: " + result.getErrors());
    }
}
```

**Single file (backward compatible):**

```java
String filePath = "/Users/mdia/Downloads/anrsi_nodes_1310_1586 (1).json";
ArticleImportService.ImportResult result = importService.importArticlesFromJson(filePath);
```

## Import Logic

The import service performs the following transformations:

### Multi-File Processing

1. **File Reading**: Reads all provided JSON files
2. **Node Grouping**: Groups nodes by `node_id` across all files
3. **Language Detection**: Determines the language from the URL for each node:
   - URLs containing `/ar/` or `/?q=ar/` → Arabic (AR)
   - URLs containing `/en/` or `/?q=en/` → English (EN)
   - Default → French (FR)
4. **Article Merging**: Creates one Article per unique `node_id` with all available translations

### Article Creation

- `author`: Set to "ANRSI" (default)
- `publishDate`: Uses the earliest date found across all translations, or current date if none found
- `imageUrl`: Uses the first non-empty image URL found across all translations
- `published`: Set to `true`
- `featured`: Set to `false`

### Translation Creation

For each language found for a given `node_id`:
- `title`: From `title` field
- `content`: From `content_html` (preferred) or `content_text`
- `excerpt`: First 200 characters of `content_text` or stripped HTML from `content_html`
- Translations with missing title or content are skipped

### Example

If you have:
- `node_id: 1310` in French file → Creates Article with FR translation
- `node_id: 1310` in Arabic file → Adds AR translation to the same Article
- `node_id: 1310` in English file → Adds EN translation to the same Article

Result: One Article with 3 translations (FR, AR, EN)

## Notes

- **Multi-language Support**: Articles are automatically matched by `node_id` across different language files. If the same `node_id` appears in multiple files, all translations will be merged into a single article.
- **Duplicate Handling**: The import will create new articles. If you need to avoid duplicates, you may want to check for existing articles by node_id (this would require adding a node_id field to the Article entity).
- **Missing Translations**: If a translation is missing title or content, it will be skipped, but the article will still be created with available translations.
- **Default Values**: 
  - All articles are imported as published by default
  - The default author is "ANRSI" - you can modify this in the `ArticleImportService.importArticleWithTranslations()` method
  - If a date cannot be parsed, the current date/time will be used
- **Image URLs**: The first non-empty image URL found across all translations will be used for the article

## Troubleshooting

### File Not Found
- Ensure the file path is absolute or relative to the application's working directory
- Check file permissions

### Import Errors
- Check the `errors` array in the response for specific node errors
- Verify the JSON file format is correct
- Ensure the database connection is working

### Duplicate Articles
- The current implementation doesn't check for duplicates
- You may want to clear existing articles before importing, or add duplicate detection logic

