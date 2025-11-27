export interface Statistics {
  id?: number;
  researchProjects: number;
  partnerInstitutions: number;
  publishedArticles: number;
  researchFunding: number;
}

export interface StatisticsUpdate {
  researchProjects?: number;
  partnerInstitutions?: number;
  publishedArticles?: number;
  researchFunding?: number;
}


