// // src/app/app.routes.ts
// import { Routes } from '@angular/router';
//
// export const routes: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
//     title: 'Ana Sayfa - Sakarya Ansiklopedisi'
//   },
//   {
//     path: 'yayin-ekle',
//     loadComponent: () => import('./pages/add-publication/add-publication.component').then(m => m.AddPublicationComponent),
//     title: 'Yayın Ekle - Sakarya Ansiklopedisi'
//   },
//   {
//     path: 'yayinlar',
//     loadComponent: () => import('./pages/publications/publications.component').then(m => m.PublicationsComponent),
//     title: 'Yayınlar - Sakarya Ansiklopedisi'
//   },
//   // {
//   //   path: 'makale/:id',
//   //   loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent),
//   //   title: 'Makale Detayı - Sakarya Ansiklopedisi'
//   // },
//   // {
//   //   path: 'kategori/:id',
//   //   loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent),
//   //   title: 'Kategori - Sakarya Ansiklopedisi'
//   // },
//   // {
//   //   path: 'arama',
//   //   loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
//   //   title: 'Arama Sonuçları - Sakarya Ansiklopedisi'
//   // },
//   {
//     path: '**',
//     redirectTo: '',
//     pathMatch: 'full'
//   }
// ];



import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'publications',
    loadComponent: () => import('./pages/publications/publications.component').then(m => m.PublicationsComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'add-publication',
    loadComponent: () => import('./pages/add-publication/add-publication.component').then(m => m.AddPublicationComponent)
  },
  // {
  //   path: 'volume/:id',
  //   loadComponent: () => import('./pages/volume-detail/volume-detail.component').then(m => m.VolumeDetailComponent)
  // },
  // {
  //   path: 'publication/:id',
  //   loadComponent: () => import('./pages/publication-detail/publication-detail.component').then(m => m.PublicationDetailComponent)
  // },
  {
    path: '**',
    redirectTo: ''
  }
];
