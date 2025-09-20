import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga, HistoryItem } from '../../models/manga.model';

@Component({
  selector: 'app-manga-library',
  templateUrl: './manga-library.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class MangaLibraryComponent {
  mangas = input.required<Manga[]>();
  searchTerm = input<string>('');
  selectedCategory = input<string>('all');
  readHistory = input<HistoryItem[]>([]);
  mangaSelected = output<Manga>();
  historySelected = output<HistoryItem>();

  selectManga(manga: Manga): void {
    this.mangaSelected.emit(manga);
  }

  selectHistoryItem(item: HistoryItem): void {
    this.historySelected.emit(item);
  }
}
