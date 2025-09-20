import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Manga, Chapter } from '../../models/manga.model';
import { MangaService } from '../../services/manga.service';

@Component({
  selector: 'app-manga-reader',
  templateUrl: './manga-reader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class MangaReaderComponent implements AfterViewInit, OnDestroy {
  manga = input.required<Manga>();
  chapter = input.required<Chapter>();
  initialPageIndex = input(0);

  back = output<void>();
  previousChapter = output<void>();
  nextChapter = output<void>();
  chapterChange = output<Chapter>();

  @ViewChildren('pageImage') pageImages!: QueryList<ElementRef<HTMLImageElement>>;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;

  private mangaService = inject(MangaService);

  readingMode = signal<'strip' | 'page'>('strip');
  isHeaderVisible = signal(true);
  
  private currentVisiblePageIndex = signal(0);
  
  totalPages = computed(() => this.chapter()?.pages?.length ?? 0);
  currentPage = computed(() => this.currentVisiblePageIndex() + 1);
  
  progress = computed(() => {
    const total = this.totalPages();
    if (total === 0) {
      return 0;
    }
    return (this.currentPage() / total) * 100;
  });

  private isInitialLoad = true;
  private intersectionObserver: IntersectionObserver | null = null;
  private visiblePages = new Map<Element, IntersectionObserverEntry>();
  private lastScrollY = 0;

  constructor() {
    effect(() => {
      const manga = this.manga();
      const chapter = this.chapter();
      const pageIndex = this.currentVisiblePageIndex();
      
      if (manga?.id && chapter?.id) {
        this.mangaService.updateReadHistory(manga, chapter, pageIndex);
      }
    });

    effect(() => {
      // This effect runs when chapter changes.
      this.chapter(); // dependency
      
      this.currentVisiblePageIndex.set(this.initialPageIndex());
      
      if (this.isInitialLoad) {
        return;
      }
      
      if (typeof window !== 'undefined' && this.readingMode() === 'strip') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    effect(() => {
      // Re-setup the observer when the chapter or reading mode changes.
      this.chapter();
      this.readingMode();

      // Defer setup until after the view has updated.
      setTimeout(() => this.setupIntersectionObserver(), 0);
    });
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
  
    if (Math.abs(currentScrollY - this.lastScrollY) < 50) return;

    if (currentScrollY > this.lastScrollY && currentScrollY > 150) {
      this.isHeaderVisible.set(false);
    } else if (currentScrollY < this.lastScrollY) {
      this.isHeaderVisible.set(true);
    }
  
    this.lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  };
  
  toggleHeaderVisibility(): void {
    this.isHeaderVisible.update(v => !v);
  }

  ngAfterViewInit(): void {
    // Use a timeout to allow the view to stabilize before scrolling.
    setTimeout(() => {
      this.scrollToPage(this.initialPageIndex());
      this.isInitialLoad = false;
    }, 100);
  }
  
  private setupIntersectionObserver(): void {
    this.intersectionObserver?.disconnect();
    this.visiblePages.clear();

    if (this.readingMode() !== 'strip' || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.visiblePages.set(entry.target, entry);
        } else {
          this.visiblePages.delete(entry.target);
        }
      });
      this.updateCurrentPageFromVisible();
    }, options);

    this.pageImages.forEach(imageRef => {
      this.intersectionObserver!.observe(imageRef.nativeElement);
    });
  }

  private updateCurrentPageFromVisible(): void {
    if (this.visiblePages.size === 0) {
      return;
    }

    let mostVisibleEntry: IntersectionObserverEntry | null = null;
    for (const entry of this.visiblePages.values()) {
      if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
        mostVisibleEntry = entry;
      }
    }
    
    if (mostVisibleEntry) {
      const pageIndexStr = (mostVisibleEntry.target as HTMLElement).dataset['pageIndex'];
      if (pageIndexStr) {
        const newPageIndex = parseInt(pageIndexStr, 10);
        if (!isNaN(newPageIndex) && this.currentVisiblePageIndex() !== newPageIndex) {
          this.currentVisiblePageIndex.set(newPageIndex);
        }
      }
    }
  }

  private scrollToPage(pageIndex: number, behavior: ScrollBehavior = 'auto'): void {
    if (pageIndex >= 0 && this.readingMode() === 'strip') {
      const images = this.pageImages?.toArray();
      const targetImage = images?.[pageIndex];
      if (targetImage) {
        targetImage.nativeElement.scrollIntoView({ behavior, block: 'start' });
      }
    }
  }

  private currentChapterIndex = computed(() => {
    return this.manga().chapters.findIndex(c => c.id === this.chapter().id);
  });

  hasPreviousChapter = computed(() => this.currentChapterIndex() > 0);
  hasNextChapter = computed(() => {
    const currentIndex = this.currentChapterIndex();
    return currentIndex > -1 && currentIndex < this.manga().chapters.length - 1;
  });

  isNextButtonDisabled = computed(() => !this.hasNextChapter());
  isPrevButtonDisabled = computed(() => !this.hasPreviousChapter());

  toggleReadingMode(): void {
    const newMode = this.readingMode() === 'strip' ? 'page' : 'strip';
    this.readingMode.set(newMode);

    setTimeout(() => {
      if (newMode === 'strip') {
        this.scrollToPage(this.currentVisiblePageIndex(), 'smooth');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  }

  goToNextPage(): void {
    if (this.currentVisiblePageIndex() < this.totalPages() - 1) {
      this.currentVisiblePageIndex.update(i => i + 1);
    }
  }

  goToPreviousPage(): void {
     if (this.currentVisiblePageIndex() > 0) {
      this.currentVisiblePageIndex.update(i => i - 1);
    }
  }

  goToNextChapter(): void {
    this.nextChapter.emit();
  }

  goToPreviousChapter(): void {
    this.previousChapter.emit();
  }

  goBack(): void {
    this.back.emit();
  }

  onChapterSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const chapterId = selectElement.value;
    const selectedChapter = this.manga().chapters.find(c => c.id === chapterId);
    if (selectedChapter && selectedChapter.id !== this.chapter().id) {
      this.chapterChange.emit(selectedChapter);
    }
  }

  onPageSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const pageIndex = parseInt(selectElement.value, 10);
    if (!isNaN(pageIndex)) {
      if (this.readingMode() === 'strip') {
        this.scrollToPage(pageIndex, 'smooth');
      } else {
        this.currentVisiblePageIndex.set(pageIndex);
      }
    }
  }
}