import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';

export const sql = databaseUrl ? neon(databaseUrl) : null;

export interface DbLead {
  id?: number;
  tipo_credito: string;
  banco: string;
  modalidad: string;
  monto_deuda: string;
  nombre: string;
  celular: string;
  correo: string;
  fecha?: string;
  extracto_url?: string;
  extracto_base64?: string;
  valor_desembolso?: number;
  saldo_capital?: number;
  plazo_total_meses?: number;
  cuotas_pagas?: number;
  cuota_mensual_credito?: number;
  ingresos?: number;
  tiene_frech?: boolean;
  cuota_mensual_frech?: number;
  cuotas_subsidiadas_pagas?: number;
  estado?: string;
}

export interface DbAgenda {
  id?: number;
  nombre: string;
  celular: string;
  correo: string;
  fecha: string;
  hora: string;
  creado_el?: string;
  estado?: string;
}

/**
 * Guarda un lead en la base de datos PostgreSQL de Neon
 */
export async function saveLeadToDb(lead: DbLead) {
  if (!sql) {
    throw new Error('La conexión a la base de datos Neon (DATABASE_URL) no está configurada.');
  }
  
  const result = await sql`
    INSERT INTO leads (
      tipo_credito, banco, modalidad, monto_deuda, nombre, celular, correo,
      extracto_url, extracto_base64, valor_desembolso, saldo_capital,
      plazo_total_meses, cuotas_pagas, cuota_mensual_credito, ingresos,
      tiene_frech, cuota_mensual_frech, cuotas_subsidiadas_pagas, estado
    ) VALUES (
      ${lead.tipo_credito}, ${lead.banco}, ${lead.modalidad}, ${lead.monto_deuda},
      ${lead.nombre}, ${lead.celular}, ${lead.correo}, ${lead.extracto_url || null},
      ${lead.extracto_base64 || null}, ${lead.valor_desembolso || null},
      ${lead.saldo_capital || null}, ${lead.plazo_total_meses || null},
      ${lead.cuotas_pagas || null}, ${lead.cuota_mensual_credito || null},
      ${lead.ingresos || null}, ${lead.tiene_frech || false},
      ${lead.cuota_mensual_frech || 0}, ${lead.cuotas_subsidiadas_pagas || 0},
      ${lead.estado || 'pendiente'}
    ) RETURNING id
  `;
  return result[0];
}

/**
 * Obtiene todos los leads de la base de datos PostgreSQL (excluyendo el PDF para optimizar la velocidad y el peso)
 */
export async function getLeadsFromDb(): Promise<any[]> {
  if (!sql) return [];
  
  return await sql`
    SELECT id, tipo_credito, banco, modalidad, monto_deuda, nombre, celular, correo, fecha, extracto_url,
           valor_desembolso, saldo_capital, plazo_total_meses, cuotas_pagas, cuota_mensual_credito, ingresos,
           tiene_frech, cuota_mensual_frech, cuotas_subsidiadas_pagas, estado,
           (extracto_base64 IS NOT NULL) AS tiene_pdf
    FROM leads
    ORDER BY fecha DESC
  `;
}

/**
 * Obtiene el PDF Base64 de un lead específico
 */
export async function getLeadPdfFromDb(leadId: number): Promise<string | null> {
  if (!sql) return null;
  
  const result = await sql`
    SELECT extracto_base64 FROM leads WHERE id = ${leadId}
  `;
  return result[0]?.extracto_base64 || null;
}

/**
 * Guarda una cita agendada en la base de datos PostgreSQL
 */
export async function saveAgendaToDb(agenda: DbAgenda) {
  if (!sql) {
    throw new Error('La conexión a la base de datos Neon (DATABASE_URL) no está configurada.');
  }
  
  const result = await sql`
    INSERT INTO agendas (nombre, celular, correo, fecha, hora, estado)
    VALUES (${agenda.nombre}, ${agenda.celular}, ${agenda.correo}, ${agenda.fecha}, ${agenda.hora}, ${agenda.estado || 'pendiente'})
    RETURNING id
  `;
  return result[0];
}

/**
 * Obtiene todas las citas agendadas de la base de datos PostgreSQL
 */
export async function getAgendasFromDb(): Promise<any[]> {
  if (!sql) return [];
  
  return await sql`
    SELECT id, nombre, celular, correo, fecha, hora, creado_el, estado
    FROM agendas
    ORDER BY creado_el DESC
  `;
}

/**
 * Obtiene la contraseña del panel de administración desde la base de datos
 */
export async function getAdminPassword(): Promise<string | null> {
  if (!sql) return null;
  try {
    const result = await sql`
      SELECT value FROM admin_config WHERE key = 'admin_password'
    `;
    return result[0]?.value || null;
  } catch (error) {
    console.error('Error al consultar admin_password en Neon:', error);
    return null;
  }
}

/**
 * Elimina un lead de la base de datos PostgreSQL
 */
export async function deleteLeadFromDb(leadId: number) {
  if (!sql) return null;
  return await sql`
    DELETE FROM leads WHERE id = ${leadId}
  `;
}

/**
 * Actualiza el estado de un lead en la base de datos PostgreSQL
 */
export async function updateLeadStatusInDb(leadId: number, estado: string) {
  if (!sql) return null;
  return await sql`
    UPDATE leads SET estado = ${estado} WHERE id = ${leadId}
  `;
}

/**
 * Elimina una cita agendada de la base de datos PostgreSQL
 */
export async function deleteAgendaFromDb(agendaId: number) {
  if (!sql) return null;
  return await sql`
    DELETE FROM agendas WHERE id = ${agendaId}
  `;
}

/**
 * Actualiza el estado de una cita agendada en la base de datos PostgreSQL
 */
export async function updateAgendaStatusInDb(agendaId: number, estado: string) {
  if (!sql) return null;
  return await sql`
    UPDATE agendas SET estado = ${estado} WHERE id = ${agendaId}
  `;
}
