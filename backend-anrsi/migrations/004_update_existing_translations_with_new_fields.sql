-- Script to update existing page_translations with new fields
-- This extracts data from the JSON content and populates sectionTitle, introText, description, extra
-- Run this after the DataInitializer has created the basic translations

DO $$
DECLARE
    translation_rec RECORD;
    json_data JSONB;
    intro_text_value TEXT;
    section_title_value TEXT;
    description_value TEXT;
    updated_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting update of existing translations with new fields...';
    
    -- Loop through all translations that have content (JSON)
    FOR translation_rec IN 
        SELECT pt.id, pt.page_id, pt.language, pt.content
        FROM page_translations pt
        WHERE pt.content IS NOT NULL AND pt.content != ''
        AND (pt.section_title IS NULL OR pt.intro_text IS NULL OR pt.description IS NULL OR pt.extra IS NULL)
    LOOP
        BEGIN
            -- Try to parse content as JSON
            json_data := translation_rec.content::jsonb;
            
            -- Extract introText from JSON
            intro_text_value := json_data->>'introText';
            
            -- Extract sectionTitle if it exists
            section_title_value := json_data->>'sectionTitle';
            
            -- Extract description if it exists
            description_value := json_data->>'description';
            
            -- Update the translation with extracted values
            UPDATE page_translations
            SET 
                intro_text = COALESCE(intro_text_value, intro_text),
                section_title = COALESCE(section_title_value, section_title),
                description = COALESCE(description_value, description),
                extra = CASE 
                    WHEN json_data IS NOT NULL THEN json_data::text::jsonb
                    ELSE extra
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = translation_rec.id
            AND (
                intro_text IS NULL OR 
                section_title IS NULL OR 
                description IS NULL OR 
                extra IS NULL OR
                (intro_text_value IS NOT NULL AND (intro_text IS NULL OR intro_text != intro_text_value)) OR
                (section_title_value IS NOT NULL AND (section_title IS NULL OR section_title != section_title_value)) OR
                (description_value IS NOT NULL AND (description IS NULL OR description != description_value))
            );
            
            IF FOUND THEN
                updated_count := updated_count + 1;
                RAISE NOTICE 'Updated translation ID % (page_id: %, language: %)', 
                    translation_rec.id, translation_rec.page_id, translation_rec.language;
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            -- Skip translations where content is not valid JSON
            RAISE NOTICE 'Skipping translation ID % (content is not valid JSON): %', 
                translation_rec.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Update completed!';
    RAISE NOTICE 'Translations updated: %', updated_count;
END $$;

-- Also set ordre for pages that don't have it set
DO $$
DECLARE
    pages_updated INTEGER;
BEGIN
    UPDATE pages
    SET ordre = subquery.row_num
    FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
        FROM pages
        WHERE ordre IS NULL
    ) AS subquery
    WHERE pages.id = subquery.id;
    
    GET DIAGNOSTICS pages_updated = ROW_COUNT;
    RAISE NOTICE 'Set ordre for % pages that were missing it', pages_updated;
END $$;
