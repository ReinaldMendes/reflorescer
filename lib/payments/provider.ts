// Interface que todo gateway de pagamento deve implementar. O restante da
// aplicação (order-service, webhooks) fala apenas com esta interface —
// nunca diretamente com o SDK de um gateway específico. Trocar de gateway
// no futuro significa escrever uma nova classe aqui, sem tocar em checkout,
// pedidos ou banco de dados.

export interface ChargeRequest {
  orderId: string;
  amount: number; // em reais
  method: "PIX" | "CREDIT_CARD" | "BOLETO";
  customer: { name: string; email: string; document: string };
  installments?: number;
}

export interface ChargeResult {
  providerReference: string;
  status: "PENDING" | "PAID" | "FAILED";
  qrCode?: string; // Pix
  qrCodeText?: string; // Pix copia-e-cola
  checkoutUrl?: string; // cartão/boleto hospedado
}

export interface PaymentProvider {
  name: string;
  createCharge(request: ChargeRequest): Promise<ChargeResult>;
  getStatus(providerReference: string): Promise<ChargeResult["status"]>;
  parseWebhookPayload(payload: unknown): { providerReference: string; status: ChargeResult["status"] };
}
