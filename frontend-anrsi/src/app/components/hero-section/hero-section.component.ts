import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  imageUrl = 'assets/images/backgr.jpeg';
  slides = [
    
    { 
      url: 'assets/images/directeur.jpeg',
      title: 'Autonomisation des Jeunes pour les ODD',
      description: 'L\'ANRSI participe à une conférence internationale sur « l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable »',
      actionText: 'Lire la suite',
      actionUrl: '/article/4'
    },
    { 
      url: 'assets/images/anrsssi.jpeg',
      title: 'Rencontre avec la Faculté de Médecine',
      description: 'Le Directeur Général de l\'ANRSI reçoit le Doyen de la Faculté de Médecine, de Pharmacie et d\'Odontostomatologie de Nouakchott',
      actionText: 'Voir les détails',
      actionUrl: '/article/5'
    }
  ];
  currentSlide = 0;
  private slideInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.slideInterval = setInterval(() => this.nextSlide(), 4000); // 4 seconds
  }
  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
  prevSlide() { this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length; }
  nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }
  goToSlide(i: number) { this.currentSlide = i; }
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