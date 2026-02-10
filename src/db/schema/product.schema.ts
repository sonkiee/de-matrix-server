import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./category.schema";
import { brands } from "./brand.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { productImages } from "./product-image.schema";
import { productVariants } from "./product-variant.schema";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "set null",
    }),

    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),

    // optional phone-catalogue fields
    model: varchar("model", { length: 160 }), // "iPhone 13 Pro Max"
    series: varchar("series", { length: 160 }), // "13 Series"
    specs: jsonb("specs").$type<Record<string, any>>(), // screen, chip, etc.

    description: text("description"),
    isActive: boolean("is_active").notNull().default(true),

    // listing helpers (recommended for fast filtering)
    minPrice: numeric("min_price", { precision: 12, scale: 2 }),
    maxPrice: numeric("max_price", { precision: 12, scale: 2 }),
    inStock: boolean("in_stock").notNull().default(true),

    isFeatured: boolean("is_featured").notNull().default(false),
    isBestSeller: boolean("is_best_seller").notNull().default(false),
    isNewArrival: boolean("is_new_arrival").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_ux").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_brand_idx").on(t.brandId),
    index("products_active_idx").on(t.isActive),
    index("products_min_price_idx").on(t.minPrice),
  ],
);

export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
}));

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;
