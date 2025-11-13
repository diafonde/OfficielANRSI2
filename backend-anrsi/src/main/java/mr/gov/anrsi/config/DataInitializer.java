package mr.gov.anrsi.config;

import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.User;
import mr.gov.anrsi.repository.PageRepository;
import mr.gov.anrsi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "spring.datasource.url")
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PageRepository pageRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DataInitializer: Starting user initialization ===");
        long userCount = userRepository.count();
        System.out.println("Current number of users in database: " + userCount);
        
        // Create or update default admin user
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@anrsi.mr");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            System.out.println("✓ Creating new admin user");
        } else {
            System.out.println("✓ Admin user already exists, updating password");
        }
        // Always reset password to ensure it's properly encoded
        String adminPasswordHash = passwordEncoder.encode("password");
        admin.setPassword(adminPasswordHash);
        userRepository.save(admin);
        System.out.println("✓ Admin user ready: username=admin, password=password");
        System.out.println("  Password hash: " + adminPasswordHash.substring(0, Math.min(30, adminPasswordHash.length())) + "...");
        
        // Create or update default editor user
        User editor = userRepository.findByUsername("editor").orElse(null);
        if (editor == null) {
            editor = new User();
            editor.setUsername("editor");
            editor.setEmail("editor@anrsi.mr");
            editor.setFirstName("Editor");
            editor.setLastName("User");
            editor.setRole(User.Role.EDITOR);
            editor.setIsActive(true);
            System.out.println("✓ Creating new editor user");
        } else {
            System.out.println("✓ Editor user already exists, updating password");
        }
        // Always reset password to ensure it's properly encoded
        String editorPasswordHash = passwordEncoder.encode("password");
        editor.setPassword(editorPasswordHash);
        userRepository.save(editor);
        System.out.println("✓ Editor user ready: username=editor, password=password");
        System.out.println("  Password hash: " + editorPasswordHash.substring(0, Math.min(30, editorPasswordHash.length())) + "...");
        
        long finalUserCount = userRepository.count();
        System.out.println("Final number of users in database: " + finalUserCount);
        System.out.println("=== DataInitializer: User initialization complete ===");
        
        // Initialize default pages
        initializeDefaultPages();
    }
    
    private void initializeDefaultPages() {
        System.out.println("=== DataInitializer: Starting page initialization ===");
        
        // Create agence-medias page if it doesn't exist
        if (!pageRepository.existsBySlug("agence-medias")) {
            System.out.println("✓ Creating agence-medias page");
            
            String defaultContent = """
                {
                  "heroTitle": "ANRSI dans les Médias",
                  "heroSubtitle": "Actualités, publications et visibilité médiatique",
                  "introText": "L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l'innovation technologique, et les initiatives de développement en Mauritanie.",
                  "mediaOverview": [
                    {
                      "icon": "📺",
                      "title": "Médias Audiovisuels",
                      "description": "Interviews, reportages et émissions spéciales sur les chaînes de télévision et radios nationales et internationales.",
                      "items": ["TVM (Télévision de Mauritanie)", "Radio Mauritanie", "Chaînes internationales", "Podcasts scientifiques"]
                    },
                    {
                      "icon": "📰",
                      "title": "Presse Écrite",
                      "description": "Articles, tribunes et publications dans les journaux nationaux et internationaux.",
                      "items": ["Le Calame", "Horizons", "Mauritanie News", "Revues scientifiques"]
                    },
                    {
                      "icon": "🌐",
                      "title": "Médias Numériques",
                      "description": "Présence active sur les plateformes numériques et réseaux sociaux.",
                      "items": ["Site web officiel", "Réseaux sociaux", "Newsletters", "Webinaires"]
                    }
                  ],
                  "recentCoverage": [],
                  "mediaTypes": [
                    {
                      "icon": "🎤",
                      "title": "Interviews et Déclarations",
                      "description": "Interviews exclusives avec le Directeur Général et les experts de l'ANRSI sur les enjeux scientifiques et technologiques.",
                      "items": ["Interviews télévisées", "Déclarations officielles", "Points de presse", "Conférences de presse"]
                    },
                    {
                      "icon": "📊",
                      "title": "Reportages et Documentaires",
                      "description": "Reportages approfondis sur les projets de recherche, les innovations technologiques et les initiatives de développement.",
                      "items": ["Reportages terrain", "Documentaires scientifiques", "Émissions spéciales", "Portraits d'experts"]
                    },
                    {
                      "icon": "📝",
                      "title": "Articles et Publications",
                      "description": "Articles de fond, tribunes et publications dans les médias nationaux et internationaux.",
                      "items": ["Articles d'opinion", "Tribunes libres", "Publications scientifiques", "Communiqués de presse"]
                    },
                    {
                      "icon": "🎥",
                      "title": "Contenu Multimédia",
                      "description": "Production de contenu vidéo, audio et interactif pour les plateformes numériques.",
                      "items": ["Vidéos éducatives", "Podcasts scientifiques", "Webinaires", "Contenu interactif"]
                    }
                  ],
                  "pressReleases": [],
                  "mediaKit": [
                    {
                      "icon": "📸",
                      "title": "Photos et Images",
                      "description": "Banque d'images haute résolution des installations, équipements et événements de l'ANRSI.",
                      "link": "#"
                    },
                    {
                      "icon": "🎥",
                      "title": "Vidéos et B-Roll",
                      "description": "Vidéos de présentation, interviews et séquences B-Roll pour les reportages télévisés.",
                      "link": "#"
                    },
                    {
                      "icon": "📄",
                      "title": "Documents et Fiches",
                      "description": "Fiches techniques, présentations et documents d'information sur les programmes et projets.",
                      "link": "#"
                    },
                    {
                      "icon": "👥",
                      "title": "Contacts Presse",
                      "description": "Liste des contacts presse et experts disponibles pour interviews et commentaires.",
                      "link": "#"
                    }
                  ],
                  "socialMedia": [
                    {
                      "icon": "📘",
                      "name": "Facebook",
                      "handle": "@ANRSI.Mauritanie",
                      "link": "#"
                    },
                    {
                      "icon": "🐦",
                      "name": "Twitter",
                      "handle": "@ANRSI_MR",
                      "link": "#"
                    },
                    {
                      "icon": "💼",
                      "name": "LinkedIn",
                      "handle": "ANRSI Mauritanie",
                      "link": "#"
                    },
                    {
                      "icon": "📺",
                      "name": "YouTube",
                      "handle": "ANRSI Mauritanie",
                      "link": "#"
                    }
                  ],
                  "contactInfo": [
                    {
                      "icon": "fas fa-envelope",
                      "label": "Email Presse",
                      "value": "presse@anrsi.mr"
                    },
                    {
                      "icon": "fas fa-phone",
                      "label": "Téléphone",
                      "value": "+222 45 25 44 21"
                    },
                    {
                      "icon": "fas fa-user",
                      "label": "Responsable Presse",
                      "value": "Mme Fatima Mint Ahmed"
                    },
                    {
                      "icon": "fas fa-clock",
                      "label": "Horaires",
                      "value": "Lundi - Vendredi : 8h00 - 16h00"
                    }
                  ]
                }
                """;
            
            Page agenceMediasPage = new Page();
            agenceMediasPage.setSlug("agence-medias");
            agenceMediasPage.setTitle("ANRSI dans les Médias");
            agenceMediasPage.setHeroTitle("ANRSI dans les Médias");
            agenceMediasPage.setHeroSubtitle("Actualités, publications et visibilité médiatique");
            agenceMediasPage.setContent(defaultContent);
            agenceMediasPage.setPageType(Page.PageType.STRUCTURED);
            agenceMediasPage.setIsPublished(true);
            agenceMediasPage.setIsActive(true);
            
            pageRepository.save(agenceMediasPage);
            System.out.println("✓ Agence-medias page created successfully");
        } else {
            System.out.println("✓ Agence-medias page already exists");
        }
        
        // Create zone-humide page if it doesn't exist
        if (!pageRepository.existsBySlug("zone-humide")) {
            System.out.println("✓ Creating zone-humide page");
            
            String defaultContent = """
                {
                  "heroTitle": "Zone Humide",
                  "heroSubtitle": "Colloque International sur les Zones Humides du Sahel",
                  "introText": "L'ANRSI organise un colloque international majeur sur la préservation et la gestion durable des zones humides du Sahel, réunissant experts, chercheurs et décideurs pour échanger sur les enjeux environnementaux et climatiques.",
                  "overview": [
                    {
                      "icon": "📅",
                      "title": "Dates et Lieu",
                      "content": [
                        {"label": "Date :", "value": "15-17 Mars 2024"},
                        {"label": "Lieu :", "value": "Centre International de Conférences, Nouakchott"},
                        {"label": "Format :", "value": "Présentiel et en ligne"}
                      ]
                    },
                    {
                      "icon": "👥",
                      "title": "Participants Attendus",
                      "content": [
                        {"label": "Experts internationaux :", "value": "50+ spécialistes"},
                        {"label": "Chercheurs :", "value": "100+ scientifiques"},
                        {"label": "Décideurs :", "value": "Ministres et responsables"},
                        {"label": "ONG et OSC :", "value": "Organisations de la société civile"}
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "Pays Participants",
                      "content": [
                        {"label": "Afrique de l'Ouest :", "value": "Sénégal, Mali, Niger, Burkina Faso"},
                        {"label": "Afrique du Nord :", "value": "Maroc, Algérie, Tunisie"},
                        {"label": "Europe :", "value": "France, Belgique, Espagne"},
                        {"label": "Organisations :", "value": "UICN, Ramsar, PNUE"}
                      ]
                    }
                  ],
                  "themes": [
                    {
                      "icon": "💧",
                      "title": "Gestion des Ressources Hydriques",
                      "items": ["Conservation des zones humides", "Gestion intégrée des bassins versants", "Technologies de traitement de l'eau", "Économie de l'eau"]
                    },
                    {
                      "icon": "🌱",
                      "title": "Biodiversité et Écosystèmes",
                      "items": ["Protection de la faune et flore", "Restauration écologique", "Services écosystémiques", "Corridors écologiques"]
                    },
                    {
                      "icon": "🌡️",
                      "title": "Changement Climatique",
                      "items": ["Adaptation aux changements climatiques", "Atténuation des effets", "Modélisation climatique", "Stratégies de résilience"]
                    },
                    {
                      "icon": "👨‍🌾",
                      "title": "Développement Durable",
                      "items": ["Agriculture durable", "Pêche responsable", "Écotourisme", "Économie verte"]
                    },
                    {
                      "icon": "🏛️",
                      "title": "Gouvernance et Politiques",
                      "items": ["Cadres législatifs", "Politiques publiques", "Participation communautaire", "Coopération internationale"]
                    },
                    {
                      "icon": "🔬",
                      "title": "Recherche et Innovation",
                      "items": ["Technologies de monitoring", "Innovation environnementale", "Transfert de connaissances", "Formation et éducation"]
                    }
                  ],
                  "programme": [],
                  "speakers": [],
                  "registrationModes": [
                    {
                      "icon": "🏢",
                      "title": "Participation Présentielle",
                      "description": "Accès complet au colloque avec hébergement et restauration inclus.",
                      "items": ["Accès à toutes les sessions", "Matériel de conférence", "Pause-café et déjeuners", "Certificat de participation"],
                      "price": "Gratuit"
                    },
                    {
                      "icon": "💻",
                      "title": "Participation en Ligne",
                      "description": "Suivi du colloque en direct via plateforme numérique.",
                      "items": ["Diffusion en direct", "Interaction avec les speakers", "Accès aux présentations", "Certificat numérique"],
                      "price": "Gratuit"
                    }
                  ],
                  "processSteps": [
                    {"number": 1, "title": "Formulaire d'Inscription", "description": "Remplir le formulaire en ligne avec vos informations personnelles et professionnelles."},
                    {"number": 2, "title": "Validation", "description": "Validation de votre inscription par l'équipe organisatrice sous 48h."},
                    {"number": 3, "title": "Confirmation", "description": "Réception de votre confirmation d'inscription avec les détails pratiques."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email", "value": "zonehumide@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Téléphone", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "Lieu", "value": "Centre International de Conférences, Nouakchott"},
                    {"icon": "fas fa-calendar", "label": "Date Limite", "value": "28 Février 2024"}
                  ]
                }
                """;
            
            Page zoneHumidePage = new Page();
            zoneHumidePage.setSlug("zone-humide");
            zoneHumidePage.setTitle("Zone Humide");
            zoneHumidePage.setHeroTitle("Zone Humide");
            zoneHumidePage.setHeroSubtitle("Colloque International sur les Zones Humides du Sahel");
            zoneHumidePage.setContent(defaultContent);
            zoneHumidePage.setPageType(Page.PageType.STRUCTURED);
            zoneHumidePage.setIsPublished(true);
            zoneHumidePage.setIsActive(true);
            
            pageRepository.save(zoneHumidePage);
            System.out.println("✓ Zone-humide page created successfully");
        } else {
            System.out.println("✓ Zone-humide page already exists");
        }
        
        // Create plateformes page if it doesn't exist
        if (!pageRepository.existsBySlug("plateformes")) {
            System.out.println("✓ Creating plateformes page");
            
            String defaultContent = """
                {
                  "heroTitle": "Plateformes",
                  "heroSubtitle": "Outils et technologies pour la recherche et l'innovation",
                  "introText": "L'ANRSI met à disposition des chercheurs et innovateurs mauritaniens des plateformes technologiques de pointe pour soutenir leurs projets de recherche et d'innovation.",
                  "plateformes": [
                    {
                      "icon": "🔬",
                      "title": "Plateforme d'Analyse Chimique",
                      "description": "Laboratoire équipé d'instruments de pointe pour l'analyse chimique, spectroscopie, et caractérisation des matériaux.",
                      "equipments": ["Spectromètre de masse", "Chromatographe en phase gazeuse", "Diffractomètre RX", "Microscope électronique"],
                      "services": ["Analyse de composition", "Caractérisation de matériaux", "Contrôle qualité", "Formation technique"],
                      "contact": "chimie@anrsi.mr"
                    },
                    {
                      "icon": "💻",
                      "title": "Plateforme Informatique et Calcul",
                      "description": "Infrastructure informatique haute performance pour le calcul scientifique, simulation numérique, et traitement de données.",
                      "equipments": ["Cluster de calcul haute performance", "Serveurs de stockage massif", "Réseau haute vitesse", "Logiciels scientifiques"],
                      "services": ["Calcul parallèle", "Simulation numérique", "Analyse de données", "Support technique"],
                      "contact": "informatique@anrsi.mr"
                    },
                    {
                      "icon": "🌱",
                      "title": "Plateforme Biotechnologique",
                      "description": "Laboratoire spécialisé en biotechnologie pour la recherche en biologie moléculaire, génétique, et biologie végétale.",
                      "equipments": ["PCR en temps réel", "Électrophorèse", "Microscopes de fluorescence", "Incubateurs contrôlés"],
                      "services": ["Analyse génétique", "Culture cellulaire", "Tests biologiques", "Consultation scientifique"],
                      "contact": "biotech@anrsi.mr"
                    },
                    {
                      "icon": "⚡",
                      "title": "Plateforme Énergétique",
                      "description": "Installation dédiée aux tests et développement de technologies énergétiques renouvelables et systèmes de stockage.",
                      "equipments": ["Simulateur solaire", "Banc d'essai éolien", "Système de stockage batterie", "Analyseur de puissance"],
                      "services": ["Tests de performance", "Optimisation de systèmes", "Études de faisabilité", "Formation technique"],
                      "contact": "energie@anrsi.mr"
                    },
                    {
                      "icon": "🌍",
                      "title": "Plateforme Environnementale",
                      "description": "Laboratoire d'analyse environnementale pour l'étude de la qualité de l'air, de l'eau, et des sols.",
                      "equipments": ["Analyseur de qualité d'air", "Spectromètre UV-Vis", "pH-mètres de précision", "Échantillonneurs automatiques"],
                      "services": ["Monitoring environnemental", "Analyse de pollution", "Études d'impact", "Consultation réglementaire"],
                      "contact": "environnement@anrsi.mr"
                    },
                    {
                      "icon": "🏭",
                      "title": "Plateforme de Prototypage",
                      "description": "Atelier de fabrication numérique pour le prototypage rapide, impression 3D, et développement de produits.",
                      "equipments": ["Imprimantes 3D industrielles", "Machine de découpe laser", "Fraiseuse CNC", "Scanner 3D"],
                      "services": ["Prototypage rapide", "Design assisté par ordinateur", "Fabrication sur mesure", "Formation technique"],
                      "contact": "prototypage@anrsi.mr"
                    }
                  ],
                  "accessModes": [
                    {
                      "icon": "🎓",
                      "title": "Accès Académique",
                      "description": "Tarifs préférentiels pour les universités et institutions de recherche publiques.",
                      "items": ["50% de réduction sur les tarifs standards", "Formation gratuite incluse", "Support technique prioritaire"]
                    },
                    {
                      "icon": "🏢",
                      "title": "Accès Industriel",
                      "description": "Services complets pour les entreprises et startups innovantes.",
                      "items": ["Tarifs compétitifs", "Confidentialité garantie", "Rapports détaillés"]
                    },
                    {
                      "icon": "🤝",
                      "title": "Partenariats",
                      "description": "Collaborations à long terme avec des institutions partenaires.",
                      "items": ["Accès privilégié", "Co-développement de projets", "Formation du personnel"]
                    }
                  ],
                  "bookingSteps": [
                    {"number": 1, "title": "Demande d'Accès", "description": "Soumission d'une demande détaillée avec description du projet et besoins techniques."},
                    {"number": 2, "title": "Évaluation Technique", "description": "Analyse de la faisabilité technique et évaluation des ressources nécessaires."},
                    {"number": 3, "title": "Formation", "description": "Formation obligatoire aux procédures de sécurité et d'utilisation des équipements."},
                    {"number": 4, "title": "Réservation", "description": "Planification des créneaux d'utilisation selon la disponibilité des équipements."},
                    {"number": 5, "title": "Utilisation", "description": "Accès aux plateformes avec support technique et supervision si nécessaire."}
                  ],
                  "bookingRequirements": [
                    "Projet de recherche ou d'innovation validé",
                    "Formation aux procédures de sécurité",
                    "Assurance responsabilité civile",
                    "Respect des règles d'utilisation",
                    "Signature d'un accord de confidentialité"
                  ],
                  "supportItems": [
                    {"icon": "📚", "title": "Formation Technique", "description": "Formation complète sur l'utilisation des équipements et les procédures de sécurité."},
                    {"icon": "🔧", "title": "Support Technique", "description": "Assistance technique pendant l'utilisation des plateformes et maintenance préventive."},
                    {"icon": "📊", "title": "Analyse de Données", "description": "Support dans l'analyse et l'interprétation des résultats obtenus sur les plateformes."},
                    {"icon": "🤝", "title": "Consultation Scientifique", "description": "Conseil scientifique pour l'optimisation des protocoles et l'amélioration des résultats."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email Général", "value": "plateformes@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Téléphone", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "Adresse", "value": "ANRSI, Nouakchott, Mauritanie"},
                    {"icon": "fas fa-clock", "label": "Horaires", "value": "Lundi - Vendredi : 8h00 - 18h00"}
                  ]
                }
                """;
            
            Page plateformesPage = new Page();
            plateformesPage.setSlug("plateformes");
            plateformesPage.setTitle("Plateformes");
            plateformesPage.setHeroTitle("Plateformes");
            plateformesPage.setHeroSubtitle("Outils et technologies pour la recherche et l'innovation");
            plateformesPage.setContent(defaultContent);
            plateformesPage.setPageType(Page.PageType.STRUCTURED);
            plateformesPage.setIsPublished(true);
            plateformesPage.setIsActive(true);
            
            pageRepository.save(plateformesPage);
            System.out.println("✓ Plateformes page created successfully");
        } else {
            System.out.println("✓ Plateformes page already exists");
        }
        
        // Create appels-candidatures page if it doesn't exist
        if (!pageRepository.existsBySlug("appels-candidatures")) {
            System.out.println("✓ Creating appels-candidatures page");
            
            String defaultContent = """
                {
                  "heroTitle": "Appels à Candidatures",
                  "heroSubtitle": "Opportunités de recherche et d'innovation en Mauritanie",
                  "introText": "L'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.",
                  "appels": [
                    {
                      "status": "active",
                      "title": "Appel à Projets de Recherche 2024",
                      "description": "Financement de projets de recherche dans les domaines prioritaires : agriculture durable, énergies renouvelables, technologies de l'information, et sciences de l'environnement.",
                      "details": [
                        {"label": "Budget :", "value": "Jusqu'à 50 millions MRO par projet"},
                        {"label": "Durée :", "value": "12-36 mois"},
                        {"label": "Date limite :", "value": "31 Mars 2024"},
                        {"label": "Éligibilité :", "value": "Institutions de recherche, universités, entreprises"}
                      ],
                      "actions": [
                        {"text": "Consulter l'appel", "url": "#", "type": "primary"},
                        {"text": "Télécharger le dossier", "url": "#", "type": "outline"}
                      ]
                    },
                    {
                      "status": "upcoming",
                      "title": "Programme Innovation Technologique",
                      "description": "Soutien aux projets d'innovation technologique et de transfert de technologie vers l'industrie mauritanienne.",
                      "details": [
                        {"label": "Budget :", "value": "Jusqu'à 30 millions MRO par projet"},
                        {"label": "Durée :", "value": "6-24 mois"},
                        {"label": "Ouverture :", "value": "Avril 2024"},
                        {"label": "Éligibilité :", "value": "Startups, PME, centres de recherche"}
                      ],
                      "actions": [
                        {"text": "S'inscrire aux alertes", "url": "#", "type": "outline"}
                      ]
                    },
                    {
                      "status": "closed",
                      "title": "Bourses de Doctorat 2023",
                      "description": "Programme de bourses pour soutenir les étudiants mauritaniens dans leurs études doctorales en sciences et technologies.",
                      "details": [
                        {"label": "Montant :", "value": "500,000 MRO/an pendant 3 ans"},
                        {"label": "Durée :", "value": "3 ans"},
                        {"label": "Date limite :", "value": "15 Décembre 2023"},
                        {"label": "Éligibilité :", "value": "Étudiants mauritaniens en master"}
                      ],
                      "actions": [
                        {"text": "Voir les résultats", "url": "#", "type": "outline"}
                      ]
                    }
                  ],
                  "categories": [
                    {
                      "icon": "🌱",
                      "title": "Agriculture & Sécurité Alimentaire",
                      "items": ["Techniques agricoles durables", "Amélioration des rendements", "Gestion des ressources hydriques", "Biotechnologies agricoles"]
                    },
                    {
                      "icon": "⚡",
                      "title": "Énergies Renouvelables",
                      "items": ["Énergie solaire et éolienne", "Stockage d'énergie", "Efficacité énergétique", "Électrification rurale"]
                    },
                    {
                      "icon": "💻",
                      "title": "Technologies de l'Information",
                      "items": ["Intelligence artificielle", "Internet des objets (IoT)", "Cybersécurité", "Applications mobiles"]
                    },
                    {
                      "icon": "🌍",
                      "title": "Environnement & Climat",
                      "items": ["Changement climatique", "Biodiversité", "Gestion des déchets", "Pollution et assainissement"]
                    },
                    {
                      "icon": "🏥",
                      "title": "Santé & Médecine",
                      "items": ["Médecine préventive", "Télémédecine", "Pharmacologie", "Santé publique"]
                    },
                    {
                      "icon": "🏭",
                      "title": "Industrie & Innovation",
                      "items": ["Processus industriels", "Matériaux avancés", "Robotique", "Transfert de technologie"]
                    }
                  ],
                  "processSteps": [
                    {"number": 1, "title": "Préparation du Dossier", "description": "Rédaction du projet de recherche, budget détaillé, équipe de recherche, et lettres de recommandation."},
                    {"number": 2, "title": "Soumission en Ligne", "description": "Dépôt du dossier complet via la plateforme de soumission électronique de l'ANRSI."},
                    {"number": 3, "title": "Évaluation Scientifique", "description": "Examen du projet par un comité d'experts indépendants selon des critères scientifiques rigoureux."},
                    {"number": 4, "title": "Entretien", "description": "Présentation orale du projet devant le comité d'évaluation pour les projets présélectionnés."},
                    {"number": 5, "title": "Décision et Financement", "description": "Notification des résultats et signature de la convention de financement pour les projets retenus."}
                  ],
                  "criteria": [
                    {"icon": "🔬", "title": "Excellence Scientifique", "description": "Qualité scientifique du projet, innovation, méthodologie rigoureuse, et faisabilité technique."},
                    {"icon": "👥", "title": "Équipe de Recherche", "description": "Compétences et expérience de l'équipe, complémentarité des profils, et leadership du projet."},
                    {"icon": "💡", "title": "Impact et Innovation", "description": "Potentiel d'innovation, impact attendu sur le développement national, et transfert de connaissances."},
                    {"icon": "💰", "title": "Gestion Financière", "description": "Budget réaliste et justifié, coût-efficacité, et capacité de gestion financière du porteur."}
                  ],
                  "supportServices": [
                    {"icon": "📋", "title": "Formation à la Gestion de Projet", "description": "Formation aux outils de gestion de projet et aux procédures administratives."},
                    {"icon": "🔍", "title": "Suivi et Évaluation", "description": "Accompagnement dans le suivi du projet et l'évaluation des résultats."},
                    {"icon": "🌐", "title": "Réseau et Partenariats", "description": "Facilitation des partenariats avec des institutions nationales et internationales."},
                    {"icon": "📢", "title": "Valorisation des Résultats", "description": "Support dans la publication et la valorisation des résultats de recherche."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email", "value": "appels@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Téléphone", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "Adresse", "value": "ANRSI, Nouakchott, Mauritanie"},
                    {"icon": "fas fa-clock", "label": "Horaires", "value": "Lundi - Vendredi : 8h00 - 16h00"}
                  ]
                }
                """;
            
            Page appelsCandidaturesPage = new Page();
            appelsCandidaturesPage.setSlug("appels-candidatures");
            appelsCandidaturesPage.setTitle("Appels à Candidatures");
            appelsCandidaturesPage.setHeroTitle("Appels à Candidatures");
            appelsCandidaturesPage.setHeroSubtitle("Opportunités de recherche et d'innovation en Mauritanie");
            appelsCandidaturesPage.setContent(defaultContent);
            appelsCandidaturesPage.setPageType(Page.PageType.STRUCTURED);
            appelsCandidaturesPage.setIsPublished(true);
            appelsCandidaturesPage.setIsActive(true);
            
            pageRepository.save(appelsCandidaturesPage);
            System.out.println("✓ Appels-candidatures page created successfully");
        } else {
            System.out.println("✓ Appels-candidatures page already exists");
        }
        
        // Create ai4agri page if it doesn't exist
        if (!pageRepository.existsBySlug("ai4agri")) {
            System.out.println("✓ Creating ai4agri page");
            
            String defaultContent = """
                {
                  "heroTitle": "AI 4 AGRI",
                  "heroSubtitle": "Intelligence Artificielle pour l'Agriculture de Précision",
                  "introText": "L'ANRSI organise des ateliers internationaux sur l'application de l'Intelligence Artificielle dans l'agriculture de précision pour la sécurité alimentaire.",
                  "workshops": [
                    {
                      "date": "13-15 Février 2024",
                      "title": "Ouverture de l'atelier international sur les applications de l'IA dans l'agriculture",
                      "description": "Atelier International sur \\"L'application de l'Intelligence Artificielle dans l'agriculture de précision pour la sécurité alimentaire\\"",
                      "detailsTitle": "Programme AI 4 AGRI 13-15 Février 2024",
                      "detailsItems": [
                        "Présentations sur l'IA agricole",
                        "Échantillons de présentations",
                        "Démonstrations pratiques",
                        "Réseautage et collaboration"
                      ]
                    },
                    {
                      "date": "Février 2024",
                      "title": "AI 4 Agri - Initiative Continue",
                      "description": "Programme continu de développement et d'application de l'IA dans le secteur agricole mauritanien.",
                      "detailsTitle": "Objectifs du Programme",
                      "detailsItems": [
                        "Moderniser l'agriculture grâce à l'IA",
                        "Améliorer la productivité agricole",
                        "Renforcer la sécurité alimentaire",
                        "Former les agriculteurs aux nouvelles technologies"
                      ]
                    }
                  ],
                  "benefits": [
                    {"icon": "🌱", "title": "Agriculture de Précision", "description": "Optimisation des ressources et augmentation des rendements grâce à l'analyse de données précises."},
                    {"icon": "📊", "title": "Analyse Prédictive", "description": "Prédiction des conditions météorologiques et des maladies pour une meilleure planification."},
                    {"icon": "🤖", "title": "Automatisation", "description": "Robotisation des tâches agricoles pour améliorer l'efficacité et réduire les coûts."},
                    {"icon": "🌍", "title": "Développement Durable", "description": "Promotion d'une agriculture respectueuse de l'environnement et durable."}
                  ],
                  "partnershipText": "L'ANRSI collabore avec des institutions internationales et des experts en IA pour développer des solutions innovantes pour l'agriculture mauritanienne.",
                  "partnershipHighlights": [
                    {"icon": "🔬", "title": "Recherche et Développement", "description": "Collaboration avec des centres de recherche internationaux spécialisés en IA agricole."},
                    {"icon": "🎓", "title": "Formation et Éducation", "description": "Programmes de formation pour les agriculteurs et les professionnels du secteur."},
                    {"icon": "🤝", "title": "Coopération Internationale", "description": "Échange d'expertise et de technologies avec des partenaires internationaux."}
                  ]
                }
                """;
            
            Page ai4agriPage = new Page();
            ai4agriPage.setSlug("ai4agri");
            ai4agriPage.setTitle("AI 4 AGRI");
            ai4agriPage.setHeroTitle("AI 4 AGRI");
            ai4agriPage.setHeroSubtitle("Intelligence Artificielle pour l'Agriculture de Précision");
            ai4agriPage.setContent(defaultContent);
            ai4agriPage.setPageType(Page.PageType.STRUCTURED);
            ai4agriPage.setIsPublished(true);
            ai4agriPage.setIsActive(true);
            
            pageRepository.save(ai4agriPage);
            System.out.println("✓ AI4AGRI page created successfully");
        } else {
            System.out.println("✓ AI4AGRI page already exists");
        }
        
        // Create expert-anrsi page if it doesn't exist
        if (!pageRepository.existsBySlug("expert-anrsi")) {
            System.out.println("✓ Creating expert-anrsi page");
            
            String defaultContent = """
                {
                  "heroTitle": "Expert à l'ANRSI",
                  "heroSubtitle": "Rejoignez notre réseau d'experts scientifiques et technologiques",
                  "introText": "L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) recrute des experts qualifiés pour évaluer les projets de recherche et contribuer au développement scientifique de la Mauritanie.",
                  "requirements": [
                    {
                      "icon": "🎓",
                      "title": "Formation Académique",
                      "items": [
                        "Doctorat dans un domaine scientifique ou technologique",
                        "Expérience significative en recherche",
                        "Publications scientifiques reconnues",
                        "Maîtrise du français et/ou de l'anglais"
                      ]
                    },
                    {
                      "icon": "🔬",
                      "title": "Expertise Technique",
                      "items": [
                        "Connaissance approfondie du domaine d'expertise",
                        "Expérience en évaluation de projets",
                        "Capacité d'analyse et de synthèse",
                        "Rigueur scientifique et éthique"
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "Engagement",
                      "items": [
                        "Disponibilité pour les évaluations",
                        "Engagement envers le développement scientifique",
                        "Respect des délais et procédures",
                        "Confidentialité et impartialité"
                      ]
                    }
                  ],
                  "domains": [
                    {"icon": "🔬", "title": "Sciences Exactes", "description": "Mathématiques, Physique, Chimie, Sciences de la Terre"},
                    {"icon": "🌱", "title": "Sciences de la Vie", "description": "Biologie, Agriculture, Médecine, Sciences Vétérinaires"},
                    {"icon": "💻", "title": "Technologies de l'Information", "description": "Informatique, Intelligence Artificielle, Télécommunications"},
                    {"icon": "⚡", "title": "Sciences de l'Ingénieur", "description": "Génie Civil, Mécanique, Électrique, Énergies Renouvelables"},
                    {"icon": "🌍", "title": "Sciences Sociales", "description": "Économie, Sociologie, Droit, Sciences Politiques"},
                    {"icon": "🌿", "title": "Sciences de l'Environnement", "description": "Écologie, Climatologie, Gestion des Ressources Naturelles"}
                  ],
                  "processSteps": [
                    {"number": 1, "title": "Candidature", "description": "Soumission du dossier de candidature avec CV détaillé, liste des publications et lettre de motivation."},
                    {"number": 2, "title": "Évaluation", "description": "Examen du dossier par un comité d'experts de l'ANRSI selon des critères objectifs."},
                    {"number": 3, "title": "Entretien", "description": "Entretien avec les candidats retenus pour évaluer leurs compétences et leur motivation."},
                    {"number": 4, "title": "Formation", "description": "Formation aux procédures d'évaluation de l'ANRSI et aux outils utilisés."},
                    {"number": 5, "title": "Intégration", "description": "Intégration dans le réseau d'experts et attribution des premières missions d'évaluation."}
                  ],
                  "benefits": [
                    {"icon": "💼", "title": "Rémunération", "description": "Rémunération attractive pour chaque mission d'évaluation selon l'expertise et la complexité."},
                    {"icon": "🌐", "title": "Réseau International", "description": "Intégration dans un réseau d'experts internationaux et opportunités de collaboration."},
                    {"icon": "📚", "title": "Formation Continue", "description": "Accès à des formations et séminaires pour maintenir et développer ses compétences."},
                    {"icon": "🏆", "title": "Reconnaissance", "description": "Reconnaissance officielle en tant qu'expert scientifique et contribution au développement national."}
                  ],
                  "applicationText": "Pour postuler en tant qu'expert ANRSI, veuillez envoyer votre dossier de candidature à :",
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email", "value": "expert@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Téléphone", "value": "+222 45 25 44 21"}
                  ],
                  "requiredDocuments": [
                    "CV détaillé avec liste des publications",
                    "Lettre de motivation",
                    "Copies des diplômes et certifications",
                    "Lettres de recommandation (optionnel)",
                    "Liste des projets de recherche dirigés"
                  ]
                }
                """;
            
            Page expertAnrsiPage = new Page();
            expertAnrsiPage.setSlug("expert-anrsi");
            expertAnrsiPage.setTitle("Expert à l'ANRSI");
            expertAnrsiPage.setHeroTitle("Expert à l'ANRSI");
            expertAnrsiPage.setHeroSubtitle("Rejoignez notre réseau d'experts scientifiques et technologiques");
            expertAnrsiPage.setContent(defaultContent);
            expertAnrsiPage.setPageType(Page.PageType.STRUCTURED);
            expertAnrsiPage.setIsPublished(true);
            expertAnrsiPage.setIsActive(true);
            
            pageRepository.save(expertAnrsiPage);
            System.out.println("✓ Expert-ANRSI page created successfully");
        } else {
            System.out.println("✓ Expert-ANRSI page already exists");
        }
        
        // Create cooperation page if it doesn't exist
        if (!pageRepository.existsBySlug("cooperation")) {
            System.out.println("✓ Creating cooperation page");
            
            String defaultContent = """
                {
                  "cooperationInfo": {
                    "title": "Coopération & Partenariats",
                    "description": "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.",
                    "benefits": [
                      "Renforcement des capacités de recherche",
                      "Échange d'expertise et de connaissances",
                      "Développement de projets innovants",
                      "Mise en réseau des chercheurs",
                      "Valorisation des résultats de recherche",
                      "Transfert de technologie"
                    ]
                  },
                  "partnerships": [
                    {
                      "id": "anrsa-senegal",
                      "title": "Convention de partenariat avec l'ANRSA Sénégal",
                      "description": "Partenariat stratégique avec l'Agence Nationale de la Recherche Scientifique Appliquée du Sénégal",
                      "type": "Partenariat",
                      "country": "Sénégal",
                      "flag": "🇸🇳",
                      "objectives": [
                        "Échange d'expertise en recherche scientifique",
                        "Collaboration sur des projets communs",
                        "Renforcement des capacités de recherche",
                        "Partage des ressources et infrastructures"
                      ],
                      "status": "Actif",
                      "icon": "fas fa-handshake",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "cnrst-maroc",
                      "title": "Convention de coopération avec le CNRST Maroc",
                      "description": "Coopération avec le Centre National de la Recherche Scientifique et Technique du Maroc",
                      "type": "Coopération",
                      "country": "Maroc",
                      "flag": "🇲🇦",
                      "objectives": [
                        "Développement de projets de recherche conjoints",
                        "Formation et échange de chercheurs",
                        "Valorisation des résultats de recherche",
                        "Innovation technologique"
                      ],
                      "status": "Actif",
                      "icon": "fas fa-microscope",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tunisie-dri",
                      "title": "Partenariat avec le DRI Tunisie",
                      "description": "Collaboration avec le Département de la Recherche Scientifique et de l'Innovation en Tunisie",
                      "type": "Partenariat",
                      "country": "Tunisie",
                      "flag": "🇹🇳",
                      "objectives": [
                        "Recherche appliquée et innovation",
                        "Transfert de technologie",
                        "Formation spécialisée",
                        "Développement de solutions innovantes"
                      ],
                      "status": "Actif",
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "iset-rosso",
                      "title": "Partenariat avec l'ISET Rosso",
                      "description": "Collaboration avec l'Institut Supérieur d'Enseignement Technologique de Rosso pour la production de légumes protégés",
                      "type": "Partenariat Local",
                      "country": "Mauritanie",
                      "flag": "🇲🇷",
                      "objectives": [
                        "Production de légumes protégés",
                        "Techniques agricoles innovantes",
                        "Formation technique spécialisée",
                        "Développement agricole local"
                      ],
                      "details": "Ce partenariat local vise à développer des techniques innovantes pour la production de légumes protégés, contribuant ainsi au développement agricole et à la sécurité alimentaire en Mauritanie.",
                      "status": "Actif",
                      "icon": "fas fa-seedling",
                      "color": "#126564"
                    }
                  ]
                }
                """;
            
            Page cooperationPage = new Page();
            cooperationPage.setSlug("cooperation");
            cooperationPage.setTitle("Coopération & Partenariats");
            cooperationPage.setHeroTitle("Coopération & Partenariats");
            cooperationPage.setHeroSubtitle("L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.");
            cooperationPage.setContent(defaultContent);
            cooperationPage.setPageType(Page.PageType.STRUCTURED);
            cooperationPage.setIsPublished(true);
            cooperationPage.setIsActive(true);
            
            pageRepository.save(cooperationPage);
            System.out.println("✓ Cooperation page created successfully");
        } else {
            System.out.println("✓ Cooperation page already exists");
        }
        
        // Create programmes page if it doesn't exist
        if (!pageRepository.existsBySlug("programmes")) {
            System.out.println("✓ Creating programmes page");
            
            String defaultContent = """
                {
                  "heroTitle": "Programmes",
                  "heroSubtitle": "Programmes de l'Agence",
                  "programmes": [
                    {
                      "id": "temkin",
                      "name": "Programme Temkin (Autonomisation)",
                      "description": "Programme d'autonomisation des structures de recherche",
                      "objectives": [
                        "Garantir le fonctionnement des structures de recherche (SR) reconnues",
                        "Encourager la culture de mutualisation des moyens",
                        "Briser l'isolement des chercheurs",
                        "Renforcer les capacités des Etablissements d'Enseignement Supérieur et de Recherche et des chercheurs en matière de pilotage et de gouvernance de la recherche"
                      ],
                      "icon": "fas fa-university",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "temeyouz",
                      "name": "Programme Temeyouz (Excellence)",
                      "description": "Programme d'excellence scientifique pour les jeunes chercheurs",
                      "objectives": [
                        "Soutenir l'excellence scientifique chez les jeunes chercheurs",
                        "Encourager les doctorants à consacrer leur plein temps à leurs thèses",
                        "Accroitre la production scientifique nationale et améliorer sa visibilité",
                        "Inciter et motiver l'encadrement et la production scientifique",
                        "Développer la créativité et l'esprit d'entreprise chez les jeunes chercheurs"
                      ],
                      "icon": "fas fa-graduation-cap",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tethmin",
                      "name": "Programme Tethmin (Valorisation)",
                      "description": "Programme de valorisation de la recherche scientifique",
                      "objectives": [
                        "Assurer la diffusion et le partage du savoir",
                        "Faire connaitre les thématiques de recherche des Structures de Recherche",
                        "Consolider le réseautage des chercheurs autour des thématiques prioritaires",
                        "Promouvoir la visibilité de la production scientifique nationale",
                        "Appuyer la mise en place des structures de valorisation de la recherche (incubateurs)",
                        "Protéger la propriété intellectuelle"
                      ],
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "temm",
                      "name": "Programme TEMM pour le développement local",
                      "description": "Programme de développement local et d'industrialisation",
                      "objectives": [
                        "Concevoir et financer des projets pilotes dans des domaines spécifiques de développement local",
                        "Démontrer et exploiter les grandes potentialités du pays",
                        "Encourager les investissements dans l'industrialisation et la recherche scientifique",
                        "Collaborer avec les partenaires techniques et scientifiques"
                      ],
                      "details": "Le programme TEMM parmi les programmes le plus récent adopté par le Conseil d'Administration de l'ANRSI. Ce programme conçoit et finance des projets pilotes dans des domaines spécifiques de développement local en vue de démontrer et exploiter les grandes potentialités du pays et d'encourager les investissements dans l'industrialisation et la recherche scientifique avec les partenaires techniques et scientifiques. Le premier projet de ce programme portera sur les cultures maraichères abritées, leur production, leur conservation et leur transformation, a été démarré effectivement dans le cadre de la convention signée le 04 novembre 2021 entre l'ANRSI et L'ISET.",
                      "icon": "fas fa-industry",
                      "color": "#126564"
                    }
                  ],
                  "ctaTitle": "Intéressé par nos programmes ?",
                  "ctaDescription": "Découvrez comment participer à nos programmes de recherche et d'innovation"
                }
                """;
            
            Page programmesPage = new Page();
            programmesPage.setSlug("programmes");
            programmesPage.setTitle("Programmes");
            programmesPage.setHeroTitle("Programmes");
            programmesPage.setHeroSubtitle("Programmes de l'Agence");
            programmesPage.setContent(defaultContent);
            programmesPage.setPageType(Page.PageType.STRUCTURED);
            programmesPage.setIsPublished(true);
            programmesPage.setIsActive(true);
            
            pageRepository.save(programmesPage);
            System.out.println("✓ Programmes page created successfully");
        } else {
            System.out.println("✓ Programmes page already exists");
        }
        
        // Create financement page if it doesn't exist
        if (!pageRepository.existsBySlug("financement")) {
            System.out.println("✓ Creating financement page");
            
            String defaultContent = """
                {
                  "heroTitle": "Financement",
                  "heroSubtitle": "L'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s'inscrivent dans le cadre des programmes de l'Agence qui sont annoncés annuellement.",
                  "process": [
                    {
                      "step": 1,
                      "title": "Identifier le programme",
                      "description": "Le candidat doit identifier le programme adapté à son activité",
                      "icon": "fas fa-search"
                    },
                    {
                      "step": 2,
                      "title": "Respecter les délais",
                      "description": "Respecter les délais et conditions de candidature publiés sur le site internet de l'Agence",
                      "icon": "fas fa-clock"
                    },
                    {
                      "step": 3,
                      "title": "Consulter la réglementation",
                      "description": "Consulter l'arrêté ministériel réglementant le financement pour plus de détails",
                      "icon": "fas fa-file-alt"
                    }
                  ],
                  "requirements": [
                    "Être une structure de recherche reconnue",
                    "Avoir un projet conforme aux programmes de l'ANRSI",
                    "Respecter les délais de candidature",
                    "Fournir tous les documents requis",
                    "Justifier de la pertinence scientifique du projet"
                  ],
                  "benefits": [
                    "Financement des activités de recherche scientifique",
                    "Soutien aux projets innovants",
                    "Accompagnement dans la réalisation des projets",
                    "Mise en réseau avec d'autres chercheurs",
                    "Valorisation des résultats de recherche"
                  ],
                  "ctaTitle": "Prêt à candidater ?",
                  "ctaDescription": "Consultez nos appels à candidatures et soumettez votre projet"
                }
                """;
            
            Page financementPage = new Page();
            financementPage.setSlug("financement");
            financementPage.setTitle("Financement");
            financementPage.setHeroTitle("Financement");
            financementPage.setHeroSubtitle("L'Agence finance de nombreuses activités liées à la recherche scientifique. Ces activités s'inscrivent dans le cadre des programmes de l'Agence qui sont annoncés annuellement.");
            financementPage.setContent(defaultContent);
            financementPage.setPageType(Page.PageType.STRUCTURED);
            financementPage.setIsPublished(true);
            financementPage.setIsActive(true);
            
            pageRepository.save(financementPage);
            System.out.println("✓ Financement page created successfully");
        } else {
            System.out.println("✓ Financement page already exists");
        }
        
        // Create videos page if it doesn't exist
        if (!pageRepository.existsBySlug("videos")) {
            System.out.println("✓ Creating videos page");
            
            String defaultContent = """
                {
                  "heroTitle": "Mediatique",
                  "heroSubtitle": "Get in touch with our research teams and support staff",
                  "videos": [
                    {
                      "title": "Présentation de l'Agence",
                      "url": "https://www.youtube.com/embed/EMgwHc1F5W8",
                      "type": "youtube"
                    },
                    {
                      "title": "Recherche Scientifique",
                      "url": "https://youtube.com/embed/bC2FLWuHTbI",
                      "type": "youtube"
                    },
                    {
                      "title": "Nouvelles Technologies",
                      "url": "https://youtube.com/embed/4PupAG-vJnk",
                      "type": "youtube"
                    },
                    {
                      "title": "Nouvelles Technologies",
                      "url": "https://youtube.com/embed/0yeNSWbl5MY",
                      "type": "youtube"
                    }
                  ],
                  "photos": [
                    {
                      "title": "",
                      "url": "assets/images/277154633_374993344636114_8242637262867242236_n_0.jpg.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/316106463_190420513522892_2157453747881448998_n_0.jpg.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/directeur.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/article1.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/directeurr.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/IMG_1702AAA.jpg.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/IMG_1738DDDDDDDDD.jpg.jpeg",
                      "type": "photo"
                    },
                    {
                      "title": "",
                      "url": "assets/images/chef.jpeg",
                      "type": "photo"
                    }
                  ]
                }
                """;
            
            Page videosPage = new Page();
            videosPage.setSlug("videos");
            videosPage.setTitle("Mediatique");
            videosPage.setHeroTitle("Mediatique");
            videosPage.setHeroSubtitle("Get in touch with our research teams and support staff");
            videosPage.setContent(defaultContent);
            videosPage.setPageType(Page.PageType.STRUCTURED);
            videosPage.setIsPublished(true);
            videosPage.setIsActive(true);
            
            pageRepository.save(videosPage);
            System.out.println("✓ Videos page created successfully");
        } else {
            System.out.println("✓ Videos page already exists");
        }
        
        // Create objectives page if it doesn't exist
        if (!pageRepository.existsBySlug("objectives")) {
            System.out.println("✓ Creating objectives page");
            
            String defaultContent = """
                {
                  "heroTitle": "Objectifs",
                  "heroSubtitle": "Les objectifs stratégiques de l'Agence Nationale de la Recherche Scientifique et de l'Innovation",
                  "sectionTitle": "Nos Objectifs",
                  "objectives": [
                    {
                      "number": 1,
                      "title": "Accroître la production scientifique Nationale",
                      "description": "L'ANRSI vise à stimuler et augmenter significativement la production scientifique nationale en soutenant les chercheurs et les institutions de recherche."
                    },
                    {
                      "number": 2,
                      "title": "Améliorer l'excellence et le rayonnement de la recherche scientifique en Mauritanie",
                      "description": "Nous nous engageons à promouvoir l'excellence dans la recherche scientifique et à renforcer le rayonnement international de la recherche mauritanienne."
                    },
                    {
                      "number": 3,
                      "title": "Améliorer l'impact de la recherche et l'innovation sur l'économie, la société et le développement durable",
                      "description": "L'ANRSI travaille à maximiser l'impact de la recherche et de l'innovation sur le développement économique, social et durable de la Mauritanie."
                    },
                    {
                      "number": 4,
                      "title": "Accroître la capacité d'innovation et de création de richesses de notre pays par et grâce à la recherche",
                      "description": "Nous visons à renforcer les capacités d'innovation nationales et à favoriser la création de richesses grâce aux résultats de la recherche scientifique."
                    }
                  ]
                }
                """;
            
            Page objectivesPage = new Page();
            objectivesPage.setSlug("objectives");
            objectivesPage.setTitle("Objectifs");
            objectivesPage.setHeroTitle("Objectifs");
            objectivesPage.setHeroSubtitle("Les objectifs stratégiques de l'Agence Nationale de la Recherche Scientifique et de l'Innovation");
            objectivesPage.setContent(defaultContent);
            objectivesPage.setPageType(Page.PageType.STRUCTURED);
            objectivesPage.setIsPublished(true);
            objectivesPage.setIsActive(true);
            
            pageRepository.save(objectivesPage);
            System.out.println("✓ Objectives page created successfully");
        } else {
            System.out.println("✓ Objectives page already exists");
        }
        
        // Create strategic-vision page if it doesn't exist
        if (!pageRepository.existsBySlug("strategic-vision")) {
            System.out.println("✓ Creating strategic-vision page");
            
            String defaultContent = """
                {
                  "heroTitle": "Vision Stratégique",
                  "heroSubtitle": "La vision et le message de l'Agence Nationale de la Recherche Scientifique et de l'Innovation",
                  "visionTitle": "Vision",
                  "visionText": "L'Agence aspire à renforcer les capacités et les compétences en recherche scientifique pour être un leader régional et une référence dans le domaine de la science et de la technologie.",
                  "messageTitle": "Le Message",
                  "messageText": "Soutenir l'innovation et promouvoir la recherche scientifique au service du développement du pays et de ses industries.",
                  "valuesTitle": "Nos Valeurs",
                  "values": [
                    {
                      "icon": "🔬",
                      "title": "Excellence Scientifique",
                      "description": "Promouvoir la qualité et l'excellence dans toutes nos initiatives de recherche"
                    },
                    {
                      "icon": "🤝",
                      "title": "Collaboration",
                      "description": "Encourager la coopération entre chercheurs, institutions et partenaires"
                    },
                    {
                      "icon": "🌱",
                      "title": "Innovation",
                      "description": "Favoriser l'innovation technologique et scientifique pour le développement"
                    },
                    {
                      "icon": "🎯",
                      "title": "Impact",
                      "description": "Maximiser l'impact de la recherche sur la société et l'économie"
                    }
                  ]
                }
                """;
            
            Page strategicVisionPage = new Page();
            strategicVisionPage.setSlug("strategic-vision");
            strategicVisionPage.setTitle("Vision Stratégique");
            strategicVisionPage.setHeroTitle("Vision Stratégique");
            strategicVisionPage.setHeroSubtitle("La vision et le message de l'Agence Nationale de la Recherche Scientifique et de l'Innovation");
            strategicVisionPage.setContent(defaultContent);
            strategicVisionPage.setPageType(Page.PageType.STRUCTURED);
            strategicVisionPage.setIsPublished(true);
            strategicVisionPage.setIsActive(true);
            
            pageRepository.save(strategicVisionPage);
            System.out.println("✓ Strategic Vision page created successfully");
        } else {
            System.out.println("✓ Strategic Vision page already exists");
        }
        
        // Create organigramme page if it doesn't exist
        if (!pageRepository.existsBySlug("organigramme")) {
            System.out.println("✓ Creating organigramme page");
            
            String defaultContent = """
                {
                  "heroTitle": "Organigramme",
                  "heroSubtitle": "Structure organisationnelle de l'Agence Nationale de la Recherche Scientifique et de l'Innovation",
                  "sectionTitle": "Structure Organisationnelle",
                  "introText": "L'ANRSI est structurée de manière hiérarchique pour assurer une gestion efficace de la recherche scientifique et de l'innovation en Mauritanie.",
                  "levels": [
                    {
                      "levelNumber": 1,
                      "positions": [
                        {
                          "icon": "👑",
                          "title": "Haut Conseil de la Recherche Scientifique et de l'Innovation",
                          "description": "Présidé par Son Excellence le Premier Ministre",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 2,
                      "positions": [
                        {
                          "icon": "👔",
                          "title": "Direction Générale",
                          "description": "Directeur Général de l'ANRSI",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 3,
                      "positions": [
                        {
                          "icon": "🔬",
                          "title": "Direction de la Recherche",
                          "description": "Gestion des programmes de recherche",
                          "isDirector": false
                        },
                        {
                          "icon": "💡",
                          "title": "Direction de l'Innovation",
                          "description": "Promotion de l'innovation technologique",
                          "isDirector": false
                        },
                        {
                          "icon": "💰",
                          "title": "Direction Financière",
                          "description": "Gestion des fonds et budgets",
                          "isDirector": false
                        }
                      ]
                    },
                    {
                      "levelNumber": 4,
                      "positions": [
                        {
                          "icon": "📊",
                          "title": "Service d'Évaluation",
                          "description": "Suivi et évaluation des projets",
                          "isDirector": false
                        },
                        {
                          "icon": "🤝",
                          "title": "Service de Coopération",
                          "description": "Partenariats internationaux",
                          "isDirector": false
                        },
                        {
                          "icon": "📋",
                          "title": "Service Administratif",
                          "description": "Gestion administrative",
                          "isDirector": false
                        },
                        {
                          "icon": "💻",
                          "title": "Service Informatique",
                          "description": "Support technique et numérique",
                          "isDirector": false
                        }
                      ]
                    }
                  ],
                  "responsibilitiesTitle": "Responsabilités Clés",
                  "responsibilities": [
                    {
                      "icon": "🎯",
                      "title": "Définition des Priorités",
                      "description": "Le Haut Conseil définit les priorités nationales de recherche et d'innovation"
                    },
                    {
                      "icon": "📝",
                      "title": "Appels à Projets",
                      "description": "L'ANRSI lance des appels à projets selon les priorités définies"
                    },
                    {
                      "icon": "💼",
                      "title": "Gestion des Fonds",
                      "description": "Allocation transparente et efficace des fonds de recherche"
                    },
                    {
                      "icon": "📈",
                      "title": "Suivi et Évaluation",
                      "description": "Monitoring continu des projets financés et évaluation de leur impact"
                    }
                  ]
                }
                """;
            
            Page organigrammePage = new Page();
            organigrammePage.setSlug("organigramme");
            organigrammePage.setTitle("Organigramme");
            organigrammePage.setHeroTitle("Organigramme");
            organigrammePage.setHeroSubtitle("Structure organisationnelle de l'Agence Nationale de la Recherche Scientifique et de l'Innovation");
            organigrammePage.setContent(defaultContent);
            organigrammePage.setPageType(Page.PageType.STRUCTURED);
            organigrammePage.setIsPublished(true);
            organigrammePage.setIsActive(true);
            
            pageRepository.save(organigrammePage);
            System.out.println("✓ Organigramme page created successfully");
        } else {
            System.out.println("✓ Organigramme page already exists");
        }
        
        // Create conseil-administration page if it doesn't exist
        if (!pageRepository.existsBySlug("conseil-administration")) {
            System.out.println("✓ Creating conseil-administration page");
            
            String defaultContent = """
                {
                  "heroTitle": "Conseil d'Administration",
                  "heroSubtitle": "Composition du Conseil d'Administration de l'Agence Nationale de la Recherche Scientifique et de l'Innovation",
                  "sectionTitle": "Membres du Conseil d'Administration",
                  "introText": "Le Conseil d'Administration de l'ANRSI est composé de représentants de différentes institutions et secteurs, assurant une gouvernance équilibrée et représentative.",
                  "boardMembers": [
                    {
                      "name": "Mohamed Sidiya Khabaz",
                      "position": "Président du CA"
                    },
                    {
                      "name": "AHMED SALEM OULD MOHAMED VADEL",
                      "position": "Représentant de la Présidence de la République"
                    },
                    {
                      "name": "HOUDA BABAH",
                      "position": "Représentante du Premier Ministère"
                    },
                    {
                      "name": "SAAD BOUH OULD SIDATY",
                      "position": "Représentant du Ministère des Finances"
                    },
                    {
                      "name": "Mohamed Yahya Dah",
                      "position": "Représentant du Ministère de l'Enseignement Supérieur, de la Recherche Scientifique et de l'Innovation"
                    },
                    {
                      "name": "WAGUE OUSMANE",
                      "position": "Enseignant-chercheur"
                    },
                    {
                      "name": "SALEM MOHAMED EL MOCTAR ABEIDNA",
                      "position": "Enseignant-chercheur"
                    },
                    {
                      "name": "HANCHI MOHAMED SALEH",
                      "position": "Représentant de l'Union Nationale du Patronat Mauritanien"
                    },
                    {
                      "name": "MOHAMED EL MOCTAR YAHYA MOHAMEDINE",
                      "position": "Représentant de l'Union Nationale du Patronat Mauritanien"
                    },
                    {
                      "name": "WANE ABDOUL AZIZ",
                      "position": "Représentant de la Chambre de Commerce, d'Industrie et d'Agriculture de Mauritanie"
                    },
                    {
                      "name": "AHMEDOU HAOUBA",
                      "position": "Enseignant-chercheur"
                    },
                    {
                      "name": "Mohamedou Mbaba",
                      "position": "Représentant du Ministère des Affaires Economiques et de la Promotion des secteurs Productifs"
                    }
                  ],
                  "updateDate": "11 Novembre 2021"
                }
                """;
            
            Page conseilAdministrationPage = new Page();
            conseilAdministrationPage.setSlug("conseil-administration");
            conseilAdministrationPage.setTitle("Conseil d'Administration");
            conseilAdministrationPage.setHeroTitle("Conseil d'Administration");
            conseilAdministrationPage.setHeroSubtitle("Composition du Conseil d'Administration de l'Agence Nationale de la Recherche Scientifique et de l'Innovation");
            conseilAdministrationPage.setContent(defaultContent);
            conseilAdministrationPage.setPageType(Page.PageType.STRUCTURED);
            conseilAdministrationPage.setIsPublished(true);
            conseilAdministrationPage.setIsActive(true);
            
            pageRepository.save(conseilAdministrationPage);
            System.out.println("✓ Conseil d'Administration page created successfully");
        } else {
            System.out.println("✓ Conseil d'Administration page already exists");
        }
        
        // Create priorites-recherche-2026 page if it doesn't exist
        if (!pageRepository.existsBySlug("priorites-recherche-2026")) {
            System.out.println("✓ Creating priorites-recherche-2026 page");
            
            String defaultContent = """
                {
                  "heroTitle": "LES PRIORITÉS DE LA RECHERCHE À L'HORIZON 2026",
                  "heroSubtitle": "L'ANRSI définit les priorités de la recherche scientifique et de l'innovation pour le développement national",
                  "introParagraphs": [
                    "Se basant sur la stratégie nationale de la recherche scientifique et de l'innovation adoptée par le Gouvernement, l'Agence nationale de la recherche scientifique et de l'innovation publie les détails des sept axes de ladite stratégie.",
                    "Ces axes sont répartis suivant les besoins de développement et en réponse aux défis actuels, pour couvrir des domaines variés allant de l'autosuffisance alimentaire à la digitalisation et les défis émergents avec l'explosion de l'intelligence artificielle, en passant par la santé, les industries extractives.",
                    "Les recherches humaines et sociales occupent une place de choix dans ces axes, la stratégie leur ayant consacré deux axes à travers lesquels il est possible d'œuvrer pour \\"la valorisation des savoirs autochtones ancestraux afin d'affronter les enjeux sociétaux, de combattre la vulnérabilité, les disparités sociales et l'exclusion et de consolider l'unité nationale\\"."
                  ],
                  "sectionTitle": "Les Sept Axes Stratégiques",
                  "researchPriorities": [
                    {
                      "id": 1,
                      "title": "Autosuffisance Alimentaire",
                      "description": "Développement de stratégies pour assurer la sécurité alimentaire nationale et réduire la dépendance aux importations.",
                      "icon": "fas fa-seedling"
                    },
                    {
                      "id": 2,
                      "title": "Digitalisation et Intelligence Artificielle",
                      "description": "Intégration des technologies numériques et de l'IA pour moderniser les secteurs économiques et améliorer l'efficacité.",
                      "icon": "fas fa-robot"
                    },
                    {
                      "id": 3,
                      "title": "Santé et Bien-être",
                      "description": "Amélioration des systèmes de santé, prévention des maladies et promotion du bien-être de la population.",
                      "icon": "fas fa-heartbeat"
                    },
                    {
                      "id": 4,
                      "title": "Industries Extractives",
                      "description": "Optimisation de l'exploitation des ressources naturelles de manière durable et responsable.",
                      "icon": "fas fa-mountain"
                    },
                    {
                      "id": 5,
                      "title": "Recherches Humaines et Sociales I",
                      "description": "Valorisation des savoirs autochtones ancestraux pour affronter les enjeux sociétaux contemporains.",
                      "icon": "fas fa-users"
                    },
                    {
                      "id": 6,
                      "title": "Recherches Humaines et Sociales II",
                      "description": "Combattre la vulnérabilité, les disparités sociales et l'exclusion pour consolider l'unité nationale.",
                      "icon": "fas fa-hands-helping"
                    },
                    {
                      "id": 7,
                      "title": "Développement Durable",
                      "description": "Promotion de pratiques respectueuses de l'environnement et du développement durable à long terme.",
                      "icon": "fas fa-leaf"
                    }
                  ],
                  "publicationDate": "18 Janvier 2023"
                }
                """;
            
            Page prioritesRecherche2026Page = new Page();
            prioritesRecherche2026Page.setSlug("priorites-recherche-2026");
            prioritesRecherche2026Page.setTitle("Priorités de la Recherche 2026");
            prioritesRecherche2026Page.setHeroTitle("LES PRIORITÉS DE LA RECHERCHE À L'HORIZON 2026");
            prioritesRecherche2026Page.setHeroSubtitle("L'ANRSI définit les priorités de la recherche scientifique et de l'innovation pour le développement national");
            prioritesRecherche2026Page.setContent(defaultContent);
            prioritesRecherche2026Page.setPageType(Page.PageType.STRUCTURED);
            prioritesRecherche2026Page.setIsPublished(true);
            prioritesRecherche2026Page.setIsActive(true);
            
            pageRepository.save(prioritesRecherche2026Page);
            System.out.println("✓ Priorités de la Recherche 2026 page created successfully");
        } else {
            System.out.println("✓ Priorités de la Recherche 2026 page already exists");
        }
        
        System.out.println("=== DataInitializer: Page initialization complete ===");
    }
}

