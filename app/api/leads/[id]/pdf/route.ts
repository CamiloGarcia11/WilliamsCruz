import { NextResponse } from 'next/server';
import { getLeadPdfFromDb } from '../../../../../lib/db/neon';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = Number(id);
    
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'ID de lead inválido' }, { status: 400 });
    }
    
    const base64 = await getLeadPdfFromDb(leadId);
    if (!base64) {
      return NextResponse.json({ error: 'PDF no encontrado para este prospecto' }, { status: 404 });
    }

    const url = new URL(request.url);
    const wantsJson = url.searchParams.get('format') === 'json' || request.headers.get('accept')?.includes('application/json');

    if (wantsJson) {
      return NextResponse.json({ pdfBase64: base64 });
    }

    // Decodificar Base64 a buffer binario para visualizar o descargar directamente
    let contentType = 'application/pdf';
    let filename = `extracto_lead_${leadId}.pdf`;

    if (base64.startsWith('data:image/jpeg') || base64.startsWith('data:image/jpg')) {
      contentType = 'image/jpeg';
      filename = `extracto_lead_${leadId}.jpg`;
    } else if (base64.startsWith('data:image/png')) {
      contentType = 'image/png';
      filename = `extracto_lead_${leadId}.png`;
    } else if (base64.startsWith('data:image/webp')) {
      contentType = 'image/webp';
      filename = `extracto_lead_${leadId}.webp`;
    }

    const pureBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const fileBuffer = Buffer.from(pureBase64, 'base64');

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error en API GET /api/leads/[id]/pdf:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
