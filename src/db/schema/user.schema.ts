import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enum";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { addresses } from "./address.schema";
import { carts } from "./cart.schema";
import { orders } from "./order.schema";
import { payments } from "./payment.schema";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 80 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("customer"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("users_full_name_idx").on(t.fullName),
    uniqueIndex("users_email_ux").on(t.email),
    index("users_role_idx").on(t.role),
  ],
);

export const userRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  carts: many(carts),
  orders: many(orders),
  payments: many(payments),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
