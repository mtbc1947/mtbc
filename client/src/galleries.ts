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
    cover: "src/photos/Capt_Pres_2025/Capt Pres 2025 (2).jpg",
    photos: [
      {url: "src/photos/Capt_Pres_2025/Capt Pres 2025 (1).jpg"},
      {url: "src/photos/Capt_Pres_2025/Capt Pres 2025 (3).jpg"},
      {url: "src/photos/Capt_Pres_2025/Capt Pres 2025 (4).jpg"},
    ],
  },
  {
    id: 2,
    title: "Final Sat 2025",
    cover: "src/photos/Finals_Sat_2025/Finals Saturday 2025 (1).jpg",
    photos: [
      {url: "src/photos/Finals_Sat_2025/Finals Saturday 2025 (2).jpg"},
      {url: "src/photos/Finals_Sat_2025/Finals Saturday 2025 (3).jpg"},
    ],
  },
  {
    id: 3,
    title: "Finals Sun 2025",
    cover: "src/photos/Finals_Sunday_2025/1R7A8392.jpg",
    photos: [
      {url: "src/photos/Finals_Sunday_2025/1R7A8560.jpg"},
      {url: "src/photos/Finals_Sunday_2025/1R7A8563.jpg"},
    ],
  },
];

export default galleries;