import {
  AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orderStatusEnum } from "./enum";
import { users } from "./user.schema";
import { productVariants } from "./product-variant.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references((): AnyPgColumn => users.id, { onDelete: "restrict" }),

    orderNumber: varchar("order_number", { length: 40 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending_payment"),

    // totals
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discountTotal: numeric("discount_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),

    // keep the actual address used at checkout (snapshot)
    shippingAddressSnapshot: jsonb("shipping_address_snapshot").$type<{
      addressLine?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      label?: string;
    }>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_order_number_ux").on(t.orderNumber),
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),

    qty: integer("qty").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),

    // snapshots (important: product title/variant data at time of purchase)
    productTitleSnapshot: varchar("product_title_snapshot", {
      length: 220,
    }).notNull(),
    variantSnapshot: jsonb("variant_snapshot").$type<{
      condition?: string;
      storage?: number;
      color?: string;
      sku?: string;
    }>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;
