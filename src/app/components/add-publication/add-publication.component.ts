import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service'; // doğru import

@Component({
  selector: 'app-add-publication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.scss']
})
export class AddPublicationComponent implements OnInit {
  publications: any[] = [];
  categories: any[] = [];
  authors: any[] = [];

  newPublication = {
    title: '',
    categoryId: null,
    authorId: null
  };

  constructor(private apiService: ApiService) {} // <<< burası düzeltildi

  ngOnInit(): void {
    this.apiService.getPublications().subscribe((data: any) => {
      this.publications = data;
    });

    this.apiService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });

    this.apiService.getAuthors().subscribe((data: any) => {
      this.authors = data;
    });
  }

  addPublication() {
    this.apiService.addPublication(this.newPublication).subscribe((res: any) => {
      this.publications.push(res);
      this.newPublication = { title: '', categoryId: null, authorId: null }; // formu temizle
    });
  }
}
