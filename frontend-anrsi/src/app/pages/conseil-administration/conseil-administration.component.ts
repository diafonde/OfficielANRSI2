import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface BoardMember {
  name: string;
  position: string;
}

@Component({
  selector: 'app-conseil-administration',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="board-hero">
      <div class="container">
        <h1>Conseil d'Administration</h1>
        <p>{{ 'Composition du Conseil d\'Administration de l\'Agence Nationale de la Recherche Scientifique et de l\'Innovation' | translate }}</p>
      </div>
      <div class="hero-overlay"></div>
    </div>
    
    <div class="container">
      <section class="section board-section">
        <div class="board-content">
          <h2>{{ 'Membres du Conseil d\'Administration' | translate }}</h2>
          <p class="board-intro">Le Conseil d'Administration de l'ANRSI est composé de représentants de différentes institutions et secteurs, assurant une gouvernance équilibrée et représentative.</p>
          
          <div class="board-members">
            <div class="board-member" *ngFor="let member of boardMembers">
              <div class="member-info">
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-position">{{ member.position }}</p>
              </div>
            </div>
          </div>
          
          <div class="board-date">
            <p><strong>{{ 'Date de mise à jour' | translate }} :</strong> 11 Novembre 2021</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .board-hero {
      position: relative;
      height: 300px;
      background-image: url('../../../assets/images/anrsiback.png');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      color: white;
      margin-top: 60px;
    }
    
    .board-hero .container {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .board-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: var(--space-3);
      color: white;
    }
    
    .board-hero p {
      font-size: clamp(1.1rem, 2vw, 1.5rem);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, rgba(10, 61, 98, 0.8), rgba(10, 61, 98, 0.6));
      z-index: 1;
    }
    
    .board-section {
      padding: var(--space-12) 0;
    }
    
    .board-content h2 {
      text-align: center;
      color: var(--primary-600);
      margin-bottom: var(--space-6);
      font-size: var(--text-3xl);
    }
    
    .board-intro {
      text-align: center;
      color: var(--neutral-700);
      font-size: var(--text-lg);
      max-width: 800px;
      margin: 0 auto var(--space-8);
      line-height: 1.6;
    }
    
    .board-members {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }
    
    .board-member {
      background: white;
      border-radius: 12px;
      padding: var(--space-6);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-left: 4px solid var(--primary-500);
    }
    
    .board-member:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .member-name {
      color: var(--primary-600);
      margin-bottom: var(--space-2);
      font-size: var(--text-lg);
      font-weight: 600;
    }
    
    .member-position {
      color: var(--neutral-700);
      line-height: 1.5;
      font-size: var(--text-sm);
    }
    
    .board-date {
      text-align: center;
      padding: var(--space-4);
      background: var(--neutral-100);
      border-radius: 8px;
      color: var(--neutral-600);
    }
    
    @media (max-width: 768px) {
      .board-members {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }
      
      .board-member {
        padding: var(--space-4);
      }
      
      .member-name {
        font-size: var(--text-base);
      }
      
      .member-position {
        font-size: var(--text-xs);
      }
    }
    
    @media (max-width: 480px) {
      .board-members {
        grid-template-columns: 1fr;
      }
      
      .board-member {
        padding: var(--space-3);
      }
    }
  `]
})
export class ConseilAdministrationComponent {
  boardMembers: BoardMember[] = [
    {
      name: "Mohamed Sidiya Khabaz",
      position: "Président du CA"
    },
    {
      name: "AHMED SALEM OULD MOHAMED VADEL",
      position: "Représentant de la Présidence de la République"
    },
    {
      name: "HOUDA BABAH",
      position: "Représentante du Premier Ministère"
    },
    {
      name: "SAAD BOUH OULD SIDATY",
      position: "Représentant du Ministère des Finances"
    },
    {
      name: "Mohamed Yahya Dah",
      position: "Représentant du Ministère de l'Enseignement Supérieur, de la Recherche Scientifique et de l'Innovation"
    },
    {
      name: "WAGUE OUSMANE",
      position: "Enseignant-chercheur"
    },
    {
      name: "SALEM MOHAMED EL MOCTAR ABEIDNA",
      position: "Enseignant-chercheur"
    },
    {
      name: "HANCHI MOHAMED SALEH",
      position: "Représentant de l'Union Nationale du Patronat Mauritanien"
    },
    {
      name: "MOHAMED EL MOCTAR YAHYA MOHAMEDINE",
      position: "Représentant de l'Union Nationale du Patronat Mauritanien"
    },
    {
      name: "WANE ABDOUL AZIZ",
      position: "Représentant de la Chambre de Commerce, d'Industrie et d'Agriculture de Mauritanie"
    },
    {
      name: "AHMEDOU HAOUBA",
      position: "Enseignant-chercheur"
    },
    {
      name: "Mohamedou Mbaba",
      position: "Représentant du Ministère des Affaires Economiques et de la Promotion des secteurs Productifs"
    }
  ];
}
