import { useState, useRef } from "react";
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

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

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
        <div className="border-8  border-red-500 w-full max-w-4xl mx-auto relative">
          <Swiper
            className="h-[70vh]"
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={20}
            centeredSlides
            // ✅ Attach custom arrows BEFORE initialization
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSlideChange={(swiper) => setLightboxIndex(swiper.activeIndex)}
          >
            {gallery.photos.map((photo, i) => (
              <SwiperSlide key={i} className="flex justify-center">
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
