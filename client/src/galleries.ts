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
    cover: "/photos/capt_pres_2025/Capt_Pres_2025-2.jpg",
    photos: [
      {url: "/photos/capt_pres_2025/Capt_Pres_2025-1.jpg"},
      {url: "/photos/capt_pres_2025/Capt_Pres_2025-3.jpg"},
      {url: "/photos/capt_pres_2025/Capt_Pres_2025-4.jpg"},
    ],
  },
  {
    id: 2,
    title: "Finals Sat 2025",
    cover: "/photos/finals_sat_2025/Finals_Saturday_2025-1.jpg",
    photos: [
      {url: "/photos/finals_sat_2025/Finals_Saturday_2025-2.jpg"},
      {url: "/photos/finals_sat_2025/Finals_Saturday_2025-3.jpg"},
    ],
  },
  {
    id: 3,
    title: "Finals Sun 2025",
    cover: "/photos/finals_sun_2025/1R7A8392.jpg",
    photos: [
      {url: "/photos/finals_sun_2025/1R7A8560.jpg"},
      {url: "/photos/finals_sun_2025/1R7A8563.jpg"},
    ],
  },
];

export default galleries;