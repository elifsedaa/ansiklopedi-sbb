import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ana sayfa - Home Component
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Ansiklopedi SBB - Ana Sayfa'
  },

  // Home rotası (alternatif erişim)
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Ansiklopedi SBB - Ana Sayfa'
  },
  //
  // // Arama sayfası
  // {
  //   path: 'search',
  //   loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
  //   title: 'Arama - Ansiklopedi SBB'
  // },
  //
  // // Kategoriler sayfası
  // {
  //   path: 'categories',
  //   loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
  //   title: 'Kategoriler - Ansiklopedi SBB'
  // },
  //
  // // Kategori detay sayfası
  // {
  //   path: 'category/:id',
  //   loadComponent: () => import('./pages/category-detail/category-detail.component').then(m => m.CategoryDetailComponent),
  //   title: 'Kategori Detayı - Ansiklopedi SBB'
  // },
  //
  // // Makale detay sayfası
  // {
  //   path: 'article/:id',
  //   loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent),
  //   title: 'Makale - Ansiklopedi SBB'
  // },
  //
  // // Yazar sayfası
  // {
  //   path: 'author/:id',
  //   loadComponent: () => import('./pages/author/author.component').then(m => m.AuthorComponent),
  //   title: 'Yazar - Ansiklopedi SBB'
  // },
  //
  // // Cilt sayfası
  // {
  //   path: 'volume/:id',
  //   loadComponent: () => import('./pages/volume/volume.component').then(m => m.VolumeComponent),
  //   title: 'Cilt - Ansiklopedi SBB'
  // },
  //
  // // Gelişmiş arama
  // {
  //   path: 'advanced-search',
  //   loadComponent: () => import('./pages/advanced-search/advanced-search.component').then(m => m.AdvancedSearchComponent),
  //   title: 'Gelişmiş Arama - Ansiklopedi SBB'
  // },
  //
  // // Arama sonuçları
  // {
  //   path: 'search-results',
  //   loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent),
  //   title: 'Arama Sonuçları - Ansiklopedi SBB'
  // },

  // 404 - Wildcard route (en sona koyulmalı)
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
