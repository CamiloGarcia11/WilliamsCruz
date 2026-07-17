import { NextResponse } from 'next/server';
import { deleteLeadFromDb, updateLeadStatusInDb } from '../../../../lib/db/neon';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'ID de lead inválido' }, { status: 400 });
    }

    const { estado } = await request.json();
    if (!estado) {
      return NextResponse.json({ error: 'Falta el campo estado' }, { status: 400 });
    }

    await updateLeadStatusInDb(leadId, estado);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en API PATCH /api/leads/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = Number(id);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'ID de lead inválido' }, { status: 400 });
    }

    await deleteLeadFromDb(leadId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en API DELETE /api/leads/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
