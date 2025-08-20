import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-articles.component.html',
  styleUrls: ['./recent-articles.component.scss']
})
export class RecentArticlesComponent {

  recentArticles = [
    {
      id: 1,
      title: 'Osmanlı İmparatorluğu',
      excerpt: 'Osmanlı İmparatorluğu, 1299-1922 yılları arasında üç kıtaya hükmetmiş büyük imparatorluk.',
      category: 'Tarih',
      readTime: '12 dk',
      date: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Yapay Zeka',
      excerpt: 'Yapay zeka, makinelerin insan benzeri düşünce ve öğrenme yeteneklerini simüle etmesi.',
      category: 'Teknoloji',
      readTime: '8 dk',
      date: new Date('2024-01-14')
    },
    {
      id: 3,
      title: 'Quantum Fiziği',
      excerpt: 'Quantum mekaniği, atom altı parçacıkların davranışlarını açıklayan fizik dalı.',
      category: 'Bilim',
      readTime: '15 dk',
      date: new Date('2024-01-13')
    }
  ];

  constructor() { }

}
