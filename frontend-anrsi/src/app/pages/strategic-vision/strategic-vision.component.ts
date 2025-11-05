import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strategic-vision',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vision-hero">
      <div class="container">
        <h1>Vision Stratégique</h1>
        <p>La vision et le message de l'Agence Nationale de la Recherche Scientifique et de l'Innovation</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section vision-section">
        <div class="vision-content">
          <div class="vision-card">
            <div class="vision-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h2>Vision</h2>
            <p class="vision-text">
              L'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.
            </p>
          </div>
          
          <div class="message-card">
            <div class="message-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2>Le Message</h2>
            <p class="message-text">
              Soutenir l'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.
            </p>
          </div>
          
          <div class="values-section">
            <h3>Nos Valeurs</h3>
            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon">🔬</div>
                <h4>Excellence Scientifique</h4>
                <p>Promouvoir la qualité et l'excellence dans toutes nos initiatives de recherche</p>
              </div>
              
              <div class="value-item">
                <div class="value-icon">🤝</div>
                <h4>Collaboration</h4>
                <p>Encourager la coopération entre chercheurs, institutions et partenaires</p>
              </div>
              
              <div class="value-item">
                <div class="value-icon">🌱</div>
                <h4>Innovation</h4>
                <p>Favoriser l'innovation technologique et scientifique pour le développement</p>
              </div>
              
              <div class="value-item">
                <div class="value-icon">🎯</div>
                <h4>Impact</h4>
                <p>Maximiser l'impact de la recherche sur la société et l'économie</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .vision-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/anrsiback.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 60px;
    }
    
    .vision-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .vision-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .vision-hero p {
      font-size: clamp(1.1rem, 2vw, 1.5rem);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(10, 61, 98, 0.8), rgba(10, 61, 98, 0.6));
      z-index: 1;
    }
    
    .vision-section {
      padding: var(--space-12) 0;
    }
    
    .vision-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .vision-card,
    .message-card {
      background: white;
      padding: var(--space-8);
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      margin-bottom: var(--space-8);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .vision-card:hover,
    .message-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }
    
    .vision-icon,
    .message-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-4);
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--primary-50);
      border-radius: 50%;
      color: var(--primary-600);
    }
    
    .vision-icon svg,
    .message-icon svg {
      width: 40px;
      height: 40px;
    }
    
    .vision-card h2,
    .message-card h2 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-2xl);
    }
    
    .vision-text,
    .message-text {
      color: var(--neutral-700);
      font-size: var(--text-lg);
      line-height: 1.7;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .values-section {
      margin-top: var(--space-12);
    }
    
    .values-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .value-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .value-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .value-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .value-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .value-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .vision-card,
      .message-card {
        padding: var(--space-6);
      }
      
      .values-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StrategicVisionComponent {}
