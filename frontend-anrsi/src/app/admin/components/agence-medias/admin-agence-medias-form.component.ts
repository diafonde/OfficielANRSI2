import { Component, OnInit } from '@angular/core';
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

interface AgenceMediasContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  mediaOverview: MediaOverview[];
  recentCoverage: CoverageItem[];
  mediaTypes: MediaType[];
  pressReleases: PressRelease[];
  mediaKit: MediaKitItem[];
  socialMedia: SocialPlatform[];
  contactInfo: ContactItem[];
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
      heroTitle: ['ANRSI dans les Médias', Validators.required],
      heroSubtitle: ['Actualités, publications et visibilité médiatique', Validators.required],
      introText: ['', Validators.required],
      mediaOverview: this.fb.array([]),
      recentCoverage: this.fb.array([]),
      mediaTypes: this.fb.array([]),
      pressReleases: this.fb.array([]),
      mediaKit: this.fb.array([]),
      socialMedia: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  // Media Overview FormArray methods
  get mediaOverview(): FormArray {
    return this.form.get('mediaOverview') as FormArray;
  }

  addMediaOverview(item?: MediaOverview): void {
    const group = this.fb.group({
      icon: [item?.icon || '📺', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    this.mediaOverview.push(group);
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
    return this.form.get('recentCoverage') as FormArray;
  }

  addCoverageItem(item?: CoverageItem): void {
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      mediaOutlets: this.fb.array(item?.mediaOutlets?.map(o => this.createMediaOutletGroup(o)) || [])
    });
    this.recentCoverage.push(group);
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
    return this.form.get('mediaTypes') as FormArray;
  }

  addMediaType(item?: MediaType): void {
    const group = this.fb.group({
      icon: [item?.icon || '🎤', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    this.mediaTypes.push(group);
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
    return this.form.get('pressReleases') as FormArray;
  }

  addPressRelease(item?: PressRelease): void {
    const group = this.fb.group({
      date: [item?.date || '', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    this.pressReleases.push(group);
  }

  removePressRelease(index: number): void {
    this.pressReleases.removeAt(index);
  }

  // Media Kit FormArray methods
  get mediaKit(): FormArray {
    return this.form.get('mediaKit') as FormArray;
  }

  addMediaKitItem(item?: MediaKitItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '📸', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      link: [item?.link || '']
    });
    this.mediaKit.push(group);
  }

  removeMediaKitItem(index: number): void {
    this.mediaKit.removeAt(index);
  }

  // Social Media FormArray methods
  get socialMedia(): FormArray {
    return this.form.get('socialMedia') as FormArray;
  }

  addSocialPlatform(item?: SocialPlatform): void {
    const group = this.fb.group({
      icon: [item?.icon || '📘', Validators.required],
      name: [item?.name || '', Validators.required],
      handle: [item?.handle || '', Validators.required],
      link: [item?.link || '']
    });
    this.socialMedia.push(group);
  }

  removeSocialPlatform(index: number): void {
    this.socialMedia.removeAt(index);
  }

  // Contact Info FormArray methods
  get contactInfo(): FormArray {
    return this.form.get('contactInfo') as FormArray;
  }

  addContactItem(item?: ContactItem): void {
    const group = this.fb.group({
      icon: [item?.icon || 'fas fa-envelope', Validators.required],
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
    this.contactInfo.push(group);
  }

  removeContactItem(index: number): void {
    this.contactInfo.removeAt(index);
  }

  loadPage(): void {
    this.isLoading = true;
    this.pageService.getPageBySlug('agence-medias').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: AgenceMediasContent = JSON.parse(page.content);
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
    // Load default data structure
    this.form.patchValue({
      heroTitle: 'ANRSI dans les Médias',
      heroSubtitle: 'Actualités, publications et visibilité médiatique',
      introText: 'L\'Agence Nationale de la Recherche Scientifique et de l\'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l\'innovation technologique, et les initiatives de développement en Mauritanie.'
    });

    // Add default media overview items
    this.addMediaOverview({ 
      icon: '📺', 
      title: 'Médias Audiovisuels', 
      description: 'Interviews, reportages et émissions spéciales sur les chaînes de télévision et radios nationales et internationales.', 
      items: ['TVM (Télévision de Mauritanie)', 'Radio Mauritanie', 'Chaînes internationales', 'Podcasts scientifiques'] 
    });
    this.addMediaOverview({ 
      icon: '📰', 
      title: 'Presse Écrite', 
      description: 'Articles, tribunes et publications dans les journaux nationaux et internationaux.', 
      items: ['Le Calame', 'Horizons', 'Mauritanie News', 'Revues scientifiques'] 
    });
    this.addMediaOverview({ 
      icon: '🌐', 
      title: 'Médias Numériques', 
      description: 'Présence active sur les plateformes numériques et réseaux sociaux.', 
      items: ['Site web officiel', 'Réseaux sociaux', 'Newsletters', 'Webinaires'] 
    });

    // Add default media types
    this.addMediaType({ 
      icon: '🎤', 
      title: 'Interviews et Déclarations', 
      description: 'Interviews exclusives avec le Directeur Général et les experts de l\'ANRSI sur les enjeux scientifiques et technologiques.', 
      items: ['Interviews télévisées', 'Déclarations officielles', 'Points de presse', 'Conférences de presse'] 
    });
    this.addMediaType({ 
      icon: '📊', 
      title: 'Reportages et Documentaires', 
      description: 'Reportages approfondis sur les projets de recherche, les innovations technologiques et les initiatives de développement.', 
      items: ['Reportages terrain', 'Documentaires scientifiques', 'Émissions spéciales', 'Portraits d\'experts'] 
    });
    this.addMediaType({ 
      icon: '📝', 
      title: 'Articles et Publications', 
      description: 'Articles de fond, tribunes et publications dans les médias nationaux et internationaux.', 
      items: ['Articles d\'opinion', 'Tribunes libres', 'Publications scientifiques', 'Communiqués de presse'] 
    });
    this.addMediaType({ 
      icon: '🎥', 
      title: 'Contenu Multimédia', 
      description: 'Production de contenu vidéo, audio et interactif pour les plateformes numériques.', 
      items: ['Vidéos éducatives', 'Podcasts scientifiques', 'Webinaires', 'Contenu interactif'] 
    });

    // Add default media kit
    this.addMediaKitItem({ 
      icon: '📸', 
      title: 'Photos et Images', 
      description: 'Banque d\'images haute résolution des installations, équipements et événements de l\'ANRSI.', 
      link: '#' 
    });
    this.addMediaKitItem({ 
      icon: '🎥', 
      title: 'Vidéos et B-Roll', 
      description: 'Vidéos de présentation, interviews et séquences B-Roll pour les reportages télévisés.', 
      link: '#' 
    });
    this.addMediaKitItem({ 
      icon: '📄', 
      title: 'Documents et Fiches', 
      description: 'Fiches techniques, présentations et documents d\'information sur les programmes et projets.', 
      link: '#' 
    });
    this.addMediaKitItem({ 
      icon: '👥', 
      title: 'Contacts Presse', 
      description: 'Liste des contacts presse et experts disponibles pour interviews et commentaires.', 
      link: '#' 
    });

    // Add default social media
    this.addSocialPlatform({ icon: '📘', name: 'Facebook', handle: '@ANRSI.Mauritanie', link: '#' });
    this.addSocialPlatform({ icon: '🐦', name: 'Twitter', handle: '@ANRSI_MR', link: '#' });
    this.addSocialPlatform({ icon: '💼', name: 'LinkedIn', handle: 'ANRSI Mauritanie', link: '#' });
    this.addSocialPlatform({ icon: '📺', name: 'YouTube', handle: 'ANRSI Mauritanie', link: '#' });

    // Add default contact info
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email Presse', value: 'presse@anrsi.mr' });
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' });
    this.addContactItem({ icon: 'fas fa-user', label: 'Responsable Presse', value: 'Mme Fatima Mint Ahmed' });
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 16h00' });
  }

  populateForm(content: AgenceMediasContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText
    });

    // Clear existing arrays
    while (this.mediaOverview.length) this.mediaOverview.removeAt(0);
    while (this.recentCoverage.length) this.recentCoverage.removeAt(0);
    while (this.mediaTypes.length) this.mediaTypes.removeAt(0);
    while (this.pressReleases.length) this.pressReleases.removeAt(0);
    while (this.mediaKit.length) this.mediaKit.removeAt(0);
    while (this.socialMedia.length) this.socialMedia.removeAt(0);
    while (this.contactInfo.length) this.contactInfo.removeAt(0);

    // Populate arrays
    content.mediaOverview?.forEach(item => this.addMediaOverview(item));
    content.recentCoverage?.forEach(item => this.addCoverageItem(item));
    content.mediaTypes?.forEach(item => this.addMediaType(item));
    content.pressReleases?.forEach(item => this.addPressRelease(item));
    content.mediaKit?.forEach(item => this.addMediaKitItem(item));
    content.socialMedia?.forEach(item => this.addSocialPlatform(item));
    content.contactInfo?.forEach(item => this.addContactItem(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: AgenceMediasContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        mediaOverview: formValue.mediaOverview.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
          items: item.items
        })),
        recentCoverage: formValue.recentCoverage.map((item: any) => ({
          date: item.date,
          title: item.title,
          description: item.description,
          mediaOutlets: item.mediaOutlets
        })),
        mediaTypes: formValue.mediaTypes.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
          items: item.items
        })),
        pressReleases: formValue.pressReleases,
        mediaKit: formValue.mediaKit,
        socialMedia: formValue.socialMedia,
        contactInfo: formValue.contactInfo
      };

      const updateData: PageUpdateDTO = {
        title: 'ANRSI dans les Médias',
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
        // Create new page
        this.pageService.createPage({
          slug: 'agence-medias',
          title: 'ANRSI dans les Médias',
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

