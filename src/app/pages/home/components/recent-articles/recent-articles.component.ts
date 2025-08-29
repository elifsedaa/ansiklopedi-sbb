import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article, FeaturedCategory, Statistics } from '../../../../core/services/encyclopedia.service';

@Component({
  selector: 'app-recent-entries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-articles.component.html',
  styleUrls: ['./recent-articles.component.scss']
})
export class RecentArticlesComponent {
  // HomeComponent'ten gelen makaleler
  @Input() articles: Article[] = [];

  // Makale tıklandığında HomeComponent'e event gönder
  @Output() articleClick = new EventEmitter<string>();

  handleArticleClick(articleId: string) {
    this.articleClick.emit(articleId);
  }
}
