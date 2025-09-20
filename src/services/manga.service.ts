import { Injectable, signal } from '@angular/core';
import { Manga, Comment, Chapter, HistoryItem } from '../models/manga.model';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private readonly HISTORY_KEY = 'mangaReadHistory';
  private readonly MAX_HISTORY_ITEMS = 20;

  private mangaData: Manga[] = [
    {
      id: 'jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      author: 'Gege Akutami',
      coverUrl: 'https://picsum.photos/seed/jujutsu-kaisen/500/700',
      description: 'A boy swallows a cursed talisman—the finger of a demon—and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
      categories: ['Action', 'Supernatural', 'Shonen'],
      followers: 3520,
      chapters: [
        {
          id: 'jjk-ch1',
          title: 'Ryomen Sukuna',
          chapterNumber: 1,
          pages: Array.from({ length: 15 }, (_, i) => ({
            id: `jjk-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/jjk-ch1-p${i + 1}/800/1200`,
          })),
        },
        {
          id: 'jjk-ch2',
          title: 'Secret Execution',
          chapterNumber: 2,
          pages: Array.from({ length: 12 }, (_, i) => ({
            id: `jjk-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/jjk-ch2-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
        { id: 'c1', username: 'GojoFan', timestamp: new Date(Date.now() - 86400000).toISOString(), text: 'Gojo Satoru is the best character! The art is amazing.' },
        { id: 'c2', username: 'CursedEnergyUser', timestamp: new Date(Date.now() - 3600000).toISOString(), text: 'Just started reading, Yuji is a great protagonist. Hooked already!' },
      ]
    },
    {
      id: 'one-piece',
      title: 'One Piece',
      author: 'Eiichiro Oda',
      coverUrl: 'https://picsum.photos/seed/one-piece/500/700',
      description: 'Follows the adventures of Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit. With his crew of pirates, the Straw Hat Pirates, Luffy explores the Grand Line in search of the ultimate treasure known as "One Piece" in order to become the next Pirate King.',
      categories: ['Adventure', 'Fantasy', 'Action', 'Shonen'],
      followers: 5100,
      chapters: [
        {
          id: 'op-ch1',
          title: 'Romance Dawn',
          chapterNumber: 1,
          pages: Array.from({ length: 20 }, (_, i) => ({
            id: `op-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/op-ch1-p${i + 1}/800/1200`,
          })),
        },
        {
          id: 'op-ch2',
          title: 'The Man in the Straw Hat',
          chapterNumber: 2,
          pages: Array.from({ length: 18 }, (_, i) => ({
            id: `op-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/op-ch2-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
         { id: 'c3', username: 'PirateKing_Luffy', timestamp: new Date(Date.now() - 172800000).toISOString(), text: 'Over 1000 chapters and still peak fiction! Oda is a genius.' },
      ]
    },
    {
      id: 'attack-on-titan',
      title: 'Attack on Titan',
      author: 'Hajime Isayama',
      coverUrl: 'https://picsum.photos/seed/attack-on-titan/500/700',
      description: 'In a world where humanity lives within cities surrounded by enormous walls that protect them from gigantic man-eating humanoids known as Titans, Eren Yeager vows to exterminate the Titans after they bring about the destruction of his hometown and the death of his mother.',
      categories: ['Action', 'Dark Fantasy', 'Post-apocalyptic'],
      followers: 4250,
      chapters: [
        {
          id: 'aot-ch1',
          title: 'To You, 2000 Years From Now',
          chapterNumber: 1,
          pages: Array.from({ length: 16 }, (_, i) => ({
            id: `aot-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/aot-ch1-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
        { id: 'c4', username: 'SurveyCorpsScout', timestamp: new Date(Date.now() - 99400000).toISOString(), text: 'This story is a masterpiece of foreshadowing. Not for the faint of heart.' },
      ],
    },
    {
      id: 'spy-x-family',
      title: 'Spy x Family',
      author: 'Tatsuya Endo',
      coverUrl: 'https://picsum.photos/seed/spy-x-family/500/700',
      description: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.',
      categories: ['Action', 'Comedy', 'Spy'],
      followers: 2890,
      chapters: [
        {
          id: 'sxf-ch1',
          title: 'Mission: 1',
          chapterNumber: 1,
          pages: Array.from({ length: 14 }, (_, i) => ({
            id: `sxf-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/sxf-ch1-p${i + 1}/800/1200`,
          })),
        },
         {
          id: 'sxf-ch2',
          title: 'Mission: 2',
          chapterNumber: 2,
          pages: Array.from({ length: 17 }, (_, i) => ({
            id: `sxf-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/sxf-ch2-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
        { id: 'c5', username: 'AnyaPeanuts', timestamp: new Date(Date.now() - 43200000).toISOString(), text: 'Anya is the cutest! So wholesome and hilarious at the same time. Waku waku!' },
      ],
    },
  ];

  private bookmarkedMangaIds = signal<Set<string>>(new Set());
  bookmarkedIds = this.bookmarkedMangaIds.asReadonly();

  private readHistory = signal<HistoryItem[]>([]);
  history = this.readHistory.asReadonly();

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        const savedHistory = localStorage.getItem(this.HISTORY_KEY);
        if (savedHistory) {
            this.readHistory.set(JSON.parse(savedHistory));
        }
    }
  }

  private saveHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history()));
    }
  }

  updateReadHistory(manga: Manga, chapter: Chapter, pageIndex: number): void {
    this.readHistory.update(history => {
        const existingIndex = history.findIndex(
            item => item.mangaId === manga.id && item.chapterId === chapter.id
        );

        let updatedHistory = [...history];

        if (existingIndex > -1) {
            const existingItem = updatedHistory.splice(existingIndex, 1)[0];
            existingItem.lastPageIndex = pageIndex;
            existingItem.timestamp = Date.now();
            updatedHistory.unshift(existingItem);
        } else {
            const newItem: HistoryItem = {
                mangaId: manga.id,
                chapterId: chapter.id,
                lastPageIndex: pageIndex,
                timestamp: Date.now(),
                mangaTitle: manga.title,
                chapterTitle: chapter.title,
                chapterNumber: chapter.chapterNumber,
                coverUrl: manga.coverUrl,
                totalPages: chapter.pages.length,
            };
            updatedHistory.unshift(newItem);
        }

        if (updatedHistory.length > this.MAX_HISTORY_ITEMS) {
            updatedHistory = updatedHistory.slice(0, this.MAX_HISTORY_ITEMS);
        }
        
        return updatedHistory;
    });

    this.saveHistory();
  }

  getMangaSeries(): Manga[] {
    return this.mangaData;
  }

  getMangaById(id: string): Manga | undefined {
    return this.mangaData.find(m => m.id === id);
  }
  
  toggleBookmark(mangaId: string): void {
    const manga = this.getMangaById(mangaId);
    if (!manga) return;

    this.bookmarkedMangaIds.update(currentIds => {
      const newIds = new Set(currentIds);
      if (newIds.has(mangaId)) {
        newIds.delete(mangaId);
        manga.followers--;
      } else {
        newIds.add(mangaId);
        manga.followers++;
      }
      return newIds;
    });
  }

  addComment(mangaId: string, commentData: { username: string; text: string }): void {
    const manga = this.getMangaById(mangaId);
    if (manga) {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        username: commentData.username,
        text: commentData.text,
        timestamp: new Date().toISOString(),
      };
      manga.comments.push(newComment);
    }
  }

  getAllCategories(): string[] {
    const allCategories = this.mangaData.flatMap(manga => manga.categories);
    return [...new Set(allCategories)].sort();
  }
}