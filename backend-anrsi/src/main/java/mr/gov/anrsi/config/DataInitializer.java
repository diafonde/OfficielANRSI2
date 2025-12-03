package mr.gov.anrsi.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import mr.gov.anrsi.entity.Language;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.entity.PageTranslation;
import mr.gov.anrsi.entity.User;
import mr.gov.anrsi.repository.PageRepository;
import mr.gov.anrsi.repository.PageTranslationRepository;
import mr.gov.anrsi.repository.UserRepository;

@Component
@ConditionalOnProperty(name = "spring.datasource.url")
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PageRepository pageRepository;
    
    @Autowired
    private PageTranslationRepository pageTranslationRepository;
    
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
        
        Page agenceMediasPage = null;
        Page zoneHumidePage = null;
        Page plateformesPage = null;
        Page appelsCandidaturesPage = null;
        Page ai4agriPage = null;
        Page expertAnrsiPage = null;
        Page cooperationPage = null;
        Page programmesPage = null;
        Page financementPage = null;
        Page videosPage = null;
        Page objectivesPage = null;
        Page strategicVisionPage = null;
        Page organigrammePage = null;
        Page conseilAdministrationPage = null;
        Page prioritesRecherche2026Page = null;
        
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
            
            agenceMediasPage = new Page();
            agenceMediasPage.setSlug("agence-medias");
            agenceMediasPage.setPageType(Page.PageType.STRUCTURED);
            agenceMediasPage.setIsPublished(true);
            agenceMediasPage.setIsActive(true);
            
            agenceMediasPage = pageRepository.save(agenceMediasPage);
            System.out.println("✓ Agence-medias page created successfully");
        } else {
            agenceMediasPage = pageRepository.findBySlug("agence-medias").orElse(null);
            System.out.println("✓ Agence-medias page already exists");
        }
        
        // Create translations for agence-medias page
        if (agenceMediasPage != null) {
            // French translation
            String contentFR = """
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
            
            // Arabic translation
            String contentAR = """
                {
                  "heroTitle": "الوكالة الوطنية للبحث العلمي والابتكار في الإعلام",
                  "heroSubtitle": "الأخبار والمنشورات والظهور الإعلامي",
                  "introText": "تحافظ الوكالة الوطنية للبحث العلمي والابتكار (ANRSI) على حضور إعلامي فاعل لتعزيز البحث العلمي والابتكار التكنولوجي ومبادرات التنمية في موريتانيا.",
                  "mediaOverview": [
                    {
                      "icon": "📺",
                      "title": "الإعلام السمعي البصري",
                      "description": "مقابلات وتقارير وبرامج خاصة على محطات التلفزيون والإذاعة الوطنية والدولية.",
                      "items": ["TVM (التلفزيون الموريتاني)", "إذاعة موريتانيا", "القنوات الدولية", "بودكاست علمي"]
                    },
                    {
                      "icon": "📰",
                      "title": "الإعلام المطبوع",
                      "description": "مقالات ومقالات رأي ومنشورات في الصحف الوطنية والدولية.",
                      "items": ["Le Calame", "Horizons", "Mauritanie News", "Scientific Journals"]
                    },
                    {
                      "icon": "🌐",
                      "title": "الإعلام الرقمي",
                      "description": "حضور فاعل على المنصات الرقمية وشبكات التواصل الاجتماعي.",
                      "items": ["الموقع الإلكتروني الرسمي", "شبكات التواصل الاجتماعي", "النشرات الإخبارية", "الندوات الإلكترونية"]
                    }
                  ],
                  "recentCoverage": [],
                  "mediaTypes": [
                    {
                      "icon": "🎤",
                      "title": "مقابلات وتصريحات",
                      "description": "مقابلات حصرية مع المدير العام وخبراء الوكالة الوطنية للبحوث العلمية والتكنولوجية حول القضايا العلمية والتكنولوجية.",
                      "items": ["مقابلات تلفزيونية", "تصريحات رسمية", "الإيجازات الصحفية", "المؤتمرات الصحفية"]
                    },                                    
                    {
                      "icon": "📝",
                      "title": "مقالات ومنشورات",
                      "description": "مقالات معمقة، ومقالات رأي، ومنشورات في وسائل الإعلام الوطنية والدولية.",
                      "items": ["مقالات رأي", "منتديات مفتوحة", "منشورات علمية", "بيانات صحفية"]
                    },
                    {
                      "icon": "🎥",
                      "title": "محتوى الوسائط المتعددة",
                      "description": "إنتاج محتوى مرئي ومسموع وتفاعلي للمنصات الرقمية.",
                      "items": ["فيديوهات تعليمية", "بودكاست علمي", "ندوات إلكترونية", "محتوى تفاعلي"]
                    }
                  ],
                  "pressReleases": [],
                 
                  "socialMedia": [
                    {
                      "icon": "📘",
                      "name": "فيسبوك",
                      "handle": "@ANRSI.Mauritanie",
                      "link": "#"
                    },
                    {
                      "icon": "🐦",
                      "name": "تويتر",
                      "handle": "@ANRSI_MR",
                      "link": "#"
                    },
                    {
                      "icon": "💼",
                      "name": "لينكد إن",
                      "handle": "ANRSI Mauritanie",
                      "link": "#"
                    },
                    {
                      "icon": "📺",
                      "name": "يوتيوب",
                      "handle": "ANRSI Mauritanie",
                      "link": "#"
                    }
                  ],
                  "contactInfo": [
                    {
                      "icon": "fas fa-envelope",
                      "label": "البريد الإلكتروني للصحافة",
                      "value": "presse@anrsi.mr"
                    },
                    {
                      "icon": "fas fa-phone",
                      "label": "هاتف",
                      "value": "+222 45 25 44 21"
                    },
                    {
                      "icon": "fas fa-user",
                      "label": "مسؤولة الصحافة",
                      "value": "الأستاذة فاطمة منت أحمد"
                    },
                    {
                      "icon": "fas fa-clock",
                      "label": "ساعات العمل",
                      "value": "من الإثنين إلى الجمعة: 8:00 صباحًا - 4:00 مساءً"
                    }
                  ]
                }
                """;
            
            // English translation
            String contentEN = """
                {
                  "heroTitle": "ANRSI in the Media",
                  "heroSubtitle": "News, publications and media visibility",
                  "introText": "The National Agency for Scientific Research and Innovation (ANRSI) maintains an active presence in the media to promote scientific research, technological innovation, and development initiatives in Mauritania.",
                  "mediaOverview": [
                    {
                      "icon": "📺",
                      "title": "Audiovisual Media",
                      "description": "Interviews, reports and special programs on national and international television and radio channels.",
                      "items": ["TVM (Mauritania Television)", "Radio Mauritania", "International channels", "Scientific podcasts"]
                    },
                    {
                      "icon": "📰",
                      "title": "Print Media",
                      "description": "Articles, editorials and publications in national and international newspapers.",
                      "items": ["Le Calame", "Horizons", "Mauritania News", "Scientific journals"]
                    },
                    {
                      "icon": "🌐",
                      "title": "Digital Media",
                      "description": "Active presence on digital platforms and social networks.",
                      "items": ["Official website", "Social networks", "Newsletters", "Webinars"]
                    }
                  ],
                  "recentCoverage": [],
                  "mediaTypes": [
                    {
                      "icon": "🎤",
                      "title": "Interviews and Statements",
                      "description": "Exclusive interviews with the Director General and ANRSI experts on scientific and technological issues.",
                      "items": ["Television interviews", "Official statements", "Press briefings", "Press conferences"]
                    },                                    
                    {
                      "icon": "📝",
                      "title": "Articles and Publications",
                      "description": "In-depth articles, editorials and publications in national and international media.",
                      "items": ["Opinion articles", "Free editorials", "Scientific publications", "Press releases"]
                    },
                    {
                      "icon": "🎥",
                      "title": "Multimedia Content",
                      "description": "Production of video, audio and interactive content for digital platforms.",
                      "items": ["Educational videos", "Scientific podcasts", "Webinars", "Interactive content"]
                    }
                  ],
                  "pressReleases": [],
                 
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
                      "label": "Press Email",
                      "value": "presse@anrsi.mr"
                    },
                    {
                      "icon": "fas fa-phone",
                      "label": "Phone",
                      "value": "+222 45 25 44 21"
                    },
                    {
                      "icon": "fas fa-user",
                      "label": "Press Officer",
                      "value": "Mrs. Fatima Mint Ahmed"
                    },
                    {
                      "icon": "fas fa-clock",
                      "label": "Hours",
                      "value": "Monday - Friday : 8:00 AM - 4:00 PM"
                    }
                  ]
                }
                """;
            
            createOrUpdateTranslation(agenceMediasPage, Language.FR, 
                "ANRSI dans les Médias", 
                "ANRSI dans les Médias", 
                "Actualités, publications et visibilité médiatique",
                null, // sectionTitle
                "L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) maintient une présence active dans les médias pour promouvoir la recherche scientifique, l'innovation technologique, et les initiatives de développement en Mauritanie.", // introText
                null, // description
                null, // content (HTML)
                contentFR); // extra (JSONB)
            createOrUpdateTranslation(agenceMediasPage, Language.AR, 
                "الوكالة الوطنية للبحث العلمي والابتكار في الإعلام", 
                "الوكالة الوطنية للبحث العلمي والابتكار في الإعلام", 
                "الأخبار والمنشورات والظهور الإعلامي",
                null, // sectionTitle
                "تحافظ الوكالة الوطنية للبحث العلمي والابتكار (ANRSI) على وجود نشط في وسائل الإعلام لتعزيز البحث العلمي والابتكار التكنولوجي ومبادرات التنمية في موريتانيا.", // introText
                null, // description
                null, // content (HTML)
                contentAR); // extra (JSONB)
            createOrUpdateTranslation(agenceMediasPage, Language.EN, 
                "ANRSI in the Media", 
                "ANRSI in the Media", 
                "News, publications and media visibility",
                null, // sectionTitle
                "The National Agency for Scientific Research and Innovation (ANRSI) maintains an active presence in the media to promote scientific research, technological innovation, and development initiatives in Mauritania.", // introText
                null, // description
                null, // content (HTML)
                contentEN); // extra (JSONB)
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
            
            zoneHumidePage = new Page();
            zoneHumidePage.setSlug("zone-humide");
            zoneHumidePage.setPageType(Page.PageType.STRUCTURED);
            zoneHumidePage.setIsPublished(true);
            zoneHumidePage.setIsActive(true);
            
            zoneHumidePage = pageRepository.save(zoneHumidePage);
            System.out.println("✓ Zone-humide page created successfully");
        } else {
            zoneHumidePage = pageRepository.findBySlug("zone-humide").orElse(null);
            System.out.println("✓ Zone-humide page already exists");
        }
        
        // Create translations for zone-humide page
        if (zoneHumidePage != null) {
            String contentFR = """
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
            String contentAR = """
                {
                  "heroTitle": "المناطق الرطبة",
                  "heroSubtitle": "المؤتمر الدولي حول المناطق الرطبة في الساحل",
                  "introText": "تنظم الوكالة الوطنية مؤتمراً دولياً رئيسياً حول الحفاظ على المناطق الرطبة في الساحل وإدارتها بشكل مستدام، يجمع الخبراء والباحثين وصناع القرار لتبادل الآراء حول القضايا البيئية والمناخية.",
                  "overview": [
                    {
                      "icon": "📅",
                      "title": "التواريخ والمكان",
                      "content": [
                        {"label": "التاريخ :", "value": "15-17 مارس 2024"},
                        {"label": "المكان :", "value": "المركز الدولي للمؤتمرات، نواكشوط"},
                        {"label": "الشكل :", "value": "حضوري وعبر الإنترنت"}
                      ]
                    },
                    {
                      "icon": "👥",
                      "title": "المشاركون المتوقعون",
                      "content": [
                        {"label": "خبراء دوليون :", "value": "أكثر من 50 متخصص"},
                        {"label": "باحثون :", "value": "أكثر من 100 عالم"},
                        {"label": "صناع القرار :", "value": "وزراء ومسؤولون"},
                        {"label": "المنظمات غير الحكومية ومنظمات المجتمع المدني :", "value": "منظمات المجتمع المدني"}
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "الدول المشاركة",
                      "content": [
                        {"label": "غرب أفريقيا :", "value": "السنغال، مالي، النيجر، بوركينا فاسو"},
                        {"label": "شمال أفريقيا :", "value": "المغرب، الجزائر، تونس"},
                        {"label": "أوروبا :", "value": "فرنسا، بلجيكا، إسبانيا"},
                        {"label": "المنظمات :", "value": "الاتحاد الدولي لحفظ الطبيعة، رامسار، برنامج الأمم المتحدة للبيئة"}
                      ]
                    }
                  ],
                  "themes": [
                    {
                      "icon": "💧",
                      "title": "إدارة الموارد المائية",
                      "items": ["الحفاظ على المناطق الرطبة", "الإدارة المتكاملة لأحواض الأنهار", "تقنيات معالجة المياه", "اقتصاد المياه"]
                    },
                    {
                      "icon": "🌱",
                      "title": "التنوع البيولوجي والنظم الإيكولوجية",
                      "items": ["حماية الحيوانات والنباتات", "الاستعادة البيئية", "الخدمات الإيكولوجية", "الممرات البيئية"]
                    },
                    {
                      "icon": "🌡️",
                      "title": "التغير المناخي",
                      "items": ["التكيف مع التغيرات المناخية", "التخفيف من الآثار", "النمذجة المناخية", "استراتيجيات المرونة"]
                    },
                    {
                      "icon": "👨‍🌾",
                      "title": "التنمية المستدامة",
                      "items": ["الزراعة المستدامة", "الصيد المسؤول", "السياحة البيئية", "الاقتصاد الأخضر"]
                    },
                    {
                      "icon": "🏛️",
                      "title": "الحوكمة والسياسات",
                      "items": ["الأطر القانونية", "السياسات العامة", "المشاركة المجتمعية", "التعاون الدولي"]
                    },
                    {
                      "icon": "🔬",
                      "title": "البحث والابتكار",
                      "items": ["تقنيات المراقبة", "الابتكار البيئي", "نقل المعرفة", "التدريب والتعليم"]
                    }
                  ],
                  "programme": [],
                  "speakers": [],
                  "registrationModes": [
                    {
                      "icon": "🏢",
                      "title": "المشاركة الحضورية",
                      "description": "وصول كامل إلى المؤتمر مع الإقامة والوجبات المدرجة.",
                      "items": ["الوصول إلى جميع الجلسات", "مواد المؤتمر", "استراحات القهوة والغداء", "شهادة المشاركة"],
                      "price": "مجاني"
                    },
                    {
                      "icon": "💻",
                      "title": "المشاركة عبر الإنترنت",
                      "description": "متابعة المؤتمر مباشرة عبر المنصة الرقمية.",
                      "items": ["البث المباشر", "التفاعل مع المتحدثين", "الوصول إلى العروض التقديمية", "شهادة رقمية"],
                      "price": "مجاني"
                    }
                  ],
                  "processSteps": [
                    {"number": 1, "title": "نموذج التسجيل", "description": "ملء النموذج عبر الإنترنت بمعلوماتك الشخصية والمهنية."},
                    {"number": 2, "title": "التحقق", "description": "التحقق من تسجيلك من قبل الفريق المنظم خلال 48 ساعة."},
                    {"number": 3, "title": "التأكيد", "description": "استلام تأكيد تسجيلك مع التفاصيل العملية."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "البريد الإلكتروني", "value": "zonehumide@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "الهاتف", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "المكان", "value": "المركز الدولي للمؤتمرات، نواكشوط"},
                    {"icon": "fas fa-calendar", "label": "الموعد النهائي", "value": "28 فبراير 2024"}
                  ]
                }
                """;
            String contentEN = """
                {
                  "heroTitle": "Wetlands",
                  "heroSubtitle": "International Conference on Sahel Wetlands",
                  "introText": "ANRSI organizes a major international conference on the preservation and sustainable management of Sahel wetlands, bringing together experts, researchers and decision-makers to exchange views on environmental and climate issues.",
                  "overview": [
                    {
                      "icon": "📅",
                      "title": "Dates and Venue",
                      "content": [
                        {"label": "Date :", "value": "March 15-17, 2024"},
                        {"label": "Venue :", "value": "International Conference Center, Nouakchott"},
                        {"label": "Format :", "value": "In-person and online"}
                      ]
                    },
                    {
                      "icon": "👥",
                      "title": "Expected Participants",
                      "content": [
                        {"label": "International experts :", "value": "50+ specialists"},
                        {"label": "Researchers :", "value": "100+ scientists"},
                        {"label": "Decision-makers :", "value": "Ministers and officials"},
                        {"label": "NGOs and CSOs :", "value": "Civil society organizations"}
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "Participating Countries",
                      "content": [
                        {"label": "West Africa :", "value": "Senegal, Mali, Niger, Burkina Faso"},
                        {"label": "North Africa :", "value": "Morocco, Algeria, Tunisia"},
                        {"label": "Europe :", "value": "France, Belgium, Spain"},
                        {"label": "Organizations :", "value": "IUCN, Ramsar, UNEP"}
                      ]
                    }
                  ],
                  "themes": [
                    {
                      "icon": "💧",
                      "title": "Water Resources Management",
                      "items": ["Wetland conservation", "Integrated watershed management", "Water treatment technologies", "Water economics"]
                    },
                    {
                      "icon": "🌱",
                      "title": "Biodiversity and Ecosystems",
                      "items": ["Wildlife and flora protection", "Ecological restoration", "Ecosystem services", "Ecological corridors"]
                    },
                    {
                      "icon": "🌡️",
                      "title": "Climate Change",
                      "items": ["Adaptation to climate change", "Mitigation of effects", "Climate modeling", "Resilience strategies"]
                    },
                    {
                      "icon": "👨‍🌾",
                      "title": "Sustainable Development",
                      "items": ["Sustainable agriculture", "Responsible fishing", "Ecotourism", "Green economy"]
                    },
                    {
                      "icon": "🏛️",
                      "title": "Governance and Policies",
                      "items": ["Legislative frameworks", "Public policies", "Community participation", "International cooperation"]
                    },
                    {
                      "icon": "🔬",
                      "title": "Research and Innovation",
                      "items": ["Monitoring technologies", "Environmental innovation", "Knowledge transfer", "Training and education"]
                    }
                  ],
                  "programme": [],
                  "speakers": [],
                  "registrationModes": [
                    {
                      "icon": "🏢",
                      "title": "In-Person Participation",
                      "description": "Full access to the conference with accommodation and meals included.",
                      "items": ["Access to all sessions", "Conference materials", "Coffee breaks and lunches", "Participation certificate"],
                      "price": "Free"
                    },
                    {
                      "icon": "💻",
                      "title": "Online Participation",
                      "description": "Follow the conference live via digital platform.",
                      "items": ["Live broadcast", "Interaction with speakers", "Access to presentations", "Digital certificate"],
                      "price": "Free"
                    }
                  ],
                  "processSteps": [
                    {"number": 1, "title": "Registration Form", "description": "Fill out the online form with your personal and professional information."},
                    {"number": 2, "title": "Validation", "description": "Validation of your registration by the organizing team within 48 hours."},
                    {"number": 3, "title": "Confirmation", "description": "Receive your registration confirmation with practical details."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email", "value": "zonehumide@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Phone", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "Venue", "value": "International Conference Center, Nouakchott"},
                    {"icon": "fas fa-calendar", "label": "Deadline", "value": "February 28, 2024"}
                  ]
                }
                """;
            
            createOrUpdateTranslation(zoneHumidePage, Language.FR, 
                "Zone Humide", "Zone Humide", 
                "Colloque International sur les Zones Humides du Sahel", contentFR);
            createOrUpdateTranslation(zoneHumidePage, Language.AR, 
                "المناطق الرطبة", "المناطق الرطبة", 
                "المؤتمر الدولي حول المناطق الرطبة في الساحل", contentAR);
            createOrUpdateTranslation(zoneHumidePage, Language.EN, 
                "Wetlands", "Wetlands", 
                "International Conference on Sahel Wetlands", contentEN);
        }
        
        // Create plateformes page if it doesn't exist
        String defaultContentPlateformes = """
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
        
        if (!pageRepository.existsBySlug("plateformes")) {
            System.out.println("✓ Creating plateformes page");
            
            plateformesPage = new Page();
            plateformesPage.setSlug("plateformes");
            plateformesPage.setPageType(Page.PageType.STRUCTURED);
            plateformesPage.setIsPublished(true);
            plateformesPage.setIsActive(true);
            
            plateformesPage = pageRepository.save(plateformesPage);
            System.out.println("✓ Plateformes page created successfully");
        } else {
            plateformesPage = pageRepository.findBySlug("plateformes").orElse(null);
            System.out.println("✓ Plateformes page already exists");
        }
        
        // Create translations for plateformes page
        if (plateformesPage != null) {
            String contentFR = defaultContentPlateformes;
            String contentAR = """
                {
                  "heroTitle": "المنصات",
                  "heroSubtitle": "أدوات وتقنيات للبحث والابتكار",
                  "introText": "توفر الوكالة الوطنية للباحثين والمبتكرين الموريتانيين منصات تكنولوجية متطورة لدعم مشاريعهم البحثية والابتكارية.",
                  "plateformes": [
                    {
                      "icon": "🔬",
                      "title": "منصة التحليل الكيميائي",
                      "description": "مختبر مجهز بأدوات متطورة للتحليل الكيميائي والتحليل الطيفي وتوصيف المواد.",
                      "equipments": ["مقياس الطيف الكتلي", "مقياس الكروماتوغرافيا الغازية", "مقياس حيود الأشعة السينية", "المجهر الإلكتروني"],
                      "services": ["تحليل التركيب", "توصيف المواد", "مراقبة الجودة", "التدريب التقني"],
                      "contact": "chimie@anrsi.mr"
                    },
                    {
                      "icon": "💻",
                      "title": "منصة المعلوماتية والحوسبة",
                      "description": "بنية تحتية معلوماتية عالية الأداء للحوسبة العلمية والمحاكاة الرقمية ومعالجة البيانات.",
                      "equipments": ["مجموعة حوسبة عالية الأداء", "خوادم تخزين ضخمة", "شبكة عالية السرعة", "برامج علمية"],
                      "services": ["الحوسبة المتوازية", "المحاكاة الرقمية", "تحليل البيانات", "الدعم التقني"],
                      "contact": "informatique@anrsi.mr"
                    },
                    {
                      "icon": "🌱",
                      "title": "المنصة البيوتكنولوجية",
                      "description": "مختبر متخصص في البيوتكنولوجيا للبحث في البيولوجيا الجزيئية والوراثة وبيولوجيا النبات.",
                      "equipments": ["تفاعل البوليميراز المتسلسل في الوقت الفعلي", "الرحلان الكهربائي", "مجاهر الفلورة", "حاضنات محكومة"],
                      "services": ["التحليل الوراثي", "زراعة الخلايا", "الاختبارات البيولوجية", "الاستشارة العلمية"],
                      "contact": "biotech@anrsi.mr"
                    },
                    {
                      "icon": "⚡",
                      "title": "المنصة الطاقوية",
                      "description": "منشأة مخصصة لاختبار وتطوير تقنيات الطاقة المتجددة وأنظمة التخزين.",
                      "equipments": ["محاكي الطاقة الشمسية", "منصة اختبار الرياح", "نظام تخزين البطاريات", "محلل الطاقة"],
                      "services": ["اختبارات الأداء", "تحسين الأنظمة", "دراسات الجدوى", "التدريب التقني"],
                      "contact": "energie@anrsi.mr"
                    },
                    {
                      "icon": "🌍",
                      "title": "المنصة البيئية",
                      "description": "مختبر تحليل بيئي لدراسة جودة الهواء والماء والتربة.",
                      "equipments": ["محلل جودة الهواء", "مقياس الطيف فوق البنفسجي-المرئي", "مقاييس الأس الهيدروجيني الدقيقة", "أخذ العينات التلقائي"],
                      "services": ["المراقبة البيئية", "تحليل التلوث", "دراسات التأثير", "الاستشارة التنظيمية"],
                      "contact": "environnement@anrsi.mr"
                    },
                    {
                      "icon": "🏭",
                      "title": "منصة النماذج الأولية",
                      "description": "ورشة تصنيع رقمي للنماذج الأولية السريعة والطباعة ثلاثية الأبعاد وتطوير المنتجات.",
                      "equipments": ["طابعات ثلاثية الأبعاد صناعية", "آلة القطع بالليزر", "آلة الطحن بالتحكم الرقمي", "ماسح ثلاثي الأبعاد"],
                      "services": ["النماذج الأولية السريعة", "التصميم بمساعدة الكمبيوتر", "التصنيع حسب الطلب", "التدريب التقني"],
                      "contact": "prototypage@anrsi.mr"
                    }
                  ],
                  "accessModes": [
                    {
                      "icon": "🎓",
                      "title": "الوصول الأكاديمي",
                      "description": "أسعار تفضيلية للجامعات ومؤسسات البحث العامة.",
                      "items": ["خصم 50% على الأسعار القياسية", "تدريب مجاني مشمول", "دعم تقني ذو أولوية"]
                    },
                    {
                      "icon": "🏢",
                      "title": "الوصول الصناعي",
                      "description": "خدمات كاملة للشركات والشركات الناشعة المبتكرة.",
                      "items": ["أسعار تنافسية", "ضمان السرية", "تقارير مفصلة"]
                    },
                    {
                      "icon": "🤝",
                      "title": "الشراكات",
                      "description": "تعاون طويل الأمد مع المؤسسات الشريكة.",
                      "items": ["وصول مميز", "التطوير المشترك للمشاريع", "تدريب الموظفين"]
                    }
                  ],
                  "bookingSteps": [
                    {"number": 1, "title": "طلب الوصول", "description": "تقديم طلب مفصل مع وصف المشروع والاحتياجات التقنية."},
                    {"number": 2, "title": "التقييم التقني", "description": "تحليل الجدوى التقنية وتقييم الموارد اللازمة."},
                    {"number": 3, "title": "التدريب", "description": "تدريب إلزامي على إجراءات السلامة واستخدام المعدات."},
                    {"number": 4, "title": "الحجز", "description": "تخطيط فترات الاستخدام حسب توفر المعدات."},
                    {"number": 5, "title": "الاستخدام", "description": "الوصول إلى المنصات مع الدعم التقني والإشراف عند الضرورة."}
                  ],
                  "bookingRequirements": [
                    "مشروع بحث أو ابتكار معتمد",
                    "التدريب على إجراءات السلامة",
                    "تأمين المسؤولية المدنية",
                    "احترام قواعد الاستخدام",
                    "توقيع اتفاقية السرية"
                  ],
                  "supportItems": [
                    {"icon": "📚", "title": "التدريب التقني", "description": "تدريب كامل على استخدام المعدات وإجراءات السلامة."},
                    {"icon": "🔧", "title": "الدعم التقني", "description": "المساعدة التقنية أثناء استخدام المنصات والصيانة الوقائية."},
                    {"icon": "📊", "title": "تحليل البيانات", "description": "الدعم في تحليل وتفسير النتائج التي تم الحصول عليها على المنصات."},
                    {"icon": "🤝", "title": "الاستشارة العلمية", "description": "نصيحة علمية لتحسين البروتوكولات وتحسين النتائج."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "البريد الإلكتروني العام", "value": "plateformes@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "الهاتف", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "العنوان", "value": "الوكالة الوطنية، نواكشوط، موريتانيا"},
                    {"icon": "fas fa-clock", "label": "ساعات العمل", "value": "الإثنين - الجمعة : 8:00 - 18:00"}
                  ]
                }
                """;
            String contentEN = """
                {
                  "heroTitle": "Platforms",
                  "heroSubtitle": "Tools and technologies for research and innovation",
                  "introText": "ANRSI provides Mauritanian researchers and innovators with cutting-edge technological platforms to support their research and innovation projects.",
                  "plateformes": [
                    {
                      "icon": "🔬",
                      "title": "Chemical Analysis Platform",
                      "description": "Laboratory equipped with advanced instruments for chemical analysis, spectroscopy, and material characterization.",
                      "equipments": ["Mass spectrometer", "Gas chromatography", "X-ray diffractometer", "Electron microscope"],
                      "services": ["Composition analysis", "Material characterization", "Quality control", "Technical training"],
                      "contact": "chimie@anrsi.mr"
                    },
                    {
                      "icon": "💻",
                      "title": "IT and Computing Platform",
                      "description": "High-performance IT infrastructure for scientific computing, numerical simulation, and data processing.",
                      "equipments": ["High-performance computing cluster", "Massive storage servers", "High-speed network", "Scientific software"],
                      "services": ["Parallel computing", "Numerical simulation", "Data analysis", "Technical support"],
                      "contact": "informatique@anrsi.mr"
                    },
                    {
                      "icon": "🌱",
                      "title": "Biotechnology Platform",
                      "description": "Laboratory specialized in biotechnology for research in molecular biology, genetics, and plant biology.",
                      "equipments": ["Real-time PCR", "Electrophoresis", "Fluorescence microscopes", "Controlled incubators"],
                      "services": ["Genetic analysis", "Cell culture", "Biological tests", "Scientific consultation"],
                      "contact": "biotech@anrsi.mr"
                    },
                    {
                      "icon": "⚡",
                      "title": "Energy Platform",
                      "description": "Facility dedicated to testing and developing renewable energy technologies and storage systems.",
                      "equipments": ["Solar simulator", "Wind test bench", "Battery storage system", "Power analyzer"],
                      "services": ["Performance testing", "System optimization", "Feasibility studies", "Technical training"],
                      "contact": "energie@anrsi.mr"
                    },
                    {
                      "icon": "🌍",
                      "title": "Environmental Platform",
                      "description": "Environmental analysis laboratory for studying air, water, and soil quality.",
                      "equipments": ["Air quality analyzer", "UV-Vis spectrometer", "Precision pH meters", "Automatic samplers"],
                      "services": ["Environmental monitoring", "Pollution analysis", "Impact studies", "Regulatory consultation"],
                      "contact": "environnement@anrsi.mr"
                    },
                    {
                      "icon": "🏭",
                      "title": "Prototyping Platform",
                      "description": "Digital manufacturing workshop for rapid prototyping, 3D printing, and product development.",
                      "equipments": ["Industrial 3D printers", "Laser cutting machine", "CNC milling machine", "3D scanner"],
                      "services": ["Rapid prototyping", "Computer-aided design", "Custom manufacturing", "Technical training"],
                      "contact": "prototypage@anrsi.mr"
                    }
                  ],
                  "accessModes": [
                    {
                      "icon": "🎓",
                      "title": "Academic Access",
                      "description": "Preferential rates for universities and public research institutions.",
                      "items": ["50% discount on standard rates", "Free training included", "Priority technical support"]
                    },
                    {
                      "icon": "🏢",
                      "title": "Industrial Access",
                      "description": "Complete services for innovative companies and startups.",
                      "items": ["Competitive rates", "Guaranteed confidentiality", "Detailed reports"]
                    },
                    {
                      "icon": "🤝",
                      "title": "Partnerships",
                      "description": "Long-term collaborations with partner institutions.",
                      "items": ["Privileged access", "Co-development of projects", "Staff training"]
                    }
                  ],
                  "bookingSteps": [
                    {"number": 1, "title": "Access Request", "description": "Submit a detailed request with project description and technical needs."},
                    {"number": 2, "title": "Technical Evaluation", "description": "Analysis of technical feasibility and assessment of required resources."},
                    {"number": 3, "title": "Training", "description": "Mandatory training on safety procedures and equipment use."},
                    {"number": 4, "title": "Booking", "description": "Planning usage slots according to equipment availability."},
                    {"number": 5, "title": "Usage", "description": "Access to platforms with technical support and supervision if necessary."}
                  ],
                  "bookingRequirements": [
                    "Validated research or innovation project",
                    "Safety procedure training",
                    "Civil liability insurance",
                    "Respect for usage rules",
                    "Confidentiality agreement signature"
                  ],
                  "supportItems": [
                    {"icon": "📚", "title": "Technical Training", "description": "Complete training on equipment use and safety procedures."},
                    {"icon": "🔧", "title": "Technical Support", "description": "Technical assistance during platform use and preventive maintenance."},
                    {"icon": "📊", "title": "Data Analysis", "description": "Support in analyzing and interpreting results obtained on platforms."},
                    {"icon": "🤝", "title": "Scientific Consultation", "description": "Scientific advice for protocol optimization and result improvement."}
                  ],
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "General Email", "value": "plateformes@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Phone", "value": "+222 45 25 44 21"},
                    {"icon": "fas fa-map-marker-alt", "label": "Address", "value": "ANRSI, Nouakchott, Mauritania"},
                    {"icon": "fas fa-clock", "label": "Hours", "value": "Monday - Friday : 8:00 AM - 6:00 PM"}
                  ]
                }
                """;
            
            createOrUpdateTranslation(plateformesPage, Language.FR, 
                "Plateformes", "Plateformes", 
                "Outils et technologies pour la recherche et l'innovation", contentFR);
            createOrUpdateTranslation(plateformesPage, Language.AR, 
                "المنصات", "المنصات", 
                "أدوات وتقنيات للبحث والابتكار", contentAR);
            createOrUpdateTranslation(plateformesPage, Language.EN, 
                "Platforms", "Platforms", 
                "Tools and technologies for research and innovation", contentEN);
        }
        
        // Create appels-candidatures page if it doesn't exist
        String defaultContentAppelsCandidatures = """
                {
                  "heroTitle": "Appels à Candidatures",
                  "heroSubtitle": "Opportunités de recherche et d'innovation en Mauritanie",
                  "introText": "L'ANRSI lance régulièrement des appels à candidatures pour financer des projets de recherche et d'innovation qui contribuent au développement scientifique et technologique de la Mauritanie.",
                  "appels": [
                    
                    
                  
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
        
        if (!pageRepository.existsBySlug("appels-candidatures")) {
            System.out.println("✓ Creating appels-candidatures page");
            
            appelsCandidaturesPage = new Page();
            appelsCandidaturesPage.setSlug("appels-candidatures");
            appelsCandidaturesPage.setPageType(Page.PageType.STRUCTURED);
            appelsCandidaturesPage.setIsPublished(true);
            appelsCandidaturesPage.setIsActive(true);
            
            appelsCandidaturesPage = pageRepository.save(appelsCandidaturesPage);
            System.out.println("✓ Appels-candidatures page created successfully");
        } else {
            appelsCandidaturesPage = pageRepository.findBySlug("appels-candidatures").orElse(null);
            System.out.println("✓ Appels-candidatures page already exists");
        }
        
        // Create translations for appels-candidatures page
        if (appelsCandidaturesPage != null) {
            String contentFR = defaultContentAppelsCandidatures;
            
            // Arabic translation
            String contentAR = """
                {
                  "heroTitle": "دعوات الترشيحات",
                  "heroSubtitle": "فرص البحث والابتكار في موريتانيا",
                  "introText": "تطلق الوكالة الوطنية للبحث العلمي والابتكار (ANRSI) بانتظام دعوات للترشيح لتمويل مشاريع البحث والابتكار التي تساهم في التنمية العلمية والتكنولوجية في موريتانيا.",
                  "appels": [
              
                  
                   
                  ],
                  "categories": [
                    {
                      "icon": "🌱",
                      "title": "الزراعة والأمن الغذائي",
                      "items": ["تقنيات زراعية مستدامة", "تحسين المحاصيل", "إدارة الموارد المائية", "التكنولوجيا الحيوية الزراعية"]
                    },
                    {
                      "icon": "⚡",
                      "title": "الطاقات المتجددة",
                      "items": ["الطاقة الشمسية والرياح", "تخزين الطاقة", "كفاءة الطاقة", "التكهرب الريفي"]
                    },
                    {
                      "icon": "💻",
                      "title": "تكنولوجيا المعلومات",
                      "items": ["الذكاء الاصطناعي", "إنترنت الأشياء (IoT)", "الأمن السيبراني", "التطبيقات المحمولة"]
                    },
                    {
                      "icon": "🌍",
                      "title": "البيئة والمناخ",
                      "items": ["تغير المناخ", "التنوع البيولوجي", "إدارة النفايات", "التلوث والصرف الصحي"]
                    },
                    {
                      "icon": "🏥",
                      "title": "الصحة والطب",
                      "items": ["الطب الوقائي", "الطب عن بُعد", "علم الأدوية", "الصحة العامة"]
                    },
                    {
                      "icon": "🏭",
                      "title": "الصناعة والابتكار",
                      "items": ["العمليات الصناعية", "المواد المتقدمة", "الروبوتات", "نقل التكنولوجيا"]
                    }
                  ],
                  "processSteps": [
                    { "number": 1, "title": "إعداد الملف", "description": "كتابة مشروع البحث، الميزانية التفصيلية، فريق البحث، ورسائل التوصية." },
                    { "number": 2, "title": "التقديم عبر الإنترنت", "description": "إيداع الملف الكامل عبر منصة التقديم الإلكترونية للوكالة الوطنية." },
                    { "number": 3, "title": "التقييم العلمي", "description": "فحص المشروع من قبل لجنة خبراء مستقلين وفق معايير علمية صارمة." },
                    { "number": 4, "title": "المقابلة", "description": "عرض شفهي للمشروع أمام لجنة التقييم للمشاريع المختارة مسبقاً." },
                    { "number": 5, "title": "القرار والتمويل", "description": "إشعار النتائج وتوقيع اتفاقية التمويل للمشاريع المقبولة." }
                  ],
                  "criteria": [
                    { "icon": "🔬", "title": "التميز العلمي", "description": "الجودة العلمية للمشروع، الابتكار، المنهجية الصارمة، والجدوى التقنية." },
                    { "icon": "👥", "title": "فريق البحث", "description": "كفاءات وخبرة الفريق، تكامل الملفات الشخصية، وقيادة المشروع." },
                    { "icon": "💡", "title": "التأثير والابتكار", "description": "إمكانات الابتكار، التأثير المتوقع على التنمية الوطنية، ونقل المعرفة." },
                    { "icon": "💰", "title": "الإدارة المالية", "description": "ميزانية واقعية ومبررة، فعالية التكلفة، وقدرة الإدارة المالية للحامل." }
                  ],
                  "supportServices": [
                    { "icon": "📋", "title": "التدريب على إدارة المشروع", "description": "التدريب على أدوات إدارة المشروع والإجراءات الإدارية." },
                    { "icon": "🔍", "title": "المتابعة والتقييم", "description": "المساعدة في متابعة المشروع وتقييم النتائج." },
                    { "icon": "🌐", "title": "الشبكة والشراكات", "description": "تسهيل الشراكات مع المؤسسات الوطنية والدولية." },
                    { "icon": "📢", "title": "تعزيز النتائج", "description": "الدعم في نشر وتعزيز نتائج البحث." }
                  ],
                  "contactInfo": [
                    { "icon": "fas fa-envelope", "label": "البريد الإلكتروني", "value": "appels@anrsi.mr" },
                    { "icon": "fas fa-phone", "label": "الهاتف", "value": "+222 45 25 44 21" },
                    { "icon": "fas fa-map-marker-alt", "label": "العنوان", "value": "الوكالة الوطنية، نواكشوط، موريتانيا" },
                    { "icon": "fas fa-clock", "label": "ساعات العمل", "value": "الإثنين - الجمعة : 8:00 - 16:00" }
                  ]
                }
                """;
            
            // English translation
            String contentEN = contentFR.replace("\"heroTitle\": \"Appels à Candidatures\"", "\"heroTitle\": \"Calls for Applications\"")
                .replace("\"heroSubtitle\": \"Opportunités de recherche et d'innovation en Mauritanie\"", "\"heroSubtitle\": \"Research and innovation opportunities in Mauritania\"");
            
            createOrUpdateTranslation(appelsCandidaturesPage, Language.FR, 
                "Appels à Candidatures", "Appels à Candidatures", 
                "Opportunités de recherche et d'innovation en Mauritanie", contentFR);
            createOrUpdateTranslation(appelsCandidaturesPage, Language.AR, 
                "دعوات الترشيحات", "دعوات الترشيحات", 
                "فرص البحث والابتكار في موريتانيا", contentAR);
            createOrUpdateTranslation(appelsCandidaturesPage, Language.EN, 
                "Calls for Applications", "Calls for Applications", 
                "Research and innovation opportunities in Mauritania", contentEN);
        }
        
        // Create ai4agri page if it doesn't exist
        String defaultContentAi4agri = """
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
        
        if (!pageRepository.existsBySlug("ai4agri")) {
            System.out.println("✓ Creating ai4agri page");
            
            ai4agriPage = new Page();
            ai4agriPage.setSlug("ai4agri");
            ai4agriPage.setPageType(Page.PageType.STRUCTURED);
            ai4agriPage.setIsPublished(true);
            ai4agriPage.setIsActive(true);
            
            ai4agriPage = pageRepository.save(ai4agriPage);
            System.out.println("✓ AI4AGRI page created successfully");
        } else {
            ai4agriPage = pageRepository.findBySlug("ai4agri").orElse(null);
            System.out.println("✓ AI4AGRI page already exists");
        }
        
        // Create translations for ai4agri page
        if (ai4agriPage != null) {
            String contentFR = defaultContentAi4agri;
            
            // Arabic translation (complete from aiargi.sql)
            String contentAR = """
                {
                  "heroTitle": "الذكاء الاصطناعي للزراعة",
                  "heroSubtitle": "الذكاء الاصطناعي للزراعة الدقيقة",
                  "introText": "تنظم ANRSI ورش عمل دولية حول تطبيقات الذكاء الاصطناعي في الزراعة الدقيقة لضمان الأمن الغذائي.",
                  "workshops": [
                    {
                      "date": "13-15 فبراير 2024",
                      "title": "افتتاح ورشة العمل الدولية حول تطبيقات الذكاء الاصطناعي في الزراعة",
                      "description": "ورشة عمل دولية حول \\"تطبيقات الذكاء الاصطناعي في الزراعة الدقيقة لضمان الأمن الغذائي\\"",
                      "detailsTitle": "برنامج AI 4 AGRI 13-15 فبراير 2024",
                      "detailsItems": [
                        "عرض محاضرات حول الذكاء الاصطناعي الزراعي",
                        "نماذج من العروض التقديمية",
                        "عروض عملية",
                        "بناء شبكة علاقات وتعاون"
                      ]
                    },
                    {
                      "date": "فبراير 2024",
                      "title": "AI 4 Agri - المبادرة المستمرة",
                      "description": "برنامج مستمر لتطوير وتطبيق الذكاء الاصطناعي في قطاع الزراعة الموريتانية.",
                      "detailsTitle": "أهداف البرنامج",
                      "detailsItems": [
                        "تحديث الزراعة من خلال الذكاء الاصطناعي",
                        "تحسين الإنتاجية الزراعية",
                        "تعزيز الأمن الغذائي",
                        "تدريب المزارعين على التقنيات الجديدة"
                      ]
                    }
                  ],
                  "benefits": [
                    {"icon": "🌱", "title": "الزراعة الدقيقة", "description": "تحسين استخدام الموارد وزيادة الإنتاجية من خلال تحليل البيانات الدقيقة."},
                    {"icon": "📊", "title": "التحليلات التنبؤية", "description": "التنبؤ بالظروف الجوية والأمراض للمحاصيل لتحسين التخطيط."},
                    {"icon": "🤖", "title": "الأتمتة", "description": "استخدام الروبوتات في المهام الزراعية لتحسين الكفاءة وتقليل التكاليف."},
                    {"icon": "🌍", "title": "التنمية المستدامة", "description": "تشجيع الزراعة الصديقة للبيئة والمستدامة."}
                  ],
                  "partnershipText": "تتعاون ANRSI مع المؤسسات الدولية وخبراء الذكاء الاصطناعي لتطوير حلول مبتكرة للزراعة في موريتانيا.",
                  "partnershipHighlights": [
                    {"icon": "🔬", "title": "البحث والتطوير", "description": "التعاون مع مراكز بحث دولية متخصصة في الذكاء الاصطناعي الزراعي."},
                    {"icon": "🎓", "title": "التدريب والتعليم", "description": "برامج تدريبية للمزارعين والمتخصصين في القطاع."},
                    {"icon": "🤝", "title": "التعاون الدولي", "description": "تبادل الخبرات والتقنيات مع الشركاء الدوليين."}
                  ]
                }
                """;
            
            // English translation (complete from aiargi.sql)
            String contentEN = """
                {
                  "heroTitle": "AI 4 AGRI",
                  "heroSubtitle": "Artificial Intelligence for Precision Agriculture",
                  "introText": "ANRSI organizes international workshops on the application of Artificial Intelligence in precision agriculture for food security.",
                  "workshops": [
                    {
                      "date": "13-15 February 2024",
                      "title": "Opening of the International Workshop on AI Applications in Agriculture",
                      "description": "International Workshop on \\"Application of Artificial Intelligence in Precision Agriculture for Food Security\\"",
                      "detailsTitle": "AI 4 AGRI Program 13-15 February 2024",
                      "detailsItems": [
                        "Presentations on agricultural AI",
                        "Sample presentations",
                        "Practical demonstrations",
                        "Networking and collaboration"
                      ]
                    },
                    {
                      "date": "February 2024",
                      "title": "AI 4 Agri - Ongoing Initiative",
                      "description": "Ongoing program for the development and application of AI in the Mauritanian agricultural sector.",
                      "detailsTitle": "Program Objectives",
                      "detailsItems": [
                        "Modernize agriculture through AI",
                        "Improve agricultural productivity",
                        "Strengthen food security",
                        "Train farmers in new technologies"
                      ]
                    }
                  ],
                  "benefits": [
                    {"icon": "🌱", "title": "Precision Agriculture", "description": "Optimize resources and increase yields through precise data analysis."},
                    {"icon": "📊", "title": "Predictive Analytics", "description": "Forecast weather conditions and crop diseases for better planning."},
                    {"icon": "🤖", "title": "Automation", "description": "Robotic agricultural tasks to improve efficiency and reduce costs."},
                    {"icon": "🌍", "title": "Sustainable Development", "description": "Promote environmentally friendly and sustainable agriculture."}
                  ],
                  "partnershipText": "ANRSI collaborates with international institutions and AI experts to develop innovative solutions for Mauritanian agriculture.",
                  "partnershipHighlights": [
                    {"icon": "🔬", "title": "Research & Development", "description": "Collaboration with international research centers specialized in agricultural AI."},
                    {"icon": "🎓", "title": "Training & Education", "description": "Training programs for farmers and sector professionals."},
                    {"icon": "🤝", "title": "International Cooperation", "description": "Exchange of expertise and technology with international partners."}
                  ]
                }
                """;
            
            createOrUpdateTranslation(ai4agriPage, Language.FR, 
                "AI 4 AGRI", "AI 4 AGRI", 
                "Intelligence Artificielle pour l'Agriculture de Précision", contentFR);
            createOrUpdateTranslation(ai4agriPage, Language.AR, 
                "الذكاء الاصطناعي للزراعة", "الذكاء الاصطناعي للزراعة", 
                "الذكاء الاصطناعي للزراعة الدقيقة", contentAR);
            createOrUpdateTranslation(ai4agriPage, Language.EN, 
                "AI 4 AGRI", "AI 4 AGRI", 
                "Artificial Intelligence for Precision Agriculture", contentEN);
        }
        
        // Create expert-anrsi page if it doesn't exist
        String defaultContentExpertAnrsi = """
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
        
        if (!pageRepository.existsBySlug("expert-anrsi")) {
            System.out.println("✓ Creating expert-anrsi page");
            
            expertAnrsiPage = new Page();
            expertAnrsiPage.setSlug("expert-anrsi");
            expertAnrsiPage.setPageType(Page.PageType.STRUCTURED);
            expertAnrsiPage.setIsPublished(true);
            expertAnrsiPage.setIsActive(true);
            
            expertAnrsiPage = pageRepository.save(expertAnrsiPage);
            System.out.println("✓ Expert-ANRSI page created successfully");
        } else {
            expertAnrsiPage = pageRepository.findBySlug("expert-anrsi").orElse(null);
            System.out.println("✓ Expert-ANRSI page already exists");
        }
        
        // Create translations for expert-anrsi page
        if (expertAnrsiPage != null) {
            String contentFR = defaultContentExpertAnrsi;
            
            // Arabic translation (complete from expertise.sql)
            String contentAR = """
                {
                  "heroTitle": "خبير ANRSI",
                  "heroSubtitle": "انضم إلى شبكة الخبراء العلمية والتكنولوجية لدينا",
                  "introText": "تقوم الوكالة الوطنية للبحث العلمي والابتكار (ANRSI) بتجنيد خبراء مؤهلين لتقييم المشاريع البحثية والمساهمة في التنمية العلمية في موريتانيا.",
                  "requirements": [
                    {
                      "icon": "🎓",
                      "title": "الخلفية الأكاديمية",
                      "items": [
                        "دكتوراه في مجال علمي أو تكنولوجي",
                        "خبرة بحثية كبيرة",
                        "منشورات علمية معترف بها",
                        "إجادة الفرنسية و/أو الإنجليزية"
                      ]
                    },
                    {
                      "icon": "🔬",
                      "title": "الخبرة التقنية",
                      "items": [
                        "معرفة متعمقة بمجال الخبرة",
                        "خبرة في تقييم المشاريع",
                        "مهارات تحليلية وقدرة على التلخيص",
                        "دقة علمية وأخلاقية"
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "الالتزام",
                      "items": [
                        "التفرغ للتقييمات",
                        "الالتزام بالتنمية العلمية",
                        "الالتزام بالمواعيد والإجراءات",
                        "السرية والحيادية"
                      ]
                    }
                  ],
                  "domains": [
                    {"icon": "🔬", "title": "العلوم الدقيقة", "description": "الرياضيات، الفيزياء، الكيمياء، علوم الأرض"},
                    {"icon": "🌱", "title": "علوم الحياة", "description": "البيولوجيا، الزراعة، الطب، العلوم البيطرية"},
                    {"icon": "💻", "title": "تقنيات المعلومات", "description": "علوم الحاسوب، الذكاء الاصطناعي، الاتصالات"},
                    {"icon": "⚡", "title": "علوم الهندسة", "description": "الهندسة المدنية، الميكانيكية، الكهربائية، الطاقات المتجددة"},
                    {"icon": "🌍", "title": "العلوم الاجتماعية", "description": "الاقتصاد، علم الاجتماع، القانون، العلوم السياسية"},
                    {"icon": "🌿", "title": "علوم البيئة", "description": "علم البيئة، علم المناخ، إدارة الموارد الطبيعية"}
                  ],
                  "processSteps": [
                    {"number": 1, "title": "التقديم", "description": "تقديم طلب مع سيرة ذاتية مفصلة، قائمة المنشورات، ورسالة الدافع."},
                    {"number": 2, "title": "التقييم", "description": "يتم مراجعة الطلب من قبل لجنة خبراء ANRSI وفق معايير موضوعية."},
                    {"number": 3, "title": "المقابلة", "description": "إجراء مقابلة مع المرشحين المختارين لتقييم المهارات والدافعية."},
                    {"number": 4, "title": "التدريب", "description": "تدريب على إجراءات تقييم ANRSI والأدوات المستخدمة."},
                    {"number": 5, "title": "الانضمام", "description": "الانضمام إلى شبكة الخبراء وتكليف أول مهام التقييم."}
                  ],
                  "benefits": [
                    {"icon": "💼", "title": "التعويض المالي", "description": "تعويض جذاب لكل مهمة تقييم وفق الخبرة والتعقيد."},
                    {"icon": "🌐", "title": "شبكة دولية", "description": "الانضمام إلى شبكة دولية من الخبراء وفرص التعاون."},
                    {"icon": "📚", "title": "التدريب المستمر", "description": "الوصول إلى تدريبات وندوات للحفاظ على المهارات وتطويرها."},
                    {"icon": "🏆", "title": "الاعتراف", "description": "الاعتراف الرسمي كخبير علمي والمساهمة في التنمية الوطنية."}
                  ],
                  "applicationText": "للتقديم كخبير ANRSI، يرجى إرسال طلبكم إلى:",
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "البريد الإلكتروني", "value": "expert@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "الهاتف", "value": "+222 45 25 44 21"}
                  ],
                  "requiredDocuments": [
                    "سيرة ذاتية مفصلة مع قائمة المنشورات",
                    "رسالة الدافع",
                    "نسخ الشهادات والدبلومات",
                    "خطابات التوصية (اختياري)",
                    "قائمة المشاريع البحثية التي تم إدارتها"
                  ]
                }
                """;
            
            // English translation (complete from expertise.sql)
            String contentEN = """
                {
                  "heroTitle": "ANRSI Expert",
                  "heroSubtitle": "Join our network of scientific and technological experts",
                  "introText": "The National Agency for Scientific Research and Innovation (ANRSI) recruits qualified experts to evaluate research projects and contribute to the scientific development of Mauritania.",
                  "requirements": [
                    {
                      "icon": "🎓",
                      "title": "Academic Background",
                      "items": [
                        "PhD in a scientific or technological field",
                        "Significant research experience",
                        "Recognized scientific publications",
                        "Fluency in French and/or English"
                      ]
                    },
                    {
                      "icon": "🔬",
                      "title": "Technical Expertise",
                      "items": [
                        "In-depth knowledge of the field of expertise",
                        "Experience in project evaluation",
                        "Analytical and synthesis skills",
                        "Scientific rigor and ethics"
                      ]
                    },
                    {
                      "icon": "🌍",
                      "title": "Commitment",
                      "items": [
                        "Availability for evaluations",
                        "Commitment to scientific development",
                        "Respect for deadlines and procedures",
                        "Confidentiality and impartiality"
                      ]
                    }
                  ],
                  "domains": [
                    {"icon": "🔬", "title": "Exact Sciences", "description": "Mathematics, Physics, Chemistry, Earth Sciences"},
                    {"icon": "🌱", "title": "Life Sciences", "description": "Biology, Agriculture, Medicine, Veterinary Sciences"},
                    {"icon": "💻", "title": "Information Technologies", "description": "Computer Science, Artificial Intelligence, Telecommunications"},
                    {"icon": "⚡", "title": "Engineering Sciences", "description": "Civil, Mechanical, Electrical Engineering, Renewable Energies"},
                    {"icon": "🌍", "title": "Social Sciences", "description": "Economics, Sociology, Law, Political Science"},
                    {"icon": "🌿", "title": "Environmental Sciences", "description": "Ecology, Climatology, Natural Resource Management"}
                  ],
                  "processSteps": [
                    {"number": 1, "title": "Application", "description": "Submit application with detailed CV, list of publications, and motivation letter."},
                    {"number": 2, "title": "Evaluation", "description": "The application is reviewed by an ANRSI expert committee based on objective criteria."},
                    {"number": 3, "title": "Interview", "description": "Interview with selected candidates to assess skills and motivation."},
                    {"number": 4, "title": "Training", "description": "Training on ANRSI evaluation procedures and tools."},
                    {"number": 5, "title": "Integration", "description": "Integration into the expert network and assignment of initial evaluation tasks."}
                  ],
                  "benefits": [
                    {"icon": "💼", "title": "Compensation", "description": "Attractive remuneration for each evaluation mission according to expertise and complexity."},
                    {"icon": "🌐", "title": "International Network", "description": "Integration into an international network of experts and collaboration opportunities."},
                    {"icon": "📚", "title": "Continuous Training", "description": "Access to training and seminars to maintain and develop skills."},
                    {"icon": "🏆", "title": "Recognition", "description": "Official recognition as a scientific expert and contribution to national development."}
                  ],
                  "applicationText": "To apply as an ANRSI expert, please send your application to:",
                  "contactInfo": [
                    {"icon": "fas fa-envelope", "label": "Email", "value": "expert@anrsi.mr"},
                    {"icon": "fas fa-phone", "label": "Phone", "value": "+222 45 25 44 21"}
                  ],
                  "requiredDocuments": [
                    "Detailed CV with list of publications",
                    "Motivation letter",
                    "Copies of diplomas and certificates",
                    "Recommendation letters (optional)",
                    "List of research projects led"
                  ]
                }
                """;
            
            createOrUpdateTranslation(expertAnrsiPage, Language.FR, 
                "Expert à l'ANRSI", "Expert à l'ANRSI", 
                "Rejoignez notre réseau d'experts scientifiques et technologiques", contentFR);
            createOrUpdateTranslation(expertAnrsiPage, Language.AR, 
                "خبير ANRSI", "خبير ANRSI", 
                "انضم إلى شبكة الخبراء العلمية والتكنولوجية لدينا", contentAR);
            createOrUpdateTranslation(expertAnrsiPage, Language.EN, 
                "ANRSI Expert", "ANRSI Expert", 
                "Join our network of scientific and technological experts", contentEN);
        }
        
        // Create cooperation page if it doesn't exist
        String defaultContentCooperation = """
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
        
        if (!pageRepository.existsBySlug("cooperation")) {
            System.out.println("✓ Creating cooperation page");
            
            
            cooperationPage = new Page();
            cooperationPage.setSlug("cooperation");
            cooperationPage.setPageType(Page.PageType.STRUCTURED);
            cooperationPage.setIsPublished(true);
            cooperationPage.setIsActive(true);
            
            cooperationPage = pageRepository.save(cooperationPage);
            System.out.println("✓ Cooperation page created successfully");
        } else {
            cooperationPage = pageRepository.findBySlug("cooperation").orElse(null);
            System.out.println("✓ Cooperation page already exists");
        }
        
        // Create translations for cooperation page
        if (cooperationPage != null) {
            String contentFR = defaultContentCooperation;
            
            // Arabic translation (complete from cooperation.sql)
            String contentAR = """
                {
                  "cooperationInfo": {
                    "title": "التعاون والشراكات",
                    "description": "ترتبط الوكالة بمؤسسات ذات مصلحة مشتركة من خلال اتفاقيات التعاون والشراكة لتحقيق أهداف مشتركة.",
                    "benefits": [
                      "تعزيز قدرات البحث العلمي",
                      "تبادل الخبرات والمعرفة",
                      "تطوير مشاريع مبتكرة",
                      "بناء شبكة علاقات بين الباحثين",
                      "تسليط الضوء على نتائج البحث",
                      "نقل التكنولوجيا"
                    ]
                  },
                  "partnerships": [
                    {
                      "id": "anrsa-senegal",
                      "title": "اتفاقية شراكة مع ANRSA السنغال",
                      "description": "شراكة استراتيجية مع الوكالة الوطنية للبحث العلمي التطبيقي في السنغال",
                      "type": "شراكة",
                      "country": "السنغال",
                      "flag": "🇸🇳",
                      "objectives": [
                        "تبادل الخبرات في البحث العلمي",
                        "التعاون في المشاريع المشتركة",
                        "تعزيز قدرات البحث العلمي",
                        "مشاركة الموارد والبنى التحتية"
                      ],
                      "status": "نشط",
                      "icon": "fas fa-handshake",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "cnrst-maroc",
                      "title": "اتفاقية تعاون مع CNRST المغرب",
                      "description": "التعاون مع المركز الوطني للبحث العلمي والتقني في المغرب",
                      "type": "تعاون",
                      "country": "المغرب",
                      "flag": "🇲🇦",
                      "objectives": [
                        "تطوير مشاريع بحثية مشتركة",
                        "تدريب وتبادل الباحثين",
                        "تسليط الضوء على نتائج البحث",
                        "الابتكار التكنولوجي"
                      ],
                      "status": "نشط",
                      "icon": "fas fa-microscope",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tunisie-dri",
                      "title": "شراكة مع DRI تونس",
                      "description": "التعاون مع قسم البحث العلمي والابتكار في تونس",
                      "type": "شراكة",
                      "country": "تونس",
                      "flag": "🇹🇳",
                      "objectives": [
                        "البحث التطبيقي والابتكار",
                        "نقل التكنولوجيا",
                        "التدريب المتخصص",
                        "تطوير حلول مبتكرة"
                      ],
                      "status": "نشط",
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "iset-rosso",
                      "title": "شراكة مع ISET روسو",
                      "description": "التعاون مع المعهد العالي للتعليم التكنولوجي بروسو لإنتاج الخضروات المحمية",
                      "type": "شراكة محلية",
                      "country": "موريتانيا",
                      "flag": "🇲🇷",
                      "objectives": [
                        "إنتاج الخضروات المحمية",
                        "تقنيات زراعية مبتكرة",
                        "تدريب تقني متخصص",
                        "تنمية زراعية محلية"
                      ],
                      "details": "تهدف هذه الشراكة المحلية إلى تطوير تقنيات مبتكرة لإنتاج الخضروات المحمية، مما يساهم في التنمية الزراعية والأمن الغذائي في موريتانيا.",
                      "status": "نشط",
                      "icon": "fas fa-seedling",
                      "color": "#126564"
                    }
                  ]
                }
                """;
            
            // English translation (complete from cooperation.sql)
            String contentEN = """
                {
                  "cooperationInfo": {
                    "title": "Cooperation & Partnerships",
                    "description": "The Agency is linked to institutions of common interest through cooperation and partnership agreements to achieve shared objectives.",
                    "benefits": [
                      "Strengthening research capacities",
                      "Exchange of expertise and knowledge",
                      "Development of innovative projects",
                      "Networking among researchers",
                      "Valorization of research results",
                      "Technology transfer"
                    ]
                  },
                  "partnerships": [
                    {
                      "id": "anrsa-senegal",
                      "title": "Partnership Agreement with ANRSA Senegal",
                      "description": "Strategic partnership with the National Agency for Applied Scientific Research of Senegal",
                      "type": "Partnership",
                      "country": "Senegal",
                      "flag": "🇸🇳",
                      "objectives": [
                        "Exchange of expertise in scientific research",
                        "Collaboration on joint projects",
                        "Strengthening research capacities",
                        "Sharing of resources and infrastructure"
                      ],
                      "status": "Active",
                      "icon": "fas fa-handshake",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "cnrst-maroc",
                      "title": "Cooperation Agreement with CNRST Morocco",
                      "description": "Cooperation with the National Center for Scientific and Technical Research of Morocco",
                      "type": "Cooperation",
                      "country": "Morocco",
                      "flag": "🇲🇦",
                      "objectives": [
                        "Development of joint research projects",
                        "Training and exchange of researchers",
                        "Valorization of research results",
                        "Technological innovation"
                      ],
                      "status": "Active",
                      "icon": "fas fa-microscope",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tunisie-dri",
                      "title": "Partnership with DRI Tunisia",
                      "description": "Collaboration with the Department of Scientific Research and Innovation in Tunisia",
                      "type": "Partnership",
                      "country": "Tunisia",
                      "flag": "🇹🇳",
                      "objectives": [
                        "Applied research and innovation",
                        "Technology transfer",
                        "Specialized training",
                        "Development of innovative solutions"
                      ],
                      "status": "Active",
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "iset-rosso",
                      "title": "Partnership with ISET Rosso",
                      "description": "Collaboration with the Higher Institute of Technological Education of Rosso for protected vegetable production",
                      "type": "Local Partnership",
                      "country": "Mauritania",
                      "flag": "🇲🇷",
                      "objectives": [
                        "Production of protected vegetables",
                        "Innovative agricultural techniques",
                        "Specialized technical training",
                        "Local agricultural development"
                      ],
                      "details": "This local partnership aims to develop innovative techniques for protected vegetable production, thereby contributing to agricultural development and food security in Mauritania.",
                      "status": "Active",
                      "icon": "fas fa-seedling",
                      "color": "#126564"
                    }
                  ]
                }
                """;
            
            createOrUpdateTranslation(cooperationPage, Language.FR, 
                "Coopération & Partenariats", "Coopération & Partenariats", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(cooperationPage, Language.AR, 
                "التعاون والشراكات", "التعاون والشراكات", 
                "ترتبط الوكالة بمؤسسات ذات مصلحة مشتركة من خلال اتفاقيات التعاون والشراكة لتحقيق أهداف مشتركة.", contentAR);
            createOrUpdateTranslation(cooperationPage, Language.EN, 
                "Cooperation & Partnerships", "Cooperation & Partnerships", 
                "The Agency is linked to institutions of common interest through cooperation and partnership agreements to achieve shared objectives.", contentEN);
        }
        
        // Create programmes page if it doesn't exist
        String defaultContentProgrammes = """
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
        
        if (!pageRepository.existsBySlug("programmes")) {
            System.out.println("✓ Creating programmes page");
            
            
            programmesPage = new Page();
            programmesPage.setSlug("programmes");
            programmesPage.setPageType(Page.PageType.STRUCTURED);
            programmesPage.setIsPublished(true);
            programmesPage.setIsActive(true);
            
            programmesPage = pageRepository.save(programmesPage);
            System.out.println("✓ Programmes page created successfully");
        } else {
            programmesPage = pageRepository.findBySlug("programmes").orElse(null);
            System.out.println("✓ Programmes page already exists");
        }
        
        // Create translations for programmes page
        if (programmesPage != null) {
            String contentFR = defaultContentProgrammes;
            
            // Arabic translation (complete from programme.sql)
            String contentAR = """
                {
                  "heroTitle": "البرامج",
                  "heroSubtitle": "برامج الوكالة",
                  "programmes": [
                    {
                      "id": "temkin",
                      "name": "برنامج تمكين (التمكين)",
                      "description": "برنامج تمكين الهياكل البحثية",
                      "objectives": [
                        "ضمان سير عمل الهياكل البحثية المعترف بها",
                        "تشجيع ثقافة تبادل الموارد",
                        "كسر عزلة الباحثين",
                        "تعزيز قدرات مؤسسات التعليم العالي والبحث العلمي والباحثين في مجال إدارة وحوكمة البحث العلمي"
                      ],
                      "icon": "fas fa-university",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "temeyouz",
                      "name": "برنامج تميوز (التميز)",
                      "description": "برنامج التميز العلمي للباحثين الشباب",
                      "objectives": [
                        "دعم التميز العلمي بين الباحثين الشباب",
                        "تشجيع طلبة الدكتوراه على تكريس وقت كامل لأطروحاتهم",
                        "زيادة الإنتاج العلمي الوطني وتحسين وضوحه",
                        "تشجيع وتحفيز الإشراف والإنتاج العلمي",
                        "تطوير الإبداع وروح ريادة الأعمال لدى الباحثين الشباب"
                      ],
                      "icon": "fas fa-graduation-cap",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tethmin",
                      "name": "برنامج تثمين (التثمين)",
                      "description": "برنامج تثمين البحث العلمي",
                      "objectives": [
                        "ضمان نشر ومشاركة المعرفة",
                        "التعريف بموضوعات البحث لدى الهياكل البحثية",
                        "تعزيز شبكة الباحثين حول الموضوعات ذات الأولوية",
                        "تعزيز وضوح الإنتاج العلمي الوطني",
                        "دعم إنشاء هياكل لتثمين البحث العلمي (حاضنات)",
                        "حماية الملكية الفكرية"
                      ],
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "temm",
                      "name": "برنامج TEMM للتنمية المحلية",
                      "description": "برنامج التنمية المحلية والتصنيع",
                      "objectives": [
                        "تصميم وتمويل مشاريع تجريبية في مجالات محددة من التنمية المحلية",
                        "إظهار واستغلال الإمكانيات الكبرى للبلاد",
                        "تشجيع الاستثمارات في التصنيع والبحث العلمي",
                        "التعاون مع الشركاء الفنيين والعلميين"
                      ],
                      "details": "يعد برنامج TEMM أحد أحدث البرامج التي اعتمدها مجلس إدارة الوكالة. يقوم البرنامج بتصميم وتمويل مشاريع تجريبية في مجالات محددة من التنمية المحلية لإظهار واستغلال الإمكانيات الكبرى للبلاد وتشجيع الاستثمارات في التصنيع والبحث العلمي مع الشركاء الفنيين والعلميين. وقد تم إطلاق أول مشروع في إطار هذا البرنامج، الذي يركز على المحاصيل الزراعية المحمية وإنتاجها وحفظها وتحويلها، بشكل فعلي بموجب الاتفاقية الموقعة في 4 نوفمبر 2021 بين الوكالة وISET.",
                      "icon": "fas fa-industry",
                      "color": "#126564"
                    }
                  ],
                  "ctaTitle": "مهتم ببرامجنا؟",
                  "ctaDescription": "اكتشف كيفية المشاركة في برامجنا للبحث والابتكار"
                }
                """;
            
            // English translation (complete from programme.sql)
            String contentEN = """
                {
                  "heroTitle": "Programs",
                  "heroSubtitle": "Agency Programs",
                  "programmes": [
                    {
                      "id": "temkin",
                      "name": "Temkin Program (Empowerment)",
                      "description": "Program for empowering research structures",
                      "objectives": [
                        "Ensure the proper functioning of recognized Research Structures (RS)",
                        "Encourage a culture of resource sharing",
                        "Break the isolation of researchers",
                        "Strengthen the capacities of Higher Education and Research Institutions and researchers in research management and governance"
                      ],
                      "icon": "fas fa-university",
                      "color": "#0a3d62"
                    },
                    {
                      "id": "temeyouz",
                      "name": "Temeyouz Program (Excellence)",
                      "description": "Scientific excellence program for young researchers",
                      "objectives": [
                        "Support scientific excellence among young researchers",
                        "Encourage PhD students to dedicate full time to their theses",
                        "Increase national scientific output and improve its visibility",
                        "Encourage and motivate supervision and scientific production",
                        "Develop creativity and entrepreneurship among young researchers"
                      ],
                      "icon": "fas fa-graduation-cap",
                      "color": "#20a39e"
                    },
                    {
                      "id": "tethmin",
                      "name": "Tethmin Program (Valorization)",
                      "description": "Program for the valorization of scientific research",
                      "objectives": [
                        "Ensure dissemination and sharing of knowledge",
                        "Raise awareness of the research topics of Research Structures",
                        "Strengthen networking among researchers around priority topics",
                        "Promote the visibility of national scientific output",
                        "Support the establishment of research valorization structures (incubators)",
                        "Protect intellectual property"
                      ],
                      "icon": "fas fa-lightbulb",
                      "color": "#ff6b6b"
                    },
                    {
                      "id": "temm",
                      "name": "TEMM Program for Local Development",
                      "description": "Program for local development and industrialization",
                      "objectives": [
                        "Design and fund pilot projects in specific areas of local development",
                        "Demonstrate and exploit the country's major potential",
                        "Encourage investments in industrialization and scientific research",
                        "Collaborate with technical and scientific partners"
                      ],
                      "details": "The TEMM program is one of the most recent programs adopted by the ANRSI Board of Directors. It designs and funds pilot projects in specific areas of local development to demonstrate and exploit the country's major potential and encourage investments in industrialization and scientific research with technical and scientific partners. The first project under this program, focused on protected horticultural crops, their production, conservation, and processing, was effectively launched under the agreement signed on November 4, 2021, between ANRSI and ISET.",
                      "icon": "fas fa-industry",
                      "color": "#126564"
                    }
                  ],
                  "ctaTitle": "Interested in our programs?",
                  "ctaDescription": "Discover how to participate in our research and innovation programs"
                }
                """;
            
            createOrUpdateTranslation(programmesPage, Language.FR, 
                "Programmes", "Programmes", 
                "Programmes de l'Agence", contentFR);
            createOrUpdateTranslation(programmesPage, Language.AR, 
                "البرامج", "البرامج", 
                "برامج الوكالة", contentAR);
            createOrUpdateTranslation(programmesPage, Language.EN, 
                "Programs", "Programs", 
                "Agency Programs", contentEN);
        }
        
        // Create financement page if it doesn't exist
        String defaultContentFinancement = """
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
        
        if (!pageRepository.existsBySlug("financement")) {
            System.out.println("✓ Creating financement page");
            
            
            financementPage = new Page();
            financementPage.setSlug("financement");
            financementPage.setPageType(Page.PageType.STRUCTURED);
            financementPage.setIsPublished(true);
            financementPage.setIsActive(true);
            
            financementPage = pageRepository.save(financementPage);
            System.out.println("✓ Financement page created successfully");
        } else {
            financementPage = pageRepository.findBySlug("financement").orElse(null);
            System.out.println("✓ Financement page already exists");
        }
        
        // Create translations for financement page
        if (financementPage != null) {
            String contentFR = defaultContentFinancement;
            
            // Arabic translation (complete from financement.sql)
            String contentAR = """
                {
                  "heroTitle": "التمويل",
                  "heroSubtitle": "تمول الوكالة العديد من الأنشطة المتعلقة بالبحث العلمي. هذه الأنشطة تأتي ضمن برامج الوكالة التي يتم الإعلان عنها سنويًا.",
                  "process": [
                    {
                      "step": 1,
                      "title": "تحديد البرنامج",
                      "description": "يجب على المتقدم تحديد البرنامج المناسب لنشاطه",
                      "icon": "fas fa-search"
                    },
                    {
                      "step": 2,
                      "title": "الالتزام بالمواعيد النهائية",
                      "description": "الالتزام بالمواعيد النهائية وشروط التقديم المنشورة على موقع الوكالة",
                      "icon": "fas fa-clock"
                    },
                    {
                      "step": 3,
                      "title": "مراجعة اللوائح",
                      "description": "مراجعة القرار الوزاري المنظم للتمويل لمزيد من التفاصيل",
                      "icon": "fas fa-file-alt"
                    }
                  ],
                  "requirements": [
                    "أن تكون مؤسسة بحثية معترف بها",
                    "امتلاك مشروع متوافق مع برامج الوكالة",
                    "الالتزام بمواعيد التقديم",
                    "تقديم جميع المستندات المطلوبة",
                    "تبرير الأهمية العلمية للمشروع"
                  ],
                  "benefits": [
                    "تمويل الأنشطة البحثية العلمية",
                    "دعم المشاريع المبتكرة",
                    "توجيه في تنفيذ المشاريع",
                    "التواصل مع باحثين آخرين",
                    "تسليط الضوء على نتائج البحث"
                  ],
                  "ctaTitle": "هل أنت مستعد للتقديم؟",
                  "ctaDescription": "اطلع على دعواتنا للمشاريع وقدم مشروعك"
                }
                """;
            
            // English translation (complete from financement.sql)
            String contentEN = """
                {
                  "heroTitle": "Funding",
                  "heroSubtitle": "The Agency funds numerous activities related to scientific research. These activities are part of the Agency's programs, announced annually.",
                  "process": [
                    {
                      "step": 1,
                      "title": "Identify the Program",
                      "description": "The applicant must identify the program suitable for their activity",
                      "icon": "fas fa-search"
                    },
                    {
                      "step": 2,
                      "title": "Meet Deadlines",
                      "description": "Respect the deadlines and application conditions published on the Agency's website",
                      "icon": "fas fa-clock"
                    },
                    {
                      "step": 3,
                      "title": "Consult Regulations",
                      "description": "Consult the ministerial decree regulating funding for more details",
                      "icon": "fas fa-file-alt"
                    }
                  ],
                  "requirements": [
                    "Be a recognized research institution",
                    "Have a project in accordance with ANRSI programs",
                    "Respect application deadlines",
                    "Provide all required documents",
                    "Justify the scientific relevance of the project"
                  ],
                  "benefits": [
                    "Funding for scientific research activities",
                    "Support for innovative projects",
                    "Guidance in project implementation",
                    "Networking with other researchers",
                    "Valorization of research results"
                  ],
                  "ctaTitle": "Ready to Apply?",
                  "ctaDescription": "Check our calls for proposals and submit your project"
                }
                """;
            
            createOrUpdateTranslation(financementPage, Language.FR, 
                "Financement", "Financement", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(financementPage, Language.AR, 
                "التمويل", "التمويل", 
                "تمول الوكالة العديد من الأنشطة المتعلقة بالبحث العلمي. هذه الأنشطة تأتي ضمن برامج الوكالة التي يتم الإعلان عنها سنويًا.", contentAR);
            createOrUpdateTranslation(financementPage, Language.EN, 
                "Funding", "Funding", 
                "The Agency funds numerous activities related to scientific research. These activities are part of the Agency's programs, announced annually.", contentEN);
        }
        
        // Create videos page if it doesn't exist
        String defaultContentVideos = """
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
        
        if (!pageRepository.existsBySlug("videos")) {
            System.out.println("✓ Creating videos page");
            
            
            videosPage = new Page();
            videosPage.setSlug("videos");
            videosPage.setPageType(Page.PageType.STRUCTURED);
            videosPage.setIsPublished(true);
            videosPage.setIsActive(true);
            
            videosPage = pageRepository.save(videosPage);
            System.out.println("✓ Videos page created successfully");
        } else {
            videosPage = pageRepository.findBySlug("videos").orElse(null);
            System.out.println("✓ Videos page already exists");
        }
        
        // Create translations for videos page
        if (videosPage != null) {
            String contentFR = defaultContentVideos;
            String contentAR = contentFR.replace("\"heroTitle\": \"Mediatique\"", "\"heroTitle\": \"إعلامي\"");
            String contentEN = contentFR.replace("\"heroTitle\": \"Mediatique\"", "\"heroTitle\": \"Media\"");
            
            createOrUpdateTranslation(videosPage, Language.FR, 
                "Mediatique", "Mediatique", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(videosPage, Language.AR, 
                "إعلامي", "إعلامي", 
                "تواصل مع فرق البحث وموظفي الدعم لدينا", contentAR);
            createOrUpdateTranslation(videosPage, Language.EN, 
                "Media", "Media", 
                "Get in touch with our research teams and support staff", contentEN);
        }
        
        // Create objectives page if it doesn't exist
        String defaultContentObjectives = """
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
        
        if (!pageRepository.existsBySlug("objectives")) {
            System.out.println("✓ Creating objectives page");
            
            
            objectivesPage = new Page();
            objectivesPage.setSlug("objectives");
            objectivesPage.setPageType(Page.PageType.STRUCTURED);
            objectivesPage.setIsPublished(true);
            objectivesPage.setIsActive(true);
            
            objectivesPage = pageRepository.save(objectivesPage);
            System.out.println("✓ Objectives page created successfully");
        } else {
            objectivesPage = pageRepository.findBySlug("objectives").orElse(null);
            System.out.println("✓ Objectives page already exists");
        }
        
        // Create translations for objectives page
        if (objectivesPage != null) {
            String contentFR = defaultContentObjectives;
            
            // Arabic translation (complete from objective.sql)
            String contentAR = """
                {
                  "heroTitle": "الأهداف",
                  "heroSubtitle": "الأهداف الاستراتيجية للوكالة الوطنية للبحث العلمي والابتكار",
                  "sectionTitle": "أهدافنا",
                  "objectives": [
                    {
                      "number": 1,
                      "title": "زيادة الإنتاج العلمي الوطني",
                      "description": "تهدف الوكالة إلى تحفيز وزيادة الإنتاج العلمي الوطني بشكل كبير من خلال دعم الباحثين والمؤسسات البحثية."
                    },
                    {
                      "number": 2,
                      "title": "تعزيز التميز وانتشار البحث العلمي في موريتانيا",
                      "description": "نلتزم بتعزيز التميز في البحث العلمي وتقوية الانتشار الدولي للبحث الموريتاني."
                    },
                    {
                      "number": 3,
                      "title": "تعزيز أثر البحث والابتكار على الاقتصاد والمجتمع والتنمية المستدامة",
                      "description": "تعمل الوكالة على تعظيم أثر البحث والابتكار على التنمية الاقتصادية والاجتماعية والمستدامة في موريتانيا."
                    },
                    {
                      "number": 4,
                      "title": "زيادة قدرة البلاد على الابتكار وخلق الثروات من خلال البحث",
                      "description": "نسعى لتعزيز القدرات الوطنية للابتكار وتشجيع خلق الثروات بفضل نتائج البحث العلمي."
                    }
                  ]
                }
                """;
            
            // English translation (complete from objective.sql)
            String contentEN = """
                {
                  "heroTitle": "Objectives",
                  "heroSubtitle": "The strategic objectives of the National Agency for Scientific Research and Innovation",
                  "sectionTitle": "Our Objectives",
                  "objectives": [
                    {
                      "number": 1,
                      "title": "Increase National Scientific Output",
                      "description": "ANRSI aims to stimulate and significantly increase national scientific output by supporting researchers and research institutions."
                    },
                    {
                      "number": 2,
                      "title": "Enhance Excellence and Visibility of Scientific Research in Mauritania",
                      "description": "We are committed to promoting excellence in scientific research and strengthening the international visibility of Mauritanian research."
                    },
                    {
                      "number": 3,
                      "title": "Improve the Impact of Research and Innovation on Economy, Society, and Sustainable Development",
                      "description": "ANRSI works to maximize the impact of research and innovation on Mauritania's economic, social, and sustainable development."
                    },
                    {
                      "number": 4,
                      "title": "Increase the Country's Innovation Capacity and Wealth Creation through Research",
                      "description": "We aim to strengthen national innovation capacities and foster wealth creation through scientific research outcomes."
                    }
                  ]
                }
                """;
            
            createOrUpdateTranslation(objectivesPage, Language.FR, 
                "Objectifs", "Objectifs", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(objectivesPage, Language.AR, 
                "الأهداف", "الأهداف", 
                "الأهداف الاستراتيجية للوكالة الوطنية للبحث العلمي والابتكار", contentAR);
            createOrUpdateTranslation(objectivesPage, Language.EN, 
                "Objectives", "Objectives", 
                "The strategic objectives of the National Agency for Scientific Research and Innovation", contentEN);
        }
        
        // Create strategic-vision page if it doesn't exist
        String defaultContentStrategicVision = """
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
        
        if (!pageRepository.existsBySlug("strategic-vision")) {
            System.out.println("✓ Creating strategic-vision page");
            
            strategicVisionPage = new Page();
            strategicVisionPage.setSlug("strategic-vision");
            strategicVisionPage.setPageType(Page.PageType.STRUCTURED);
            strategicVisionPage.setIsPublished(true);
            strategicVisionPage.setIsActive(true);
            
            strategicVisionPage = pageRepository.save(strategicVisionPage);
            System.out.println("✓ Strategic Vision page created successfully");
        } else {
            strategicVisionPage = pageRepository.findBySlug("strategic-vision").orElse(null);
            System.out.println("✓ Strategic Vision page already exists");
        }
        
        // Create translations for strategic-vision page
        if (strategicVisionPage != null) {
            String contentFR = defaultContentStrategicVision;
            
            // Arabic translation (complete from vision.sql)
            String contentAR = """
                {
                  "heroTitle": "الرؤية الاستراتيجية",
                  "heroSubtitle": "الرؤية والرسالة للوكالة الوطنية للبحث العلمي والابتكار",
                  "visionTitle": "الرؤية",
                  "visionText": "تهدف الوكالة إلى تعزيز القدرات والكفاءات في البحث العلمي لتكون رائدة إقليمياً ومرجعاً في مجال العلوم والتكنولوجيا.",
                  "messageTitle": "الرسالة",
                  "messageText": "دعم الابتكار وتعزيز البحث العلمي لخدمة تنمية البلاد وصناعاتها.",
                  "valuesTitle": "قيمنا",
                  "values": [
                    {
                      "icon": "🔬",
                      "title": "التميز العلمي",
                      "description": "تعزيز الجودة والتميز في جميع مبادرات البحث العلمي"
                    },
                    {
                      "icon": "🤝",
                      "title": "التعاون",
                      "description": "تشجيع التعاون بين الباحثين والمؤسسات والشركاء"
                    },
                    {
                      "icon": "🌱",
                      "title": "الابتكار",
                      "description": "تشجيع الابتكار التكنولوجي والعلمي من أجل التنمية"
                    },
                    {
                      "icon": "🎯",
                      "title": "الأثر",
                      "description": "تعظيم أثر البحث العلمي على المجتمع والاقتصاد"
                    }
                  ]
                }
                """;
            
            // English translation (complete from vision.sql)
            String contentEN = """
                {
                  "heroTitle": "Strategic Vision",
                  "heroSubtitle": "The vision and message of the National Agency for Scientific Research and Innovation",
                  "visionTitle": "Vision",
                  "visionText": "The Agency aims to strengthen research capacities and skills to become a regional leader and a reference in the field of science and technology.",
                  "messageTitle": "Message",
                  "messageText": "Supporting innovation and promoting scientific research to serve the country's development and its industries.",
                  "valuesTitle": "Our Values",
                  "values": [
                    {
                      "icon": "🔬",
                      "title": "Scientific Excellence",
                      "description": "Promoting quality and excellence in all our research initiatives"
                    },
                    {
                      "icon": "🤝",
                      "title": "Collaboration",
                      "description": "Encouraging cooperation among researchers, institutions, and partners"
                    },
                    {
                      "icon": "🌱",
                      "title": "Innovation",
                      "description": "Fostering technological and scientific innovation for development"
                    },
                    {
                      "icon": "🎯",
                      "title": "Impact",
                      "description": "Maximizing the impact of research on society and the economy"
                    }
                  ]
                }
                """;
            
            createOrUpdateTranslation(strategicVisionPage, Language.FR, 
                "Vision Stratégique", "Vision Stratégique", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(strategicVisionPage, Language.AR, 
                "الرؤية الاستراتيجية", "الرؤية الاستراتيجية", 
                "الرؤية والرسالة للوكالة الوطنية للبحث العلمي والابتكار", contentAR);
            createOrUpdateTranslation(strategicVisionPage, Language.EN, 
                "Strategic Vision", "Strategic Vision", 
                "The vision and message of the National Agency for Scientific Research and Innovation", contentEN);
        }
        
        // Create organigramme page if it doesn't exist
        String defaultContentOrganigramme = """
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
        
        if (!pageRepository.existsBySlug("organigramme")) {
            System.out.println("✓ Creating organigramme page");
            
            
            organigrammePage = new Page();
            organigrammePage.setSlug("organigramme");
            organigrammePage.setPageType(Page.PageType.STRUCTURED);
            organigrammePage.setIsPublished(true);
            organigrammePage.setIsActive(true);
            
            organigrammePage = pageRepository.save(organigrammePage);
            System.out.println("✓ Organigramme page created successfully");
        } else {
            organigrammePage = pageRepository.findBySlug("organigramme").orElse(null);
            System.out.println("✓ Organigramme page already exists");
        }
        
        // Create translations for organigramme page
        if (organigrammePage != null) {
            String contentFR = defaultContentOrganigramme;
            
            // Arabic translation (complete from organigramme.sql)
            String contentAR = """
                {
                  "heroTitle": "الهيكل التنظيمي",
                  "heroSubtitle": "الهيكل التنظيمي للوكالة الوطنية للبحث العلمي والابتكار",
                  "sectionTitle": "الهيكل التنظيمي",
                  "introText": "تتبع الوكالة الوطنية للبحث العلمي والابتكار هيكلًا هرميًا لضمان إدارة فعالة للبحث العلمي والابتكار في موريتانيا.",
                  "levels": [
                    {
                      "levelNumber": 1,
                      "positions": [
                        {
                          "icon": "👑",
                          "title": "المجلس الأعلى للبحث العلمي والابتكار",
                          "description": "برئاسة معالي رئيس الوزراء",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 2,
                      "positions": [
                        {
                          "icon": "👔",
                          "title": "الإدارة العامة",
                          "description": "المدير العام للوكالة الوطنية للبحث العلمي والابتكار",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 3,
                      "positions": [
                        {
                          "icon": "🔬",
                          "title": "إدارة البحث العلمي",
                          "description": "إدارة برامج البحث العلمي",
                          "isDirector": false
                        },
                        {
                          "icon": "💡",
                          "title": "إدارة الابتكار",
                          "description": "تعزيز الابتكار التكنولوجي",
                          "isDirector": false
                        },
                        {
                          "icon": "💰",
                          "title": "الإدارة المالية",
                          "description": "إدارة الأموال والميزانيات",
                          "isDirector": false
                        }
                      ]
                    },
                    {
                      "levelNumber": 4,
                      "positions": [
                        {
                          "icon": "📊",
                          "title": "قسم التقييم",
                          "description": "متابعة وتقييم المشاريع",
                          "isDirector": false
                        },
                        {
                          "icon": "🤝",
                          "title": "قسم التعاون",
                          "description": "الشراكات الدولية",
                          "isDirector": false
                        },
                        {
                          "icon": "📋",
                          "title": "القسم الإداري",
                          "description": "الإدارة الإدارية",
                          "isDirector": false
                        },
                        {
                          "icon": "💻",
                          "title": "قسم تكنولوجيا المعلومات",
                          "description": "الدعم الفني والرقمي",
                          "isDirector": false
                        }
                      ]
                    }
                  ],
                  "responsibilitiesTitle": "المسؤوليات الرئيسية",
                  "responsibilities": [
                    {
                      "icon": "🎯",
                      "title": "تحديد الأولويات",
                      "description": "يحدد المجلس الأعلى أولويات البحث والابتكار الوطنية"
                    },
                    {
                      "icon": "📝",
                      "title": "دعوات للمشاريع",
                      "description": "تطلق الوكالة دعوات للمشاريع وفق الأولويات المحددة"
                    },
                    {
                      "icon": "💼",
                      "title": "إدارة الأموال",
                      "description": "تخصيص شفاف وفعال لأموال البحث العلمي"
                    },
                    {
                      "icon": "📈",
                      "title": "المتابعة والتقييم",
                      "description": "المتابعة المستمرة للمشاريع الممولة وتقييم أثرها"
                    }
                  ]
                }
                """;
            
            // English translation (complete from organigramme.sql)
            String contentEN = """
                {
                  "heroTitle": "Organizational Chart",
                  "heroSubtitle": "Organizational structure of the National Agency for Scientific Research and Innovation",
                  "sectionTitle": "Organizational Structure",
                  "introText": "ANRSI is structured hierarchically to ensure effective management of scientific research and innovation in Mauritania.",
                  "levels": [
                    {
                      "levelNumber": 1,
                      "positions": [
                        {
                          "icon": "👑",
                          "title": "High Council for Scientific Research and Innovation",
                          "description": "Chaired by His Excellency the Prime Minister",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 2,
                      "positions": [
                        {
                          "icon": "👔",
                          "title": "General Directorate",
                          "description": "Director General of ANRSI",
                          "isDirector": true
                        }
                      ]
                    },
                    {
                      "levelNumber": 3,
                      "positions": [
                        {
                          "icon": "🔬",
                          "title": "Research Directorate",
                          "description": "Management of research programs",
                          "isDirector": false
                        },
                        {
                          "icon": "💡",
                          "title": "Innovation Directorate",
                          "description": "Promotion of technological innovation",
                          "isDirector": false
                        },
                        {
                          "icon": "💰",
                          "title": "Financial Directorate",
                          "description": "Management of funds and budgets",
                          "isDirector": false
                        }
                      ]
                    },
                    {
                      "levelNumber": 4,
                      "positions": [
                        {
                          "icon": "📊",
                          "title": "Evaluation Department",
                          "description": "Monitoring and evaluation of projects",
                          "isDirector": false
                        },
                        {
                          "icon": "🤝",
                          "title": "Cooperation Department",
                          "description": "International partnerships",
                          "isDirector": false
                        },
                        {
                          "icon": "📋",
                          "title": "Administrative Department",
                          "description": "Administrative management",
                          "isDirector": false
                        },
                        {
                          "icon": "💻",
                          "title": "IT Department",
                          "description": "Technical and digital support",
                          "isDirector": false
                        }
                      ]
                    }
                  ],
                  "responsibilitiesTitle": "Key Responsibilities",
                  "responsibilities": [
                    {
                      "icon": "🎯",
                      "title": "Setting Priorities",
                      "description": "The High Council defines national research and innovation priorities"
                    },
                    {
                      "icon": "📝",
                      "title": "Calls for Projects",
                      "description": "ANRSI launches project calls according to defined priorities"
                    },
                    {
                      "icon": "💼",
                      "title": "Fund Management",
                      "description": "Transparent and efficient allocation of research funds"
                    },
                    {
                      "icon": "📈",
                      "title": "Monitoring and Evaluation",
                      "description": "Continuous monitoring of funded projects and evaluation of their impact"
                    }
                  ]
                }
                """;
            
            createOrUpdateTranslation(organigrammePage, Language.FR, 
                "Organigramme", "Organigramme", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(organigrammePage, Language.AR, 
                "الهيكل التنظيمي", "الهيكل التنظيمي", 
                "الهيكل التنظيمي للوكالة الوطنية للبحث العلمي والابتكار", contentAR);
            createOrUpdateTranslation(organigrammePage, Language.EN, 
                "Organizational Chart", "Organizational Chart", 
                "Organizational structure of the National Agency for Scientific Research and Innovation", contentEN);
        }
        
        // Create conseil-administration page if it doesn't exist
        String defaultContentConseilAdministration = """
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
        
        if (!pageRepository.existsBySlug("conseil-administration")) {
            System.out.println("✓ Creating conseil-administration page");
            
            conseilAdministrationPage = new Page();
            conseilAdministrationPage.setSlug("conseil-administration");
            conseilAdministrationPage.setPageType(Page.PageType.STRUCTURED);
            conseilAdministrationPage.setIsPublished(true);
            conseilAdministrationPage.setIsActive(true);
            
            conseilAdministrationPage = pageRepository.save(conseilAdministrationPage);
            System.out.println("✓ Conseil d'Administration page created successfully");
        } else {
            conseilAdministrationPage = pageRepository.findBySlug("conseil-administration").orElse(null);
            System.out.println("✓ Conseil d'Administration page already exists");
        }
        
        // Create translations for conseil-administration page
        if (conseilAdministrationPage != null) {
            String contentFR = defaultContentConseilAdministration;
            
            // Arabic translation (complete from conseil.sql)
            String contentAR = """
                {
                  "heroTitle": "مجلس الإدارة",
                  "heroSubtitle": "تشكيل مجلس إدارة الوكالة الوطنية للبحث العلمي والابتكار",
                  "sectionTitle": "أعضاء مجلس الإدارة",
                  "introText": "يتكون مجلس إدارة الوكالة الوطنية للبحث العلمي والابتكار من ممثلين عن مؤسسات وقطاعات مختلفة، لضمان حوكمة متوازنة وتمثيلية.",
                  "boardMembers": [
                    {
                      "name": "محمد سيديا خباز",
                      "position": "رئيس مجلس الإدارة"
                    },
                    {
                      "name": "أحمد سالم ولد محمد فادل",
                      "position": "ممثل رئاسة الجمهورية"
                    },
                    {
                      "name": "هدى باباه",
                      "position": "ممثلة رئاسة الوزراء"
                    },
                    {
                      "name": "سعد بوه ولد صيداتي",
                      "position": "ممثل وزارة المالية"
                    },
                    {
                      "name": "محمد يحيى داه",
                      "position": "ممثل وزارة التعليم العالي والبحث العلمي والابتكار"
                    },
                    {
                      "name": "واج أوسمان",
                      "position": "أستاذ باحث"
                    },
                    {
                      "name": "سالم محمد المختار أبيضنا",
                      "position": "أستاذ باحث"
                    },
                    {
                      "name": "هانشي محمد صالح",
                      "position": "ممثل الاتحاد الوطني لأصحاب العمل الموريتانيين"
                    },
                    {
                      "name": "محمد المختار يحيى محمدين",
                      "position": "ممثل الاتحاد الوطني لأصحاب العمل الموريتانيين"
                    },
                    {
                      "name": "وان عبد العزيز",
                      "position": "ممثل غرفة التجارة والصناعة والزراعة في موريتانيا"
                    },
                    {
                      "name": "أحمدو حوبا",
                      "position": "أستاذ باحث"
                    },
                    {
                      "name": "محمدو مبابا",
                      "position": "ممثل وزارة الشؤون الاقتصادية وتشجيع القطاعات الإنتاجية"
                    }
                  ],
                  "updateDate": "11 نوفمبر 2021"
                }
                """;
            
            // English translation (complete from conseil.sql)
            String contentEN = """
                {
                  "heroTitle": "Board of Directors",
                  "heroSubtitle": "Composition of the Board of Directors of the National Agency for Scientific Research and Innovation",
                  "sectionTitle": "Board Members",
                  "introText": "The Board of Directors of ANRSI is composed of representatives from various institutions and sectors, ensuring balanced and representative governance.",
                  "boardMembers": [
                    {
                      "name": "Mohamed Sidiya Khabaz",
                      "position": "Chairman of the Board"
                    },
                    {
                      "name": "AHMED SALEM OULD MOHAMED VADEL",
                      "position": "Representative of the Presidency of the Republic"
                    },
                    {
                      "name": "HOUDA BABAH",
                      "position": "Representative of the Prime Minister's Office"
                    },
                    {
                      "name": "SAAD BOUH OULD SIDATY",
                      "position": "Representative of the Ministry of Finance"
                    },
                    {
                      "name": "Mohamed Yahya Dah",
                      "position": "Representative of the Ministry of Higher Education, Scientific Research and Innovation"
                    },
                    {
                      "name": "WAGUE OUSMANE",
                      "position": "Teacher-Researcher"
                    },
                    {
                      "name": "SALEM MOHAMED EL MOCTAR ABEIDNA",
                      "position": "Teacher-Researcher"
                    },
                    {
                      "name": "HANCHI MOHAMED SALEH",
                      "position": "Representative of the National Union of Mauritanian Employers"
                    },
                    {
                      "name": "MOHAMED EL MOCTAR YAHYA MOHAMEDINE",
                      "position": "Representative of the National Union of Mauritanian Employers"
                    },
                    {
                      "name": "WANE ABDOUL AZIZ",
                      "position": "Representative of the Chamber of Commerce, Industry and Agriculture of Mauritania"
                    },
                    {
                      "name": "AHMEDOU HAOUBA",
                      "position": "Teacher-Researcher"
                    },
                    {
                      "name": "Mohamedou Mbaba",
                      "position": "Representative of the Ministry of Economic Affairs and Promotion of Productive Sectors"
                    }
                  ],
                  "updateDate": "11 November 2021"
                }
                """;
            
            createOrUpdateTranslation(conseilAdministrationPage, Language.FR, 
                "Conseil d'Administration", "Conseil d'Administration", 
                "L'Agence est liée à des institutions d'intérêt commun par le biais d'accords de coopération et de partenariat pour atteindre des objectifs communs.", contentFR);
            createOrUpdateTranslation(conseilAdministrationPage, Language.AR, 
                "مجلس الإدارة", "مجلس الإدارة", 
                "تشكيل مجلس إدارة الوكالة الوطنية للبحث العلمي والابتكار", contentAR);
            createOrUpdateTranslation(conseilAdministrationPage, Language.EN, 
                "Board of Directors", "Board of Directors", 
                "Composition of the Board of Directors of the National Agency for Scientific Research and Innovation", contentEN);
        }
        
        // Create priorites-recherche-2026 page if it doesn't exist
        String defaultContentPrioritesRecherche2026 = """
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
        
        if (!pageRepository.existsBySlug("priorites-recherche-2026")) {
            System.out.println("✓ Creating priorites-recherche-2026 page");
            
            prioritesRecherche2026Page = new Page();
            prioritesRecherche2026Page.setSlug("priorites-recherche-2026");
            prioritesRecherche2026Page.setPageType(Page.PageType.STRUCTURED);
            prioritesRecherche2026Page.setIsPublished(true);
            prioritesRecherche2026Page.setIsActive(true);
            
            prioritesRecherche2026Page = pageRepository.save(prioritesRecherche2026Page);
            System.out.println("✓ Priorités de la Recherche 2026 page created successfully");
        } else {
            prioritesRecherche2026Page = pageRepository.findBySlug("priorites-recherche-2026").orElse(null);
            System.out.println("✓ Priorités de la Recherche 2026 page already exists");
        }
        
        // Create translations for priorites-recherche-2026 page
        if (prioritesRecherche2026Page != null) {
            String contentFR = defaultContentPrioritesRecherche2026;
            
            // Arabic translation (complete from pqges.sql)
            String contentAR = """
                {
                  "heroTitle": "أولويات البحث في أفق 2026",
                  "heroSubtitle": "تحدد الوكالة الوطنية للبحث العلمي والابتكار أولويات البحث العلمي والابتكار لخدمة التنمية الوطنية",
                  "introParagraphs": [
                    "استنادًا إلى الاستراتيجية الوطنية للبحث العلمي والابتكار التي اعتمدتها الحكومة، تنشر الوكالة الوطنية للبحث العلمي والابتكار تفاصيل المحاور السبعة لهذه الاستراتيجية.",
                    "توزَّع هذه المحاور وفق احتياجات التنمية واستجابةً للتحديات الراهنة، لتغطي مجالات متنوعة تمتد من تحقيق الاكتفاء الذاتي الغذائي إلى الرقمنة والتحديات الناشئة مع تطور الذكاء الاصطناعي، مرورًا بالصحة والصناعات الاستخراجية.",
                    "تحظى البحوث الإنسانية والاجتماعية بمكانة مهمة في هذه المحاور، حيث خصصت لها الاستراتيجية محورين يمكن من خلالهما العمل على \\"تثمين المعارف التقليدية الأصيلة لمواجهة التحديات المجتمعية، ومحاربة الهشاشة والفوارق الاجتماعية والإقصاء، وتعزيز الوحدة الوطنية\\"."
                  ],
                  "sectionTitle": "المحاور الاستراتيجية السبعة",
                  "researchPriorities": [
                    {
                      "id": 1,
                      "title": "الاكتفاء الذاتي الغذائي",
                      "description": "تطوير استراتيجيات لضمان الأمن الغذائي الوطني وتقليل الاعتماد على الواردات.",
                      "icon": "fas fa-seedling"
                    },
                    {
                      "id": 2,
                      "title": "الرقمنة والذكاء الاصطناعي",
                      "description": "دمج التقنيات الرقمية والذكاء الاصطناعي لتحديث القطاعات الاقتصادية وتحسين الكفاءة.",
                      "icon": "fas fa-robot"
                    },
                    {
                      "id": 3,
                      "title": "الصحة والرفاه",
                      "description": "تحسين الأنظمة الصحية، الوقاية من الأمراض، وتعزيز رفاه السكان.",
                      "icon": "fas fa-heartbeat"
                    },
                    {
                      "id": 4,
                      "title": "الصناعات الاستخراجية",
                      "description": "تحسين استغلال الموارد الطبيعية بطريقة مستدامة ومسؤولة.",
                      "icon": "fas fa-mountain"
                    },
                    {
                      "id": 5,
                      "title": "البحوث الإنسانية والاجتماعية I",
                      "description": "تثمين المعارف التقليدية الأصيلة لمواجهة التحديات المجتمعية المعاصرة.",
                      "icon": "fas fa-users"
                    },
                    {
                      "id": 6,
                      "title": "البحوث الإنسانية والاجتماعية II",
                      "description": "مكافحة الهشاشة والفوارق الاجتماعية والإقصاء لتعزيز الوحدة الوطنية.",
                      "icon": "fas fa-hands-helping"
                    },
                    {
                      "id": 7,
                      "title": "التنمية المستدامة",
                      "description": "تعزيز الممارسات الصديقة للبيئة والتنمية المستدامة على المدى الطويل.",
                      "icon": "fas fa-leaf"
                    }
                  ],
                  "publicationDate": "18 يناير 2023"
                }
                """;
            
            // English translation (complete from pqges.sql)
            String contentEN = """
                {
                  "heroTitle": "RESEARCH PRIORITIES FOR 2026",
                  "heroSubtitle": "ANRSI defines the priorities for scientific research and innovation for national development",
                  "introParagraphs": [
                    "Based on the national strategy for scientific research and innovation adopted by the Government, the National Agency for Scientific Research and Innovation publishes the details of the seven axes of this strategy.",
                    "These axes are organized according to development needs and in response to current challenges, covering various fields ranging from food self-sufficiency to digitalization and emerging challenges with the rise of artificial intelligence, as well as health and extractive industries.",
                    "Human and social sciences occupy a central place in these axes, as the strategy dedicated two axes to them, enabling efforts toward \\"the promotion of ancestral indigenous knowledge to address societal challenges, combat vulnerability, social disparities and exclusion, and strengthen national unity.\\""
                  ],
                  "sectionTitle": "The Seven Strategic Axes",
                  "researchPriorities": [
                    {
                      "id": 1,
                      "title": "Food Self-Sufficiency",
                      "description": "Development of strategies to ensure national food security and reduce dependence on imports.",
                      "icon": "fas fa-seedling"
                    },
                    {
                      "id": 2,
                      "title": "Digitalization and Artificial Intelligence",
                      "description": "Integration of digital technologies and AI to modernize economic sectors and improve efficiency.",
                      "icon": "fas fa-robot"
                    },
                    {
                      "id": 3,
                      "title": "Health and Well-being",
                      "description": "Improving health systems, disease prevention, and promoting population well-being.",
                      "icon": "fas fa-heartbeat"
                    },
                    {
                      "id": 4,
                      "title": "Extractive Industries",
                      "description": "Optimizing the exploitation of natural resources in a sustainable and responsible manner.",
                      "icon": "fas fa-mountain"
                    },
                    {
                      "id": 5,
                      "title": "Human and Social Research I",
                      "description": "Promoting ancestral indigenous knowledge to face contemporary societal challenges.",
                      "icon": "fas fa-users"
                    },
                    {
                      "id": 6,
                      "title": "Human and Social Research II",
                      "description": "Fighting vulnerability, social disparities, and exclusion to strengthen national unity.",
                      "icon": "fas fa-hands-helping"
                    },
                    {
                      "id": 7,
                      "title": "Sustainable Development",
                      "description": "Promoting environmentally friendly practices and long-term sustainable development.",
                      "icon": "fas fa-leaf"
                    }
                  ],
                  "publicationDate": "18 January 2023"
                }
                """;
            
            createOrUpdateTranslation(prioritesRecherche2026Page, Language.FR, 
                "Priorités de la Recherche 2026", "LES PRIORITÉS DE LA RECHERCHE À L'HORIZON 2026", 
                "L'ANRSI définit les priorités de la recherche scientifique et de l'innovation pour le développement national", contentFR);
            createOrUpdateTranslation(prioritesRecherche2026Page, Language.AR, 
                "أولويات البحث 2026", "أولويات البحث في أفق 2026", 
                "تحدد الوكالة الوطنية للبحث العلمي والابتكار أولويات البحث العلمي والابتكار لخدمة التنمية الوطنية", contentAR);
            createOrUpdateTranslation(prioritesRecherche2026Page, Language.EN, 
                "Research Priorities 2026", "RESEARCH PRIORITIES FOR 2026", 
                "ANRSI defines the priorities for scientific research and innovation for national development", contentEN);
        }
        
        System.out.println("=== DataInitializer: Page initialization complete ===");
    }
    
    private void createOrUpdateTranslation(Page page, Language language, String title, 
                                         String heroTitle, String heroSubtitle, String content) {
        createOrUpdateTranslation(page, language, title, heroTitle, heroSubtitle, null, null, null, content, null);
    }
    
    private void createOrUpdateTranslation(Page page, Language language, String title, 
                                         String heroTitle, String heroSubtitle, 
                                         String sectionTitle, String introText, String description,
                                         String content, String extra) {
        Optional<PageTranslation> existingTranslation = pageTranslationRepository
            .findByPageAndLanguage(page, language);
        
        PageTranslation translation;
        boolean isNew = false;
        
        if (existingTranslation.isPresent()) {
            translation = existingTranslation.get();
            // Check if translation already has meaningful content
            // Only update if content is null, empty, or contains only empty arrays
            if (translation.getContent() != null && !translation.getContent().trim().isEmpty()) {
                try {
                    // Try to parse the content to check if it has actual data
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode contentNode = mapper.readTree(translation.getContent());
                    
                    // Check for common data arrays that indicate the page has user-entered data
                    // Different page types use different array fields:
                    // - appels-candidatures: "appels"
                    // - agence-medias: "mediaLinks", "articleLinks", "recentCoverage"
                    // - ai4agri: "projects", "partners"
                    // - etc.
                    boolean hasData = false;
                    
                    // List of common array fields that indicate user data
                    String[] dataFields = {"appels", "mediaLinks", "articleLinks", "recentCoverage", 
                                          "projects", "partners", "programmes", "videos", "photos",
                                          "objectives", "members", "rapports", "texts", "platforms",
                                          "newsItems", "items", "links", "documents"};
                    
                    for (String field : dataFields) {
                        if (contentNode.has(field) && contentNode.get(field).isArray()) {
                            JsonNode array = contentNode.get(field);
                            if (array.size() > 0) {
                                hasData = true;
                                break;
                            }
                        }
                    }
                    
                    // Also check if content has non-empty string fields beyond just heroTitle/heroSubtitle
                    // This catches cases where users have added custom content
                    if (!hasData) {
                        // Check for meaningful text content (not just default values)
                        if (contentNode.has("introText") && !contentNode.get("introText").asText().trim().isEmpty()) {
                            String introTextValue = contentNode.get("introText").asText().trim();
                            // If introText is longer than 100 chars, likely user-entered
                            if (introTextValue.length() > 100) {
                                hasData = true;
                            }
                        }
                    }
                    
                    if (hasData) {
                        // Translation has data, skip overwriting
                        System.out.println("  ⊘ Translation already has data, skipping update: " + language);
                        return;
                    }
                } catch (Exception e) {
                    // If parsing fails, assume it might have data, so skip overwriting
                    System.out.println("  ⊘ Translation content exists but couldn't parse, skipping update: " + language);
                    return;
                }
            }
            // Translation exists but is empty, update it
            System.out.println("  ↻ Updating existing empty translation: " + language);
        } else {
            // Translation doesn't exist, create new one
            translation = new PageTranslation();
            isNew = true;
            System.out.println("  ✓ Creating new translation: " + language);
        }
        
        translation.setPage(page);
        translation.setLanguage(language);
        translation.setTitle(title);
        translation.setHeroTitle(heroTitle);
        translation.setHeroSubtitle(heroSubtitle);
        translation.setSectionTitle(sectionTitle);
        translation.setIntroText(introText);
        translation.setDescription(description);
        translation.setContent(content);
        translation.setExtra(extra);
        
        pageTranslationRepository.save(translation);
        System.out.println("  ✓ Translation " + (isNew ? "created" : "updated") + ": " + language);
    }
}

