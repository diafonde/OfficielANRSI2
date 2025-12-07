import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { AnimatedCounterComponent } from './components/animated-counter/animated-counter.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { filter } from 'rxjs/operators';
import { StatisticsService } from './services/statistics.service';
import { Statistics } from './models/statistics.model';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    HeaderComponent,
    FooterComponent,
    BackToTopComponent,
    AnimatedCounterComponent,
    BreadcrumbsComponent,
    HttpClientModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {
  isAdminRoute: boolean = false;
  statistics: Statistics | null = null;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private statisticsService: StatisticsService
  ) {
    translate.addLangs(['fr', 'ar', 'en']);
    translate.setDefaultLang('fr');
    
    // Check initial route and load appropriate language
    this.checkIfAdminRoute();
    this.loadLanguageForRoute();
    
    // Listen to route changes to restore appropriate language
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const wasAdminRoute = this.isAdminRoute;
        this.checkIfAdminRoute();
        // Only restore language if route type changed (admin <-> public)
        if (wasAdminRoute !== this.isAdminRoute) {
          this.loadLanguageForRoute();
        }
      });
    
    // Listen to language changes to update RTL and save preference based on route
    translate.onLangChange.subscribe(event => {
      document.body.dir = event.lang === 'ar' ? 'rtl' : 'ltr';
      // Save to appropriate localStorage key based on current route
      const storageKey = this.isAdminRoute ? 'admin_preferred_language' : 'public_preferred_language';
      localStorage.setItem(storageKey, event.lang);
    });
  }
  
  checkIfAdminRoute() {
    this.isAdminRoute = this.router.url.startsWith('/admin');
  }

  private loadLanguageForRoute() {
    // Load language preference based on current route
    const storageKey = this.isAdminRoute ? 'admin_preferred_language' : 'public_preferred_language';
    const savedLang = localStorage.getItem(storageKey) || 'fr';
    const langToUse = ['fr', 'ar', 'en'].includes(savedLang) ? savedLang : 'fr';
    this.translate.use(langToUse);
    document.body.dir = langToUse === 'ar' ? 'rtl' : 'ltr';
  }
  
  switchLang(lang: string) {
    this.translate.use(lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  async ngOnInit() {
    try {
      const AOS = await import('aos');
      AOS.init({
        duration: 3000,
        once: false, // animation occurs only once
      });
    } catch (error) {
      console.warn('AOS library could not be loaded:', error);
    }
    
    // Load statistics
    this.loadStatistics();
  }
  
  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        // Use default values if API fails
        this.statistics = {
          researchProjects: 500,
          partnerInstitutions: 50,
          publishedArticles: 2000,
          researchFunding: 250
        };
      }
    });
  }
}