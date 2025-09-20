
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
  commentSortOrder = signal<'newest' | 'oldest'>('newest');

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

  sortedComments = computed(() => {
    const comments = [...this.manga().comments];
    if (this.commentSortOrder() === 'newest') {
      return comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return comments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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

  onSortOrderChange(order: string): void {
    if (order === 'newest' || order === 'oldest') {
      this.commentSortOrder.set(order);
    }
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

  formatRelativeTime(timestamp: string): string {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}