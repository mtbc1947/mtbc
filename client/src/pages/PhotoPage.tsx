import { useEffect, useState } from "react";
import GalleryList from "../components/GalleryList";
import GalleryView from "../components/GalleryView";
import { GalleryRecord } from "../utilities/galleryUtils";
import { getAllGallery } from "utilities"; // adjust path as needed

interface ImageData {
  id: string;
  url: string;
  name: string;
}

export default function PhotoPage() {
  const [selectedGallery, setSelectedGallery] = useState<GalleryRecord | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<GalleryRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllGallery();
        setGalleries(data);
      } catch (error) {
        console.error("Failed to load Gallery data:", error);
      } finally {
        setLoading(false); // ✅ stop the loading spinner
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px-80px)]">
      {!selectedGallery ? (
        <div className="w-full max-w-5xl mx-auto">
          {galleries.length > 0 ? (
            <GalleryList galleries={galleries} onOpen={setSelectedGallery} />
          ) : (
            <p className="text-center text-black text-5xl">
              No Galleries found.
            </p>
          )}
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
