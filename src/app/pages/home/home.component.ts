import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Publication {
  id: number;
  title: string;
  author: string;
  category: string;
  volume: string;
  description: string;
  tags: string[];
  publishDate: Date;
  imageUrl?: string;
  pdfUrl?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  publicationCount: number;
}

interface Volume {
  id: number;
  name: string;
  description: string;
  pdfCount: number;
  coverImage?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Header -->
    <header class="header-main">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <img src="assets/images/sakarya-logo.png" alt="Sakarya Büyükşehir Belediyesi" class="logo">
            <div class="title-section">
              <h1>Sakarya Ansiklopedisi</h1>
              <p>Sakarya'nın Kültürel ve Tarihi Mirası</p>
            </div>
          </div>
          <nav class="main-nav">
            <ul>
              <li><a routerLink="/" class="active">Ana Sayfa</a></li>
              <li><a routerLink="/publications">Yayınlar</a></li>
              <li><a routerLink="/categories">Kategoriler</a></li>
              <li><a routerLink="/volumes">Ciltler</a></li>
              <li><a routerLink="/search">Ara</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h2>Sakarya'nın Zengin Tarihini Keşfedin</h2>
            <p>Sakarya ili ve çevresinin tarihi, kültürel ve sosyal yapısını anlatan kapsamlı dijital ansiklopedi.
               Araştırmacılar, öğrenciler ve meraklılar için hazırlanmış güvenilir bilgi kaynağı.</p>
            <div class="hero-buttons">
              <button class="btn-primary" (click)="scrollToSearch()">
                <i class="fas fa-search"></i>
                Arama Yap
              </button>
              <a routerLink="/publications" class="btn-secondary">
                <i class="fas fa-book"></i>
                Yayınları İncele
              </a>
            </div>
          </div>
          <div class="hero-image">
            <img src="assets/images/sakarya-panorama.jpg" alt="Sakarya" class="hero-img">
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section" id="search-section">
      <div class="container">
        <div class="search-wrapper">
          <h3>Arama</h3>
          <div class="search-form">
            <div class="search-input-group">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                placeholder="Sakarya hakkında ne öğrenmek istiyorsunuz?"
                class="search-input"
                (keyup.enter)="performSearch()">
              <button class="search-btn" (click)="performSearch()">
                <i class="fas fa-search"></i>
              </button>
            </div>
            <div class="search-filters">
              <select [(ngModel)]="selectedCategory" class="filter-select">
                <option value="">Tüm Kategoriler</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{category.name}}
                </option>
              </select>
              <select [(ngModel)]="selectedVolume" class="filter-select">
                <option value="">Tüm Ciltler</option>
                <option *ngFor="let volume of volumes" [value]="volume.id">
                  {{volume.name}}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book-open"></i>
            </div>
            <div class="stat-content">
              <h4>{{totalPublications}}</h4>
              <p>Toplam Yayın</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <div class="stat-content">
              <h4>{{categories.length}}</h4>
              <p>Kategori</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-archive"></i>
            </div>
            <div class="stat-content">
              <h4>{{volumes.length}}</h4>
              <p>Cilt</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h4>{{totalAuthors}}</h4>
              <p>Yazar</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Publications -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h3>Öne Çıkan Yayınlar</h3>
          <a routerLink="/publications" class="view-all-link">
            Tümünü Gör <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="publications-grid">
          <div *ngFor="let publication of featuredPublications" class="publication-card">
            <div class="publication-image">
              <img [src]="publication.imageUrl || 'assets/images/default-book.jpg'"
                   [alt]="publication.title">
              <div class="publication-overlay">
                <button class="btn-view" (click)="viewPublication(publication.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button *ngIf="publication.pdfUrl" class="btn-download">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div class="publication-content">
              <span class="publication-category">{{publication.category}}</span>
              <h4>{{publication.title}}</h4>
              <p class="publication-author">{{publication.author}}</p>
              <p class="publication-description">
                {{publication.description | slice:0:150}}{{publication.description.length > 150 ? '...' : ''}}
              </p>
              <div class="publication-tags">
                <span *ngFor="let tag of publication.tags.slice(0,3)" class="tag">{{tag}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h3>Kategoriler</h3>
          <a routerLink="/categories" class="view-all-link">
            Tümünü Gör <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="categories-grid">
          <div *ngFor="let category of categories.slice(0,8)" class="category-card">
            <div class="category-icon">
              <i class="{{getCategoryIcon(category.name)}}"></i>
            </div>
            <h4>{{category.name}}</h4>
            <p>{{category.description}}</p>
            <span class="category-count">{{category.publicationCount}} yayın</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Volumes Section -->
    <section class="volumes-section">
      <div class="container">
        <div class="section-header">
          <h3>Ciltler</h3>
          <a routerLink="/volumes" class="view-all-link">
            Tümünü Gör <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="volumes-grid">
          <div *ngFor="let volume of volumes.slice(0,6)" class="volume-card">
            <div class="volume-cover">
              <img [src]="volume.coverImage || 'assets/images/default-volume.jpg'"
                   [alt]="volume.name">
              <div class="volume-number">{{volume.id}}</div>
            </div>
            <div class="volume-info">
              <h4>{{volume.name}}</h4>
              <p>{{volume.description}}</p>
              <span class="pdf-count">{{volume.pdfCount}} PDF</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h5>Sakarya Ansiklopedisi</h5>
            <p>Sakarya ili ve çevresinin tarihini, kültürünü ve sosyal yapısını anlatan dijital ansiklopedi.</p>
          </div>
          <div class="footer-section">
            <h5>Hızlı Linkler</h5>
            <ul>
              <li><a routerLink="/publications">Yayınlar</a></li>
              <li><a routerLink="/categories">Kategoriler</a></li>
              <li><a routerLink="/volumes">Ciltler</a></li>
              <li><a routerLink="/search">Gelişmiş Arama</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h5>İletişim</h5>
            <p>Sakarya Büyükşehir Belediyesi</p>
            <p>Email: info:sakarya.bel.tr</p>
            <p>Tel: (0264) 275 37 54</p>
          </div>
          <div class="footer-section">
            <h5>Sosyal Medya</h5>
            <div class="social-links">
              <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
              <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Sakarya Büyükşehir Belediyesi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Header */
    .header-main {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      height: 50px;
      width: auto;
    }

    .title-section h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }

    .title-section p {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .main-nav ul {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .main-nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .main-nav a:hover,
    .main-nav a.active {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }

    /* Hero Section */
    .hero-section {
      padding: 4rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .hero-text h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .hero-text p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 0.8rem 2rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .btn-primary {
      background: #ff6b6b;
      color: white;
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-primary:hover {
      background: #ff5252;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255,107,107,0.3);
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
    }

    .hero-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    /* Search Section */
    .search-section {
      padding: 3rem 0;
      background: #f8f9fa;
    }

    .search-wrapper {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }

    .search-wrapper h3 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #2c3e50;
    }

    .search-input-group {
      display: flex;
      margin-bottom: 1rem;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }

    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      font-size: 1rem;
      outline: none;
    }

    .search-btn {
      background: #2a5298;
      color: white;
      border: none;
      padding: 1rem 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      background: #1e3c72;
    }

    .search-filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-select {
      padding: 0.8rem 1.2rem;
      border: 2px solid #e9ecef;
      border-radius: 5px;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      border-color: #2a5298;
    }

    /* Stats Section */
    .stats-section {
      padding: 3rem 0;
      background: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      color: white;
      box-shadow: 0 5px 20px rgba(102,126,234,0.3);
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.9;
    }

    .stat-content h4 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }

    .stat-content p {
      opacity: 0.9;
    }

    /* Featured Publications */
    .featured-section {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h3 {
      font-size: 2rem;
      color: #2c3e50;
    }

    .view-all-link {
      color: #2a5298;
      text-decoration: none;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .view-all-link:hover {
      color: #1e3c72;
    }

    .publications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .publication-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .publication-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .publication-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .publication-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .publication-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .publication-card:hover .publication-overlay {
      opacity: 1;
    }

    .btn-view, .btn-download {
      padding: 0.8rem;
      border: none;
      border-radius: 50%;
      background: #ff6b6b;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-view:hover, .btn-download:hover {
      background: #ff5252;
      transform: scale(1.1);
    }

    .publication-content {
      padding: 1.5rem;
    }

    .publication-category {
      background: #2a5298;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .publication-content h4 {
      font-size: 1.2rem;
      margin: 1rem 0 0.5rem 0;
      color: #2c3e50;
    }

    .publication-author {
      color: #666;
      font-style: italic;
      margin-bottom: 0.8rem;
    }

    .publication-description {
      color: #555;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .publication-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      background: #e9ecef;
      color: #495057;
      padding: 0.2rem 0.6rem;
      border-radius: 10px;
      font-size: 0.8rem;
    }

    /* Categories Section */
    .categories-section {
      padding: 4rem 0;
      background: white;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102,126,234,0.3);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .category-card h4 {
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
    }

    .category-card p {
      opacity: 0.9;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .category-count {
      background: rgba(255,255,255,0.2);
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    /* Volumes Section */
    .volumes-section {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .volumes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .volume-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .volume-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .volume-cover {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .volume-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .volume-number {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff6b6b;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 700;
    }

    .volume-info {
      padding: 1.5rem;
    }

    .volume-info h4 {
      font-size: 1.2rem;
      margin-bottom: 0.8rem;
      color: #2c3e50;
    }

    .volume-info p {
      color: #555;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .pdf-count {
      background: #2a5298;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    /* Footer */
    .footer {
      background: #2c3e50;
      color: white;
      padding: 3rem 0 1rem 0;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h5 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #ecf0f1;
    }

    .footer-section p {
      color: #bdc3c7;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section ul li a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
      color: white;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #34495e;
      color: white;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #2a5298;
      transform: translateY(-3px);
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #34495e;
      color: #bdc3c7;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .main-nav ul {
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-text h2 {
        font-size: 2rem;
      }

      .search-filters {
        flex-direction: column;
        align-items: center;
      }

      .filter-select {
        width: 100%;
        max-width: 300px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .publications-grid,
      .categories-grid,
      .volumes-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 15px;
      }

      .title-section h1 {
        font-size: 1.5rem;
      }

      .hero-text h2 {
        font-size: 1.8rem;
      }

      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
        max-width: 250px;
        justify-content: center;
      }

      .stat-card {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedVolume: string = '';
  totalPublications: number = 0;
  totalAuthors: number = 0;

  // Mock data - Bu veriler API'den gelecek
  categories: Category[] = [
    { id: 1, name: 'Tarih', description: 'Sakarya\'nın tarihi gelişimi', publicationCount: 45 },
    { id: 2, name: 'Coğrafya', description: 'Fiziki ve beşeri coğrafya', publicationCount: 32 },
    { id: 3, name: 'Kültür', description: 'Geleneksel kültür ve sanat', publicationCount: 28 },
    { id: 4, name: 'Ekonomi', description: 'Ekonomik yapı ve gelişim', publicationCount: 22 },
    { id: 5, name: 'Sosyal Yapı', description: 'Toplumsal örgütlenme', publicationCount: 18 },
    { id: 6, name: 'Eğitim', description: 'Eğitim kurumları ve gelişimi', publicationCount: 15 },
    { id: 7, name: 'Spor', description: 'Spor kültürü ve gelişimi', publicationCount: 12 },
    { id: 8, name: 'Sanat', description: 'Yerel sanat ve sanatçılar', publicationCount: 20 }
  ];

  volumes: Volume[] = [
    { id: 1, name: 'Cilt 1', description: 'Sakarya\'nın Tarihçesi', pdfCount: 15, coverImage: 'assets/images/volume1.jpg' },
    { id: 2, name: 'Cilt 2', description: 'Coğrafi Yapı', pdfCount: 12, coverImage: 'assets/images/volume2.jpg' },
    { id: 3, name: 'Cilt 3', description: 'Kültürel Miras', pdfCount: 18, coverImage: 'assets/images/volume3.jpg' },
    { id: 4, name: 'Cilt 4', description: 'Ekonomik Gelişim', pdfCount: 10, coverImage: 'assets/images/volume4.jpg' },
    { id: 5, name: 'Cilt 5', description: 'Sosyal Yapı', pdfCount: 14, coverImage: 'assets/images/volume5.jpg' },
    { id: 6, name: 'Cilt 6', description: 'Eğitim ve Kültür', pdfCount: 9, coverImage: 'assets/images/volume6.jpg' }
  ];

  featuredPublications: Publication[] = [
    {
      id: 1,
      title: 'Sakarya İli Tarihi Gelişimi',
      author: 'Prof. Dr. Mehmet Yılmaz',
      category: 'Tarih',
      volume: 'Cilt 1',
      description: 'Sakarya ilinin kuruluşundan günümüze kadar geçirdiği tarihi süreç ve önemli olayların detaylı incelemesi.',
      tags: ['tarih', 'sakarya', 'gelişim', 'kuruluş'],
      publishDate: new Date('2024-01-15'),
      imageUrl: 'assets/images/publication1.jpg',
      pdfUrl: 'assets/pdfs/sakarya-tarihi.pdf'
    },
    {
      id: 2,
      title: 'Sakarya Nehri ve Çevre Ekolojisi',
      author: 'Doç. Dr. Ayşe Kara',
      category: 'Coğrafya',
      volume: 'Cilt 2',
      description: 'Sakarya Nehri\'nin ekolojik önemi ve çevre üzerindeki etkilerinin bilimsel analizi.',
      tags: ['coğrafya', 'nehir', 'ekoloji', 'çevre'],
      publishDate: new Date('2024-02-10'),
      imageUrl: 'assets/images/publication2.jpg',
      pdfUrl: 'assets/pdfs/sakarya-nehri.pdf'
    },
    {
      id: 3,
      title: 'Geleneksel Sakarya Mutfağı',
      author: 'Uzm. Fatma Özkan',
      category: 'Kültür',
      volume: 'Cilt 3',
      description: 'Sakarya yöresine özgü geleneksel yemek kültürü ve tariflerin derlemesi.',
      tags: ['kültür', 'mutfak', 'gelenek', 'yemek'],
      publishDate: new Date('2024-03-05'),
      imageUrl: 'assets/images/publication3.jpg',
      pdfUrl: 'assets/pdfs/sakarya-mutfagi.pdf'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalPublications = this.categories.reduce((sum, cat) => sum + cat.publicationCount, 0);
    this.totalAuthors = 45; // Bu değer API'den gelecek
  }

  scrollToSearch(): void {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  performSearch(): void {
    console.log('Arama yapılıyor:', {
      term: this.searchTerm,
      category: this.selectedCategory,
      volume: this.selectedVolume
    });
    // API çağrısı burada yapılacak
  }

  viewPublication(id: number): void {
    console.log('Yayın görüntüleniyor:', id);
    // Router navigate burada yapılacak
  }

  getCategoryIcon(categoryName: string): string {
    const icons: {[key: string]: string} = {
      'Tarih': 'fas fa-landmark',
      'Coğrafya': 'fas fa-globe-americas',
      'Kültür': 'fas fa-theater-masks',
      'Ekonomi': 'fas fa-chart-line',
      'Sosyal Yapı': 'fas fa-users',
      'Eğitim': 'fas fa-graduation-cap',
      'Spor': 'fas fa-running',
      'Sanat': 'fas fa-palette'
    };
    return icons[categoryName] || 'fas fa-book';
  }
}
