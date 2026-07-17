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
      return NextResponse.json({ error: 'PDF no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ pdfBase64: base64 });
  } catch (error: any) {
    console.error('Error en API GET /api/leads/[id]/pdf:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
