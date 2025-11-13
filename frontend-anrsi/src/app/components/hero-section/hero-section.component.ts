import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slideshowContainer', { static: false }) slideshowContainer!: ElementRef;
  
  imageUrl = 'assets/images/backgr.jpeg';
  slides: Slide[] = [];
  currentSlide = 0;
  loading = true;
  private slideInterval: any;
  private resizeHandler = () => this.updateContainerHeight();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    // First try to get featured articles, if none, get recent articles
    this.http.get<Article[]>('/api/articles/featured').subscribe({
      next: (articles) => {
        if (articles && articles.length > 0) {
          this.slides = this.mapArticlesToSlides(articles);
        } else {
          // If no featured articles, get recent articles
          this.http.get<Article[]>('/api/articles/recent').subscribe({
            next: (recentArticles) => {
              this.slides = this.mapArticlesToSlides(recentArticles.slice(0, 4));
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
        // Try to get all published articles as fallback
        this.http.get<Article[]>('/api/articles').subscribe({
          next: (articles) => {
            this.slides = this.mapArticlesToSlides(articles.slice(0, 4));
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

  mapArticlesToSlides(articles: Article[]): Slide[] {
    const slides = articles.map(article => {
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
      console.log('Mapping article to slide:', { id: article.id, title: article.title, actionUrl });
      
      return {
        url: imageUrl,
        title: article.title,
        description: article.excerpt,
        actionText: 'Lire la suite',
        actionUrl: actionUrl
      };
    });
    
    console.log('All slides mapped:', slides.map(s => ({ title: s.title, actionUrl: s.actionUrl })));
    return slides;
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