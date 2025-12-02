# Import Appels Candidatures

This document explains how to import appels candidatures (calls for applications) from JSON files into the database.

## Methods

### Method 1: Frontend Import (Recommended)

1. Start your application
2. Log in as admin
3. Navigate to the admin panel → Pages → Appels à Candidatures
4. Click "Importer des fichiers JSON"
5. Select your JSON file(s)
6. The system will:
   - Import all translations (if available)
   - Download images automatically
   - Add appels to each language tab

**Supported JSON Formats:**

**Format 1: With translations (fr/ar/en)**
```json
[
  {
    "fr": {
      "title": "...",
      "summary": "...",
      "date": "..."
    },
    "ar": {
      "title": "...",
      "summary": "...",
      "date": "..."
    },
    "en": {
      "title": "...",
      "summary": "...",
      "date": "..."
    },
    "image": "https://...",
    "url": "https://..."
  }
]
```

**Format 2: Single language**
```json
[
  {
    "title": "...",
    "summary": "...",
    "date": "...",
    "image": "https://...",
    "url": "https://..."
  }
]
```

### Method 2: Backend API Import

1. Make sure your backend is running
2. Get your admin JWT token
3. Run the import script:

```bash
# Set your admin token
export ADMIN_TOKEN="your-jwt-token-here"

# Run import
./import-appels-candidatures.sh appelalacandidature.json
```

Or use curl directly:

```bash
curl -X POST "http://localhost:8080/api/admin/appels-candidatures/import?filePath=/absolute/path/to/appelalacandidature.json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Method 3: Automatic Import on Startup

Add to `application.properties`:

```properties
app.import.appels-candidatures=true
app.import.appels-candidatures.file=appelalacandidature.json
```

The file will be imported automatically when the application starts.

## File Location

Place your JSON file in one of these locations:
- `backend-anrsi/appelalacandidature.json` (project root)
- Current working directory
- Or specify absolute path in the API call

## Notes

- **Images**: Images from URLs will be automatically downloaded and stored locally in the `uploads/` directory
- **3 Languages**: The system always creates entries for all 3 languages (French, Arabic, English):
  - If JSON has translations (fr/ar/en structure), each language gets its own content
  - If JSON is single language, the same content is used for all 3 languages
- **Image Sharing**: Images are shared across all languages (downloaded once per item)
- **Existing Content**: Existing page content will be updated, not replaced (unless you delete it first)
- **Supported Formats**: 
  - New format: With translations (fr/ar/en keys)
  - Old format: Single language (content used for all languages)

## Troubleshooting

- **File not found**: Make sure the file path is correct and accessible
- **Authentication error**: Make sure you're using a valid admin JWT token
- **Import fails**: Check the logs for detailed error messages
- **Images not downloading**: Some images may fail due to CORS restrictions - they will keep original URLs
