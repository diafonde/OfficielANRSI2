import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Article } from '../../models/article.model';

interface Slide {
  url: string;
  title: string;
  description?: string;
  actionText?: string;
  actionUrl?: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slideshowContainer', { static: false }) slideshowContainer!: ElementRef;
  
  imageUrl = 'assets/images/backgr.jpeg';
  slides: Slide[] = [];
  currentSlide = 0;
  loading = true;
  isRTL = false;
  currentLang = 'fr';
  private articles: Article[] = [];
  private slideInterval: any;
  private resizeHandler = () => this.updateContainerHeight();
  private langChangeSubscription?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService
  ) {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Check initial RTL state
    this.isRTL = document.body.dir === 'rtl';
    
    // Listen to language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.isRTL = document.body.dir === 'rtl';
      // Update slides with translated content from stored articles
      this.updateSlidesWithTranslation();
    });
  }

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    // Load only 4 featured articles for slideshow (limit the initial load)
    this.http.get<Article[]>('/api/articles/featured', {
      params: { limit: '4' }
    }).subscribe({
      next: (articles) => {
        if (articles && articles.length > 0) {
          // Limit to 4 articles max
          this.articles = articles.slice(0, 4);
          this.slides = this.mapArticlesToSlides(this.articles);
        } else {
          // If no featured articles, get recent articles (limit to 4)
          this.http.get<Article[]>('/api/articles/recent').subscribe({
            next: (recentArticles) => {
              this.articles = recentArticles.slice(0, 4);
              this.slides = this.mapArticlesToSlides(this.articles);
              this.initializeSlideshow();
            },
            error: (error) => {
              console.error('Error loading recent articles:', error);
              this.loadFallbackSlides();
            }
          });
        }
        this.initializeSlideshow();
      },
      error: (error) => {
        console.error('Error loading featured articles:', error);
        // Try to get recent articles as fallback (limit to 4)
        this.http.get<Article[]>('/api/articles/recent').subscribe({
          next: (articles) => {
            this.articles = articles.slice(0, 4);
            this.slides = this.mapArticlesToSlides(this.articles);
            this.initializeSlideshow();
          },
          error: (fallbackError) => {
            console.error('Error loading articles:', fallbackError);
            this.loadFallbackSlides();
          }
        });
      }
    });
  }

  private updateSlidesWithTranslation() {
    // Update slides with translated content from stored articles
    if (this.articles && this.articles.length > 0) {
      this.slides = this.mapArticlesToSlides(this.articles);
      // Reset to first slide when language changes
      this.currentSlide = 0;
      this.updateContainerHeight();
    }
  }

  mapArticlesToSlides(articles: Article[]): Slide[] {
    // Get translated action text
    const actionText = this.translate.instant('Read More') || 'Lire la suite';
    
    const slides = articles.map(article => {
      // Get translation for current language
      const translation = this.getTranslation(article, this.currentLang);
      
      // Handle image URLs from the backend
      let imageUrl = article.imageUrl || 'assets/images/article1.jpeg';
      
      // If it's already a full URL (http/https), use it as-is
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        // Keep as-is
      }
      // If it starts with /uploads/, it's already a valid backend URL
      else if (imageUrl.startsWith('/uploads/')) {
        // Keep as-is - backend serves files at /uploads/**
      }
      // If it starts with uploads/ (no leading slash), add the slash
      else if (imageUrl.startsWith('uploads/')) {
        imageUrl = '/' + imageUrl;
      }
      // If it's an assets path, keep it as-is
      else if (imageUrl.startsWith('assets/')) {
        // Keep as-is
      }
      // For any other relative path, ensure it starts with /
      else if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      
      const actionUrl = `/article/${article.id}`;
      console.log('Mapping article to slide:', { id: article.id, title: translation.title, actionUrl, lang: this.currentLang });
      
      return {
        url: imageUrl,
        title: translation.title,
        description: translation.excerpt,
        actionText: actionText,
        actionUrl: actionUrl
      };
    });
    
    console.log('All slides mapped:', slides.map(s => ({ title: s.title, actionUrl: s.actionUrl })));
    return slides;
  }

  /**
   * Get translation for a specific language, with fallback to default article fields
   */
  private getTranslation(article: Article, lang: string): { title: string; excerpt: string; content: string } {
    // Try to get translation for the requested language
    if (article.translations && article.translations[lang as 'fr' | 'ar' | 'en']) {
      return article.translations[lang as 'fr' | 'ar' | 'en']!;
    }
    
    // Fallback to default article fields
    return {
      title: article.title,
      excerpt: article.excerpt,
      content: article.content
    };
  }

  loadFallbackSlides() {
    // Fallback to default slides if API fails
    this.slides = [
   
    ];
    this.initializeSlideshow();
  }

  initializeSlideshow() {
    this.loading = false;
    if (this.slides.length > 0) {
      this.currentSlide = 0;
      this.updateContainerHeight();
      this.slideInterval = setInterval(() => this.nextSlide(), 4000); // 4 seconds
    }
  }

  ngAfterViewInit() {
    // Only update height if slides are loaded
    if (this.slides.length > 0) {
      this.updateContainerHeight();
    }
    window.addEventListener('resize', this.resizeHandler);
  }

  updateContainerHeight() {
    if (this.slideshowContainer && this.slides.length > 0) {
      const container = this.slideshowContainer.nativeElement;
      const activeSlide = container.querySelector('.slide.active');
      if (activeSlide) {
        const img = activeSlide.querySelector('.slide-image') as HTMLImageElement;
        if (img && img.complete) {
          // Image already loaded, set height based on image
          const containerWidth = container.offsetWidth;
          // For side-by-side layout, we want a fixed aspect ratio
          // Use a standard hero section height (around 500-600px)
          const finalHeight = Math.min(Math.max(450, window.innerHeight * 0.6), 600);
          container.style.height = `${finalHeight}px`;
        } else if (img) {
          // Wait for image to load
          img.onload = () => {
            const containerWidth = container.offsetWidth;
            const finalHeight = Math.min(Math.max(450, window.innerHeight * 0.6), 600);
            container.style.height = `${finalHeight}px`;
          };
        } else {
          // Fallback height
          container.style.height = '500px';
        }
      }
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateContainerHeight();
  }
  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    window.removeEventListener('resize', this.resizeHandler);
  }
  prevSlide() { 
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateContainerHeight();
  }
  goToSlide(i: number) { 
    this.currentSlide = i;
    this.updateContainerHeight();
  }
  onSlideClick(slide: Slide, index: number) {
    // Only allow clicks on the currently active slide to prevent issues with stacked slides
    if (index !== this.currentSlide) {
      console.warn('Click ignored: clicked slide index', index, 'does not match active slide', this.currentSlide);
      return;
    }
    
    // Use the index to get the correct slide from the array to avoid closure issues
    const clickedSlide = this.slides[index];
    if (!clickedSlide) {
      console.error('Slide not found at index:', index);
      return;
    }
    
    console.log('Slide clicked:', clickedSlide.title, 'Index:', index, 'URL:', clickedSlide.actionUrl);
    
    // Navigate to the article URL using Angular Router
    if (clickedSlide.actionUrl) {
      this.router.navigate([clickedSlide.actionUrl]);
    }
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/article1.jpeg';
    }
  }
}