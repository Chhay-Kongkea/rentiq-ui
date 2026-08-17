export const CATEGORIES = [
  { id: 1, image: "/img/electronics.png", title: "Electronics", count: "520+ items" },
  { id: 2, image: "/img/travel.png", title: "Travel", count: "320+ items" },
  { id: 3, image: "/img/tools.png", title: "Tools", count: "450+ items" },
  { id: 4, image: "/img/home.png", title: "Home Stay", count: "180+ stays" },
  { id: 5, image: "/img/electronics.png", title: "Electronics", count: "520+ items" },
  { id: 6, image: "/img/sport.png", title: "Sports", count: "250+ items" },
  { id: 7, image: "/img/camera.png", title: "Camera", count: "220+ items" },
  { id: 8, image: "/img/room.png", title: "Home Stay", count: "180+ stays" },
] as const;

export const FEATURED_RENTALS = [
  { id: 1, category: "VIHECLES", image: "/img/porsche.png", title: "Porsche 718 Cayman", location: "BKK1, Phnom Penh", rating: 4.9, price: 60 },
  { id: 2, category: "HOMES", image: "/img/modern-house.png", title: "Modern Studio in BKK1", location: "BKK1, Phnom Penh", rating: 4.7, price: 35 },
  { id: 3, category: "ELECTRONICS", image: "/img/camera-sony.png", title: "Sony A7III Camera", location: "Chamkarmon", rating: 4.9, price: 15 },
  { id: 4, category: "TOOLS", image: "/img/makita-tools.png", title: "Makita Drill Set", location: "BKK1, Phnom Penh", rating: 4.5, price: 60 },
] as const;

export const BANNER_IMAGES = [
  "/img/banner.png",
  "/img/banner-car-rentals.png",
  "/img/banner1.png",
  "/img/banner-outdoor-rentals.png",
] as const;
