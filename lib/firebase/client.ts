'use strict';

export interface Lead {
  id?: string;
  tipoSociedad: string;
  banco: string;
  modalidad: string;
  montoDeuda: string;
  nombre: string;
  celular: string;
  correo: string;
  fecha?: string;
  extractoUrl?: string;
  extractoBase64?: string;
  tienePdf?: boolean;
  // Campos financieros adicionales
  valorDesembolso?: number;
  saldoCapital?: number;
  plazoTotalMeses?: number;
  cuotasPagas?: number;
  cuotaMensualCredito?: number;
  ingresos?: number;
  tieneFRECH?: boolean;
  cuotaMensualFRECH?: number;
  cuotasSubsidiadasPagas?: number;
  estado?: string;
}

export interface Agenda {
  id?: string;
  cliente: {
    nombre: string;
    celular: string;
    correo: string;
  };
  fecha: string;
  hora: string;
  creadoEl?: string;
  estado?: string;
}

/**
 * Guarda un lead en Neon DB (a través de API local) o en localStorage como respaldo.
 */
export async function saveLeadToFirebase(lead: Lead): Promise<{ success: boolean; source: 'local' | 'neon'; error?: any }> {
  // 1. Intentar enviar a Neon DB (PostgreSQL) usando la API local
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log('Lead guardado exitosamente en Neon DB via API con ID:', data.id);
        return { success: true, source: 'neon' };
      }
    }
  } catch (error) {
    console.warn('Neon DB no disponible o error al guardar. Intentando fallback a localStorage...', error);
  }

  // 2. Fallback a localStorage
  try {
    const localLeads = JSON.parse(localStorage.getItem('susfinanzas_leads') || '[]');
    localLeads.push({ ...lead, fecha: lead.fecha || new Date().toISOString() });
    localStorage.setItem('susfinanzas_leads', JSON.stringify(localLeads));
    console.warn('Lead guardado localmente en localStorage.');
    return { success: true, source: 'local' };
  } catch (error) {
    console.error('Error al guardar lead en localStorage:', error);
    return { success: false, source: 'local', error };
  }
}

/**
 * Guarda una cita agendada en Neon DB (a través de API local) o en localStorage como respaldo.
 */
export async function saveAgendaToFirebase(agenda: Agenda): Promise<{ success: boolean; source: 'local' | 'neon'; error?: any }> {
  // 1. Intentar enviar a Neon DB (PostgreSQL) usando la API local
  try {
    const response = await fetch('/api/agendas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agenda),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        console.log('Cita guardada exitosamente en Neon DB via API con ID:', data.id);
        return { success: true, source: 'neon' };
      }
    }
  } catch (error) {
    console.warn('Neon DB no disponible o error al guardar cita. Intentando fallback a localStorage...', error);
  }

  // 2. Fallback a localStorage
  const agendaWithDate = {
    ...agenda,
    creadoEl: agenda.creadoEl || new Date().toISOString(),
  };

  try {
    localStorage.setItem('susfinanzas_agenda', JSON.stringify(agendaWithDate));
    return { success: true, source: 'local' };
  } catch (error) {
    console.error('Error al guardar agenda en localStorage:', error);
    return { success: false, source: 'local', error };
  }
}

/**
 * Sube un archivo (Desactivado).
 */
export async function uploadFileToFirebase(file: File, fileName: string): Promise<string | null> {
  console.log('Firebase Storage no disponible.');
  return null;
}

/**
 * Convierte un objeto File a una cadena codificada en Base64.
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Obtiene todos los leads cargados en Neon DB (vía API local) o en localStorage como respaldo.
 */
export async function getLeadsFromFirebase(): Promise<Lead[]> {
  // 1. Intentar consultar Neon DB vía API
  try {
    const response = await fetch('/api/leads');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Neon DB no disponible. Consultando leads de localStorage...', error);
  }

  // 2. Fallback a localStorage
  try {
    const localLeads = JSON.parse(localStorage.getItem('susfinanzas_leads') || '[]');
    return [...localLeads].reverse();
  } catch (error) {
    console.error('Error al obtener leads de localStorage:', error);
    return [];
  }
}

/**
 * Obtiene el PDF en Base64 de un lead leyendo de la API (Neon DB).
 */
export async function getLeadPdfFromFirebase(leadId: string): Promise<string> {
  const isNumericId = /^\d+$/.test(leadId);
  
  if (isNumericId) {
    try {
      const response = await fetch(`/api/leads/${leadId}/pdf`);
      if (response.ok) {
        const data = await response.json();
        return data.pdfBase64 || '';
      }
    } catch (error) {
      console.error('Error al obtener el PDF de Neon DB (API):', error);
    }
  }
  return '';
}

