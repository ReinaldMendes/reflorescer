export interface ChargeRequest {
  orderId: string;
  amount: number;
  method: "PIX" | "CREDIT_CARD" | "BOLETO";
  customer: { name: string; email: string; document: string };
  installments?: number;
}

export interface ChargeResult {
  providerReference: string;
  status: "PENDING" | "PAID" | "FAILED";
  qrCode?: string;
  qrCodeText?: string;
  checkoutUrl?: string;
}

export interface PaymentProvider {
  name: string;
  createCharge(request: ChargeRequest): Promise<ChargeResult>;
  getStatus(providerReference: string): Promise<ChargeResult["status"]>;
  parseWebhookPayload(payload: unknown): { providerReference: string; status: ChargeResult["status"] };
}
