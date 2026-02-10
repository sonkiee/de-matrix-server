import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { addressLabelEnum } from "./enum";
import { users } from "./user.schema";

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    label: addressLabelEnum("label").notNull().default("primary"),
    addressLine: text("address_line"), // street/address
    city: varchar("city", { length: 80 }),
    state: varchar("state", { length: 80 }),
    zip: varchar("zip", { length: 30 }),
    country: varchar("country", { length: 80 }).default("Nigeria"),

    isDefault: boolean("is_default").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("addresses_user_idx").on(t.userId)],
);
