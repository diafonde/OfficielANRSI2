import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO, PageTranslationDTO } from '../../services/page-admin.service';

@Component({
  selector: 'app-admin-page-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-page-form.component.html',
  styleUrls: ['./admin-page-form.component.scss']
})
export class AdminPageFormComponent implements OnInit {
  pageForm: FormGroup;
  isEditMode = false;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  page: PageDTO | null = null;
  activeLanguageTab: string = 'fr';

  pageTypes = [
    { value: 'SIMPLE', label: 'Simple' },
    { value: 'LIST', label: 'List' },
    { value: 'STRUCTURED', label: 'Structured' },
    { value: 'FAQ', label: 'FAQ' }
  ];

  languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  // Map component names to slugs for quick access
  componentSlugs: { [key: string]: string } = {
    'missions': 'missions',
    'objectives': 'objectives',
    'organigramme': 'organigramme',
    'plateformes': 'plateformes',
    'priorites-recherche-2026': 'priorites-recherche-2026',
    'programmes': 'programmes',
    'strategic-vision': 'strategic-vision',
    'zone-humide': 'zone-humide',
    'expert-anrsi': 'expert-anrsi',
    'cooperation': 'cooperation',
    'contact': 'contact',
    'conseil-administration': 'conseil-administration',
    'appels-candidatures': 'appels-candidatures',
    'ai4agri': 'ai4agri',
    'agence-medias': 'agence-medias',
    'rapports-annuels': 'rapports-annuels',
    'texts-juridiques': 'texts-juridiques'
  };

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.pageForm = this.fb.group({
      slug: ['', [Validators.required]],
      pageType: ['SIMPLE', [Validators.required]],
      ordre: [null],
      parentId: [null],
      heroImageUrl: [''],
      isPublished: [false],
      isActive: [true],
      translations: this.fb.group({
        fr: this.createTranslationFormGroup(),
        ar: this.createTranslationFormGroup(),
        en: this.createTranslationFormGroup()
      })
    });
  }

  private createTranslationFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      heroTitle: [''],
      heroSubtitle: [''],
      sectionTitle: [''],
      introText: [''],
      description: [''],
      content: [''],
      extra: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const slug = this.route.snapshot.queryParamMap.get('slug');

    if (id) {
      this.isEditMode = true;
      this.pageId = +id;
      this.loadPage(+id);
    } else if (slug) {
      this.isEditMode = true;
      this.loadPageBySlug(slug);
    }
  }

  loadPage(id: number): void {
    this.isLoading = true;
    this.pageService.getPageById(id).subscribe({
      next: (page) => {
        this.page = page;
        this.populateForm(page);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading page';
        this.isLoading = false;
        console.error('Error loading page:', error);
      }
    });
  }

  loadPageBySlug(slug: string): void {
    this.isLoading = true;
    this.pageService.getPageBySlug(slug).subscribe({
      next: (page) => {
        this.page = page;
        this.pageId = page.id || null;
        this.populateForm(page);
        this.isLoading = false;
      },
      error: (error) => {
        // If page doesn't exist, create a new one with this slug
        if (error.status === 404) {
          this.pageForm.patchValue({ slug });
          this.isEditMode = false;
          this.pageId = null;
        } else {
          this.errorMessage = 'Error loading page';
        }
        this.isLoading = false;
        console.error('Error loading page:', error);
      }
    });
  }

  populateForm(page: PageDTO): void {
    const translationsGroup = this.pageForm.get('translations') as FormGroup;
    
    // Populate basic page info
    this.pageForm.patchValue({
      slug: page.slug,
      pageType: page.pageType,
      ordre: page.ordre || null,
      parentId: page.parentId || null,
      heroImageUrl: page.heroImageUrl || '',
      isPublished: page.isPublished || false,
      isActive: page.isActive !== false
    });

    // Populate translations
    if (page.translations) {
      this.languages.forEach(lang => {
        const translation = page.translations?.[lang.code];
        if (translation) {
          const langGroup = translationsGroup.get(lang.code) as FormGroup;
          if (langGroup) {
            langGroup.patchValue({
              title: translation.title || '',
              heroTitle: translation.heroTitle || '',
              heroSubtitle: translation.heroSubtitle || '',
              sectionTitle: translation.sectionTitle || '',
              introText: translation.introText || '',
              description: translation.description || '',
              content: translation.content || '',
              extra: translation.extra ? JSON.stringify(JSON.parse(translation.extra), null, 2) : ''
            });
          }
        }
      });
    } else {
      // Backward compatibility: use main page fields for French translation
      const frGroup = translationsGroup.get('fr') as FormGroup;
      if (frGroup) {
        frGroup.patchValue({
          title: page.title || '',
          heroTitle: page.heroTitle || '',
          heroSubtitle: page.heroSubtitle || '',
          content: page.content || ''
        });
      }
    }
  }

  setSlugFromComponent(componentName: string): void {
    const slug = this.componentSlugs[componentName];
    if (slug) {
      this.pageForm.patchValue({ slug });
    }
  }

  getSlugKeys(): string[] {
    return Object.keys(this.componentSlugs);
  }

  setActiveLanguage(lang: string): void {
    this.activeLanguageTab = lang;
  }

  getTranslationFormGroup(lang: string): FormGroup {
    return (this.pageForm.get('translations') as FormGroup).get(lang) as FormGroup;
  }

  onSubmit(): void {
    if (this.pageForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.pageForm.value;
      const translations: { [key: string]: PageTranslationDTO } = {};

      // Build translations object
      this.languages.forEach(lang => {
        const langData = formValue.translations[lang.code];
        if (langData && langData.title) {
          translations[lang.code] = {
            title: langData.title,
            heroTitle: langData.heroTitle || undefined,
            heroSubtitle: langData.heroSubtitle || undefined,
            sectionTitle: langData.sectionTitle || undefined,
            introText: langData.introText || undefined,
            description: langData.description || undefined,
            content: langData.content || undefined,
            extra: langData.extra ? this.validateAndFormatJSON(langData.extra) : undefined
          };
        }
      });

      if (this.isEditMode && this.pageId) {
        const updateData: PageUpdateDTO = {
          slug: formValue.slug,
          pageType: formValue.pageType,
          ordre: formValue.ordre || undefined,
          parentId: formValue.parentId || undefined,
          heroImageUrl: formValue.heroImageUrl || undefined,
          translations: Object.keys(translations).length > 0 ? translations : undefined,
          isPublished: formValue.isPublished,
          isActive: formValue.isActive
        };

        this.pageService.updatePage(this.pageId, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/admin/pages']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Error updating page';
            console.error('Error updating page:', error);
          }
        });
      } else {
        if (Object.keys(translations).length === 0) {
          this.errorMessage = 'At least one translation (title) is required';
          this.isLoading = false;
          return;
        }

        const createData: PageCreateDTO = {
          slug: formValue.slug,
          pageType: formValue.pageType,
          ordre: formValue.ordre || undefined,
          parentId: formValue.parentId || undefined,
          heroImageUrl: formValue.heroImageUrl || undefined,
          translations: translations,
          isPublished: formValue.isPublished,
          isActive: formValue.isActive
        };

        this.pageService.createPage(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/admin/pages']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Error creating page';
            console.error('Error creating page:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill all required fields';
    }
  }

  private validateAndFormatJSON(jsonString: string): string | undefined {
    if (!jsonString || jsonString.trim() === '') {
      return undefined;
    }
    try {
      // Validate JSON by parsing it
      const parsed = JSON.parse(jsonString);
      // Return minified JSON string
      return JSON.stringify(parsed);
    } catch (e) {
      throw new Error(`Invalid JSON in extra field: ${e}`);
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pageForm.controls).forEach(key => {
      this.pageForm.get(key)?.markAsTouched();
    });
  }
}
