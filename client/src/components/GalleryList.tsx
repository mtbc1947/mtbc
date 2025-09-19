import { Gallery } from "../galleries";

interface GalleryListProps {
  galleries: Gallery[];
  onOpen: (gallery: Gallery) => void;
}

export default function GalleryList({ galleries, onOpen }: GalleryListProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        {galleries.map((g) => (
          <div
            key={g.id}
            className="cursor-pointer rounded-xl shadow-lg overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition"
            onClick={() => onOpen(g)}
          >
            <img
              src={g.cover}
              alt={g.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-center text-lg font-semibold text-gray-800">
              {g.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
