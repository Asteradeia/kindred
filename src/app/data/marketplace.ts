export type ProductType =
  | "In Stock"
  | "Made to Order"
  | "Pre-order"
  | "Digital";

export interface ProductVariation {
  name: string;
  options: string[];
}

export interface MarketplaceProduct {
  id: number;
  images: string[];
  title: string;
  creator: string;
  username: string;
  description: string;
  price: number;
  category: string;
  type: ProductType;
  quantityAvailable: number;
  releaseDate?: string;
  preOrderLimit?: number;
  preOrdersReserved?: number;
  turnaround?: string;
  featured?: boolean;
  variations?: ProductVariation[];
}

export const productTypes: ProductType[] = [
  "In Stock",
  "Made to Order",
  "Pre-order",
  "Digital",
];

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: 1,
    images: ["/images/marketplace/moonlit-forest.jpg"],
    title: "Moonlit Forest Print",
    creator: "Moss & Moon",
    username: "mossandmoon",
    description: "A dreamy woodland illustration printed on archival paper.",
    price: 18,
    category: "Prints",
    type: "In Stock",
    quantityAvailable: 12,
    featured: true,
  },
  {
    id: 2,
    images: ["/images/marketplace/crochet-fox.jpg"],
    title: "Crochet Woodland Fox",
    creator: "Little Fern Studio",
    username: "littlefernstudio",
    description: "A handmade crochet fox created to order.",
    price: 35,
    category: "Handmade",
    type: "Made to Order",
    quantityAvailable: 5,
    turnaround: "2–3 weeks",
    featured: true,
  },
  {
    id: 3,
    images: ["/images/marketplace/Celestial-Sticker-Pack.jpg"],
    title: "Celestial Sticker Pack",
    creator: "Starling Studio",
    username: "starlingstudio",
    description: "A collection of celestial-themed digital stickers.",
    price: 5,
    category: "Digital",
    type: "Digital",
    quantityAvailable: 999,
  },
  {
    id: 4,
    images: ["/images/marketplace/Spring-Cottage-Collection.jpg"],
    title: "Spring Cottage Collection",
    creator: "Moss & Moon",
    username: "mossandmoon",
    description: "A new collection of cottage-inspired art prints.",
    price: 24,
    category: "Prints",
    type: "Pre-order",
    quantityAvailable: 20,
    releaseDate: "2027-03-15",
    preOrderLimit: 50,
    preOrdersReserved: 30,
    featured: true,
  },
  {
    id: 5,
    images: ["/images/marketplace/Handmade-Silver-Leaf-Necklace.jpg"],
    title: "Handmade Silver Leaf Necklace",
    creator: "Ink & Ivy",
    username: "inkandivy",
    description: "A delicate silver necklace inspired by nature.",
    price: 42,
    category: "Jewellery",
    type: "In Stock",
    quantityAvailable: 2,
    variations: [
  {
    name: "Finish",
    options: ["Silver", "Gold Plated"],
  },
  {
    name: "Chain Length",
    options: ["16 inches", "18 inches", "20 inches"],
  },
],
  },
  {
    id: 6,
    images: ["/images/marketplace/Fantasy-Character-Base-Pack.jpg"],
    title: "Fantasy Character Base Pack",
    creator: "PixelWitch",
    username: "pixelwitch",
    description: "A digital pixel-art base pack for indie game creators.",
    price: 12,
    category: "Game Assets",
    type: "Digital",
    quantityAvailable: 999,
  },
];
