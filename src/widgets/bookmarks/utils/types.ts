export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  createdAt: string;
}

export interface BookmarkSettings {
  theme: 'modern' | 'minimal';
  showIcons: boolean;
  sortBy: 'title' | 'createdAt';
  sortDirection: 'asc' | 'desc';
} 