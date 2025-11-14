import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';
import { ArticleAdminService } from '../../services/article-admin.service';

interface TextJuridique {
  title: string;
  description?: string;
  downloadUrl?: string;
}

interface TextsJuridiquesContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  texts: TextJuridique[];
}

@Component({
  selector: 'app-admin-texts-juridiques-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-texts-juridiques-form.component.html',
  styleUrls: ['./admin-texts-juridiques-form.component.scss']
})
export class AdminTextsJuridiquesFormComponent implements OnInit {
  form: FormGroup;
  pageId: number | null = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private pageService: PageAdminService,
    private articleService: ArticleAdminService,
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
      heroTitle: ['', Validators.required],
      heroSubtitle: ['', Validators.required],
      sectionTitle: ['', Validators.required],
      texts: this.fb.array([])
    });
  }

  get texts(): FormArray {
    return this.form.get('texts') as FormArray;
  }

  addText(text?: TextJuridique): void {
    const group = this.fb.group({
      title: [text?.title || '', Validators.required],
      description: [text?.description || ''],
      downloadUrl: [text?.downloadUrl || '']
    });
    this.texts.push(group);
  }

  removeText(index: number): void {
    this.texts.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('texts-juridiques').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: TextsJuridiquesContent = JSON.parse(page.content);
            this.populateForm(content, page);
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
          this.errorMessage = 'Erreur lors du chargement de la page';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultData(): void {
    this.form.patchValue({
      heroTitle: 'Textes Juridiques',
      heroSubtitle: 'Textes juridiques régissant l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Textes Juridiques'
    });

    // Clear existing array
    while (this.texts.length) this.texts.removeAt(0);

    // Add default texts
    this.addText({ 
      title: 'Décret n:2020-066/PM/M.E.S.R.S.T.I.C/M.F/ portant création d\'un établissement public à caractère administratif dénommé, Agence nationale de la recherche scientifique et de l\'innovation et fixant les régles de son organisation et de son fonctionnement',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Arrêté conjoint n:001102/MF/MESRSTIC fixant le nomenclature des recettes et dépenses et le montant pour chaque dépense du compte d\'affectation spéciale de la recherche scientifique et l\'innovation.',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Décret n: 2015-119 / PM/2015 fixant la composition et le fonctionnement du conseil national de l\'Enseignement Supérieur et de la recherche scientifique (CNESRS).',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Arrêté n:0316 / MESRS, fixant les régles d\'organisation des des sociétés savantes',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Décret n: 2020-070/PM portant modification de certaines dispositions du décret n:2006-126 portant statut des enseignants chercheurs universitaires et hospitalo-universitaires modifié par le décret n:2019-115/PM du 11 juin 2019',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Décret n:2017-093/PM/MESRS/CI/2017, portant création de ( l\'autorité mauritanienne d\'Assurance-qualité de l\'enseignement supérieur ) et fixant les régles de son organisation et fonctionnement .',
      downloadUrl: '' 
    });
    this.addText({ 
      title: 'Arrêté n:0863/ portant création des écoles doctorales à L\'Université de nouakchott AL-Aasriya et fixant leur organisation et leurs régles de fonctionnement',
      downloadUrl: '' 
    });
  }

  populateForm(content: TextsJuridiquesContent, page: PageDTO): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || page.heroTitle || '',
      heroSubtitle: content.heroSubtitle || page.heroSubtitle || '',
      sectionTitle: content.sectionTitle || ''
    });

    // Clear existing array
    while (this.texts.length) this.texts.removeAt(0);

    // Populate array
    if (content.texts && content.texts.length > 0) {
      content.texts.forEach(text => this.addText(text));
    } else {
      this.loadDefaultData();
    }
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        this.errorMessage = 'Le fichier doit être un PDF ou un document Word';
        return;
      }
      
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMessage = 'La taille du fichier ne doit pas dépasser 50MB';
        return;
      }
      
      // Upload file
      this.uploadDocument(file, index);
    }
  }

  uploadDocument(file: File, index: number): void {
    this.errorMessage = '';
    const textGroup = this.texts.at(index) as FormGroup;
    
    this.articleService.uploadDocument(file).subscribe({
      next: (response) => {
        textGroup.patchValue({ downloadUrl: response.url });
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.error?.error || 'Erreur lors du téléchargement du fichier';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    
    const content: TextsJuridiquesContent = {
      heroTitle: formValue.heroTitle,
      heroSubtitle: formValue.heroSubtitle,
      sectionTitle: formValue.sectionTitle,
      texts: formValue.texts || []
    };

    const updateData: PageUpdateDTO = {
      title: 'Textes Juridiques',
      heroTitle: formValue.heroTitle,
      heroSubtitle: formValue.heroSubtitle,
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
          this.errorMessage = 'Erreur lors de l\'enregistrement de la page';
          console.error('Error saving page:', error);
        }
      });
    } else {
      this.pageService.createPage({
        slug: 'texts-juridiques',
        title: 'Textes Juridiques',
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
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
          this.errorMessage = 'Erreur lors de la création de la page';
          console.error('Error creating page:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

