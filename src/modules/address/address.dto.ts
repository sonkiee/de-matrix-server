// address.dto.ts
import type { InferInsertModel } from "drizzle-orm";
import type { addresses } from "../../db/schema/address.schema";

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

// what API accepts from client (no userId, no id, no timestamps)
export type CreateAddressInput = Pick<
  NewAddress,
  "label" | "addressLine" | "city" | "state" | "zip" | "country" | "isDefault"
>;
