import type { PaymentProvider, ChargeRequest, ChargeResult } from "./provider";

export class MercadoPagoProvider implements PaymentProvider {
  name = "mercadopago";

  async createCharge(request: ChargeRequest): Promise<ChargeResult> {
    // TODO: chamar POST https://api.mercadopago.com/v1/payments
    // com Authorization: Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}
    throw new Error(
      `Integração MercadoPago pendente de configuração (order ${request.orderId}). ` +
        "Defina MERCADOPAGO_ACCESS_TOKEN e implemente a chamada à API."
    );
  }

  async getStatus(): Promise<ChargeResult["status"]> {
    throw new Error("Integração MercadoPago pendente de configuração.");
  }

  parseWebhookPayload(payload: unknown) {
    const data = payload as { data?: { id?: string }; action?: string };
    return { providerReference: data.data?.id ?? "", status: "PENDING" as const };
  }
}

export function resolvePaymentProvider(providerName: string): PaymentProvider {
  switch (providerName) {
    case "mercadopago":
    default:
      return new MercadoPagoProvider();
  }
}
