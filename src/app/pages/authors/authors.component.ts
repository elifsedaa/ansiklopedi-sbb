import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule], // <-- *ngFor için gerekli
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  authors: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Authors verisini çek
    this.http.get<any[]>('http://localhost:3000/authors').subscribe(res => {
      this.authors = res; // artık array direkt
      console.log('Authors:', this.authors);
    });

  }

  getAuthorImage(author: any): string {
    // photoMediaId ile resim eşlemesi
    return `assets/images/authors/${author.photoMediaId}.png`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/authors/default.png';
  }

}
