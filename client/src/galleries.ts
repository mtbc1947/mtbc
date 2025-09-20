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
    cover: "/photos/CaptPres2025/Capt%20Pres%202025%20(2).jpg",
    photos: [
      {url: "/photos/CaptPres2025/Capt%20Pres%202025%20(1).jpg"},
      {url: "/photos/CaptPres2025/Capt%20Pres%202025%20(3).jpg"},
      {url: "/photos/CaptPres2025/Capt%20Pres%202025%20(4).jpg"},
    ],
  },
  {
    id: 2,
    title: "Finals Sat 2025",
    cover: "/photos/FinalsSat2025/Finals%20Saturday%202025%20(1).jpg",
    photos: [
      {url: "/photos/FinalsSat2025/Finals%20Saturday%202025%20(2).jpg"},
      {url: "/photos/FinalsSat2025/Finals%20Saturday%202025%20(3).jpg"},
    ],
  },
  {
    id: 3,
    title: "Finals Sun 2025",
    cover: "/photos/FinalsSun2025/1R7A8392.jpg",
    photos: [
      {url: "/photos/FinalsSun2025/1R7A8560.jpg"},
      {url: "/photos/FinalsSun2025/1R7A8563.jpg"},
    ],
  },
];

export default galleries;