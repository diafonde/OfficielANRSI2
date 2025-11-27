import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface UsefulWebsite {
  id?: number;
  name: string;
  url: string;
  order?: number;
}

@Component({
  selector: 'app-useful-websites',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './useful-websites.component.html',
  styleUrls: ['./useful-websites.component.scss']
})
export class UsefulWebsitesComponent implements OnInit {
  websites: UsefulWebsite[] = [];
  isLoading = true;

  // Default websites as fallback
  private defaultWebsites: UsefulWebsite[] = [
    {
      name: "Ministère l'Enseignement Supérieur et de la Recherche Scientifique(MESRS)",
      url: "https://mesrs.gov.mr/fr"
    },
    {
      name: "Université de Nouakchott Al Aasriya (UNA)",
      url: "https://www.una.mr/"
    },
    {
      name: "École Supérieure Polytechnique de Nouakchott(ESP-Nouakchott)",
      url: "http://www.esp.mr/"
    },
    {
      name: "Université des Sciences Islamiques d'Ayoune (USIA)",
      url: "https://www.usia.mr/"
    },
    {
      name: "Institut Supérieur d'Enseignement Technologique (ISET) Rosso",
      url: "http://www.iset.mr/"
    },
    {
      name: "Institut Mauritanien de Recherche Océanographique et des Pêches (IMROP)",
      url: "https://www.imrop.mr/"
    },
    {
      name: "Agence Nationale de Recherches Géologiques et du Patrimoine Minier (ANARPAM)",
      url: "https://anarpam.mr/"
    },
    {
      name: "Autorité Mauritanienne d'Assurance Qualité de l'Enseignement Supérieur et de la Recherche Scientifique (AMAQ-ES)",
      url: "http://amaqes.mr/?q=node/1435"
    },
    {
      name: "Institut Mauritanien de Recherches et de Formation en Matiére de Patrimoine et de Culture (IMRFPC)",
      url: "http://imrspc.mr/"
    },
    {
      name: "Centre National de Recherche Agronomique et de Développement Agricole (CNRADA)",
      url: "https://www.cnrada.org/"
    },
    {
      name: "GDG Nouakchott",
      url: "https://gdg.community.dev/gdg-nouakchott/"
    },
    {
      name: "Sahel Fablab INNORIM",
      url: "http://www.innovrim.org/"
    }
  ];

  constructor(
    public translate: TranslateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadWebsites();
  }

  loadWebsites(): void {
    this.http.get<UsefulWebsite[]>('/api/useful-websites')
      .pipe(
        catchError((error) => {
          console.warn('Error loading websites from API, using default data:', error);
          // Return default websites if API fails
          return of(this.defaultWebsites);
        })
      )
      .subscribe({
        next: (websites) => {
          this.websites = websites.length > 0 
            ? websites.sort((a, b) => (a.order || 0) - (b.order || 0))
            : this.defaultWebsites;
          this.isLoading = false;
        },
        error: () => {
          this.websites = this.defaultWebsites;
          this.isLoading = false;
        }
      });
  }
}

