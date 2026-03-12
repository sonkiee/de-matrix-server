import { db } from "./db";
import { brands, categories, products, productVariants } from "./db/schema";
import { eq } from "drizzle-orm";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Condition = "new" | "used" | "refurbished";

async function upsertBrand(name: string, description?: string) {
  const slug = slugify(name);
  const [row] = await db
    .insert(brands)
    .values({
      name,
      slug,
      description: description ?? null,
      isVisible: true,
    })
    .onConflictDoUpdate({
      target: brands.slug,
      set: { name, description: description ?? null, updatedAt: new Date() },
    })
    .returning({ id: brands.id, slug: brands.slug });

  return row;
}

async function upsertCategory(name: string, description?: string) {
  const slug = slugify(name);
  const [row] = await db
    .insert(categories)
    .values({
      name: name as any, // must match your categoryNameEnum
      slug,
      description: description ?? null,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        description: description ?? null,
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning({ id: categories.id, slug: categories.slug });

  return row;
}

async function upsertProduct(input: {
  categoryId: string;
  brandId?: string | null;
  title: string;
  model?: string | null;
  series?: string | null;
  specs?: Record<string, any> | null;
  description?: string | null;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  minPrice?: string | null;
  maxPrice?: string | null;
  inStock?: boolean;
}) {
  const slug = slugify(input.title);

  const [row] = await db
    .insert(products)
    .values({
      categoryId: input.categoryId,
      brandId: input.brandId ?? null,
      title: input.title,
      slug,
      model: input.model ?? null,
      series: input.series ?? null,
      specs: input.specs ?? null,
      description: input.description ?? null,
      isActive: true,
      minPrice: input.minPrice ?? null,
      maxPrice: input.maxPrice ?? null,
      inStock: input.inStock ?? true,
      isFeatured: input.isFeatured ?? false,
      isBestSeller: input.isBestSeller ?? false,
      isNewArrival: input.isNewArrival ?? false,
    })
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        categoryId: input.categoryId,
        brandId: input.brandId ?? null,
        model: input.model ?? null,
        series: input.series ?? null,
        specs: input.specs ?? null,
        description: input.description ?? null,
        minPrice: input.minPrice ?? null,
        maxPrice: input.maxPrice ?? null,
        inStock: input.inStock ?? true,
        isFeatured: input.isFeatured ?? false,
        isBestSeller: input.isBestSeller ?? false,
        isNewArrival: input.isNewArrival ?? false,
        updatedAt: new Date(),
      },
    })
    .returning({ id: products.id, slug: products.slug });

  return row;
}

async function insertVariants(
  values: Array<{
    productId: string;
    sku: string;
    condition: Condition;
    storage?: number | null;
    color?: string | null;
    price: string;
    compareAtPrice?: string | null;
    stockQty: number;
  }>,
) {
  if (!values.length) return;

  await db
    .insert(productVariants)
    .values(
      values.map((v) => ({
        productId: v.productId,
        sku: v.sku,
        condition: v.condition as any, // must match productConditionEnum
        storage: v.storage ?? null,
        color: v.color ?? null,
        price: v.price,
        compareAtPrice: v.compareAtPrice ?? null,
        stockQty: v.stockQty,
        isActive: true,
      })),
    )
    .onConflictDoNothing({ target: productVariants.sku });
}

