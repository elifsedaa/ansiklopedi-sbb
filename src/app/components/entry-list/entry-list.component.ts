import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Entry } from '../../models/entry.model';
import { Author } from '../../models/author.model';
import { Category } from '../../models/category.model';
import { Volume } from '../../models/volume.model';

import { EntryService } from '../../services/entry.service';
import { AuthorService } from '../../services/author.service';
import { CategoryService } from '../../services/category.service';
import { VolumeService } from '../../services/volume.service';

@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent {
  // Veriler
  allEntries = signal<Entry[]>([]);   // tek seferde çekilen ham liste
  entries    = signal<Entry[]>([]);   // filtrelenmiş liste
  authors    = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  volumes    = signal<Volume[]>([]);

  // UI durumları
  loading = signal<boolean>(true);
  error   = signal<string | null>(null);

  // Filtre sinyalleri (string ID veya null)
  selectedAuthor   = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);
  selectedVolume   = signal<string | null>(null);

  constructor(
    private entryService: EntryService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private volumeService: VolumeService
  ) {
    this.fetchFilters(); // dropdown kaynakları
    this.fetch();        // entries (tek sefer)
  }

  // Dropdown verilerini çek
  fetchFilters() {
    this.authorService.getAll().subscribe({
      next: (authors) => this.authors.set(authors),
      error: (err) => console.error('authors load error', err),
    });

    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('categories load error', err),
    });

    this.volumeService.getAll().subscribe({
      next: (vols) => this.volumes.set(vols),
      error: (err) => console.error('volumes load error', err),
    });
  }

  // Entries’i tek seferde çek
  fetch() {
    this.loading.set(true);
    this.error.set(null);

    this.entryService.list().subscribe({
      next: (data) => {
        this.allEntries.set(data);
        this.applyFilters(); // ilk yüklemede de filtre uygula (filtreler null ise tümü)
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Veri yüklenirken hata oluştu');
        this.loading.set(false);
      },
    });
  }

  // Frontend’de filtrele (ID’ler string!)
  applyFilters() {
    const authorId   = this.selectedAuthor();
    const categoryId = this.selectedCategory();
    const volumeId   = this.selectedVolume();

    let list = this.allEntries();

    // Yazar filtresi: entry.authorships[].authorId === selectedAuthor
    if (authorId) {
      list = list.filter(e => e.authorships?.some(a => a.authorId === authorId));
    }

    // Kategori filtresi: entry.categoryIds[] includes selectedCategory
    if (categoryId) {
      list = list.filter(e => e.categoryIds?.includes(categoryId));
    }

    // Cilt filtresi: entry.volume?.volumeId === selectedVolume
    if (volumeId) {
      list = list.filter(e => e.volume?.volumeId === volumeId);
    }

    this.entries.set(list);
  }

  // Dropdown’lar değişince çağır
  onFilterChange() {
    this.applyFilters();
  }

  // Template için yardımcı: volumeId'den volume title bul
  getVolumeTitleById(volumeId?: string | null): string {
    if (!volumeId) return 'Bilinmiyor';
    const vol = this.volumes().find(v => v.id === volumeId);
    return vol?.title ?? 'Bilinmiyor';
  }
}
