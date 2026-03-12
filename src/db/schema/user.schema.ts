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
    firstName: varchar("first_name", { length: 80 }).notNull(),
    lastName: varchar("last_name", { length: 80 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    password: text("password").notNull(),
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
    index("users_first_name_idx").on(t.firstName),
    index("users_last_name_idx").on(t.lastName),
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
