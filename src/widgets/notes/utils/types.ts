export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface NotesSettings {
  theme: 'modern' | 'minimal' | 'paper';
  fontSize: 'small' | 'medium' | 'large';
  showPreview: boolean;
  sortBy: 'lastModified' | 'createdAt' | 'title';
  sortDirection: 'asc' | 'desc';
} 