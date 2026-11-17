import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planType, paymentMethod, userId } = body;

    let amount = 49.90;
    if (planType === 'store_basic_199_90') amount = 199.90;
    if (planType === 'store_featured_299_90') amount = 299.90;

    const transactionId = `tx_${paymentMethod}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Gera payload de Pix Dinâmico com identificador da transação
    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${amount.toFixed(2)}5802BR5920TA NA MAO SERVICOS6008BRASIL62070503***6304E8A1`;

    return NextResponse.json({
      success: true,
      transactionId,
      amount,
      planType,
      paymentMethod,
      pixCopyPaste,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao processar checkout' }, { status: 500 });
  }
}
