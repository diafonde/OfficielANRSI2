import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  };
  
  submitted = false;
  
  faqs = [
    {
      question: 'Comment puis-je postuler pour un financement de recherche ?',
      answer: 'Les demandes de financement de recherche sont traitées via notre portail de candidatures. Les chercheurs doivent d\'abord consulter les opportunités de financement actuelles sur notre site web, puis préparer une proposition selon les directives spécifiées. Les candidatures sont examinées trimestriellement par notre comité scientifique.',
      open: false
    },
    {
      question: 'Offrez-vous des stages pour les étudiants ?',
      answer: 'Oui, nous offrons des stages pour les étudiants de premier cycle et de cycle supérieur dans diverses disciplines scientifiques. Les opportunités de stage sont publiées sur notre page carrières trois fois par an (printemps, été et automne). Nous avons également un programme de bourses de recherche à l\'année pour les candidats au doctorat.',
      open: false
    },
    {
      question: 'Comment puis-je accéder aux articles de recherche publiés par vos scientifiques ?',
      answer: 'Tous les articles de recherche publiés par les scientifiques de l\'ANRSI sont disponibles via notre dépôt numérique en libre accès. Vous pouvez rechercher par auteur, sujet ou date de publication. Pour la recherche spécialisée qui peut avoir des restrictions d\'accès, veuillez contacter directement l\'auteur correspondant.',
      open: false
    },
    {
      question: 'Puis-je visiter vos installations de recherche ?',
      answer: 'Nous organisons des visites publiques de nos installations le premier vendredi de chaque mois. Pour les institutions éducatives, nous offrons des visites guidées spécialisées sur rendez-vous. Certaines zones de recherche sensibles ont un accès restreint, mais notre centre des visiteurs présente des expositions interactives mettant en valeur notre travail.',
      open: false
    },
    {
      question: 'Comment puis-je collaborer avec vos chercheurs ?',
      answer: 'Nous accueillons favorablement les propositions de collaboration d\'institutions académiques, de partenaires industriels et de chercheurs indépendants. Veuillez soumettre un bref aperçu de votre collaboration proposée via notre département Partenariats, incluant vos intérêts de recherche, objectifs et synergies potentielles avec notre travail en cours.',
      open: false
    },
    {
      question: 'Quels sont les programmes de financement disponibles ?',
      answer: 'L\'ANRSI propose plusieurs programmes de financement : Temkin (Autonomisation), Temeyouz (Excellence), Tethmin (Valorisation) et TEMM (Développement local). Chaque programme a ses propres critères et délais. Consultez notre page Programmes pour plus de détails.',
      open: false
    }
  ];
  
  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
  }
  
  onSubmit() {
    // In a real application, this would submit the form data to a server
    console.log('Form submitted', this.contactForm);
    this.submitted = true;
    
    // Reset form after showing success message
    setTimeout(() => {
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: '',
        consent: false
      };
      this.submitted = false;
    }, 5000);
  }
  
  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}