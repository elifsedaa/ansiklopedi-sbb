// src/app/pages/add-publication/add-publication.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Category, Author, Volume } from '../../core/services/api.service';

@Component({
  selector: 'app-add-publication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="add-publication-container">
      <div class="add-publication-header">
        <h1>Yeni Yayın Ekle</h1>
        <p>Ansiklopediye yeni bir madde ekleyin</p>
      </div>

      <form [formGroup]="publicationForm" (ngSubmit)="onSubmit()" class="publication-form">

        <!-- Basic Information -->
        <div class="form-section">
          <h3>Temel Bilgiler</h3>

          <div class="form-group">
            <label for="title">Başlık *</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-control"
              placeholder="Madde başlığını giriniz"
            >
            <div class="error-message" *ngIf="publicationForm.get('title')?.invalid && publicationForm.get('title')?.touched">
              Başlık zorunludur
            </div>
          </div>

          <div class="form-group">
            <label for="slug">URL Slug</label>
            <input
              type="text"
              id="slug"
              formControlName="slug"
              class="form-control"
              placeholder="url-dostu-baslik (otomatik oluşturulur)"
            >
            <small class="form-hint">Boş bırakılırsa başlıktan otomatik oluşturulur</small>
          </div>

          <div class="form-group">
            <label for="summary">Özet *</label>
            <textarea
              id="summary"
              formControlName="summary"
              class="form-control"
              rows="3"
              placeholder="Maddenin kısa özeti..."
            ></textarea>
            <div class="error-message" *ngIf="publicationForm.get('summary')?.invalid && publicationForm.get('summary')?.touched">
              Özet zorunludur
            </div>
          </div>

          <div class="form-group">
            <label for="body">İçerik *</label>
            <textarea
              id="body"
              formControlName="body"
              class="form-control"
              rows="10"
              placeholder="Maddenin detaylı içeriği..."
            ></textarea>
            <div class="error-message" *ngIf="publicationForm.get('body')?.invalid && publicationForm.get('body')?.touched">
              İçerik zorunludur
            </div>
          </div>
        </div>

        <!-- Categories and Tags -->
        <div class="form-section">
          <h3>Kategoriler ve Etiketler</h3>

          <div class="form-group">
            <label>Kategoriler *</label>
            <div class="checkbox-group">
              <div
                class="checkbox-item"
                *ngFor="let category of categories"
              >
                <input
                  type="checkbox"
                  [id]="'cat_' + category.id"
                  [value]="category.id"
                  (change)="onCategoryChange($event, category.id)"
                >
                <label [for]="'cat_' + category.id">{{ category.name }}</label>
                <small class="category-desc">{{ category.description }}</small>
              </div>
            </div>
            <div class="error-message" *ngIf="selectedCategories.length === 0 && formSubmitted">
              En az bir kategori seçmelisiniz
            </div>
          </div>

          <div class="form-group">
            <label for="tags">Etiketler</label>
            <input
              type="text"
              id="tags"
              formControlName="tags"
              class="form-control"
              placeholder="tag1, tag2, tag3 (virgülle ayırın)"
            >
            <small class="form-hint">Etiketleri virgülle ayırın</small>
          </div>
        </div>

        <!-- Publication Details -->
        <div class="form-section">
          <h3>Yayın Detayları</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="volumeId">Cilt</label>
              <select id="volumeId" formControlName="volumeId" class="form-control">
                <option value="">Cilt Seçiniz</option>
                <option *ngFor="let volume of volumes" [value]="volume.id">
                  {{ volume.title }} ({{ volume.number }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="pageStart">Başlangıç Sayfası</label>
              <input
                type="number"
                id="pageStart"
                formControlName="pageStart"
                class="form-control"
                min="1"
              >
            </div>

            <div class="form-group">
              <label for="pageEnd">Bitiş Sayfası</label>
              <input
                type="number"
                id="pageEnd"
                formControlName="pageEnd"
                class="form-control"
                min="1"
              >
            </div>
          </div>
        </div>

        <!-- Geographic Information -->
        <div class="form-section">
          <h3>Coğrafi Bilgiler</h3>

          <div formArrayName="places">
            <div
              class="place-item"
              *ngFor="let place of places.controls; let i = index"
              [formGroupName]="i"
            >
              <div class="form-row">
                <div class="form-group">
                  <label>Yer Adı</label>
                  <input
                    type="text"
                    formControlName="name"
                    class="form-control"
                    placeholder="Yer adı"
                  >
                </div>
                <div class="form-group">
                  <label>İl</label>
                  <input
                    type="text"
                    formControlName="il"
                    class="form-control"
                    placeholder="İl"
                  >
                </div>
                <div class="form-group">
                  <label>İlçe</label>
                  <input
                    type="text"
                    formControlName="ilce"
                    class="form-control"
                    placeholder="İlçe"
                  >
                </div>
                <button
                  type="button"
                  class="remove-btn"
                  (click)="removePlace(i)"
                  *ngIf="places.length > 1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="add-btn" (click)="addPlace()">
            + Yer Ekle
          </button>
        </div>

        <!-- Time Period -->
        <div class="form-section">
          <h3>Zaman Dönemi</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="periodStart">Başlangıç Yılı</label>
              <input
                type="number"
                id="periodStart"
                formControlName="periodStart"
                class="form-control"
                min="1000"
                max="2024"
              >
            </div>

            <div class="form-group">
              <label for="periodEnd">Bitiş Yılı</label>
              <input
                type="number"
                id="periodEnd"
                formControlName="periodEnd"
                class="form-control"
                min="1000"
                max="2024"
              >
            </div>
          </div>
        </div>

        <!-- SEO Information -->
        <div class="form-section">
          <h3>SEO Bilgileri</h3>

          <div class="form-group">
            <label for="metaTitle">Meta Başlık</label>
            <input
              type="text"
              id="metaTitle"
              formControlName="metaTitle"
              class="form-control"
              placeholder="SEO başlığı (boş bırakılırsa başlık kullanılır)"
            >
          </div>

          <div class="form-group">
            <label for="metaDescription">Meta Açıklama</label>
            <textarea
              id="metaDescription"
              formControlName="metaDescription"
              class="form-control"
              rows="2"
              placeholder="SEO açıklaması (boş bırakılırsa özet kullanılır)"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" [routerLink]="['/yayinlar']">
            İptal
          </button>
          <button type="submit" class="btn-primary" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Kaydediliyor...' : 'Yayını Kaydet' }}
          </button>
        </div>

        <!-- Validation Summary -->
        <div class="validation-summary" *ngIf="formSubmitted && publicationForm.invalid">
          <h4>Lütfen aşağıdaki alanları kontrol edin:</h4>
          <ul>
            <li *ngIf="publicationForm.get('title')?.invalid">Başlık zorunludur</li>
            <li *ngIf="publicationForm.get('summary')?.invalid">Özet zorunludur</li>
            <li *ngIf="publicationForm.get('body')?.invalid">İçerik zorunludur</li>
            <li *ngIf="selectedCategories.length === 0">En az bir kategori seçmelisiniz</li>
          </ul>
        </div>
      </form>

      <!-- Success Message -->
      <div class="success-message" *ngIf="showSuccess">
        <div class="success-content">
          <div class="success-icon">✅</div>
          <h3>Yayın Başarıyla Eklendi!</h3>
          <p>Yeni maddeniz sistem yöneticileri tarafından incelendikten sonra yayınlanacaktır.</p>
          <button class="btn-primary" [routerLink]="['/yayinlar']">
            Yayınları Görüntüle
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./add-publication.component.scss']
})
export class AddPublicationComponent implements OnInit {
  publicationForm: FormGroup;
  categories: Category[] = [];
  authors: Author[] = [];
  volumes: Volume[] = [];
  selectedCategories: string[] = [];

  formSubmitted = false;
  isSubmitting = false;
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.publicationForm = this.createForm();
  }

  ngOnInit() {
    this.loadFormData();
    this.setupFormWatchers();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      slug: [''],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      body: ['', [Validators.required, Validators.minLength(50)]],
      tags: [''],
      volumeId: [''],
      pageStart: [null],
      pageEnd: [null],
      periodStart: [null],
      periodEnd: [null],
      metaTitle: [''],
      metaDescription: [''],
      places: this.fb.array([this.createPlaceGroup()])
    });
  }

  createPlaceGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      il: [''],
      ilce: [''],
      lat: [null],
      lng: [null]
    });
  }

  get places(): FormArray {
    return this.publicationForm.get('places') as FormArray;
  }

  loadFormData() {
    // Load categories
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load authors
    this.apiService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
      },
      error: (error) => {
        console.error('Error loading authors:', error);
      }
    });

    // Load volumes
    this.apiService.getVolumes().subscribe({
      next: (volumes) => {
        this.volumes = volumes;
      },
      error: (error) => {
        console.error('Error loading volumes:', error);
      }
    });
  }

  setupFormWatchers() {
    // Auto-generate slug from title
    this.publicationForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.publicationForm.get('slug')?.value) {
        const slug = this.generateSlug(title);
        this.publicationForm.get('slug')?.setValue(slug);
      }
    });

    // Auto-fill meta fields
    this.publicationForm.get('title')?.valueChanges.subscribe(title => {
      if (title && !this.publicationForm.get('metaTitle')?.value) {
        this.publicationForm.get('metaTitle')?.setValue(title);
      }
    });

    this.publicationForm.get('summary')?.valueChanges.subscribe(summary => {
      if (summary && !this.publicationForm.get('metaDescription')?.value) {
        this.publicationForm.get('metaDescription')?.setValue(summary);
      }
    });
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  onCategoryChange(event: any, categoryId: string) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
  }

  addPlace() {
    this.places.push(this.createPlaceGroup());
  }

  removePlace(index: number) {
    if (this.places.length > 1) {
      this.places.removeAt(index);
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.publicationForm.valid && this.selectedCategories.length > 0) {
      this.isSubmitting = true;

      // Prepare the data
      const formData = this.publicationForm.value;
      const newEntry = {
        id: 'ent_' + Date.now(), // Temporary ID generation
        slug: formData.slug || this.generateSlug(formData.title),
        maddeNo: Math.floor(Math.random() * 10000) + 1000, // Temporary madde number
        title: formData.title,
        summary: formData.summary,
        body: formData.body,
        categoryIds: this.selectedCategories,
        tagIds: formData.tags ? formData.tags.split(',').map((tag: string) => 'tag_' + tag.trim()) : [],
        authorships: [
          {
            authorId: 'auth_001', // Default author for demo
            role: 'Yazar',
            order: 1
          }
        ],
        volume: {
          volumeId: formData.volumeId || 'vol_01',
          pageStart: formData.pageStart || 1,
          pageEnd: formData.pageEnd || 1
        },
        dates: {
          periodStart: formData.periodStart,
          periodEnd: formData.periodEnd
        },
        places: formData.places.filter((place: any) => place.name).map((place: any) => ({
          name: place.name,
          geo: { lat: place.lat || 40.7, lng: place.lng || 30.4 },
          admin: { il: place.il || 'Sakarya', ilce: place.ilce || '' }
        })),
        media: [],
        references: [],
        relatedEntryIds: [],
        seo: {
          metaTitle: formData.metaTitle || formData.title,
          metaDescription: formData.metaDescription || formData.summary
        },
        stats: {
          viewCount: 0,
          likeCount: 0
        },
        status: 'pending',
        language: 'tr',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      setTimeout(() => {
        console.log('New entry data:', newEntry);
        this.isSubmitting = false;
        this.showSuccess = true;

        // Reset form
        this.publicationForm.reset();
        this.selectedCategories = [];
        this.formSubmitted = false;
      }, 2000);

      // In real implementation, you would call:
      // this.apiService.createEntry(newEntry).subscribe(...)
    }
  }
}
