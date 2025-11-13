import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface OverviewItem {
  icon: string;
  title: string;
  content: { label: string; value: string }[];
}

interface ThemeItem {
  icon: string;
  title: string;
  items: string[];
}

interface Session {
  time: string;
  title: string;
  description: string;
}

interface ProgrammeDay {
  date: string;
  theme: string;
  sessions: Session[];
}

interface Speaker {
  avatar: string;
  name: string;
  title: string;
  bio: string;
}

interface RegistrationMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ZoneHumideContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  overview: OverviewItem[];
  themes: ThemeItem[];
  programme: ProgrammeDay[];
  speakers: Speaker[];
  registrationModes: RegistrationMode[];
  processSteps: ProcessStep[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-admin-zone-humide-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-zone-humide-form.component.html',
  styleUrls: ['./admin-zone-humide-form.component.scss']
})
export class AdminZoneHumideFormComponent implements OnInit {
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
      heroTitle: ['Zone Humide', Validators.required],
      heroSubtitle: ['Colloque International sur les Zones Humides du Sahel', Validators.required],
      introText: ['', Validators.required],
      overview: this.fb.array([]),
      themes: this.fb.array([]),
      programme: this.fb.array([]),
      speakers: this.fb.array([]),
      registrationModes: this.fb.array([]),
      processSteps: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  // Overview FormArray methods
  get overview(): FormArray {
    return this.form.get('overview') as FormArray;
  }

