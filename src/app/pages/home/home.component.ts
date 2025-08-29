import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { HomeDataService } from '../../services/home-data.service';
import { Category, Entry, Author, Volume } from '../../models';

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
    private homeService: HomeDataService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Kategorileri yükle
    this.homeService.getCategories().subscribe(categories => {
      this.featuredCategories = categories;
      this.stats.totalCategories = categories.length;
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


  getAuthorImage(author: Author): string {
    return `assets/images/authors/${author.photoMediaId}.png`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/authors/default.png';
  }

  // Navigation methods - Kocaeli ansiklopedisi benzeri URL yapısı
  navigateToCategory(categoryId: string): void {
    // /entries?category=categoryId şeklinde yönlendirme
    this.router.navigate(['/entries'], {
      queryParams: { category: categoryId }
    });
  }

  navigateToEntry(entryId: string): void {
    // Kocaeli ansiklopedisi benzeri: /MaddeDetay/entryId
    this.router.navigate(['/MaddeDetay', entryId]);
  }

  navigateToAuthor(authorId: string): void {
    // /YazarDetay/authorId şeklinde yönlendirme
    this.router.navigate(['/YazarDetay', authorId]);
  }

  navigateToVolume(volumeId: string): void {
    // /CiltDetay/volumeId şeklinde yönlendirme
    this.router.navigate(['/CiltDetay', volumeId]);
  }
}
