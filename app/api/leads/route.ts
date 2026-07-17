import { NextResponse } from 'next/server';
import { saveLeadToDb, getLeadsFromDb, DbLead } from '../../../lib/db/neon';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mapear campos de frontend a base de datos
    const dbLead: DbLead = {
      tipo_credito: body.tipoSociedad,
      banco: body.banco,
      modalidad: body.modalidad,
      monto_deuda: body.montoDeuda,
      nombre: body.nombre,
      celular: body.celular,
      correo: body.correo,
      extracto_url: body.extractoUrl,
      extracto_base64: body.extractoBase64,
      valor_desembolso: body.valorDesembolso,
      saldo_capital: body.saldoCapital,
      plazo_total_meses: body.plazoTotalMeses,
      cuotas_pagas: body.cuotasPagas,
      cuota_mensual_credito: body.cuotaMensualCredito,
      ingresos: body.ingresos,
      tiene_frech: body.tieneFRECH,
      cuota_mensual_frech: body.cuotaMensualFRECH,
      cuotas_subsidiadas_pagas: body.cuotasSubsidiadasPagas,
      estado: body.estado || 'pendiente',
    };
    
    const result = await saveLeadToDb(dbLead);
    return NextResponse.json({ success: true, id: result.id });
  } catch (error: any) {
    console.error('Error en API POST /api/leads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await getLeadsFromDb();
    
    // Mapear campos de base de datos a frontend para mantener total compatibilidad con el Admin Dashboard
    const mappedLeads = leads.map(l => ({
      id: l.id.toString(),
      tipoSociedad: l.tipo_credito,
      banco: l.banco,
      modalidad: l.modalidad,
      montoDeuda: l.monto_deuda,
      nombre: l.nombre,
      celular: l.celular,
      correo: l.correo,
      fecha: l.fecha,
      extractoUrl: l.extracto_url,
      tienePdf: l.tiene_pdf,
      valorDesembolso: l.valor_desembolso ? Number(l.valor_desembolso) : undefined,
      saldoCapital: l.saldo_capital ? Number(l.saldo_capital) : undefined,
      plazoTotalMeses: l.plazo_total_meses,
      cuotasPagas: l.cuotas_pagas,
      cuotaMensualCredito: l.cuota_mensual_credito ? Number(l.cuota_mensual_credito) : undefined,
      ingresos: l.ingresos ? Number(l.ingresos) : undefined,
      tieneFRECH: l.tiene_frech,
      cuotaMensualFRECH: l.cuota_mensual_frech ? Number(l.cuota_mensual_frech) : undefined,
      cuotasSubsidiadasPagas: l.cuotas_subsidiadas_pagas,
      estado: l.estado || 'pendiente',
    }));
    
    return NextResponse.json(mappedLeads);
  } catch (error: any) {
    console.error('Error en API GET /api/leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
