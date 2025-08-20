// src/app/pages/home/home.component.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import { StatisticsSectionComponent } from './components/statistics-section/statistics-section.component';
import { RecentArticlesComponent } from './components/recent-articles/recent-articles.component';

// Basit interface tanımları
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

interface Category {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  color?: string;
  icon?: string;
}

interface Statistics {
  totalArticles: number;
  totalCategories: number;
  totalAuthors: number;
  totalViews: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    HeroSectionComponent,
    FeaturedCategoriesComponent,
    StatisticsSectionComponent,
    RecentArticlesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Signals for reactive data
  featuredArticles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  statistics = signal<Statistics | null>(null);
  recentArticles = signal<Article[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');

  async ngOnInit() {
    try {
      // Mock data yükleme (gerçek servisler hazır olana kadar)
      await this.loadMockData();
    } catch (error) {
      console.error('Ana sayfa verileri yüklenirken hata:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadMockData() {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock featured articles
    this.featuredArticles.set([
      {
        id: '1',
        title: 'Sakarya\'nın Tarihi Merkezi: Adapazarı',
        excerpt: 'Adapazarı\'nın kuruluşundan günümüze kadar olan tarihi süreç ve gelişimi hakkında detaylı bilgiler.',
        author: 'Prof. Dr. Mehmet Yılmaz',
        categoryName: 'Tarih',
        publishDate: new Date('2024-01-15'),
        viewCount: 1250,
        imageUrl: '/assets/images/adapazari.jpg'
      },
      {
        id: '2',
        title: 'Sakarya Nehri ve Coğrafi Önemi',
        excerpt: 'Sakarya Nehri\'nin coğrafi özellikleri ve bölgeye katkıları konusunda kapsamlı araştırma.',
        author: 'Dr. Ayşe Kaya',
        categoryName: 'Coğrafya',
        publishDate: new Date('2024-01-10'),
        viewCount: 980,
        imageUrl: '/assets/images/sakarya-nehri.jpg'
      },
      {
        id: '3',
        title: 'Sakarya\'nın Geleneksel Mutfağı',
        excerpt: 'Yöresel lezzetler ve geleneksel yemek kültürünün modern döneme yansımaları.',
        author: 'Fatma Hanım',
        categoryName: 'Kültür',
        publishDate: new Date('2024-02-01'),
        viewCount: 756,
        imageUrl: '/assets/images/mutfak.jpg'
      }
    ]);

    // Mock categories
    this.categories.set([
      {
        id: 'tarih',
        name: 'Tarih',
        description: 'Sakarya\'nın tarihi dönemleri ve önemli olayları',
        articleCount: 245,
        color: '#1e3a8a',
        icon: '🏛️'
      },
      {
        id: 'cografya',
        name: 'Coğrafya',
        description: 'Sakarya\'nın coğrafi özellikleri ve doğal güzellikleri',
        articleCount: 186,
        color: '#059669',
        icon: '🗺️'
      },
      {
        id: 'kultur',
        name: 'Kültür',
        description: 'Sakarya\'nın gelenekleri, folkloru ve kültürel mirası',
        articleCount: 198,
        color: '#dc2626',
        icon: '🎭'
      },
      {
        id: 'ekonomi',
        name: 'Ekonomi',
        description: 'Sakarya\'nın ekonomik yapısı ve sanayi tarihi',
        articleCount: 142,
        color: '#d97706',
        icon: '💼'
      },
      {
        id: 'egitim',
        name: 'Eğitim',
        description: 'Sakarya\'daki eğitim kurumları ve eğitim tarihi',
        articleCount: 98,
        color: '#7c2d12',
        icon: '📚'
      },
      {
        id: 'spor',
        name: 'Spor',
        description: 'Sakarya\'nın spor kültürü ve spor tarihi',
        articleCount: 67,
        color: '#0284c7',
        icon: '⚽'
      }
    ]);

    // Mock statistics
    this.statistics.set({
      totalArticles: 1250,
      totalCategories: 15,
      totalAuthors: 48,
      totalViews: 125000
    });

    // Mock recent articles
    this.recentArticles.set([
      {
        id: '4',
        title: 'Sakarya\'da Cumhuriyet Dönemi Mimarisi',
        excerpt: 'Cumhuriyet döneminde şehrin mimari gelişimi ve önemli yapılar.',
        author: 'Mimar Ahmet Demir',
        categoryName: 'Mimari',
        publishDate: new Date('2024-02-05'),
        viewCount: 432
      },
      {
        id: '5',
        title: 'Sakarya Üniversitesi\'nin Kuruluşu',
        excerpt: 'Üniversitenin kuruluş süreci ve şehre katkıları.',
        author: 'Prof. Dr. Zeynep Yıldız',
        categoryName: 'Eğitim',
        publishDate: new Date('2024-02-03'),
        viewCount: 387
      },
      {
        id: '6',
        title: 'Sakarya\'nın Doğal Alanları',
        excerpt: 'İlin doğal koruma alanları ve biyoçeşitlilik.',
        author: 'Dr. Can Özkan',
        categoryName: 'Doğa',
        publishDate: new Date('2024-02-01'),
        viewCount: 298
      }
    ]);
  }

  // Arama işlevi
  async onSearch() {
    const query = this.searchQuery().trim();
    if (query.length < 2) return;

    try {
      console.log('Arama yapılıyor:', query);
      // Router ile arama sonuçları sayfasına yönlendir
      // this.router.navigate(['/arama'], { queryParams: { q: query } });
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  }

  // Kategori tıklama
  onCategoryClick(categoryId: string) {
    console.log('Kategori seçildi:', categoryId);
    // Router ile kategori sayfasına yönlendir
    // this.router.navigate(['/kategori', categoryId]);
  }

  // Makale tıklama
  onArticleClick(articleId: string) {
    console.log('Makale seçildi:', articleId);
    // Router ile makale detay sayfasına yönlendir
    // this.router.navigate(['/makale', articleId]);
  }
}
