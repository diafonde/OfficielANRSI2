import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PageService, PageDTO } from '../../services/page.service';

interface WorkshopItem {
  date: string;
  title: string;
  description: string;
  detailsTitle?: string;
  detailsItems: string[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface PartnershipHighlight {
  icon: string;
  title: string;
  description: string;
}

interface Ai4agriLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  workshops: WorkshopItem[];
  benefits: BenefitItem[];
  partnershipText: string;
  partnershipHighlights: PartnershipHighlight[];
}

interface Ai4agriContent {
  translations: {
    fr: Ai4agriLanguageContent;
    ar: Ai4agriLanguageContent;
    en: Ai4agriLanguageContent;
  };
}

@Component({
  selector: 'app-ai4agri',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ai4agri.component.html',
  styleUrls: ['./ai4agri.component.scss']
})
export class Ai4agriComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  content: Ai4agriContent | null = null;
  displayContent: Ai4agriLanguageContent | null = null;
  isLoading = true;
  currentLang = 'fr';
  private langSubscription?: Subscription;

  constructor(
    private pageService: PageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updateTranslatedContent();
    });

    this.loadPage();
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private updateTranslatedContent(): void {
    if (!this.content) return;
    
    // Get content for current language, fallback to French if not available
    const langContent = this.content.translations[this.currentLang as 'fr' | 'ar' | 'en'];
    this.displayContent = langContent || this.content.translations.fr;
  }

  loadPage(): void {
    this.pageService.getPageBySlug('ai4agri').subscribe({
      next: (page) => {
        this.page = page;
        if (page.content) {
          try {
            const parsedContent = JSON.parse(page.content);
            // Check if it's the new format with translations
            if (parsedContent.translations) {
              this.content = parsedContent;
            } else {
              // Old format - migrate to new format
              const oldContent: Ai4agriLanguageContent = parsedContent;
              this.content = {
                translations: {
                  fr: oldContent,
                  ar: this.getEmptyLanguageContent(),
                  en: this.getEmptyLanguageContent()
                }
              };
            }
            this.updateTranslatedContent();
          } catch (e) {
            console.error('Error parsing content:', e);
            this.loadDefaultContent();
          }
        } else {
          this.loadDefaultContent();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  private getEmptyLanguageContent(): Ai4agriLanguageContent {
    return {
      heroTitle: '',
      heroSubtitle: '',
      introText: '',
      workshops: [],
      benefits: [],
      partnershipText: '',
      partnershipHighlights: []
    };
  }

  loadDefaultContent(): void {
    this.content = {
      translations: {
        fr: {
          heroTitle: 'AI 4 AGRI',
          heroSubtitle: 'Intelligence Artificielle pour l\'Agriculture de Précision',
          introText: 'L\'ANRSI organise des ateliers internationaux sur l\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire.',
          workshops: [
            {
              date: '13-15 Février 2024',
              title: 'Ouverture de l\'atelier international sur les applications de l\'IA dans l\'agriculture',
              description: 'Atelier International sur "L\'application de l\'Intelligence Artificielle dans l\'agriculture de précision pour la sécurité alimentaire"',
              detailsTitle: 'Programme AI 4 AGRI 13-15 Février 2024',
              detailsItems: [
                'Présentations sur l\'IA agricole',
                'Échantillons de présentations',
                'Démonstrations pratiques',
                'Réseautage et collaboration'
              ]
            },
            {
              date: 'Février 2024',
              title: 'AI 4 Agri - Initiative Continue',
              description: 'Programme continu de développement et d\'application de l\'IA dans le secteur agricole mauritanien.',
              detailsTitle: 'Objectifs du Programme',
              detailsItems: [
                'Moderniser l\'agriculture grâce à l\'IA',
                'Améliorer la productivité agricole',
                'Renforcer la sécurité alimentaire',
                'Former les agriculteurs aux nouvelles technologies'
              ]
            }
          ],
          benefits: [
            { icon: '🌱', title: 'Agriculture de Précision', description: 'Optimisation des ressources et augmentation des rendements grâce à l\'analyse de données précises.' },
            { icon: '📊', title: 'Analyse Prédictive', description: 'Prédiction des conditions météorologiques et des maladies pour une meilleure planification.' },
            { icon: '🤖', title: 'Automatisation', description: 'Robotisation des tâches agricoles pour améliorer l\'efficacité et réduire les coûts.' },
            { icon: '🌍', title: 'Développement Durable', description: 'Promotion d\'une agriculture respectueuse de l\'environnement et durable.' }
          ],
          partnershipText: 'L\'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l\'agriculture mauritanienne.',
          partnershipHighlights: [
            { icon: '🔬', title: 'Recherche et Développement', description: 'Collaboration avec des centres de recherche internationaux spécialisés en IA agricole.' },
            { icon: '🎓', title: 'Formation et Éducation', description: 'Programmes de formation pour les agriculteurs et les professionnels du secteur.' },
            { icon: '🤝', title: 'Coopération Internationale', description: 'Échange d\'expertise et de technologies avec des partenaires internationaux.' }
          ]
        },
        ar: this.getEmptyLanguageContent(),
        en: this.getEmptyLanguageContent()
      }
    };
    this.updateTranslatedContent();
  }
}
