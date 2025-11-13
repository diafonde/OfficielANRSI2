export interface ArticleTranslation {
  title: string;
  content: string;
  excerpt: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: Date;
  imageUrl: string;
  images?: string[];
  category: string;
  tags: string[];
  language?: 'fr' | 'ar' | 'en';
  translationGroupId?: number;
  translations?: {
    fr?: ArticleTranslation;
    ar?: ArticleTranslation;
    en?: ArticleTranslation;
  };
  featured?: boolean;
  published?: boolean;
}