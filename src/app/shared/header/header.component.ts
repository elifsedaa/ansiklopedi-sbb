import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchActive = false;
  searchTerm = '';

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(public router: Router) {}

  ngOnInit(): void {}

  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (this.searchActive) {
      // Focus search input after animation
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 300);
    }
  }

  closeSearch(): void {
    this.searchActive = false;
    this.searchTerm = '';
  }

  performSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm }
      });
      this.closeSearch();
    }
  }
  goHome() {
    this.router.navigate(['/']);
  }
}

