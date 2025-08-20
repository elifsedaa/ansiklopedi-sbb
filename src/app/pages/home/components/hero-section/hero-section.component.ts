import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero-section">
      <!-- İçerik buraya -->
    </section>
  `,
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  @Input() searchQuery: string = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<void>();

  popularSearches = [
    'Sakarya Tarihi',
    'Adapazarı',
    'Sakarya Nehri',
    'Gelenekler',
    'Mutfak Kültürü'
  ];

  onSearchSubmit() {
    if (this.searchQuery.trim().length >= 2) {
      this.searchSubmit.emit();
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQueryChange.emit(suggestion);
    this.searchSubmit.emit();
  }
}
