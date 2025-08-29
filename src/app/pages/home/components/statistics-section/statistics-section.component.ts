import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Statistics {
  totalArticles: number;
  totalCategories: number;
  totalAuthors: number;
  dailyVisitors: number;
}

@Component({
  selector: 'app-statistics-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-section.component.html',
  styleUrls: ['./statistics-section.component.scss']
})
export class StatisticsSectionComponent {

  @Input() statistics: Statistics = {
    totalArticles: 0,
    totalCategories: 0,
    totalAuthors: 0,
    dailyVisitors: 0
  };

  get formattedStatistics() {
    return [
      { label: 'Toplam Makale', value: this.statistics.totalArticles, icon: '📝' },
      { label: 'Kategoriler', value: this.statistics.totalCategories, icon: '📚' },
      { label: 'Yazarlar', value: this.statistics.totalAuthors, icon: '✍️' },
      { label: 'Günlük Ziyaretçi', value: this.statistics.dailyVisitors, icon: '👥' }
    ];
  }

  constructor() { }

}
