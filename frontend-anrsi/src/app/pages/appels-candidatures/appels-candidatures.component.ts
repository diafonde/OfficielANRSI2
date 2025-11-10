import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appels-candidatures',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appels-hero">
      <div class="container">
        <h1>Appels à Candidatures</h1>
        <p>Opportunités de recherche et d'innovation en Mauritanie</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section appels-section">
        <div class="appels-content">
          <h2>Appels à Candidatures Ouverts</h2>
          <p class="intro-text">
            L'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.
          </p>
          
          <div class="appels-timeline">
            <div class="appel-item">
              <div class="appel-status active">Ouvert</div>
              <div class="appel-content">
                <h3>Appel à Projets de Recherche 2024</h3>
                <p class="appel-description">
                  Financement de projets de recherche dans les domaines prioritaires : agriculture durable, énergies renouvelables, technologies de l'information, et sciences de l'environnement.
                </p>
                <div class="appel-details">
                  <div class="detail-item">
                    <span class="detail-label">Budget :</span>
                    <span class="detail-value">Jusqu'à 50 millions MRO par projet</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Durée :</span>
                    <span class="detail-value">12-36 mois</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Date limite :</span>
                    <span class="detail-value">31 Mars 2024</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Éligibilité :</span>
                    <span class="detail-value">Institutions de recherche, universités, entreprises</span>
                  </div>
                </div>
                <div class="appel-actions">
                  <a href="#" class="btn btn-primary">Consulter l'appel</a>
                  <a href="#" class="btn btn-outline">Télécharger le dossier</a>
                </div>
              </div>
            </div>
            
            <div class="appel-item">
              <div class="appel-status upcoming">Prochainement</div>
              <div class="appel-content">
                <h3>Programme Innovation Technologique</h3>
                <p class="appel-description">
                  Soutien aux projets d'innovation technologique et de transfert de technologie vers l'industrie mauritanienne.
                </p>
                <div class="appel-details">
                  <div class="detail-item">
                    <span class="detail-label">Budget :</span>
                    <span class="detail-value">Jusqu'à 30 millions MRO par projet</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Durée :</span>
                    <span class="detail-value">6-24 mois</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ouverture :</span>
                    <span class="detail-value">Avril 2024</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Éligibilité :</span>
                    <span class="detail-value">Startups, PME, centres de recherche</span>
                  </div>
                </div>
                <div class="appel-actions">
                  <a href="#" class="btn btn-outline">S'inscrire aux alertes</a>
                </div>
              </div>
            </div>
            
            <div class="appel-item">
              <div class="appel-status closed">Fermé</div>
              <div class="appel-content">
                <h3>Bourses de Doctorat 2023</h3>
                <p class="appel-description">
                  Programme de bourses pour soutenir les étudiants mauritaniens dans leurs études doctorales en sciences et technologies.
                </p>
                <div class="appel-details">
                  <div class="detail-item">
                    <span class="detail-label">Montant :</span>
                    <span class="detail-value">500,000 MRO/an pendant 3 ans</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Durée :</span>
                    <span class="detail-value">3 ans</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Date limite :</span>
                    <span class="detail-value">15 Décembre 2023</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Éligibilité :</span>
                    <span class="detail-value">Étudiants mauritaniens en master</span>
                  </div>
                </div>
                <div class="appel-actions">
                  <a href="#" class="btn btn-outline">Voir les résultats</a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="appels-categories">
            <h3>Domaines Prioritaires</h3>
            <div class="categories-grid">
              <div class="category-item">
                <div class="category-icon">🌱</div>
                <h4>Agriculture & Sécurité Alimentaire</h4>
                <ul>
                  <li>Techniques agricoles durables</li>
                  <li>Amélioration des rendements</li>
                  <li>Gestion des ressources hydriques</li>
                  <li>Biotechnologies agricoles</li>
                </ul>
              </div>
              
              <div class="category-item">
                <div class="category-icon">⚡</div>
                <h4>Énergies Renouvelables</h4>
                <ul>
                  <li>Énergie solaire et éolienne</li>
                  <li>Stockage d'énergie</li>
                  <li>Efficacité énergétique</li>
                  <li>Électrification rurale</li>
                </ul>
              </div>
              
              <div class="category-item">
                <div class="category-icon">💻</div>
                <h4>Technologies de l'Information</h4>
                <ul>
                  <li>Intelligence artificielle</li>
                  <li>Internet des objets (IoT)</li>
                  <li>Cybersécurité</li>
                  <li>Applications mobiles</li>
                </ul>
              </div>
              
              <div class="category-item">
                <div class="category-icon">🌍</div>
                <h4>Environnement & Climat</h4>
                <ul>
                  <li>Changement climatique</li>
                  <li>Biodiversité</li>
                  <li>Gestion des déchets</li>
                  <li>Pollution et assainissement</li>
                </ul>
              </div>
              
              <div class="category-item">
                <div class="category-icon">🏥</div>
                <h4>Santé & Médecine</h4>
                <ul>
                  <li>Médecine préventive</li>
                  <li>Télémédecine</li>
                  <li>Pharmacologie</li>
                  <li>Santé publique</li>
                </ul>
              </div>
              
              <div class="category-item">
                <div class="category-icon">🏭</div>
                <h4>Industrie & Innovation</h4>
                <ul>
                  <li>Processus industriels</li>
                  <li>Matériaux avancés</li>
                  <li>Robotique</li>
                  <li>Transfert de technologie</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="application-process">
            <h3>Processus de Candidature</h3>
            <div class="process-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Préparation du Dossier</h4>
                  <p>Rédaction du projet de recherche, budget détaillé, équipe de recherche, et lettres de recommandation.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Soumission en Ligne</h4>
                  <p>Dépôt du dossier complet via la plateforme de soumission électronique de l'ANRSI.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Évaluation Scientifique</h4>
                  <p>Examen du projet par un comité d'experts indépendants selon des critères scientifiques rigoureux.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Entretien</h4>
                  <p>Présentation orale du projet devant le comité d'évaluation pour les projets présélectionnés.</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <h4>Décision et Financement</h4>
                  <p>Notification des résultats et signature de la convention de financement pour les projets retenus.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="criteria-section">
            <h3>Critères d'Évaluation</h3>
            <div class="criteria-grid">
              <div class="criteria-item">
                <h4>🔬 Excellence Scientifique</h4>
                <p>Qualité scientifique du projet, innovation, méthodologie rigoureuse, et faisabilité technique.</p>
              </div>
              
              <div class="criteria-item">
                <h4>👥 Équipe de Recherche</h4>
                <p>Compétences et expérience de l'équipe, complémentarité des profils, et leadership du projet.</p>
              </div>
              
              <div class="criteria-item">
                <h4>💡 Impact et Innovation</h4>
                <p>Potentiel d'innovation, impact attendu sur le développement national, et transfert de connaissances.</p>
              </div>
              
              <div class="criteria-item">
                <h4>💰 Gestion Financière</h4>
                <p>Budget réaliste et justifié, coût-efficacité, et capacité de gestion financière du porteur.</p>
              </div>
            </div>
          </div>
          
          <div class="support-section">
            <h3>Support et Accompagnement</h3>
            <div class="support-info">
              <p>L'ANRSI offre un accompagnement complet aux porteurs de projets sélectionnés :</p>
              
              <div class="support-services">
                <div class="service-item">
                  <div class="service-icon">📋</div>
                  <div class="service-content">
                    <h4>Formation à la Gestion de Projet</h4>
                    <p>Formation aux outils de gestion de projet et aux procédures administratives.</p>
                  </div>
                </div>
                
                <div class="service-item">
                  <div class="service-icon">🔍</div>
                  <div class="service-content">
                    <h4>Suivi et Évaluation</h4>
                    <p>Accompagnement dans le suivi du projet et l'évaluation des résultats.</p>
                  </div>
                </div>
                
                <div class="service-item">
                  <div class="service-icon">🌐</div>
                  <div class="service-content">
                    <h4>Réseau et Partenariats</h4>
                    <p>Facilitation des partenariats avec des institutions nationales et internationales.</p>
                  </div>
                </div>
                
                <div class="service-item">
                  <div class="service-icon">📢</div>
                  <div class="service-content">
                    <h4>Valorisation des Résultats</h4>
                    <p>Support dans la publication et la valorisation des résultats de recherche.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-section">
            <h3>Contact et Informations</h3>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div class="contact-details">
                  <h4>Email</h4>
                  <p>appels@anrsi.mr</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div class="contact-details">
                  <h4>Téléphone</h4>
                  <p>+222 45 25 44 21</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div class="contact-details">
                  <h4>Adresse</h4>
                  <p>ANRSI, Nouakchott, Mauritanie</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-clock"></i>
                <div class="contact-details">
                  <h4>Horaires</h4>
                  <p>Lundi - Vendredi : 8h00 - 16h00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .appels-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/candidatures.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .appels-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .appels-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .appels-hero p {
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
    
    .appels-section {
      padding: var(--space-12) 0;
    }
    
    .appels-content h2 {
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
    
    .appels-timeline {
      max-width: 1000px;
      margin: 0 auto var(--space-12);
    }
    
    .appel-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .appel-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .appel-status {
      padding: var(--space-2) var(--space-4);
      border-radius: 20px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 100px;
      height: fit-content;
      text-align: center;
    }
    
    .appel-status.active {
      background: #10b981;
      color: white;
    }
    
    .appel-status.upcoming {
      background: #f59e0b;
      color: white;
    }
    
    .appel-status.closed {
      background: #6b7280;
      color: white;
    }
    
    .appel-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .appel-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .appel-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-6);
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .detail-label {
      font-weight: 600;
      color: var(--primary-600);
      font-size: var(--text-sm);
    }
    
    .detail-value {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .appel-actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .btn {
      padding: var(--space-2) var(--space-4);
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .btn-primary {
      background: var(--primary-500);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--primary-600);
    }
    
    .btn-outline {
      background: transparent;
      color: var(--primary-500);
      border-color: var(--primary-500);
    }
    
    .btn-outline:hover {
      background: var(--primary-500);
      color: white;
    }
    
    .appels-categories {
      margin: var(--space-12) 0;
    }
    
    .appels-categories h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .category-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .category-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .category-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      text-align: center;
    }
    
    .category-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
      text-align: center;
    }
    
    .category-item ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .category-item li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .application-process {
      margin: var(--space-12) 0;
    }
    
    .application-process h3 {
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
    
    .criteria-section {
      margin: var(--space-12) 0;
    }
    
    .criteria-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .criteria-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .criteria-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .criteria-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .criteria-item h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .criteria-item p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .support-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .support-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .support-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .support-services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .service-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .service-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .service-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .service-content p {
      color: var(--neutral-700);
      line-height: 1.6;
    }
    
    .contact-section {
      margin: var(--space-12) 0;
    }
    
    .contact-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .contact-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .contact-item i {
      color: var(--primary-500);
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .contact-details h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-lg);
    }
    
    .contact-details p {
      color: var(--neutral-700);
    }
    
    @media (max-width: 768px) {
      .appel-item {
        flex-direction: column;
        text-align: center;
      }
      
      .appel-status {
        align-self: center;
        min-width: auto;
      }
      
      .appel-details {
        grid-template-columns: 1fr;
      }
      
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .step-item {
        flex-direction: column;
        text-align: center;
      }
      
      .step-number {
        align-self: center;
      }
      
      .criteria-grid {
        grid-template-columns: 1fr;
      }
      
      .support-services {
        grid-template-columns: 1fr;
      }
      
      .contact-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppelsCandidaturesComponent {}
