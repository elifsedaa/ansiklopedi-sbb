// src/app/pages/publications/publications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Entry, Category } from '../../core/services/api.service';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="publications-container">
      <div class="publications-header">
        <h1>Yayınlar</h1>
        <p>Ansiklopedimizde yer alan tüm maddeler</p>
      </div>

      <!-- Search and Filters -->
      <div class="search-filters">
        <div class="search-box">
          <input
            type="text"
            placeholder="Maddeler arasında ara..."
            class="search-input"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
          >
        </div>

        <div class="filters">
          <select class="filter-select" [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange()">
            <option value="">Tüm Kategoriler</option>
            <option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </option>
          </select>

          <select class="filter-select" [(ngModel)]="sortBy" (ngModelChange)="applySorting()">
            <option value="title">Başlığa Göre</option>
            <option value="date">Tarihe Göre</option>
            <option value="views">Görüntülenmeye Göre</option>
            <option value="likes">Beğeniye Göre</option>
          </select>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-info" *ngIf="filteredEntries.length > 0">
        <p>{{ filteredEntries.length }} madde bulundu</p>
      </div>

      <!-- Publications Grid -->
      <div class="publications-grid" *ngIf="filteredEntries.length > 0; else noResults">
        <article class="publication-card" *ngFor="let entry of paginatedEntries; trackBy: trackByFn">
          <div class="publication-header">
            <div class="publication-number">#{{ entry.maddeNo }}</div>
            <h3 class="publication-title">{{ entry.title }}</h3>
          </div>

          <div class="publication-summary">
            <p>{{ entry.summary }}</p>
          </div>

          <div class="publication-meta">
            <div class="categories">
              <span class="category-badge" *ngFor="let catId of entry.categoryIds">
                {{ getCategoryName(catId) }}
              </span>
            </div>

            <div class="publication-info">
              <div class="volume-info">
                <small>{{ getVolumeInfo(entry.volume.volumeId) }}, s. {{ entry.volume.pageStart }}-{{ entry.volume.pageEnd }}</small>
              </div>
              <div class="stats">
                <span class="stat-item">👁 {{ entry.stats.viewCount }}</span>
                <span class="stat-item">❤️ {{ entry.stats.likeCount }}</span>
              </div>
            </div>
          </div>

          <div class="publication-places" *ngIf="entry.places.length > 0">
            <div class="places">
              <span class="place-tag" *ngFor="let place of entry.places">
                📍 {{ place.name }}
              </span>
            </div>
          </div>

          <div class="publication-date">
            <small>{{ formatDate(entry.createdAt) }} tarihinde eklendi</small>
          </div>

          <div class="publication-actions">
            <button class="read-btn" [routerLink]="['/makale', entry.slug]">
              Devamını Oku
            </button>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
        >
          ‹ Önceki
        </button>

        <span class="page-info">
          Sayfa {{ currentPage }} / {{ totalPages }}
        </span>

        <button
          class="page-btn"
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
        >
          Sonraki ›
        </button>
      </div>

      <ng-template #noResults>
        <div class="no-results" *ngIf="!loading">
          <div class="no-results-icon">📚</div>
          <h3>Sonuç bulunamadı</h3>
          <p *ngIf="searchQuery">
            "<strong>{{ searchQuery }}</strong>" araması için sonuç bulunamadı.
          </p>
          <p *ngIf="selectedCategory">
            Seçili kategoride hiç madde bulunmuyor.
          </p>
          <button class="clear-filters-btn" (click)="clearFilters()">
            Filtreleri Temizle
          </button>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  entries: Entry[] = [];
  filteredEntries: Entry[] = [];
  paginatedEntries: Entry[] = [];
  categories: Category[] = [];

  // Search and filter
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'title';

  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;

  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Load entries
    this.apiService.getEntries().subscribe({
      next: (entries) => {
        this.entries = entries;
        this.filteredEntries = [...entries];
        this.applySorting();
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading entries:', error);
        this.loading = false;
      }
    });

    // Load categories
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearchChange() {
    this.filterEntries();
  }

  onCategoryChange() {
    this.filterEntries();
  }

  filterEntries() {
    this.filteredEntries = this.entries.filter(entry => {
      const matchesSearch = !this.searchQuery ||
        entry.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        entry.summary.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        entry.categoryIds.includes(this.selectedCategory);

      return matchesSearch && matchesCategory;
    });

    this.currentPage = 1;
    this.applySorting();
    this.updatePagination();
  }

  applySorting() {
    this.filteredEntries.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title, 'tr');
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'views':
          return b.stats.viewCount - a.stats.viewCount;
        case 'likes':
          return b.stats.likeCount - a.stats.likeCount;
        default:
          return 0;
      }
    });

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEntries.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEntries = this.filteredEntries.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'title';
    this.filterEntries();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Bilinmeyen';
  }

  getVolumeInfo(volumeId: string): string {
    // This could be enhanced to load actual volume data
    const volumeMap: { [key: string]: string } = {
      'vol_01': 'Cilt 1',
      'vol_02': 'Cilt 2',
      'vol_03': 'Cilt 3'
    };
    return volumeMap[volumeId] || 'Bilinmeyen Cilt';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  }

  trackByFn(index: number, item: Entry): string {
    return item.id;
  }
}
