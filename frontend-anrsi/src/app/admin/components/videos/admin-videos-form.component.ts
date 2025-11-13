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

interface VideosContent {
  heroTitle: string;
  heroSubtitle: string;
  videos: VideoItem[];
  photos: PhotoItem[];
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
      heroTitle: ['Mediatique', Validators.required],
      heroSubtitle: ['Get in touch with our research teams and support staff', Validators.required],
      videos: this.fb.array([]),
      photos: this.fb.array([])
    });
  }

  // Videos FormArray methods
  get videos(): FormArray {
    return this.form.get('videos') as FormArray;
  }

  addVideo(item?: VideoItem): void {
    const group = this.fb.group({
      title: [item?.title || '', Validators.required],
      url: [item?.url || '', Validators.required],
      type: [item?.type || 'youtube', Validators.required]
    });
    this.videos.push(group);
  }

  removeVideo(index: number): void {
    this.videos.removeAt(index);
  }

  // Photos FormArray methods
  get photos(): FormArray {
    return this.form.get('photos') as FormArray;
  }

  addPhoto(item?: PhotoItem): void {
    const group = this.fb.group({
      title: [item?.title || ''],
      url: [item?.url || '', Validators.required],
      type: [item?.type || 'photo', Validators.required]
    });
    this.photos.push(group);
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
            const content: VideosContent = JSON.parse(page.content);
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
      heroTitle: 'Mediatique',
      heroSubtitle: 'Get in touch with our research teams and support staff'
    });

    // Clear existing arrays
    while (this.videos.length) this.videos.removeAt(0);
    while (this.photos.length) this.photos.removeAt(0);

    // Add default videos
    this.addVideo({ title: "Présentation de l'Agence", url: "https://www.youtube.com/embed/EMgwHc1F5W8", type: "youtube" });
    this.addVideo({ title: "Recherche Scientifique", url: "https://youtube.com/embed/bC2FLWuHTbI", type: "youtube" });
    this.addVideo({ title: "Nouvelles Technologies", url: "https://youtube.com/embed/4PupAG-vJnk", type: "youtube" });
    this.addVideo({ title: "Nouvelles Technologies", url: "https://youtube.com/embed/0yeNSWbl5MY", type: "youtube" });

    // Add default photos
    this.addPhoto({ title: "", url: "assets/images/277154633_374993344636114_8242637262867242236_n_0.jpg.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/316106463_190420513522892_2157453747881448998_n_0.jpg.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/directeur.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/article1.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/directeurr.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/IMG_1702AAA.jpg.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/IMG_1738DDDDDDDDD.jpg.jpeg", type: "photo" });
    this.addPhoto({ title: "", url: "assets/images/chef.jpeg", type: "photo" });
  }

  populateForm(content: VideosContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle || 'Mediatique',
      heroSubtitle: content.heroSubtitle || 'Get in touch with our research teams and support staff'
    });

    // Clear existing arrays
    while (this.videos.length) this.videos.removeAt(0);
    while (this.photos.length) this.photos.removeAt(0);

    // Populate arrays
    content.videos?.forEach(video => this.addVideo(video));
    content.photos?.forEach(photo => this.addPhoto(photo));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: VideosContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        videos: formValue.videos,
        photos: formValue.photos
      };

      const updateData: PageUpdateDTO = {
        title: 'Mediatique',
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
          slug: 'videos',
          title: 'Mediatique',
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

