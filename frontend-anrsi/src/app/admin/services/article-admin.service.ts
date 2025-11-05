import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Article } from '../../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleAdminService {
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  public articles$ = this.articlesSubject.asObservable();

  private nextId = 6; // Starting from 6 since we have 5 mock articles

  constructor() {
    // Initialize with mock data
    this.loadMockArticles();
  }

  getAllArticles(): Observable<Article[]> {
    return this.articles$;
  }

  getArticleById(id: number): Observable<Article | undefined> {
    const articles = this.articlesSubject.value;
    const article = articles.find(a => a.id === id);
    return of(article);
  }

  createArticle(article: Omit<Article, 'id'>): Observable<Article> {
    const newArticle: Article = {
      ...article,
      id: this.nextId++
    };
    
    const currentArticles = this.articlesSubject.value;
    this.articlesSubject.next([...currentArticles, newArticle]);
    
    return of(newArticle);
  }

  updateArticle(id: number, article: Partial<Article>): Observable<Article> {
    const currentArticles = this.articlesSubject.value;
    const index = currentArticles.findIndex(a => a.id === id);
    
    if (index !== -1) {
      const updatedArticle = { ...currentArticles[index], ...article };
      currentArticles[index] = updatedArticle;
      this.articlesSubject.next([...currentArticles]);
      return of(updatedArticle);
    }
    
    throw new Error('Article not found');
  }

  deleteArticle(id: number): Observable<boolean> {
    const currentArticles = this.articlesSubject.value;
    const filteredArticles = currentArticles.filter(a => a.id !== id);
    
    if (filteredArticles.length < currentArticles.length) {
      this.articlesSubject.next(filteredArticles);
      return of(true);
    }
    
    return of(false);
  }

  private loadMockArticles(): void {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Innovation in Agricultural Research',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        excerpt: 'Latest developments in agricultural research and innovation.',
        author: 'Dr. Ahmed Mohamed',
        publishDate: new Date('2024-01-15'),
        imageUrl: 'assets/images/article1.jpeg',
        category: 'Research',
        tags: ['agriculture', 'innovation', 'research']
      },
      {
        id: 2,
        title: 'Climate Change Adaptation Strategies',
        content: 'Strategies for adapting to climate change in Mauritania...',
        excerpt: 'Comprehensive guide to climate adaptation.',
        author: 'Dr. Fatima Al-Hassan',
        publishDate: new Date('2024-01-20'),
        imageUrl: 'assets/images/article1.jpeg',
        category: 'Environment',
        tags: ['climate', 'adaptation', 'environment']
      },
      {
        id: 3,
        title: 'Sustainable Development Goals',
        content: 'How Mauritania is working towards SDGs...',
        excerpt: 'Progress report on sustainable development.',
        author: 'Dr. Mohamed Salem',
        publishDate: new Date('2024-02-01'),
        imageUrl: 'assets/images/article1.jpeg',
        category: 'Development',
        tags: ['sustainability', 'development', 'goals']
      },
      {
        id: 4,
        title: 'Technology Transfer in Agriculture',
        content: 'Modern technologies being transferred to local farmers...',
        excerpt: 'Technology transfer initiatives and their impact.',
        author: 'Dr. Aicha Mint Ahmed',
        publishDate: new Date('2024-02-10'),
        imageUrl: 'assets/images/article1.jpeg',
        category: 'Technology',
        tags: ['technology', 'transfer', 'agriculture']
      },
      {
        id: 5,
        title: 'Research Collaboration Networks',
        content: 'Building networks for collaborative research...',
        excerpt: 'Importance of research collaboration.',
        author: 'Dr. Sidi Mohamed',
        publishDate: new Date('2024-02-15'),
        imageUrl: 'assets/images/article1.jpeg',
        category: 'Collaboration',
        tags: ['collaboration', 'networks', 'research']
      }
    ];

    this.articlesSubject.next(mockArticles);
  }
}
