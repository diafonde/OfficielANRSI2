import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slideshowContainer', { static: false }) slideshowContainer!: ElementRef;
  
  imageUrl = 'assets/images/backgr.jpeg';
  slides = [
    
    { 
      url: 'assets/images/directeur.jpeg',
      title: 'Signature d’un mémorandum d\'entente entre l\’ANRSI et l\’Académie de l\’Équipement Agricole Intelligent du Delta du Fleuve Jaune (Chine)',
      description: 'L\'ANRSI participe à une conférence internationale sur « l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable »',
      actionText: 'Lire la suite',
      actionUrl: '/article/4'
    },
    { 
      url: 'assets/images/anrsssi.jpeg',
      title: 'Le Directeur Général reçoit le Directeur Régional',
      description: 'Le Directeur Général de l\'ANRSI reçoit le Doyen de la Faculté de Médecine, de Pharmacie et d\'Odontostomatologie de Nouakchott',
      actionText: 'Voir les détails',
      actionUrl: '/article/5'
    },
    { 
      url: 'assets/images/article1.jpeg',
      title: 'Le Directeur Général de l’ANRSI reçoit le Doyen de la Faculté de Médecine',
      description: 'Le Directeur Général de l\'ANRSI reçoit le Doyen de la Faculté de Médecine, de Pharmacie et d\'Odontostomatologie de Nouakchott',
      actionText: 'Voir les détails',
      actionUrl: '/article/5'
    },
    { 
      url: 'assets/images/anrsi22.jpeg',
      title: 'Rencontre avec la Faculté de Médecine',
      description: 'Le Directeur Général de l\'ANRSI reçoit le Doyen de la Faculté de Médecine, de Pharmacie et d\'Odontostomatologie de Nouakchott',
      actionText: 'Voir les détails',
      actionUrl: '/article/5'
    }
  ];
  currentSlide = 0;
  private slideInterval: any;
  private resizeHandler = () => this.updateContainerHeight();

  constructor(private router: Router) {}

  ngOnInit() {
    this.slideInterval = setInterval(() => this.nextSlide(), 4000); // 4 seconds
  }

  ngAfterViewInit() {
    this.updateContainerHeight();
    window.addEventListener('resize', this.resizeHandler);
  }

  updateContainerHeight() {
    if (this.slideshowContainer && this.slides.length > 0) {
      const currentSlideUrl = this.slides[this.currentSlide].url;
      const img = new Image();
      img.onload = () => {
        const container = this.slideshowContainer.nativeElement;
        const containerWidth = container.offsetWidth;
        const aspectRatio = img.height / img.width;
        const calculatedHeight = containerWidth * aspectRatio;
        // Reduce height by capping at 600px max
        const finalHeight = Math.min(Math.max(calculatedHeight, 450), 600);
        container.style.height = `${finalHeight}px`;
      };
      img.src = currentSlideUrl;
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
  onSlideClick(slide: any, index: number) {
    console.log('Slide clicked:', slide.title, 'Index:', index, 'URL:', slide.actionUrl);
    
    // Navigate to the article URL using Angular Router
    if (slide.actionUrl) {
      this.router.navigate([slide.actionUrl]);
    }
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}