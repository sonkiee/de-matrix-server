// products.service.ts
import {
  and,
  asc,
  desc,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../../db";
import {
  categories,
  products,
  productImages,
  productVariants,
  brands,
  Product,
  NewProduct,
  NewProductVariant,
} from "../../db/schema";
import { ListParams, ProductParams } from "../../types";

const isUUID = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const parseList = (v: any): string[] => {
  if (!v) return [];
  if (Array.isArray(v))
    return v
      .map(String)
      .map((x) => x.trim())
      .filter(Boolean);
  return String(v)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

export type CreateProductInput = {
  title: string;
  description?: string | null;
  categoryId: string;
  brandId?: string | null;

  // default-variant input (matches your old Mongo controller intent)
  price: number; // naira
  stock: number;

  colors?: string[] | string;
  sizes?: string[] | string;

  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
};

type NewProductInput = Omit<NewProduct, "id" | "createdAt" | "updatedAt"> & {
  variants: Omit<
    NewProductVariant,
    "id" | "productId" | "createdAt" | "updatedAt"
  >[];
};

export type UpdateProductInput = Partial<CreateProductInput>;

export class ProductsService {
  create = async (input: NewProductInput, imageUrls: string[]) => {
    if (!input.title?.trim())
      throw Object.assign(new Error("Missing title"), { statusCode: 400 });
    if (!isUUID(input.categoryId))
      throw Object.assign(new Error("Invalid categoryId"), { statusCode: 400 });
    if (input.brandId && !isUUID(input.brandId))
      throw Object.assign(new Error("Invalid brandId"), { statusCode: 400 });

    if (!imageUrls.length)
      throw Object.assign(new Error("Upload at least one image"), {
        statusCode: 400,
      });

    return await db.transaction(async (tx) => {
      const cat = await tx.query.categories.findFirst({
        where: eq(categories.id, input.categoryId),
      });
      if (!cat)
        throw Object.assign(new Error("Category does not exist in store"), {
          statusCode: 400,
        });

      const baseSlug = slugify(input.title);
      let slug = baseSlug;

      for (let i = 0; i < 10; i++) {
        const existing = await tx.query.products.findFirst({
          where: eq(products.slug, slug),
        });
        if (!existing) break;
        slug = `${baseSlug}-${Math.floor(Math.random() * 10_000)}`;
      }

      const prices = input.variants.map((v) => Number(v.price ?? 0));

      const [p] = await tx
        .insert(products)
        .values({
          title: input.title.trim(),
          slug,
          description: input.description ?? null,
          categoryId: input.categoryId,
          brandId: input.brandId ?? null,

          isActive: true,
          isFeatured: !!input.isFeatured,
          isBestSeller: !!input.isBestSeller,
          isNewArrival: !!input.isNewArrival,

          minPrice: String(Math.min(...prices)),
          maxPrice: String(Math.max(...prices)),
          inStock: input.variants.some((v) => (v.stockQty ?? 0) > 0),

          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      await tx.insert(productImages).values(
        imageUrls.map((url, idx) => ({
          productId: p.id,
          url,
          sortOrder: idx,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      );

      await tx.insert(productVariants).values(
        input.variants.map((v) => ({
          productId: p.id,
          sku: v.sku ?? null,
          condition: v.condition,
          storage: v.storage ?? null,
          color: v.color ?? null,
          price: v.price,
          compareAtPrice: v.compareAtPrice ?? null,
          stockQty: v.stockQty,
          isActive: v.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      );

      return p;
    });
  };

  list = async (params?: ProductParams) => {
    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      inStock,
      featured,
      bestSeller,
      newArrival,
      sort,
      page = 1,
      limit = 20,
      category,
      storage,
    } = params || {};

    const conditions = [];

    conditions.push(eq(products.isActive, true));

    if (search) {
      conditions.push(
        or(
          ilike(products.title, `%${search}%`),
          ilike(products.description, `%${search}%`),
        ),
      );
    }

    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    if (brandId) {
      conditions.push(eq(products.brandId, brandId));
    }

    if (minPrice !== undefined) {
      conditions.push(gte(products.maxPrice, String(minPrice)));
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(products.minPrice, String(maxPrice)));
    }

    if (inStock !== undefined) {
      conditions.push(eq(products.inStock, !!inStock));
    }
    if (featured !== undefined) {
      conditions.push(eq(products.isFeatured, !!featured));
    }
    if (bestSeller !== undefined) {
      conditions.push(eq(products.isBestSeller, !!bestSeller));
    }
    if (newArrival !== undefined) {
      conditions.push(eq(products.isNewArrival, !!newArrival));
    }

    let orderBy;

    switch (sort) {
      case "price_asc":
        orderBy = asc(products.minPrice);
        break;
      case "price_desc":
        orderBy = desc(products.maxPrice);
        break;
      case "newest":
      default:
        orderBy = desc(products.createdAt);
    }

    const offset = (page - 1) * limit;

    // const query = db
    //   .select({
    //     product: products,
    //     category: categories,
    //     variant: productVariants,
    //   })
    //   .from(products)
    //   .innerJoin(categories, eq(categories.id, products.categoryId))
    //   .innerJoin(productVariants, eq(productVariants.productId, products.id))
    //   .where(and(...conditions))
    //   .orderBy(desc(products.createdAt))
    //   .limit(limit)
    //   .offset(offset);

    // return query;
    if (category) {
      conditions.push(
        inArray(
          products.categoryId,
          sql`(SELECT id FROM categories WHERE name = ${category})`,
        ),
      );
      // const rows = await query;
      // return rows.filter((row) => row.category?.name === category);
    }

    if (storage) {
      conditions.push(
        inArray(
          products.id,
          db
            .select({ productId: productVariants.productId }) // correct column
            .from(productVariants)
            .where(
              and(
                eq(productVariants.storage, storage),
                eq(productVariants.isActive, true),
              ),
            ),
        ),
      );
    }

    const query = db.query.products.findMany({
      where: and(...conditions),
      orderBy,
      limit,
      offset,
      with: {
        brand: {
          columns: { id: true, name: true },
        },
        images: true,
        variants: storage
          ? {
              where: and(
                eq(productVariants.storage, storage),
                eq(productVariants.isActive, true),
              ),
            }
          : true,
        category: {
          columns: { id: true, name: true },
        },
      },
    });

    return query;
  };

  getById = async (id: string) => {
    if (!isUUID(id))
      throw Object.assign(new Error("Invalid product id"), { statusCode: 400 });

    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: true,
        variants: true,
        category: {
          columns: { id: true, name: true },
        },
        brand: {
          columns: { id: true, name: true },
        },
      },
    });

    if (!product)
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    return product;
  };

  update = async (id: string, input: UpdateProductInput) => {
    if (!isUUID(id))
      throw Object.assign(new Error("Invalid product id"), { statusCode: 400 });

    return await db.transaction(async (tx) => {
      const existing = await tx.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!existing)
        throw Object.assign(new Error("Product not found"), {
          statusCode: 404,
        });

      const patch: any = { updatedAt: new Date() };

      if (input.title) {
        patch.title = input.title.trim();
        const baseSlug = slugify(patch.title);
        let slug = baseSlug;

        for (let i = 0; i < 10; i++) {
          const hit = await tx.query.products.findFirst({
            where: and(eq(products.slug, slug), sql`${products.id} <> ${id}`),
          });
          if (!hit) break;
          slug = `${baseSlug}-${Math.floor(Math.random() * 10_000)}`;
        }
        patch.slug = slug;
      }

      if (input.description !== undefined)
        patch.description = input.description ?? null;

      if (input.categoryId) {
        if (!isUUID(input.categoryId))
          throw Object.assign(new Error("Invalid categoryId"), {
            statusCode: 400,
          });
        patch.categoryId = input.categoryId;
      }

      if (input.brandId !== undefined) {
        if (input.brandId && !isUUID(input.brandId))
          throw Object.assign(new Error("Invalid brandId"), {
            statusCode: 400,
          });
        patch.brandId = input.brandId ? input.brandId : null;
      }

      if (input.isFeatured !== undefined) patch.isFeatured = !!input.isFeatured;
      if (input.isBestSeller !== undefined)
        patch.isBestSeller = !!input.isBestSeller;
      if (input.isNewArrival !== undefined)
        patch.isNewArrival = !!input.isNewArrival;

      const [p] = await tx
        .update(products)
        .set(patch)
        .where(eq(products.id, id))
        .returning();

      // Optional: if they pass price/stock, update all variants + recompute aggregates
      if (input.price !== undefined || input.stock !== undefined) {
        const vpatch: any = { updatedAt: new Date() };

        if (input.price !== undefined) {
          const price = Number(input.price);
          if (!Number.isFinite(price) || price <= 0)
            throw Object.assign(new Error("Invalid price"), {
              statusCode: 400,
            });
          vpatch.price = String(price);
        }

        if (input.stock !== undefined) {
          const stock = Number(input.stock);
          if (!Number.isFinite(stock) || stock < 0)
            throw Object.assign(new Error("Invalid stock"), {
              statusCode: 400,
            });
          vpatch.stock = stock;
        }

        await tx
          .update(productVariants)
          .set(vpatch)
          .where(eq(productVariants.productId, id));

        const agg = await tx.execute(sql`
          SELECT
            MIN(price)::numeric AS min_price,
            MAX(price)::numeric AS max_price,
            SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END)::int AS in_stock_count
          FROM product_variants
          WHERE product_id = ${id}
        `);

        const row = (agg as any).rows?.[0];
        if (row) {
          await tx
            .update(products)
            .set({
              minPrice: row.min_price,
              maxPrice: row.max_price,
              inStock: (row.in_stock_count ?? 0) > 0,
              updatedAt: new Date(),
            })
            .where(eq(products.id, id));
        }
      }

      return p;
    });
  };

  delete = async (id: string) => {
    if (!isUUID(id))
      throw Object.assign(new Error("Invalid product id"), { statusCode: 400 });

    return await db.transaction(async (tx) => {
      await tx.delete(productImages).where(eq(productImages.productId, id));
      await tx.delete(productVariants).where(eq(productVariants.productId, id));

      const deleted = await tx
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      if (deleted.length === 0)
        throw Object.assign(new Error("Product not found"), {
          statusCode: 404,
        });

      return true;
    });
  };
}
