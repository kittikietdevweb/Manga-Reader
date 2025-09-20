
import { Component, ChangeDetectionStrategy, input, output, inject, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga, Chapter, Comment } from '../../models/manga.model';
import { MangaService } from '../../services/manga.service';

@Component({
  selector: 'app-manga-detail',
  templateUrl: './manga-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class MangaDetailComponent {
  manga = input.required<Manga>();
  chapterSelected = output<{ manga: Manga; chapter: Chapter }>();
  back = output<void>();

  private mangaService = inject(MangaService);

  chapterSearchTerm = signal('');

  filteredChapters = computed(() => {
    const term = this.chapterSearchTerm().toLowerCase().trim();
    if (!term) {
      return this.manga().chapters;
    }
    return this.manga().chapters.filter(chapter =>
      chapter.title.toLowerCase().includes(term) ||
      String(chapter.chapterNumber).includes(term)
    );
  });

  isBookmarked = computed(() => {
    const bookmarkedIds = this.mangaService.bookmarkedIds();
    const currentMangaId = this.manga()?.id;
    if (!currentMangaId) return false;
    return bookmarkedIds.has(currentMangaId);
  });

  toggleBookmark(): void {
    this.mangaService.toggleBookmark(this.manga().id);
  }

  selectChapter(chapter: Chapter): void {
    this.chapterSelected.emit({ manga: this.manga(), chapter });
  }

  goBack(): void {
    this.back.emit();
  }
  
  onChapterSearch(term: string): void {
    this.chapterSearchTerm.set(term);
  }

  submitComment(usernameInput: HTMLInputElement, commentInput: HTMLTextAreaElement): void {
    const username = usernameInput.value.trim();
    const text = commentInput.value.trim();

    if (username && text) {
      this.mangaService.addComment(this.manga().id, { username, text });
      // Reset form
      usernameInput.value = '';
      commentInput.value = '';
    }
  }
}
