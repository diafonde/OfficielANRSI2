# Helper script to update all admin components

Pattern to replace in each component:

OLD:
```typescript
const updateData: PageUpdateDTO = {
  title: '...',
  heroTitle: heroTitle,
  heroSubtitle: heroSubtitle,
  content: JSON.stringify(content),
  pageType: 'STRUCTURED',
  isPublished: true,
  isActive: true
};

if (this.pageId) {
  this.pageService.updatePage(this.pageId, updateData).subscribe({...});
} else {
  this.pageService.createPage({
    slug: '...',
    title: '...',
    heroTitle: heroTitle,
    heroSubtitle: heroSubtitle,
    content: JSON.stringify(content),
    pageType: 'STRUCTURED',
    isPublished: true,
    isActive: true
  }).subscribe({...});
}
```

NEW:
```typescript
// Build translations for the new structure
const translations: { [key: string]: any } = {};

(['fr', 'ar', 'en'] as const).forEach(lang => {
  const langContent = content.translations[lang];
  if (langContent) {
    translations[lang] = {
      title: langContent.heroTitle || langContent.cooperationInfo?.title || 'Default Title',
      heroTitle: langContent.heroTitle || langContent.cooperationInfo?.title || '',
      heroSubtitle: langContent.heroSubtitle || langContent.cooperationInfo?.description || '',
      extra: JSON.stringify(langContent) // Store the full content in extra (JSONB)
    };
  }
});

const updateData: PageUpdateDTO = {
  translations: translations,
  pageType: 'STRUCTURED',
  isPublished: true,
  isActive: true
};

if (this.pageId) {
  this.pageService.updatePage(this.pageId, updateData).subscribe({...});
} else {
  this.pageService.createPage({
    slug: '...',
    pageType: 'STRUCTURED',
    translations: translations,
    isPublished: true,
    isActive: true
  }).subscribe({...});
}
```
