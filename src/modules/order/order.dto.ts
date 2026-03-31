// order.dto.ts

export type AddressLabel = "primary" | "secondary";

export type ShippingAddressSnapshot = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
  label?: AddressLabel;
};

export type CreateOrderInput = {
  items: Array<{
    variantId: string;
    qty: number;
  }>;
  addressId?: string; // existing address ID to snapshot at time of order
  shippingAddress?: ShippingAddressSnapshot;
  saveToAddressBook?: boolean;
  deliveryMethod?: "delivery" | "pickup";
  shippingFee?: string | number; // optional
  discountTotal?: string | number; // optional
};
