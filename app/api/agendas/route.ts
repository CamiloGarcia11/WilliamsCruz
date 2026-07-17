import { NextResponse } from 'next/server';
import { saveAgendaToDb, getAgendasFromDb, DbAgenda } from '../../../lib/db/neon';
import { createCalendarEvent, isCalendarConfigured } from '../../../lib/google/calendar';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const dbAgenda: DbAgenda = {
      nombre: body.cliente.nombre,
      celular: body.cliente.celular,
      correo: body.cliente.correo,
      fecha: body.fecha,
      hora: body.hora,
      estado: body.estado || 'pendiente',
    };
    
    const result = await saveAgendaToDb(dbAgenda);

    // Intentar crear evento en Google Calendar si está configurado
    if (isCalendarConfigured()) {
      try {
        await createCalendarEvent({
          nombre: body.cliente.nombre,
          correo: body.cliente.correo,
          celular: body.cliente.celular,
          fecha: body.fecha,
          hora: body.hora
        });
      } catch (calErr) {
        console.error('Error al registrar evento en Google Calendar (Ignorado):', calErr);
      }
    }
    
    return NextResponse.json({ success: true, id: result.id });
  } catch (error: any) {
    console.error('Error en API POST /api/agendas:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const agendas = await getAgendasFromDb();
    
    // Mapear campos de base de datos a frontend para mantener total compatibilidad con el Admin Dashboard y el Calendario
    const mappedAgendas = agendas.map(a => ({
      id: a.id.toString(),
      cliente: {
        nombre: a.nombre,
        celular: a.celular,
        correo: a.correo,
      },
      fecha: a.fecha,
      hora: a.hora,
      creadoEl: a.creado_el,
      estado: a.estado || 'pendiente',
    }));
    
    return NextResponse.json(mappedAgendas);
  } catch (error: any) {
    console.error('Error en API GET /api/agendas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
