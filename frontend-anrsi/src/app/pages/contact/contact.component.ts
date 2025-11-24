import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../services/contact.service';

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
  submitting = false;
  errorMessage = '';
  
  constructor(private contactService: ContactService) {}
  
  async ngOnInit(): Promise<void> {
    try {
      const AOS = await import('aos');
      AOS.init();
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
  }
  
  onSubmit() {
    if (!this.contactForm.consent) {
      this.errorMessage = 'Vous devez accepter le traitement de vos données personnelles.';
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';
    
    this.contactService.submitContactMessage(this.contactForm).subscribe({
      next: (response) => {
        this.submitted = true;
        this.submitting = false;
        
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
      },
      error: (error) => {
        this.submitting = false;
        this.errorMessage = error.error?.error || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.';
        console.error('Error submitting contact form:', error);
      }
    });
  }
  
}