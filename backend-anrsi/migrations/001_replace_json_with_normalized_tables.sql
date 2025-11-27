-- =====================================================
-- MIGRATION: Replace JSON with Normalized Tables
-- =====================================================
-- This script:
-- 1. Creates new normalized tables
-- 2. Migrates data from JSON to new tables
-- 3. KEEPS the original JSON column as backup
-- 4. You can verify and remove JSON later

BEGIN;

-- Step 1: Create new normalized tables (doesn't affect existing data)
CREATE TABLE IF NOT EXISTS page_translations (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT NOT NULL,
    language VARCHAR(10) NOT NULL CHECK (language IN ('FR', 'AR', 'EN')),
    title VARCHAR(255) NOT NULL,
    hero_title TEXT,
    hero_subtitle TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_translations_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    CONSTRAINT uk_page_translations UNIQUE (page_id, language)
);

CREATE TABLE IF NOT EXISTS page_videos (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'YOUTUBE' CHECK (type IN ('YOUTUBE', 'VIMEO', 'FILE', 'OTHER')),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_videos_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_video_translations (
    id BIGSERIAL PRIMARY KEY,
    page_video_id BIGINT NOT NULL,
    language VARCHAR(10) NOT NULL CHECK (language IN ('FR', 'AR', 'EN')),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_video_translations FOREIGN KEY (page_video_id) REFERENCES page_videos(id) ON DELETE CASCADE,
    CONSTRAINT uk_page_video_translations UNIQUE (page_video_id, language)
);

CREATE TABLE IF NOT EXISTS page_photos (
    id BIGSERIAL PRIMARY KEY,
    page_id BIGINT NOT NULL,
    url VARCHAR(1000) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_photos_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS page_photo_translations (
    id BIGSERIAL PRIMARY KEY,
    page_photo_id BIGINT NOT NULL,
    language VARCHAR(10) NOT NULL CHECK (language IN ('FR', 'AR', 'EN')),
    title VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_photo_translations FOREIGN KEY (page_photo_id) REFERENCES page_photos(id) ON DELETE CASCADE,
    CONSTRAINT uk_page_photo_translations UNIQUE (page_photo_id, language)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_translations_page_id ON page_translations(page_id);
CREATE INDEX IF NOT EXISTS idx_page_videos_page_id ON page_videos(page_id);
CREATE INDEX IF NOT EXISTS idx_page_videos_display_order ON page_videos(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_page_photos_page_id ON page_photos(page_id);
CREATE INDEX IF NOT EXISTS idx_page_photos_display_order ON page_photos(page_id, display_order);

-- Step 2: Migrate data from JSON to new tables
-- This READS from the JSON column and WRITES to new tables
-- Original JSON data remains untouched!
DO $$
DECLARE
    page_rec RECORD;
    content_json JSONB;
    video_item JSONB;
    photo_item JSONB;
    video_id BIGINT;
    photo_id BIGINT;
    video_order INTEGER;
    photo_order INTEGER;
    lang_code TEXT;
    lang_content JSONB;
    migrated_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    FOR page_rec IN SELECT id, title, hero_title, hero_subtitle, content FROM pages WHERE content IS NOT NULL
    LOOP
        BEGIN
            -- Parse JSON content (READ ONLY - doesn't modify original)
            content_json := page_rec.content::JSONB;
            
            -- Create page translation from existing page data
            INSERT INTO page_translations (page_id, language, title, hero_title, hero_subtitle, created_at, updated_at)
            VALUES (
                page_rec.id,
                'FR',
                COALESCE(page_rec.title, ''),
                page_rec.hero_title,
                page_rec.hero_subtitle,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT (page_id, language) DO NOTHING;
            
            -- Check if content has translations structure
            IF content_json ? 'translations' THEN
                -- New format with translations
                FOR lang_code IN SELECT jsonb_object_keys(content_json->'translations')
                LOOP
                    lang_content := content_json->'translations'->lang_code;
                    
                    -- Update or create translation
                    INSERT INTO page_translations (page_id, language, title, hero_title, hero_subtitle, created_at, updated_at)
                    VALUES (
                        page_rec.id,
                        UPPER(lang_code),
                        COALESCE(lang_content->>'heroTitle', page_rec.title, ''),
                        lang_content->>'heroTitle',
                        lang_content->>'heroSubtitle',
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    )
                    ON CONFLICT (page_id, language) DO UPDATE
                    SET title = EXCLUDED.title,
                        hero_title = EXCLUDED.hero_title,
                        hero_subtitle = EXCLUDED.hero_subtitle,
                        updated_at = CURRENT_TIMESTAMP;
                    
                    -- Migrate videos
                    IF lang_content ? 'videos' AND jsonb_typeof(lang_content->'videos') = 'array' THEN
                        video_order := 0;
                        FOR video_item IN SELECT * FROM jsonb_array_elements(lang_content->'videos')
                        LOOP
                            INSERT INTO page_videos (page_id, url, type, display_order, created_at)
                            VALUES (
                                page_rec.id,
                                video_item->>'url',
                                UPPER(COALESCE(video_item->>'type', 'YOUTUBE')),
                                video_order,
                                CURRENT_TIMESTAMP
                            )
                            RETURNING id INTO video_id;
                            
                            INSERT INTO page_video_translations 
                                (page_video_id, language, title, description, created_at, updated_at)
                            VALUES (
                                video_id,
                                UPPER(lang_code),
                                COALESCE(video_item->>'title', ''),
                                video_item->>'description',
                                CURRENT_TIMESTAMP,
                                CURRENT_TIMESTAMP
                            );
                            
                            video_order := video_order + 1;
                        END LOOP;
                    END IF;
                    
                    -- Migrate photos
                    IF lang_content ? 'photos' AND jsonb_typeof(lang_content->'photos') = 'array' THEN
                        photo_order := 0;
                        FOR photo_item IN SELECT * FROM jsonb_array_elements(lang_content->'photos')
                        LOOP
                            INSERT INTO page_photos (page_id, url, display_order, created_at)
                            VALUES (
                                page_rec.id,
                                photo_item->>'url',
                                photo_order,
                                CURRENT_TIMESTAMP
                            )
                            RETURNING id INTO photo_id;
                            
                            INSERT INTO page_photo_translations 
                                (page_photo_id, language, title, description, created_at, updated_at)
                            VALUES (
                                photo_id,
                                UPPER(lang_code),
                                COALESCE(photo_item->>'title', ''),
                                photo_item->>'description',
                                CURRENT_TIMESTAMP,
                                CURRENT_TIMESTAMP
                            );
                            
                            photo_order := photo_order + 1;
                        END LOOP;
                    END IF;
                END LOOP;
            ELSE
                -- Old format: single language (assume French)
                IF content_json ? 'videos' AND jsonb_typeof(content_json->'videos') = 'array' THEN
                    video_order := 0;
                    FOR video_item IN SELECT * FROM jsonb_array_elements(content_json->'videos')
                    LOOP
                        INSERT INTO page_videos (page_id, url, type, display_order, created_at)
                        VALUES (
                            page_rec.id,
                            video_item->>'url',
                            UPPER(COALESCE(video_item->>'type', 'YOUTUBE')),
                            video_order,
                            CURRENT_TIMESTAMP
                        )
                        RETURNING id INTO video_id;
                        
                        INSERT INTO page_video_translations 
                            (page_video_id, language, title, description, created_at, updated_at)
                        VALUES (
                            video_id,
                            'FR',
                            COALESCE(video_item->>'title', ''),
                            video_item->>'description',
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        );
                        
                        video_order := video_order + 1;
                    END LOOP;
                END IF;
                
                IF content_json ? 'photos' AND jsonb_typeof(content_json->'photos') = 'array' THEN
                    photo_order := 0;
                    FOR photo_item IN SELECT * FROM jsonb_array_elements(content_json->'photos')
                    LOOP
                        INSERT INTO page_photos (page_id, url, display_order, created_at)
                        VALUES (
                            page_rec.id,
                            photo_item->>'url',
                            photo_order,
                            CURRENT_TIMESTAMP
                        )
                        RETURNING id INTO photo_id;
                        
                        INSERT INTO page_photo_translations 
                            (page_photo_id, language, title, description, created_at, updated_at)
                        VALUES (
                            photo_id,
                            'FR',
                            COALESCE(photo_item->>'title', ''),
                            photo_item->>'description',
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        );
                        
                        photo_order := photo_order + 1;
                    END LOOP;
                END IF;
            END IF;
            
            migrated_count := migrated_count + 1;
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE NOTICE 'Error migrating page %: %', page_rec.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Migration completed: % pages migrated, % errors', migrated_count, error_count;
END $$;

COMMIT;

-- Verification queries
SELECT 
    'Migration completed!' as status,
    (SELECT COUNT(*) FROM page_translations) as translations,
    (SELECT COUNT(*) FROM page_videos) as videos,
    (SELECT COUNT(*) FROM page_photos) as photos;


