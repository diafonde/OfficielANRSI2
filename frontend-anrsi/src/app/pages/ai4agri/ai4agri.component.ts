import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai4agri',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai4agri-hero">
      <div class="container">
        <h1>AI 4 AGRI</h1>
        <p>Intelligence Artificielle pour l'Agriculture de Précision</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section ai4agri-section">
        <div class="ai4agri-content">
          <h2>Ateliers Internationaux sur l'IA dans l'Agriculture</h2>
          <p class="intro-text">
            L'ANRSI organise des ateliers internationaux sur l'application de l'Intelligence Artificielle dans l'agriculture de précision pour la sécurité alimentaire.
          </p>
          
          <div class="workshops-timeline">
            <div class="workshop-item">
              <div class="workshop-date">13-15 Février 2024</div>
              <div class="workshop-content">
                <h3>Ouverture de l'atelier international sur les applications de l'IA dans l'agriculture</h3>
                <p>Atelier International sur "L'application de l'Intelligence Artificielle dans l'agriculture de précision pour la sécurité alimentaire"</p>
                <div class="workshop-details">
                  <h4>Programme AI 4 AGRI 13-15 Février 2024</h4>
                  <ul>
                    <li>Présentations sur l'IA agricole</li>
                    <li>Échantillons de présentations</li>
                    <li>Démonstrations pratiques</li>
                    <li>Réseautage et collaboration</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="workshop-item">
              <div class="workshop-date">Février 2024</div>
              <div class="workshop-content">
                <h3>AI 4 Agri - Initiative Continue</h3>
                <p>Programme continu de développement et d'application de l'IA dans le secteur agricole mauritanien.</p>
                <div class="workshop-details">
                  <h4>Objectifs du Programme</h4>
                  <ul>
                    <li>Moderniser l'agriculture grâce à l'IA</li>
                    <li>Améliorer la productivité agricole</li>
                    <li>Renforcer la sécurité alimentaire</li>
                    <li>Former les agriculteurs aux nouvelles technologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ai-benefits">
            <h3>Bénéfices de l'IA dans l'Agriculture</h3>
            <div class="benefits-grid">
              <div class="benefit-item">
                <div class="benefit-icon">🌱</div>
                <h4>Agriculture de Précision</h4>
                <p>Optimisation des ressources et augmentation des rendements grâce à l'analyse de données précises.</p>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">📊</div>
                <h4>Analyse Prédictive</h4>
                <p>Prédiction des conditions météorologiques et des maladies pour une meilleure planification.</p>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">🤖</div>
                <h4>Automatisation</h4>
                <p>Robotisation des tâches agricoles pour améliorer l'efficacité et réduire les coûts.</p>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">🌍</div>
                <h4>Développement Durable</h4>
                <p>Promotion d'une agriculture respectueuse de l'environnement et durable.</p>
              </div>
            </div>
          </div>
          
          <div class="partnership-section">
            <h3>Partenariats et Collaboration</h3>
            <p>L'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l'agriculture mauritanienne.</p>
            
            <div class="partnership-highlights">
              <div class="highlight-item">
                <h4>🔬 Recherche et Développement</h4>
                <p>Collaboration avec des centres de recherche internationaux spécialisés en IA agricole.</p>
              </div>
              
              <div class="highlight-item">
                <h4>🎓 Formation et Éducation</h4>
                <p>Programmes de formation pour les agriculteurs et les professionnels du secteur.</p>
              </div>
              
              <div class="highlight-item">
                <h4>🤝 Coopération Internationale</h4>
                <p>Échange d'expertise et de technologies avec des partenaires internationaux.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .ai4agri-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/aiagri.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .ai4agri-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .ai4agri-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .ai4agri-hero p {
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
    
    .ai4agri-section {
      padding: var(--space-12) 0;
    }
    
    .ai4agri-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-3xl);
    }
    
    .intro-text {
      text-align: center;
      color: var(--neutral-700);
      font-size: var(--text-lg);
      max-width: 800px;
      margin: 0 auto var(--space-12);
      line-height: 1.6;
    }
    
    .workshops-timeline {
      max-width: 900px;
      margin: 0 auto var(--space-12);
    }
    
    .workshop-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .workshop-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .workshop-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-4);
      border-radius: 8px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 120px;
      height: fit-content;
      text-align: center;
    }
    
    .workshop-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .workshop-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .workshop-details h4 {
      color: var(--primary-500);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .workshop-details ul {
      color: var(--neutral-600);
      padding-left: var(--space-4);
    }
    
    .workshop-details li {
      margin-bottom: var(--space-1);
    }
    
    .ai-benefits {
      margin: var(--space-12) 0;
    }
    
    .ai-benefits h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .benefit-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .benefit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .benefit-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .benefit-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .benefit-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .partnership-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin-top: var(--space-12);
    }
    
    .partnership-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .partnership-section p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .partnership-highlights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .highlight-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .highlight-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .highlight-item p {
      color: var(--neutral-700);
      line-height: 1.6;
      text-align: left;
    }
    
    @media (max-width: 768px) {
      .workshop-item {
        flex-direction: column;
        text-align: center;
      }
      
      .workshop-date {
        align-self: center;
        min-width: auto;
      }
      
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      
      .partnership-highlights {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Ai4agriComponent {}
