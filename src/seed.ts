import { db } from "./db";
import { brands, categories, products, productVariants } from "./db/schema"; // include productVariants

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // 1) Brand
  const brandName = "Apple";
  const brandSlug = slugify(brandName);

  const [brand] = await db
    .insert(brands)
    .values({
      name: brandName,
      slug: brandSlug,
      description: "Consumer electronics brand",
      logoUrl: "https://example.com/logos/apple.png",
      isVisible: true,
    })
    .onConflictDoUpdate({
      target: brands.slug,
      set: {
        name: brandName,
        description: "Consumer electronics brand",
        logoUrl: "https://example.com/logos/apple.png",
        isVisible: true,
        updatedAt: new Date(),
      },
    })
    .returning({ id: brands.id });

  // 2) Category (must match enum)
  const categoryEnumValue = "smartphones" as any;
  const categorySlug = "smartphones";

  const [category] = await db
    .insert(categories)
    .values({
      name: categoryEnumValue,
      slug: categorySlug,
      description: "Mobile phones and smartphones",
      isActive: true,
    })
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        description: "Mobile phones and smartphones",
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning({ id: categories.id });

  // 3) Product (return its id so we can create variants)
  const title = "iPhone 13 Pro Max";
  const productSlug = slugify(title);

  const [product] = await db
    .insert(products)
    .values({
      categoryId: category.id,
      brandId: brand.id,
      title,
      slug: productSlug,
      model: "iPhone 13 Pro Max",
      series: "iPhone 13 Series",
      specs: {
        screen: '6.7" Super Retina XDR',
        chip: "A15 Bionic",
        camera: "Triple 12MP",
        network: "5G",
      },
      description: "Dummy product for testing",
      isActive: true,
      minPrice: "1200.00",
      maxPrice: "1200.00",
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
    })
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        updatedAt: new Date(),
      },
    })
    .returning({ id: products.id, slug: products.slug });

  // 4) Variants (THIS is what you add to cart/order)
  // condition MUST match your productConditionEnum values (example: "new", "used")
  const condition = "new" as any;

  // Insert 2 variants, ignore duplicates by sku
  await db
    .insert(productVariants)
    .values([
      {
        productId: product.id,
        sku: "APL-IP13PM-256-GOLD-NEW",
        condition,
        storage: 256,
        color: "Gold",
        price: "1200.00",
        compareAtPrice: "1300.00",
        stockQty: 5,
        isActive: true,
      },
      {
        productId: product.id,
        sku: "APL-IP13PM-128-BLUE-NEW",
        condition,
        storage: 128,
        color: "Blue",
        price: "1000.00",
        compareAtPrice: "1100.00",
        stockQty: 2,
        isActive: true,
      },
    ])
    .onConflictDoNothing({ target: productVariants.sku });

  console.log("Seed complete:", {
    brandId: brand.id,
    categoryId: category.id,
    productId: product.id,
    productSlug: product.slug,
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
