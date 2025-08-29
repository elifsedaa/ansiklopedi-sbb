import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { Entry } from '../../models';
import { HomeDataService } from '../../services/home-data.service';

interface AlphabetLetter {
  letter: string;
  count: number;
  isActive: boolean;
}

interface PaginationEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    // DropdownModule,
    TagModule,
    PaginatorModule,
    SkeletonModule,
    TooltipModule
  ],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  // Türk alfabesi sırası
  turkishAlphabet: AlphabetLetter[] = [
    { letter: 'A', count: 0, isActive: false },
    { letter: 'B', count: 0, isActive: false },
    { letter: 'C', count: 0, isActive: false },
    { letter: 'Ç', count: 0, isActive: false },
    { letter: 'D', count: 0, isActive: false },
    { letter: 'E', count: 0, isActive: false },
    { letter: 'F', count: 0, isActive: false },
    { letter: 'G', count: 0, isActive: false },
    { letter: 'Ğ', count: 0, isActive: false },
    { letter: 'H', count: 0, isActive: false },
    { letter: 'I', count: 0, isActive: false },
    { letter: 'İ', count: 0, isActive: false },
    { letter: 'J', count: 0, isActive: false },
    { letter: 'K', count: 0, isActive: false },
    { letter: 'L', count: 0, isActive: false },
    { letter: 'M', count: 0, isActive: false },
    { letter: 'N', count: 0, isActive: false },
    { letter: 'O', count: 0, isActive: false },
    { letter: 'Ö', count: 0, isActive: false },
    { letter: 'P', count: 0, isActive: false },
    { letter: 'R', count: 0, isActive: false },
    { letter: 'S', count: 0, isActive: false },
    { letter: 'Ş', count: 0, isActive: false },
    { letter: 'T', count: 0, isActive: false },
    { letter: 'U', count: 0, isActive: false },
    { letter: 'Ü', count: 0, isActive: false },
    { letter: 'V', count: 0, isActive: false },
    { letter: 'Y', count: 0, isActive: false },
    { letter: 'Z', count: 0, isActive: false },
    { letter: '#', count: 0, isActive: false } // Sayılar ve semboller
  ];

  allEntries: Entry[] = [];
  filteredEntries: Entry[] = [];
  paginatedEntries: Entry[] = [];

  selectedLetter = 'A';
  searchTerm = '';
  loading = false;

  // Pagination
  first = 0;
  rows = 12; // 3x4 grid layout
  totalRecords = 0;

  // Filters
  sortOptions = [
    { label: 'Alfabetik (A-Z)', value: 'title-asc' },
    { label: 'Alfabetik (Z-A)', value: 'title-desc' },
    { label: 'En Popüler', value: 'popular' },
    { label: 'En Yeni', value: 'newest' },
    { label: 'En Çok Görüntülenen', value: 'most-viewed' }
  ];
  selectedSort = 'title-asc';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private homeService: HomeDataService
  ) {}

  ngOnInit(): void {
    this.loadEntries();
    this.checkRouteParams();
  }

  checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['letter']) {
        this.selectedLetter = params['letter'].toUpperCase();
        this.updateActiveAlphabet();
        this.filterEntriesByLetter();
      }
      if (params['search']) {
        this.searchTerm = params['search'];
        this.performSearch();
      }
    });
  }

  loadEntries(): void {
    this.loading = true;

    this.homeService.getEntries().subscribe({
      next: (entries) => {
        this.allEntries = entries.filter(entry => entry.status === 'published');
        this.calculateLetterCounts();
        this.updateActiveAlphabet();
        this.filterEntriesByLetter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Maddeler yüklenirken hata oluştu:', error);
        this.loading = false;
      }
    });
  }

  calculateLetterCounts(): void {
    this.turkishAlphabet.forEach(letterObj => {
      if (letterObj.letter === '#') {
        // Sayı veya sembol ile başlayan maddeler
        letterObj.count = this.allEntries.filter(entry =>
          /^[0-9]/.test(this.getTitleFirstLetter(entry.title))
        ).length;
      } else {
        letterObj.count = this.allEntries.filter(entry =>
          this.getTitleFirstLetter(entry.title) === letterObj.letter
        ).length;
      }
    });
  }

  getTitleFirstLetter(title: string): string {
    if (!title) return '#';

    const firstChar = title.charAt(0).toUpperCase();

    // Türkçe karakter dönüşümleri
    const turkishMap: { [key: string]: string } = {
      'Ç': 'Ç', 'Ğ': 'Ğ', 'İ': 'İ', 'Ö': 'Ö', 'Ş': 'Ş', 'Ü': 'Ü',
      'I': 'I' // Büyük I ayrı tutuluyor
    };

    if (turkishMap[firstChar]) {
      return turkishMap[firstChar];
    }

    // Normal harfler
    if (/^[A-Z]$/.test(firstChar)) {
      return firstChar;
    }

    // Sayı veya sembol
    return '#';
  }

  selectLetter(letter: string): void {
    this.selectedLetter = letter;
    this.searchTerm = '';
    this.first = 0; // Reset pagination

    // URL'i güncelle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { letter: letter },
      queryParamsHandling: 'merge'
    });

    this.updateActiveAlphabet();
    this.filterEntriesByLetter();
  }

  updateActiveAlphabet(): void {
    this.turkishAlphabet.forEach(letterObj => {
      letterObj.isActive = letterObj.letter === this.selectedLetter;
    });
  }

  filterEntriesByLetter(): void {
    let filtered: Entry[] = [];

    if (this.selectedLetter === '#') {
      // Sayı ile başlayan maddeler
      filtered = this.allEntries.filter(entry =>
        /^[0-9]/.test(this.getTitleFirstLetter(entry.title))
      );
    } else {
      // Belirtilen harf ile başlayan maddeler
      filtered = this.allEntries.filter(entry =>
        this.getTitleFirstLetter(entry.title) === this.selectedLetter
      );
    }

    this.filteredEntries = this.sortEntries(filtered);
    this.totalRecords = this.filteredEntries.length;
    this.updatePaginatedEntries();
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filterEntriesByLetter();
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredEntries = this.allEntries.filter(entry =>
      entry.title.toLowerCase().includes(searchLower) ||
      entry.summary.toLowerCase().includes(searchLower)
    );

    this.filteredEntries = this.sortEntries(this.filteredEntries);
    this.totalRecords = this.filteredEntries.length;
    this.first = 0;
    this.updatePaginatedEntries();

    // URL'i güncelle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchTerm, letter: null },
      queryParamsHandling: 'merge'
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });
    this.filterEntriesByLetter();
  }

  sortEntries(entries: Entry[]): Entry[] {
    switch (this.selectedSort) {
      case 'title-asc':
        return entries.sort((a, b) => a.title.localeCompare(b.title, 'tr'));

      case 'title-desc':
        return entries.sort((a, b) => b.title.localeCompare(a.title, 'tr'));

      case 'popular':
        return entries.sort((a, b) => {
          const scoreA = (a.stats?.viewCount || 0) + (a.stats?.likeCount || 0) * 2;
          const scoreB = (b.stats?.viewCount || 0) + (b.stats?.likeCount || 0) * 2;
          return scoreB - scoreA;
        });

      case 'newest':
        return entries.sort((a, b) => {
          const dateA = new Date(a.createdAt || '').getTime();
          const dateB = new Date(b.createdAt || '').getTime();
          return dateB - dateA;
        });

      case 'most-viewed':
        return entries.sort((a, b) =>
          (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0)
        );

      default:
        return entries;
    }
  }

  onSortChange(): void {
    this.filteredEntries = this.sortEntries([...this.filteredEntries]);
    this.first = 0;
    this.updatePaginatedEntries();
  }

  onPageChange(event: any): void {   // event: PaginatorState veya any
    this.first = event.first ?? 0;   // undefined ise 0
    this.rows = event.rows ?? 12;    // undefined ise 12
    this.updatePaginatedEntries();

    // Sayfanın en üstüne scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePaginatedEntries(): void {
    const start = this.first;
    const end = this.first + this.rows;
    this.paginatedEntries = this.filteredEntries.slice(start, end);
  }

  navigateToEntry(entryId: string): void {
    this.router.navigate(['/MaddeDetay', entryId]);
  }

  getEntryUrl(entry: Entry): string {
    return `/MaddeDetay/${entry.id}`;
  }

  // Helper methods
  getSelectedLetterCount(): number {
    const letterObj = this.turkishAlphabet.find(l => l.letter === this.selectedLetter);
    return letterObj ? letterObj.count : 0;
  }

  getSelectedLetterName(): string {
    if (this.selectedLetter === '#') {
      return 'Sayılar ve Semboller';
    }
    return `${this.selectedLetter} Harfi`;
  }

  // Madde kategorisi badge rengi
  getCategoryBadgeClass(entry: Entry): string {
    // İlk kategori ID'sine göre renk belirleme
    const categoryId = entry.categoryIds?.[0];
    if (!categoryId) return 'bg-gray';

    const colorMap: { [key: string]: string } = {
      'tarih': 'bg-blue',
      'kultur': 'bg-green',
      'cografya': 'bg-orange',
      'biyografi': 'bg-purple',
      'sanat': 'bg-pink',
      'spor': 'bg-red',
      'ekonomi': 'bg-yellow',
      'egitim': 'bg-cyan'
    };

    return colorMap[categoryId] || 'bg-gray';
  }

  // Arama önerisi için
  onSearchInput(): void {
    if (this.searchTerm.length >= 2) {
      // Debounce için setTimeout kullanılabilir
      this.performSearch();
    } else if (this.searchTerm.length === 0) {
      this.clearSearch();
    }
  }

  // Yazar metni oluştur
  getAuthorsText(entry: Entry): string {
    if (!entry.authorships || entry.authorships.length === 0) {
      return 'Bilinmeyen Yazar';
    }

    // Sadece ilk yazarı göster, birden fazla varsa "ve diğerleri" ekle
    if (entry.authorships.length === 1) {
      return `Yazar: ${entry.authorships[0].authorId}`;
    } else {
      return `${entry.authorships[0].authorId} ve ${entry.authorships.length - 1} diğerleri`;
    }
  }

  // Math helper for template
  Math = Math;
}
