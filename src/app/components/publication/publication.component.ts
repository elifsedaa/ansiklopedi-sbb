import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {
  publications: any[] = [];
  categories: any[] = [];
  authors: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

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

  goToPublication(pubId: any) {
    this.router.navigate(['/publication', pubId]);
  }
}
