// order.service.ts
import { db } from "../../db";
import { orders, orderItems } from "../../db/schema/order.schema";
import { productVariants } from "../../db/schema/product-variant.schema";
import { and, eq, inArray } from "drizzle-orm";
import type { Order } from "../../db/schema/order.schema";
import type { CreateOrderInput, ShippingAddressSnapshot } from "./order.dto";
import { addresses } from "../../db/schema";

const toMoneyString = (n: number) => n.toFixed(2);

const generateOrderNumber = () => {
  // simple + unique enough; replace with your own pattern
  return `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
};

export class OrderService {
  listAll = async (): Promise<Order[]> => {
    return db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
      with: { user: true },
    });
  };

  findById = async (id: string): Promise<Order | undefined> => {
    return db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: { items: true },
    });
  };

  listByUser = async (userId: string): Promise<Order[]> => {
    return db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: { items: true },
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
  };

  // NOTE: This creates an order and order_items in ONE transaction.
  createForUser = async (
    userId: string,
    input: CreateOrderInput,
  ): Promise<Order> => {
    if (!input.items?.length) throw new Error("No items provided");

    // basic qty validation
    for (const it of input.items) {
      if (!it.variantId) throw new Error("Each item must have variantId");
      if (!Number.isInteger(it.qty) || it.qty <= 0)
        throw new Error("Invalid qty");
    }

    // Fetch variants
    const variantIds = input.items.map((i) => i.variantId);
    const variants = await db.query.productVariants.findMany({
      where: inArray(productVariants.id, variantIds),
      with: { product: { columns: { title: true } } },
    });

    if (variants.length !== variantIds.length) {
      const found = new Set(variants.map((v) => v.id));
      const missing = variantIds.filter((id) => !found.has(id));
      throw new Error(`Variant(s) not found: ${missing.join(", ")}`);
    }

    // Compute subtotal (numeric in PG comes back as string sometimes; depends on driver)
    let subtotalNum = 0;

    // Build order items rows
    const itemsRows = input.items.map((it) => {
      const v = variants.find((x) => x.id === it.variantId)!;

      // If your variant price is numeric() it may be string
      const unitPriceNum =
        typeof v.price === "string" ? Number(v.price) : Number(v.price);

      // Optional stock check if you have v.stock
      if (
        typeof (v as any).stockQty === "number" &&
        (v as any).stockQty < it.qty
      ) {
        throw new Error(`Variant ${v.id} is out of stock`);
      }

      subtotalNum += unitPriceNum * it.qty;

      return {
        variantId: v.id,
        qty: it.qty,
        unitPrice: toMoneyString(unitPriceNum),
        // snapshots: you MUST set productTitleSnapshot per schema
        // If you don't have title on variant row, join it (see note below)
        productTitleSnapshot:
          (v as any).product?.title ?? (v as any).productTitle ?? "Product",
        variantSnapshot: {
          condition: (v as any).condition,
          storage: (v as any).storage,
          color: (v as any).color,
          sku: (v as any).sku,
        },
      };
    });

    const shippingFeeNum = input.shippingFee ? Number(input.shippingFee) : 0;
    const discountNum = input.discountTotal ? Number(input.discountTotal) : 0;
    const totalNum = subtotalNum + shippingFeeNum - discountNum;

    const orderNumber = generateOrderNumber();

    return await db.transaction(async (tx) => {
      let addressIdToSave: string | null = null;
      let snapshot: ShippingAddressSnapshot;

      if (input.addressId) {
        const addr = await tx.query.addresses.findFirst({
          where: and(
            eq(addresses.id, input.addressId),
            eq(addresses.userId, userId),
          ),
        });

        if (!addr) throw new Error("Address not found");

        snapshot = {
          firstName: addr.firstName,
          lastName: addr.lastName,
          phone: addr.phone,
          address: addr.address as string,
          city: addr.city as string,
          state: addr.state as string,
          zip: addr.zip ?? undefined,
          country: addr.country ?? "Nigeria",
          label: addr.label,
        };

        addressIdToSave = addr.id;
      } else if (input.shippingAddress) {
        const a = input.shippingAddress;
        snapshot = {
          firstName: a.firstName,
          lastName: a.lastName,
          phone: a.phone,
          address: a.address,
          city: a.city,
          state: a.state,
          zip: a.zip,
          country: a.country,
          label: a.label,
        };

        if (input.saveToAddressBook) {
          const [createdAddress] = await tx
            .insert(addresses)
            .values({
              userId,
              label: snapshot.label ?? "primary",
              firstName: snapshot.firstName,
              lastName: snapshot.lastName,
              phone: snapshot.phone,
              address: snapshot.address,
              city: snapshot.city,
              state: snapshot.state,
              zip: snapshot.zip,
              country: snapshot.country,
              isDefault: false, // or set true if user wants it default
            })
            .returning({ id: addresses.id });

          if (!createdAddress) throw new Error("Failed to save address");
          addressIdToSave = createdAddress.id;
        }
      } else {
        throw new Error("Either addressId or shippingAddress must be provided");
      }

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          userId,
          orderNumber,
          status: "pending_payment",
          subtotal: toMoneyString(subtotalNum),
          shippingFee: toMoneyString(shippingFeeNum),
          discountTotal: toMoneyString(discountNum),
          total: toMoneyString(totalNum),
          shippingAddressSnapshot: snapshot,
          deliveryMethod: input.deliveryMethod ?? "pickup",
          addressId: addressIdToSave,
        })
        .returning();

      if (!createdOrder) throw new Error("Failed to create order");

      await tx.insert(orderItems).values(
        itemsRows.map((row) => ({
          orderId: createdOrder.id,
          variantId: row.variantId,
          qty: row.qty,
          unitPrice: row.unitPrice,
          productTitleSnapshot: row.productTitleSnapshot,
          variantSnapshot: row.variantSnapshot,
        })),
      );

      // Return order with items
      const full = await tx.query.orders.findFirst({
        where: eq(orders.id, createdOrder.id),
        with: { items: true },
      });

      if (!full) throw new Error("Failed to load created order");
      return full;
    });
  };
}
