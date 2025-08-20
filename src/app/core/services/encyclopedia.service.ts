// src/app/core/services/encyclopedia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

// Interfaces (mevcut projenizde varsa bunları import edin)
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  authorId: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  publishDate: Date;
  updateDate: Date;
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  parentId?: string;
  orderIndex: number;
  articleCount: number;
  isActive: boolean;
  color?: string;
  icon?: string;
}

interface Statistics {
  totalArticles: number;
  totalCategories: number;
  totalAuthors: number;
  totalViews: number;
  recentlyAdded: number;
  mostPopularCategory: string;
  averageReadingTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class EncyclopediaService {
  private baseUrl = 'http://localhost:3000'; // Fake API URL'inizi buraya yazın

  constructor(private http: HttpClient) {}

  // Öne çıkan makaleleri getir
  async getFeaturedArticles(limit: number = 6): Promise<Article[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Article[]>(`${this.baseUrl}/articles?featured=true&limit=${limit}`)
      );
      return response || this.getMockFeaturedArticles();
    } catch (error) {
      console.error('Featured articles fetch error:', error);
      return this.getMockFeaturedArticles();
    }
  }

  // Ana kategorileri getir
  async getMainCategories(): Promise<Category[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Category[]>(`${this.baseUrl}/categories?main=true`)
      );
      return response || this.getMockCategories();
    } catch (error) {
      console.error('Categories fetch error:', error);
      return this.getMockCategories();
    }
  }

  // İstatistikleri getir
  async getStatistics(): Promise<Statistics> {
    try {
      const response = await firstValueFrom(
        this.http.get<Statistics>(`${this.baseUrl}/statistics`)
      );
      return response || this.getMockStatistics();
    } catch (error) {
      console.error('Statistics fetch error:', error);
      return this.getMockStatistics();
    }
  }

  // Son makaleleri getir
  async getRecentArticles(limit: number = 8): Promise<Article[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Article[]>(`${this.baseUrl}/articles?recent=true&limit=${limit}`)
      );
      return response || this.getMockRecentArticles();
    } catch (error) {
      console.error('Recent articles fetch error:', error);
      return this.getMockRecentArticles();
    }
  }

  // Mock Data (Fake API çalışmazsa)
  private getMockFeaturedArticles(): Article[] {
    return [
      {
        id: '1',
        title: 'Sakarya\'nın Tarihi Merkezi: Adapazarı',
        slug: 'sakarya-tarihi-merkezi-adapazari',
        content: 'Adapazarı, Sakarya ilinin merkez ilçesi...',
        excerpt: 'Adapazarı\'nın kuruluşundan günümüze kadar olan tarihi süreç...',
        imageUrl: '/assets/images/adapazari.jpg',
        author: 'Prof. Dr. Mehmet Yılmaz',
        authorId: 'author1',
        categoryId: 'tarih',
        categoryName: 'Tarih',
        tags: ['Adapazarı', 'tarih', 'merkez'],
        publishDate: new Date('2024-01-15'),
        updateDate: new Date('2024-01-15'),
        viewCount: 1250,
        likeCount: 45,
        isPublished: true,
        isFeatured: true
      },
      {
        id: '2',
        title: 'Sakarya Nehri ve Coğrafi Önemi',
        slug: 'sakarya-nehri-cografi-onemi',
        content: 'Sakarya Nehri, Türkiye\'nin en uzun nehirlerinden biri...',
        excerpt: 'Sakarya Nehri\'nin coğrafi özellikleri ve bölgeye katkıları...',
        imageUrl: '/assets/images/sakarya-nehri.jpg',
        author: 'Dr. Ayşe Kaya',
        authorId: 'author2',
        categoryId: 'cografya',
        categoryName: 'Coğrafya',
        tags: ['Sakarya Nehri', 'coğrafya', 'doğa'],
        publishDate: new Date('2024-01-10'),
        updateDate: new Date('2024-01-10'),
        viewCount: 980,
        likeCount: 32,
        isPublished: true,
        isFeatured: true
      }
    ];
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: 'tarih',
        name: 'Tarih',
        slug: 'tarih',
        description: 'Sakarya\'nın tarihi dönemleri ve önemli olayları',
        imageUrl: '/assets/images/cat-tarih.jpg',
        orderIndex: 1,
        articleCount: 245,
        isActive: true,
        color: '#1e3a8a',
        icon: '🏛️'
      },
      {
        id: 'cografya',
        name: 'Coğrafya',
        slug: 'cografya',
        description: 'Sakarya\'nın coğrafi özellikleri ve doğal güzellikleri',
        imageUrl: '/assets/images/cat-cografya.jpg',
        orderIndex: 2,
        articleCount: 186,
        isActive: true,
        color: '#059669',
        icon: '🗺️'
      },
      {
        id: 'kultur',
        name: 'Kültür',
        slug: 'kultur',
        description: 'Sakarya\'nın gelenekleri, folkloru ve kültürel mirası',
        imageUrl: '/assets/images/cat-kultur.jpg',
        orderIndex: 3,
        articleCount: 198,
        isActive: true,
        color: '#dc2626',
        icon: '🎭'
      }
    ];
  }

  private getMockStatistics(): Statistics {
    return {
      totalArticles: 1250,
      totalCategories: 15,
      totalAuthors: 48,
      totalViews: 125000,
      recentlyAdded: 23,
      mostPopularCategory: 'Tarih',
      averageReadingTime: 8.5
    };
  }

  private getMockRecentArticles(): Article[] {
    return [
      {
        id: '3',
        title: 'Sakarya Mutfağı ve Geleneksel Lezzetler',
        slug: 'sakarya-mutfagi-geleneksel-lezzetler',
        content: 'Sakarya mutfağının özellikleri...',
        excerpt: 'Sakarya\'ya özgü yemek kültürü ve geleneksel tarifler...',
        author: 'Fatma Hanım',
        authorId: 'author3',
        categoryId: 'kultur',
        categoryName: 'Kültür',
        tags: ['mutfak', 'yemek', 'gelenek'],
        publishDate: new Date('2024-02-01'),
        updateDate: new Date('2024-02-01'),
        viewCount: 756,
        likeCount: 28,
        isPublished: true,
        isFeatured: false
      }
    ];
  }
}
