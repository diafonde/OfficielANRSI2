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
  templateUrl: './conseil-administration.component.html',
  styleUrls: ['./conseil-administration.component.scss']
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
