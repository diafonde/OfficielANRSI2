import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organigramme',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="organigramme-hero">
      <div class="container">
        <h1>Organigramme</h1>
        <p>Structure organisationnelle de l'Agence Nationale de la Recherche Scientifique et de l'Innovation</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section organigramme-section">
        <div class="organigramme-content">
          <h2>Structure Organisationnelle</h2>
          <p class="intro-text">
            L'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l'innovation en Mauritanie.
          </p>
          
          <div class="organigramme-chart">
            <!-- Haut Conseil -->
            <div class="level level-1">
              <div class="position-card director">
                <div class="position-icon">👑</div>
                <h3>Haut Conseil de la Recherche Scientifique et de l'Innovation</h3>
                <p>Présidé par Son Excellence le Premier Ministre</p>
              </div>
            </div>
            
            <!-- Direction Générale -->
            <div class="level level-2">
              <div class="position-card director">
                <div class="position-icon">👔</div>
                <h3>Direction Générale</h3>
                <p>Directeur Général de l'ANRSI</p>
              </div>
            </div>
            
            <!-- Directions Techniques -->
            <div class="level level-3">
              <div class="position-card">
                <div class="position-icon">🔬</div>
                <h3>Direction de la Recherche</h3>
                <p>Gestion des programmes de recherche</p>
              </div>
              
              <div class="position-card">
                <div class="position-icon">💡</div>
                <h3>Direction de l'Innovation</h3>
                <p>Promotion de l'innovation technologique</p>
              </div>
              
              <div class="position-card">
                <div class="position-icon">💰</div>
                <h3>Direction Financière</h3>
                <p>Gestion des fonds et budgets</p>
              </div>
            </div>
            
            <!-- Services Support -->
            <div class="level level-4">
              <div class="position-card">
                <div class="position-icon">📊</div>
                <h3>Service d'Évaluation</h3>
                <p>Suivi et évaluation des projets</p>
              </div>
              
              <div class="position-card">
                <div class="position-icon">🤝</div>
                <h3>Service de Coopération</h3>
                <p>Partenariats internationaux</p>
              </div>
              
              <div class="position-card">
                <div class="position-icon">📋</div>
                <h3>Service Administratif</h3>
                <p>Gestion administrative</p>
              </div>
              
              <div class="position-card">
                <div class="position-icon">💻</div>
                <h3>Service Informatique</h3>
                <p>Support technique et numérique</p>
              </div>
            </div>
          </div>
          
          <div class="organigramme-info">
            <h3>Responsabilités Clés</h3>
            <div class="responsibilities-grid">
              <div class="responsibility-item">
                <h4>🎯 Définition des Priorités</h4>
                <p>Le Haut Conseil définit les priorités nationales de recherche et d'innovation</p>
              </div>
              
              <div class="responsibility-item">
                <h4>📝 Appels à Projets</h4>
                <p>L'ANRSI lance des appels à projets selon les priorités définies</p>
              </div>
              
              <div class="responsibility-item">
                <h4>💼 Gestion des Fonds</h4>
                <p>Allocation transparente et efficace des fonds de recherche</p>
              </div>
              
              <div class="responsibility-item">
                <h4>📈 Suivi et Évaluation</h4>
                <p>Monitoring continu des projets financés et évaluation de leur impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .organigramme-hero {
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
    
    .organigramme-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .organigramme-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .organigramme-hero p {
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
    
    .organigramme-section {
      padding: var(--space-12) 0;
    }
    
    .organigramme-content h2 {
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
    
    .organigramme-chart {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .level {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--space-8);
      flex-wrap: wrap;
      gap: var(--space-4);
    }
    
    .level-1 {
      margin-bottom: var(--space-12);
    }
    
    .level-2 {
      margin-bottom: var(--space-10);
    }
    
    .level-3 {
      margin-bottom: var(--space-8);
    }
    
    .position-card {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      min-width: 200px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .position-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .position-card.director {
      background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
      border: 2px solid var(--primary-200);
    }
    
    .position-icon {
      font-size: 2.5rem;
      margin-bottom: var(--space-3);
    }
    
    .position-card h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .position-card p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .organigramme-info {
      margin-top: var(--space-12);
      padding: var(--space-8);
      background: var(--neutral-50);
      border-radius: 16px;
    }
    
    .organigramme-info h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .responsibilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .responsibility-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .responsibility-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    .responsibility-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .responsibility-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .level {
        flex-direction: column;
        align-items: center;
      }
      
      .position-card {
        min-width: 100%;
        max-width: 300px;
      }
      
      .responsibilities-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrganigrammeComponent {}
