import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga } from '../../models/manga.model';

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
  mangaSelected = output<Manga>();

  selectManga(manga: Manga): void {
    this.mangaSelected.emit(manga);
  }
}
