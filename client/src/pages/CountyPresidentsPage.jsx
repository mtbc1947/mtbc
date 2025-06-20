import React, { useEffect, useState } from "react";

 
const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const CountyPresidentsPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/api/images?folder=County`) // adjust URL if backend is on different port or domain
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch images");
        return res.json();
      })
      .then((data) => {
        if (data.length === 0){
          console.log("No images found")
        } else {
          setImages(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading images...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  );
};

export default CountyPresidentsPage;
