import { Injectable, signal } from '@angular/core';
import { Manga, Comment } from '../models/manga.model';

@Injectable({
  providedIn: 'root',
})
export class MangaService {
  private mangaData: Manga[] = [
    {
      id: 'cosmic-wanderer',
      title: 'Cosmic Wanderer',
      author: 'AI Gen',
      coverUrl: 'https://picsum.photos/seed/cosmic-cover/500/700',
      description: 'A lone astronaut traverses forgotten galaxies, uncovering ancient secrets and confronting existential dread. A breathtaking journey through the vastness of space and the intricate depths of the self.',
      categories: ['Sci-Fi', 'Adventure', 'Psychological'],
      followers: 1250,
      chapters: [
        {
          id: 'cw-ch1',
          title: 'The Awakening',
          chapterNumber: 1,
          pages: Array.from({ length: 8 }, (_, i) => ({
            id: `cw-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/cw-ch1-p${i + 1}/800/1200`,
          })),
        },
        {
          id: 'cw-ch2',
          title: 'Echoes of the Past',
          chapterNumber: 2,
          pages: Array.from({ length: 10 }, (_, i) => ({
            id: `cw-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/cw-ch2-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
        { id: 'c1', username: 'Stargazer', timestamp: new Date(Date.now() - 86400000).toISOString(), text: 'This series is mind-bending! I love the art style.' },
        { id: 'c2', username: 'SciFiFan_22', timestamp: new Date(Date.now() - 3600000).toISOString(), text: 'Just finished chapter 1, can\'t wait for more. The sense of isolation is palpable.' },
      ]
    },
    {
      id: 'cyberpunk-ronin',
      title: 'Cyberpunk Ronin',
      author: 'AI Gen',
      coverUrl: 'https://picsum.photos/seed/cyber-cover/500/700',
      description: 'In the neon-drenched, rain-slicked streets of Neo-Kyoto 2077, a disgraced cyborg samurai seeks redemption by protecting the innocent from the iron grip of corrupt megacorporations.',
      categories: ['Cyberpunk', 'Action', 'Sci-Fi'],
      followers: 2345,
      chapters: [
        {
          id: 'cr-ch1',
          title: 'Neon & Rust',
          chapterNumber: 1,
          pages: Array.from({ length: 12 }, (_, i) => ({
            id: `cr-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/cr-ch1-p${i + 1}/800/1200`,
          })),
        },
        {
          id: 'cr-ch2',
          title: 'Ghosts in the Machine',
          chapterNumber: 2,
          pages: Array.from({ length: 9 }, (_, i) => ({
            id: `cr-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/cr-ch2-p${i + 1}/800/1200`,
          })),
        },
        {
          id: 'cr-ch3',
          title: 'The Chrome Katana',
          chapterNumber: 3,
          pages: Array.from({ length: 15 }, (_, i) => ({
            id: `cr-ch3-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/cr-ch3-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [
         { id: 'c3', username: 'Neon_Blade', timestamp: new Date(Date.now() - 172800000).toISOString(), text: 'Absolutely love the gritty atmosphere of Neo-Kyoto. The action sequences are top-notch.' },
      ]
    },
    {
      id: 'alchemists-apprentice',
      title: 'The Alchemist\'s Apprentice',
      author: 'AI Gen',
      coverUrl: 'https://picsum.photos/seed/alchemy-cover/500/700',
      description: 'A young, ambitious apprentice in a whimsical world of magic and steam-powered contraptions stumbles upon a forbidden alchemical formula that could reshape their reality, for better or worse.',
      categories: ['Fantasy', 'Steampunk', 'Adventure'],
      followers: 980,
      chapters: [
        {
          id: 'aa-ch1',
          title: 'The Forbidden Tome',
          chapterNumber: 1,
          pages: Array.from({ length: 7 }, (_, i) => ({
            id: `aa-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/aa-ch1-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [],
    },
    {
      id: 'shadow-syndicate',
      title: 'Shadow Syndicate',
      author: 'AI Gen',
      coverUrl: 'https://picsum.photos/seed/shadow-cover/500/700',
      description: 'A covert group of spies with extraordinary abilities works from the shadows to maintain a fragile global peace, navigating a world of intrigue, betrayal, and high-stakes espionage.',
      categories: ['Spy', 'Action', 'Thriller'],
      followers: 1876,
      chapters: [
        {
          id: 'ss-ch1',
          title: 'Operation Nightingale',
          chapterNumber: 1,
          pages: Array.from({ length: 11 }, (_, i) => ({
            id: `ss-ch1-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/ss-ch1-p${i + 1}/800/1200`,
          })),
        },
         {
          id: 'ss-ch2',
          title: 'The Crimson Dossier',
          chapterNumber: 2,
          pages: Array.from({ length: 14 }, (_, i) => ({
            id: `ss-ch2-p${i + 1}`,
            pageNumber: i + 1,
            imageUrl: `https://picsum.photos/seed/ss-ch2-p${i + 1}/800/1200`,
          })),
        },
      ],
      comments: [],
    },
  ];

  private bookmarkedMangaIds = signal<Set<string>>(new Set());
  bookmarkedIds = this.bookmarkedMangaIds.asReadonly();

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