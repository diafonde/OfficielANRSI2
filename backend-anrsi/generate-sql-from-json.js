#!/usr/bin/env node

/**
 * Script to convert fullappel-merged.json to SQL INSERT statement
 * 
 * Usage: node generate-sql-from-json.js
 * 
 * This script reads fullappel-merged.json and generates a SQL script
 * that inserts into both pages and page_translations tables.
 */

const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonFilePath = path.join(__dirname, 'fullappel-merged.json');
const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
const jsonData = JSON.parse(jsonContent);

// Process the JSON and build the structure
const frAppels = [];
const arAppels = [];
const enAppels = [];

jsonData.forEach((item) => {
  const imageUrl = item.image || null;
  const url = item.url || null;
  
  // Process French
  if (item.fr) {
    const fr = item.fr;
    const fullText = fr.full_text || '';
    const description = fullText.length > 250 
      ? fullText.substring(0, 250).trim() + '...'
      : fullText || fr.summary || '';
    
    frAppels.push({
      status: 'active',
      title: fr.title || '',
      summary: fr.summary || '',
      description: description,
      fullText: fullText,
      imageUrl: imageUrl,
      details: fr.date ? [{ label: 'Date', value: fr.date }] : [],
      actions: url ? [{ text: 'En savoir plus', url: url, type: 'primary' }] : []
    });
  }
  
  // Process Arabic (use French as fallback if missing)
  if (item.ar) {
    const ar = item.ar;
    const fullText = ar.full_text || '';
    const description = fullText.length > 250 
      ? fullText.substring(0, 250).trim() + '...'
      : fullText || ar.summary || '';
    
    arAppels.push({
      status: 'active',
      title: ar.title || '',
      summary: ar.summary || '',
      description: description,
      fullText: fullText,
      imageUrl: imageUrl,
      details: ar.date ? [{ label: 'التاريخ', value: ar.date }] : [],
      actions: url ? [{ text: 'المزيد', url: url, type: 'primary' }] : []
    });
  } else if (item.fr) {
    // Use French as fallback
    const fr = item.fr;
    const fullText = fr.full_text || '';
    const description = fullText.length > 250 
      ? fullText.substring(0, 250).trim() + '...'
      : fullText || fr.summary || '';
    
    arAppels.push({
      status: 'active',
      title: fr.title || '',
      summary: fr.summary || '',
      description: description,
      fullText: fullText,
      imageUrl: imageUrl,
      details: fr.date ? [{ label: 'التاريخ', value: fr.date }] : [],
      actions: url ? [{ text: 'المزيد', url: url, type: 'primary' }] : []
    });
  }
  
  // Process English (use French as fallback if missing)
  if (item.en) {
    const en = item.en;
    const fullText = en.full_text || '';
    const description = fullText.length > 250 
      ? fullText.substring(0, 250).trim() + '...'
      : fullText || en.summary || '';
    
    enAppels.push({
      status: 'active',
      title: en.title || '',
      summary: en.summary || '',
      description: description,
      fullText: fullText,
      imageUrl: imageUrl,
      details: en.date ? [{ label: 'Date', value: en.date }] : [],
      actions: url ? [{ text: 'Learn more', url: url, type: 'primary' }] : []
    });
  } else if (item.fr) {
    // Use French as fallback
    const fr = item.fr;
    const fullText = fr.full_text || '';
    const description = fullText.length > 250 
      ? fullText.substring(0, 250).trim() + '...'
      : fullText || fr.summary || '';
    
    enAppels.push({
      status: 'active',
      title: fr.title || '',
      summary: fr.summary || '',
      description: description,
      fullText: fullText,
      imageUrl: imageUrl,
      details: fr.date ? [{ label: 'Date', value: fr.date }] : [],
      actions: url ? [{ text: 'Learn more', url: url, type: 'primary' }] : []
    });
  }
});

// Build the language-specific content structures
const frContent = {
  heroTitle: "Appels à Candidatures",
  heroSubtitle: "Opportunités de recherche et d'innovation en Mauritanie",
  introText: "L'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.",
  appels: frAppels,
  categories: [],
  processSteps: [],
  criteria: [],
  supportServices: [],
  contactInfo: []
};

const arContent = {
  heroTitle: "دعوات التقديم",
  heroSubtitle: "فرص البحث والابتكار في موريتانيا",
  introText: "تطلق الوكالة الوطنية للبحث العلمي والابتكار بانتظام دعوات للتقديم لتمويل مشاريع البحث والابتكار التي تساهم في التنمية العلمية والتكنولوجية لموريتانيا.",
  appels: arAppels,
  categories: [],
  processSteps: [],
  criteria: [],
  supportServices: [],
  contactInfo: []
};

