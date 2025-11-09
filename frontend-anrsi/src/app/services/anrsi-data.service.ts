import { Injectable } from '@angular/core';

export interface ANRSIArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  publicationDate: Date;
  tags: string[];
  featured: boolean;
}

export interface ANRSIEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
  type: 'conference' | 'workshop' | 'meeting' | 'participation';
}

export interface ANRSIVideo {
  id: number;
  title: string;
  url: string;
  type?: 'youtube' | 'file';
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string; // Deprecated: use 'url' instead
  duration?: string;
  speaker?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ANRSIDataService {
  
  // Articles based on ANRSI website content
  articles: ANRSIArticle[] = [
    {
      id: 6,
      title: 'Conférence internationale et atelier de formation sur « La transformation des systèmes alimentaires pour l\'action climatique » (ICTW-FSTCA 2025)',
      summary: 'L\'ANRSI organise une conférence internationale majeure sur la transformation des systèmes alimentaires dans le contexte du changement climatique.',
      content: `L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) organise du 15 au 17 mars 2025 une conférence internationale et un atelier de formation sur « La transformation des systèmes alimentaires pour l'action climatique » (ICTW-FSTCA 2025).

Cette conférence réunira des experts internationaux, des chercheurs, des décideurs politiques et des représentants du secteur privé pour discuter des défis et des opportunités liés à la transformation des systèmes alimentaires dans le contexte du changement climatique.

Les thèmes principaux incluront :
- L'adaptation des systèmes agricoles au changement climatique
- L'innovation technologique dans la production alimentaire
- La sécurité alimentaire et nutritionnelle
- Les politiques publiques pour une agriculture durable
- Le rôle de la recherche et de l'innovation

Cette initiative s'inscrit dans le cadre de la stratégie nationale de recherche et d'innovation de la Mauritanie et contribue aux Objectifs de Développement Durable (ODD) des Nations Unies.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/conference_internationale.jpg',
      category: 'Conférence',
      author: 'ANRSI',
      publicationDate: new Date('2025-01-15'),
      tags: ['climat', 'agriculture', 'innovation', 'développement durable'],
      featured: true
    },
    {
      id: 1,
      title: 'Conférence internationale et atelier de formation sur « La transformation des systèmes alimentaires pour l\'action climatique » (ICTW-FSTCA 2025)',
      summary: 'L\'ANRSI organise une conférence internationale majeure sur la transformation des systèmes alimentaires dans le contexte du changement climatique.',
      content: `L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) organise du 15 au 17 mars 2025 une conférence internationale et un atelier de formation sur « La transformation des systèmes alimentaires pour l'action climatique » (ICTW-FSTCA 2025).

Cette conférence réunira des experts internationaux, des chercheurs, des décideurs politiques et des représentants du secteur privé pour discuter des défis et des opportunités liés à la transformation des systèmes alimentaires dans le contexte du changement climatique.

Les thèmes principaux incluront :
- L'adaptation des systèmes agricoles au changement climatique
- L'innovation technologique dans la production alimentaire
- La sécurité alimentaire et nutritionnelle
- Les politiques publiques pour une agriculture durable
- Le rôle de la recherche et de l'innovation

Cette initiative s'inscrit dans le cadre de la stratégie nationale de recherche et d'innovation de la Mauritanie et contribue aux Objectifs de Développement Durable (ODD) des Nations Unies.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/conference_internationale.jpg',
      category: 'Conférence',
      author: 'ANRSI',
      publicationDate: new Date('2025-01-15'),
      tags: ['climat', 'agriculture', 'innovation', 'développement durable'],
      featured: true
    },
    {
      id: 2,
      title: 'COMSTECH-UTS International Workshop on Renewable Energy: Affordable & Clean Energy for ALL (CURE-ALL)',
      summary: 'Workshop international sur les énergies renouvelables organisé en collaboration avec COMSTECH et UTS.',
      content: `L'ANRSI participe activement au COMSTECH-UTS International Workshop on Renewable Energy: Affordable & Clean Energy for ALL (CURE-ALL), qui se déroule du 20 au 22 février 2025.

Ce workshop international vise à promouvoir l'accès à des énergies propres et abordables pour tous, conformément à l'Objectif de Développement Durable 7 (ODD 7). L'événement rassemble des experts en énergies renouvelables, des chercheurs, des ingénieurs et des décideurs politiques.

Les sessions couvriront :
- Technologies solaires et éoliennes
- Systèmes de stockage d'énergie
- Énergies marines renouvelables
- Politiques énergétiques durables
- Financement des projets d'énergie verte
- Formation et renforcement des capacités

La Mauritanie, avec son potentiel important en énergies renouvelables, notamment solaire et éolienne, joue un rôle clé dans cette initiative régionale.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/workshop_energie_renouvelable.jpg',
      category: 'Workshop',
      author: 'ANRSI',
      publicationDate: new Date('2025-02-20'),
      tags: ['énergie renouvelable', 'COMSTECH', 'UTS', 'développement durable'],
      featured: true
    },
    {
      id: 3,
      title: 'Lancement de l\'édition 2025 de SEE PAKISTAN avec une participation mauritanienne',
      summary: 'La Mauritanie participe activement à l\'événement international SEE PAKISTAN à Lahore.',
      content: `L'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) est fière d'annoncer la participation de la Mauritanie à l'édition 2025 de SEE PAKISTAN, qui se déroule à Lahore du 10 au 12 mars 2025.

SEE PAKISTAN (Science, Education, and Economy) est un événement international majeur qui rassemble des experts en science, éducation et économie pour discuter des défis mondiaux et des opportunités de collaboration.

La délégation mauritanienne, dirigée par l'ANRSI, présentera :
- Les priorités de recherche nationales à l'horizon 2026
- Les projets d'innovation en cours
- Les opportunités de coopération internationale
- Le potentiel de la Mauritanie en matière de recherche scientifique

Cette participation renforce les liens de coopération entre la Mauritanie et le Pakistan dans les domaines de la science, de la technologie et de l'innovation.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/see_pakistan_2025.jpg',
      category: 'Participation Internationale',
      author: 'ANRSI',
      publicationDate: new Date('2025-03-10'),
      tags: ['Pakistan', 'coopération internationale', 'science', 'innovation'],
      featured: true
    },
    {
      id: 4,
      title: 'L\'ANRSI participe à une conférence internationale sur « l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable »',
      summary: 'Participation de l\'ANRSI à une conférence internationale sur l\'autonomisation des jeunes pour les ODD.',
      content: `L'ANRSI participe activement à une conférence internationale sur « l'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable », qui se déroule du 25 au 27 février 2025.

Cette conférence internationale met l'accent sur le rôle crucial des jeunes dans la réalisation des Objectifs de Développement Durable (ODD) des Nations Unies. Elle rassemble des jeunes leaders, des chercheurs, des décideurs politiques et des représentants d'organisations internationales.

Les thèmes abordés incluent :
- L'éducation et la formation des jeunes
- L'entrepreneuriat et l'innovation sociale
- La participation citoyenne des jeunes
- Les technologies numériques au service du développement
- Le leadership et l'engagement communautaire

L'ANRSI présente ses initiatives en faveur de la jeunesse mauritanienne, notamment les programmes de formation, les bourses de recherche et les opportunités d'innovation.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/autonomisation_jeunes.jpg',
      category: 'Conférence',
      author: 'ANRSI',
      publicationDate: new Date('2025-02-25'),
      tags: ['jeunesse', 'ODD', 'autonomisation', 'développement'],
      featured: true
    },
    {
      id: 5,
      title: 'Le Directeur Général de l\'ANRSI reçoit le Doyen de la Faculté de Médecine, de Pharmacie et d\'Odontostomatologie de Nouakchott',
      summary: 'Rencontre importante entre l\'ANRSI et la Faculté de Médecine pour renforcer la collaboration en recherche médicale.',
      content: `Le Directeur Général de l'Agence Nationale de la Recherche Scientifique et de l'Innovation (ANRSI) a reçu le Doyen de la Faculté de Médecine, de Pharmacie et d'Odontostomatologie de Nouakchott dans le cadre d'une rencontre de travail le 15 février 2025.

Cette rencontre s'inscrit dans le cadre du renforcement de la collaboration entre l'ANRSI et les institutions universitaires mauritaniennes, particulièrement dans le domaine de la recherche médicale et pharmaceutique.

Les discussions ont porté sur :
- Le développement de projets de recherche conjoints
- La formation des chercheurs en médecine
- L'innovation dans le domaine pharmaceutique
- Les partenariats internationaux en santé
- Le financement de la recherche médicale

Cette collaboration renforce le rôle de l'ANRSI dans le développement de la recherche médicale en Mauritanie et contribue à améliorer la qualité des soins de santé.`,
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/directeur_faculte_medecine.jpg',
      category: 'Rencontre',
      author: 'ANRSI',
      publicationDate: new Date('2025-02-15'),
      tags: ['médecine', 'université', 'collaboration', 'recherche médicale'],
      featured: false
    }
  ];

