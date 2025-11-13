import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface BoardMember {
  name: string;
  position: string;
}

interface ConseilAdministrationContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  introText: string;
  boardMembers: BoardMember[];
  updateDate: string;
}

@Component({
  selector: 'app-admin-conseil-administration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-conseil-administration-form.component.html',
  styleUrls: ['./admin-conseil-administration-form.component.scss']
})
export class AdminConseilAdministrationFormComponent implements OnInit {
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
      heroTitle: ['Conseil d\'Administration', Validators.required],
      heroSubtitle: ['Composition du Conseil d\'Administration de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation', Validators.required],
      sectionTitle: ['Membres du Conseil d\'Administration', Validators.required],
      introText: ['', Validators.required],
      boardMembers: this.fb.array([]),
      updateDate: ['', Validators.required]
    });
  }

  // Board Members FormArray methods
  get boardMembers(): FormArray {
    return this.form.get('boardMembers') as FormArray;
  }

  addBoardMember(member?: BoardMember): void {
    const group = this.fb.group({
      name: [member?.name || '', Validators.required],
      position: [member?.position || '', Validators.required]
    });
    this.boardMembers.push(group);
  }

  removeBoardMember(index: number): void {
    this.boardMembers.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('conseil-administration').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: ConseilAdministrationContent = JSON.parse(page.content);
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
          this.errorMessage = 'Error loading page';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultData(): void {
    this.form.patchValue({
      heroTitle: 'Conseil d\'Administration',
      heroSubtitle: 'Composition du Conseil d\'Administration de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: 'Membres du Conseil d\'Administration',
      introText: 'Le Conseil d\'Administration de l\'ANRSI est composé de représentants de différentes institutions et secteurs, assurant une gouvernance équilibrée et représentative.',
      updateDate: '11 Novembre 2021'
    });

    // Clear existing array
    while (this.boardMembers.length) this.boardMembers.removeAt(0);

    // Add default board members
    this.addBoardMember({ name: 'Mohamed Sidiya Khabaz', position: 'Président du CA' });
    this.addBoardMember({ name: 'AHMED SALEM OULD MOHAMED VADEL', position: 'Représentant de la Présidence de la République' });
    this.addBoardMember({ name: 'HOUDA BABAH', position: 'Représentante du Premier Ministère' });
    this.addBoardMember({ name: 'SAAD BOUH OULD SIDATY', position: 'Représentant du Ministère des Finances' });
    this.addBoardMember({ name: 'Mohamed Yahya Dah', position: 'Représentant du Ministère de l\'Enseignement Supérieur, de la Recherche Scientifique et de l\'Innovation' });
    this.addBoardMember({ name: 'WAGUE OUSMANE', position: 'Enseignant-chercheur' });
    this.addBoardMember({ name: 'SALEM MOHAMED EL MOCTAR ABEIDNA', position: 'Enseignant-chercheur' });
    this.addBoardMember({ name: 'HANCHI MOHAMED SALEH', position: 'Représentant de l\'Union Nationale du Patronat Mauritanien' });
    this.addBoardMember({ name: 'MOHAMED EL MOCTAR YAHYA MOHAMEDINE', position: 'Représentant de l\'Union Nationale du Patronat Mauritanien' });
    this.addBoardMember({ name: 'WANE ABDOUL AZIZ', position: 'Représentant de la Chambre de Commerce, d\'Industrie et d\'Agriculture de Mauritanie' });
    this.addBoardMember({ name: 'AHMEDOU HAOUBA', position: 'Enseignant-chercheur' });
    this.addBoardMember({ name: 'Mohamedou Mbaba', position: 'Représentant du Ministère des Affaires Economiques et de la Promotion des secteurs Productifs' });
  }

  populateForm(content: ConseilAdministrationContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Conseil d\'Administration',
      heroSubtitle: content.heroSubtitle || 'Composition du Conseil d\'Administration de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      sectionTitle: content.sectionTitle || 'Membres du Conseil d\'Administration',
      introText: content.introText || '',
      updateDate: content.updateDate || ''
    });

    // Clear existing array
    while (this.boardMembers.length) this.boardMembers.removeAt(0);

    // Populate array
    content.boardMembers?.forEach(member => this.addBoardMember(member));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: ConseilAdministrationContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        sectionTitle: formValue.sectionTitle,
        introText: formValue.introText,
        boardMembers: formValue.boardMembers,
        updateDate: formValue.updateDate
      };

      const updateData: PageUpdateDTO = {
        title: 'Conseil d\'Administration',
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
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
            this.errorMessage = 'Error saving page';
            console.error('Error saving page:', error);
          }
        });
      } else {
        this.pageService.createPage({
          slug: 'conseil-administration',
          title: 'Conseil d\'Administration',
          heroTitle: content.heroTitle,
          heroSubtitle: content.heroSubtitle,
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
            this.errorMessage = 'Error creating page';
            console.error('Error creating page:', error);
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pages']);
  }
}

