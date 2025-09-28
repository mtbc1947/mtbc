import React from "react";
import { Photo } from "../../types/galleryTypes";

interface ThumbnailPanelProps {
  photos: Photo[];
  selected: Photo[];
  setSelected: (photos: Photo[]) => void;
  currentCoverUrl?: string; // optional, to mark cover image
}

export const ThumbnailPanel: React.FC<ThumbnailPanelProps> = ({
  photos,
  selected,
  setSelected,
  currentCoverUrl,
}) => {
  const toggleSelection = (photo: Photo) => {
    if (selected.some((p) => p.url === photo.url)) {
      setSelected(selected.filter((p) => p.url !== photo.url));
    } else {
      setSelected([...selected, photo]);
    }
  };

  const isSelected = (photo: Photo) => selected.some((p) => p.url === photo.url);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-0">
      {photos.map((photo) => (
        <div
          key={photo.fileId || photo.url}
          className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-100"
          onClick={() => toggleSelection(photo)}
        >
          <img
            src={photo.thumbnail || photo.url}
            alt={photo.filename || "Photo"}
            className="w-full h-full object-cover block"
          />

          {/* Selection overlay */}
          {isSelected(photo) && (
            <div className="absolute inset-0 bg-yellow-500/40 ring-2 ring-yellow-400 rounded-lg" />
          )}

          {/* Cover marker */}
          {photo.url === currentCoverUrl && (
            <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1 text-xs font-bold rounded">
              COVER
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