  // Videos based on ANRSI website content
  videos: ANRSIVideo[] = [
  {
    id: 1,
    title: "Présentation de l'Agence",
    url: "https://www.youtube.com/embed/EMgwHc1F5W8",
    type: "youtube"
  },
  {
    id: 2,
    title: "Recherche Scientifique",
    url: "https://youtube.com/embed/bC2FLWuHTbI",
    type: "youtube"
  },
  {
    id: 3,
    title: "Nouvelles Technologies",
    url: "https://youtube.com/embed/4PupAG-vJnk",
    type: "youtube"
  },
  {
    id: 4,
    title: "Nouvelles Technologies",
    url: "https://youtube.com/embed/0yeNSWbl5MY",
    type: "youtube"
  }

  
  ];

  // Events based on ANRSI website content
  events: ANRSIEvent[] = [
    {
      id: 1,
      title: 'ICTW-FSTCA 2025 - Conférence sur la transformation des systèmes alimentaires',
      description: 'Conférence internationale et atelier de formation sur la transformation des systèmes alimentaires pour l\'action climatique.',
      date: new Date('2025-03-15'),
      location: 'Nouakchott, Mauritanie',
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/conference_internationale.jpg',
      type: 'conference'
    },
    {
      id: 2,
      title: 'COMSTECH-UTS Workshop on Renewable Energy',
      description: 'Workshop international sur les énergies renouvelables : Affordable & Clean Energy for ALL.',
      date: new Date('2025-02-20'),
      location: 'Islamabad, Pakistan',
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/workshop_energie_renouvelable.jpg',
      type: 'workshop'
    },
    {
      id: 3,
      title: 'SEE PAKISTAN 2025',
      description: 'Participation mauritanienne à l\'événement international SEE PAKISTAN à Lahore.',
      date: new Date('2025-03-10'),
      location: 'Lahore, Pakistan',
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/see_pakistan_2025.jpg',
      type: 'participation'
    },
    {
      id: 4,
      title: 'Conférence internationale sur l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable',
      description: 'Conférence internationale sur l\'autonomisation des jeunes pour la réalisation des Objectifs de Développement Durable.',
      date: new Date('2025-02-25'),
      location: 'Nouakchott, Mauritanie',
      imageUrl: 'https://anrsi.mr/sites/default/files/styles/large/public/field/image/autonomisation_jeunes.jpg',
      type: 'conference'
    },
  ];

