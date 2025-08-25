import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sakarya Ansiklopedisi';
  searchQuery = '';
  isMenuOpen = false;
  isSearchOpen = false;

  ngOnInit(): void {
    // Sayfa yüklendiğinde scroll pozisyonunu sıfırla
    window.scrollTo(0, 0);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        searchInput?.focus();
      }, 100);
    }
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      // Arama fonksiyonunu burada implement edeceksiniz
      console.log('Arama yapılıyor:', this.searchQuery);
      this.isSearchOpen = false;
    }
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
  }
}