/**
 * Obtiene todas las citas agendadas de Neon DB (vía API) o de localStorage como respaldo.
 */
export async function getAgendasFromFirebase(): Promise<Agenda[]> {
  // 1. Intentar consultar Neon DB vía API
  try {
    const response = await fetch('/api/agendas');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Neon DB no disponible. Consultando agendas de localStorage...', error);
  }

  // 2. Fallback a localStorage
  try {
    const localAgenda = localStorage.getItem('susfinanzas_agenda');
    return localAgenda ? [JSON.parse(localAgenda)] : [];
  } catch (error) {
    console.error('Error al obtener agendas de localStorage:', error);
    return [];
  }
}

/**
 * Elimina un lead de la base de datos (Postgres API) y de localStorage.
 */
export async function deleteLeadFromFirebase(leadId: string): Promise<boolean> {
  let apiSuccess = false;
  
  // 1. Intentar borrar en Postgres
  const isNumericId = /^\d+$/.test(leadId);
  if (isNumericId) {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        apiSuccess = true;
      }
    } catch (error) {
      console.error('Error al borrar lead en Neon DB (API):', error);
    }
  }

  // 2. Borrado local en localStorage
  try {
    const localLeads = JSON.parse(localStorage.getItem('susfinanzas_leads') || '[]');
    const filtered = localLeads.filter((l: any) => l.id !== leadId && String(l.id) !== leadId);
    localStorage.setItem('susfinanzas_leads', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error al borrar lead en localStorage:', error);
    return apiSuccess;
  }
}

/**
 * Actualiza el estado de un lead en la base de datos (Postgres API) y en localStorage.
 */
export async function updateLeadStatusInFirebase(leadId: string, estado: string): Promise<boolean> {
  let apiSuccess = false;
  
  // 1. Intentar actualizar en Postgres
  const isNumericId = /^\d+$/.test(leadId);
  if (isNumericId) {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      });
      if (response.ok) {
        apiSuccess = true;
      }
    } catch (error) {
      console.error('Error al actualizar estado de lead en Neon DB (API):', error);
    }
  }

  // 2. LocalStorage update
  try {
    const localLeads = JSON.parse(localStorage.getItem('susfinanzas_leads') || '[]');
    const updated = localLeads.map((l: any) => {
      if (l.id === leadId || String(l.id) === leadId) {
        return { ...l, estado };
      }
      return l;
    });
    localStorage.setItem('susfinanzas_leads', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error al actualizar estado de lead en localStorage:', error);
    return apiSuccess;
  }
}

/**
 * Elimina una cita agendada de la base de datos (Postgres API) y de localStorage.
 */
export async function deleteAgendaFromFirebase(agendaId: string): Promise<boolean> {
  let apiSuccess = false;
  
  // 1. Intentar borrar en Postgres
  const isNumericId = /^\d+$/.test(agendaId);
  if (isNumericId) {
    try {
      const response = await fetch(`/api/agendas/${agendaId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        apiSuccess = true;
      }
    } catch (error) {
      console.error('Error al borrar agenda en Neon DB (API):', error);
    }
  }

  // 2. Borrar en localStorage
  try {
    localStorage.removeItem('susfinanzas_agenda');
    return true;
  } catch (error) {
    console.error('Error al borrar agenda en localStorage:', error);
    return apiSuccess;
  }
}

/**
 * Actualiza el estado de una cita agendada en la base de datos (Postgres API) y de localStorage.
 */
export async function updateAgendaStatusInFirebase(agendaId: string, estado: string): Promise<boolean> {
  let apiSuccess = false;
  
  // 1. Intentar actualizar en Postgres
  const isNumericId = /^\d+$/.test(agendaId);
  if (isNumericId) {
    try {
      const response = await fetch(`/api/agendas/${agendaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      });
      if (response.ok) {
        apiSuccess = true;
      }
    } catch (error) {
      console.error('Error al actualizar estado de agenda en Neon DB (API):', error);
    }
  }

  // 2. Actualizar en localStorage
  try {
    const localAgenda = localStorage.getItem('susfinanzas_agenda');
    if (localAgenda) {
      const agenda = JSON.parse(localAgenda);
      agenda.estado = estado;
      localStorage.setItem('susfinanzas_agenda', JSON.stringify(agenda));
    }
    return true;
  } catch (error) {
    console.error('Error al actualizar estado de agenda en localStorage:', error);
    return apiSuccess;
  }
}
