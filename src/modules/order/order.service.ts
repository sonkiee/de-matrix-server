// order.service.ts
import { db } from "../../db";
import { orders, orderItems } from "../../db/schema/order.schema";
import { productVariants } from "../../db/schema/product-variant.schema";
import { eq, inArray } from "drizzle-orm";
import type { Order } from "../../db/schema/order.schema";
import type { CreateOrderInput } from "./order.dto";

const toMoneyString = (n: number) => n.toFixed(2);

const generateOrderNumber = () => {
  // simple + unique enough; replace with your own pattern
  return `ORD-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
};

export class OrderService {
  listAll = async (): Promise<Order[]> => {
    return db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
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
          shippingAddressSnapshot: input.shippingAddress,
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
