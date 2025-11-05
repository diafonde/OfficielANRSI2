import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdminLoginComponent } from './components/login/admin-login.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard.component';
import { AdminArticlesComponent } from './components/articles/admin-articles.component';
import { AdminArticleFormComponent } from './components/articles/admin-article-form.component';
import { AdminUsersComponent } from './components/users/admin-users.component';

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
          }
        ]
      }
    ]
  }
];
