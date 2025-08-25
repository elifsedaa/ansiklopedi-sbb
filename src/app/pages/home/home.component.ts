import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



interface Publication {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  volumeNumber: number;
  tags: string[];
  featured: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  publicationCount: number;
}

interface Statistic {
  icon: string;
  count: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredPublications: Publication[] = [];
  latestPublications: Publication[] = [];
  categories: Category[] = [];
  statistics: Statistic[] = [];
  currentSlide = 0;

  ngOnInit(): void {
    this.loadFeaturedPublications();
    this.loadLatestPublications();
    this.loadCategories();
    this.loadStatistics();
    this.startSlider();
  }

  loadFeaturedPublications(): void {
    // Bu data fake API'den gelecek
    this.featuredPublications = [
      {
        id: 1,
        title: 'Sakarya\'nın Tarihi Dokusu',
        description: 'Sakarya\'nın binlerce yıllık tarihini keşfedin. Antik dönemlerden günümüze kadar uzanan zengin kültürel miras.',
        image: 'assets/images/featured-1.jpg',
        category: 'Tarih',
        author: 'Prof. Dr. Ahmet Yılmaz',
        publishDate: '2024-01-15',
        volumeNumber: 1,
        tags: ['tarih', 'kültür', 'miras'],
        featured: true
      },
      {
        id: 2,
        title: 'Sakarya\'nın Doğal Güzellikleri',
        description: 'Sapanca Gölü\'nden Karasu sahillerine, Sakarya\'nın eşsiz doğal zenginliklerini keşfedin.',
        image: 'assets/images/featured-2.jpg',
        category: 'Coğrafya',
        author: 'Dr. Mehmet Demir',
        publishDate: '2024-01-10',
        volumeNumber: 2,
        tags: ['doğa', 'coğrafya', 'turizm'],
        featured: true
      },
      {
        id: 3,
        title: 'Sakarya\'nın Kültürel Zenginlikleri',
        description: 'Geleneksel sanatlardan modern kültürel etkinliklere, Sakarya\'nın renkli kültürel yaşamı.',
        image: 'assets/images/featured-3.jpg',
        category: 'Kültür',
        author: 'Prof. Dr. Ayşe Kaya',
        publishDate: '2024-01-05',
        volumeNumber: 3,
        tags: ['kültür', 'sanat', 'gelenek'],
        featured: true
      }
    ];
  }

  loadLatestPublications(): void {
    this.latestPublications = [
      {
        id: 4,
        title: 'Sakarya Üniversitesi ve Eğitim',
        description: 'Sakarya\'nın eğitim hayatındaki gelişmeleri ve üniversitenin kente katkıları.',
        image: 'assets/images/publication-1.jpg',
        category: 'Eğitim',
        author: 'Dr. Fatma Özkan',
        publishDate: '2024-01-20',
        volumeNumber: 1,
        tags: ['eğitim', 'üniversite'],
        featured: false
      },
      {
        id: 5,
        title: 'Sakarya\'nın Ekonomik Yapısı',
        description: 'Sanayi ve ticaretteki gelişmeler ile Sakarya\'nın ekonomik potansiyeli.',
        image: 'assets/images/publication-2.jpg',
        category: 'Ekonomi',
        author: 'Prof. Dr. Hasan Çelik',
        publishDate: '2024-01-18',
        volumeNumber: 2,
        tags: ['ekonomi', 'sanayi', 'ticaret'],
        featured: false
      },
      {
        id: 6,
        title: 'Sakarya\'da Yaşayan Önemli Şahsiyetler',
        description: 'Sakarya\'ya değer katan tarihi ve çağdaş önemli kişilikler.',
        image: 'assets/images/publication-3.jpg',
        category: 'Kişiler',
        author: 'Dr. Mustafa Yıldırım',
        publishDate: '2024-01-16',
        volumeNumber: 1,
        tags: ['kişiler', 'biyografi'],
        featured: false
      },
      {
        id: 7,
        title: 'Sakarya Mutfağı ve Yemek Kültürü',
        description: 'Geleneksel lezzetlerden modern yorumlara Sakarya\'nın gastronomi kültürü.',
        image: 'assets/images/publication-4.jpg',
        category: 'Kültür',
        author: 'Chef Elif Şahin',
        publishDate: '2024-01-14',
        volumeNumber: 3,
        tags: ['mutfak', 'kültür', 'yemek'],
        featured: false
      }
    ];
  }

  loadCategories(): void {
    this.categories = [
      {
        id: 1,
        name: 'Tarih',
        description: 'Sakarya\'nın geçmişten günümüze tarihi',
        icon: 'fas fa-landmark',
        publicationCount: 45
      },
      {
        id: 2,
        name: 'Coğrafya',
        description: 'Sakarya\'nın coğrafi özellikleri',
        icon: 'fas fa-mountain',
        publicationCount: 32
      },
      {
        id: 3,
        name: 'Kültür',
        description: 'Kültürel değerler ve gelenekler',
        icon: 'fas fa-theater-masks',
        publicationCount: 38
      },
      {
        id: 4,
        name: 'Kişiler',
        description: 'Önemli şahsiyetler ve biyografiler',
        icon: 'fas fa-users',
        publicationCount: 28
      },
      {
        id: 5,
        name: 'Ekonomi',
        description: 'Ekonomik yapı ve gelişmeler',
        icon: 'fas fa-chart-line',
        publicationCount: 22
      },
      {
        id: 6,
        name: 'Eğitim',
        description: 'Eğitim kurumları ve gelişmeleri',
        icon: 'fas fa-graduation-cap',
        publicationCount: 18
      }
    ];
  }

  loadStatistics(): void {
    this.statistics = [
      {
        icon: 'fas fa-book',
        count: 183,
        label: 'Toplam Yayın',
        color: '#2c5282'
      },
      {
        icon: 'fas fa-layer-group',
        count: 4,
        label: 'Cilt Sayısı',
        color: '#38a169'
      },
      {
        icon: 'fas fa-tags',
        count: 6,
        label: 'Kategori',
        color: '#ed8936'
      },
      {
        icon: 'fas fa-users',
        count: 25,
        label: 'Yazar',
        color: '#9f7aea'
      }
    ];
  }

  startSlider(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredPublications.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.featuredPublications.length - 1
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