  addOverview(item?: OverviewItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '📅', Validators.required],
      title: [item?.title || '', Validators.required],
      content: this.fb.array(item?.content?.map(c => this.createContentItemGroup(c)) || [])
    });
    this.overview.push(group);
  }

  removeOverview(index: number): void {
    this.overview.removeAt(index);
  }

  getOverviewContent(index: number): FormArray {
    return this.overview.at(index).get('content') as FormArray;
  }

  createContentItemGroup(item?: { label: string; value: string }): FormGroup {
    return this.fb.group({
      label: [item?.label || '', Validators.required],
      value: [item?.value || '', Validators.required]
    });
  }

  addOverviewContentItem(overviewIndex: number): void {
    this.getOverviewContent(overviewIndex).push(this.createContentItemGroup());
  }

  removeOverviewContentItem(overviewIndex: number, itemIndex: number): void {
    this.getOverviewContent(overviewIndex).removeAt(itemIndex);
  }

  // Themes FormArray methods
  get themes(): FormArray {
    return this.form.get('themes') as FormArray;
  }

  addTheme(item?: ThemeItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '💧', Validators.required],
      title: [item?.title || '', Validators.required],
      items: this.fb.array(item?.items?.map(i => this.fb.control(i)) || [])
    });
    this.themes.push(group);
  }

  removeTheme(index: number): void {
    this.themes.removeAt(index);
  }

  getThemeItems(index: number): FormArray {
    return this.themes.at(index).get('items') as FormArray;
  }

  addThemeItem(index: number, value = ''): void {
    this.getThemeItems(index).push(this.fb.control(value));
  }

  removeThemeItem(themeIndex: number, itemIndex: number): void {
    this.getThemeItems(themeIndex).removeAt(itemIndex);
  }

  // Programme FormArray methods
  get programme(): FormArray {
    return this.form.get('programme') as FormArray;
  }

  addProgrammeDay(day?: ProgrammeDay): void {
    const group = this.fb.group({
      date: [day?.date || '', Validators.required],
      theme: [day?.theme || '', Validators.required],
      sessions: this.fb.array(day?.sessions?.map(s => this.createSessionGroup(s)) || [])
    });
    this.programme.push(group);
  }

  removeProgrammeDay(index: number): void {
    this.programme.removeAt(index);
  }

  getDaySessions(index: number): FormArray {
    return this.programme.at(index).get('sessions') as FormArray;
  }

  createSessionGroup(session?: Session): FormGroup {
    return this.fb.group({
      time: [session?.time || '', Validators.required],
      title: [session?.title || '', Validators.required],
      description: [session?.description || '', Validators.required]
    });
  }

  addSession(dayIndex: number): void {
    this.getDaySessions(dayIndex).push(this.createSessionGroup());
  }

  removeSession(dayIndex: number, sessionIndex: number): void {
    this.getDaySessions(dayIndex).removeAt(sessionIndex);
  }

  // Speakers FormArray methods
  get speakers(): FormArray {
    return this.form.get('speakers') as FormArray;
  }

  addSpeaker(speaker?: Speaker): void {
    const group = this.fb.group({
      avatar: [speaker?.avatar || '👨‍🔬', Validators.required],
      name: [speaker?.name || '', Validators.required],
      title: [speaker?.title || '', Validators.required],
      bio: [speaker?.bio || '', Validators.required]
    });
    this.speakers.push(group);
  }

  removeSpeaker(index: number): void {
    this.speakers.removeAt(index);
  }

  // Registration Modes FormArray methods
  get registrationModes(): FormArray {
    return this.form.get('registrationModes') as FormArray;
  }

  addRegistrationMode(mode?: RegistrationMode): void {
    const group = this.fb.group({
      icon: [mode?.icon || '🏢', Validators.required],
      title: [mode?.title || '', Validators.required],
      description: [mode?.description || '', Validators.required],
      items: this.fb.array(mode?.items?.map(i => this.fb.control(i)) || []),
      price: [mode?.price || '', Validators.required]
    });
    this.registrationModes.push(group);
  }

  removeRegistrationMode(index: number): void {
    this.registrationModes.removeAt(index);
  }

  getModeItems(index: number): FormArray {
    return this.registrationModes.at(index).get('items') as FormArray;
  }

  addModeItem(index: number, value = ''): void {
    this.getModeItems(index).push(this.fb.control(value));
  }

  removeModeItem(modeIndex: number, itemIndex: number): void {
    this.getModeItems(modeIndex).removeAt(itemIndex);
  }

  // Process Steps FormArray methods
  get processSteps(): FormArray {
    return this.form.get('processSteps') as FormArray;
  }

  addProcessStep(step?: ProcessStep): void {
    const group = this.fb.group({
      number: [step?.number || this.processSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    this.processSteps.push(group);
  }

  removeProcessStep(index: number): void {
    this.processSteps.removeAt(index);
    // Renumber remaining steps
    this.processSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
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
    this.pageService.getPageBySlug('zone-humide').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: ZoneHumideContent = JSON.parse(page.content);
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
      heroTitle: 'Zone Humide',
      heroSubtitle: 'Colloque International sur les Zones Humides du Sahel',
      introText: 'L\'ANRSI organise un colloque international majeur sur la préservation et la gestion durable des zones humides du Sahel, réunissant experts, chercheurs et décideurs pour échanger sur les enjeux environnementaux et climatiques.'
    });

    // Add default overview
    this.addOverview({
      icon: '📅',
      title: 'Dates et Lieu',
      content: [
        { label: 'Date :', value: '15-17 Mars 2024' },
        { label: 'Lieu :', value: 'Centre International de Conférences, Nouakchott' },
        { label: 'Format :', value: 'Présentiel et en ligne' }
      ]
    });
    this.addOverview({
      icon: '👥',
      title: 'Participants Attendus',
      content: [
        { label: 'Experts internationaux :', value: '50+ spécialistes' },
        { label: 'Chercheurs :', value: '100+ scientifiques' },
        { label: 'Décideurs :', value: 'Ministres et responsables' },
        { label: 'ONG et OSC :', value: 'Organisations de la société civile' }
      ]
    });
    this.addOverview({
      icon: '🌍',
      title: 'Pays Participants',
      content: [
        { label: 'Afrique de l\'Ouest :', value: 'Sénégal, Mali, Niger, Burkina Faso' },
        { label: 'Afrique du Nord :', value: 'Maroc, Algérie, Tunisie' },
        { label: 'Europe :', value: 'France, Belgique, Espagne' },
        { label: 'Organisations :', value: 'UICN, Ramsar, PNUE' }
      ]
    });

    // Add default themes
    this.addTheme({
      icon: '💧',
      title: 'Gestion des Ressources Hydriques',
      items: ['Conservation des zones humides', 'Gestion intégrée des bassins versants', 'Technologies de traitement de l\'eau', 'Économie de l\'eau']
    });
    this.addTheme({
      icon: '🌱',
      title: 'Biodiversité et Écosystèmes',
      items: ['Protection de la faune et flore', 'Restauration écologique', 'Services écosystémiques', 'Corridors écologiques']
    });
    this.addTheme({
      icon: '🌡️',
      title: 'Changement Climatique',
      items: ['Adaptation aux changements climatiques', 'Atténuation des effets', 'Modélisation climatique', 'Stratégies de résilience']
    });
    this.addTheme({
      icon: '👨‍🌾',
      title: 'Développement Durable',
      items: ['Agriculture durable', 'Pêche responsable', 'Écotourisme', 'Économie verte']
    });
    this.addTheme({
      icon: '🏛️',
      title: 'Gouvernance et Politiques',
      items: ['Cadres législatifs', 'Politiques publiques', 'Participation communautaire', 'Coopération internationale']
    });
    this.addTheme({
      icon: '🔬',
      title: 'Recherche et Innovation',
      items: ['Technologies de monitoring', 'Innovation environnementale', 'Transfert de connaissances', 'Formation et éducation']
    });

    // Add default contact info
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email', value: 'zonehumide@anrsi.mr' });
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' });
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Lieu', value: 'Centre International de Conférences, Nouakchott' });
    this.addContactItem({ icon: 'fas fa-calendar', label: 'Date Limite', value: '28 Février 2024' });
  }

  populateForm(content: ZoneHumideContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText
    });

    // Clear existing arrays
    while (this.overview.length) this.overview.removeAt(0);
    while (this.themes.length) this.themes.removeAt(0);
    while (this.programme.length) this.programme.removeAt(0);
    while (this.speakers.length) this.speakers.removeAt(0);
    while (this.registrationModes.length) this.registrationModes.removeAt(0);
    while (this.processSteps.length) this.processSteps.removeAt(0);
    while (this.contactInfo.length) this.contactInfo.removeAt(0);

    // Populate arrays
    content.overview?.forEach(item => this.addOverview(item));
    content.themes?.forEach(item => this.addTheme(item));
    content.programme?.forEach(item => this.addProgrammeDay(item));
    content.speakers?.forEach(item => this.addSpeaker(item));
    content.registrationModes?.forEach(item => this.addRegistrationMode(item));
    content.processSteps?.forEach(item => this.addProcessStep(item));
    content.contactInfo?.forEach(item => this.addContactItem(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: ZoneHumideContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        overview: formValue.overview.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          content: item.content
        })),
        themes: formValue.themes.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          items: item.items
        })),
        programme: formValue.programme.map((item: any) => ({
          date: item.date,
          theme: item.theme,
          sessions: item.sessions
        })),
        speakers: formValue.speakers,
        registrationModes: formValue.registrationModes.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
          items: item.items,
          price: item.price
        })),
        processSteps: formValue.processSteps,
        contactInfo: formValue.contactInfo
      };

      const updateData: PageUpdateDTO = {
        title: 'Zone Humide',
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
          slug: 'zone-humide',
          title: 'Zone Humide',
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

