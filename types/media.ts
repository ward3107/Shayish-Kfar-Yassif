export type MediaItem = {
  publicId: string;
  url: string;
  secureUrl: string;
  thumbUrl: string;
  resourceType: 'image' | 'video';
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
  tags: string[];
  context: Record<string, string>;
};
