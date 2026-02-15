import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { PaystackClient } from "./paystac.client";

export class PaymentsController {
  private service: PaymentService;

  constructor() {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw new Error("PAYSTACK_SECRET_KEY is missing");
    this.service = new PaymentService(new PaystackClient(secret));
  }

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

  verify = async (req: Request, res: Response) => {
    const reference = String(req.query.reference ?? "");
    if (!reference)
      return res.status(400).json({ message: "Missing reference" });

    const result = await this.service.verifyAndFinalize(reference);
    return res.status(200).json({ message: "Payment successful", ...result });
  };

  //   webhook = async (req: Request, res: Response) => {
  //     // Paystack signature verification: x-paystack-signature = HMAC-SHA512(body, secret)
  //     const secret = process.env.PAYSTACK_SECRET_KEY;
  //     if (!secret)
  //       return res.status(500).json({ message: "Server misconfigured" });

  //     const signature = req.headers["x-paystack-signature"] as string | undefined;
  //     if (!signature)
  //       return res.status(400).json({ message: "Missing signature" });

  //     // NOTE: req.body must be raw for signature verification.
  //     // In Express, use:
  //     // app.post("/webhook", express.raw({ type: "application/json" }), controller.webhook)
  //     // and then JSON.parse(req.body.toString()) below.
  //     const rawBody = (req as any).body as Buffer;
  //     if (!Buffer.isBuffer(rawBody)) {
  //       return res.status(500).json({
  //         message:
  //           "Webhook raw body not available. Use express.raw({type:'application/json'}) on this route.",
  //       });
  //     }

  //     const computed = crypto
  //       .createHmac("sha512", secret)
  //       .update(rawBody)
  //       .digest("hex");

  //     if (computed !== signature) {
  //       return res.status(401).json({ message: "Invalid signature" });
  //     }

  //     const event = JSON.parse(rawBody.toString("utf8"));

  //     try {
  //       if (event?.event === "charge.success") {
  //         const reference = event?.data?.reference;
  //         if (!reference)
  //           return res.status(400).json({ message: "Missing reference" });

  //         // Store raw webhook payload if you want:
  //         await db
  //           .update(payments)
  //           .set({ rawWebhookData: event, updatedAt: new Date() })
  //           .where(eq(payments.reference, reference));

  //         await this.paymentService.handleSuccessfulPayment(reference);

  //         return res.status(200).json({ message: "ok" });
  //       }

  //       return res.status(200).json({ message: "ignored" });
  //     } catch (e: any) {
  //       const code = e?.statusCode ?? 500;
  //       return res.status(code).json({ message: e?.message ?? "Server error" });
  //     }
  //   };
}
