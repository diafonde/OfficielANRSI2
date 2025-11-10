import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="missions-hero">
      <div class="container">
        <h1>Missions</h1>
        <p>Les missions de l'Agence Nationale de la Recherche Scientifique et de l'Innovation</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section missions-section">
        <div class="missions-content">
          <h2>Nos Missions</h2>
          <div class="missions-list">
            <div class="mission-item">
              <div class="mission-number">1</div>
              <div class="mission-text">
                <h3>Contribuer au développement des sciences, des technologies et de l'innovation</h3>
                <p>L'ANRSI s'engage à promouvoir et soutenir le développement des sciences, des technologies et de l'innovation en Mauritanie.</p>
              </div>
            </div>
            
            <div class="mission-item">
              <div class="mission-number">2</div>
              <div class="mission-text">
                <h3>Gérer le fonds alloué à la recherche et l'innovation</h3>
                <p>Nous assurons une gestion transparente et efficace des fonds dédiés à la recherche scientifique et à l'innovation.</p>
              </div>
            </div>
            
            <div class="mission-item">
              <div class="mission-number">3</div>
              <div class="mission-text">
                <h3>Lancer des appels à projet dans le cadre des priorités nationales</h3>
                <p>L'ANRSI lance des appels à projet définis par le Haut Conseil de la Recherche Scientifique et de l'Innovation présidé par son Excellence le Premier Ministre.</p>
              </div>
            </div>
            
            <div class="mission-item">
              <div class="mission-number">4</div>
              <div class="mission-text">
                <h3>Assurer le suivi et l'évaluation de tous les programmes et projets de recherche</h3>
                <p>Nous garantissons un suivi rigoureux et une évaluation complète de tous les programmes et projets de recherche que nous finançons.</p>
              </div>
            </div>
            
            <div class="mission-item">
              <div class="mission-number">5</div>
              <div class="mission-text">
                <h3>Analyser l'impact des financements alloués sur la production scientifique nationale</h3>
                <p>L'ANRSI analyse et mesure l'impact des financements sur la production scientifique nationale pour optimiser nos investissements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .missions-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/anrsiback.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .missions-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .missions-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .missions-hero p {
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
    
    .missions-section {
      padding: var(--space-12) 0;
    }
    
    .missions-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-3xl);
    }
    
    .missions-list {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .mission-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .mission-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .mission-number {
      background: var(--primary-500);
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-lg);
      flex-shrink: 0;
    }
    
    .mission-text h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .mission-text p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .mission-item {
        flex-direction: column;
        text-align: center;
        gap: var(--space-4);
      }
      
      .mission-number {
        align-self: center;
      }
    }
  `]
})
export class MissionsComponent {}
