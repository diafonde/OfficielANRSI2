import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../pages/videos/safe.pipe';
import { PageService, PageDTO } from '../../services/page.service';

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
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  videos: VideoItem[] = [];
  photos: PhotoItem[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
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
    this.loadPage();
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
      
      this.heroTitle = content.heroTitle || 'Mediatique';
      this.heroSubtitle = content.heroSubtitle || 'Get in touch with our research teams and support staff';
      this.videos = content.videos || this.defaultVideos;
      this.photos = content.photos || this.defaultPhotos;
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
}
