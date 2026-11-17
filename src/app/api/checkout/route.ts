import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/checkout
 * 
 * Conforme especificação oficial (README):
 * "O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos."
 */
export async function POST(req: NextRequest) {
  // Verifica se há chaves reais de gateway em produção
  const gatewayKey = process.env.PAYMENT_GATEWAY_API_KEY || process.env.ASAAS_API_KEY || process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!gatewayKey) {
    return NextResponse.json(
      {
        success: false,
        status: 'unavailable',
        error: 'Serviço de checkout temporariamente indisponível.',
        message: 'O checkout e o webhook respondem com indisponibilidade até a integração com o gateway de pagamentos.',
      },
      { status: 503 }
    );
  }

  // Bloco pronto para quando o gateway for configurado com chaves de produção
  return NextResponse.json({
    success: true,
    message: 'Processamento de gateway iniciado.',
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
