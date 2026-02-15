// address.service.ts
import { db } from "../../db";
import { addresses } from "../../db/schema/address.schema";
import { and, eq } from "drizzle-orm";
import type { Address } from "./address.dto";
import type { CreateAddressInput } from "./address.dto";

export class AddressService {
  listByUser = async (userId: string): Promise<Address[]> => {
    return db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
      orderBy: (a, { desc }) => [desc(a.createdAt)],
    });
  };

  createForUser = async (
    userId: string,
    input: CreateAddressInput,
  ): Promise<Address> => {
    // If setting this new address as default, unset others
    if (input.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(addresses.userId, userId));
    }

    const [created] = await db
      .insert(addresses)
      .values({
        userId,
        label: input.label ?? "primary",
        addressLine: input.addressLine,
        city: input.city,
        state: input.state,
        zip: input.zip,
        country: input.country ?? "Nigeria",
        isDefault: input.isDefault ?? false,
      })
      .returning();

    if (!created) throw new Error("Failed to create address");
    return created;
  };

  // Optional helper: set an existing address as default (nice endpoint later)
  setDefault = async (userId: string, addressId: string): Promise<void> => {
    await db
      .update(addresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(addresses.userId, userId));

    await db
      .update(addresses)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.id, addressId)));
  };
}