export async function seedMoreProducts() {
  // Brands
  const apple = await upsertBrand("Apple", "Apple devices and accessories");
  const samsung = await upsertBrand(
    "Samsung",
    "Samsung devices and accessories",
  );

  const oraimo = await upsertBrand("Oraimo", "Mobile accessories brand");
  const newAge = await upsertBrand("New Age", "Mobile accessories brand");
  const poga = await upsertBrand("Poga", "Mobile accessories brand");

  // Categories (must match your enum exactly)
  const catIphone = await upsertCategory("iphone", "Apple iPhones");
  const catSamsung = await upsertCategory("samsung", "Samsung phones");
  const catAccessories = await upsertCategory(
    "accessories",
    "Phone accessories and parts",
  );

  // --------------------
  // iPhone products (3–5)
  // --------------------
  const ip14pm = await upsertProduct({
    categoryId: catIphone.id,
    brandId: apple.id,
    title: "iPhone 14 Pro Max",
    model: "iPhone 14 Pro Max",
    series: "iPhone 14 Series",
    specs: { network: "5G", screen: '6.7"', chip: "A16 Bionic" },
    description: "Premium iPhone with Pro camera system.",
    isFeatured: true,
    isNewArrival: true,
    minPrice: "820.00",
    maxPrice: "1150.00",
  });

  await insertVariants([
    {
      productId: ip14pm.id,
      sku: "APL-IP14PM-128-DEEP-PURPLE-NEW",
      condition: "new",
      storage: 128,
      color: "Deep Purple",
      price: "980.00",
      compareAtPrice: "1050.00",
      stockQty: 6,
    },
    {
      productId: ip14pm.id,
      sku: "APL-IP14PM-256-BLACK-NEW",
      condition: "new",
      storage: 256,
      color: "Space Black",
      price: "1080.00",
      compareAtPrice: "1150.00",
      stockQty: 4,
    },
    {
      productId: ip14pm.id,
      sku: "APL-IP14PM-256-GOLD-USED",
      condition: "used",
      storage: 256,
      color: "Gold",
      price: "860.00",
      compareAtPrice: null,
      stockQty: 2,
    },
    {
      productId: ip14pm.id,
      sku: "APL-IP14PM-512-SILVER-REFURB",
      condition: "refurbished",
      storage: 512,
      color: "Silver",
      price: "1150.00",
      compareAtPrice: null,
      stockQty: 1,
    },
  ]);

  const ip13 = await upsertProduct({
    categoryId: catIphone.id,
    brandId: apple.id,
    title: "iPhone 13",
    model: "iPhone 13",
    series: "iPhone 13 Series",
    specs: { network: "5G", screen: '6.1"', chip: "A15 Bionic" },
    description: "Balanced performance and value.",
    isBestSeller: true,
    minPrice: "430.00",
    maxPrice: "650.00",
  });

  await insertVariants([
    {
      productId: ip13.id,
      sku: "APL-IP13-128-BLUE-USED",
      condition: "used",
      storage: 128,
      color: "Blue",
      price: "430.00",
      stockQty: 5,
    },
    {
      productId: ip13.id,
      sku: "APL-IP13-128-PINK-NEW",
      condition: "new",
      storage: 128,
      color: "Pink",
      price: "560.00",
      compareAtPrice: "620.00",
      stockQty: 3,
    },
    {
      productId: ip13.id,
      sku: "APL-IP13-256-MIDNIGHT-REFURB",
      condition: "refurbished",
      storage: 256,
      color: "Midnight",
      price: "520.00",
      stockQty: 2,
    },
    {
      productId: ip13.id,
      sku: "APL-IP13-256-RED-NEW",
      condition: "new",
      storage: 256,
      color: "Red",
      price: "650.00",
      stockQty: 2,
    },
  ]);

  const ip12 = await upsertProduct({
    categoryId: catIphone.id,
    brandId: apple.id,
    title: "iPhone 12",
    model: "iPhone 12",
    series: "iPhone 12 Series",
    specs: { network: "5G", screen: '6.1"', chip: "A14 Bionic" },
    description: "Solid upgrade with 5G support.",
    minPrice: "320.00",
    maxPrice: "500.00",
  });

  await insertVariants([
    {
      productId: ip12.id,
      sku: "APL-IP12-64-BLACK-USED",
      condition: "used",
      storage: 64,
      color: "Black",
      price: "320.00",
      stockQty: 6,
    },
    {
      productId: ip12.id,
      sku: "APL-IP12-128-WHITE-REFURB",
      condition: "refurbished",
      storage: 128,
      color: "White",
      price: "380.00",
      stockQty: 3,
    },
    {
      productId: ip12.id,
      sku: "APL-IP12-128-GREEN-NEW",
      condition: "new",
      storage: 128,
      color: "Green",
      price: "460.00",
      compareAtPrice: "500.00",
      stockQty: 2,
    },
  ]);

  // --------------------
  // Samsung products (3)
  // --------------------
  const s23u = await upsertProduct({
    categoryId: catSamsung.id,
    brandId: samsung.id,
    title: "Samsung Galaxy S23 Ultra",
    model: "Galaxy S23 Ultra",
    series: "Galaxy S Series",
    specs: { network: "5G", screen: '6.8"', note: "S Pen support" },
    description: "Flagship Galaxy with premium camera.",
    isFeatured: true,
    minPrice: "650.00",
    maxPrice: "980.00",
  });

  await insertVariants([
    {
      productId: s23u.id,
      sku: "SMS-S23U-256-BLACK-NEW",
      condition: "new",
      storage: 256,
      color: "Phantom Black",
      price: "980.00",
      stockQty: 2,
    },
    {
      productId: s23u.id,
      sku: "SMS-S23U-256-GREEN-USED",
      condition: "used",
      storage: 256,
      color: "Green",
      price: "700.00",
      stockQty: 2,
    },
    {
      productId: s23u.id,
      sku: "SMS-S23U-512-BLACK-REFURB",
      condition: "refurbished",
      storage: 512,
      color: "Phantom Black",
      price: "850.00",
      stockQty: 1,
    },
  ]);

  const a54 = await upsertProduct({
    categoryId: catSamsung.id,
    brandId: samsung.id,
    title: "Samsung Galaxy A54 5G",
    model: "Galaxy A54 5G",
    series: "Galaxy A Series",
    specs: { network: "5G", screen: '6.4"' },
    description: "Great midrange battery + display.",
    isBestSeller: true,
    minPrice: "220.00",
    maxPrice: "360.00",
  });

  await insertVariants([
    {
      productId: a54.id,
      sku: "SMS-A54-128-BLACK-NEW",
      condition: "new",
      storage: 128,
      color: "Black",
      price: "360.00",
      stockQty: 5,
    },
    {
      productId: a54.id,
      sku: "SMS-A54-128-WHITE-USED",
      condition: "used",
      storage: 128,
      color: "White",
      price: "220.00",
      stockQty: 4,
    },
    {
      productId: a54.id,
      sku: "SMS-A54-256-GREEN-REFURB",
      condition: "refurbished",
      storage: 256,
      color: "Green",
      price: "300.00",
      stockQty: 2,
    },
  ]);

  const a14 = await upsertProduct({
    categoryId: catSamsung.id,
    brandId: samsung.id,
    title: "Samsung Galaxy A14 5G",
    model: "Galaxy A14 5G",
    series: "Galaxy A Series",
    specs: { network: "5G", screen: '6.6"' },
    description: "Budget Samsung with 5G.",
    minPrice: "140.00",
    maxPrice: "220.00",
  });

  await insertVariants([
    {
      productId: a14.id,
      sku: "SMS-A14-64-BLACK-USED",
      condition: "used",
      storage: 64,
      color: "Black",
      price: "140.00",
      stockQty: 6,
    },
    {
      productId: a14.id,
      sku: "SMS-A14-128-BLUE-NEW",
      condition: "new",
      storage: 128,
      color: "Blue",
      price: "220.00",
      stockQty: 3,
    },
  ]);

  // --------------------
  // Accessories: iPad
  // --------------------
  const ipad9 = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: apple.id,
    title: "iPad 10.2 (9th Gen)",
    model: "iPad 10.2 (9th Gen)",
    series: "iPad",
    specs: { screen: '10.2"', chip: "A13 Bionic" },
    description: "Everyday iPad for work and school.",
    minPrice: "210.00",
    maxPrice: "360.00",
  });

  await insertVariants([
    {
      productId: ipad9.id,
      sku: "APL-IPAD9-64-SILVER-NEW",
      condition: "new",
      storage: 64,
      color: "Silver",
      price: "360.00",
      stockQty: 3,
    },
    {
      productId: ipad9.id,
      sku: "APL-IPAD9-64-GREY-USED",
      condition: "used",
      storage: 64,
      color: "Space Grey",
      price: "210.00",
      stockQty: 2,
    },
    {
      productId: ipad9.id,
      sku: "APL-IPAD9-256-GREY-REFURB",
      condition: "refurbished",
      storage: 256,
      color: "Space Grey",
      price: "320.00",
      stockQty: 1,
    },
  ]);

  // --------------------
  // Accessories: Screens (brand Samsung + Apple)
  // --------------------
  const ipScreen11 = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: apple.id, // “iphone” screen brand -> Apple
    title: "iPhone 11 Replacement Screen",
    model: "iPhone 11 Screen",
    series: "iPhone Parts",
    specs: { type: "Screen", compatibleWith: ["iPhone 11"] },
    description: "Replacement display for iPhone 11.",
    minPrice: "18.00",
    maxPrice: "35.00",
  });

  await insertVariants([
    {
      productId: ipScreen11.id,
      sku: "APL-SCREEN-IP11-BLACK-NEW",
      condition: "new",
      storage: null,
      color: "Black",
      price: "35.00",
      stockQty: 10,
    },
    {
      productId: ipScreen11.id,
      sku: "APL-SCREEN-IP11-BLACK-REFURB",
      condition: "refurbished",
      storage: null,
      color: "Black",
      price: "25.00",
      stockQty: 6,
    },
    {
      productId: ipScreen11.id,
      sku: "APL-SCREEN-IP11-BLACK-USED",
      condition: "used",
      storage: null,
      color: "Black",
      price: "18.00",
      stockQty: 4,
    },
  ]);

  const smScreenA54 = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: samsung.id,
    title: "Samsung A54 Replacement Screen",
    model: "Galaxy A54 Screen",
    series: "Samsung Parts",
    specs: { type: "Screen", compatibleWith: ["Galaxy A54 5G"] },
    description: "Replacement display for Galaxy A54.",
    minPrice: "20.00",
    maxPrice: "45.00",
  });

  await insertVariants([
    {
      productId: smScreenA54.id,
      sku: "SMS-SCREEN-A54-BLACK-NEW",
      condition: "new",
      color: "Black",
      price: "45.00",
      stockQty: 8,
    },
    {
      productId: smScreenA54.id,
      sku: "SMS-SCREEN-A54-BLACK-REFURB",
      condition: "refurbished",
      color: "Black",
      price: "32.00",
      stockQty: 4,
    },
    {
      productId: smScreenA54.id,
      sku: "SMS-SCREEN-A54-BLACK-USED",
      condition: "used",
      color: "Black",
      price: "20.00",
      stockQty: 3,
    },
  ]);

  // --------------------
  // Accessories: Power banks (Oraimo/New Age/Poga)
  // --------------------
  const oraimoPB = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: oraimo.id,
    title: "Oraimo Power Bank 20000mAh",
    model: "20000mAh Power Bank",
    series: "Power Banks",
    specs: {
      capacity: "20000mAh",
      ports: ["USB-A", "USB-C"],
      fastCharge: true,
    },
    description: "High capacity power bank for daily use.",
    minPrice: "12.00",
    maxPrice: "18.00",
  });

  await insertVariants([
    {
      productId: oraimoPB.id,
      sku: "ORA-PB-20000-BLACK-NEW",
      condition: "new",
      color: "Black",
      price: "18.00",
      stockQty: 12,
    },
    {
      productId: oraimoPB.id,
      sku: "ORA-PB-20000-BLACK-USED",
      condition: "used",
      color: "Black",
      price: "12.00",
      stockQty: 4,
    },
  ]);

  const newAgePB = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: newAge.id,
    title: "New Age Power Bank 10000mAh",
    model: "10000mAh Power Bank",
    series: "Power Banks",
    specs: { capacity: "10000mAh", ports: ["USB-A"], fastCharge: false },
    description: "Compact power bank for light usage.",
    minPrice: "7.00",
    maxPrice: "12.00",
  });

  await insertVariants([
    {
      productId: newAgePB.id,
      sku: "NAG-PB-10000-WHITE-NEW",
      condition: "new",
      color: "White",
      price: "12.00",
      stockQty: 10,
    },
    {
      productId: newAgePB.id,
      sku: "NAG-PB-10000-WHITE-REFURB",
      condition: "refurbished",
      color: "White",
      price: "9.00",
      stockQty: 3,
    },
    {
      productId: newAgePB.id,
      sku: "NAG-PB-10000-WHITE-USED",
      condition: "used",
      color: "White",
      price: "7.00",
      stockQty: 2,
    },
  ]);

  const pogaPB = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: poga.id,
    title: "Poga Power Bank 30000mAh",
    model: "30000mAh Power Bank",
    series: "Power Banks",
    specs: {
      capacity: "30000mAh",
      ports: ["USB-A", "USB-C"],
      fastCharge: true,
    },
    description: "Heavy-duty power bank for long trips.",
    minPrice: "15.00",
    maxPrice: "24.00",
  });

  await insertVariants([
    {
      productId: pogaPB.id,
      sku: "POG-PB-30000-BLACK-NEW",
      condition: "new",
      color: "Black",
      price: "24.00",
      stockQty: 6,
    },
    {
      productId: pogaPB.id,
      sku: "POG-PB-30000-BLACK-REFURB",
      condition: "refurbished",
      color: "Black",
      price: "18.00",
      stockQty: 2,
    },
  ]);

  // --------------------
  // Accessories: Chargers (Oraimo/New Age/Poga)
  // --------------------
  const oraimoCharger = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: oraimo.id,
    title: "Oraimo 20W USB-C Fast Charger",
    model: "20W USB-C Charger",
    series: "Chargers",
    specs: { type: "Wall Charger", output: "20W", ports: ["USB-C"] },
    description: "Fast charger for modern phones.",
    minPrice: "4.50",
    maxPrice: "8.00",
  });

  await insertVariants([
    {
      productId: oraimoCharger.id,
      sku: "ORA-CH-20W-WHITE-NEW",
      condition: "new",
      color: "White",
      price: "8.00",
      stockQty: 20,
    },
    {
      productId: oraimoCharger.id,
      sku: "ORA-CH-20W-WHITE-USED",
      condition: "used",
      color: "White",
      price: "4.50",
      stockQty: 5,
    },
  ]);

  const newAgeCharger = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: newAge.id,
    title: "New Age 15W Charger + Cable",
    model: "15W Charger",
    series: "Chargers",
    specs: { type: "Wall Charger", output: "15W", includesCable: true },
    description: "Budget charger with included cable.",
    minPrice: "3.50",
    maxPrice: "6.50",
  });

  await insertVariants([
    {
      productId: newAgeCharger.id,
      sku: "NAG-CH-15W-BLACK-NEW",
      condition: "new",
      color: "Black",
      price: "6.50",
      stockQty: 15,
    },
    {
      productId: newAgeCharger.id,
      sku: "NAG-CH-15W-BLACK-REFURB",
      condition: "refurbished",
      color: "Black",
      price: "4.80",
      stockQty: 4,
    },
  ]);

  const pogaCharger = await upsertProduct({
    categoryId: catAccessories.id,
    brandId: poga.id,
    title: "Poga 25W Fast Charger",
    model: "25W Charger",
    series: "Chargers",
    specs: { type: "Wall Charger", output: "25W", ports: ["USB-C"] },
    description: "Higher output fast charger.",
    minPrice: "5.50",
    maxPrice: "9.50",
  });

  await insertVariants([
    {
      productId: pogaCharger.id,
      sku: "POG-CH-25W-WHITE-NEW",
      condition: "new",
      color: "White",
      price: "9.50",
      stockQty: 10,
    },
    {
      productId: pogaCharger.id,
      sku: "POG-CH-25W-WHITE-USED",
      condition: "used",
      color: "White",
      price: "5.50",
      stockQty: 3,
    },
  ]);

  // Optional: if you want to ensure products.inStock reflects real variant stock,
  // you can compute and update per product later. For now you're setting stockQty per variant.

  console.log("Extra seed complete:", {
    brands: [apple.slug, samsung.slug, oraimo.slug, newAge.slug, poga.slug],
    categories: [catIphone.slug, catSamsung.slug, catAccessories.slug],
  });
}
