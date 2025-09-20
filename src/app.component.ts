import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Manga, Chapter } from './models/manga.model';
import { MangaService } from './services/manga.service';
import { MangaLibraryComponent } from './components/manga-library/manga-library.component';
import { MangaDetailComponent } from './components/manga-detail/manga-detail.component';
import { MangaReaderComponent } from './components/manga-reader/manga-reader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MangaLibraryComponent,
    MangaDetailComponent,
    MangaReaderComponent
  ],
})
export class AppComponent {
  private mangaService = inject(MangaService);

  view = signal<'library' | 'detail' | 'reader'>('library');
  mangas = signal<Manga[]>([]);
  selectedManga = signal<Manga | null>(null);
  selectedChapter = signal<Chapter | null>(null);
  searchTerm = signal<string>('');
  
  allCategories = signal<string[]>([]);
  selectedCategory = signal<string>('all');
  showBookmarksOnly = signal<boolean>(false);

  filteredMangas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const showOnlyBookmarks = this.showBookmarksOnly();
    const bookmarkedIds = this.mangaService.bookmarkedIds();
    
    let mangas = this.mangas();

    if (showOnlyBookmarks) {
      mangas = mangas.filter(manga => bookmarkedIds.has(manga.id));
    }

    if (category !== 'all') {
      mangas = mangas.filter(manga => manga.categories.includes(category));
    }

    if (term) {
      mangas = mangas.filter(manga => 
        manga.title.toLowerCase().includes(term)
      );
    }

    return mangas;
  });

  constructor() {
    this.mangas.set(this.mangaService.getMangaSeries());
    this.allCategories.set(['all', ...this.mangaService.getAllCategories()]);
  }

  onSearchChanged(term: string): void {
    this.searchTerm.set(term);
  }

  onCategorySelected(category: string): void {
    this.selectedCategory.set(category);
  }

  toggleShowBookmarks(): void {
    this.showBookmarksOnly.update(value => !value);
  }

  onMangaSelected(manga: Manga): void {
    this.selectedManga.set(manga);
    this.view.set('detail');
  }

  onChapterSelected(data: { manga: Manga; chapter: Chapter }): void {
    this.selectedManga.set(data.manga);
    this.selectedChapter.set(data.chapter);
    this.view.set('reader');
  }

  onBackToLibrary(): void {
    this.selectedManga.set(null);
    this.selectedChapter.set(null);
    this.view.set('library');
  }

  onBackToDetail(): void {
    this.selectedChapter.set(null);
    this.view.set('detail');
  }
}