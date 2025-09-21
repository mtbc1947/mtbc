import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { Gallery } from "../galleries";

interface GalleryViewProps {
  gallery: Gallery;
  onBack: () => void;
}

export default function GalleryView({ gallery, onBack }: GalleryViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  // Attach custom navigation after Swiper mounts and refs exist
    useEffect(() => {
    if (
        swiperInstance &&
        swiperInstance.params &&
        swiperInstance.navigation &&
        prevRef.current &&
        nextRef.current
    ) {
        // Attach custom navigation
        swiperInstance.params.navigation.prevEl = prevRef.current;
        swiperInstance.params.navigation.nextEl = nextRef.current;

        // Re-initialize navigation
        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
    }
    }, [swiperInstance]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Back + Title */}
      <div className="flex items-center justify-between mb-6 w-full max-w-4xl">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-center flex-1 mx-4">
          {gallery.title}
        </h2>
        <div className="w-[80px]"></div>
      </div>

      {/* Carousel */}
      <div className="w-full flex justify-center relative">
        <div className="w-full max-w-4xl mx-auto relative">
          <Swiper
            className="h-[70vh] w-full"
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={20}
            centeredSlides
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
          >
            {gallery.photos.map((photo, i) => (
              <SwiperSlide key={i} className="flex items-center justify-center h-full">
                <img
                  src={photo.url}
                  alt={`${gallery.title} ${i + 1}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div
            ref={prevRef}
            className={`absolute top-1/2 -translate-y-1/2 z-10 text-3xl md:text-5xl
              cursor-pointer text-white bg-black/40 hover:bg-black/60 p-2 md:p-3
              rounded-full select-none left-2 md:left-[-50px]
              ${lightboxIndex === 0 ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
          >
            ‹
          </div>

          <div
            ref={nextRef}
            className={`absolute top-1/2 -translate-y-1/2 z-10 text-3xl md:text-5xl
              cursor-pointer text-white bg-black/40 hover:bg-black/60 p-2 md:p-3
              rounded-full select-none right-2 md:right-[-50px]
              ${lightboxIndex === gallery.photos.length - 1
                ? "opacity-30 cursor-not-allowed pointer-events-none"
                : ""}`}
          >
            ›
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={gallery.photos.map((photo) => ({ src: photo.url }))}
        />
      )}
    </div>
  );
}
