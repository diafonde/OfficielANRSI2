# Database Migration: Replace JSON with Normalized Tables

## Overview
This migration replaces the JSON storage in the `pages.content` column with normalized database tables for better data integrity, queryability, and maintainability.

## What Changed

### New Tables Created
1. **page_translations** - Stores multilingual page content (title, heroTitle, heroSubtitle, content)
2. **page_videos** - Stores video metadata (url, type, display_order)
3. **page_video_translations** - Stores multilingual video titles and descriptions
4. **page_photos** - Stores photo metadata (url, display_order)
5. **page_photo_translations** - Stores multilingual photo titles and descriptions

### Entity Classes Created
- `PageTranslation.java`
- `PageVideo.java`
- `PageVideoTranslation.java`
- `PagePhoto.java`
- `PagePhotoTranslation.java`

### Updated Classes
- `Page.java` - Added relationships to translations, videos, and photos
- `PageDTO.java` - Now includes normalized data structure
- `PageService.java` - Updated to load relationships

## Migration Steps

### 1. Backup Your Database
```bash
pg_dump -U anrsiuser -d anrsidb > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Run the Migration Script
```bash
cd backend-anrsi
psql -U anrsiuser -d anrsidb -f migrations/001_replace_json_with_normalized_tables.sql
```

### 3. Verify Migration
The script will output:
- Number of page translations created
- Number of videos migrated
- Number of photos migrated

### 4. Test Your Application
- Start your backend application
- Test page retrieval endpoints
- Verify videos and photos are displayed correctly

## Data Safety

✅ **Your original data is SAFE:**
- The migration script only **READS** from the JSON column
- It **COPIES** data to new tables
- The original `content` column remains untouched
- You can rollback by dropping the new tables if needed

## Backward Compatibility

The implementation maintains backward compatibility:
- Old `content` JSON column is still present (can be removed later)
- `title`, `heroTitle`, `heroSubtitle` fields are kept for compatibility
- Frontend can still work with old JSON format during transition

## Rollback (if needed)

If you need to rollback:
```sql
BEGIN;
DROP TABLE IF EXISTS page_photo_translations CASCADE;
DROP TABLE IF EXISTS page_photos CASCADE;
DROP TABLE IF EXISTS page_video_translations CASCADE;
DROP TABLE IF EXISTS page_videos CASCADE;
DROP TABLE IF EXISTS page_translations CASCADE;
COMMIT;
```

Your original JSON data in `pages.content` will still be there!

## Next Steps

1. After verifying everything works, you can update your frontend to use the new structure
2. Once frontend is updated, you can optionally remove the `content` column:
   ```sql
   ALTER TABLE pages DROP COLUMN content;
   ```

## Benefits

- ✅ No JSON parsing needed
- ✅ Direct database queries
- ✅ Type-safe relationships
- ✅ Better performance with indexes
- ✅ Easier to maintain and update
- ✅ Proper multilingual support

