import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-anrsi',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expert-hero">
      <div class="container">
        <h1>Expert à l'ANRSI</h1>
        <p>Rejoignez notre réseau d'experts scientifiques et technologiques</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section expert-section">
        <div class="expert-content">
          <h2>Devenir Expert ANRSI</h2>
          <p class="intro-text">
            L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) recrute des experts qualifiés pour évaluer les projets de recherche et contribuer au développement scientifique de la Mauritanie.
          </p>
          
          <div class="expert-requirements">
            <h3>Profil Requis</h3>
            <div class="requirements-grid">
              <div class="requirement-item">
                <div class="requirement-icon">🎓</div>
                <h4>Formation Académique</h4>
                <ul>
                  <li>Doctorat dans un domaine scientifique ou technologique</li>
                  <li>Expérience significative en recherche</li>
                  <li>Publications scientifiques reconnues</li>
                  <li>Maîtrise du français et/ou de l'anglais</li>
                </ul>
              </div>
              
              <div class="requirement-item">
                <div class="requirement-icon">🔬</div>
                <h4>Expertise Technique</h4>
                <ul>
                  <li>Connaissance approfondie du domaine d'expertise</li>
                  <li>Expérience en évaluation de projets</li>
                  <li>Capacité d'analyse et de synthèse</li>
                  <li>Rigueur scientifique et éthique</li>
                </ul>
              </div>
              
              <div class="requirement-item">
                <div class="requirement-icon">🌍</div>
                <h4>Engagement</h4>
                <ul>
                  <li>Disponibilité pour les évaluations</li>
                  <li>Engagement envers le développement scientifique</li>
                  <li>Respect des délais et procédures</li>
                  <li>Confidentialité et impartialité</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="expert-domains">
            <h3>Domaines d'Expertise Recherchés</h3>
            <div class="domains-grid">
              <div class="domain-item">
                <h4>🔬 Sciences Exactes</h4>
                <p>Mathématiques, Physique, Chimie, Sciences de la Terre</p>
              </div>
              
              <div class="domain-item">
                <h4>🌱 Sciences de la Vie</h4>
                <p>Biologie, Agriculture, Médecine, Sciences Vétérinaires</p>
              </div>
              
              <div class="domain-item">
                <h4>💻 Technologies de l'Information</h4>
                <p>Informatique, Intelligence Artificielle, Télécommunications</p>
              </div>
              
              <div class="domain-item">
                <h4>⚡ Sciences de l'Ingénieur</h4>
                <p>Génie Civil, Mécanique, Électrique, Énergies Renouvelables</p>
              </div>
              
              <div class="domain-item">
                <h4>🌍 Sciences Sociales</h4>
                <p>Économie, Sociologie, Droit, Sciences Politiques</p>
              </div>
              
              <div class="domain-item">
                <h4>🌿 Sciences de l'Environnement</h4>
                <p>Écologie, Climatologie, Gestion des Ressources Naturelles</p>
              </div>
            </div>
          </div>
          
          <div class="expert-process">
            <h3>Processus de Recrutement</h3>
            <div class="process-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Candidature</h4>
                  <p>Soumission du dossier de candidature avec CV détaillé, liste des publications et lettre de motivation.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Évaluation</h4>
                  <p>Examen du dossier par un comité d'experts de l'ANRSI selon des critères objectifs.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Entretien</h4>
                  <p>Entretien avec les candidats retenus pour évaluer leurs compétences et leur motivation.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Formation</h4>
                  <p>Formation aux procédures d'évaluation de l'ANRSI et aux outils utilisés.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <h4>Intégration</h4>
                  <p>Intégration dans le réseau d'experts et attribution des premières missions d'évaluation.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="expert-benefits">
            <h3>Avantages d'être Expert ANRSI</h3>
            <div class="benefits-list">
              <div class="benefit-item">
                <div class="benefit-icon">💼</div>
                <div class="benefit-content">
                  <h4>Rémunération</h4>
                  <p>Rémunération attractive pour chaque mission d'évaluation selon l'expertise et la complexité.</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">🌐</div>
                <div class="benefit-content">
                  <h4>Réseau International</h4>
                  <p>Intégration dans un réseau d'experts internationaux et opportunités de collaboration.</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">📚</div>
                <div class="benefit-content">
                  <h4>Formation Continue</h4>
                  <p>Accès à des formations et séminaires pour maintenir et développer ses compétences.</p>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">🏆</div>
                <div class="benefit-content">
                  <h4>Reconnaissance</h4>
                  <p>Reconnaissance officielle en tant qu'expert scientifique et contribution au développement national.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="application-section">
            <h3>Comment Postuler</h3>
            <div class="application-info">
              <p>Pour postuler en tant qu'expert ANRSI, veuillez envoyer votre dossier de candidature à :</p>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <span>expert@anrsi.mr</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-phone"></i>
                  <span>+222 45 25 44 21</span>
                </div>
              </div>
              
              <div class="required-documents">
                <h4>Documents Requis :</h4>
                <ul>
                  <li>CV détaillé avec liste des publications</li>
                  <li>Lettre de motivation</li>
                  <li>Copies des diplômes et certifications</li>
                  <li>Lettres de recommandation (optionnel)</li>
                  <li>Liste des projets de recherche dirigés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .expert-hero {
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
    
    .expert-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .expert-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .expert-hero p {
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
    
    .expert-section {
      padding: var(--space-12) 0;
    }
    
    .expert-content h2 {
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
    
    .expert-requirements {
      margin: var(--space-12) 0;
    }
    
    .expert-requirements h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .requirements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .requirement-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .requirement-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .requirement-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      text-align: center;
    }
    
    .requirement-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
      text-align: center;
    }
    
    .requirement-item ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .requirement-item li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .expert-domains {
      margin: var(--space-12) 0;
    }
    
    .expert-domains h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .domains-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .domain-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .domain-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .domain-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .domain-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .expert-process {
      margin: var(--space-12) 0;
    }
    
    .expert-process h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .process-steps {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .step-item {
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
    
    .step-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .step-number {
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
    
    .step-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .step-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .expert-benefits {
      margin: var(--space-12) 0;
    }
    
    .expert-benefits h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .benefit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .benefit-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .benefit-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .benefit-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .application-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin-top: var(--space-12);
    }
    
    .application-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .application-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-6);
      font-size: var(--text-lg);
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      gap: var(--space-8);
      margin-bottom: var(--space-8);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--primary-600);
      font-weight: 500;
    }
    
    .contact-item i {
      color: var(--primary-500);
    }
    
    .required-documents {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .required-documents h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-lg);
    }
    
    .required-documents ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .required-documents li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .requirements-grid {
        grid-template-columns: 1fr;
      }
      
      .domains-grid {
        grid-template-columns: 1fr;
      }
      
      .step-item {
        flex-direction: column;
        text-align: center;
      }
      
      .step-number {
        align-self: center;
      }
      
      .benefits-list {
        grid-template-columns: 1fr;
      }
      
      .contact-info {
        flex-direction: column;
        gap: var(--space-4);
      }
    }
  `]
})
export class ExpertAnrsiComponent {}
