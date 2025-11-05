import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-wrapper">
      <div class="counter-number">
        {{ formatNumber(currentValue) }}
      </div>
      <div class="counter-label">{{ label }}</div>
    </div>
  `,
  styles: [`
    .counter-wrapper {
      text-align: center;
      padding: 1rem;
    }
    
    .counter-number {
      font-size: clamp(2rem, 3vw, 1.5rem);
      font-weight: 700;
      color: var(--secondary-300);
      line-height: 1.2;
      margin-bottom: 0.5rem;
      font-family: "Poppins", sans-serif;
    }
    
    .counter-label {
      font-size: clamp(0.875rem, 2vw, 1rem);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }
  `]
})
export class AnimatedCounterComponent implements OnInit {
  @Input() value = 0;
  @Input() label = '';
  @Input() duration = 2000;
  @Input() suffix = '';
  @Input() prefix = '';
  
  currentValue = 0;
  
  ngOnInit() {
    if (typeof IntersectionObserver !== 'undefined') {
      // Use Intersection Observer for scroll-triggered animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && this.currentValue === 0) {
              this.animate();
            }
          });
        },
        { threshold: 0.3 }
      );
      
      // Use AOS or manual check for visibility
      setTimeout(() => {
        const elements = document.querySelectorAll('app-animated-counter');
        elements.forEach(element => {
          observer.observe(element);
        });
      }, 500);
    } else {
      // Fallback: start immediately if IntersectionObserver is not available
      this.animate();
    }
  }
  
  animate() {
    const steps = 60;
    const increment = this.value / steps;
    const duration = this.duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= this.value) {
        this.currentValue = this.value;
        clearInterval(timer);
      } else {
        this.currentValue = Math.floor(current);
      }
    }, duration);
  }
  
  formatNumber(num: number): string {
    return this.prefix + num + this.suffix;
  }
}

