import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Entry } from '../../models/entry.model';
import { EntryService } from '../../services/entry.service';
import { AuthorService } from '../../services/author.service';
import { CategoryService } from '../../services/category.service';
import { VolumeService } from '../../services/volume.service';
import { Author } from '../../models/author.model';
import { Category } from '../../models/category.model';
import { Volume } from '../../models/volume.model';



@Component({
  selector: 'app-entry-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-list.html',
  styleUrls: ['./entry-list.scss']
})
export class EntryList {
  entries = signal<Entry[]>([]);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  volumes = signal<Volume[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // filtre sinyalleri
  selectedAuthor = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);
  selectedVolume = signal<string | null>(null);

  constructor(
    private entryService: EntryService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private volumeService: VolumeService
  ) {
    this.fetchFilters();
    this.fetch();
  }

  fetchFilters() {
    this.authorService.getAll().subscribe(authors => this.authors.set(authors));
    this.categoryService.getAll().subscribe(cats => this.categories.set(cats));
    this.volumeService.getAll().subscribe(vols => this.volumes.set(vols));
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);

    this.entryService.list().subscribe({
      next: data => {
        let filtered = data;

        if (this.selectedAuthor()) {
          filtered = filtered.filter(e =>
            e.authorships?.some(a => a.authorId === this.selectedAuthor())
          );
        }

        if (this.selectedCategory()) {
          filtered = filtered.filter(e =>
            e.categoryIds?.includes(this.selectedCategory()!)
          );
        }

        if (this.selectedVolume()) {
          filtered = filtered.filter(e =>
            e.volume?.volumeId === this.selectedVolume()
          );
        }

        this.entries.set(filtered);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Veri yüklenirken hata oluştu');
        this.loading.set(false);
      }
    });
  }



  onFilterChange() {
    this.fetch();
  }
}
