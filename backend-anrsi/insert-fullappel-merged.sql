-- =====================================================
-- SQL Script to Insert fullappel-merged.json into Database
-- =====================================================
-- This script processes the JSON file and inserts it into the pages table
-- 
-- IMPORTANT: 
-- 1. Replace the JSON content below with your actual fullappel-merged.json content
-- 2. Images will remain as URLs (not downloaded automatically in SQL)
-- 3. Run this script in your PostgreSQL database
-- =====================================================

-- Step 1: Create a temporary function to process the JSON
-- This function will be used to transform the JSON structure

DO $$
DECLARE
    json_data JSONB;
    json_content TEXT;
    processed_content JSONB;
    fr_appels JSONB := '[]'::JSONB;
    ar_appels JSONB := '[]'::JSONB;
    en_appels JSONB := '[]'::JSONB;
    fr_content JSONB;
    ar_content JSONB;
    en_content JSONB;
    translations JSONB;
    final_content JSONB;
    item JSONB;
    fr_data JSONB;
    ar_data JSONB;
    en_data JSONB;
    image_url TEXT;
    appel_item JSONB;
    i INT;
    total_items INT;
BEGIN
    -- ============================================
    -- IMPORTANT: Replace this with your JSON content
    -- Read the fullappel-merged.json file and paste it here
    -- ============================================
    
    -- Option 1: If you can read from file (requires superuser)
    -- json_content := pg_read_file('/path/to/fullappel-merged.json');
    
    -- Option 2: Paste JSON content here (you'll need to escape single quotes)
    -- For now, this is a placeholder - you need to replace it with actual JSON
    json_content := '[]'; -- REPLACE THIS WITH YOUR JSON CONTENT
    
    -- Parse JSON
    json_data := json_content::JSONB;
    total_items := jsonb_array_length(json_data);
    
    RAISE NOTICE 'Processing % items from JSON', total_items;
    
    -- Process each item in the JSON array
    FOR i IN 0..total_items - 1 LOOP
        item := json_data->i;
        image_url := item->>'image';
        
        -- Process French
        IF item ? 'fr' THEN
            fr_data := item->'fr';
            appel_item := jsonb_build_object(
                'status', 'active',
                'title', COALESCE(fr_data->>'title', ''),
                'summary', COALESCE(fr_data->>'summary', ''),
                'description', CASE 
                    WHEN LENGTH(COALESCE(fr_data->>'full_text', '')) > 250 
                    THEN LEFT(COALESCE(fr_data->>'full_text', ''), 250) || '...'
                    ELSE COALESCE(fr_data->>'full_text', COALESCE(fr_data->>'summary', ''))
                END,
                'fullText', COALESCE(fr_data->>'full_text', ''),
                'imageUrl', COALESCE(image_url, ''),
                'details', jsonb_build_array(
                    jsonb_build_object(
                        'label', 'Date',
                        'value', COALESCE(fr_data->>'date', '')
                    )
                ),
                'actions', CASE 
                    WHEN item->>'url' IS NOT NULL AND item->>'url' != '' THEN
                        jsonb_build_array(
                            jsonb_build_object(
                                'text', 'En savoir plus',
                                'url', item->>'url',
                                'type', 'primary'
                            )
                        )
                    ELSE '[]'::JSONB
                END
            );
            fr_appels := fr_appels || jsonb_build_array(appel_item);
        END IF;
        
        -- Process Arabic (use French as fallback if missing)
        IF item ? 'ar' THEN
            ar_data := item->'ar';
            appel_item := jsonb_build_object(
                'status', 'active',
                'title', COALESCE(ar_data->>'title', ''),
                'summary', COALESCE(ar_data->>'summary', ''),
                'description', CASE 
                    WHEN LENGTH(COALESCE(ar_data->>'full_text', '')) > 250 
                    THEN LEFT(COALESCE(ar_data->>'full_text', ''), 250) || '...'
                    ELSE COALESCE(ar_data->>'full_text', COALESCE(ar_data->>'summary', ''))
                END,
                'fullText', COALESCE(ar_data->>'full_text', ''),
                'imageUrl', COALESCE(image_url, ''),
                'details', jsonb_build_array(
                    jsonb_build_object(
                        'label', 'التاريخ',
                        'value', COALESCE(ar_data->>'date', '')
                    )
                ),
                'actions', CASE 
                    WHEN item->>'url' IS NOT NULL AND item->>'url' != '' THEN
                        jsonb_build_array(
                            jsonb_build_object(
                                'text', 'المزيد',
                                'url', item->>'url',
                                'type', 'primary'
                            )
                        )
                    ELSE '[]'::JSONB
                END
            );
            ar_appels := ar_appels || jsonb_build_array(appel_item);
        ELSIF item ? 'fr' THEN
            -- Use French as fallback for Arabic
            fr_data := item->'fr';
            appel_item := jsonb_build_object(
                'status', 'active',
                'title', COALESCE(fr_data->>'title', ''),
                'summary', COALESCE(fr_data->>'summary', ''),
                'description', CASE 
                    WHEN LENGTH(COALESCE(fr_data->>'full_text', '')) > 250 
                    THEN LEFT(COALESCE(fr_data->>'full_text', ''), 250) || '...'
                    ELSE COALESCE(fr_data->>'full_text', COALESCE(fr_data->>'summary', ''))
                END,
                'fullText', COALESCE(fr_data->>'full_text', ''),
                'imageUrl', COALESCE(image_url, ''),
                'details', jsonb_build_array(
                    jsonb_build_object(
                        'label', 'التاريخ',
                        'value', COALESCE(fr_data->>'date', '')
                    )
                ),
                'actions', CASE 
                    WHEN item->>'url' IS NOT NULL AND item->>'url' != '' THEN
                        jsonb_build_array(
                            jsonb_build_object(
                                'text', 'المزيد',
                                'url', item->>'url',
                                'type', 'primary'
                            )
                        )
                    ELSE '[]'::JSONB
                END
            );
            ar_appels := ar_appels || jsonb_build_array(appel_item);
        END IF;
        
        -- Process English (use French as fallback if missing)
        IF item ? 'en' THEN
            en_data := item->'en';
            appel_item := jsonb_build_object(
                'status', 'active',
                'title', COALESCE(en_data->>'title', ''),
                'summary', COALESCE(en_data->>'summary', ''),
                'description', CASE 
                    WHEN LENGTH(COALESCE(en_data->>'full_text', '')) > 250 
                    THEN LEFT(COALESCE(en_data->>'full_text', ''), 250) || '...'
                    ELSE COALESCE(en_data->>'full_text', COALESCE(en_data->>'summary', ''))
                END,
                'fullText', COALESCE(en_data->>'full_text', ''),
                'imageUrl', COALESCE(image_url, ''),
                'details', jsonb_build_array(
                    jsonb_build_object(
                        'label', 'Date',
                        'value', COALESCE(en_data->>'date', '')
                    )
                ),
                'actions', CASE 
                    WHEN item->>'url' IS NOT NULL AND item->>'url' != '' THEN
                        jsonb_build_array(
                            jsonb_build_object(
                                'text', 'Learn more',
                                'url', item->>'url',
                                'type', 'primary'
                            )
                        )
                    ELSE '[]'::JSONB
                END
            );
            en_appels := en_appels || jsonb_build_array(appel_item);
        ELSIF item ? 'fr' THEN
            -- Use French as fallback for English
            fr_data := item->'fr';
            appel_item := jsonb_build_object(
                'status', 'active',
                'title', COALESCE(fr_data->>'title', ''),
                'summary', COALESCE(fr_data->>'summary', ''),
                'description', CASE 
                    WHEN LENGTH(COALESCE(fr_data->>'full_text', '')) > 250 
                    THEN LEFT(COALESCE(fr_data->>'full_text', ''), 250) || '...'
                    ELSE COALESCE(fr_data->>'full_text', COALESCE(fr_data->>'summary', ''))
                END,
                'fullText', COALESCE(fr_data->>'full_text', ''),
                'imageUrl', COALESCE(image_url, ''),
                'details', jsonb_build_array(
                    jsonb_build_object(
                        'label', 'Date',
                        'value', COALESCE(fr_data->>'date', '')
                    )
                ),
                'actions', CASE 
                    WHEN item->>'url' IS NOT NULL AND item->>'url' != '' THEN
                        jsonb_build_array(
                            jsonb_build_object(
                                'text', 'Learn more',
                                'url', item->>'url',
                                'type', 'primary'
                            )
                        )
                    ELSE '[]'::JSONB
                END
            );
            en_appels := en_appels || jsonb_build_array(appel_item);
        END IF;
    END LOOP;
    
    -- Build content structure
    fr_content := jsonb_build_object(
        'heroTitle', 'Appels à Candidatures',
        'heroSubtitle', 'Opportunités de recherche et d''innovation en Mauritanie',
        'introText', 'L''ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d''innovation qui contribuent au développement scientifique et technologique de la Mauritanie.',
        'appels', fr_appels,
        'categories', '[]'::JSONB,
        'processSteps', '[]'::JSONB,
        'criteria', '[]'::JSONB,
        'supportServices', '[]'::JSONB,
        'contactInfo', '[]'::JSONB
    );
    
    ar_content := jsonb_build_object(
        'heroTitle', 'دعوات التقديم',
        'heroSubtitle', 'فرص البحث والابتكار في موريتانيا',
        'introText', 'تطلق الوكالة الوطنية للبحث العلمي والابتكار بانتظام دعوات للتقديم لتمويل مشاريع البحث والابتكار التي تساهم في التنمية العلمية والتكنولوجية لموريتانيا.',
        'appels', ar_appels,
        'categories', '[]'::JSONB,
        'processSteps', '[]'::JSONB,
        'criteria', '[]'::JSONB,
        'supportServices', '[]'::JSONB,
        'contactInfo', '[]'::JSONB
    );
    
    en_content := jsonb_build_object(
        'heroTitle', 'Calls for Applications',
        'heroSubtitle', 'Research and innovation opportunities in Mauritania',
        'introText', 'ANRSI regularly launches calls for applications to fund research and innovation projects that contribute to the scientific and technological development of Mauritania.',
        'appels', en_appels,
        'categories', '[]'::JSONB,
        'processSteps', '[]'::JSONB,
        'criteria', '[]'::JSONB,
        'supportServices', '[]'::JSONB,
        'contactInfo', '[]'::JSONB
    );
    
    translations := jsonb_build_object(
        'fr', fr_content,
        'ar', ar_content,
        'en', en_content
    );
    
    final_content := jsonb_build_object('translations', translations);
    
    -- Insert or update the page
    INSERT INTO pages (
        slug,
        title,
        hero_title,
        hero_subtitle,
        content,
        page_type,
        is_published,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        'appels-candidatures',
        'Appels à Candidatures',
        'Appels à Candidatures',
        'Opportunités de recherche et d''innovation en Mauritanie',
        final_content::TEXT,
        'STRUCTURED',
        true,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (slug) 
    DO UPDATE SET
        title = EXCLUDED.title,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        content = EXCLUDED.content,
        page_type = EXCLUDED.page_type,
        is_published = EXCLUDED.is_published,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    
    RAISE NOTICE 'Import completed successfully!';
    RAISE NOTICE 'French appels: %', jsonb_array_length(fr_appels);
    RAISE NOTICE 'Arabic appels: %', jsonb_array_length(ar_appels);
    RAISE NOTICE 'English appels: %', jsonb_array_length(en_appels);
END $$;
