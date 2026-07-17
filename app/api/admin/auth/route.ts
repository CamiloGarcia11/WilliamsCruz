import { NextResponse } from 'next/server';
import { getAdminPassword } from '../../../../lib/db/neon';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // 1. Obtener la contraseña desde la base de datos Neon (PostgreSQL)
    // 2. Si no está configurada la BD, cae a la variable de entorno o al default hardcoded seguro
    const dbPassword = await getAdminPassword() || process.env.ADMIN_PASSWORD || 'susfinanzas2026';
    
    if (password === dbPassword) {
      return NextResponse.json({ success: true, token: 'authed_2026' });
    } else {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error en API /api/admin/auth:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
