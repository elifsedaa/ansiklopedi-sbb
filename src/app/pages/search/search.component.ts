import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HomeDataService } from '../../services/home-data.service';
import { AuthorService } from '../../services/author.service';
import { forkJoin } from 'rxjs';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  loading: boolean = false;

  // Results
  entryResults: any[] = [];
  authorResults: any[] = [];
  totalResults: number = 0;

  // Filter
  activeFilter: 'all' | 'entries' | 'authors' = 'all';

  // Pagination
  displayedEntriesCount: number = 5;
  displayedAuthorsCount: number = 3;
  entriesPerPage: number = 5;
  authorsPerPage: number = 3;

  // Data
  allData: any = null;
  categories: any[] = [];
  authors: Author[] = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeDataService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    console.log('Loading data...');

    // Önce veriyi yükle
    this.loadData();

    // Query parametrelerini sürekli dinle
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query && this.allData) {
        console.log('Query param changed:', query);
        this.searchTerm = query;
        this.performSearch();
      } else if (query && !this.allData) {
        // Veri henüz yüklenmemişse, yüklendikten sonra arama yap
        this.searchTerm = query;
      }
    });
  }

  private loadData() {
    // Paralel olarak veri yükle
    forkJoin({
      entries: this.homeService.getEntries(),
      authors: this.authorService.getAll(),
      categories: this.homeService.getCategories ? this.homeService.getCategories() : []
    }).subscribe({
      next: (data) => {
        console.log('Data loaded:', data);

        // Sadece yayımlanmış entryleri filtrele
        this.allData = {
          entries: data.entries.filter((entry: any) => entry.status === 'published'),
          authors: data.authors,
          categories: data.categories || []
        };

        this.categories = this.allData.categories;
        this.authors = this.allData.authors;

        // Eğer searchTerm varsa (URL'den geldi), aramayı yap
        if (this.searchTerm) {
          console.log('Performing initial search for:', this.searchTerm);
          this.performSearch();
        }
      },
      error: (error) => {
        console.error('Data loading error:', error);
        this.loading = false;
      }
    });
  }

  performSearch() {
    console.log('Search term:', this.searchTerm);
    console.log('All data:', this.allData);

    if (!this.searchTerm.trim() || !this.allData) {
      console.log('Early return - no search term or data');
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.searchEntries();
      this.searchAuthors();
      console.log('Entry results:', this.entryResults);
      console.log('Author results:', this.authorResults);
      this.updateTotalResults();
      this.loading = false;
    }, 300);
  }

  searchEntries() {
    const term = this.normalizeText(this.searchTerm.trim());

    this.entryResults = (this.allData.entries || []).filter((entry: any) => {
      return (
        this.normalizeText(entry.title || '').includes(term) ||
        this.normalizeText(entry.summary || '').includes(term) ||
        this.normalizeText(entry.body || '').includes(term) ||
        entry.places?.some((place: any) =>
          this.normalizeText(place.name || '').includes(term) ||
          (place.admin && (
            this.normalizeText(place.admin.il || '').includes(term) ||
            this.normalizeText(place.admin.ilce || '').includes(term)
          ))
        )
      );
    });
  }

  searchAuthors() {
    const term = this.normalizeText(this.searchTerm.trim());

    this.authorResults = (this.authors || []).filter(author => {
      return (
        this.normalizeText(author.fullName || '').includes(term) ||
        this.normalizeText(author.bio || '').includes(term) ||
        this.normalizeText(author.affiliation || '').includes(term)
      );
    });
  }

  // Türkçe karakterleri normalize eden fonksiyon
  private normalizeText(text: string): string {
    return text
      .toLocaleLowerCase('tr-TR') // Türkçe locale ile küçük harf
      .normalize('NFD') // Unicode normalization
      .replace(/[\u0300-\u036f]/g, ''); // Aksanları kaldır
  }

  updateTotalResults() {
    this.totalResults = this.entryResults.length + this.authorResults.length;
  }

  setFilter(filter: 'all' | 'entries' | 'authors') {
    this.activeFilter = filter;
    this.displayedEntriesCount = this.entriesPerPage;
    this.displayedAuthorsCount = this.authorsPerPage;
  }

  shouldShowEntries(): boolean {
    return this.entryResults.length > 0 && (this.activeFilter === 'all' || this.activeFilter === 'entries');
  }

  shouldShowAuthors(): boolean {
    return this.authorResults.length > 0 && (this.activeFilter === 'all' || this.activeFilter === 'authors');
  }

  getDisplayedEntries(): any[] {
    return this.entryResults.slice(0, this.displayedEntriesCount);
  }

  getDisplayedAuthors(): any[] {
    return this.authorResults.slice(0, this.displayedAuthorsCount);
  }

  shouldShowMoreEntriesButton(): boolean {
    return this.entryResults.length > this.displayedEntriesCount && this.shouldShowEntries();
  }

  shouldShowMoreAuthorsButton(): boolean {
    return this.authorResults.length > this.displayedAuthorsCount && this.shouldShowAuthors();
  }

  showMoreEntries() {
    this.displayedEntriesCount += this.entriesPerPage;
  }

  showMoreAuthors() {
    this.displayedAuthorsCount += this.authorsPerPage;
  }

  highlightText(text: string): string {
    if (!text || !this.searchTerm) return text;

    const term = this.searchTerm.trim();
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  getEntryAuthor(entry: any): string {
    if (!entry.authorships || entry.authorships.length === 0) return '';

    const authorId = entry.authorships[0].authorId;
    const author = this.authors.find(auth => auth.id === authorId);
    return author ? author.fullName : '';
  }
}
