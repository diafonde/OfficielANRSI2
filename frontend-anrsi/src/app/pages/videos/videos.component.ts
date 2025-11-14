import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../pages/videos/safe.pipe';
import { PageService, PageDTO } from '../../services/page.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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

interface VideosLanguageContent {
  heroTitle: string;
  heroSubtitle: string;
  videos: VideoItem[];
  photos: PhotoItem[];
}

interface VideosContent {
  heroTitle?: string;
  heroSubtitle?: string;
  videos?: VideoItem[];
  photos?: PhotoItem[];
  translations?: {
    fr: VideosLanguageContent;
    ar: VideosLanguageContent;
    en: VideosLanguageContent;
  };
}

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  videos: VideoItem[] = [];
  photos: PhotoItem[] = [];
  isLoading = true;
  currentLang = 'fr';
  langSubscription?: Subscription;

  constructor(
    private pageService: PageService,
    private translate: TranslateService
  ) {}
  
  defaultVideos: VideoItem[] = [
    { title: "Présentation de l'Agence", url: "https://www.youtube.com/embed/EMgwHc1F5W8", type: "youtube" },
    { title: "Recherche Scientifique", url: "https://youtube.com/embed/bC2FLWuHTbI", type: "youtube" },
    { title: "Nouvelles Technologies", url: "https://youtube.com/embed/4PupAG-vJnk", type: "youtube" },
    { title: "Nouvelles Technologies", url: "https://youtube.com/embed/0yeNSWbl5MY", type: "youtube" }
  ];
  
  defaultPhotos: PhotoItem[] = [
    { title: "", url: "assets/images/277154633_374993344636114_8242637262867242236_n_0.jpg.jpeg", type: "photo" },
    { title: "", url: "assets/images/316106463_190420513522892_2157453747881448998_n_0.jpg.jpeg", type: "photo" },
    { title: "", url: "assets/images/directeur.jpeg", type: "photo" },
    { title: "", url: "assets/images/article1.jpeg", type: "photo" },
    { title: "", url: "assets/images/directeurr.jpeg", type: "photo" },
    { title: "", url: "assets/images/IMG_1702AAA.jpg.jpeg", type: "photo" },
    { title: "", url: "assets/images/IMG_1738DDDDDDDDD.jpg.jpeg", type: "photo" },
    { title: "", url: "assets/images/chef.jpeg", type: "photo" }
  ];

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'fr';
    
    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.parseContent();
    });
    
    this.loadPage();
  }
  
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  loadPage(): void {
    this.pageService.getPageBySlug('videos').subscribe({
      next: (page) => {
        this.page = page;
        this.parseContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  parseContent(): void {
    if (!this.page?.content) {
      this.loadDefaultContent();
      return;
    }

    try {
      const content: VideosContent = JSON.parse(this.page.content);
      
      // Check if it's the new format with translations
      if (content.translations) {
        // New format: get content for current language, fallback to French
        const langContent = content.translations[this.currentLang as 'fr' | 'ar' | 'en'] 
          || content.translations['fr'] 
          || content.translations['ar'] 
          || content.translations['en'];
        
        if (langContent) {
          this.heroTitle = langContent.heroTitle || 'Mediatique';
          this.heroSubtitle = langContent.heroSubtitle || 'Get in touch with our research teams and support staff';
          this.videos = langContent.videos || this.defaultVideos;
          this.photos = langContent.photos || this.defaultPhotos;
        } else {
          this.loadDefaultContent();
        }
      } else {
        // Old format: single language
        this.heroTitle = content.heroTitle || 'Mediatique';
        this.heroSubtitle = content.heroSubtitle || 'Get in touch with our research teams and support staff';
        this.videos = content.videos || this.defaultVideos;
        this.photos = content.photos || this.defaultPhotos;
      }
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Mediatique';
    this.heroSubtitle = 'Get in touch with our research teams and support staff';
    this.videos = this.defaultVideos;
    this.photos = this.defaultPhotos;
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
  
  getEmbedUrl(video: VideoItem): string {
    return this.convertToEmbedUrl(video.url);
  }
}
