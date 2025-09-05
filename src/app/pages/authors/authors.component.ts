// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { BreadcrumbModule } from 'primeng/breadcrumb';
// import { MenuItem } from 'primeng/api';
//
// @Component({
//   selector: 'app-authors',
//   standalone: true,
//   imports: [CommonModule, BreadcrumbModule],
//   templateUrl: './authors.component.html',
//   styleUrls: ['./authors.component.scss']
// })
// export class AuthorsComponent implements OnInit {
//   authors: any[] = [];
//   filteredAuthors: any[] = [];
//   selectedLetter: string = 'Tümü';
//   breadcrumbItems: MenuItem[] = [];
//   home: MenuItem = {};
//
//   // Türkçe alfabesi
//   alphabet = ['Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];
//
//   constructor(private http: HttpClient, private router: Router) {}
//
//   ngOnInit(): void {
//     this.initBreadcrumb();
//     this.loadAuthors();
//   }
//
//   initBreadcrumb(): void {
//     this.home = { icon: 'pi pi-home', label: 'Anasayfa', routerLink: '/' };
//     this.breadcrumbItems = [
//       { label: 'Yazarlar' } // routerLink yok, aktif olarak mavi gösterilecek
//     ];
//   }
//
//   loadAuthors(): void {
//     this.http.get<any[]>('http://localhost:3000/authors').subscribe(res => {
//       this.authors = res;
//       this.filteredAuthors = res;
//       console.log('Authors:', this.authors);
//     });
//   }
//
//   filterByLetter(letter: string): void {
//     this.selectedLetter = letter;
//
//     if (letter === 'Tümü') {
//       this.filteredAuthors = this.authors;
//     } else {
//       this.filteredAuthors = this.authors.filter(author =>
//         author.fullName.toLocaleUpperCase('tr-TR').startsWith(letter)
//       );
//     }
//   }
//
//   getAuthorImage(author: any): string {
//     return `assets/images/authors/${author.photoMediaId}.png`;
//   }
//
//   onImageError(event: Event): void {
//     const target = event.target as HTMLImageElement;
//     target.src = 'assets/images/authors/default.png';
//   }
//
//   navigateToAuthorDetail(author: any): void {
//     // Author detail sayfasına yönlendirme
//     this.router.navigate(['/author-detail.component', author.id]);
//   }
//
//   getAuthorCount(letter: string): number {
//     if (letter === 'Tümü') {
//       return this.authors.length;
//     }
//     return this.authors.filter(author =>
//       author.fullName.toLocaleUpperCase('tr-TR').startsWith(letter)
//     ).length;
//   }
// }





import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  selectedLetter: string = 'Tümü';
  breadcrumbItems: MenuItem[] = [];
  home: MenuItem = {};

  // Türkçe alfabesi
  alphabet = ['Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initBreadcrumb();
    this.loadAuthors();
  }

  initBreadcrumb(): void {
    this.home = { icon: 'pi pi-home', label: 'Anasayfa', routerLink: '/' };
    this.breadcrumbItems = [
      { label: 'Yazarlar' } // routerlink yok
    ];
  }


  loadAuthors(): void {
    this.http.get<any[]>('http://localhost:3000/authors').subscribe(res => {
      this.authors = res;
      this.filteredAuthors = res;
      console.log('Authors:', this.authors);
    });
  }

  filterByLetter(letter: string): void {
    this.selectedLetter = letter;

    if (letter === 'Tümü') {
      this.filteredAuthors = this.authors;
    } else {
      this.filteredAuthors = this.authors.filter(author =>
        author.fullName.toLocaleUpperCase('tr-TR').startsWith(letter)
      );
    }
  }

  getAuthorImage(author: any): string {
    return `assets/images/authors/${author.photoMediaId}.png`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/authors/default.png';
  }

  navigateToAuthorDetail(author: any): void {
    // Author detail sayfasına yönlendirme
    this.router.navigate(['/author-detail', author.id]);
  }

  getAuthorCount(letter: string): number {
    if (letter === 'Tümü') {
      return this.authors.length;
    }
    return this.authors.filter(author =>
      author.fullName.toLocaleUpperCase('tr-TR').startsWith(letter)
    ).length;
  }
}