const enContent = {
  heroTitle: "Calls for Applications",
  heroSubtitle: "Research and innovation opportunities in Mauritania",
  introText: "ANRSI regularly launches calls for applications to fund research and innovation projects that contribute to the scientific and technological development of Mauritania.",
  appels: enAppels,
  categories: [],
  processSteps: [],
  criteria: [],
  supportServices: [],
  contactInfo: []
};

// Convert to JSON strings and escape for SQL
const escapeSql = (str) => str.replace(/'/g, "''");

const frContentJson = escapeSql(JSON.stringify(frContent));
const arContentJson = escapeSql(JSON.stringify(arContent));
const enContentJson = escapeSql(JSON.stringify(enContent));

// Generate SQL
const sql = `-- =====================================================
-- SQL Script to Insert fullappel-merged.json into Database
-- Generated automatically from fullappel-merged.json
-- This script inserts into both pages and page_translations tables
-- =====================================================

DO $$
DECLARE
    page_id_var BIGINT;
BEGIN
    -- Step 1: Insert or update the page
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
        '{"translations": {}}',
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
        page_type = EXCLUDED.page_type,
        is_published = EXCLUDED.is_published,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
    RETURNING id INTO page_id_var;
    
    -- Get page_id if it already existed
    IF page_id_var IS NULL THEN
        SELECT id INTO page_id_var FROM pages WHERE slug = 'appels-candidatures';
    END IF;
    
    -- Step 2: Insert or update French translation
    INSERT INTO page_translations (
        page_id,
        language,
        title,
        hero_title,
        hero_subtitle,
        content,
        created_at,
        updated_at
    ) VALUES (
        page_id_var,
        'FR',
        'Appels à Candidatures',
        'Appels à Candidatures',
        'Opportunités de recherche et d''innovation en Mauritanie',
        '${frContentJson}',
        NOW(),
        NOW()
    )
    ON CONFLICT (page_id, language)
    DO UPDATE SET
        title = EXCLUDED.title,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        content = EXCLUDED.content,
        updated_at = NOW();
    
    -- Step 3: Insert or update Arabic translation
    INSERT INTO page_translations (
        page_id,
        language,
        title,
        hero_title,
        hero_subtitle,
        content,
        created_at,
        updated_at
    ) VALUES (
        page_id_var,
        'AR',
        'دعوات التقديم',
        'دعوات التقديم',
        'فرص البحث والابتكار في موريتانيا',
        '${arContentJson}',
        NOW(),
        NOW()
    )
    ON CONFLICT (page_id, language)
    DO UPDATE SET
        title = EXCLUDED.title,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        content = EXCLUDED.content,
        updated_at = NOW();
    
    -- Step 4: Insert or update English translation
    INSERT INTO page_translations (
        page_id,
        language,
        title,
        hero_title,
        hero_subtitle,
        content,
        created_at,
        updated_at
    ) VALUES (
        page_id_var,
        'EN',
        'Calls for Applications',
        'Calls for Applications',
        'Research and innovation opportunities in Mauritania',
        '${enContentJson}',
        NOW(),
        NOW()
    )
    ON CONFLICT (page_id, language)
    DO UPDATE SET
        title = EXCLUDED.title,
        hero_title = EXCLUDED.hero_title,
        hero_subtitle = EXCLUDED.hero_subtitle,
        content = EXCLUDED.content,
        updated_at = NOW();
    
    RAISE NOTICE 'Successfully inserted/updated page and translations';
    RAISE NOTICE 'Page ID: %', page_id_var;
    RAISE NOTICE 'French appels: %', ${frAppels.length};
    RAISE NOTICE 'Arabic appels: %', ${arAppels.length};
    RAISE NOTICE 'English appels: %', ${enAppels.length};
END $$;

-- Summary
-- French appels: ${frAppels.length}
-- Arabic appels: ${arAppels.length}
-- English appels: ${enAppels.length}
-- Total items processed: ${jsonData.length}
`;

// Write SQL to file
const outputPath = path.join(__dirname, 'insert-fullappel-merged-generated.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

console.log('✅ SQL script generated successfully!');
console.log(`📄 Output file: ${outputPath}`);
console.log(`📊 Statistics:`);
console.log(`   - Total items in JSON: ${jsonData.length}`);
console.log(`   - French appels: ${frAppels.length}`);
console.log(`   - Arabic appels: ${arAppels.length}`);
console.log(`   - English appels: ${enAppels.length}`);
console.log(`\n💡 To execute: psql -U your_user -d your_database -f ${outputPath}`);

