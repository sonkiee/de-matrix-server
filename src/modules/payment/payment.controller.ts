import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { PaystackClient } from "./paystac.client";
import * as crypto from "crypto";

export class PaymentsController {
  private service: PaymentService;

  constructor() {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("PAYSTACK_SECRET_KEY is missing");
    this.service = new PaymentService(new PaystackClient(secret));
  }

  list = async (req: Request, res: Response) => {
    const payments = await this.service.list();
    return res.status(200).json({ data: payments });
  };

  initialize = async (req: Request, res: Response) => {
    const user = req.user;
    const { orderId } = req.body as { orderId?: string };

    if (!orderId) return res.status(400).json({ message: "Missing orderId" });
    if (!user)
      return res.status(404).json({ message: "Youre not authenticated" });

    const data = await this.service.initializePayment({
      userId: user.id, // ensure your AuthRequest user uses uuid id
      userEmail: user.email,
      orderId: String(orderId),
    });

    return res.status(200).json({ data });
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const payment = await this.service.getById(id as string);

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.status(200).json({ data: payment });
  };

  verify = async (req: Request, res: Response) => {
    const reference = String(req.query.reference ?? "");
    console.log("Verifying payment with reference:", reference);
    if (!reference)
      return res.status(400).json({ message: "Missing reference" });

    const result = await this.service.verifyAndFinalize(reference);
    return res.status(200).json({ message: "Payment successful", ...result });
  };

  webhook = async (req: Request, res: Response) => {
    console.log("Received webhook", {
      headers: req.headers,
      body: req.body,
    });
    // Paystack signature verification: x-paystack-signature = HMAC-SHA512(body, secret)
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers["x-paystack-signature"] as string | undefined;

    if (!secret)
      return res.status(500).json({ message: "Server misconfigured" });

    if (!signature)
      return res.status(400).json({ message: "Missing signature" });

    // NOTE: req.body must be raw for signature verification.
    // In Express, use:
    // app.post("/webhook", express.raw({ type: "application/json" }), controller.webhook)
    // and then JSON.parse(req.body.toString()) below.
    const rawBody = (req as any).body as Buffer;
    if (!Buffer.isBuffer(rawBody)) {
      return res.status(500).json({
        message: "Expected raw Buffer body",
      });
    }

    const computed = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (computed !== signature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(rawBody.toString("utf8"));

    try {
      const eventType = event?.event;
      if (eventType === "charge.success") {
        const reference = event?.data?.reference;
        const amount = event?.data?.amount;
        const currency = event?.data?.currency;

        if (!reference || !amount || !currency)
          return res.status(400).send("Missing reference");

        // Store raw webhook payload if you want:

        await this.service["handleSuccessfulPayment"](
          reference,
          amount,
          currency,
        );

        return res.status(200).json({ message: "ok" });
      }

      return res.status(200).send("ignored");
    } catch (e: any) {
      return res.status(500).send(e?.message ?? "Webhook error");
    }
  };
}
