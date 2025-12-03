import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface Partner {
  name: string;
  logo: string;
}

interface PartnersContent {
  partners: Partner[];
}

@Component({
  selector: 'app-admin-partners-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-partners-form.component.html',
  styleUrls: ['./admin-partners-form.component.scss']
})
export class AdminPartnersFormComponent implements OnInit {
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadPage();
  }

  createForm(): FormGroup {
    return this.fb.group({
      partners: this.fb.array([])
    });
  }

  get partners(): FormArray {
    return this.form.get('partners') as FormArray;
  }

  addPartner(item?: Partner): void {
    const group = this.fb.group({
      name: [item?.name || '', Validators.required],
      logo: [item?.logo || '', Validators.required]
    });
    this.partners.push(group);
  }

  removePartner(index: number): void {
    this.partners.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('partners').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            const content: PartnersContent = parsedContent;
            this.populateForm(content);
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

  loadDefaultData(): void {
    // Clear existing partners
    while (this.partners.length) {
      this.partners.removeAt(0);
    }

    // Add default partners
    this.addPartner({ name: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/250px-Flag_of_Saudi_Arabia.svg.png' });
    this.addPartner({ name: 'Pakistan', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg' });
    this.addPartner({ name: 'Japon', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg' });
    this.addPartner({ name: 'Sénégal', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg' });
  }

  populateForm(content: PartnersContent): void {
    // Clear existing partners
    while (this.partners.length) {
      this.partners.removeAt(0);
    }

    // Populate partners
    if (content.partners && Array.isArray(content.partners)) {
      content.partners.forEach(partner => this.addPartner(partner));
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = this.getLabel('formInvalid');
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    // Build content
    const content: PartnersContent = {
      partners: formValue.partners || []
    };

    // Build translations for the new structure (simple content without language-specific fields)
    const translations: { [key: string]: any } = {
      fr: {
        title: 'Nos Partenaires',
        extra: JSON.stringify(content)
      },
      ar: {
        title: 'شركاؤنا',
        extra: JSON.stringify(content)
      },
      en: {
        title: 'Our Partners',
        extra: JSON.stringify(content)
      }
    };

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
        slug: 'partners',
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

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  // Translation methods for form labels
  getLabel(key: string): string {
    const translations: { [key: string]: { fr: string; ar: string; en: string } } = {
      'editPage': {
        fr: 'Gérer les Partenaires',
        ar: 'إدارة الشركاء',
        en: 'Manage Partners'
      },
      'cancel': {
        fr: 'Annuler',
        ar: 'إلغاء',
        en: 'Cancel'
      },
      'partners': {
        fr: 'Partenaires',
        ar: 'الشركاء',
        en: 'Partners'
      },
      'name': {
        fr: 'Nom du Partenaire *',
        ar: 'اسم الشريك *',
        en: 'Partner Name *'
      },
      'logo': {
        fr: 'URL du Logo (SVG) *',
        ar: 'رابط الشعار (SVG) *',
        en: 'Logo URL (SVG) *'
      },
      'addPartner': {
        fr: 'Ajouter un Partenaire',
        ar: 'إضافة شريك',
        en: 'Add Partner'
      },
      'remove': {
        fr: 'Supprimer',
        ar: 'حذف',
        en: 'Remove'
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
        fr: 'Erreur lors de l\'enregistrement',
        ar: 'خطأ في الحفظ',
        en: 'Error saving page'
      },
      'errorCreatingPage': {
        fr: 'Erreur lors de la création',
        ar: 'خطأ في الإنشاء',
        en: 'Error creating page'
      },
      'formInvalid': {
        fr: 'Veuillez remplir tous les champs requis',
        ar: 'يرجى ملء جميع الحقول المطلوبة',
        en: 'Please fill in all required fields'
      },
      'logoHelp': {
        fr: 'Entrez l\'URL complète du logo (peut être un lien SVG, PNG, JPG, etc.)',
        ar: 'أدخل رابط الشعار الكامل (يمكن أن يكون رابط SVG أو PNG أو JPG)',
        en: 'Enter the full URL of the logo (can be SVG, PNG, JPG link, etc.)'
      }
    };

    // Default to French if key not found
    return translations[key]?.fr || key;
  }
}

