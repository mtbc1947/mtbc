import { useState } from "react";
import GalleryList from "../components/GalleryList";
import GalleryView from "../components/GalleryView";
import galleries, { Gallery } from "../galleries";

export default function PhotoPage() {
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-64px)]">
      {!selectedGallery ? (
        <div className="w-full max-w-5xl mx-auto">
          <GalleryList galleries={galleries} onOpen={setSelectedGallery} />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <GalleryView
            gallery={selectedGallery}
            onBack={() => setSelectedGallery(null)}
          />
        </div>
      )}
    </div>
  );
}
