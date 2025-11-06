import { Injectable } from '@angular/core';
import { Article } from '../models/article.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articles: Article[] = [
    {
      id: 1,
      title: 'Conférence internationale et atelier de formation sur « La transformation des systèmes alimentaires pour l\'action climatique » (ICTW-FSTCA 2025)',
      excerpt: 'L\'ANRSI organise une conférence internationale majeure sur la transformation des systèmes alimentaires dans le contexte du changement climatique.',
      content: `L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) organise du 15 au 17 mars 2025 une conférence internationale et un atelier de formation sur « La transformation des systèmes alimentaires pour l'action climatique » (ICTW-FSTCA 2025).

Cette conférence réunira des experts internationaux, des chercheurs, des décideurs politiques et des représentants du secteur privé pour discuter des défis et des opportunités liés à la transformation des systèmes alimentaires dans le contexte du changement climatique.

Les thèmes principaux incluront :
- L'adaptation des systèmes agricoles au changement climatique
- L'innovation technologique dans la production alimentaire
- La sécurité alimentaire et nutritionnelle
- Les politiques publiques pour une agriculture durable
- Le rôle de la recherche et de l'innovation

Cette initiative s'inscrit dans le cadre de la stratégie nationale de recherche et d'innovation de la Mauritanie et contribue aux Objectifs de Développement Durable (ODD) des Nations Unies.

La conférence sera l'occasion de présenter les dernières innovations en matière d'agriculture durable, de technologies alimentaires et de politiques publiques adaptées aux défis climatiques. Des ateliers pratiques permettront aux participants de se familiariser avec les nouvelles techniques et approches.

L'ANRSI invite tous les acteurs concernés par la sécurité alimentaire et le développement durable à participer à cet événement majeur qui façonnera l'avenir de l'agriculture en Mauritanie et dans la région.`,
      author: 'ANRSI',
      publishDate: new Date('2025-03-15'),
      category: 'Conférence',
      imageUrl: 'assets/images/Food Systems Transformation for Climate Actions.jpg',
      tags: ['climat', 'agriculture', 'innovation', 'développement durable']
    },
    {
      id: 2,
      title: 'COMSTECH-UTS International Workshop on Renewable Energy: Affordable & Clean Energy for ALL (CURE-ALL)',
      excerpt: 'Workshop international sur les énergies renouvelables organisé en collaboration avec COMSTECH et UTS.',
      content: `L'ANRSI participe activement au COMSTECH-UTS International Workshop on Renewable Energy: Affordable & Clean Energy for ALL (CURE-ALL), qui se déroule du 20 au 22 février 2025.

Ce workshop international vise à promouvoir l'accès à des énergies propres et abordables pour tous, conformément à l'Objectif de Développement Durable 7 (ODD 7). L'événement rassemble des experts en énergies renouvelables, des chercheurs, des ingénieurs et des décideurs politiques.

Les sessions couvriront :
- Technologies solaires et éoliennes
- Systèmes de stockage d'énergie
- Énergies marines renouvelables
- Politiques énergétiques durables
- Financement des projets d'énergie propre

Cette collaboration internationale renforce la position de la Mauritanie dans le domaine des énergies renouvelables et contribue à la transition énergétique du pays.`,
      author: 'ANRSI',
      publishDate: new Date('2025-02-20'),
      category: 'Workshop',
      imageUrl: 'assets/images/316956521_193067849924825_3676114238059618347_n_0.jpg.jpeg',
      tags: ['énergie', 'renouvelable', 'innovation', 'collaboration']
    },
    {
      id: 3,
      title: 'Symposium International sur l\'Innovation Agricole et la Sécurité Alimentaire',
      excerpt: 'L\'ANRSI organise un symposium international sur l\'innovation agricole et la sécurité alimentaire.',
      content: `L'ANRSI organise un symposium international sur l'innovation agricole et la sécurité alimentaire du 25 au 27 janvier 2025. Cet événement réunit des experts internationaux pour discuter des défis de la sécurité alimentaire et des innovations agricoles.

Les thèmes abordés incluent :
- Technologies agricoles innovantes
- Sécurité alimentaire et nutritionnelle
- Adaptation au changement climatique
- Transfert de technologie
- Politiques agricoles durables

Le symposium vise à renforcer la coopération internationale dans le domaine de l'agriculture et à promouvoir l'innovation pour assurer la sécurité alimentaire.`,
      author: 'ANRSI',
      publishDate: new Date('2025-01-25'),
      category: 'Symposium',
      imageUrl: 'assets/images/277154633_374993344636114_8242637262867242236_n_0.jpg.jpeg',
      tags: ['agriculture', 'sécurité alimentaire', 'innovation', 'symposium']
    },
    {
      id: 4,
      title: 'Workshop sur les Technologies Émergentes en Agriculture Durable',
      excerpt: 'Workshop sur les technologies émergentes en agriculture durable.',
      content: `L'ANRSI organise un workshop sur les technologies émergentes en agriculture durable du 20 au 22 janvier 2025. Cet événement présente les dernières innovations technologiques dans le domaine de l'agriculture.

Les technologies présentées incluent :
- Agriculture de précision
- Intelligence artificielle en agriculture
- Capteurs et IoT
- Biotechnologie agricole
- Systèmes d'irrigation intelligents

Le workshop offre une plateforme d'échange entre chercheurs, agriculteurs et décideurs politiques pour promouvoir l'adoption de technologies durables.`,
      author: 'ANRSI',
      publishDate: new Date('2025-01-20'),
      category: 'Workshop',
      imageUrl: 'assets/images/316106463_190420513522892_2157453747881448998_n_0.jpg.jpeg',
      tags: ['technologie', 'agriculture', 'durable', 'innovation']
    },
    {
      id: 5,
      title: 'Conférence sur l\'Économie Circulaire et l\'Innovation Verte',
      excerpt: 'Conférence sur l\'économie circulaire et l\'innovation verte.',
      content: `L'ANRSI organise une conférence sur l'économie circulaire et l'innovation verte du 15 au 17 janvier 2025. Cette conférence explore les opportunités de l'économie circulaire pour le développement durable.

Les sujets abordés incluent :
- Modèles d'économie circulaire
- Innovation verte et technologies propres
- Gestion des déchets et recyclage
- Éco-conception et éco-innovation
- Politiques publiques pour l'économie circulaire

La conférence vise à promouvoir l'adoption de pratiques d'économie circulaire et à stimuler l'innovation verte en Mauritanie.`,
      author: 'ANRSI',
      publishDate: new Date('2025-01-15'),
      category: 'Conférence',
      imageUrl: 'assets/images/317490772_193067789924831_7216683787711679640_n_0.jpg.jpeg',
      tags: ['économie circulaire', 'innovation verte', 'développement durable']
    },
    {
      id: 6,
      title: 'Atelier sur les Technologies de l\'Information et de la Communication',
      excerpt: 'Atelier sur les technologies de l\'information et de la communication.',
      content: `L'ANRSI organise un atelier sur les technologies de l'information et de la communication du 10 au 12 janvier 2025. Cet atelier présente les dernières innovations en TIC.

Les technologies présentées incluent :
- Intelligence artificielle et machine learning
- Internet des objets (IoT)
- Blockchain et technologies distribuées
- Cybersécurité
- Transformation numérique

L'atelier vise à renforcer les capacités en TIC et à promouvoir l'innovation technologique en Mauritanie.`,
      author: 'ANRSI',
      publishDate: new Date('2025-01-10'),
      category: 'Atelier',
      imageUrl: 'assets/images/345629408_538652838484184_3414476345157867834_n_1.jpg.jpeg',
      tags: ['TIC', 'innovation', 'technologie', 'transformation numérique']
    },
    {
      id: 7,
      title: 'Conférence Internationale sur le Développement Durable et l\'Innovation',
      excerpt: 'Conférence internationale sur le développement durable et l\'innovation.',
      content: `L'ANRSI organise une conférence internationale sur le développement durable et l'innovation du 5 au 7 janvier 2025. Cette conférence explore les liens entre innovation et développement durable.

Les thèmes abordés incluent :
- Innovation pour le développement durable
- Objectifs de développement durable (ODD)
- Technologies vertes et propres
- Partenariats public-privé
- Financement de l'innovation durable

La conférence vise à promouvoir l'innovation comme moteur du développement durable et à renforcer la coopération internationale.`,
      author: 'ANRSI',
      publishDate: new Date('2025-01-05'),
      category: 'Conférence',
      imageUrl: 'assets/images/IMG_1702AAA.jpg.jpeg',
      tags: ['développement durable', 'innovation', 'ODD', 'coopération']
    },
    {
      id: 8,
      title: 'Workshop sur les Énergies Renouvelables et l\'Efficacité Énergétique',
      excerpt: 'Workshop sur les énergies renouvelables et l\'efficacité énergétique.',
      content: `L'ANRSI organise un workshop sur les énergies renouvelables et l'efficacité énergétique du 28 au 30 décembre 2024. Cet événement présente les dernières innovations en matière d'énergie.

Les technologies présentées incluent :
- Énergie solaire et éolienne
- Systèmes de stockage d'énergie
- Efficacité énergétique
- Smart grids et réseaux intelligents
- Énergies marines renouvelables

Le workshop vise à promouvoir l'adoption d'énergies renouvelables et à améliorer l'efficacité énergétique en Mauritanie.`,
      author: 'ANRSI',
      publishDate: new Date('2024-12-28'),
      category: 'Workshop',
      imageUrl: 'assets/images/IMG_1738DDDDDDDDD.jpg.jpeg',
      tags: ['énergie renouvelable', 'efficacité énergétique', 'innovation']
    },
    {
      id: 9,
      title: 'Symposium sur l\'Innovation Technologique et le Transfert de Technologie',
      excerpt: 'Symposium sur l\'innovation technologique et le transfert de technologie.',
      content: `L'ANRSI organise un symposium sur l'innovation technologique et le transfert de technologie du 20 au 22 décembre 2024. Ce symposium explore les mécanismes de transfert de technologie.

Les sujets abordés incluent :
- Mécanismes de transfert de technologie
- Propriété intellectuelle et innovation
- Partenariats technologiques
- Commercialisation de la recherche
- Politiques d'innovation

Le symposium vise à renforcer les capacités de transfert de technologie et à promouvoir l'innovation en Mauritanie.`,
      author: 'ANRSI',
      publishDate: new Date('2024-12-20'),
      category: 'Symposium',
      imageUrl: 'assets/images/WhatsApp Image 2025-08-09 at 15.03.01.jpeg',
      tags: ['innovation', 'transfert de technologie', 'propriété intellectuelle']
    },
    {
      id: 10,
      title: 'Conférence sur la Recherche Scientifique et l\'Innovation en Mauritanie',
      excerpt: 'Conférence sur la recherche scientifique et l\'innovation en Mauritanie.',
      content: `L'ANRSI organise une conférence sur la recherche scientifique et l'innovation en Mauritanie du 15 au 17 décembre 2024. Cette conférence présente les réalisations et défis de la recherche en Mauritanie.

Les thèmes abordés incluent :
- État de la recherche scientifique en Mauritanie
- Défis et opportunités de l'innovation
- Financement de la recherche
- Coopération internationale en recherche
- Politiques de recherche et d'innovation

La conférence vise à renforcer le système national de recherche et d'innovation et à promouvoir l'excellence scientifique.`,
      author: 'ANRSI',
      publishDate: new Date('2024-12-15'),
      category: 'Conférence',
      imageUrl: 'assets/images/WhatsApp Image 2025-08-18 at 14.48.29.jpeg',
      tags: ['recherche scientifique', 'innovation', 'Mauritanie', 'excellence']
    }
  ];

  getAllArticles(): Observable<Article[]> {
    return of(this.articles).pipe(delay(300));
  }

  getFeaturedArticles(): Observable<Article[]> {
    // Since we removed the featured property, return first 3 articles as featured
    return of(this.articles.slice(0, 3)).pipe(delay(300));
  }

  getRecentArticles(): Observable<Article[]> {
    return of([...this.articles]
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, 10) // Return 10 articles so slideshow can work
    ).pipe(delay(300));
  }

  getArticleById(id: number): Observable<Article | undefined> {
    return of(this.articles.find(article => article.id === id));
  }

  searchArticles(searchTerm: string): Observable<Article[]> {
    const filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    return of(filteredArticles).pipe(delay(300));
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    const filteredArticles = this.articles.filter(article =>
      article.category.toLowerCase() === category.toLowerCase()
    );
    return of(filteredArticles).pipe(delay(300));
  }
}