import {
  index,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { paymentStatusEnum } from "./enum";
import { users } from "./user.schema";
import { orders } from "./order.schema";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    provider: varchar("provider", { length: 40 }).notNull(), // paystack, flutterwave...
    reference: varchar("reference", { length: 120 }).notNull(),

    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    status: paymentStatusEnum("status").notNull().default("initiated"),

    rawWebhookData: jsonb("raw_webhook_data").$type<Record<string, any>>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("payments_reference_ux").on(t.reference),
    index("payments_order_idx").on(t.orderId),
    index("payments_user_idx").on(t.userId),
    index("payments_status_idx").on(t.status),
  ],
);

export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export type Payment = InferSelectModel<typeof payments>;
export type NewPayment = InferInsertModel<typeof payments>;
