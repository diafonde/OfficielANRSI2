-- =====================================================
-- MIGRATION: Migrate Page fields to PageTranslation
-- =====================================================
-- This script:
-- 1. Adds new columns to page_translations (section_title, intro_text, description, extra)
-- 2. Adds new columns to pages (ordre, parent_id)
-- 3. Migrates existing data from pages.title, pages.hero_title, pages.hero_subtitle 
--    to page_translations (as FR translation by default)
-- 4. KEEPS original columns as backup (you can remove them later after verification)
-- 5. SAFE: Only reads and copies data, doesn't delete anything

BEGIN;

-- Step 1: Add new columns to page_translations table
DO $$
BEGIN
    -- Add section_title if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_translations' AND column_name = 'section_title'
    ) THEN
        ALTER TABLE page_translations ADD COLUMN section_title TEXT;
        RAISE NOTICE 'Added column section_title to page_translations';
    END IF;

    -- Add intro_text if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_translations' AND column_name = 'intro_text'
    ) THEN
        ALTER TABLE page_translations ADD COLUMN intro_text TEXT;
        RAISE NOTICE 'Added column intro_text to page_translations';
    END IF;

    -- Add description if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_translations' AND column_name = 'description'
    ) THEN
        ALTER TABLE page_translations ADD COLUMN description TEXT;
        RAISE NOTICE 'Added column description to page_translations';
    END IF;

    -- Add extra (JSONB) if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'page_translations' AND column_name = 'extra'
    ) THEN
        ALTER TABLE page_translations ADD COLUMN extra JSONB;
        RAISE NOTICE 'Added column extra to page_translations';
    END IF;
END $$;

-- Step 2: Add new columns to pages table
DO $$
BEGIN
    -- Add ordre if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'ordre'
    ) THEN
        ALTER TABLE pages ADD COLUMN ordre INTEGER;
        RAISE NOTICE 'Added column ordre to pages';
    END IF;

    -- Add parent_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'parent_id'
    ) THEN
        ALTER TABLE pages ADD COLUMN parent_id BIGINT;
        RAISE NOTICE 'Added column parent_id to pages';
    END IF;
END $$;

-- Step 3: Migrate data from pages to page_translations
-- This creates FR translations for pages that don't have translations yet
DO $$
DECLARE
    page_rec RECORD;
    translation_exists BOOLEAN;
    migrated_count INTEGER := 0;
    skipped_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting data migration from pages to page_translations...';
    
    FOR page_rec IN 
        SELECT 
            id, 
            title, 
            hero_title, 
            hero_subtitle,
            content,
            metadata
        FROM pages
        WHERE id IS NOT NULL
    LOOP
        -- Check if FR translation already exists for this page
        SELECT EXISTS(
            SELECT 1 FROM page_translations 
            WHERE page_id = page_rec.id AND language = 'FR'
        ) INTO translation_exists;
        
        -- Only migrate if no FR translation exists and page has data to migrate
        IF NOT translation_exists AND (
            page_rec.title IS NOT NULL OR 
            page_rec.hero_title IS NOT NULL OR 
            page_rec.hero_subtitle IS NOT NULL OR
            page_rec.content IS NOT NULL
        ) THEN
            -- Insert FR translation with data from pages table
            INSERT INTO page_translations (
                page_id,
                language,
                title,
                hero_title,
                hero_subtitle,
                content,
                extra,
                created_at,
                updated_at
            ) VALUES (
                page_rec.id,
                'FR',
                COALESCE(page_rec.title, 'Untitled'),
                page_rec.hero_title,
                page_rec.hero_subtitle,
                page_rec.content,
                CASE 
                    WHEN page_rec.metadata IS NOT NULL AND page_rec.metadata::text != '' THEN 
                        CASE 
                            WHEN page_rec.metadata::text ~ '^[\s]*[\[\{]' THEN 
                                CASE 
                                    WHEN page_rec.metadata::text::jsonb IS NOT NULL THEN page_rec.metadata::text::jsonb
                                    ELSE NULL
                                END
                            ELSE NULL
                        END
                    ELSE NULL
                END,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (page_id, language) DO NOTHING;
            
            migrated_count := migrated_count + 1;
            RAISE NOTICE 'Migrated page ID % (slug: %)', page_rec.id, (SELECT slug FROM pages WHERE id = page_rec.id);
        ELSE
            skipped_count := skipped_count + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Migration completed!';
    RAISE NOTICE 'Pages migrated: %', migrated_count;
    RAISE NOTICE 'Pages skipped (already have translations): %', skipped_count;
END $$;

-- Step 4: Create index on ordre for better performance
CREATE INDEX IF NOT EXISTS idx_pages_ordre ON pages(ordre);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);

-- Step 5: Verify migration
DO $$
DECLARE
    pages_without_translations INTEGER;
    total_pages INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_pages FROM pages;
    
    SELECT COUNT(*) INTO pages_without_translations
    FROM pages p
    WHERE NOT EXISTS (
        SELECT 1 FROM page_translations pt 
        WHERE pt.page_id = p.id
    );
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration Verification:';
    RAISE NOTICE 'Total pages: %', total_pages;
    RAISE NOTICE 'Pages without translations: %', pages_without_translations;
    
    IF pages_without_translations > 0 THEN
        RAISE WARNING 'Some pages do not have translations. Please review manually.';
    ELSE
        RAISE NOTICE 'All pages have at least one translation!';
    END IF;
    RAISE NOTICE '========================================';
END $$;

COMMIT;

-- =====================================================
-- IMPORTANT NOTES:
-- =====================================================
-- 1. This script DOES NOT DELETE the old columns (title, hero_title, hero_subtitle, content, metadata)
-- 2. The old columns remain as backup - you can verify the migration worked correctly
-- 3. After verification, you can manually drop the old columns:
--    ALTER TABLE pages DROP COLUMN IF EXISTS title;
--    ALTER TABLE pages DROP COLUMN IF EXISTS hero_title;
--    ALTER TABLE pages DROP COLUMN IF EXISTS hero_subtitle;
--    ALTER TABLE pages DROP COLUMN IF EXISTS content;
--    ALTER TABLE pages DROP COLUMN IF EXISTS metadata;
-- 4. Or create a separate cleanup script to remove them later
-- =====================================================
