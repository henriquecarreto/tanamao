import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/webhooks/payment
 * 
 * Conforme especificação oficial (README):
 * "O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos."
 */
export async function POST(req: NextRequest) {
  // Verifica se o webhook de produção possui credenciais homologadas
  const gatewayWebhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || process.env.PAYMENT_GATEWAY_API_KEY;

  if (!gatewayWebhookSecret) {
    return NextResponse.json(
      {
        success: false,
        status: 'unavailable',
        error: 'Webhook de pagamento temporariamente indisponível.',
        message: 'O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos.',
      },
      { status: 503 }
    );
  }

  // Bloco pronto para recepção e liquidação quando o gateway estiver conectado
  return NextResponse.json({
    success: true,
    message: 'Webhook recebido com sucesso.',
  });
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'unavailable',
      message: 'O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos.',
    },
    { status: 503 }
  );
}
