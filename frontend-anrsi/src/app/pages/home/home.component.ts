import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { ANRSIDataService, ANRSIArticle, ANRSIEvent, ANRSIVideo } from '../../services/anrsi-data.service';
import { Article } from '../../models/article.model';
import { SafePipe } from '../videos/safe.pipe';
import { PageService, PageDTO } from '../../services/page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, HeroSectionComponent, ArticleCardComponent, SafePipe],
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
  
  // Video slideshow properties
  currentVideoSlide = 0;
  videoSlideshowInterval: any;
  videosPerView = 3;
  
  // Video modal properties
  selectedVideo: ANRSIVideo | null = null;
  showVideoModal = false;
  
  // Language and page loading
  currentLang = 'fr';
  langSubscription?: Subscription;
  
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

  partners: { name: string; logo: string }[] = [];

  constructor(
    private articleService: ArticleService,
    private anrsiDataService: ANRSIDataService,
    private http: HttpClient,
    private pageService: PageService,
    private translate: TranslateService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
    
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.loadVideos();
    });
    
    // Set initial slides per view based on screen size
    this.updateSlidesPerView();
    this.updateVideosPerView();
    
    // Load original articles
    this.articleService.getFeaturedArticles().subscribe(articles => {
      this.featuredArticles = articles;
    });
    
    // Load non-featured articles from backend
    this.http.get<Article[]>('/api/articles/non-featured').subscribe({
      next: (articles) => {
        this.latestArticles = articles.slice(); // Use all non-featured articles
        
        // Start slideshow if we can scroll
        if (this.canScroll()) {
          this.startSlideshow();
        }
      },
      error: (error) => {
        console.error('Error loading non-featured articles:', error);
        // Fallback to recent articles if non-featured endpoint fails
        this.articleService.getRecentArticles().subscribe(articles => {
          this.latestArticles = articles.slice();
          if (this.canScroll()) {
            this.startSlideshow();
          }
        });
      }
    });
    
    // Load ANRSI data
    this.anrsiArticles = this.anrsiDataService.getFeaturedArticles();
    this.upcomingEvents = this.anrsiDataService.getEvents();
    
    // Load videos from database
    this.loadVideos();
    
    // Load partners from database
    this.loadPartners();
    
    // Ensure no auto-slideshow is running - videos will only move when user clicks navigation buttons
    this.stopVideoSlideshow();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const oldSlidesPerView = this.slidesPerView;
    const oldVideosPerView = this.videosPerView;
    
    this.updateSlidesPerView();
    this.updateVideosPerView();
    
    // Restart slideshow if configuration changed
    if (oldSlidesPerView !== this.slidesPerView) {
      this.currentSlide = 0;
      this.stopSlideshow();
      if (this.canScroll()) {
        this.startSlideshow();
      }
    }
    
    // Reset video slide if configuration changed
    if (oldVideosPerView !== this.videosPerView) {
      this.currentVideoSlide = 0;
    }
  }
  
  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.showVideoModal) {
      this.closeVideoModal();
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
      // Limit to 3 on large screens to ensure scrolling with 4 articles
      this.slidesPerView = 3;
    }
  }
  
  updateVideosPerView(): void {
    if (window.innerWidth <= 480) {
      this.videosPerView = 1;
    } else if (window.innerWidth <= 768) {
      this.videosPerView = 2;
    } else {
      this.videosPerView = 3;
    }
  }
  
  getTransformPercentage(): number {
    return 100 / this.slidesPerView;
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
    this.stopVideoSlideshow(); // Ensure any running interval is cleared
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
  
  loadVideos(): void {
    this.pageService.getPageBySlug('videos').subscribe({
      next: (page) => {
        this.parseVideosContent(page);
      },
      error: (error) => {
        console.error('Error loading videos page:', error);
        // Fallback to static videos if database fails
        const allVideos = this.anrsiDataService.getVideos();
        this.featuredVideos = allVideos.length >= 4 ? allVideos.slice(0, allVideos.length) : allVideos.slice(0, 3);
      }
    });
  }
  
  parseVideosContent(page: PageDTO): void {
    if (!page?.content) {
      // Fallback to static videos
      const allVideos = this.anrsiDataService.getVideos();
      this.featuredVideos = allVideos.length >= 4 ? allVideos.slice(0, allVideos.length) : allVideos.slice(0, 3);
      return;
    }

    try {
      const content = JSON.parse(page.content);
      
      // Check if it's the new format with translations
      let videosData;
      if (content.translations) {
        // New format: get videos for current language, fallback to French
        const langContent = content.translations[this.currentLang] || content.translations['fr'] || content.translations['ar'] || content.translations['en'];
        videosData = langContent?.videos || [];
      } else {
        // Old format: single language
        videosData = content.videos || [];
      }
      
      // Convert VideoItem[] to ANRSIVideo[]
      this.featuredVideos = videosData.map((video: any, index: number) => ({
        id: index + 1,
        title: video.title || '',
        url: video.url || '',
        type: video.type || 'youtube',
        videoUrl: video.url || '' // For backward compatibility
      }));
      
      // Ensure we have at least some videos, fallback to static if empty
      if (this.featuredVideos.length === 0) {
        const allVideos = this.anrsiDataService.getVideos();
        this.featuredVideos = allVideos.length >= 4 ? allVideos.slice(0, allVideos.length) : allVideos.slice(0, 3);
      }
      
      // Reset video slide when videos change
      this.currentVideoSlide = 0;
    } catch (e) {
      console.error('Error parsing videos content:', e);
      // Fallback to static videos
      const allVideos = this.anrsiDataService.getVideos();
      this.featuredVideos = allVideos.length >= 4 ? allVideos.slice(0, allVideos.length) : allVideos.slice(0, 3);
    }
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
    // Ensure we can scroll through all articles
    return Math.max(1, this.latestArticles.length - this.slidesPerView + 1);
  }
  
  getIndicatorSlides(): number[] {
    const totalSlides = this.getTotalSlides();
    const maxIndicators = 5; // Maximum number of indicators to show
    if (totalSlides <= maxIndicators) {
      return Array.from({ length: totalSlides }, (_, i) => i);
    }
    // Show evenly distributed indicators
    return Array.from({ length: maxIndicators }, (_, i) => i);
  }

  getIndicatorIndex(indicatorPosition: number): number {
    const totalSlides = this.getTotalSlides();
    const maxIndicators = 5;
    if (totalSlides <= maxIndicators) {
      return indicatorPosition;
    }
    // Map indicator position to actual slide index (evenly distributed)
    const step = (totalSlides - 1) / (maxIndicators - 1);
    return Math.round(indicatorPosition * step);
  }
  
  canScroll(): boolean {
    // Allow scrolling if we have more articles than slides per view
    return this.latestArticles.length > this.slidesPerView;
  }

  onSlideshowMouseEnter(): void {
    this.stopSlideshow();
  }

  onSlideshowMouseLeave(): void {
    if (this.canScroll()) {
      this.startSlideshow();
    }
  }
  
  // Video slideshow methods
  startVideoSlideshow(): void {
    this.videoSlideshowInterval = setInterval(() => {
      this.nextVideoSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopVideoSlideshow(): void {
    if (this.videoSlideshowInterval) {
      clearInterval(this.videoSlideshowInterval);
      this.videoSlideshowInterval = null;
    }
  }

  nextVideoSlide(): void {
    const maxSlides = this.getTotalVideoSlides() - 1;
    if (maxSlides > 0) {
      this.currentVideoSlide = (this.currentVideoSlide + 1) % (maxSlides + 1);
    }
  }

  prevVideoSlide(): void {
    const maxSlides = this.getTotalVideoSlides() - 1;
    if (maxSlides > 0) {
      this.currentVideoSlide = this.currentVideoSlide === 0 ? maxSlides : this.currentVideoSlide - 1;
    }
  }

  getVideoTransformPercentage(): number {
    return 100 / this.videosPerView;
  }

  getTotalVideoSlides(): number {
    if (this.featuredVideos.length <= this.videosPerView) {
      return 1;
    }
    return Math.max(1, this.featuredVideos.length - this.videosPerView + 1);
  }
  
  canScrollVideos(): boolean {
    return this.featuredVideos.length > this.videosPerView;
  }

  onVideoSlideshowMouseEnter(): void {
    // Don't auto-play, so no need to stop anything
    // this.stopVideoSlideshow();
  }

  onVideoSlideshowMouseLeave(): void {
    // Don't auto-play, so no need to start anything
    // if (this.canScrollVideos()) {
    //   this.startVideoSlideshow();
    // }
  }
  
  playVideo(video: ANRSIVideo): void {
    // Show video in modal
    this.selectedVideo = video;
    this.showVideoModal = true;
    // Stop slideshow when video is playing
    this.stopVideoSlideshow();
  }
  
  closeVideoModal(): void {
    this.showVideoModal = false;
    this.selectedVideo = null;
    // Don't auto-resume slideshow - videos only move on manual navigation
    // if (this.canScrollVideos()) {
    //   this.startVideoSlideshow();
    // }
  }
  
  getSelectedVideoUrl(): string {
    if (!this.selectedVideo) return '';
    const url = this.selectedVideo.url || this.selectedVideo.videoUrl || '';
    return this.convertToEmbedUrl(url);
  }
  
  convertToEmbedUrl(url: string): string {
    if (!url) return '';
    
    // If already in embed format, return as is (may already have parameters)
    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
      return url;
    }
    
    // Extract video ID from various YouTube URL formats
    const videoId = this.extractYouTubeVideoId(url);
    if (videoId) {
      // Convert to embed format - YouTube requires embed URLs for iframes
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If not a YouTube URL, return as is (for Vimeo, etc.)
    return url;
  }
  
  getVideoThumbnail(video: ANRSIVideo): string {
    // If thumbnailUrl is already provided, use it
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    
    // For YouTube videos, generate thumbnail from video ID
    const videoUrl = video.url || video.videoUrl || '';
    if (video.type === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = this.extractYouTubeVideoId(videoUrl);
      if (videoId) {
        // Use maxresdefault for best quality
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    // Return empty string if no thumbnail can be generated
    return '';
  }
  
  getVideoThumbnailFallback(video: ANRSIVideo): string {
    // Get fallback thumbnail (hqdefault) for YouTube videos
    const videoUrl = video.url || video.videoUrl || '';
    if (video.type === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = this.extractYouTubeVideoId(videoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return '';
  }
  
  onThumbnailError(event: Event, video: ANRSIVideo): void {
    const img = event.target as HTMLImageElement;
    const fallback = this.getVideoThumbnailFallback(video);
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    } else {
      // If fallback also fails, hide the image to show placeholder
      img.style.display = 'none';
    }
  }
  
  private extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    // Match patterns like:
    // https://www.youtube.com/embed/VIDEO_ID
    // https://youtube.com/embed/VIDEO_ID
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://m.youtube.com/watch?v=VIDEO_ID
    
    // First try embed format
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      return embedMatch[1];
    }
    
    // Then try watch format
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      return watchMatch[1];
    }
    
    // Finally try youtu.be short URLs
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      return shortMatch[1];
    }
    
    return null;
  }
  
  getMiddleVideoIndex(): number {
    // On mobile (1 video per view), show play button on the current video
    if (this.videosPerView === 1) {
      return this.currentVideoSlide;
    }
    // When showing 2 videos, the middle one is the first visible
    if (this.videosPerView === 2) {
      return this.currentVideoSlide;
    }
    // When showing 3 videos, the middle one is always at index 1
    // This ensures the middle video stays bigger regardless of slideshow position
    if (this.featuredVideos.length <= 3) {
      return 1; // Always the second video (index 1) when showing 3 or fewer
    }
    // For slideshow with more videos: middle video is the one in the center of the visible set
    const middleIndex = this.currentVideoSlide + Math.floor(this.videosPerView / 2);
    return Math.min(middleIndex, this.featuredVideos.length - 1);
  }

  getMaxTransform(): number {
    const totalSlides = this.getTotalSlides();
    if (totalSlides <= 1) return 0;
    return (totalSlides - 1) * this.getTransformPercentage();
  }

  loadPartners(): void {
    this.pageService.getPageBySlug('partners').subscribe({
      next: (page) => {
        if (page?.content) {
          try {
            const content = JSON.parse(page.content);
            if (content.partners && Array.isArray(content.partners)) {
              this.partners = content.partners;
            } else {
              this.loadDefaultPartners();
            }
          } catch (e) {
            console.error('Error parsing partners content:', e);
            this.loadDefaultPartners();
          }
        } else {
          this.loadDefaultPartners();
        }
      },
      error: (error) => {
        console.error('Error loading partners page:', error);
        // Fallback to default partners if database fails
        this.loadDefaultPartners();
      }
    });
  }

  loadDefaultPartners(): void {
    this.partners = [
      { name: 'Saudi Arabia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/250px-Flag_of_Saudi_Arabia.svg.png' },
      { name: 'Pakistan', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg' },
      { name: 'Japon', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg' },
      { name: 'Sénégal', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg' },
    ];
  }
}