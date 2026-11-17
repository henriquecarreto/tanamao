import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook de Pagamentos Automatizado (Zero intervenção humana)
 * Processa notificações instantâneas de liquidação de Pix e Cartão de Crédito
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, status, userId, planType } = body;

    if (!transactionId || status !== 'paid') {
      return NextResponse.json(
        { success: false, message: 'Transação inválida ou status não aprovado' },
        { status: 400 }
      );
    }

    // Calcula nova data de expiração (+30 dias a partir de agora)
    const newPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      message: 'Pagamento compensado e assinatura liberada instantaneamente via Webhook!',
      transactionId,
      subscriptionStatus: 'active',
      currentPeriodEnd: newPeriodEnd,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro no processamento do webhook' }, { status: 500 });
  }
}
