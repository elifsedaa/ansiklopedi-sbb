import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <!-- Header -->
    <app-header></app-header>

    <!-- Page Content -->
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <app-footer></app-footer>
  `,
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {}
