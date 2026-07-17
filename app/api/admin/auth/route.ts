import { NextResponse } from 'next/server';
import { getAdminPassword } from '../../../../lib/db/neon';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Obtener la contraseña estrictamente desde la base de datos Neon (PostgreSQL)
    const dbPassword = await getAdminPassword();
    
    if (!dbPassword) {
      return NextResponse.json({ success: false, error: 'Configuración de seguridad de administrador no inicializada en base de datos' }, { status: 500 });
    }
    
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
