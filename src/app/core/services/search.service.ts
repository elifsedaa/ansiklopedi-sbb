import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { EncyclopediaService, Article } from './encyclopedia.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  private searchResultsSubject = new BehaviorSubject<Article[]>([]);

  public searchTerm$ = this.searchTermSubject.asObservable();
  public searchResults$ = this.searchResultsSubject.asObservable();

  constructor(private encyclopediaService: EncyclopediaService) {
    // Arama terimini dinle ve debounce uygula
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim().length < 2) {
          return of([]);
        }
        return this.encyclopediaService.searchEntries(term);
      })
    ).subscribe(results => {
      this.searchResultsSubject.next(results);
    });
  }

  // Arama terimi güncelle
  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  // Direkt arama yap
  searchArticles(query: string): Observable<Article[]> {
    if (!query.trim() || query.length < 2) {
      return of([]);
    }

    return this.encyclopediaService.searchEntries(query);
  }

  // Arama sonuçlarını temizle
  clearResults(): void {
    this.searchTermSubject.next('');
    this.searchResultsSubject.next([]);
  }

  // Popüler arama terimlerini döndür (mock data)
  getPopularSearchTerms(): Observable<string[]> {
    const popularTerms = [
      'İzmit Köprüsü',
      'Sakarya Nehri',
      'Sapanca Gölü',
      'Adapazarı Kalesi',
      'Karasu Plajları',
      'Taraklı Evleri'
    ];

    return of(popularTerms);
  }

  // Öneriler al (başlık ile başlayanlar)
  getSuggestions(query: string): Observable<string[]> {
    if (!query.trim() || query.length < 2) {
      return of([]);
    }

    return this.encyclopediaService.getAllEntries().pipe(
      switchMap(entries => {
        const suggestions = entries
          .filter(entry =>
            entry.title.toLowerCase().startsWith(query.toLowerCase())
          )
          .map(entry => entry.title)
          .slice(0, 5); // Maksimum 5 öneri

        return of(suggestions);
      })
    );
  }
}
