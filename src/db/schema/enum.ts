import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);

export const categoryNameEnum = pgEnum("category_name", [
  "smartphones",
  "parts",
  "tablets",
  "accessories",
]);

export const productConditionEnum = pgEnum("product_condition", [
  "new",
  "used",
  "nigerian_used",
  "refurbished",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "success",
  "failed",
  "refunded",
]);

export const cartStatusEnum = pgEnum("cart_status", [
  "active",
  "converted",
  "abandoned",
]);

export const addressLabelEnum = pgEnum("address_label", [
  "primary",
  "secondary",
]);
