
import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga, Chapter, Page } from '../../models/manga.model';

@Component({
  selector: 'app-manga-reader',
  templateUrl: './manga-reader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
  host: {
    '(window:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class MangaReaderComponent {
  manga = input.required<Manga>();
  chapter = input.required<Chapter>();
  back = output<void>();

  currentPageIndex = signal(0);
  
  currentPage = computed<Page | undefined>(() => {
    return this.chapter().pages[this.currentPageIndex()];
  });

  totalPages = computed<number>(() => this.chapter().pages.length);

  progress = computed<number>(() => {
    const total = this.totalPages();
    if (total === 0) return 0;
    return ((this.currentPageIndex() + 1) / total) * 100;
  });

  private touchStartX = 0;
  private readonly swipeThreshold = 50; // Minimum pixels for a swipe

  constructor() {
    effect(() => {
        // Reset to first page if chapter changes
        this.chapter();
        this.currentPageIndex.set(0);
    });
  }

  nextPage(): void {
    this.currentPageIndex.update(index => Math.min(index + 1, this.totalPages() - 1));
  }

  prevPage(): void {
    this.currentPageIndex.update(index => Math.max(index - 1, 0));
  }

  goBack(): void {
    this.back.emit();
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.prevPage();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;

    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX < 0) {
        // Swipe Left
        this.nextPage();
      } else {
        // Swipe Right
        this.prevPage();
      }
    }
  }
}
