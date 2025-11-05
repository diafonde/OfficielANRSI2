import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { ANRSIDataService, ANRSIArticle, ANRSIEvent, ANRSIVideo } from '../../services/anrsi-data.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ArticleCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredArticles: Article[] = [];
  latestArticles: Article[] = [];
  anrsiArticles: ANRSIArticle[] = [];
  upcomingEvents: ANRSIEvent[] = [];
  featuredVideos: ANRSIVideo[] = [];
  
  // Slideshow properties
  currentSlide = 0;
  slideshowInterval: any;
  slidesPerView = 5;
  
  researchAreas = [
    {
      name: 'Agriculture et Sécurité Alimentaire',
      description: 'Développement de solutions innovantes pour l\'agriculture durable et la sécurité alimentaire.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    },
    {
      name: 'Énergies Renouvelables',
      description: 'Recherche et développement dans le domaine des énergies propres et durables.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v10M2 12h20"></svg>'
    },
    {
      name: 'Santé et Médecine',
      description: 'Innovation médicale et recherche pharmaceutique pour améliorer les soins de santé.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    },
    {
      name: 'Technologies de l\'Information',
      description: 'Développement de solutions numériques et d\'intelligence artificielle.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><path d="M7 13.5h10"/></svg>'
    }
  ];
  
  timelineItems = [
    {
      year: '2025',
      title: 'ICTW-FSTCA 2025',
      description: 'Conférence internationale sur la transformation des systèmes alimentaires pour l\'action climatique.'
    },
    {
      year: '2025',
      title: 'COMSTECH-UTS Workshop',
      description: 'Workshop international sur les énergies renouvelables : Affordable & Clean Energy for ALL.'
    },
    {
      year: '2025',
      title: 'Participation SEE PAKISTAN',
      description: 'Participation mauritanienne à l\'événement international SEE PAKISTAN à Lahore.'
    },
    {
      year: '2020',
      title: 'Création de l\'ANRSI',
      description: 'Fondation de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation.'
    }
  ];

  partners = [
    { name: 'Mauritanie', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Mauritania.svg' },
    { name: 'Pakistan', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg' },
    { name: 'Japon', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg' },
    { name: 'Sénégal', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg' },
  ];

  constructor(
    private articleService: ArticleService,
    private anrsiDataService: ANRSIDataService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
    
    // Set initial slides per view based on screen size
    this.updateSlidesPerView();
    
    // Load original articles
    this.articleService.getFeaturedArticles().subscribe(articles => {
      this.featuredArticles = articles;
    });
    
    this.articleService.getRecentArticles().subscribe(articles => {
      this.latestArticles = articles;
      
      // Start slideshow if there are articles
      if (this.latestArticles.length > this.slidesPerView) {
        this.startSlideshow();
      }
    });
    
    // Load ANRSI data
    this.anrsiArticles = this.anrsiDataService.getFeaturedArticles();
    this.upcomingEvents = this.anrsiDataService.getUpcomingEvents();
    this.featuredVideos = this.anrsiDataService.getVideos().slice(0, 3);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const oldSlidesPerView = this.slidesPerView;
    this.updateSlidesPerView();
    
    // Restart slideshow if configuration changed
    if (oldSlidesPerView !== this.slidesPerView) {
      this.currentSlide = 0;
      this.stopSlideshow();
      if (this.latestArticles.length > this.slidesPerView) {
        this.startSlideshow();
      }
    }
  }
  
  updateSlidesPerView(): void {
    if (window.innerWidth <= 480) {
      this.slidesPerView = 1;
    } else if (window.innerWidth <= 768) {
      this.slidesPerView = 2;
    } else if (window.innerWidth <= 1200) {
      this.slidesPerView = 3;
    } else {
      this.slidesPerView = 5;
    }
  }
  
  getTransformPercentage(): number {
    return 100 / this.slidesPerView;
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  startSlideshow(): void {
    this.slideshowInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopSlideshow(): void {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
      this.slideshowInterval = null;
    }
  }

  nextSlide(): void {
    const maxSlides = this.getTotalSlides() - 1;
    if (maxSlides > 0) {
      this.currentSlide = (this.currentSlide + 1) % (maxSlides + 1);
    }
  }

  prevSlide(): void {
    const maxSlides = this.getTotalSlides() - 1;
    if (maxSlides > 0) {
      this.currentSlide = this.currentSlide === 0 ? maxSlides : this.currentSlide - 1;
    }
  }

  goToSlide(index: number): void {
    const maxSlides = this.getTotalSlides() - 1;
    if (index >= 0 && index <= maxSlides) {
      this.currentSlide = index;
    }
  }

  getVisibleArticles(): Article[] {
    return this.latestArticles.slice(this.currentSlide, this.currentSlide + this.slidesPerView);
  }

  getTotalSlides(): number {
    if (this.latestArticles.length <= this.slidesPerView) {
      return 1;
    }
    return this.latestArticles.length - this.slidesPerView + 1;
  }

  onSlideshowMouseEnter(): void {
    this.stopSlideshow();
  }

  onSlideshowMouseLeave(): void {
    if (this.latestArticles.length > this.slidesPerView) {
      this.startSlideshow();
    }
  }
}