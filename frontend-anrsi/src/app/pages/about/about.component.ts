import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-hero">
      <div class="container">
       
      </div>
      <div class="hero-overlay"></div>
    </div>
    

  `,
  styles: [`
   
  `]
})
export class AboutComponent {}