import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { EncyclopediaService, Article, Statistics, FeaturedCategory } from '../../core/services/encyclopedia.service';
import { SearchService } from '../../core/services/search.service';

// Components
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import { StatisticsSectionComponent } from './components/statistics-section/statistics-section.component';
import { RecentArticlesComponent } from './components/recent-articles/recent-articles.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    FeaturedCategoriesComponent,
    StatisticsSectionComponent,
    RecentArticlesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Data properties
  recentArticles: Article[] = [];
  featuredCategories: FeaturedCategory[] = [];
  statistics: Statistics = {
    totalArticles: 0,
    totalCategories: 0,
    totalAuthors: 0,
    dailyVisitors: 0
  };

  // UI state
  isLoading = false;
  searchQuery = '';
  searchResults: Article[] = [];
  showSearchResults = false;

  constructor(
    private encyclopediaService: EncyclopediaService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  private async loadHomeData(): Promise<void> {
    this.isLoading = true;

    try {
      // Paralel olarak tüm verileri yükle
      const [articles, categories, stats] = await Promise.all([
        this.encyclopediaService.getRecentArticles(6).toPromise(),
        this.encyclopediaService.getFeaturedCategories().toPromise(),
        this.encyclopediaService.getStatistics().toPromise()
      ]);

      this.recentArticles = articles || [];
      this.featuredCategories = categories || [];
      this.statistics = stats || this.statistics;

      console.log('Home data loaded:', {
        articles: this.recentArticles.length,
        categories: this.featuredCategories.length,
        stats: this.statistics
      });

    } catch (error) {
      console.error('Error loading home data:', error);
      this.loadFallbackData();
    } finally {
      this.isLoading = false;
    }
  }

  // Fallback data (API çalışmazsa)
  private loadFallbackData(): void {
    this.recentArticles = [
      {
        id: 'fallback-1',
        title: 'Sakarya Nehri',
        excerpt: 'Türkiye\'nin en uzun nehirlerinden biri olan Sakarya Nehri hakkında detaylı bilgiler.',
        author: 'Mehmet Kara',
        categoryName: 'Coğrafya',
        publishDate: new Date(),
        viewCount: 300,
        imageUrl: '/assets/images/default-article.jpg'
      },
      {
        id: 'fallback-2',
        title: 'Sapanca Gölü',
        excerpt: 'Sakarya\'nın en bilinen göllerinden biri olan Sapanca Gölü ve çevresindeki doğal güzellikler.',
        author: 'Ali Öztürk',
        categoryName: 'Doğa',
        publishDate: new Date(),
        viewCount: 150,
        imageUrl: '/assets/images/default-article.jpg'
      }
    ];

    this.featuredCategories = [
      { id: 'cat_tarih', name: 'Tarih', icon: '🏛️', count: 8 },
      { id: 'cat_mimari', name: 'Mimari', icon: '🏗️', count: 6 },
      { id: 'cat_turizm', name: 'Turizm', icon: '🏖️', count: 5 },
      { id: 'cat_doga', name: 'Doğa', icon: '🌿', count: 4 },
      { id: 'cat_cografya', name: 'Coğrafya', icon: '🌍', count: 3 }
    ];

    this.statistics = {
      totalArticles: 13,
      totalCategories: 5,
      totalAuthors: 10,
      dailyVisitors: 450
    };
  }

  // Arama fonksiyonları
  async onSearch(): Promise<void> {
    if (!this.searchQuery.trim()) {
      this.clearSearch();
      return;
    }

    if (this.searchQuery.length < 2) {
      return;
    }

    try {
      this.isLoading = true;
      const results = await this.searchService.searchArticles(this.searchQuery).toPromise();
      this.searchResults = results || [];
      this.showSearchResults = true;

      console.log(`Found ${this.searchResults.length} results for: ${this.searchQuery}`);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults = [];
    } finally {
      this.isLoading = false;
    }
  }

  onSearchInputChange(): void {
    // Gerçek zamanlı arama için search service'i güncelle
    this.searchService.updateSearchTerm(this.searchQuery);

    if (!this.searchQuery.trim()) {
      this.clearSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.searchService.clearResults();
  }

  // Event handlers
  onArticleClick(articleId: string): void {
    console.log('Article clicked:', articleId);
    // Router ile makale detay sayfasına git
    // this.router.navigate(['/article', articleId]);
  }

  onCategoryClick(categoryId: string): void {
    console.log('Category clicked:', categoryId);
    // Router ile kategori sayfasına git
    // this.router.navigate(['/category', categoryId]);
  }

  // Loading state getter
  get isDataLoading(): boolean {
    return this.isLoading;
  }
}
