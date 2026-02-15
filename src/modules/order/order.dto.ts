// order.dto.ts
import type { NewOrder } from "../../db/schema/order.schema";

export type ShippingAddressSnapshot = NonNullable<
  NewOrder["shippingAddressSnapshot"]
>;

export type CreateOrderInput = {
  items: Array<{
    variantId: string;
    qty: number;
  }>;
  shippingAddress: ShippingAddressSnapshot;
  shippingFee?: string | number; // optional
  discountTotal?: string | number; // optional
};
