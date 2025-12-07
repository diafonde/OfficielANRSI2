import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface MediaOverview {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface CoverageItem {
  date: string;
  title: string;
  description: string;
  mediaOutlets: { type: string; name: string }[];
}

interface MediaType {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface PressRelease {
  date: string;
  title: string;
  description: string;
  link?: string;
}

interface MediaKitItem {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

interface SocialPlatform {
  icon: string;
  name: string;
  handle: string;
  link?: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface MediaLink {
  label: string;
  url: string;
}

interface ArticleLinkItem {
  label: string;
  url: string;
}

interface ArticleLink {
  label: string;
  links: ArticleLinkItem[];
}

interface AgenceMediasLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaLinks: MediaLink[];
  articleLinks: ArticleLink[];
  mediaOverview: MediaOverview[];
  recentCoverage: CoverageItem[];
  mediaTypes: MediaType[];
  pressReleases: PressRelease[];
  mediaKit: MediaKitItem[];
  socialMedia: SocialPlatform[];
  contactInfo: ContactItem[];
}

interface AgenceMediasContent {
  translations: {
    fr: AgenceMediasLanguageContent;
    ar: AgenceMediasLanguageContent;
    en: AgenceMediasLanguageContent;
  };
}

@Component({
  selector: 'app-admin-agence-medias-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-agence-medias-form.component.html',
  styleUrls: ['./admin-agence-medias-form.component.scss']
})
export class AdminAgenceMediasFormComponent implements OnInit {
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;
  activeLanguage: 'fr' | 'ar' | 'en' = 'fr';

  languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇲🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  trackByLanguageCode(index: number, lang: { code: string; name: string; flag: string }): string {
    return lang.code;
  }

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    // Check for language query parameter
    this.route.queryParams.subscribe(params => {
      if (params['lang'] && ['fr', 'ar', 'en'].includes(params['lang'])) {
        this.activeLanguage = params['lang'] as 'fr' | 'ar' | 'en';
      }
    });
    this.loadPage();
  }

  createForm(): FormGroup {
    return this.fb.group({
      translations: this.fb.group({
        fr: this.createLanguageFormGroup(),
        ar: this.createLanguageFormGroup(),
        en: this.createLanguageFormGroup()
      })
    });
  }

  private createLanguageFormGroup(): FormGroup {
    return this.fb.group({
      heroTitle: ['', Validators.required],
      heroSubtitle: ['', Validators.required],
      introText: [''],
      mediaLinks: this.fb.array([]),
      articleLinks: this.fb.array([]),
      mediaOverview: this.fb.array([]),
      recentCoverage: this.fb.array([]),
      mediaTypes: this.fb.array([]),
      pressReleases: this.fb.array([]),
      mediaKit: this.fb.array([]),
      socialMedia: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
      this.cdr.markForCheck();
    }
  }

  get activeLanguageFormGroup(): FormGroup {
    const group = this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
    if (!group) {
      console.error(`Form group for language ${this.activeLanguage} not found`);
      return this.form.get('translations.fr') as FormGroup;
    }
    return group;
  }

  getActiveLanguageFormGroup(): FormGroup {
    return this.activeLanguageFormGroup;
  }

  getLanguageFormGroup(lang: string): FormGroup {
    return this.form.get(`translations.${lang}`) as FormGroup;
  }

  hasTranslation(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.get('heroTitle')?.value || langGroup.get('heroSubtitle')?.value || false;
  }

  isLanguageFormValid(lang: string): boolean {
    const langGroup = this.getLanguageFormGroup(lang);
    return langGroup.valid;
  }

  getActiveLanguageName(): string {
    const lang = this.languages.find(l => l.code === this.activeLanguage);
    return lang?.name || 'Français';
  }

  // Media Links FormArray methods
  get mediaLinks(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaLinks') as FormArray;
  }

  addMediaLink(item?: MediaLink, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaLinks = langGroup.get('mediaLinks') as FormArray;
    const group = this.fb.group({
      label: [item?.label || '', Validators.required],
      url: [item?.url || '', Validators.required]
    });
    mediaLinks.push(group);
  }

  removeMediaLink(index: number): void {
    this.mediaLinks.removeAt(index);
  }

  // Article Links FormArray methods
  get articleLinks(): FormArray {
    return this.getActiveLanguageFormGroup().get('articleLinks') as FormArray;
  }

  addArticleLink(item?: ArticleLink, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const articleLinks = langGroup.get('articleLinks') as FormArray;
    const linksArray = item?.links && item.links.length > 0
      ? this.fb.array(item.links.map(link => this.createArticleLinkItemGroup(link)))
      : this.fb.array([this.createArticleLinkItemGroup()]);
    const group = this.fb.group({
      label: [item?.label || '', Validators.required],
      links: linksArray
    });
    articleLinks.push(group);
  }

  createArticleLinkItemGroup(item?: ArticleLinkItem): FormGroup {
    return this.fb.group({
      label: [item?.label || '', Validators.required],
      url: [item?.url || '', Validators.required]
    });
  }

  removeArticleLink(index: number): void {
    this.articleLinks.removeAt(index);
  }

  getArticleLinkItems(index: number): FormArray {
    return this.articleLinks.at(index).get('links') as FormArray;
  }

  addArticleLinkItem(linkIndex: number, item?: ArticleLinkItem): void {
    this.getArticleLinkItems(linkIndex).push(this.createArticleLinkItemGroup(item));
  }

  removeArticleLinkItem(linkIndex: number, itemIndex: number): void {
    this.getArticleLinkItems(linkIndex).removeAt(itemIndex);
  }

  // Media Overview FormArray methods
  get mediaOverview(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaOverview') as FormArray;
  }

  addMediaOverview(item?: MediaOverview, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaOverview = langGroup.get('mediaOverview') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📺', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    mediaOverview.push(group);
  }

  removeMediaOverview(index: number): void {
    this.mediaOverview.removeAt(index);
  }

  getMediaOverviewItems(index: number): FormArray {
    return this.mediaOverview.at(index).get('items') as FormArray;
  }

  addMediaOverviewItem(index: number, value = ''): void {
    this.getMediaOverviewItems(index).push(this.fb.control(value));
  }

  removeMediaOverviewItem(overviewIndex: number, itemIndex: number): void {
    this.getMediaOverviewItems(overviewIndex).removeAt(itemIndex);
  }

  // Recent Coverage FormArray methods
  get recentCoverage(): FormArray {
    return this.getActiveLanguageFormGroup().get('recentCoverage') as FormArray;
  }

  addCoverageItem(item?: CoverageItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const recentCoverage = langGroup.get('recentCoverage') as FormArray;
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      mediaOutlets: this.fb.array(item?.mediaOutlets?.map(o => this.createMediaOutletGroup(o)) || [])
    });
    recentCoverage.push(group);
  }

  removeCoverageItem(index: number): void {
    this.recentCoverage.removeAt(index);
  }

  getCoverageMediaOutlets(index: number): FormArray {
    return this.recentCoverage.at(index).get('mediaOutlets') as FormArray;
  }

  createMediaOutletGroup(outlet?: { type: string; name: string }): FormGroup {
    return this.fb.group({
      type: [outlet?.type || '📺', Validators.required],
      name: [outlet?.name || '', Validators.required]
    });
  }

  addMediaOutlet(coverageIndex: number): void {
    this.getCoverageMediaOutlets(coverageIndex).push(this.createMediaOutletGroup());
  }

  removeMediaOutlet(coverageIndex: number, outletIndex: number): void {
    this.getCoverageMediaOutlets(coverageIndex).removeAt(outletIndex);
  }

  // Media Types FormArray methods
  get mediaTypes(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaTypes') as FormArray;
  }

  addMediaType(item?: MediaType, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaTypes = langGroup.get('mediaTypes') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '🎤', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    mediaTypes.push(group);
  }

  removeMediaType(index: number): void {
    this.mediaTypes.removeAt(index);
  }

  getMediaTypeItems(index: number): FormArray {
    return this.mediaTypes.at(index).get('items') as FormArray;
  }

  addMediaTypeItem(index: number, value = ''): void {
    this.getMediaTypeItems(index).push(this.fb.control(value));
  }

  removeMediaTypeItem(typeIndex: number, itemIndex: number): void {
    this.getMediaTypeItems(typeIndex).removeAt(itemIndex);
  }

  // Press Releases FormArray methods
  get pressReleases(): FormArray {
    return this.getActiveLanguageFormGroup().get('pressReleases') as FormArray;
  }

  addPressRelease(item?: PressRelease, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const pressReleases = langGroup.get('pressReleases') as FormArray;
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    pressReleases.push(group);
  }

  removePressRelease(index: number): void {
    this.pressReleases.removeAt(index);
  }

  // Media Kit FormArray methods
  get mediaKit(): FormArray {
    return this.getActiveLanguageFormGroup().get('mediaKit') as FormArray;
  }

  addMediaKitItem(item?: MediaKitItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const mediaKit = langGroup.get('mediaKit') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📸', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    mediaKit.push(group);
  }

  removeMediaKitItem(index: number): void {
    this.mediaKit.removeAt(index);
  }

  // Social Media FormArray methods
  get socialMedia(): FormArray {
    return this.getActiveLanguageFormGroup().get('socialMedia') as FormArray;
  }

  addSocialPlatform(item?: SocialPlatform, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const socialMedia = langGroup.get('socialMedia') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || '📘', Validators.required],
      name: [item?.name || '', Validators.required],
      handle: [item?.handle || '', Validators.required],
      link: [item?.link || '']
    });
    socialMedia.push(group);
  }

  removeSocialPlatform(index: number): void {
    this.socialMedia.removeAt(index);
  }

  // Contact Info FormArray methods
  get contactInfo(): FormArray {
    return this.getActiveLanguageFormGroup().get('contactInfo') as FormArray;
  }

  addContactItem(item?: ContactItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const contactInfo = langGroup.get('contactInfo') as FormArray;
    const group = this.fb.group({
      icon: [item?.icon || 'fas fa-envelope', Validators.required],
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
    contactInfo.push(group);
  }

  removeContactItem(index: number): void {
    this.contactInfo.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('agence-medias').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        
        // Check if we have valid data to load BEFORE clearing
        let contentToUse: AgenceMediasContent | null = null;
        
        // Priority 1: Check page.translations (from page_translations table)
        if (page.translations && Object.keys(page.translations).length > 0) {
          try {
            const content: AgenceMediasContent = {
              translations: {
                fr: this.getEmptyLanguageContent(),
                ar: this.getEmptyLanguageContent(),
                en: this.getEmptyLanguageContent()
              }
            };
            
            // Extract content from each translation
            ['fr', 'ar', 'en'].forEach(lang => {
              const translation = page.translations?.[lang];
              if (translation && translation.content) {
                try {
                  const parsedContent = JSON.parse(translation.content);
                  content.translations[lang as 'fr' | 'ar' | 'en'] = parsedContent;
                } catch (e) {
                  console.error(`Error parsing ${lang} translation content:`, e);
                }
              }
            });
            
            // Only use if we have at least some content
            if (content.translations.fr.heroTitle || content.translations.fr.heroSubtitle ||
                content.translations.ar.heroTitle || content.translations.ar.heroSubtitle ||
                content.translations.en.heroTitle || content.translations.en.heroSubtitle ||
                (content.translations.fr.mediaLinks && content.translations.fr.mediaLinks.length > 0) ||
                (content.translations.ar.mediaLinks && content.translations.ar.mediaLinks.length > 0) ||
                (content.translations.en.mediaLinks && content.translations.en.mediaLinks.length > 0) ||
                (content.translations.fr.mediaOverview && content.translations.fr.mediaOverview.length > 0) ||
                (content.translations.ar.mediaOverview && content.translations.ar.mediaOverview.length > 0) ||
                (content.translations.en.mediaOverview && content.translations.en.mediaOverview.length > 0)) {
              contentToUse = content;
            }
          } catch (e) {
            console.error('Error processing translations:', e);
          }
        }
        
        // Priority 2: Fallback to page.content (old format)
        if (!contentToUse && page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              contentToUse = parsedContent;
            } else {
              // Old format - migrate to new format
              const oldContent: any = parsedContent;
              const migratedContent: AgenceMediasLanguageContent = {
                heroTitle: oldContent.heroTitle || '',
                heroSubtitle: oldContent.heroSubtitle || '',
                introText: oldContent.introText || '',
                mediaLinks: oldContent.mediaLinks || [],
                articleLinks: oldContent.articleLinks || [],
                mediaOverview: oldContent.mediaOverview || [],
                recentCoverage: oldContent.recentCoverage || [],
                mediaTypes: oldContent.mediaTypes || [],
                pressReleases: oldContent.pressReleases || [],
                mediaKit: oldContent.mediaKit || [],
                socialMedia: oldContent.socialMedia || [],
                contactInfo: oldContent.contactInfo || []
              };
              contentToUse = {
                translations: {
                  fr: migratedContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
            }
          } catch (e) {
            console.error('Error parsing content:', e);
          }
        }
        
        // Only populate if we have content to use
        if (contentToUse) {
          this.populateForm(contentToUse);
        }
        
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage = this.getLabel('errorLoadingPage');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private getEmptyLanguageContent(): AgenceMediasLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      mediaLinks: [],
      articleLinks: [],
      mediaOverview: [],
      recentCoverage: [],
      mediaTypes: [],
      pressReleases: [],
      mediaKit: [],
      socialMedia: [],
      contactInfo: []
    };
  }


  populateForm(content: AgenceMediasContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        if (!langGroup) {
          console.error(`Language form group for ${lang} not found`);
          return;
        }
        
        console.log(`Populating ${lang} form with:`, {
          heroTitle: langContent.heroTitle,
          heroSubtitle: langContent.heroSubtitle,
          mediaLinksCount: langContent.mediaLinks?.length || 0,
          articleLinksCount: langContent.articleLinks?.length || 0,
          mediaOverviewCount: langContent.mediaOverview?.length || 0
        });
        
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || ''
        });

        // Clear existing arrays
        const mediaLinks = langGroup.get('mediaLinks') as FormArray;
        const articleLinks = langGroup.get('articleLinks') as FormArray;
        const mediaOverview = langGroup.get('mediaOverview') as FormArray;
        const recentCoverage = langGroup.get('recentCoverage') as FormArray;
        const mediaTypes = langGroup.get('mediaTypes') as FormArray;
        const pressReleases = langGroup.get('pressReleases') as FormArray;
        const mediaKit = langGroup.get('mediaKit') as FormArray;
        const socialMedia = langGroup.get('socialMedia') as FormArray;
        const contactInfo = langGroup.get('contactInfo') as FormArray;
        while (mediaLinks.length) mediaLinks.removeAt(0);
        while (articleLinks.length) articleLinks.removeAt(0);
        while (mediaOverview.length) mediaOverview.removeAt(0);
        while (recentCoverage.length) recentCoverage.removeAt(0);
        while (mediaTypes.length) mediaTypes.removeAt(0);
        while (pressReleases.length) pressReleases.removeAt(0);
        while (mediaKit.length) mediaKit.removeAt(0);
        while (socialMedia.length) socialMedia.removeAt(0);
        while (contactInfo.length) contactInfo.removeAt(0);

        // Debug: Log what we're loading
        console.log(`Loading ${lang} mediaLinks:`, langContent.mediaLinks);

        // Populate arrays - ensure we handle both array and undefined/null cases
        if (langContent.mediaLinks && Array.isArray(langContent.mediaLinks)) {
          langContent.mediaLinks.forEach(item => {
            if (item && (item.label || item.url)) {
              this.addMediaLink(item, lang);
            }
          });
        }
        if (langContent.articleLinks && Array.isArray(langContent.articleLinks)) {
          (langContent.articleLinks as any[]).forEach((item: any) => {
            // Support migration from old format (title/url) to new format (label/links)
            let links: ArticleLinkItem[] = [];
            
            if (item.links && Array.isArray(item.links)) {
              // Already in new format with links array
              links = item.links;
            } else if (item.urls && Array.isArray(item.urls)) {
              // Migrate from urls array format
              links = item.urls.map((url: string) => ({
                label: url, // Use URL as label if no specific label provided
                url: url
              }));
            } else if (item.url) {
              // Migrate from single url format
              links = [{
                label: item.title || item.label || item.url,
                url: item.url
              }];
            }
            
            const migratedItem: ArticleLink = {
              label: item.label || item.title || '',
              links: links
            };
            this.addArticleLink(migratedItem, lang);
          });
        }
        if (langContent.mediaOverview && Array.isArray(langContent.mediaOverview)) {
          langContent.mediaOverview.forEach(item => this.addMediaOverview(item, lang));
        }
        if (langContent.recentCoverage && Array.isArray(langContent.recentCoverage)) {
          langContent.recentCoverage.forEach(item => this.addCoverageItem(item, lang));
        }
        if (langContent.mediaTypes && Array.isArray(langContent.mediaTypes)) {
          langContent.mediaTypes.forEach(item => this.addMediaType(item, lang));
        }
        if (langContent.pressReleases && Array.isArray(langContent.pressReleases)) {
          langContent.pressReleases.forEach(item => this.addPressRelease(item, lang));
        }
        if (langContent.mediaKit && Array.isArray(langContent.mediaKit)) {
          langContent.mediaKit.forEach(item => this.addMediaKitItem(item, lang));
        }
        if (langContent.socialMedia && Array.isArray(langContent.socialMedia)) {
          langContent.socialMedia.forEach(item => this.addSocialPlatform(item, lang));
        }
        if (langContent.contactInfo && Array.isArray(langContent.contactInfo)) {
          langContent.contactInfo.forEach(item => this.addContactItem(item, lang));
        }
        
        // Update form arrays to ensure changes are detected
        mediaLinks.updateValueAndValidity({ emitEvent: true });
        articleLinks.updateValueAndValidity({ emitEvent: true });
        mediaOverview.updateValueAndValidity({ emitEvent: true });
        recentCoverage.updateValueAndValidity({ emitEvent: true });
        mediaTypes.updateValueAndValidity({ emitEvent: true });
        pressReleases.updateValueAndValidity({ emitEvent: true });
        mediaKit.updateValueAndValidity({ emitEvent: true });
        socialMedia.updateValueAndValidity({ emitEvent: true });
        contactInfo.updateValueAndValidity({ emitEvent: true });
        langGroup.updateValueAndValidity({ emitEvent: true });
        
        console.log(`Finished populating ${lang} form. MediaLinks count:`, mediaLinks.length);
      }
    });
    // Trigger change detection after populating form
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    // Use getRawValue() to ensure FormArrays are properly captured
    // Also explicitly get FormArray values for each language to ensure they're captured
    const translationsData: any = {};
    
    ['fr', 'ar', 'en'].forEach(lang => {
      const langGroup = this.getLanguageFormGroup(lang);
      const langValue = langGroup.getRawValue();
      translationsData[lang] = langValue;
    });
    
    // Build content with translations
    const content: AgenceMediasContent = {
      translations: {
        fr: this.buildLanguageContent(translationsData.fr),
        ar: this.buildLanguageContent(translationsData.ar),
        en: this.buildLanguageContent(translationsData.en)
      }
    };

    // Debug: Log what we're saving
    console.log('Saving mediaLinks (fr):', content.translations.fr.mediaLinks);
    console.log('Saving mediaLinks (ar):', content.translations.ar.mediaLinks);
    console.log('Saving mediaLinks (en):', content.translations.en.mediaLinks);
    console.log('Saving articleLinks (fr):', content.translations.fr.articleLinks);
    console.log('Saving articleLinks (ar):', content.translations.ar.articleLinks);
    console.log('Saving articleLinks (en):', content.translations.en.articleLinks);

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    // Build translations for the new structure
    const translations: { [key: string]: any } = {};
    
    (['fr', 'ar', 'en'] as const).forEach(lang => {
      const langContent = content.translations[lang];
      if (langContent) {
        const langContentJson = JSON.stringify(langContent);
        translations[lang] = {
          title: langContent.heroTitle || 'ANRSI dans les Médias',
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || '',
          introText: langContent.introText || '',
          content: langContentJson, // Store the language-specific content in content field
          extra: langContentJson // Also store in extra for backward compatibility
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
      this.pageService.updatePage(this.pageId, updateData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = this.getLabel('errorSavingPage');
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'agence-medias',
        pageType: 'STRUCTURED',
        translations: translations,
        isPublished: true,
        isActive: true
      }).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/admin/pages']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = this.getLabel('errorCreatingPage');
          console.error('Error creating page:', error);
        }
      });
    }
  }

  private buildLanguageContent(langData: any): AgenceMediasLanguageContent {
    // Filter out empty media links and ensure proper structure
    const mediaLinks = (langData.mediaLinks || [])
      .filter((item: any) => item && (item.label || item.url))
      .map((item: any) => ({
        label: item.label || '',
        url: item.url || ''
      }));

    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      introText: langData.introText || '',
      mediaLinks: mediaLinks,
      articleLinks: (langData.articleLinks || [])
        .filter((item: any) => item && item.label && item.links && Array.isArray(item.links) && item.links.length > 0)
        .map((item: any) => ({
          label: item.label || '',
          links: (item.links || [])
            .filter((link: any) => link && link.url && link.url.trim() !== '')
            .map((link: any) => ({
              label: link.label || link.url || '',
              url: link.url || ''
            }))
        }))
        .filter((item: any) => item.links.length > 0),
      mediaOverview: (langData.mediaOverview || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || []
      })),
      recentCoverage: (langData.recentCoverage || []).map((item: any) => ({
        date: item.date,
        title: item.title,
        description: item.description,
        mediaOutlets: item.mediaOutlets || []
      })),
      mediaTypes: (langData.mediaTypes || []).map((item: any) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        items: item.items || []
      })),
      pressReleases: langData.pressReleases || [],
      mediaKit: langData.mediaKit || [],
      socialMedia: langData.socialMedia || [],
      contactInfo: langData.contactInfo || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Agence Médias',
        ar: 'تعديل صفحة وكالة الإعلام',
        en: 'Edit Media Agency Page'
      },
      'cancel': {
        fr: 'Annuler',
        ar: 'إلغاء',
        en: 'Cancel'
      },
      'heroSection': {
        fr: 'Section Hero',
        ar: 'قسم البطل',
        en: 'Hero Section'
      },
      'heroTitle': {
        fr: 'Titre Hero *',
        ar: 'عنوان البطل *',
        en: 'Hero Title *'
      },
      'heroSubtitle': {
        fr: 'Sous-titre Hero *',
        ar: 'العنوان الفرعي للبطل *',
        en: 'Hero Subtitle *'
      },
      'introSection': {
        fr: 'Introduction',
        ar: 'مقدمة',
        en: 'Introduction'
      },
      'introText': {
        fr: 'Texte d\'introduction *',
        ar: 'نص المقدمة *',
        en: 'Intro Text *'
      },
      'mediaLinksSection': {
        fr: 'Liens Médias',
        ar: 'روابط الإعلام',
        en: 'Media Links'
      },
      'mediaLinksLabel': {
        fr: 'Libellé *',
        ar: 'التسمية *',
        en: 'Label *'
      },
      'mediaLinksUrl': {
        fr: 'URL *',
        ar: 'الرابط *',
        en: 'URL *'
      },
      'addMediaLink': {
        fr: 'Ajouter un lien média',
        ar: 'إضافة رابط إعلام',
        en: 'Add Media Link'
      },
      'articleLinksSection': {
        fr: 'Liens Articles',
        ar: 'روابط المقالات',
        en: 'Article Links'
      },
      'articleLinksLabel': {
        fr: 'Libellé *',
        ar: 'التسمية *',
        en: 'Label *'
      },
      'articleLinksUrl': {
        fr: 'URL *',
        ar: 'الرابط *',
        en: 'URL *'
      },
      'articleLinksUrls': {
        fr: 'URLs des Articles',
        ar: 'روابط المقالات',
        en: 'Article URLs'
      },
      'addArticleLink': {
        fr: 'Ajouter un lien article',
        ar: 'إضافة رابط مقال',
        en: 'Add Article Link'
      },
      'noArticleLinks': {
        fr: 'Aucun lien d\'article ajouté pour le moment. Cliquez sur le bouton ci-dessous pour en ajouter un.',
        ar: 'لم تتم إضافة روابط مقالات بعد. انقر على الزر أدناه لإضافة واحد.',
        en: 'No article links added yet. Click the button below to add one.'
      },
      'noMediaLinks': {
        fr: 'Aucun lien média ajouté pour le moment. Cliquez sur le bouton ci-dessous pour en ajouter un.',
        ar: 'لم تتم إضافة روابط إعلام بعد. انقر على الزر أدناه لإضافة واحد.',
        en: 'No media links added yet. Click the button below to add one.'
      },
      'mediaOverviewSection': {
        fr: 'Aperçu des Médias',
        ar: 'نظرة عامة على الإعلام',
        en: 'Media Overview'
      },
      'recentCoverageSection': {
        fr: 'Couverture Récente',
        ar: 'التغطية الأخيرة',
        en: 'Recent Coverage'
      },
      'mediaTypesSection': {
        fr: 'Types de Médias',
        ar: 'أنواع الإعلام',
        en: 'Media Types'
      },
      'pressReleasesSection': {
        fr: 'Communiqués de Presse',
        ar: 'البيانات الصحفية',
        en: 'Press Releases'
      },
      'mediaKitSection': {
        fr: 'Kit Médias',
        ar: 'مجموعة الإعلام',
        en: 'Media Kit'
      },
      'socialMediaSection': {
        fr: 'Réseaux Sociaux',
        ar: 'وسائل التواصل الاجتماعي',
        en: 'Social Media'
      },
      'contactInfoSection': {
        fr: 'Informations de Contact',
        ar: 'معلومات الاتصال',
        en: 'Contact Information'
      },
      'icon': {
        fr: 'Icône',
        ar: 'أيقونة',
        en: 'Icon'
      },
      'title': {
        fr: 'Titre *',
        ar: 'العنوان *',
        en: 'Title *'
      },
      'description': {
        fr: 'Description *',
        ar: 'الوصف *',
        en: 'Description *'
      },
      'items': {
        fr: 'Éléments',
        ar: 'العناصر',
        en: 'Items'
      },
      'date': {
        fr: 'Date *',
        ar: 'التاريخ *',
        en: 'Date *'
      },
      'name': {
        fr: 'Nom *',
        ar: 'الاسم *',
        en: 'Name *'
      },
      'handle': {
        fr: 'Identifiant *',
        ar: 'المعرف *',
        en: 'Handle *'
      },
      'link': {
        fr: 'Lien',
        ar: 'رابط',
        en: 'Link'
      },
      'mediaOutlets': {
        fr: 'Organes de Presse',
        ar: 'وسائل الإعلام',
        en: 'Media Outlets'
      },
      'label': {
        fr: 'Libellé *',
        ar: 'التسمية *',
        en: 'Label *'
      },
      'value': {
        fr: 'Valeur *',
        ar: 'القيمة *',
        en: 'Value *'
      },
      'iconFontAwesome': {
        fr: 'Icône (classe FontAwesome) *',
        ar: 'أيقونة (فئة FontAwesome) *',
        en: 'Icon (FontAwesome class) *'
      },
      'addMediaOverview': {
        fr: 'Ajouter un élément d\'aperçu média',
        ar: 'إضافة عنصر نظرة عامة إعلامية',
        en: 'Add Media Overview Item'
      },
      'addCoverageItem': {
        fr: 'Ajouter un élément de couverture',
        ar: 'إضافة عنصر تغطية',
        en: 'Add Coverage Item'
      },
      'addMediaType': {
        fr: 'Ajouter un type de média',
        ar: 'إضافة نوع إعلام',
        en: 'Add Media Type'
      },
      'addPressRelease': {
        fr: 'Ajouter un communiqué de presse',
        ar: 'إضافة بيان صحفي',
        en: 'Add Press Release'
      },
      'addMediaKitItem': {
        fr: 'Ajouter un élément de kit média',
        ar: 'إضافة عنصر مجموعة إعلام',
        en: 'Add Media Kit Item'
      },
      'addSocialPlatform': {
        fr: 'Ajouter une plateforme sociale',
        ar: 'إضافة منصة اجتماعية',
        en: 'Add Social Platform'
      },
      'addContactItem': {
        fr: 'Ajouter un élément de contact',
        ar: 'إضافة عنصر اتصال',
        en: 'Add Contact Item'
      },
      'addItem': {
        fr: 'Ajouter un élément',
        ar: 'إضافة عنصر',
        en: 'Add Item'
      },
      'addOutlet': {
        fr: 'Ajouter un organe de presse',
        ar: 'إضافة وسيلة إعلام',
        en: 'Add Outlet'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'إزالة',
        en: 'Remove'
      },
      'complete': {
        fr: 'Complet',
        ar: 'مكتمل',
        en: 'Complete'
      },
      'incomplete': {
        fr: 'Incomplet',
        ar: 'غير مكتمل',
        en: 'Incomplete'
      },
      'saveChanges': {
        fr: 'Enregistrer les modifications',
        ar: 'حفظ التغييرات',
        en: 'Save Changes'
      },
      'saving': {
        fr: 'Enregistrement...',
        ar: 'جاري الحفظ...',
        en: 'Saving...'
      },
      'loading': {
        fr: 'Chargement...',
        ar: 'جاري التحميل...',
        en: 'Loading...'
      },
      'errorLoadingPage': {
        fr: 'Erreur lors du chargement de la page',
        ar: 'خطأ في تحميل الصفحة',
        en: 'Error loading page'
      },
      'errorSavingPage': {
        fr: 'Erreur lors de l\'enregistrement de la page',
        ar: 'خطأ في حفظ الصفحة',
        en: 'Error saving page'
      },
      'errorCreatingPage': {
        fr: 'Erreur lors de la création de la page',
        ar: 'خطأ في إنشاء الصفحة',
        en: 'Error creating page'
      }
    };

    return translations[key]?.[this.activeLanguage] || translations[key]?.fr || key;
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}



