import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zone-humide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zone-humide-hero">
      <div class="container">
        <h1>Zone Humide</h1>
        <p>Colloque International sur les Zones Humides du Sahel</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section zone-humide-section">
        <div class="zone-humide-content">
          <h2>Colloque International sur les Zones Humides du Sahel</h2>
          <p class="intro-text">
            L'ANRSI organise un colloque international majeur sur la préservation et la gestion durable des zones humides du Sahel, réunissant experts, chercheurs et décideurs pour échanger sur les enjeux environnementaux et climatiques.
          </p>
          
          <div class="colloque-overview">
            <div class="overview-item">
              <div class="overview-icon">📅</div>
              <div class="overview-content">
                <h3>Dates et Lieu</h3>
                <p><strong>Date :</strong> 15-17 Mars 2024</p>
                <p><strong>Lieu :</strong> Centre International de Conférences, Nouakchott</p>
                <p><strong>Format :</strong> Présentiel et en ligne</p>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">👥</div>
              <div class="overview-content">
                <h3>Participants Attendus</h3>
                <p><strong>Experts internationaux :</strong> 50+ spécialistes</p>
                <p><strong>Chercheurs :</strong> 100+ scientifiques</p>
                <p><strong>Décideurs :</strong> Ministres et responsables</p>
                <p><strong>ONG et OSC :</strong> Organisations de la société civile</p>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">🌍</div>
              <div class="overview-content">
                <h3>Pays Participants</h3>
                <p><strong>Afrique de l'Ouest :</strong> Sénégal, Mali, Niger, Burkina Faso</p>
                <p><strong>Afrique du Nord :</strong> Maroc, Algérie, Tunisie</p>
                <p><strong>Europe :</strong> France, Belgique, Espagne</p>
                <p><strong>Organisations :</strong> UICN, Ramsar, PNUE</p>
              </div>
            </div>
          </div>
          
          <div class="themes-section">
            <h3>Thématiques du Colloque</h3>
            <div class="themes-grid">
              <div class="theme-item">
                <div class="theme-icon">💧</div>
                <div class="theme-content">
                  <h4>Gestion des Ressources Hydriques</h4>
                  <ul>
                    <li>Conservation des zones humides</li>
                    <li>Gestion intégrée des bassins versants</li>
                    <li>Technologies de traitement de l'eau</li>
                    <li>Économie de l'eau</li>
                  </ul>
                </div>
              </div>
              
              <div class="theme-item">
                <div class="theme-icon">🌱</div>
                <div class="theme-content">
                  <h4>Biodiversité et Écosystèmes</h4>
                  <ul>
                    <li>Protection de la faune et flore</li>
                    <li>Restauration écologique</li>
                    <li>Services écosystémiques</li>
                    <li>Corridors écologiques</li>
                  </ul>
                </div>
              </div>
              
              <div class="theme-item">
                <div class="theme-icon">🌡️</div>
                <div class="theme-content">
                  <h4>Changement Climatique</h4>
                  <ul>
                    <li>Adaptation aux changements climatiques</li>
                    <li>Atténuation des effets</li>
                    <li>Modélisation climatique</li>
                    <li>Stratégies de résilience</li>
                  </ul>
                </div>
              </div>
              
              <div class="theme-item">
                <div class="theme-icon">👨‍🌾</div>
                <div class="theme-content">
                  <h4>Développement Durable</h4>
                  <ul>
                    <li>Agriculture durable</li>
                    <li>Pêche responsable</li>
                    <li>Écotourisme</li>
                    <li>Économie verte</li>
                  </ul>
                </div>
              </div>
              
              <div class="theme-item">
                <div class="theme-icon">🏛️</div>
                <div class="theme-content">
                  <h4>Gouvernance et Politiques</h4>
                  <ul>
                    <li>Cadres législatifs</li>
                    <li>Politiques publiques</li>
                    <li>Participation communautaire</li>
                    <li>Coopération internationale</li>
                  </ul>
                </div>
              </div>
              
              <div class="theme-item">
                <div class="theme-icon">🔬</div>
                <div class="theme-content">
                  <h4>Recherche et Innovation</h4>
                  <ul>
                    <li>Technologies de monitoring</li>
                    <li>Innovation environnementale</li>
                    <li>Transfert de connaissances</li>
                    <li>Formation et éducation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="programme-section">
            <h3>Programme du Colloque</h3>
            <div class="programme-timeline">
              <div class="programme-day">
                <div class="day-header">
                  <h4>Jour 1 - 15 Mars 2024</h4>
                  <span class="day-theme">Ouverture et Enjeux Globaux</span>
                </div>
                <div class="day-sessions">
                  <div class="session-item">
                    <div class="session-time">09:00 - 10:30</div>
                    <div class="session-content">
                      <h5>Cérémonie d'Ouverture</h5>
                      <p>Discours d'ouverture par les autorités mauritaniennes et internationales</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">11:00 - 12:30</div>
                    <div class="session-content">
                      <h5>Conférence Plénière</h5>
                      <p>"Les zones humides du Sahel : enjeux et défis pour le 21ème siècle"</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">14:00 - 15:30</div>
                    <div class="session-content">
                      <h5>Session Parallèle 1</h5>
                      <p>Gestion des ressources hydriques et conservation</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">16:00 - 17:30</div>
                    <div class="session-content">
                      <h5>Session Parallèle 2</h5>
                      <p>Biodiversité et écosystèmes des zones humides</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="programme-day">
                <div class="day-header">
                  <h4>Jour 2 - 16 Mars 2024</h4>
                  <span class="day-theme">Solutions et Innovations</span>
                </div>
                <div class="day-sessions">
                  <div class="session-item">
                    <div class="session-time">09:00 - 10:30</div>
                    <div class="session-content">
                      <h5>Conférence Plénière</h5>
                      <p>"Innovation technologique pour la préservation des zones humides"</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">11:00 - 12:30</div>
                    <div class="session-content">
                      <h5>Session Parallèle 3</h5>
                      <p>Changement climatique et adaptation</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">14:00 - 15:30</div>
                    <div class="session-content">
                      <h5>Session Parallèle 4</h5>
                      <p>Développement durable et économie verte</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">16:00 - 17:30</div>
                    <div class="session-content">
                      <h5>Ateliers Pratiques</h5>
                      <p>Formation aux outils de monitoring et évaluation</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="programme-day">
                <div class="day-header">
                  <h4>Jour 3 - 17 Mars 2024</h4>
                  <span class="day-theme">Partenariats et Actions</span>
                </div>
                <div class="day-sessions">
                  <div class="session-item">
                    <div class="session-time">09:00 - 10:30</div>
                    <div class="session-content">
                      <h5>Conférence Plénière</h5>
                      <p>"Gouvernance et coopération internationale"</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">11:00 - 12:30</div>
                    <div class="session-content">
                      <h5>Table Ronde</h5>
                      <p>"Stratégies d'action pour la préservation des zones humides"</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">14:00 - 15:30</div>
                    <div class="session-content">
                      <h5>Présentation des Résultats</h5>
                      <p>Synthèse des travaux et recommandations</p>
                    </div>
                  </div>
                  
                  <div class="session-item">
                    <div class="session-time">16:00 - 17:00</div>
                    <div class="session-content">
                      <h5>Cérémonie de Clôture</h5>
                      <p>Signature de la Déclaration de Nouakchott</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="speakers-section">
            <h3>Conférenciers Invités</h3>
            <div class="speakers-grid">
              <div class="speaker-item">
                <div class="speaker-avatar">👨‍🔬</div>
                <div class="speaker-info">
                  <h4>Dr. Ahmed Ould Sidi</h4>
                  <p class="speaker-title">Directeur Général, ANRSI</p>
                  <p class="speaker-bio">Expert en environnement et développement durable, ancien ministre de l'environnement.</p>
                </div>
              </div>
              
              <div class="speaker-item">
                <div class="speaker-avatar">👩‍🔬</div>
                <div class="speaker-info">
                  <h4>Prof. Fatou Sarr</h4>
                  <p class="speaker-title">Université Cheikh Anta Diop, Sénégal</p>
                  <p class="speaker-bio">Spécialiste des zones humides et de la biodiversité en Afrique de l'Ouest.</p>
                </div>
              </div>
              
              <div class="speaker-item">
                <div class="speaker-avatar">👨‍💼</div>
                <div class="speaker-info">
                  <h4>Dr. Jean-Pierre Hervé</h4>
                  <p class="speaker-title">Convention de Ramsar</p>
                  <p class="speaker-bio">Responsable des programmes Afrique pour la Convention sur les zones humides.</p>
                </div>
              </div>
              
              <div class="speaker-item">
                <div class="speaker-avatar">👩‍💼</div>
                <div class="speaker-info">
                  <h4>Dr. Amina Benkhadra</h4>
                  <p class="speaker-title">UICN Afrique du Nord</p>
                  <p class="speaker-bio">Experte en conservation et gestion durable des écosystèmes.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="registration-section">
            <h3>Inscription et Participation</h3>
            <div class="registration-info">
              <div class="registration-modes">
                <div class="mode-item">
                  <div class="mode-icon">🏢</div>
                  <div class="mode-content">
                    <h4>Participation Présentielle</h4>
                    <p>Accès complet au colloque avec hébergement et restauration inclus.</p>
                    <ul>
                      <li>Accès à toutes les sessions</li>
                      <li>Matériel de conférence</li>
                      <li>Pause-café et déjeuners</li>
                      <li>Certificat de participation</li>
                    </ul>
                    <div class="mode-price">Gratuit</div>
                  </div>
                </div>
                
                <div class="mode-item">
                  <div class="mode-icon">💻</div>
                  <div class="mode-content">
                    <h4>Participation en Ligne</h4>
                    <p>Suivi du colloque en direct via plateforme numérique.</p>
                    <ul>
                      <li>Diffusion en direct</li>
                      <li>Interaction avec les speakers</li>
                      <li>Accès aux présentations</li>
                      <li>Certificat numérique</li>
                    </ul>
                    <div class="mode-price">Gratuit</div>
                  </div>
                </div>
              </div>
              
              <div class="registration-process">
                <h4>Processus d'Inscription :</h4>
                <div class="process-steps">
                  <div class="process-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h5>Formulaire d'Inscription</h5>
                      <p>Remplir le formulaire en ligne avec vos informations personnelles et professionnelles.</p>
                    </div>
                  </div>
                  
                  <div class="process-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h5>Validation</h5>
                      <p>Validation de votre inscription par l'équipe organisatrice sous 48h.</p>
                    </div>
                  </div>
                  
                  <div class="process-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h5>Confirmation</h5>
                      <p>Réception de votre confirmation d'inscription avec les détails pratiques.</p>
                    </div>
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
                  <p>zonehumide@anrsi.mr</p>
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
                  <h4>Lieu</h4>
                  <p>Centre International de Conférences, Nouakchott</p>
                </div>
              </div>
              
              <div class="contact-item">
                <i class="fas fa-calendar"></i>
                <div class="contact-details">
                  <h4>Date Limite</h4>
                  <p>28 Février 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .zone-humide-hero {
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
    
    .zone-humide-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .zone-humide-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .zone-humide-hero p {
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
    
    .zone-humide-section {
      padding: var(--space-12) 0;
    }
    
    .zone-humide-content h2 {
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
    
    .colloque-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-12);
    }
    
    .overview-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .overview-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .overview-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .overview-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .overview-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .themes-section {
      margin: var(--space-12) 0;
    }
    
    .themes-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .themes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .theme-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .theme-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .theme-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .theme-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .theme-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .theme-content li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .programme-section {
      margin: var(--space-12) 0;
    }
    
    .programme-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .programme-timeline {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .programme-day {
      margin-bottom: var(--space-8);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .day-header {
      background: var(--primary-500);
      color: white;
      padding: var(--space-4) var(--space-6);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .day-header h4 {
      font-size: var(--text-lg);
      margin: 0;
    }
    
    .day-theme {
      font-size: var(--text-sm);
      opacity: 0.9;
    }
    
    .day-sessions {
      padding: var(--space-6);
    }
    
    .session-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      padding: var(--space-4);
      background: var(--neutral-50);
      border-radius: 8px;
    }
    
    .session-time {
      background: var(--primary-100);
      color: var(--primary-700);
      padding: var(--space-2) var(--space-3);
      border-radius: 6px;
      font-weight: 600;
      font-size: var(--text-sm);
      min-width: 100px;
      text-align: center;
    }
    
    .session-content h5 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-base);
    }
    
    .session-content p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
      line-height: 1.5;
    }
    
    .speakers-section {
      margin: var(--space-12) 0;
    }
    
    .speakers-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .speakers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .speaker-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .speaker-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .speaker-avatar {
      font-size: 3rem;
      flex-shrink: 0;
    }
    
    .speaker-info h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-lg);
    }
    
    .speaker-title {
      color: var(--primary-500);
      font-weight: 600;
      margin-bottom: var(--space-2);
      font-size: var(--text-sm);
    }
    
    .speaker-bio {
      color: var(--neutral-700);
      line-height: 1.5;
      font-size: var(--text-sm);
    }
    
    .registration-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .registration-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .registration-modes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .mode-item {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .mode-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .mode-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .mode-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .mode-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      text-align: left;
      margin-bottom: var(--space-4);
    }
    
    .mode-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .mode-price {
      background: var(--primary-500);
      color: white;
      padding: var(--space-2) var(--space-4);
      border-radius: 20px;
      font-weight: bold;
      font-size: var(--text-sm);
    }
    
    .registration-process h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-lg);
    }
    
    .process-steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .process-step {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-4);
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .step-number {
      background: var(--primary-500);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-sm);
      flex-shrink: 0;
    }
    
    .step-content h5 {
      color: var(--primary-600);
      margin-bottom: var(--space-1);
      font-size: var(--text-base);
    }
    
    .step-content p {
      color: var(--neutral-700);
      font-size: var(--text-sm);
      line-height: 1.5;
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
      .colloque-overview {
        grid-template-columns: 1fr;
      }
      
      .themes-grid {
        grid-template-columns: 1fr;
      }
      
      .speakers-grid {
        grid-template-columns: 1fr;
      }
      
      .registration-modes {
        grid-template-columns: 1fr;
      }
      
      .day-header {
        flex-direction: column;
        gap: var(--space-2);
        text-align: center;
      }
      
      .session-item {
        flex-direction: column;
        text-align: center;
      }
      
      .session-time {
        align-self: center;
      }
      
      .contact-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ZoneHumideComponent {}
