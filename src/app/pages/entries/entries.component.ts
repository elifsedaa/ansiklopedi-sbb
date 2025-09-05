import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Entry } from '../../models';
import { HomeDataService } from '../../services/home-data.service';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BreadcrumbModule
  ],
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {
  authors: Author[] = []; // yazarları tutacak dizi
  entries: Entry[] = [];
  filteredEntries: Entry[] = [];
  selectedLetter: string = 'Tümü';
  searchTerm: string = '';
  loading: boolean = false;
  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = {};

  // Pagination
  currentPage: number = 1;
  entriesPerPage: number = 12;
  totalEntries: number = 0;

  // Türkçe alfabesi
  alphabet = ['Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z', '#'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private homeService: HomeDataService,
    private authorService: AuthorService // inject et

) {}
  authorsMap: { [id: string]: Author } = {};


  ngOnInit(): void {
    this.initBreadcrumb();
    this.loadAuthorsAndEntries(); // yeni fonksiyon
    this.loadEntries();
    this.checkRouteParams();
  }

  loadAuthorsAndEntries(): void {
    this.authorService.getAll().subscribe(authors => {
      this.authorsMap = authors.reduce((acc, author) => {
        acc[author.id] = author;
        return acc;
      }, {} as { [id: string]: Author });

      // Yazarlar yüklendikten sonra entryleri yükle
      this.loadEntries();
    });
  }

  initBreadcrumb(): void {
    this.home = { icon: 'pi pi-home', label: 'Anasayfa', routerLink: '/' };
    this.breadcrumbItems = [
      { label: 'Maddeler' }
    ];
  }

  checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['letter']) {
        this.selectedLetter = params['letter'];
        this.filterByLetter(this.selectedLetter);
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
        this.entries = entries.filter(entry => entry.status === 'published');
        this.filteredEntries = this.entries;
        this.totalEntries = this.entries.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Maddeler yüklenirken hata oluştu:', error);
        this.loading = false;
      }
    });
  }

  // URL temizleme sorunu düzeltildi
  filterByLetter(letter: string): void {
    this.selectedLetter = letter;
    this.searchTerm = ''; // Search term'i temizle
    this.currentPage = 1;

    if (letter === 'Tümü') {
      this.filteredEntries = this.entries;
    } else if (letter === '#') {
      this.filteredEntries = this.entries.filter(entry =>
        /^[0-9]/.test(entry.title.charAt(0))
      );
    } else {
      this.filteredEntries = this.entries.filter(entry =>
        entry.title.toLocaleUpperCase('tr-TR').startsWith(letter)
      );
    }

    this.totalEntries = this.filteredEntries.length;

    // URL'i güncelle - search parametresini tamamen temizle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { letter: letter, search: null },
      queryParamsHandling: 'replace' // 'merge' yerine 'replace' kullan
    });
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredEntries = this.entries.filter(entry =>
      entry.title.toLowerCase().includes(searchLower) ||
      entry.summary.toLowerCase().includes(searchLower)
    );

    this.totalEntries = this.filteredEntries.length;
    this.currentPage = 1;

    // URL'i güncelle - letter parametresini temizle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchTerm, letter: null },
      queryParamsHandling: 'replace' // 'merge' yerine 'replace'
    });
  }

  clearSearch(): void {
    this.searchTerm = '';

    // URL'den search parametresini tamamen kaldır
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'replace' // 'merge' yerine 'replace'
    });

    this.filterByLetter('Tümü');
  }

  onSearchInput(): void {
    if (this.searchTerm.length >= 2) {
      this.performSearch();
    } else if (this.searchTerm.length === 0) {
      this.clearSearch();
    }
  }

  getEntryCount(letter: string): number {
    if (letter === 'Tümü') {
      return this.entries.length;
    } else if (letter === '#') {
      return this.entries.filter(entry =>
        /^[0-9]/.test(entry.title.charAt(0))
      ).length;
    } else {
      return this.entries.filter(entry =>
        entry.title.toLocaleUpperCase('tr-TR').startsWith(letter)
      ).length;
    }
  }

  navigateToEntry(entry: Entry): void {
    this.router.navigate(['/entry-detail', entry.id]);
  }


  getEntryImage(entry: Entry): string {
    // Eğer entry.id ile resim yoksa veya entry.image yoksa default resim
    return entry.id
      ? `assets/images/entries/${entry.id}.jpg`
      : 'assets/images/entries/default.jpg';
  }

// Hata durumunda fallback resim
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/entries/default.jpg';
  }


  // getEntryImage(entry: Entry): string {
  //   return `assets/images/entries/${entry.id}.jpg`;
  // }
  //
  // onImageError(event: Event): void {
  //   const target = event.target as HTMLImageElement;
  //   target.src = 'assets/images/entries/default.jpg';
  // }

  getCategoryBadgeClass(entry: Entry): string {
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

  // getAuthorsText(entry: Entry): string {
  //   if (!entry.authorships || entry.authorships.length === 0) {
  //     return 'Bilinmeyen Yazar';
  //   }
  //
  //   if (entry.authorships.length === 1) {
  //     return `${entry.authorships[0].authorId}`;
  //   } else {
  //     return `${entry.authorships[0].authorId} ve ${entry.authorships.length - 1} diğerleri`;
  //   }
  // }





  getAuthorsText(entry: Entry): string {
    const authorships = entry.authorships || [];
    if (authorships.length === 0) return 'Bilinmeyen Yazar';

    const firstAuthor = this.authorsMap[authorships[0].authorId];
    const firstAuthorName = firstAuthor?.fullName || 'Bilinmeyen Yazar';

    if (authorships.length === 1) return firstAuthorName;
    return `${firstAuthorName} ve ${authorships.length - 1} diğerleri`;
  }






  // Pagination methods
  getPaginatedEntries(): Entry[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    return this.filteredEntries.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalEntries / this.entriesPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Helper method for template
  Math = Math;
}
