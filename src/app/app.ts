import { Component, signal } from '@angular/core';
import { EntryList } from './components/entry-list/entry-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EntryList],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  title = signal('ansiklopedi-sbb');
}
