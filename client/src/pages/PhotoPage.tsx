import { useEffect, useState } from "react";
import GalleryList from "../components/GalleryList";
import GalleryView from "../components/GalleryView";
import galleries, { Gallery } from "../galleries";

interface ImageData {
  id: string;
  url: string;
  name: string;
}

export default function PhotoPage() {
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`/api/images?folder=/galleries/yourFolder`);
        const data: ImageData[] = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Failed to load images", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) return <p>Loading…</p>;

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
