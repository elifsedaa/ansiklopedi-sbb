// src/app/pages/home/components/recent-articles/recent-articles.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  categoryName: string;
  publishDate: Date;
  viewCount: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-recent-articles',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="recent-articles">
      <div class="articles-list">
        <article
          *ngFor="let article of articles"
          class="article-item"
          (click)="onArticleClick(article.id)">

          <div class="article-image">
            <img
              [src]="article.imageUrl || '/assets/images/default-article.jpg'"
              [alt]="article.title"
              loading="lazy">
          </div>

          <div class="article-content">
            <div class="article-meta">
              <span class="category-badge">{{ article.categoryName }}</span>
              <span class="publish-date">{{ article.publishDate | date:'dd.MM.yyyy' }}</span>
            </div>

            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>

            <div class="article-footer">
              <div class="author-info">
                <span class="author-name">{{ article.author }}</span>
              </div>
              <div class="view-count">
                <span class="view-icon">👁️</span>
                <span>{{ article.viewCount }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .recent-articles {
      margin: 2rem 0;
    }

    .articles-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .article-item {
      display: flex;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .article-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }

    .article-image {
      flex-shrink: 0;
      width: 120px;
      height: 120px;
      overflow: hidden;
    }

    .article-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .article-item:hover .article-image img {
      transform: scale(1.05);
    }

    .article-content {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .category-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .publish-date {
      font-size: 0.8rem;
      color: #64748b;
    }

    .article-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .article-excerpt {
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.4;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .article-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
    }

    .author-name {
      color: #374151;
      font-weight: 500;
    }

    .view-count {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #64748b;
    }

    .view-icon {
      font-size: 0.75rem;
    }

    @media (max-width: 768px) {
      .articles-list {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .article-item {
        flex-direction: column;
      }

      .article-image {
        width: 100%;
        height: 150px;
      }
    }
  `]
})
export class RecentArticlesComponent {
  @Input() articles: Article[] = [];
  @Output() articleClick = new EventEmitter<string>();

  onArticleClick(articleId: string) {
    this.articleClick.emit(articleId);
  }
}
