import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { HomeDataService } from '../../services/home-data.service';
import { Category, Entry, Author, Volume } from '../../models';
import { CategoryService } from '../../services/category.service';


interface Stats {
  totalEntries: number;
  totalAuthors: number;
  totalVolumes: number;
  totalCategories: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stats: Stats = {
    totalEntries: 0,
    totalAuthors: 0,
    totalVolumes: 0,
    totalCategories: 0
  };

  featuredCategories: Category[] = [];
  featuredEntries: Entry[] = [];
  featuredAuthors: Author[] = [];
  featuredVolumes: Volume[] = [];

  constructor(
    public router: Router,
    private homeService: HomeDataService,
    private categoryService: CategoryService // Yeni eklenen

  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // // Kategorileri yükle
    // this.homeService.getCategories().subscribe(categories => {
    //   this.featuredCategories = categories;
    //   this.stats.totalCategories = categories.length;
    // });

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.featuredCategories = categories.slice(0, 6); // İlk 6 kategoriyi al
        this.stats.totalCategories = categories.length;
      },
      error: (error) => {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    });



    // En popüler maddeleri yükle (görüntülenme + beğeni sayısına göre)
    this.homeService.getEntries().subscribe(entries => {
      this.featuredEntries = entries
        .sort((a, b) => {
          const scoreA = (a.stats?.viewCount || 0) + (a.stats?.likeCount || 0) * 10;
          const scoreB = (b.stats?.viewCount || 0) + (b.stats?.likeCount || 0) * 10;
          return scoreB - scoreA;
        })
        .slice(0, 6); // İlk 6 maddeyi al

      this.stats.totalEntries = entries.length;
    });

    // En aktif yazarları yükle (maddelerinin toplam görüntülenme sayısına göre)
    this.homeService.getAuthors().subscribe(authors => {
      this.homeService.getEntries().subscribe(entries => {
        // Her yazar için maddelerinin toplam görüntülenme sayısını hesapla
        const authorsWithStats = authors.map(author => {
          const authorEntries = entries.filter(entry =>
            entry.authorships?.some(authorship => authorship.authorId === author.id)
          );

          const totalViews = authorEntries.reduce((sum, entry) =>
            sum + (entry.stats?.viewCount || 0), 0
          );

          return { ...author, totalViews };
        });

        // En çok görüntülenen maddelerine sahip 3 yazarı seç
        this.featuredAuthors = authorsWithStats
          .sort((a, b) => b.totalViews - a.totalViews)
          .slice(0, 3);

        this.stats.totalAuthors = authors.length;
      });
    });

    // Ciltleri yükle
    this.homeService.getVolumes().subscribe(volumes => {
      this.featuredVolumes = volumes.slice(0, 3); // İlk 3 cildi göster
      this.stats.totalVolumes = volumes.length;
    });
  }
  getCategoryIcon(categoryIdOrName: string): string {
    // Senin JSON'undaki kategorilere uygun ikon haritası
    const iconMap: { [key: string]: string } = {
      'cat_tarih': 'fas fa-scroll',
      'tarih': 'fas fa-scroll',
      'cat_mimari': 'fas fa-building',
      'mimari': 'fas fa-building',
      'cat_turizm': 'fas fa-map-marked-alt',
      'turizm': 'fas fa-map-marked-alt',
      'cat_doga': 'fas fa-leaf',
      'doga': 'fas fa-leaf',
      'doğa': 'fas fa-leaf',
      'cat_cografya': 'fas fa-globe-europe',
      'cografya': 'fas fa-globe-europe',
      'coğrafya': 'fas fa-globe-europe'
    };

    // Kategori ID'si veya adına göre ikon döndür
    const key = categoryIdOrName.toString().toLowerCase();

    // Türkçe karakterleri normalize et
    const normalizedKey = key
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');

    return iconMap[key] ||
      iconMap[normalizedKey] ||
      'fas fa-folder-open'; // Varsayılan ikon
  }




  getAuthorImage(author: Author): string {
    return `assets/images/authors/${author.photoMediaId}.png`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/authors/default.png';
  }


  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/entries'], {
      queryParams: { category: categoryId }
    });
  }

  navigateToEntry(entryId: string): void {
    this.router.navigate(['/entry-detail', entryId]);
  }

  navigateToAuthor(authorId: string): void {
    this.router.navigate(['/author-detail', authorId]);
  }


    // Volume detail sayfası eklenecek.

  navigateToVolume(volumeId: string): void {
    // this.router.navigate(['/volume-detail', volumeId]);
    console.log('Volume detail sayfası henüz tanımlanmamış:', volumeId);
  }
}
