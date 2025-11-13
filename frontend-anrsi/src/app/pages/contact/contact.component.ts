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
  
}