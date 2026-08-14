import type { PaymentProvider, ChargeRequest, ChargeResult } from "@/lib/payments/provider";

// Implementação de referência para Mercado Pago. As chamadas HTTP reais à
// API do Mercado Pago devem ser preenchidas com o access token de produção
// (MERCADOPAGO_ACCESS_TOKEN) antes de ir ao ar — aqui está a estrutura e o
// contrato completos, prontos para receber a integração final.
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
    return {
      providerReference: data.data?.id ?? "",
      status: "PENDING" as const,
    };
  }
}

// Resolve o provider ativo com base em SiteSettings.activePaymentProvider —
// permite trocar o gateway pelo painel administrativo sem deploy.
export function resolvePaymentProvider(providerName: string): PaymentProvider {
  switch (providerName) {
    case "mercadopago":
    default:
      return new MercadoPagoProvider();
  }
}
