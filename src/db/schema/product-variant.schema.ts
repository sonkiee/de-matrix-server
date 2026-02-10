import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { productConditionEnum } from "./enum";
import { products } from "./product.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    sku: varchar("sku", { length: 80 }), // optional but recommended
    condition: productConditionEnum("condition").notNull(),
    storage: integer("storage"), // e.g. 64/128/256; nullable for accessories
    color: varchar("color", { length: 60 }),

    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),

    stockQty: integer("stock_qty").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("variants_product_idx").on(t.productId),
    uniqueIndex("variants_sku_ux").on(t.sku),
    index("variants_condition_idx").on(t.condition),
    index("variants_price_idx").on(t.price),
    index("variants_active_idx").on(t.isActive),
  ],
);

export const variantRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export type ProductVariant = InferSelectModel<typeof productVariants>;
export type NewProductVariant = InferInsertModel<typeof productVariants>;
