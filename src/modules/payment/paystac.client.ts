import axios from "axios";

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data: { authorization_url: string; access_code: string; reference: string };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned" | "ongoing" | string;
    reference: string;
    amount: number; // kobo
    currency: string;
    metadata?: any;
  };
};

export class PaystackClient {
  constructor(
    private secretKey: string,
    private baseUrl = "https://api.paystack.co",
  ) {}

  initialize = async (payload: {
    amountKobo: number;
    email: string;
    reference: string;
    currency?: "NGN";
    metadata?: Record<string, any>;
  }) => {
    const res = await axios.post<PaystackInitResponse>(
      `${this.baseUrl}/transaction/initialize`,
      {
        amount: payload.amountKobo,
        email: payload.email,
        reference: payload.reference,
        currency: payload.currency ?? "NGN",
        metadata: payload.metadata ?? {},
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20_000,
      },
    );
    return res.data;
  };

  verify = async (reference: string) => {
    const res = await axios.get<PaystackVerifyResponse>(
      `${this.baseUrl}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20_000,
      },
    );
    return res.data;
  };
}
