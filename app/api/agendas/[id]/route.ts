import { NextResponse } from 'next/server';
import { deleteAgendaFromDb, updateAgendaStatusInDb } from '../../../../lib/db/neon';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agendaId = Number(id);
    if (isNaN(agendaId)) {
      return NextResponse.json({ error: 'ID de cita inválido' }, { status: 400 });
    }

    const { estado } = await request.json();
    if (!estado) {
      return NextResponse.json({ error: 'Falta el campo estado' }, { status: 400 });
    }

    await updateAgendaStatusInDb(agendaId, estado);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en API PATCH /api/agendas/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agendaId = Number(id);
    if (isNaN(agendaId)) {
      return NextResponse.json({ error: 'ID de cita inválido' }, { status: 400 });
    }

    await deleteAgendaFromDb(agendaId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en API DELETE /api/agendas/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
