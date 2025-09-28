// types/galleryTypes.ts

// GalleryImage as used in GalleryView
export interface GalleryImage {
  filename: string;          // filename
  url: string;           // URL for display
  folder?: string;       // folder name
  fileId: string;       // ImageKit fileId (optional, for deletion)
  width?: number;
  height?: number;
  size?: number;
}

// GalleryImage / Photo type for ThumbnailPanel
export interface Photo {
  fileId: string;           // optional ImageKit ID for deletion
  url: string;           // required: image URL
  filename: string;     // optional: original filename
  folder?: string;       // optional: folder name
  thumbnail?: string;
}
