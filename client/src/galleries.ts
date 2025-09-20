export interface Gallery {
  id: number;
  title: string;
  cover: string;
  photos: { url: string; name?: string }[];
}

const galleries: Gallery[] = [
  {
    id: 1,
    title: "Captains v Presidents 2025",
    cover: "/public/photos/CaptPres2025/Capt Pres 2025 (2).jpg",
    photos: [
      {url: "/public/photos/CaptPres2025/Capt Pres 2025 (1).jpg"},
      {url: "/public/photos/CaptPres2025/Capt Pres 2025 (3).jpg"},
      {url: "/public/photos/CaptPres2025/Capt Pres 2025 (4).jpg"},
    ],
  },
  {
    id: 2,
    title: "Finals Sat 2025",
    cover: "/public/photos/FinalsSat2025/Finals Saturday 2025 (1).jpg",
    photos: [
      {url: "/public/photos/FinalsSat2025/Finals Saturday 2025 (2).jpg"},
      {url: "/public/photos/FinalsSat2025/Finals Saturday 2025 (3).jpg"},
    ],
  },
  {
    id: 3,
    title: "Finals Sun 2025",
    cover: "/public/photos/FinalsSun2025/1R7A8392.jpg",
    photos: [
      {url: "/public/photos/FinalsSun2025/1R7A8560.jpg"},
      {url: "/public/photos/FinalsSun2025/1R7A8563.jpg"},
    ],
  },
];

export default galleries;