-- Script to align database schema with target structure
-- This script:
-- 1. Renames page_type to type in pages table
-- 2. Renames language to lang in page_translations table
-- 3. Ensures ordre is set for all pages
-- 4. Moves JSON content from content to extra in page_translations
-- 5. Cleans up old columns from pages table (title, hero_title, hero_subtitle, content, metadata)

BEGIN;

-- Step 1: Rename page_type to type in pages table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'page_type'
    ) THEN
        ALTER TABLE pages RENAME COLUMN page_type TO type;
        RAISE NOTICE 'Renamed page_type to type in pages table';
    ELSE
        RAISE NOTICE 'Column type already exists or page_type does not exist';
    END IF;
END $$;

-- Step 2: Rename language to lang in page_translations table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_translations' AND column_name = 'language'
    ) THEN
        -- Drop the unique constraint that uses language
        ALTER TABLE page_translations DROP CONSTRAINT IF EXISTS ukg2d6o95ef155c6cwlqeci363b;
        ALTER TABLE page_translations DROP CONSTRAINT IF EXISTS page_translations_page_id_language_key;
        
        -- Rename the column
        ALTER TABLE page_translations RENAME COLUMN language TO lang;
        
        -- Recreate the unique constraint with the new column name
        ALTER TABLE page_translations ADD CONSTRAINT page_translations_page_id_lang_key 
            UNIQUE (page_id, lang);
        
        -- Update the check constraint if it exists
        ALTER TABLE page_translations DROP CONSTRAINT IF EXISTS page_translations_language_check;
        ALTER TABLE page_translations ADD CONSTRAINT page_translations_lang_check 
            CHECK (lang::text = ANY (ARRAY['FR'::character varying, 'AR'::character varying, 'EN'::character varying]::text[]));
        
        RAISE NOTICE 'Renamed language to lang in page_translations table';
    ELSE
        RAISE NOTICE 'Column lang already exists or language does not exist';
    END IF;
END $$;

-- Step 3: Set ordre for pages that don't have it
UPDATE pages
SET ordre = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
    FROM pages
    WHERE ordre IS NULL
) AS subquery
WHERE pages.id = subquery.id AND pages.ordre IS NULL;

-- Step 4: Move JSON content from content to extra in page_translations
-- Only for rows where content is valid JSON and extra is NULL
UPDATE page_translations
SET 
    extra = CASE 
        WHEN content IS NOT NULL AND content ~ '^[\s]*[\[\{]' THEN content::jsonb
        ELSE extra
    END,
    content = CASE 
        WHEN content IS NOT NULL AND content ~ '^[\s]*[\[\{]' THEN NULL
        ELSE content
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE content IS NOT NULL 
  AND content ~ '^[\s]*[\[\{]'
  AND (extra IS NULL OR extra = 'null'::jsonb);

-- Step 5: Extract introText from JSON and populate intro_text
UPDATE page_translations
SET 
    intro_text = COALESCE(
        intro_text,
        CASE 
            WHEN extra IS NOT NULL AND jsonb_typeof(extra) = 'object' THEN extra->>'introText'
            ELSE NULL
        END
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE extra IS NOT NULL 
  AND intro_text IS NULL
  AND jsonb_typeof(extra) = 'object'
  AND extra ? 'introText';

-- Step 6: Clean up old columns from pages table (after data migration)
-- First, verify all pages have translations
DO $$
DECLARE
    pages_without_translations INTEGER;
BEGIN
    SELECT COUNT(*) INTO pages_without_translations
    FROM pages p
    WHERE NOT EXISTS (
        SELECT 1 FROM page_translations pt WHERE pt.page_id = p.id
    );
    
    IF pages_without_translations > 0 THEN
        RAISE WARNING 'Found % pages without translations. Skipping cleanup of old columns.', pages_without_translations;
    ELSE
        -- Drop old columns from pages table
        ALTER TABLE pages DROP COLUMN IF EXISTS title;
        ALTER TABLE pages DROP COLUMN IF EXISTS hero_title;
        ALTER TABLE pages DROP COLUMN IF EXISTS hero_subtitle;
        ALTER TABLE pages DROP COLUMN IF EXISTS content;
        ALTER TABLE pages DROP COLUMN IF EXISTS metadata;
        RAISE NOTICE 'Cleaned up old columns from pages table';
    END IF;
END $$;

COMMIT;

-- Display summary
DO $$
DECLARE
    total_pages INTEGER;
    total_translations INTEGER;
    pages_with_ordre INTEGER;
    translations_with_extra INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_pages FROM pages;
    SELECT COUNT(*) INTO total_translations FROM page_translations;
    SELECT COUNT(*) INTO pages_with_ordre FROM pages WHERE ordre IS NOT NULL;
    SELECT COUNT(*) INTO translations_with_extra FROM page_translations WHERE extra IS NOT NULL;
    
    RAISE NOTICE '=== Migration Summary ===';
    RAISE NOTICE 'Total pages: %', total_pages;
    RAISE NOTICE 'Total translations: %', total_translations;
    RAISE NOTICE 'Pages with ordre set: %', pages_with_ordre;
    RAISE NOTICE 'Translations with extra (JSONB): %', translations_with_extra;
END $$;

