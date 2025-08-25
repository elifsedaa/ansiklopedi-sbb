import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { PublicationsComponent } from './pages/publications/publications.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AddPublicationComponent } from './pages/add-publication/add-publication.component';
//import { VolumeDetailComponent } from './pages/volume-detail/volume-detail.component';
//import { PublicationDetailComponent } from './pages/publication-detail/publication-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'add-publication', component: AddPublicationComponent },
 // { path: 'volume/:id', component: VolumeDetailComponent },
 // { path: 'publication/:id', component: PublicationDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PublicationsComponent,
    CategoriesComponent,
    AddPublicationComponent
    // VolumeDetailComponent,
    // PublicationDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
