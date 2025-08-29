import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FeaturedCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.scss']
})
export class FeaturedCategoriesComponent {

  @Input() categories: FeaturedCategory[] = [];
  @Output() categoryClick = new EventEmitter<string>();

  onCategoryClick(categoryId: string): void {
    this.categoryClick.emit(categoryId);
  }

  constructor() { }

}
