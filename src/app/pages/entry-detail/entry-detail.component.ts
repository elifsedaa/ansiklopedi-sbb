import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';
import { forkJoin, map } from 'rxjs';

interface Entry {
  id: string;
  slug: string;
  maddeNo: number;
  title: string;
  summary: string;
  body: string;
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
  media?: Array<{
    mediaId: string;
    caption: string;
    credit: string;
  }>;
  references?: Array<{
    type: string;
    text: string;
  }>;
  relatedEntryIds: string[];
  stats: {
    viewCount: number;
    likeCount: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Author {
  id: string;
  fullName: string;
  bio: string;
  affiliation: string;
  photoMediaId: string;
  links: any;
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

interface Tag {
  id: string;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    ChipModule,
    CardModule,
    ButtonModule,
    ImageModule
  ],
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.scss']
})
export class EntryDetailComponent implements OnInit {
  entry: Entry | null = null;
  authors: Author[] = [];
  categories: Category[] = [];
  volumes: Volume[] = [];
  tags: Tag[] = [];
  relatedEntries: Entry[] = [];
  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = {};
  loading: boolean = true;
  entryId: string = '';
  activeTab: string = 'content'; // Tab kontrolü için

  // Entry data maps
  authorsMap: { [id: string]: Author } = {};
  categoriesMap: { [id: string]: Category } = {};
  volumesMap: { [id: string]: Volume } = {};
  tagsMap: { [id: string]: Tag } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.entryId = this.route.snapshot.params['id'];
    this.initBreadcrumb();
    this.loadEntryData();
  }

  initBreadcrumb(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.breadcrumbItems = [
      { label: 'Ansiklopedi' },
      { label: 'Maddeler', routerLink: '/entries' },
      { label: 'Madde Detayı' }
    ];
  }

  loadEntryData(): void {
    this.loading = true;

    // Paralel olarak tüm verileri çek
    forkJoin({
      entries: this.http.get<Entry[]>('http://localhost:3000/entries'),
      authors: this.http.get<Author[]>('http://localhost:3000/authors'),
      categories: this.http.get<Category[]>('http://localhost:3000/categories'),
      volumes: this.http.get<Volume[]>('http://localhost:3000/volumes')
    }).subscribe({
      next: (data) => {
        // Entry'i bul
        this.entry = data.entries.find(entry => entry.id === this.entryId) || null;

        if (!this.entry) {
          this.router.navigate(['/entries']);
          return;
        }

        // Maps oluştur
        this.authorsMap = data.authors.reduce((acc, author) => {
          acc[author.id] = author;
          return acc;
        }, {} as { [id: string]: Author });

        this.categoriesMap = data.categories.reduce((acc, category) => {
          acc[category.id] = category;
          return acc;
        }, {} as { [id: string]: Category });

        this.volumesMap = data.volumes.reduce((acc, volume) => {
          acc[volume.id] = volume;
          return acc;
        }, {} as { [id: string]: Volume });

        // İlgili makaleleri bul (aynı kategoride olan diğer maddeler)
        if (this.entry.relatedEntryIds.length > 0) {
          this.relatedEntries = data.entries.filter(entry =>
            this.entry!.relatedEntryIds.includes(entry.id) && entry.status === 'published'
          ).slice(0, 6);
        } else {
          // İlgili makale yoksa aynı kategorideki diğer makaleleri öner
          this.relatedEntries = data.entries.filter(entry =>
            entry.id !== this.entryId &&
            entry.status === 'published' &&
            entry.categoryIds.some(catId => this.entry!.categoryIds.includes(catId))
          ).slice(0, 6);
        }

        // Breadcrumb'ı güncelle
        this.updateBreadcrumb();

        // Görüntülenme sayısını artır (gerçek uygulamada API çağrısı yapılır)
        this.incrementViewCount();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading entry data:', error);
        this.loading = false;
        this.router.navigate(['/entries']);
      }
    });
  }