  // ANRSI Organization Information
  organizationInfo = {
    name: 'Agence Nationale de la Recherche Scientifique et de l\'Innovation',
    acronym: 'ANRSI',
    phone: '+222 45 25 44 21',
    email: 'info@anrsi.mr',
    website: 'https://anrsi.mr',
    address: 'Nouakchott, Mauritanie',
    mission: 'Faire progresser la connaissance scientifique et l\'innovation au service du développement de la Mauritanie',
    vision: 'Devenir un acteur clé de la recherche scientifique et de l\'innovation en Afrique de l\'Ouest',
    established: '2020'
  };

  // Research Priorities 2026
  researchPriorities = [
    'Agriculture et sécurité alimentaire',
    'Énergies renouvelables et développement durable',
    'Santé et médecine',
    'Technologies de l\'information et de la communication',
    'Éducation et formation',
    'Environnement et changement climatique',
    'Économie et développement social',
    'Innovation technologique'
  ];

  // Strategic Objectives
  strategicObjectives = [
    'Renforcer les capacités de recherche scientifique',
    'Promouvoir l\'innovation technologique',
    'Développer la coopération internationale',
    'Soutenir la formation des chercheurs',
    'Financer les projets de recherche prioritaires',
    'Diffuser les résultats de la recherche',
    'Encourager l\'entrepreneuriat innovant'
  ];

  constructor() { }

  getArticles(): ANRSIArticle[] {
    return this.articles;
  }

  getArticleById(id: number): ANRSIArticle | undefined {
    return this.articles.find(article => article.id === id);
  }

  getFeaturedArticles(): ANRSIArticle[] {
    return this.articles.filter(article => article.featured);
  }

  getVideos(): ANRSIVideo[] {
    return this.videos;
  }

  getEvents(): ANRSIEvent[] {
    return this.events;
  }

  getUpcomingEvents(): ANRSIEvent[] {
    const now = new Date();
    return this.events.filter(event => event.date > now);
  }

  getOrganizationInfo() {
    return this.organizationInfo;
  }

  getResearchPriorities() {
    return this.researchPriorities;
  }

  getStrategicObjectives() {
    return this.strategicObjectives;
  }
}
