import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageService, PageDTO } from '../../services/page.service';

interface TextJuridique {
  title: string;
  description?: string;
  downloadUrl?: string;
}

interface TextsJuridiquesContent {
  heroTitle: string;
  heroSubtitle: string;
  sectionTitle: string;
  texts: TextJuridique[];
}

@Component({
  selector: 'app-texts-juridiques',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './texts-juridiques.component.html',
  styleUrls: ['./texts-juridiques.component.scss']
})
export class TextsJuridiquesComponent implements OnInit {
  page: PageDTO | null = null;
  heroTitle: string = '';
  heroSubtitle: string = '';
  sectionTitle: string = '';
  texts: TextJuridique[] = [];
  isLoading = true;

  constructor(private pageService: PageService) {}
  
  defaultTexts: TextJuridique[] = [
    {
      title: 'Décret n:2020-066/PM/M.E.S.R.S.T.I.C/M.F/ portant création d\'un établissement public à caractère administratif dénommé, Agence nationale de la recherche scientifique et de l\'innovation et fixant les régles de son organisation et de son fonctionnement',
      downloadUrl: '/uploads/decret-2020-066.pdf'
    },
    {
      title: 'Arrêté conjoint n:001102/MF/MESRSTIC fixant le nomenclature des recettes et dépenses et le montant pour chaque dépense du compte d\'affectation spéciale de la recherche scientifique et l\'innovation.',
      downloadUrl: '/uploads/arrete-001102.pdf'
    },
    {
      title: 'Décret n: 2015-119 / PM/2015 fixant la composition et le fonctionnement du conseil national de l\'Enseignement Supérieur et de la recherche scientifique (CNESRS).',
      downloadUrl: '/uploads/decret-2015-119.pdf'
    },
    {
      title: 'Arrêté n:0316 / MESRS, fixant les régles d\'organisation des des sociétés savantes',
      downloadUrl: '/uploads/arrete-0316.pdf'
    },
    {
      title: 'Décret n: 2020-070/PM portant modification de certaines dispositions du décret n:2006-126 portant statut des enseignants chercheurs universitaires et hospitalo-universitaires modifié par le décret n:2019-115/PM du 11 juin 2019',
      downloadUrl: '/uploads/decret-2020-070.pdf'
    },
    {
      title: 'Décret n:2017-093/PM/MESRS/CI/2017, portant création de ( l\'autorité mauritanienne d\'Assurance-qualité de l\'enseignement supérieur ) et fixant les régles de son organisation et fonctionnement .',
      downloadUrl: '/uploads/decret-2017-093.pdf'
    },
    {
      title: 'Arrêté n:0863/ portant création des écoles doctorales à L\'Université de nouakchott AL-Aasriya et fixant leur organisation et leurs régles de fonctionnement',
      downloadUrl: '/uploads/arrete-0863.pdf'
    }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.pageService.getPageBySlug('texts-juridiques').subscribe({
      next: (page) => {
        this.page = page;
        this.parseContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading page:', error);
        this.loadDefaultContent();
        this.isLoading = false;
      }
    });
  }

  parseContent(): void {
    if (!this.page?.content) {
      this.loadDefaultContent();
      return;
    }

    try {
      const content: TextsJuridiquesContent = JSON.parse(this.page.content);
      
      this.heroTitle = content.heroTitle || 'Textes Juridiques';
      this.heroSubtitle = content.heroSubtitle || 'Textes juridiques régissant l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
      this.sectionTitle = content.sectionTitle || 'Textes Juridiques';
      this.texts = content.texts || this.defaultTexts;
    } catch (e) {
      console.error('Error parsing content:', e);
      this.loadDefaultContent();
    }
  }

  loadDefaultContent(): void {
    this.heroTitle = 'Textes Juridiques';
    this.heroSubtitle = 'Textes juridiques régissant l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation';
    this.sectionTitle = 'Textes Juridiques';
    this.texts = this.defaultTexts;
  }

  downloadText(text: TextJuridique): void {
    if (text.downloadUrl) {
      window.open(text.downloadUrl, '_blank');
    }
  }
}

