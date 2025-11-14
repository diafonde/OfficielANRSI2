import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface VideoItem {
  title: string;
  url: string;
  type: string;
}

interface PhotoItem {
  title: string;
  url: string;
  type: string;
}

interface VideosLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  videos: VideoItem[];
  photos: PhotoItem[];
}

interface VideosContent {
  translations: {
    fr: VideosLanguageContent;
    ar: VideosLanguageContent;
    en: VideosLanguageContent;
  };
}

@Component({
  selector: 'app-admin-videos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-videos-form.component.html',
  styleUrls: ['./admin-videos-form.component.scss']
})
export class AdminVideosFormComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute
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
      videos: this.fb.array([]),
      photos: this.fb.array([])
    });
  }

  switchLanguage(lang: string): void {
    if (lang === 'fr' || lang === 'ar' || lang === 'en') {
      this.activeLanguage = lang as 'fr' | 'ar' | 'en';
    }
  }

  getActiveLanguageFormGroup(): FormGroup {
    return this.form.get(`translations.${this.activeLanguage}`) as FormGroup;
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

  // Videos FormArray methods
  get videos(): FormArray {
    return this.getActiveLanguageFormGroup().get('videos') as FormArray;
  }

  addVideo(item?: VideoItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const videos = langGroup.get('videos') as FormArray;
    const group = this.fb.group({
      title: [item?.title || '', Validators.required],
      url: [item?.url || '', Validators.required],
      type: [item?.type || 'youtube', Validators.required]
    });
    videos.push(group);
  }

  removeVideo(index: number): void {
    this.videos.removeAt(index);
  }

  // Photos FormArray methods
  get photos(): FormArray {
    return this.getActiveLanguageFormGroup().get('photos') as FormArray;
  }

  addPhoto(item?: PhotoItem, lang?: string): void {
    const langGroup = lang ? this.getLanguageFormGroup(lang) : this.getActiveLanguageFormGroup();
    const photos = langGroup.get('photos') as FormArray;
    const group = this.fb.group({
      title: [item?.title || ''],
      url: [item?.url || '', Validators.required],
      type: [item?.type || 'photo', Validators.required]
    });
    photos.push(group);
  }

  removePhoto(index: number): void {
    this.photos.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('videos').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              const content: VideosContent = parsedContent;
              this.populateForm(content);
            } else {
              // Old format - migrate to new format
              const oldContent: VideosLanguageContent = parsedContent;
              const content: VideosContent = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
              this.populateForm(content);
            }
          } catch (e) {
            console.error('Error parsing content:', e);
            this.loadDefaultData();
          }
        } else {
          this.loadDefaultData();
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.loadDefaultData();
        } else {
          this.errorMessage = this.getLabel('errorLoadingPage');
        }
        this.isLoading = false;
      }
    });
  }

  private getEmptyLanguageContent(): VideosLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      videos: [],
      photos: []
    };
  }

  loadDefaultData(): void {
    // Load default data for French
    const frGroup = this.getLanguageFormGroup('fr');
    frGroup.patchValue({
      heroTitle: 'Mediatique',
      heroSubtitle: 'Get in touch with our research teams and support staff'
    });

    // Clear existing arrays for French
    const frVideos = frGroup.get('videos') as FormArray;
    const frPhotos = frGroup.get('photos') as FormArray;
    while (frVideos.length) frVideos.removeAt(0);
    while (frPhotos.length) frPhotos.removeAt(0);

    // Add default videos for French
    this.addVideo({ title: "Présentation de l'Agence", url: "https://www.youtube.com/embed/EMgwHc1F5W8", type: "youtube" }, 'fr');
    this.addVideo({ title: "Recherche Scientifique", url: "https://youtube.com/embed/bC2FLWuHTbI", type: "youtube" }, 'fr');
    this.addVideo({ title: "Nouvelles Technologies", url: "https://youtube.com/embed/4PupAG-vJnk", type: "youtube" }, 'fr');
    this.addVideo({ title: "Nouvelles Technologies", url: "https://youtube.com/embed/0yeNSWbl5MY", type: "youtube" }, 'fr');

    // Add default photos for French
    this.addPhoto({ title: "", url: "assets/images/277154633_374993344636114_8242637262867242236_n_0.jpg.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/316106463_190420513522892_2157453747881448998_n_0.jpg.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/directeur.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/article1.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/directeurr.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/IMG_1702AAA.jpg.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/IMG_1738DDDDDDDDD.jpg.jpeg", type: "photo" }, 'fr');
    this.addPhoto({ title: "", url: "assets/images/chef.jpeg", type: "photo" }, 'fr');
  }

  populateForm(content: VideosContent): void {
    // Populate each language
    ['fr', 'ar', 'en'].forEach(lang => {
      const langContent = content.translations[lang as 'fr' | 'ar' | 'en'];
      if (langContent) {
        const langGroup = this.getLanguageFormGroup(lang);
        langGroup.patchValue({
          heroTitle: langContent.heroTitle || '',
          heroSubtitle: langContent.heroSubtitle || ''
        });

        // Clear existing arrays
        const videos = langGroup.get('videos') as FormArray;
        const photos = langGroup.get('photos') as FormArray;
        while (videos.length) videos.removeAt(0);
        while (photos.length) photos.removeAt(0);

        // Populate arrays
        langContent.videos?.forEach(video => this.addVideo(video, lang));
        langContent.photos?.forEach(photo => this.addPhoto(photo, lang));
      }
    });
  }

  onSubmit(): void {
    // Allow saving even if not all languages are complete
    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content with translations
    const content: VideosContent = {
      translations: {
        fr: this.buildLanguageContent(formValue.translations.fr),
        ar: this.buildLanguageContent(formValue.translations.ar),
        en: this.buildLanguageContent(formValue.translations.en)
      }
    };

    // Use French content for hero title/subtitle in page metadata (fallback to first available)
    const frContent = content.translations.fr;
    const heroTitle = frContent.heroTitle || content.translations.ar.heroTitle || content.translations.en.heroTitle || 'Mediatique';
    const heroSubtitle = frContent.heroSubtitle || content.translations.ar.heroSubtitle || content.translations.en.heroSubtitle || '';

    const updateData: PageUpdateDTO = {
      title: 'Mediatique',
      heroTitle: heroTitle,
      heroSubtitle: heroSubtitle,
      content: JSON.stringify(content),
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
        slug: 'videos',
        title: 'Mediatique',
        heroTitle: heroTitle,
        heroSubtitle: heroSubtitle,
        content: JSON.stringify(content),
        pageType: 'STRUCTURED',
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

  private buildLanguageContent(langData: any): VideosLanguageContent {
    return {
      heroTitle: langData.heroTitle || '',
      heroSubtitle: langData.heroSubtitle || '',
      videos: langData.videos || [],
      photos: langData.photos || []
    };
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Modifier la page Médiatique (Vidéos)',
        ar: 'تعديل صفحة الإعلام (الفيديوهات)',
        en: 'Edit Media (Videos) Page'
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
      'videos': {
        fr: 'Vidéos',
        ar: 'الفيديوهات',
        en: 'Videos'
      },
      'photos': {
        fr: 'Photos',
        ar: 'الصور',
        en: 'Photos'
      },
      'title': {
        fr: 'Titre *',
        ar: 'العنوان *',
        en: 'Title *'
      },
      'type': {
        fr: 'Type *',
        ar: 'النوع *',
        en: 'Type *'
      },
      'url': {
        fr: 'URL *',
        ar: 'الرابط *',
        en: 'URL *'
      },
      'addVideo': {
        fr: 'Ajouter une vidéo',
        ar: 'إضافة فيديو',
        en: 'Add Video'
      },
      'addPhoto': {
        fr: 'Ajouter une photo',
        ar: 'إضافة صورة',
        en: 'Add Photo'
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



