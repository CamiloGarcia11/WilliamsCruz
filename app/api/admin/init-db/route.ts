import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db/neon';

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL o NEON_DATABASE_URL no está configurada en las variables de entorno de Vercel.',
        envCheck: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasNeonDatabaseUrl: !!process.env.NEON_DATABASE_URL
        }
      }, { status: 500 });
    }

    console.log('Iniciando creación de tablas en base de datos Neon...');

    // 1. Crear tabla admin_config
    await sql`
      CREATE TABLE IF NOT EXISTS admin_config (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    // 2. Insertar contraseña por defecto si no existe
    // NOTA: Puedes cambiar 'admin123' por la contraseña que desees usar para tu panel
    await sql`
      INSERT INTO admin_config (key, value)
      VALUES ('admin_password', 'admin123')
      ON CONFLICT (key) DO NOTHING
    `;

    // 3. Crear tabla leads
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        tipo_credito VARCHAR(255),
        banco VARCHAR(255),
        modalidad VARCHAR(255),
        monto_deuda VARCHAR(255),
        nombre VARCHAR(255),
        celular VARCHAR(255),
        correo VARCHAR(255),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        extracto_url TEXT,
        extracto_base64 TEXT,
        valor_desembolso NUMERIC,
        saldo_capital NUMERIC,
        plazo_total_meses INTEGER,
        cuotas_pagas INTEGER,
        cuota_mensual_credito NUMERIC,
        ingresos NUMERIC,
        tiene_frech BOOLEAN DEFAULT FALSE,
        cuota_mensual_frech NUMERIC DEFAULT 0,
        cuotas_subsidiadas_pagas INTEGER DEFAULT 0,
        estado VARCHAR(50) DEFAULT 'pendiente'
      )
    `;

    // 4. Crear tabla agendas
    await sql`
      CREATE TABLE IF NOT EXISTS agendas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255),
        celular VARCHAR(255),
        correo VARCHAR(255),
        fecha VARCHAR(100),
        hora VARCHAR(50),
        creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) DEFAULT 'pendiente'
      )
    `;

    // Verificar si se guardó la contraseña correctamente
    const currentPasswordCheck = await sql`
      SELECT value FROM admin_config WHERE key = 'admin_password'
    `;

    return NextResponse.json({
      success: true,
      message: 'Tablas inicializadas correctamente en Neon.',
      tablesCreated: ['admin_config', 'leads', 'agendas'],
      adminPasswordInitialized: currentPasswordCheck.length > 0,
      note: 'La contraseña por defecto configurada es: admin123 (puedes cambiarla en la tabla admin_config si lo deseas)'
    });

  } catch (error: any) {
    console.error('Error al inicializar la base de datos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al ejecutar la consulta en Neon: ' + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
