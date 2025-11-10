import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agence-medias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="medias-hero">
      <div class="container">
        <h1>ANRSI dans les Médias</h1>
        <p>Actualités, publications et visibilité médiatique</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section medias-section">
        <div class="medias-content">
          <h2>Présence Médias de l'ANRSI</h2>
          <p class="intro-text">
            L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l'innovation technologique, et les initiatives de développement en Mauritanie.
          </p>
          
          <div class="medias-overview">
            <div class="overview-item">
              <div class="overview-icon">📺</div>
              <div class="overview-content">
                <h3>Médias Audiovisuels</h3>
                <p>Interviews, reportages et émissions spéciales sur les chaînes de télévision et radios nationales et internationales.</p>
                <ul>
                  <li>TVM (Télévision de Mauritanie)</li>
                  <li>Radio Mauritanie</li>
                  <li>Chaînes internationales</li>
                  <li>Podcasts scientifiques</li>
                </ul>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">📰</div>
              <div class="overview-content">
                <h3>Presse Écrite</h3>
                <p>Articles, tribunes et publications dans les journaux nationaux et internationaux.</p>
                <ul>
                  <li>Le Calame</li>
                  <li>Horizons</li>
                  <li>Mauritanie News</li>
                  <li>Revues scientifiques</li>
                </ul>
              </div>
            </div>
            
            <div class="overview-item">
              <div class="overview-icon">🌐</div>
              <div class="overview-content">
                <h3>Médias Numériques</h3>
                <p>Présence active sur les plateformes numériques et réseaux sociaux.</p>
                <ul>
                  <li>Site web officiel</li>
                  <li>Réseaux sociaux</li>
                  <li>Newsletters</li>
                  <li>Webinaires</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="recent-coverage">
            <h3>Couverture Médias Récente</h3>
            <div class="coverage-timeline">
              <div class="coverage-item">
                <div class="coverage-date">15 Février 2024</div>
                <div class="coverage-content">
                  <h4>Colloque International sur l'IA dans l'Agriculture</h4>
                  <p class="coverage-description">
                    L'ANRSI organise un colloque international sur l'application de l'intelligence artificielle dans l'agriculture de précision pour la sécurité alimentaire.
                  </p>
                  <div class="coverage-media">
                    <div class="media-outlet">
                      <span class="media-type">📺</span>
                      <span class="media-name">TVM - Journal 20h</span>
                    </div>
                    <div class="media-outlet">
                      <span class="media-type">📰</span>
                      <span class="media-name">Le Calame</span>
                    </div>
                    <div class="media-outlet">
                      <span class="media-type">🌐</span>
                      <span class="media-name">ANRSI.mr</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="coverage-item">
                <div class="coverage-date">10 Février 2024</div>
                <div class="coverage-content">
                  <h4>Lancement du Programme Innovation Technologique</h4>
                  <p class="coverage-description">
                    Nouveau programme de soutien aux projets d'innovation technologique et de transfert de technologie vers l'industrie mauritanienne.
                  </p>
                  <div class="coverage-media">
                    <div class="media-outlet">
                      <span class="media-type">📻</span>
                      <span class="media-name">Radio Mauritanie</span>
                    </div>
                    <div class="media-outlet">
                      <span class="media-type">📰</span>
                      <span class="media-name">Horizons</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="coverage-item">
                <div class="coverage-date">5 Février 2024</div>
                <div class="coverage-content">
                  <h4>Partenariat avec l'Université de Nouakchott</h4>
                  <p class="coverage-description">
                    Signature d'un accord de partenariat stratégique pour le développement de la recherche scientifique et l'innovation dans l'enseignement supérieur.
                  </p>
                  <div class="coverage-media">
                    <div class="media-outlet">
                      <span class="media-type">📺</span>
                      <span class="media-name">TVM - Matinée</span>
                    </div>
                    <div class="media-outlet">
                      <span class="media-type">📰</span>
                      <span class="media-name">Mauritanie News</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="coverage-item">
                <div class="coverage-date">1er Février 2024</div>
                <div class="coverage-content">
                  <h4>Résultats du Programme de Bourses Doctorales</h4>
                  <p class="coverage-description">
                    Annonce des lauréats du programme de bourses de doctorat 2024 pour soutenir les étudiants mauritaniens dans leurs études doctorales.
                  </p>
                  <div class="coverage-media">
                    <div class="media-outlet">
                      <span class="media-type">📻</span>
                      <span class="media-name">Radio Mauritanie</span>
                    </div>
                    <div class="media-outlet">
                      <span class="media-type">📰</span>
                      <span class="media-name">Le Calame</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="media-types">
            <h3>Types de Couverture Médias</h3>
            <div class="types-grid">
              <div class="type-item">
                <div class="type-icon">🎤</div>
                <div class="type-content">
                  <h4>Interviews et Déclarations</h4>
                  <p>Interviews exclusives avec le Directeur Général et les experts de l'ANRSI sur les enjeux scientifiques et technologiques.</p>
                  <ul>
                    <li>Interviews télévisées</li>
                    <li>Déclarations officielles</li>
                    <li>Points de presse</li>
                    <li>Conférences de presse</li>
                  </ul>
                </div>
              </div>
              
              <div class="type-item">
                <div class="type-icon">📊</div>
                <div class="type-content">
                  <h4>Reportages et Documentaires</h4>
                  <p>Reportages approfondis sur les projets de recherche, les innovations technologiques et les initiatives de développement.</p>
                  <ul>
                    <li>Reportages terrain</li>
                    <li>Documentaires scientifiques</li>
                    <li>Émissions spéciales</li>
                    <li>Portraits d'experts</li>
                  </ul>
                </div>
              </div>
              
              <div class="type-item">
                <div class="type-icon">📝</div>
                <div class="type-content">
                  <h4>Articles et Publications</h4>
                  <p>Articles de fond, tribunes et publications dans les médias nationaux et internationaux.</p>
                  <ul>
                    <li>Articles d'opinion</li>
                    <li>Tribunes libres</li>
                    <li>Publications scientifiques</li>
                    <li>Communiqués de presse</li>
                  </ul>
                </div>
              </div>
              
              <div class="type-item">
                <div class="type-icon">🎥</div>
                <div class="type-content">
                  <h4>Contenu Multimédia</h4>
                  <p>Production de contenu vidéo, audio et interactif pour les plateformes numériques.</p>
                  <ul>
                    <li>Vidéos éducatives</li>
                    <li>Podcasts scientifiques</li>
                    <li>Webinaires</li>
                    <li>Contenu interactif</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="press-releases">
            <h3>Communiqués de Presse</h3>
            <div class="releases-list">
              <div class="release-item">
                <div class="release-date">20 Février 2024</div>
                <div class="release-content">
                  <h4>Lancement du Programme "Innovation Verte"</h4>
                  <p>L'ANRSI annonce le lancement d'un nouveau programme de financement pour les projets d'innovation verte et de technologies durables.</p>
                  <a href="#" class="release-link">Lire le communiqué complet</a>
                </div>
              </div>
              
              <div class="release-item">
                <div class="release-date">18 Février 2024</div>
                <div class="release-content">
                  <h4>Partenariat avec l'Institut Pasteur</h4>
                  <p>Signature d'un accord de collaboration avec l'Institut Pasteur pour le développement de la recherche médicale en Mauritanie.</p>
                  <a href="#" class="release-link">Lire le communiqué complet</a>
                </div>
              </div>
              
              <div class="release-item">
                <div class="release-date">15 Février 2024</div>
                <div class="release-content">
                  <h4>Résultats de l'Appel à Projets 2024</h4>
                  <p>Announcement des projets sélectionnés dans le cadre de l'appel à projets de recherche et d'innovation 2024.</p>
                  <a href="#" class="release-link">Lire le communiqué complet</a>
                </div>
              </div>
              
              <div class="release-item">
                <div class="release-date">12 Février 2024</div>
                <div class="release-content">
                  <h4>Inauguration du Laboratoire de Biotechnologie</h4>
                  <p>Ouverture officielle du nouveau laboratoire de biotechnologie équipé des dernières technologies pour la recherche en biologie moléculaire.</p>
                  <a href="#" class="release-link">Lire le communiqué complet</a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="media-kit">
            <h3>Kit Médias</h3>
            <div class="kit-content">
              <p>L'ANRSI met à disposition des médias un kit complet pour faciliter la couverture de ses activités :</p>
              
              <div class="kit-items">
                <div class="kit-item">
                  <div class="kit-icon">📸</div>
                  <div class="kit-details">
                    <h4>Photos et Images</h4>
                    <p>Banque d'images haute résolution des installations, équipements et événements de l'ANRSI.</p>
                    <a href="#" class="kit-link">Télécharger les photos</a>
                  </div>
                </div>
                
                <div class="kit-item">
                  <div class="kit-icon">🎥</div>
                  <div class="kit-details">
                    <h4>Vidéos et B-Roll</h4>
                    <p>Vidéos de présentation, interviews et séquences B-Roll pour les reportages télévisés.</p>
                    <a href="#" class="kit-link">Accéder aux vidéos</a>
                  </div>
                </div>
                
                <div class="kit-item">
                  <div class="kit-icon">📄</div>
                  <div class="kit-details">
                    <h4>Documents et Fiches</h4>
                    <p>Fiches techniques, présentations et documents d'information sur les programmes et projets.</p>
                    <a href="#" class="kit-link">Télécharger les documents</a>
                  </div>
                </div>
                
                <div class="kit-item">
                  <div class="kit-icon">👥</div>
                  <div class="kit-details">
                    <h4>Contacts Presse</h4>
                    <p>Liste des contacts presse et experts disponibles pour interviews et commentaires.</p>
                    <a href="#" class="kit-link">Voir les contacts</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="social-media">
            <h3>Réseaux Sociaux</h3>
            <div class="social-content">
              <p>Suivez l'ANRSI sur les réseaux sociaux pour les dernières actualités et informations :</p>
              
              <div class="social-platforms">
                <div class="platform-item">
                  <div class="platform-icon">📘</div>
                  <div class="platform-info">
                    <h4>Facebook</h4>
                    <p>@ANRSI.Mauritanie</p>
                    <a href="#" class="platform-link">Suivre sur Facebook</a>
                  </div>
                </div>
                
                <div class="platform-item">
                  <div class="platform-icon">🐦</div>
                  <div class="platform-info">
                    <h4>Twitter</h4>
                    <p>@ANRSI_MR</p>
                    <a href="#" class="platform-link">Suivre sur Twitter</a>
                  </div>
                </div>
                
                <div class="platform-item">
                  <div class="platform-icon">💼</div>
                  <div class="platform-info">
                    <h4>LinkedIn</h4>
                    <p>ANRSI Mauritanie</p>
                    <a href="#" class="platform-link">Suivre sur LinkedIn</a>
                  </div>
                </div>
                
                <div class="platform-item">
                  <div class="platform-icon">📺</div>
                  <div class="platform-info">
                    <h4>YouTube</h4>
                    <p>ANRSI Mauritanie</p>
                    <a href="#" class="platform-link">S'abonner à YouTube</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="contact-section">
            <h3>Contact Presse</h3>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div class="contact-details">
                  <h4>Email Presse</h4>
                  <p>presse@anrsi.mr</p>
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
                <i class="fas fa-user"></i>
                <div class="contact-details">
                  <h4>Responsable Presse</h4>
                  <p>Mme Fatima Mint Ahmed</p>
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
    .medias-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/media.jpg');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 0px;
    }
    
    .medias-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .medias-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .medias-hero p {
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
    
    .medias-section {
      padding: var(--space-12) 0;
    }
    
    .medias-content h2 {
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
    
    .medias-overview {
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
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .overview-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .overview-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .recent-coverage {
      margin: var(--space-12) 0;
    }
    
    .recent-coverage h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .coverage-timeline {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .coverage-item {
      display: flex;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .coverage-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .coverage-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-3) var(--space-4);
      border-radius: 8px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 120px;
      height: fit-content;
      text-align: center;
    }
    
    .coverage-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-xl);
    }
    
    .coverage-description {
      color: var(--neutral-700);
      margin-bottom: var(--space-4);
      line-height: 1.6;
    }
    
    .coverage-media {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .media-outlet {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-2);
      background: var(--neutral-100);
      border-radius: 4px;
      font-size: var(--text-sm);
    }
    
    .media-type {
      font-size: var(--text-sm);
    }
    
    .media-name {
      color: var(--neutral-700);
    }
    
    .media-types {
      margin: var(--space-12) 0;
    }
    
    .media-types h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .type-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .type-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .type-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .type-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-3);
      font-size: var(--text-lg);
    }
    
    .type-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .type-content ul {
      color: var(--neutral-700);
      padding-left: var(--space-4);
    }
    
    .type-content li {
      margin-bottom: var(--space-1);
      font-size: var(--text-sm);
    }
    
    .press-releases {
      background: var(--neutral-50);
      padding: var(--space-8);
      border-radius: 16px;
      margin: var(--space-12) 0;
    }
    
    .press-releases h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .releases-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }
    
    .release-item {
      display: flex;
      gap: var(--space-6);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .release-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .release-date {
      background: var(--primary-500);
      color: white;
      padding: var(--space-2) var(--space-3);
      border-radius: 6px;
      font-weight: bold;
      font-size: var(--text-sm);
      min-width: 100px;
      height: fit-content;
      text-align: center;
    }
    
    .release-content h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .release-content p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .release-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .release-link:hover {
      text-decoration: underline;
    }
    
    .media-kit {
      margin: var(--space-12) 0;
    }
    
    .media-kit h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .kit-content p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .kit-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
    }
    
    .kit-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .kit-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .kit-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .kit-details h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .kit-details p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      line-height: 1.6;
    }
    
    .kit-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .kit-link:hover {
      text-decoration: underline;
    }
    
    .social-media {
      margin: var(--space-12) 0;
    }
    
    .social-media h3 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-8);
      font-size: var(--text-2xl);
    }
    
    .social-content p {
      text-align: center;
      color: var(--neutral-700);
      margin-bottom: var(--space-8);
      font-size: var(--text-lg);
    }
    
    .social-platforms {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-6);
    }
    
    .platform-item {
      text-align: center;
      padding: var(--space-6);
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .platform-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .platform-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .platform-info h4 {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
    }
    
    .platform-info p {
      color: var(--neutral-700);
      margin-bottom: var(--space-3);
      font-size: var(--text-sm);
    }
    
    .platform-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 500;
      font-size: var(--text-sm);
    }
    
    .platform-link:hover {
      text-decoration: underline;
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
      .medias-overview {
        grid-template-columns: 1fr;
      }
      
      .coverage-item {
        flex-direction: column;
        text-align: center;
      }
      
      .coverage-date {
        align-self: center;
        min-width: auto;
      }
      
      .types-grid {
        grid-template-columns: 1fr;
      }
      
      .release-item {
        flex-direction: column;
        text-align: center;
      }
      
      .release-date {
        align-self: center;
        min-width: auto;
      }
      
      .kit-items {
        grid-template-columns: 1fr;
      }
      
      .social-platforms {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .contact-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AgenceMediasComponent {}
