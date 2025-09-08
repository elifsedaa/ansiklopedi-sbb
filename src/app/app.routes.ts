import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'Ana Sayfa - Sakarya Ansiklopedisi'
      },
      {
        path: 'entries',
        loadComponent: () => import('./pages/entries/entries.component').then(m => m.EntriesComponent),
        title: 'Maddeler - Sakarya Ansiklopedisi'
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        title: 'Arama Sonuçları - Sakarya Ansiklopedisi'
      },
      {
        path: 'publications',
        loadComponent: () => import('./pages/publications/publications.component').then(m => m.PublicationsComponent),
        title: 'Yayınlar - Sakarya Ansiklopedisi'
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
        title: 'Kategoriler - Sakarya Ansiklopedisi'
      },
      {
        path: 'authors',
        loadComponent: () => import('./pages/authors/authors.component').then(m => m.AuthorsComponent),
        title: 'Yazarlar - Sakarya Ansiklopedisi'
      },
      {
        path: 'add-publication',
        loadComponent: () => import('./pages/add-publication/add-publication.component').then(m => m.AddPublicationComponent),
        title: 'Yayın Ekle - Sakarya Ansiklopedisi'
      },
      {
        path: 'author-detail/:id',
        loadComponent: () => import('./pages/author-detail/author-detail.component').then(m => m.AuthorDetailComponent),
        title: 'Yazar Detay - Sakarya Ansiklopedisi'
      },
      {
        path: 'entry-detail/:id',
        loadComponent: () => import('./pages/entry-detail/entry-detail.component').then(m => m.EntryDetailComponent),
        title: 'Madde Detay - Sakarya Ansiklopedisi'
      }
      // diğer sayfalar buraya children olarak eklenecek
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
