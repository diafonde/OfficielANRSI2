import { Component, HostListener, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {
  scrolled = false;
  currentLang = 'fr';
  isLangDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(public translate: TranslateService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Get saved language from localStorage
    const savedLang = localStorage.getItem('preferred_language') || 'fr';
    if (['fr', 'ar', 'en'].includes(savedLang)) {
      this.currentLang = savedLang;
      this.translate.use(savedLang);
      document.body.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  ngOnDestroy() {
    // Cleanup
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
      this.isLangDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Check for language dropdown
    const isClickInsideDropdown = target.closest('.language-dropdown');
    if (!isClickInsideDropdown) {
      this.isLangDropdownOpen = false;
    }
    
    // Check if click is on mobile menu toggle button or inside it
    const isClickOnToggle = target.closest('.mobile-menu-toggle');
    if (isClickOnToggle) {
      // Don't close the menu, let the toggle handler do its job
      return;
    }
    
    // Check if click is inside mobile quick links (the expanded menu)
    const isClickInsideMenu = target.closest('.mobile-quick-links');
    if (isClickInsideMenu) {
      // Don't close the menu when clicking on links
      return;
    }
    
    // Close mobile menu when clicking outside
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.cdr.detectChanges();
    }
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('preferred_language', lang); // Save to localStorage
    this.isLangDropdownOpen = false;
  }

  toggleLangDropdown() {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  getLanguageFlag(lang: string): string {
    const flags: { [key: string]: string } = {
      'fr': '🇫🇷',
      'ar': '🇲🇷',
      'en': '🇺🇸'
    };
    return flags[lang] || '🇺🇸';
  }

  getLanguageName(lang: string): string {
    const names: { [key: string]: string } = {
      'fr': 'Fr',
      'ar': 'ar',
      'en': 'En'
    };
    return names[lang] || 'En';
  }

  toggleMobileMenu(event?: Event) {
    // Stop event propagation to prevent document click handler from interfering
    if (event) {
      event.stopPropagation();
    }
    
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.cdr.detectChanges();
  }

  closeMobileMenu(event?: Event) {
    // Stop event propagation to prevent document click handler from interfering
    if (event) {
      event.stopPropagation();
    }
    this.isMobileMenuOpen = false;
    this.cdr.detectChanges();
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
