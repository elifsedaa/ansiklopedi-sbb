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
        title: 'A-Z Maddeler - Sakarya Ansiklopedisi'
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
      // diğer sayfalar buraya children olarak eklenecek
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