  updateBreadcrumb(): void {
    if (this.entry) {
      this.breadcrumbItems = [
        { label: 'Ansiklopedi' },
        { label: 'Maddeler', routerLink: '/entries' },
        { label: this.entry.title }
      ];
    }
  }

  incrementViewCount(): void {
    if (this.entry) {
      this.entry.stats.viewCount += 1;
      // Gerçek uygulamada burada API çağrısı yapılır
    }
  }

  // Tab kontrolü için yeni metodlar
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: string): boolean {
    return this.activeTab === tab;
  }

  getEntryImage(): string {
    if (!this.entry) return 'assets/images/entries/default.jpg';
    return `assets/images/entries/${this.entry.id}.jpg`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/entries/default.jpg';
  }

  getCategoryName(categoryId: string): string {
    return this.categoriesMap[categoryId]?.name || 'Bilinmeyen';
  }

  getVolumeName(): string {
    if (!this.entry) return 'Bilinmeyen';
    return this.volumesMap[this.entry.volume.volumeId]?.title || 'Bilinmeyen';
  }

  getVolumeNumber(): number {
    if (!this.entry) return 0;
    return this.volumesMap[this.entry.volume.volumeId]?.number || 0;
  }

  getAuthorsText(): string {
    if (!this.entry || !this.entry.authorships.length) return 'Bilinmeyen Yazar';

    const sortedAuthorships = [...this.entry.authorships].sort((a, b) => a.order - b.order);
    const authorNames = sortedAuthorships.map(authorship =>
      this.authorsMap[authorship.authorId]?.fullName || 'Bilinmeyen Yazar'
    );

    if (authorNames.length === 1) return authorNames[0];
    if (authorNames.length === 2) return `${authorNames[0]} ve ${authorNames[1]}`;
    return `${authorNames[0]} ve ${authorNames.length - 1} diğerleri`;
  }

  getEntryPeriod(): string {
    if (!this.entry?.dates || (!this.entry.dates.periodStart && !this.entry.dates.periodEnd)) {
      return '';
    }

    const start = this.entry.dates.periodStart;
    const end = this.entry.dates.periodEnd;

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${start}`;
    } else if (end) {
      return `${end}`;
    }
    return '';
  }

  getPlacesText(): string {
    if (!this.entry || !this.entry.places.length) return '';

    return this.entry.places.map(place => `${place.name} (${place.admin.ilce}/${place.admin.il})`).join(', ');
  }

  navigateToEntry(entry: Entry): void {
    this.router.navigate(['/entry-detail', entry.id]); // '/MaddeDetay' yerine '/entry-detail' kullanın
  }

  navigateToAuthor(authorId: string): void {
    this.router.navigate(['/author-detail', authorId]);
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/entries'], { queryParams: { category: categoryId } });
  }

  goBackToEntries(): void {
    this.router.navigate(['/entries']);
  }

  toggleLike(): void {
    if (this.entry) {
      // Gerçek uygulamada burada API çağrısı yapılır
      this.entry.stats.likeCount += 1;
    }
  }

  shareEntry(): void {
    if (this.entry && navigator.share) {
      navigator.share({
        title: this.entry.title,
        text: this.entry.summary,
        url: window.location.href
      });
    } else if (this.entry) {
      // Fallback: URL'i panoya kopyala
      navigator.clipboard.writeText(window.location.href);
      // Burada bir toast mesajı gösterebilirsiniz
      console.log('URL panoya kopyalandı');
    }
  }

  printEntry(): void {
    window.print();
  }

  downloadPDF(): void {
    if (this.entry) {
      // PDF indirme işlemi (gerçek uygulamada API çağrısı)
      console.log(`${this.entry.title} PDF indiriliyor...`);
    }
  }

  trackByEntryId(index: number, entry: Entry): string {
    return entry.id;
  }
}
