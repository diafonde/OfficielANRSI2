import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class App {
  constructor(public translate: TranslateService) {
    translate.addLangs(['fr', 'ar', 'en']);
    translate.setDefaultLang('fr');
    translate.use('fr');
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
  }
}