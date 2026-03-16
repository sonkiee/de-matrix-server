// export type User = {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: "customer" | "admin";
//   isVerified: boolean;
// };

type SortKey = "newest" | "price_asc" | "price_desc";

export type ListParams = {
  q?: string;

  category?: "iphone" | "samsung" | "accessories" | "tablet" | "smartphones"; // categories.name
  brandSlug?: string;

  condition?: "new" | "used" | "nigerian_used" | "refurbished"; // variants.condition
  storage?: number;
  color?: string;

  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;

  inStock?: boolean;
  isActive?: boolean;

  minPrice?: number;
  maxPrice?: number;

  sort?: SortKey;
  page?: number;
  limit?: number;
};

export type ProductParams = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sort?: "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;

  category?: string;
  storage?: number;
};
