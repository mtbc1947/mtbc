import React, { useEffect, useState } from "react";
import SEO from '../components/SEO';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

type ImageData = {
  id: string | number;
  url: string;
  name: string;
};

const CountyPresidentsPage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/images?folder=County`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch images");
        return res.json();
      })
      .then((data: ImageData[]) => {
        if (data.length === 0) {
          console.log("No images found");
          setImages([]);
        } else {
          setImages(data);
        }
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-4 bg-white/70 rounded-md shadow-lg mx-4 md:mx-8">
        <p className="text-center">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center p-4 bg-white/70 rounded-md shadow-lg mx-4 md:mx-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4  rounded-md shadow-lg mx-4 md:mx-8">
      <SEO
        title="CountyPresidentsPage – Maidenhead Town Bowls Club"
        description="A gallery of the members of the club who were or are also County Presidents"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="overflow-hidden rounded-lg shadow-md">
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-80 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountyPresidentsPage;