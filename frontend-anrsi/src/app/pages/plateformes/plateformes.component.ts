import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plateformes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plateformes-hero">
      <div class="container">
        <h1>Plateformes</h1>
        <p>Outils et technologies pour la recherche et l'innovation</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section plateformes-section">
        <div class="plateformes-content">
          <h2>Plateformes Technologiques ANRSI</h2>
          <p class="intro-text">
            L'ANRSI met à disposition des chercheurs et innovateurs mauritaniens des plateformes technologiques de pointe pour soutenir leurs projets de recherche et d'innovation.
          </p>
          
          <div class="plateformes-grid">
            <div class="plateforme-item">
              <div class="plateforme-icon">🔬</div>
              <div class="plateforme-content">
                <h3>Plateforme d'Analyse Chimique</h3>
                <p class="plateforme-description">
                  Laboratoire équipé d'instruments de pointe pour l'analyse chimique, spectroscopie, et caractérisation des matériaux.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>Spectromètre de masse</li>
                    <li>Chromatographe en phase gazeuse</li>
                    <li>Diffractomètre RX</li>
                    <li>Microscope électronique</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Analyse de composition</li>
                    <li>Caractérisation de matériaux</li>
                    <li>Contrôle qualité</li>
                    <li>Formation technique</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">chimie@anrsi.mr</span>
                </div>
              </div>
            </div>
            
            <div class="plateforme-item">
              <div class="plateforme-icon">💻</div>
              <div class="plateforme-content">
                <h3>Plateforme Informatique et Calcul</h3>
                <p class="plateforme-description">
                  Infrastructure informatique haute performance pour le calcul scientifique, simulation numérique, et traitement de données.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>Cluster de calcul haute performance</li>
                    <li>Serveurs de stockage massif</li>
                    <li>Réseau haute vitesse</li>
                    <li>Logiciels scientifiques</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Calcul parallèle</li>
                    <li>Simulation numérique</li>
                    <li>Analyse de données</li>
                    <li>Support technique</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">informatique@anrsi.mr</span>
                </div>
              </div>
            </div>
            
            <div class="plateforme-item">
              <div class="plateforme-icon">🌱</div>
              <div class="plateforme-content">
                <h3>Plateforme Biotechnologique</h3>
                <p class="plateforme-description">
                  Laboratoire spécialisé en biotechnologie pour la recherche en biologie moléculaire, génétique, et biologie végétale.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>PCR en temps réel</li>
                    <li>Électrophorèse</li>
                    <li>Microscopes de fluorescence</li>
                    <li>Incubateurs contrôlés</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Analyse génétique</li>
                    <li>Culture cellulaire</li>
                    <li>Tests biologiques</li>
                    <li>Consultation scientifique</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">biotech@anrsi.mr</span>
                </div>
              </div>
            </div>
            
            <div class="plateforme-item">
              <div class="plateforme-icon">⚡</div>
              <div class="plateforme-content">
                <h3>Plateforme Énergétique</h3>
                <p class="plateforme-description">
                  Installation dédiée aux tests et développement de technologies énergétiques renouvelables et systèmes de stockage.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>Simulateur solaire</li>
                    <li>Banc d'essai éolien</li>
                    <li>Système de stockage batterie</li>
                    <li>Analyseur de puissance</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Tests de performance</li>
                    <li>Optimisation de systèmes</li>
                    <li>Études de faisabilité</li>
                    <li>Formation technique</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">energie@anrsi.mr</span>
                </div>
              </div>
            </div>
            
            <div class="plateforme-item">
              <div class="plateforme-icon">🌍</div>
              <div class="plateforme-content">
                <h3>Plateforme Environnementale</h3>
                <p class="plateforme-description">
                  Laboratoire d'analyse environnementale pour l'étude de la qualité de l'air, de l'eau, et des sols.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>Analyseur de qualité d'air</li>
                    <li>Spectromètre UV-Vis</li>
                    <li>pH-mètres de précision</li>
                    <li>Échantillonneurs automatiques</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Monitoring environnemental</li>
                    <li>Analyse de pollution</li>
                    <li>Études d'impact</li>
                    <li>Consultation réglementaire</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">environnement@anrsi.mr</span>
                </div>
              </div>
            </div>
            
            <div class="plateforme-item">
              <div class="plateforme-icon">🏭</div>
              <div class="plateforme-content">
                <h3>Plateforme de Prototypage</h3>
                <p class="plateforme-description">
                  Atelier de fabrication numérique pour le prototypage rapide, impression 3D, et développement de produits.
                </p>
                <div class="plateforme-equipments">
                  <h4>Équipements :</h4>
                  <ul>
                    <li>Imprimantes 3D industrielles</li>
                    <li>Machine de découpe laser</li>
                    <li>Fraiseuse CNC</li>
                    <li>Scanner 3D</li>
                  </ul>
                </div>
                <div class="plateforme-services">
                  <h4>Services :</h4>
                  <ul>
                    <li>Prototypage rapide</li>
                    <li>Design assisté par ordinateur</li>
                    <li>Fabrication sur mesure</li>
                    <li>Formation technique</li>
                  </ul>
                </div>
                <div class="plateforme-contact">
                  <span class="contact-label">Contact :</span>
                  <span class="contact-value">prototypage@anrsi.mr</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="access-section">
            <h3>Accès aux Plateformes</h3>
            <div class="access-info">
              <p>Les plateformes ANRSI sont accessibles aux chercheurs, étudiants, et entreprises mauritaniennes selon des modalités spécifiques :</p>
              
              <div class="access-modes">
                <div class="access-mode">
                  <div class="mode-icon">🎓</div>
                  <div class="mode-content">
                    <h4>Accès Académique</h4>
                    <p>Tarifs préférentiels pour les universités et institutions de recherche publiques.</p>
                    <ul>
                      <li>50% de réduction sur les tarifs standards</li>
                      <li>Formation gratuite incluse</li>
                      <li>Support technique prioritaire</li>
                    </ul>
                  </div>
                </div>
                
                <div class="access-mode">
                  <div class="mode-icon">🏢</div>
                  <div class="mode-content">
                    <h4>Accès Industriel</h4>
                    <p>Services complets pour les entreprises et startups innovantes.</p>
                    <ul>
                      <li>Tarifs compétitifs</li>
                      <li>Confidentialité garantie</li>
                      <li>Rapports détaillés</li>
                    </ul>
                  </div>
                </div>
                
                <div class="access-mode">
                  <div class="mode-icon">🤝</div>
                  <div class="mode-content">
                    <h4>Partenariats</h4>
                    <p>Collaborations à long terme avec des institutions partenaires.</p>
                    <ul>
                      <li>Accès privilégié</li>
                      <li>Co-développement de projets</li>
                      <li>Formation du personnel</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="booking-section">
            <h3>Réservation et Utilisation</h3>
            <div class="booking-process">
              <div class="booking-steps">
                <div class="booking-step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>Demande d'Accès</h4>
                    <p>Soumission d'une demande détaillée avec description du projet et besoins techniques.</p>
                  </div>
                </div>
                
                <div class="booking-step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>Évaluation Technique</h4>
                    <p>Analyse de la faisabilité technique et évaluation des ressources nécessaires.</p>
                  </div>
                </div>
                
                <div class="booking-step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>Formation</h4>
                    <p>Formation obligatoire aux procédures de sécurité et d'utilisation des équipements.</p>
                  </div>
                </div>
                
                <div class="booking-step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h4>Réservation</h4>
                    <p>Planification des créneaux d'utilisation selon la disponibilité des équipements.</p>
                  </div>
                </div>
                
                <div class="booking-step">
                  <div class="step-number">5</div>
                  <div class="step-content">
                    <h4>Utilisation</h4>
                    <p>Accès aux plateformes avec support technique et supervision si nécessaire.</p>
                  </div>
                </div>
              </div>
              
              <div class="booking-requirements">
                <h4>Exigences pour l'Accès :</h4>
                <ul>
                  <li>Projet de recherche ou d'innovation validé</li>
                  <li>Formation aux procédures de sécurité</li>
                  <li>Assurance responsabilité civile</li>
                  <li>Respect des règles d'utilisation</li>
                  <li>Signature d'un accord de confidentialité</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="support-section">
            <h3>Support et Formation</h3>
            <div class="support-services">
              <div class="support-item">
                <div class="support-icon">📚</div>
                <div class="support-content">
                  <h4>Formation Technique</h4>
                  <p>Formation complète sur l'utilisation des équipements et les procédures de sécurité.</p>
                </div>
              </div>
              
              <div class="support-item">
                <div class="support-icon">🔧</div>
                <div class="support-content">
                  <h4>Support Technique</h4>
                  <p>Assistance technique pendant l'utilisation des plateformes et maintenance préventive.</p>
                </div>
              </div>
              
              <div class="support-item">
                <div class="support-icon">📊</div>
                <div class="support-content">
                  <h4>Analyse de Données</h4>
                  <p>Support dans l'analyse et l'interprétation des résultats obtenus sur les plateformes.</p>
                </div>
              </div>
              
              <div class="support-item">
                <div class="support-icon">🤝</div>
                <div class="support-content">
                  <h4>Consultation Scientifique</h4>
                  <p>Conseil scientifique pour l'optimisation des protocoles et l'amélioration des résultats.</p>
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
                  <h4>Email Général</h4>
                  <p>plateformes@anrsi.mr</p>
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
                  <p>Lundi - Vendredi : 8h00 - 18h00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .plateformes-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/plateforme.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .plateformes-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .plateformes-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .plateformes-hero p {
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
    
    .plateformes-section {
      padding: var(--space-12) 0;
    }
    
    .plateformes-content h2 {
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
    
    .plateformes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--space-8);
      margin-bottom: var(--space-12);
    }
    
    .plateforme-item {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .plateforme-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    }
    
    .plateforme-icon {
      background: var(--primary-500);
      color: white;
      font-size: 3rem;
      text-align: center;
      padding: var(--space-6);
    }
    
    .plateforme-content {
      padding: var(--space-6);
    }
    
    .plateforme-content h3 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .plateforme-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .plateforme-equipments,
    .plateforme-services {
      margin-bottom: var(--space-4);
    }
    
    .plateforme-equipments h4,
    .plateforme-services h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-base);
    }
    
    .plateforme-equipments ul,
    .plateforme-services ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      font-size: var(--text-sm);
    }
    
    .plateforme-equipments li,
    .plateforme-services li {
      margin-bottom: var(--space-1);
    }
    
    .plateforme-contact {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }
    
    .contact-label {
      font-weight: 600;
      color: var(--primary-600);
      font-size: var(--text-sm);
    }
    
    .contact-value {
      color: var(--neutral-700);
      font-size: var(--text-sm);
    }
    
    .access-section {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .access-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-2xl);
    }
    
    .access-info p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .access-modes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .access-mode {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .mode-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .mode-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .mode-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .mode-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
      font-size: var(--text-sm);
    }
    
    .mode-content li {
      margin-bottom: var(--space-1);
    }
    
    .booking-section {
      margin: var(--space-12) 0;
    }
    
    .booking-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .booking-process {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-8);
    }
    
    .booking-steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .booking-step {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .step-number {
      background: var(--primary-500);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: var(--text-base);
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
    
    .booking-requirements {
      background: white;
      padding: var(--space-6);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }
    
    .booking-requirements h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-4);
      font-size: var(--text-lg);
    }
    
    .booking-requirements ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .booking-requirements li {
      margin-bottom: var(--space-2);
      line-height: 1.5;
    }
    
    .support-section {
      margin: var(--space-12) 0;
    }
    
    .support-section h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .support-services {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .support-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .support-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .support-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .support-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .support-content p {
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
      .plateformes-grid {
        grid-template-columns: 1fr;
      }
      
      .access-modes {
        grid-template-columns: 1fr;
      }
      
      .booking-process {
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
export class PlateformesComponent {}
