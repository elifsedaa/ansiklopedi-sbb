// src/app/pages/categories/categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Entry, Category } from '../../core/services/api.service';

interface CategoryWithStats extends Category {
  entryCount: number;
  recentEntries: Entry[];
  totalViews: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="categories-container">
      <div class="categories-header">
        <h1>Kategoriler</h1>
        <p>Ansiklopedimizde yer alan konular ve alanlar</p>
      </div>

      <!-- Categories Stats -->
      <div class="stats-overview" *ngIf="categoriesWithStats.length > 0">
        <div class="overview-card">
          <div class="overview-number">{{ categoriesWithStats.length }}</div>
          <div class="overview-label">Toplam Kategori</div>
        </div>
        <div class="overview-card">
          <div class="overview-number">{{ totalEntries }}</div>
          <div class="overview-label">Toplam Madde</div>
        </div>
        <div class="overview-card">
          <div class="overview-number">{{ getMostPopularCategory()?.name || 'N/A' }}</div>
          <div class="overview-label">En Popüler Kategori</div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid" *ngIf="categoriesWithStats.length > 0; else loadingTemplate">
        <div class="category-card" *ngFor="let category of categoriesWithStats; trackBy: trackByCategoryFn">
          <div class="category-header">
            <h3 class="category-title">{{ category.name }}</h3>
            <span class="category-count">{{ category.entryCount }} madde</span>
          </div>

          <div class="category-description">
            <p>{{ category.description }}</p>
          </div>

          <div class="category-stats">
            <div class="stat-item">
              <span class="stat-label">Toplam Görüntülenme:</span>
              <span class="stat-value">{{ category.totalViews }}</span>
            </div>
          </div>

          <!-- Recent entries in this category -->
          <div class="recent-entries" *ngIf="category.recentEntries.length > 0">
            <h4>Son Maddeler:</h4>
            <div class="recent-entries-list">
              <div
                class="recent-entry"
                *ngFor="let entry of category.recentEntries.slice(0, 3)"
                [routerLink]="['/makale', entry.slug]"
              >
                <div class="entry-title">{{ entry.title }}</div>
                <div class="entry-meta">
                  <span class="entry-number">#{{ entry.maddeNo }}</span>
                  <span class="entry-stats">👁 {{ entry.stats.viewCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="category-actions">
            <button
              class="view-all-btn"
              [routerLink]="['/kategori', category.slug]"
            >
              Tüm Maddeleri Görüntüle
            </button>
            <button
              class="browse-btn"
              [routerLink]="['/yayinlar']"
              [queryParams]="{ category: category.id }"
            >
              Kategoride Gezin
            </button>
          </div>
        </div>
      </div>

      <!-- Category Quick Links -->
      <section class="quick-links" *ngIf="categoriesWithStats.length > 0">
        <h2>Hızlı Erişim</h2>
        <div class="quick-links-grid">
          <div
            class="quick-link-card"
            *ngFor="let category of categoriesWithStats"
            [routerLink]="['/kategori', category.slug]"
          >
            <div class="quick-link-icon">
              {{ getCategoryIcon(category.slug) }}
            </div>
            <div class="quick-link-name">{{ category.name }}</div>
            <div class="quick-link-count">{{ category.entryCount }}</div>
          </div>
        </div>
      </section>

      <ng-template #loadingTemplate>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Kategoriler yükleniyor...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categoriesWithStats: CategoryWithStats[] = [];
  allEntries: Entry[] = [];
  totalEntries = 0;
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Load all entries first
    this.apiService.getEntries().subscribe({
      next: (entries) => {
        this.allEntries = entries;
        this.totalEntries = entries.length;
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error loading entries:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categoriesWithStats = categories.map(category => {
          const categoryEntries = this.allEntries.filter(entry =>
            entry.categoryIds.includes(category.id)
          );

          const recentEntries = categoryEntries
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);

          const totalViews = categoryEntries.reduce((sum, entry) => sum + entry.stats.viewCount, 0);

          return {
            ...category,
            entryCount: categoryEntries.length,
            recentEntries,
            totalViews
          };
        }).sort((a, b) => b.entryCount - a.entryCount); // Sort by entry count

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  getMostPopularCategory(): CategoryWithStats | null {
    if (this.categoriesWithStats.length === 0) return null;

    return this.categoriesWithStats.reduce((prev, current) =>
      prev.totalViews > current.totalViews ? prev : current
    );
  }

  getCategoryIcon(slug: string): string {
    const iconMap: { [key: string]: string } = {
      'tarih': '🏛️',
      'mimari': '🏗️',
      'turizm': '🏖️',
      'doga': '🌿',
      'cografya': '🗺️'
    };
    return iconMap[slug] || '📂';
  }

  trackByCategoryFn(index: number, item: CategoryWithStats): string {
    return item.id;
  }
}
