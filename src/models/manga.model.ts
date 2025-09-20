export interface Page {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  pages: Page[];
}

export interface Comment {
  id: string;
  username: string;
  timestamp: string; // ISO string
  text: string;
}

export interface Manga {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  categories: string[];
  chapters: Chapter[];
  comments: Comment[];
  followers: number;
}