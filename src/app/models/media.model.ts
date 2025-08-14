export interface Media {
  id: string;
  type: 'image' | 'pdf' | 'audio' | 'video';
  url: string;
  width?: number;
  height?: number;
  credit?: string;
  license?: string;
  sourceUrl?: string | null;
}
