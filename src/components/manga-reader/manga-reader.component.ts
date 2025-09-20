
import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga, Chapter, Page } from '../../models/manga.model';

@Component({
  selector: 'app-manga-reader',
  templateUrl: './manga-reader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
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
}
