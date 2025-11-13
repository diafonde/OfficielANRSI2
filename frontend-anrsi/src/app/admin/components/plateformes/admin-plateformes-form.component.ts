import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PageAdminService, PageDTO, PageCreateDTO, PageUpdateDTO } from '../../services/page-admin.service';

interface PlateformeItem {
  icon: string;
  title: string;
  description: string;
  equipments: string[];
  services: string[];
  contact: string;
}

interface AccessMode {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

interface BookingStep {
  number: number;
  title: string;
  description: string;
}

interface SupportItem {
  icon: string;
  title: string;
  description: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface PlateformesContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  plateformes: PlateformeItem[];
  accessModes: AccessMode[];
  bookingSteps: BookingStep[];
  bookingRequirements: string[];
  supportItems: SupportItem[];
  contactInfo: ContactItem[];
}

@Component({
  selector: 'app-admin-plateformes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-plateformes-form.component.html',
  styleUrls: ['./admin-plateformes-form.component.scss']
})
export class AdminPlateformesFormComponent implements OnInit {
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
      heroTitle: ['Plateformes', Validators.required],
      heroSubtitle: ['Outils et technologies pour la recherche et l\'innovation', Validators.required],
      introText: ['', Validators.required],
      plateformes: this.fb.array([]),
      accessModes: this.fb.array([]),
      bookingSteps: this.fb.array([]),
      bookingRequirements: this.fb.array([]),
      supportItems: this.fb.array([]),
      contactInfo: this.fb.array([])
    });
  }

  // Plateformes FormArray methods
  get plateformes(): FormArray {
    return this.form.get('plateformes') as FormArray;
  }

  addPlateforme(item?: PlateformeItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '🔬', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      equipments: this.fb.array(item?.equipments?.map(e => this.fb.control(e)) || []),
      services: this.fb.array(item?.services?.map(s => this.fb.control(s)) || []),
      contact: [item?.contact || '', Validators.required]
    });
    this.plateformes.push(group);
  }

  removePlateforme(index: number): void {
    this.plateformes.removeAt(index);
  }

  getPlateformeEquipments(index: number): FormArray {
    return this.plateformes.at(index).get('equipments') as FormArray;
  }

  addEquipment(plateformeIndex: number, value = ''): void {
    this.getPlateformeEquipments(plateformeIndex).push(this.fb.control(value));
  }

  removeEquipment(plateformeIndex: number, equipmentIndex: number): void {
    this.getPlateformeEquipments(plateformeIndex).removeAt(equipmentIndex);
  }

  getPlateformeServices(index: number): FormArray {
    return this.plateformes.at(index).get('services') as FormArray;
  }

  addService(plateformeIndex: number, value = ''): void {
    this.getPlateformeServices(plateformeIndex).push(this.fb.control(value));
  }

  removeService(plateformeIndex: number, serviceIndex: number): void {
    this.getPlateformeServices(plateformeIndex).removeAt(serviceIndex);
  }

  // Access Modes FormArray methods
  get accessModes(): FormArray {
    return this.form.get('accessModes') as FormArray;
  }

  addAccessMode(mode?: AccessMode): void {
    const group = this.fb.group({
      icon: [mode?.icon || '🎓', Validators.required],
      title: [mode?.title || '', Validators.required],
      description: [mode?.description || '', Validators.required],
      items: this.fb.array(mode?.items?.map(i => this.fb.control(i)) || [])
    });
    this.accessModes.push(group);
  }

  removeAccessMode(index: number): void {
    this.accessModes.removeAt(index);
  }

  getAccessModeItems(index: number): FormArray {
    return this.accessModes.at(index).get('items') as FormArray;
  }

  addAccessModeItem(index: number, value = ''): void {
    this.getAccessModeItems(index).push(this.fb.control(value));
  }

  removeAccessModeItem(modeIndex: number, itemIndex: number): void {
    this.getAccessModeItems(modeIndex).removeAt(itemIndex);
  }

  // Booking Steps FormArray methods
  get bookingSteps(): FormArray {
    return this.form.get('bookingSteps') as FormArray;
  }

  addBookingStep(step?: BookingStep): void {
    const group = this.fb.group({
      number: [step?.number || this.bookingSteps.length + 1, Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required]
    });
    this.bookingSteps.push(group);
  }

  removeBookingStep(index: number): void {
    this.bookingSteps.removeAt(index);
    // Renumber remaining steps
    this.bookingSteps.controls.forEach((control, i) => {
      control.patchValue({ number: i + 1 });
    });
  }

  // Booking Requirements FormArray methods
  get bookingRequirements(): FormArray {
    return this.form.get('bookingRequirements') as FormArray;
  }

  addBookingRequirement(value = ''): void {
    this.bookingRequirements.push(this.fb.control(value));
  }

  removeBookingRequirement(index: number): void {
    this.bookingRequirements.removeAt(index);
  }

  // Support Items FormArray methods
  get supportItems(): FormArray {
    return this.form.get('supportItems') as FormArray;
  }

  addSupportItem(item?: SupportItem): void {
    const group = this.fb.group({
      icon: [item?.icon || '📚', Validators.required],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required]
    });
    this.supportItems.push(group);
  }

  removeSupportItem(index: number): void {
    this.supportItems.removeAt(index);
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
    this.pageService.getPageBySlug('plateformes').subscribe({
      next: (page) => {
        this.pageId = page.id || null;
        if (page.content) {
          try {
            const content: PlateformesContent = JSON.parse(page.content);
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
      heroTitle: 'Plateformes',
      heroSubtitle: 'Outils et technologies pour la recherche et l\'innovation',
      introText: 'L\'ANRSI met à disposition des chercheurs et innovateurs mauritaniens des plateformes technologiques de pointe pour soutenir leurs projets de recherche et d\'innovation.'
    });

    // Add default plateformes
    this.addPlateforme({
      icon: '🔬',
      title: 'Plateforme d\'Analyse Chimique',
      description: 'Laboratoire équipé d\'instruments de pointe pour l\'analyse chimique, spectroscopie, et caractérisation des matériaux.',
      equipments: ['Spectromètre de masse', 'Chromatographe en phase gazeuse', 'Diffractomètre RX', 'Microscope électronique'],
      services: ['Analyse de composition', 'Caractérisation de matériaux', 'Contrôle qualité', 'Formation technique'],
      contact: 'chimie@anrsi.mr'
    });
    this.addPlateforme({
      icon: '💻',
      title: 'Plateforme Informatique et Calcul',
      description: 'Infrastructure informatique haute performance pour le calcul scientifique, simulation numérique, et traitement de données.',
      equipments: ['Cluster de calcul haute performance', 'Serveurs de stockage massif', 'Réseau haute vitesse', 'Logiciels scientifiques'],
      services: ['Calcul parallèle', 'Simulation numérique', 'Analyse de données', 'Support technique'],
      contact: 'informatique@anrsi.mr'
    });
    this.addPlateforme({
      icon: '🌱',
      title: 'Plateforme Biotechnologique',
      description: 'Laboratoire spécialisé en biotechnologie pour la recherche en biologie moléculaire, génétique, et biologie végétale.',
      equipments: ['PCR en temps réel', 'Électrophorèse', 'Microscopes de fluorescence', 'Incubateurs contrôlés'],
      services: ['Analyse génétique', 'Culture cellulaire', 'Tests biologiques', 'Consultation scientifique'],
      contact: 'biotech@anrsi.mr'
    });
    this.addPlateforme({
      icon: '⚡',
      title: 'Plateforme Énergétique',
      description: 'Installation dédiée aux tests et développement de technologies énergétiques renouvelables et systèmes de stockage.',
      equipments: ['Simulateur solaire', 'Banc d\'essai éolien', 'Système de stockage batterie', 'Analyseur de puissance'],
      services: ['Tests de performance', 'Optimisation de systèmes', 'Études de faisabilité', 'Formation technique'],
      contact: 'energie@anrsi.mr'
    });
    this.addPlateforme({
      icon: '🌍',
      title: 'Plateforme Environnementale',
      description: 'Laboratoire d\'analyse environnementale pour l\'étude de la qualité de l\'air, de l\'eau, et des sols.',
      equipments: ['Analyseur de qualité d\'air', 'Spectromètre UV-Vis', 'pH-mètres de précision', 'Échantillonneurs automatiques'],
      services: ['Monitoring environnemental', 'Analyse de pollution', 'Études d\'impact', 'Consultation réglementaire'],
      contact: 'environnement@anrsi.mr'
    });
    this.addPlateforme({
      icon: '🏭',
      title: 'Plateforme de Prototypage',
      description: 'Atelier de fabrication numérique pour le prototypage rapide, impression 3D, et développement de produits.',
      equipments: ['Imprimantes 3D industrielles', 'Machine de découpe laser', 'Fraiseuse CNC', 'Scanner 3D'],
      services: ['Prototypage rapide', 'Design assisté par ordinateur', 'Fabrication sur mesure', 'Formation technique'],
      contact: 'prototypage@anrsi.mr'
    });

    // Add default access modes
    this.addAccessMode({
      icon: '🎓',
      title: 'Accès Académique',
      description: 'Tarifs préférentiels pour les universités et institutions de recherche publiques.',
      items: ['50% de réduction sur les tarifs standards', 'Formation gratuite incluse', 'Support technique prioritaire']
    });
    this.addAccessMode({
      icon: '🏢',
      title: 'Accès Industriel',
      description: 'Services complets pour les entreprises et startups innovantes.',
      items: ['Tarifs compétitifs', 'Confidentialité garantie', 'Rapports détaillés']
    });
    this.addAccessMode({
      icon: '🤝',
      title: 'Partenariats',
      description: 'Collaborations à long terme avec des institutions partenaires.',
      items: ['Accès privilégié', 'Co-développement de projets', 'Formation du personnel']
    });

    // Add default booking steps
    this.addBookingStep({ number: 1, title: 'Demande d\'Accès', description: 'Soumission d\'une demande détaillée avec description du projet et besoins techniques.' });
    this.addBookingStep({ number: 2, title: 'Évaluation Technique', description: 'Analyse de la faisabilité technique et évaluation des ressources nécessaires.' });
    this.addBookingStep({ number: 3, title: 'Formation', description: 'Formation obligatoire aux procédures de sécurité et d\'utilisation des équipements.' });
    this.addBookingStep({ number: 4, title: 'Réservation', description: 'Planification des créneaux d\'utilisation selon la disponibilité des équipements.' });
    this.addBookingStep({ number: 5, title: 'Utilisation', description: 'Accès aux plateformes avec support technique et supervision si nécessaire.' });

    // Add default booking requirements
    this.addBookingRequirement('Projet de recherche ou d\'innovation validé');
    this.addBookingRequirement('Formation aux procédures de sécurité');
    this.addBookingRequirement('Assurance responsabilité civile');
    this.addBookingRequirement('Respect des règles d\'utilisation');
    this.addBookingRequirement('Signature d\'un accord de confidentialité');

    // Add default support items
    this.addSupportItem({ icon: '📚', title: 'Formation Technique', description: 'Formation complète sur l\'utilisation des équipements et les procédures de sécurité.' });
    this.addSupportItem({ icon: '🔧', title: 'Support Technique', description: 'Assistance technique pendant l\'utilisation des plateformes et maintenance préventive.' });
    this.addSupportItem({ icon: '📊', title: 'Analyse de Données', description: 'Support dans l\'analyse et l\'interprétation des résultats obtenus sur les plateformes.' });
    this.addSupportItem({ icon: '🤝', title: 'Consultation Scientifique', description: 'Conseil scientifique pour l\'optimisation des protocoles et l\'amélioration des résultats.' });

    // Add default contact info
    this.addContactItem({ icon: 'fas fa-envelope', label: 'Email Général', value: 'plateformes@anrsi.mr' });
    this.addContactItem({ icon: 'fas fa-phone', label: 'Téléphone', value: '+222 45 25 44 21' });
    this.addContactItem({ icon: 'fas fa-map-marker-alt', label: 'Adresse', value: 'ANRSI, Nouakchott, Mauritanie' });
    this.addContactItem({ icon: 'fas fa-clock', label: 'Horaires', value: 'Lundi - Vendredi : 8h00 - 18h00' });
  }

  populateForm(content: PlateformesContent): void {
    this.form.patchValue({
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      introText: content.introText
    });

    // Clear existing arrays
    while (this.plateformes.length) this.plateformes.removeAt(0);
    while (this.accessModes.length) this.accessModes.removeAt(0);
    while (this.bookingSteps.length) this.bookingSteps.removeAt(0);
    while (this.bookingRequirements.length) this.bookingRequirements.removeAt(0);
    while (this.supportItems.length) this.supportItems.removeAt(0);
    while (this.contactInfo.length) this.contactInfo.removeAt(0);

    // Populate arrays
    content.plateformes?.forEach(item => this.addPlateforme(item));
    content.accessModes?.forEach(item => this.addAccessMode(item));
    content.bookingSteps?.forEach(item => this.addBookingStep(item));
    content.bookingRequirements?.forEach(item => this.addBookingRequirement(item));
    content.supportItems?.forEach(item => this.addSupportItem(item));
    content.contactInfo?.forEach(item => this.addContactItem(item));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSaving = true;
      this.errorMessage = '';

      const formValue = this.form.value;
      const content: PlateformesContent = {
        heroTitle: formValue.heroTitle,
        heroSubtitle: formValue.heroSubtitle,
        introText: formValue.introText,
        plateformes: formValue.plateformes.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
          equipments: item.equipments,
          services: item.services,
          contact: item.contact
        })),
        accessModes: formValue.accessModes.map((item: any) => ({
          icon: item.icon,
          title: item.title,
          description: item.description,
          items: item.items
        })),
        bookingSteps: formValue.bookingSteps,
        bookingRequirements: formValue.bookingRequirements,
        supportItems: formValue.supportItems,
        contactInfo: formValue.contactInfo
      };

      const updateData: PageUpdateDTO = {
        title: 'Plateformes',
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
          slug: 'plateformes',
          title: 'Plateformes',
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

