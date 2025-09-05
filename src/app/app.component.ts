// // src/app/app.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
//
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'Sakarya Ansiklopedisi';
//   isMenuOpen = false;
//   isSearchOpen = false;
//   searchQuery = '';
//
//   toggleMenu() {
//     this.isMenuOpen = !this.isMenuOpen;
//   }
//
//   closeMenu() {
//     this.isMenuOpen = false;
//   }
//
//   toggleSearch() {
//     this.isSearchOpen = !this.isSearchOpen;
//   }
//
//   closeSearch() {
//     this.isSearchOpen = false;
//   }
//
//   onSearchSubmit() {
//     if (this.searchQuery.trim()) {
//       console.log('Arama yapıldı:', this.searchQuery);
//       // Burada arama fonksiyonunu implement edebilirsin
//     }
//   }
// }


// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component'; // Header component'i import edin

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HeaderComponent  // Header component'i imports'a ekleyin
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sakarya Ansiklopedisi';

  // Eğer header component kendi içinde menu ve search yönetimi yapacaksa
  // bu değişkenleri kaldırabilirsiniz veya header'a taşıyabilirsiniz
  isMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  onSearchSubmit() {
    if (this.searchQuery.trim()) {
      console.log('Arama yapıldı:', this.searchQuery);
      // Burada arama fonksiyonunu implement edebilirsin
    }
  }
}
