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
      url: 'assets/images/Food Systems Transformation for Climate Actions.jpg',
      title: 'ANRSI - Agence Nationale de la Recherche Scientifique et de l\'Innovation',
      description: 'Conférence internationale et atelier de formation sur « La transformation des systèmes alimentaires pour l\'action climatique » (ICTW-FSTCA 2025)',
      actionText: 'Découvrir l\'actualité',
      actionUrl: '/article/1'
    },
    { 
      url: 'assets/images/WhatsApp Image 2025-08-09 at 15.03.01.jpeg',
      title: 'COMSTECH-UTS International Workshop on Renewable Energy',
      description: 'Affordable & Clean Energy for ALL (CURE-ALL) - Workshop international sur les énergies renouvelables',
      actionText: 'Voir le programme',
      actionUrl: '/article/2'
    },
    { 
      url: 'assets/images/WhatsApp Image 2025-08-18 at 14.48.29.jpeg',
      title: 'Participation Mauritanienne à SEE PAKISTAN',
      description: 'Lancement de l\'édition 2025 de SEE PAKISTAN avec une participation mauritanienne à Lahore',
      actionText: 'En savoir plus',
      actionUrl: '/article/3'
    },
    { 
      url: 'assets/images/directeur.jpeg',
      title: 'Autonomisation des Jeunes pour les ODD',
      description: 'L\'ANRSI participe à une conférence internationale sur « l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable »',
      actionText: 'Lire la suite',
      actionUrl: '/article/4'
    },
    { 
      url: 'assets/images/chef.jpeg',
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