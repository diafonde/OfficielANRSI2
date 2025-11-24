import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdminLoginComponent } from './components/login/admin-login.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { AdminArticlesComponent } from './components/articles/admin-articles.component';
import { AdminArticleFormComponent } from './components/admin-article-form/admin-article-form.component';
import { AdminUsersComponent } from './components/users/admin-users.component';
import { AdminPagesComponent } from './components/pages/admin-pages.component';
import { AdminPageFormComponent } from './components/pages/admin-page-form.component';
import { AdminAgenceMediasFormComponent } from './components/agence-medias/admin-agence-medias-form.component';
import { AdminZoneHumideFormComponent } from './components/zone-humide/admin-zone-humide-form.component';
import { AdminPlateformesFormComponent } from './components/plateformes/admin-plateformes-form.component';
import { AdminAppelsCandidaturesFormComponent } from './components/appels-candidatures/admin-appels-candidatures-form.component';
import { AdminAi4agriFormComponent } from './components/ai4agri/admin-ai4agri-form.component';
import { AdminExpertAnrsiFormComponent } from './components/expert-anrsi/admin-expert-anrsi-form.component';
import { AdminCooperationFormComponent } from './components/cooperation/admin-cooperation-form.component';
import { AdminProgrammesFormComponent } from './components/programmes/admin-programmes-form.component';
import { AdminFinancementFormComponent } from './components/financement/admin-financement-form.component';
import { AdminVideosFormComponent } from './components/videos/admin-videos-form.component';
import { AdminObjectivesFormComponent } from './components/objectives/admin-objectives-form.component';
import { AdminStrategicVisionFormComponent } from './components/strategic-vision/admin-strategic-vision-form.component';
import { AdminOrganigrammeFormComponent } from './components/organigramme/admin-organigramme-form.component';
import { AdminConseilAdministrationFormComponent } from './components/conseil-administration/admin-conseil-administration-form.component';
import { AdminPrioritesRecherche2026FormComponent } from './components/priorites-recherche-2026/admin-priorites-recherche-2026-form.component';
import { AdminRapportsAnnuelsFormComponent } from './components/rapports-annuels/admin-rapports-annuels-form.component';
import { AdminTextsJuridiquesFormComponent } from './components/texts-juridiques/admin-texts-juridiques-form.component';
import { AdminPartnersFormComponent } from './components/partners/admin-partners-form.component';
import { AdminStatisticsComponent } from './components/statistics/admin-statistics.component';
import { AdminContactMessagesComponent } from './components/contact-messages/admin-contact-messages.component';



export const adminRoutes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            component: AdminDashboardComponent
          },
          {
            path: 'articles',
            component: AdminArticlesComponent
          },
          {
            path: 'articles/new',
            component: AdminArticleFormComponent
          },
          {
            path: 'articles/edit/:id',
            component: AdminArticleFormComponent
          },
          {
            path: 'users',
            component: AdminUsersComponent
          },
          {
            path: 'pages',
            component: AdminPagesComponent
          },
          {
            path: 'pages/new',
            component: AdminPageFormComponent
          },
          {
            path: 'pages/edit/:id',
            component: AdminPageFormComponent
          },
          {
            path: 'agence-medias',
            component: AdminAgenceMediasFormComponent
          },
          {
            path: 'zone-humide',
            component: AdminZoneHumideFormComponent
          },
          {
            path: 'plateformes',
            component: AdminPlateformesFormComponent
          },
          {
            path: 'appels-candidatures',
            component: AdminAppelsCandidaturesFormComponent
          },
          {
            path: 'ai4agri',
            component: AdminAi4agriFormComponent
          },
          {
            path: 'expert-anrsi',
            component: AdminExpertAnrsiFormComponent
          },
          {
            path: 'cooperation',
            component: AdminCooperationFormComponent
          },
          {
            path: 'programmes',
            component: AdminProgrammesFormComponent
          },
          {
            path: 'financement',
            component: AdminFinancementFormComponent
          },
          {
            path: 'videos',
            component: AdminVideosFormComponent
          },
          {
            path: 'objectives',
            component: AdminObjectivesFormComponent
          },
          {
            path: 'strategic-vision',
            component: AdminStrategicVisionFormComponent
          },
          {
            path: 'organigramme',
            component: AdminOrganigrammeFormComponent
          },
          {
            path: 'conseil-administration',
            component: AdminConseilAdministrationFormComponent
          },
          {
            path: 'priorites-recherche-2026',
            component: AdminPrioritesRecherche2026FormComponent
          },
          {
            path: 'rapports-annuels',
            component: AdminRapportsAnnuelsFormComponent
          },
          {
            path: 'texts-juridiques',
            component: AdminTextsJuridiquesFormComponent
          },
          {
            path: 'partners',
            component: AdminPartnersFormComponent
          },
          {
            path: 'statistics',
            component: AdminStatisticsComponent
          },
          {
            path: 'contact-messages',
            component: AdminContactMessagesComponent
          }
        ]
      }
    ]
  }
];
