import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsefulWebsitesAdminService, UsefulWebsite } from '../../services/useful-websites-admin.service';

@Component({
  selector: 'app-admin-useful-websites',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './admin-useful-websites.component.html',
  styleUrls: ['./admin-useful-websites.component.scss']
})
export class AdminUsefulWebsitesComponent implements OnInit {
  form: FormGroup;
  websites: UsefulWebsite[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private usefulWebsitesService: UsefulWebsitesAdminService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.form = this.fb.group({
      websites: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadWebsites();
  }

  get websitesFormArray(): FormArray {
    return this.form.get('websites') as FormArray;
  }

  loadWebsites(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.usefulWebsitesService.getAll().subscribe({
      next: (websites) => {
        this.websites = websites.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.populateForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading websites:', error);
        // If API returns 404 or empty, load default data
        if (error.status === 404 || error.status === 0) {
          this.loadDefaultWebsites();
        } else {
          this.errorMessage = 'Error loading websites. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  loadDefaultWebsites(): void {
    const defaultWebsites: UsefulWebsite[] = [
      {
        name: "Ministère l'Enseignement Supérieur et de la Recherche Scientifique(MESRS)",
        url: "https://mesrs.gov.mr/fr",
        order: 1
      },
      {
        name: "Université de Nouakchott Al Aasriya (UNA)",
        url: "https://www.una.mr/",
        order: 2
      },
      {
        name: "École Supérieure Polytechnique de Nouakchott(ESP-Nouakchott)",
        url: "http://www.esp.mr/",
        order: 3
      },
      {
        name: "Université des Sciences Islamiques d'Ayoune (USIA)",
        url: "https://www.usia.mr/",
        order: 4
      },
      {
        name: "Institut Supérieur d'Enseignement Technologique (ISET) Rosso",
        url: "http://www.iset.mr/",
        order: 5
      },
      {
        name: "Institut Mauritanien de Recherche Océanographique et des Pêches (IMROP)",
        url: "https://www.imrop.mr/",
        order: 6
      },
      {
        name: "Agence Nationale de Recherches Géologiques et du Patrimoine Minier (ANARPAM)",
        url: "https://anarpam.mr/",
        order: 7
      },
      {
        name: "Autorité Mauritanienne d'Assurance Qualité de l'Enseignement Supérieur et de la Recherche Scientifique (AMAQ-ES)",
        url: "http://amaqes.mr/?q=node/1435",
        order: 8
      },
      {
        name: "Institut Mauritanien de Recherches et de Formation en Matiére de Patrimoine et de Culture (IMRFPC)",
        url: "http://imrspc.mr/",
        order: 9
      },
      {
        name: "Centre National de Recherche Agronomique et de Développement Agricole (CNRADA)",
        url: "https://www.cnrada.org/",
        order: 10
      },
      {
        name: "GDG Nouakchott",
        url: "https://gdg.community.dev/gdg-nouakchott/",
        order: 11
      },
      {
        name: "Sahel Fablab INNORIM",
        url: "http://www.innovrim.org/",
        order: 12
      }
    ];
    
    this.websites = defaultWebsites;
    this.populateForm();
  }

  populateForm(): void {
    // Clear existing form array
    while (this.websitesFormArray.length) {
      this.websitesFormArray.removeAt(0);
    }

    // Populate with websites
    this.websites.forEach(website => {
      this.addWebsiteFormGroup(website);
    });
  }

  addWebsiteFormGroup(website?: UsefulWebsite): void {
    const group = this.fb.group({
      id: [website?.id || null],
      name: [website?.name || '', [Validators.required, Validators.minLength(3)]],
      url: [website?.url || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      order: [website?.order || this.websitesFormArray.length + 1]
    });
    this.websitesFormArray.push(group);
  }

  addNewWebsite(): void {
    this.addWebsiteFormGroup();
    this.scrollToBottom();
  }

  removeWebsite(index: number): void {
    const formGroup = this.websitesFormArray.at(index);
    const websiteId = formGroup.get('id')?.value;
    
    if (websiteId) {
      // If it has an ID, delete from backend
      this.usefulWebsitesService.delete(websiteId).subscribe({
        next: () => {
          this.websitesFormArray.removeAt(index);
          this.updateOrders();
          this.successMessage = 'Website deleted successfully.';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting website:', error);
          this.errorMessage = 'Error deleting website. Please try again.';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    } else {
      // If no ID, just remove from form
      this.websitesFormArray.removeAt(index);
      this.updateOrders();
    }
  }

  updateOrders(): void {
    this.websitesFormArray.controls.forEach((control, index) => {
      control.patchValue({ order: index + 1 }, { emitEvent: false });
    });
  }

  moveUp(index: number): void {
    if (index > 0) {
      const formArray = this.websitesFormArray;
      const temp = formArray.at(index);
      formArray.removeAt(index);
      formArray.insert(index - 1, temp);
      this.updateOrders();
    }
  }

  moveDown(index: number): void {
    const formArray = this.websitesFormArray;
    if (index < formArray.length - 1) {
      const temp = formArray.at(index);
      formArray.removeAt(index);
      formArray.insert(index + 1, temp);
      this.updateOrders();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.form.value;
    const websitesToSave = formValue.websites.map((website: any, index: number) => ({
      ...website,
      order: index + 1
    }));

    // Save all websites
    const savePromises = websitesToSave.map((website: any) => {
      if (website.id) {
        return this.usefulWebsitesService.update(website.id, {
          name: website.name,
          url: website.url,
          order: website.order
        }).toPromise();
      } else {
        return this.usefulWebsitesService.create({
          name: website.name,
          url: website.url,
          order: website.order
        }).toPromise();
      }
    });

    Promise.all(savePromises)
      .then(() => {
        this.isSaving = false;
        this.successMessage = 'Websites saved successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.loadWebsites();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error saving websites:', error);
        this.isSaving = false;
        this.errorMessage = 'Error saving websites. Please try again.';
        setTimeout(() => this.errorMessage = '', 5000);
      });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: any) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  getErrorMessage(control: any): string {
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid URL (starting with http:// or https://)';
    }
    if (control?.hasError('minlength')) {
      return 'This field is too short';
    }
    return '';
  }
}


