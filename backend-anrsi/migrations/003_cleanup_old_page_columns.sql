-- =====================================================
-- CLEANUP: Remove old columns from pages table
-- =====================================================
-- WARNING: Only run this AFTER verifying that migration 002 worked correctly!
-- This script removes the old columns that have been migrated to page_translations
-- 
-- BEFORE RUNNING:
-- 1. Verify all pages have translations in page_translations
-- 2. Test your application to ensure everything works
-- 3. Make a backup: pg_dump -U anrsiuser -d anrsidb > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql
-- =====================================================

BEGIN;

-- Verify that all pages have translations before proceeding
DO $$
DECLARE
    pages_without_translations INTEGER;
BEGIN
    SELECT COUNT(*) INTO pages_without_translations
    FROM pages p
    WHERE NOT EXISTS (
        SELECT 1 FROM page_translations pt 
        WHERE pt.page_id = p.id
    );
    
    IF pages_without_translations > 0 THEN
        RAISE EXCEPTION 'Cannot proceed: % pages do not have translations. Please fix this first.', pages_without_translations;
    END IF;
    
    RAISE NOTICE 'Verification passed: All pages have translations. Proceeding with cleanup...';
END $$;

-- Remove old columns (only if they exist)
ALTER TABLE pages DROP COLUMN IF EXISTS title;
ALTER TABLE pages DROP COLUMN IF EXISTS hero_title;
ALTER TABLE pages DROP COLUMN IF EXISTS hero_subtitle;
ALTER TABLE pages DROP COLUMN IF EXISTS content;
ALTER TABLE pages DROP COLUMN IF EXISTS metadata;

RAISE NOTICE 'Old columns removed successfully!';

COMMIT;

-- =====================================================
-- After running this script:
-- 1. Restart your Spring Boot application
-- 2. Test all page endpoints
-- 3. Verify that pages load correctly with translations
-- =====================================================

