import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent, HeaderComponent],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  searchActive: boolean = false;
  searchTerm: string = '';

  @ViewChild('searchInput', {static: false}) searchInput!: ElementRef;

  constructor(private router: Router) {
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
    if (this.searchActive) {
      // Focus input after animation
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 300);
    }
  }

  closeSearch() {
    this.searchActive = false;
    this.searchTerm = '';
  }

  performSearch() {
    if (this.searchTerm.trim()) {
      // Navigate to search page with query parameter
      this.router.navigate(['/search'], {
        queryParams: {q: this.searchTerm.trim()}
      });

      // Close search on mobile after performing search
      this.closeSearch();
    }
  }
}
