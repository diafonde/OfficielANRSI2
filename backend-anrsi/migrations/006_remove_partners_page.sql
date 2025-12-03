-- Script to remove partners page and its translations
-- This script deletes the partners page and all associated translations

BEGIN;

-- Step 1: Delete all translations for the partners page
DELETE FROM page_translations 
WHERE page_id IN (SELECT id FROM pages WHERE slug = 'partners');

-- Step 2: Delete the partners page
DELETE FROM pages 
WHERE slug = 'partners';

-- Verify deletion
DO $$
DECLARE
    remaining_partners INTEGER;
    remaining_translations INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_partners FROM pages WHERE slug = 'partners';
    SELECT COUNT(*) INTO remaining_translations FROM page_translations 
    WHERE page_id IN (SELECT id FROM pages WHERE slug = 'partners');
    
    IF remaining_partners = 0 AND remaining_translations = 0 THEN
        RAISE NOTICE '✓ Partners page and all translations successfully deleted';
    ELSE
        RAISE WARNING 'Partners page deletion incomplete. Remaining: % pages, % translations', 
            remaining_partners, remaining_translations;
    END IF;
END $$;

COMMIT;
