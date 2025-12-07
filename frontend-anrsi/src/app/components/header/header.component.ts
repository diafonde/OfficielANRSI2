import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  scrolled = false;
  mobileMenuOpen = false;
  currentLang = 'fr';
  dropdownOpen: string | null = null;

  constructor(public translate: TranslateService) {
    // Get saved language from public preference localStorage
    const savedLang = localStorage.getItem('public_preferred_language') || 'fr';
    if (['fr', 'ar', 'en'].includes(savedLang)) {
      this.currentLang = savedLang;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
    // Add/remove class to body for CSS targeting
    if (this.scrolled) {
      document.body.classList.add('header-scrolled');
    } else {
      document.body.classList.remove('header-scrolled');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    if (!dropdown) {
      this.dropdownOpen = null;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  togglePresentationDropdown() {
    this.dropdownOpen = this.dropdownOpen === 'presentation' ? null : 'presentation';
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'fr' ? 'ar' : 'fr';
    this.translate.use(this.currentLang);
    document.body.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    // Save to public-specific localStorage key
    localStorage.setItem('public_preferred_language', this.currentLang);
  }
}