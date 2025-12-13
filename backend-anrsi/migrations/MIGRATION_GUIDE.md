# Guide de Migration : Architecture Multilingue Propre

## 📋 Vue d'ensemble

Cette migration transforme votre architecture pour séparer proprement :
- **Données structurelles** (dans `pages`) : slug, type, ordre, parent_id, image_url
- **Contenu multilingue** (dans `page_translations`) : title, heroTitle, heroSubtitle, sectionTitle, introText, description, content, extra

## ✅ Sécurité des Données

**VOS DONNÉES NE SERONT PAS PERDUES !**

- Les scripts de migration **LISENT** et **COPIENT** les données
- Les anciennes colonnes restent en place comme sauvegarde
- Vous pouvez vérifier que tout fonctionne avant de supprimer les anciennes colonnes

## 📝 Étapes de Migration

### Étape 1 : Sauvegarde (OBLIGATOIRE)

```bash
# Créer une sauvegarde complète de votre base de données
pg_dump -U anrsiuser -d anrsidb > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### Étape 2 : Exécuter la Migration Principale

```bash
cd backend-anrsi
psql -U anrsiuser -d anrsidb -f migrations/002_migrate_page_fields_to_translations.sql
```

**Ce script fait :**
1. ✅ Ajoute les nouvelles colonnes (`section_title`, `intro_text`, `description`, `extra` dans `page_translations`)
2. ✅ Ajoute les nouvelles colonnes (`ordre`, `parent_id` dans `pages`)
3. ✅ Migre les données existantes de `pages.title`, `pages.hero_title`, `pages.hero_subtitle` vers `page_translations` (en FR par défaut)
4. ✅ **GARDE** les anciennes colonnes comme sauvegarde

### Étape 3 : Vérifier la Migration

```sql
-- Vérifier que toutes les pages ont des traductions
SELECT 
    p.id,
    p.slug,
    COUNT(pt.id) as translation_count
FROM pages p
LEFT JOIN page_translations pt ON pt.page_id = p.id
GROUP BY p.id, p.slug
HAVING COUNT(pt.id) = 0;
-- Si cette requête retourne des lignes, certaines pages n'ont pas de traductions
```

```sql
-- Vérifier quelques exemples de données migrées
SELECT 
    p.id,
    p.slug,
    pt.language,
    pt.title,
    pt.hero_title
FROM pages p
JOIN page_translations pt ON pt.page_id = p.id
WHERE pt.language = 'FR'
LIMIT 10;
```

### Étape 4 : Tester l'Application

1. Redémarrer votre application Spring Boot
2. Tester les endpoints de pages :
   - `GET /api/pages`
   - `GET /api/pages/{slug}`
   - `GET /api/pages/{slug}?lang=fr`
   - `GET /api/pages/{slug}?lang=en`
   - `GET /api/pages/{slug}?lang=ar`
3. Vérifier que les pages s'affichent correctement dans le frontend

### Étape 5 : Nettoyage (OPTIONNEL - Après Vérification)

**⚠️ ATTENTION : Ne faites cette étape QUE si tout fonctionne correctement !**

```bash
# Créer une nouvelle sauvegarde avant le nettoyage
pg_dump -U anrsiuser -d anrsidb > backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql

# Exécuter le script de nettoyage
psql -U anrsiuser -d anrsidb -f migrations/003_cleanup_old_page_columns.sql
```

Ce script supprime les anciennes colonnes :
- `pages.title`
- `pages.hero_title`
- `pages.hero_subtitle`
- `pages.content`
- `pages.metadata`

## 🔄 Rollback (En cas de Problème)

Si quelque chose ne fonctionne pas, vous pouvez restaurer :

```bash
# Restaurer depuis la sauvegarde
psql -U anrsiuser -d anrsidb < backup_before_migration_YYYYMMDD_HHMMSS.sql
```

## 📊 Structure Avant/Après

### Avant
```sql
pages:
  - id
  - slug
  - title (FR seulement)
  - hero_title (FR seulement)
  - hero_subtitle (FR seulement)
  - content (JSON mélangé)
  - metadata (JSON)
```

### Après
```sql
pages:
  - id
  - slug
  - page_type
  - ordre
  - parent_id
  - hero_image_url
  - is_published
  - is_active

page_translations:
  - id
  - page_id
  - language (FR, EN, AR)
  - title
  - hero_title
  - hero_subtitle
  - section_title
  - intro_text
  - description
  - content
  - extra (JSONB)
```

## ❓ Questions Fréquentes

**Q: Est-ce que je vais perdre mes données ?**
R: Non ! Les scripts copient les données, ne les suppriment pas. Les anciennes colonnes restent jusqu'à ce que vous les supprimiez manuellement.

**Q: Que se passe-t-il si j'ai déjà des traductions ?**
R: Le script vérifie si une traduction FR existe déjà. Si oui, il ne fait rien pour cette page.

**Q: Comment migrer les traductions EN et AR existantes ?**
R: Si vous avez déjà des traductions dans `page_translations`, elles restent intactes. Le script ajoute seulement les traductions FR manquantes depuis les anciennes colonnes.

**Q: Puis-je annuler la migration ?**
R: Oui, tant que vous n'avez pas exécuté le script de nettoyage (003). Les anciennes colonnes sont toujours là.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs PostgreSQL
2. Vérifiez que toutes les pages ont des traductions
3. Restaurez depuis la sauvegarde si nécessaire

