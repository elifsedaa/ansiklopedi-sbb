import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { forkJoin, map } from 'rxjs';

interface Author {
  id: string;
  fullName: string;
  bio: string;
  affiliation: string;
  photoMediaId: string;
  links: any;
}

interface Entry {
  id: string;
  slug: string;
  maddeNo: number;
  title: string;
  summary: string;
  categoryIds: string[];
  tagIds: string[];
  authorships: Array<{
    authorId: string;
    role: string;
    order: number;
  }>;
  volume: {
    volumeId: string;
    pageStart: number;
    pageEnd: number;
  };
  dates?: {
    periodStart?: number;
    periodEnd?: number;
  };
  places: Array<{
    name: string;
    geo: {
      lat: number;
      lng: number;
    };
    admin: {
      il: string;
      ilce: string;
    };
  }>;
  stats: {
    viewCount: number;
    likeCount: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface Volume {
  id: string;
  title: string;
  number: number;
}

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    ChipModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.scss']
})
export class AuthorDetailComponent implements OnInit {
  author: Author | null = null;
  authorEntries: Entry[] = [];
  categories: Category[] = [];
  volumes: Volume[] = [];
  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = {};
  loading: boolean = true;
  authorId: string = '';

  // Statistics
  totalEntries: number = 0;
  totalViews: number = 0;
  totalLikes: number = 0;
  categoriesUsed: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authorId = this.route.snapshot.params['id'];
    this.initBreadcrumb();
    this.loadAuthorData();
  }

  initBreadcrumb(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.breadcrumbItems = [
      { label: 'Ansiklopedi',routerLink: '/'},
      { label: 'Yazarlar', routerLink: '/authors' },
      { label: 'Yazar Detayı' }
    ];
  }

  loadAuthorData(): void {
    this.loading = true;

    // Paralel olarak tüm verileri çek
    forkJoin({
      authors: this.http.get<Author[]>('http://localhost:3000/authors'),
      entries: this.http.get<Entry[]>('http://localhost:3000/entries'),
      categories: this.http.get<Category[]>('http://localhost:3000/categories'),
      volumes: this.http.get<Volume[]>('http://localhost:3000/volumes')
    }).subscribe({
      next: (data) => {
        // Author'u bul
        this.author = data.authors.find(author => author.id === this.authorId) || null;

        if (!this.author) {
          this.router.navigate(['/authors']);
          return;
        }

        // Diğer verileri kaydet
        this.categories = data.categories;
        this.volumes = data.volumes;

        // Bu yazara ait makaleleri filtrele
        this.authorEntries = data.entries.filter(entry =>
          entry.authorships.some(authorship => authorship.authorId === this.authorId)
        );

        // İstatistikleri hesapla
        this.calculateStatistics();

        // Breadcrumb'ı güncelle
        this.updateBreadcrumb();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading author data:', error);
        this.loading = false;
        this.router.navigate(['/authors']);
      }
    });
  }

  calculateStatistics(): void {
    this.totalEntries = this.authorEntries.length;
    this.totalViews = this.authorEntries.reduce((sum, entry) => sum + entry.stats.viewCount, 0);
    this.totalLikes = this.authorEntries.reduce((sum, entry) => sum + entry.stats.likeCount, 0);

    // Kullanılan kategorileri bul
    const categoryIds = new Set<string>();
    this.authorEntries.forEach(entry => {
      entry.categoryIds.forEach(catId => categoryIds.add(catId));
    });

    this.categoriesUsed = Array.from(categoryIds).map(catId => {
      const category = this.categories.find(cat => cat.id === catId);
      return category ? category.name : 'Bilinmeyen';
    });
  }

  updateBreadcrumb(): void {
    if (this.author) {
      this.breadcrumbItems = [
        { label: 'Ansiklopedi' },
        { label: 'Yazarlar', routerLink: '/authors' },
        { label: this.author.fullName }
      ];
    }
  }

  getAuthorImage(): string {
    if (!this.author) return 'assets/images/authors/default.png';
    return `assets/images/authors/${this.author.photoMediaId}.png`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/authors/default.png';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Bilinmeyen';
  }

  getVolumeName(volumeId: string): string {
    const volume = this.volumes.find(vol => vol.id === volumeId);
    return volume ? volume.title : 'Bilinmeyen';
  }

  navigateToEntry(entry: Entry): void {
    // Entry detay sayfasına yönlendirme
    this.router.navigate(['/entry', entry.slug]);
  }

  goBackToAuthors(): void {
    this.router.navigate(['/authors']);
  }
  trackByEntryId(index: number, entry: Entry): string {
    return entry.id;
  }

  getEntryPeriod(entry: Entry): string {
    if (!entry.dates || (!entry.dates.periodStart && !entry.dates.periodEnd)) {
      return '';
    }

    const start = entry.dates.periodStart;
    const end = entry.dates.periodEnd;

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${start}`;
    } else if (end) {
      return `${end}`;
    }
    return '';
  }
}
