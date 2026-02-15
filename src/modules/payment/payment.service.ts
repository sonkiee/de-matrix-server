import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { payments, orders, orderItems, products } from "../../db/schema"; // adjust to your schema names
import { PaystackClient } from "./paystac.client";
import { isUUID } from "../../utils/is-uuid";

const toKobo = (naira: string | number) => Math.round(Number(naira) * 100);

export class PaymentService {
  constructor(private paystack: PaystackClient) {}

  private makeReference(orderId: string) {
    return `ord_${orderId}_${Date.now()}`; // stable enough for MVP
  }

  initializePayment = async (args: {
    userId: string;
    userEmail: string;
    orderId: string;
  }) => {
    if (!isUUID(args.orderId)) {
      const err = new Error("Invalid order ID");
      (err as any).statusCode = 400;
      throw err;
    }

    return await db.transaction(async (tx) => {
      const order = await tx.query.orders.findFirst({
        where: and(eq(orders.id, args.orderId), eq(orders.userId, args.userId)),
      });

      if (!order) {
        const err = new Error("Order not found");
        (err as any).statusCode = 404;
        throw err;
      }

      if (order.status === "paid") {
        const err = new Error("Order already paid");
        (err as any).statusCode = 409;
        throw err;
      }

      // Ensure reference exists (generate once). Use a stable reference format.
      const reference = this.makeReference(order.id);

      // Create (or upsert) payment row in initiated state
      // Because reference is unique, insert may conflict if retry. Use onConflictDoUpdate if you want.
      await tx
        .insert(payments)
        .values({
          userId: args.userId,
          orderId: order.id,
          provider: "paystack",
          reference,
          amount: order.total, // naira
          status: "initiated",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: payments.reference,
          set: {
            updatedAt: new Date(),
            status: "initiated",
          },
        });

      const ps = await this.paystack.initialize({
        amountKobo: toKobo(order.total), // convert to kobo
        email: args.userEmail,
        reference,
        currency: "NGN",
        metadata: { orderId: order.id },
      });

      return { authorizationUrl: ps.data.authorization_url, reference };
    });
  };

  verifyAndFinalize = async (reference: string) => {
    const verify = await this.paystack.verify(reference);

    if (!verify.status) {
      const err = new Error(verify.message || "Verification failed");
      (err as any).statusCode = 400;
      throw err;
    }

    if (verify.data.status !== "success") {
      const err = new Error("Payment not successful");
      (err as any).statusCode = 400;
      throw err;
    }

    // Optional: validate amount/currency here before marking paid
    // e.g. compare verify.data.amount (kobo) with order.totalAmount*100

    return await this.handleSuccessfulPayment(reference);
  };

  private handleSuccessfulPayment = async (
    reference: string,
    amountKobo: number,
    currency: string,
  ) => {
    return db.transaction(async (tx) => {
      const payment = await tx.query.payments.findFirst({
        where: eq(payments.reference, reference),
      });

      if (!payment) {
        const err = new Error("Payment reference not found");
        (err as any).statusCode = 404;
        throw err;
      }

      const order = await tx.query.orders.findFirst({
        where: eq(orders.id, payment.orderId),
      });

      if (!order) {
        const err = new Error("Order not found for payment");
        (err as any).statusCode = 404;
        throw err;
      }

      // Idempotent: if already paid, stop
      if (payment.status === "paid" && order.status !== "pending_payment") {
        return { alreadyProcessed: true, orderId: order.id };
      }

      // Validate amount/currency (recommended)
      const expectedKobo = toKobo(order.total);
      if (currency !== "NGN" || amountKobo !== expectedKobo) {
        const err = new Error("Amount/currency mismatch");
        (err as any).statusCode = 409;
        throw err;
      }

      // Load order items
      const items = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, order.id),
      });

      // Stock check & deduction per variant (simple safe version)
      // MVP approach: for each item, read variant and update with guard.
      const variantIds = items
        .map((i) => i.variantId)
        .filter(Boolean) as string[];

      const variants = await tx.query.productVariants.findMany({
        where: inArray(productVariants.id, variantIds),
      });

      const byId = new Map(variants.map((v) => [v.id, v]));

      for (const it of items) {
        if (!it.variantId) continue; // in case variant deleted (set null). snapshot still exists.

        const v = byId.get(it.variantId);
        if (!v) {
          const err = new Error(`Variant missing: ${it.variantId}`);
          (err as any).statusCode = 409;
          throw err;
        }

        if (v.stockQty < it.qty) {
          const err = new Error(`Insufficient stock for variant ${v.id}`);
          (err as any).statusCode = 409;
          throw err;
        }

        // Deduct stock
        await tx
          .update(productVariants)
          .set({ stockQty: v.stockQty - it.qty, updatedAt: new Date() })
          .where(eq(productVariants.id, v.id));
      }

      // Mark payment paid
      await tx
        .update(payments)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(payments.id, payment.id));

      // Update order status
      await tx
        .update(orders)
        .set({ status: "processing", updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      return { alreadyProcessed: false, orderId: order.id };
    });
  };
}
