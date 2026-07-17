'use strict';

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  getLeadsFromFirebase,
  getAgendasFromFirebase,
  getLeadPdfFromFirebase,
  Lead,
  Agenda,
  deleteLeadFromFirebase,
  updateLeadStatusInFirebase,
  deleteAgendaFromFirebase,
  updateAgendaStatusInFirebase
} from '../../lib/firebase/client';
import { formatCurrency, simularReduccionCredito } from '../../lib/calculosFinancieros';
import {
  ShieldAlert,
  Users,
  FileText,
  Calendar,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  LogOut,
  User,
  Phone,
  Mail,
  Landmark,
  BadgeDollarSign,
  Lock,
  Menu,
  Clock,
  Trash2
} from 'lucide-react';
import ButtonPulse from '../../components/ui/ButtonPulse';
import Card3D from '../../components/ui/Card3D';

/* ──────────────────────────────────────────────────────────
   ESTILOS DE DISEÑO
   ────────────────────────────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: '16px',
  border: '1px solid var(--border-light)',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  transition: 'var(--transition-smooth)',
};

const badgeStyle = (type: string): React.CSSProperties => {
  const isVIS = type.toLowerCase().includes('vis');
  return {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    background: isVIS ? 'rgba(34, 197, 94, 0.08)' : 'rgba(59, 130, 246, 0.08)',
    color: isVIS ? '#16a34a' : 'var(--accent-blue)',
    display: 'inline-block',
  };
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '6px',
  fontSize: '13px',
  alignItems: 'center',
};

const openBase64PDF = (base64String: string, clientName: string) => {
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(
      `<html>
        <head>
          <title>Extracto - ${clientName}</title>
          <style>body{margin:0;padding:0;background:#333;overflow:hidden;}</style>
        </head>
        <body>
          <iframe src="${base64String}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>
        </body>
      </html>`
    );
  }
};

const getStatusBadgeStyle = (estado: string): React.CSSProperties => {
  const status = estado || 'pendiente';
  let bg = 'rgba(245, 158, 11, 0.08)'; // yellow/orange
  let color = '#d97706';
  if (status === 'completado') {
    bg = 'rgba(34, 197, 94, 0.08)';
    color = '#16a34a';
  } else if (status === 'rechazado') {
    bg = 'rgba(239, 68, 68, 0.08)';
    color = '#ef4444';
  }
  return {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    background: bg,
    color: color,
    display: 'inline-block',
    textTransform: 'uppercase',
  };
};

/* ──────────────────────────────────────────────────────────
   PÁGINA PRINCIPAL ADMIN
   ────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'agendas'>('leads');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const [simDesembolso, setSimDesembolso] = useState<number | ''>('');
  const [simSaldo, setSimSaldo] = useState<number | ''>('');
  const [simPlazo, setSimPlazo] = useState<number | ''>('');
  const [simPagas, setSimPagas] = useState<number | ''>('');
  const [simCuota, setSimCuota] = useState<number | ''>('');
  const [simIngresos, setSimIngresos] = useState<number | ''>('');

  useEffect(() => {
    if (expandedLead) {
      const lead = leads.find(l => l.id === expandedLead);
      if (lead) {
        setSimDesembolso(lead.valorDesembolso !== undefined ? lead.valorDesembolso : '');
        setSimSaldo(lead.saldoCapital !== undefined ? lead.saldoCapital : '');
        setSimPlazo(lead.plazoTotalMeses !== undefined ? lead.plazoTotalMeses : '');
        setSimPagas(lead.cuotasPagas !== undefined ? lead.cuotasPagas : '');
        setSimCuota(lead.cuotaMensualCredito !== undefined ? lead.cuotaMensualCredito : '');
        setSimIngresos(lead.ingresos !== undefined ? lead.ingresos : '');
      }
    } else {
      setSimDesembolso('');
      setSimSaldo('');
      setSimPlazo('');
      setSimPagas('');
      setSimCuota('');
      setSimIngresos('');
    }
  }, [expandedLead, leads]);

  // Autenticación inicial y validación de expiración
  useEffect(() => {
    const token = sessionStorage.getItem('sf_admin_token');
    const expiry = sessionStorage.getItem('sf_admin_expiry');
    
    if (token === 'authed_2026' && expiry && Date.now() < parseInt(expiry, 10)) {
      setIsAuthed(true);
      fetchData();
    } else {
      // Limpiar datos huérfanos o expirados
      sessionStorage.removeItem('sf_admin_token');
      sessionStorage.removeItem('sf_admin_expiry');
    }
  }, []);

  // Control de expiración de sesión por inactividad (15 minutos)
  useEffect(() => {
    if (!isAuthed) return;

    const EXPIRY_TIME = 15 * 60 * 1000; // 15 minutos

    const resetTimer = () => {
      const now = Date.now();
      sessionStorage.setItem('sf_admin_expiry', (now + EXPIRY_TIME).toString());
    };

    // Inicializar el tiempo de expiración
    resetTimer();

    // Verificar expiración cada 10 segundos
    const checkInterval = setInterval(() => {
      const expiry = sessionStorage.getItem('sf_admin_expiry');
      if (expiry && Date.now() > parseInt(expiry, 10)) {
        handleLogout();
        alert('Tu sesión de administrador ha expirado por inactividad. Por seguridad, debes ingresar la contraseña de nuevo.');
      }
    }, 10000);

    // Escuchar interacciones para resetear el temporizador
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimer();
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(checkInterval);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthed]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAuthed(true);
        setAuthError('');
        sessionStorage.setItem('sf_admin_token', data.token || 'authed_2026');
        // Inicializar expiración
        sessionStorage.setItem('sf_admin_expiry', (Date.now() + 15 * 60 * 1000).toString());
        fetchData();
      } else {
        setAuthError(data.error || 'Contraseña incorrecta. Inténtalo nuevamente.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Error de red o del servidor al autenticar.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sf_admin_token');
    sessionStorage.removeItem('sf_admin_expiry');
    setIsAuthed(false);
    setLeads([]);
    setAgendas([]);
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const ok = await updateLeadStatusInFirebase(leadId, newStatus);
      if (ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, estado: newStatus } : l));
      } else {
        alert('Error al actualizar el estado del lead.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al actualizar el estado.');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este lead permanentemente? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const ok = await deleteLeadFromFirebase(leadId);
      if (ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (expandedLead === leadId) setExpandedLead(null);
      } else {
        alert('Error al eliminar el lead.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al eliminar el lead.');
    }
  };

  const handleUpdateAgendaStatus = async (agendaId: string, newStatus: string) => {
    try {
      const ok = await updateAgendaStatusInFirebase(agendaId, newStatus);
      if (ok) {
        setAgendas(prev => prev.map(a => a.id === agendaId ? { ...a, estado: newStatus } : a));
      } else {
        alert('Error al actualizar el estado de la cita.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al actualizar el estado.');
    }
  };

  const handleDeleteAgenda = async (agendaId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta cita permanentemente? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      const ok = await deleteAgendaFromFirebase(agendaId);
      if (ok) {
        setAgendas(prev => prev.filter(a => a.id !== agendaId));
      } else {
        alert('Error al eliminar la cita.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al eliminar la cita.');
    }
  };

  const leadStats = useMemo(() => {
    return {
      pendiente: leads.filter(l => (l.estado || 'pendiente') === 'pendiente').length,
      completado: leads.filter(l => l.estado === 'completado').length,
      rechazado: leads.filter(l => l.estado === 'rechazado').length,
    };
  }, [leads]);

  const agendaStats = useMemo(() => {
    return {
      pendiente: agendas.filter(a => (a.estado || 'pendiente') === 'pendiente').length,
      completado: agendas.filter(a => a.estado === 'completado').length,
      rechazado: agendas.filter(a => a.estado === 'rechazado').length,
    };
  }, [agendas]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedLeads = await getLeadsFromFirebase();
      const fetchedAgendas = await getAgendasFromFirebase();
      setLeads(fetchedLeads);
      setAgendas(fetchedAgendas);
    } catch (err) {
      console.error('Error cargando información de administración:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de leads por nombre/banco/celular y estado
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchText = searchTerm.toLowerCase();
      const matchesSearch = (
        lead.nombre.toLowerCase().includes(matchText) ||
        lead.banco.toLowerCase().includes(matchText) ||
        lead.celular.includes(matchText) ||
        lead.correo.toLowerCase().includes(matchText)
      );
      const matchesStatus = statusFilter === 'todos' || (lead.estado || 'pendiente') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Filtrado de citas y estado
  const filteredAgendas = useMemo(() => {
    return agendas.filter((agenda) => {
      const matchText = searchTerm.toLowerCase();
      const matchesSearch = (
        agenda.cliente.nombre.toLowerCase().includes(matchText) ||
        agenda.cliente.celular.includes(matchText) ||
        agenda.cliente.correo.toLowerCase().includes(matchText)
      );
      const matchesStatus = statusFilter === 'todos' || (agenda.estado || 'pendiente') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [agendas, searchTerm, statusFilter]);

  /* ════════════════════════════════════════════════════════
     LOGIN SCREEN
     ════════════════════════════════════════════════════════ */
  if (!isAuthed) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'radial-gradient(circle at 50% 50%, rgba(11, 19, 41, 0.02) 0%, transparent 60%)',
        }}
      >
        <Card3D variant="light" style={{ width: '100%', maxWidth: '420px', padding: '32px' }} tilt={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.08)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock size={32} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-dark)', margin: 0 }}>
                Williams<span style={{ color: 'var(--accent-blue)' }}>Cruz</span> Admin
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '6px' }}>
                Ingresa la contraseña maestra de seguridad para acceder al panel.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-medium)' }}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '16px',
                    outline: 'none',
                    textAlign: 'center',
                    letterSpacing: '2px',
                  }}
                  required
                />
              </div>

              {authError && (
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#ef4444' }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <ButtonPulse type="submit" variant="primary" pulse={true} style={{ width: '100%' }}>
                Ingresar al Panel
              </ButtonPulse>
            </form>
          </div>
        </Card3D>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     ADMIN DASHBOARD
     ════════════════════════════════════════════════════════ */
  return (
    <div style={{ padding: '40px 0', minHeight: '80vh', backgroundColor: '#fcfdfe' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Header Admin */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              Panel de Control de Asesoría
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-light)', marginTop: '4px', margin: 0 }}>
              Revisa los leads capturados en el simulador y las citas agendadas de Williams Cruz.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={fetchData}
              disabled={loading}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                background: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-medium)'
              }}
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Sincronizando...' : 'Sincronizar'}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                background: 'rgba(239, 68, 68, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ef4444'
              }}
            >
              <LogOut size={15} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Métrica Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          
          {/* Card Total Leads */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase' }}>Leads Totales</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', margin: '8px 0 0 0' }}>{leads.length}</h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', marginTop: '6px', color: 'var(--text-medium)', fontWeight: '600' }}>
                  <span style={{ color: '#d97706' }}>🕒 {leadStats.pendiente} Pend.</span>
                  <span style={{ color: '#16a34a' }}>✓ {leadStats.completado} Comp.</span>
                  <span style={{ color: '#ef4444' }}>✗ {leadStats.rechazado} Rech.</span>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent-blue)' }}><Users size={20} /></div>
            </div>
          </div>

          {/* Card PDF Cargados */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase' }}>Extractos PDF subidos</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', margin: '8px 0 0 0' }}>{leads.filter(l => l.extractoUrl || l.tienePdf || l.extractoBase64).length}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: '6px 0 0 0', fontWeight: '600' }}>
                  📂 Guardados en BD / Storage
                </p>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.08)', color: '#16a34a' }}><FileText size={20} /></div>
            </div>
          </div>

          {/* Card Citas Agendadas */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase' }}>Citas Agendadas</span>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', margin: '8px 0 0 0' }}>{agendas.length}</h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', marginTop: '6px', color: 'var(--text-medium)', fontWeight: '600' }}>
                  <span style={{ color: '#d97706' }}>🕒 {agendaStats.pendiente} Pend.</span>
                  <span style={{ color: '#16a34a' }}>✓ {agendaStats.completado} Comp.</span>
                  <span style={{ color: '#ef4444' }}>✗ {agendaStats.rechazado} Rech.</span>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.08)', color: 'var(--accent-yellow)' }}><Calendar size={20} /></div>
            </div>
          </div>
        </div>

        {/* Tabs & Buscador */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-light)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => { setActiveTab('leads'); setSearchTerm(''); setStatusFilter('todos'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'leads' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '13.5px',
                color: activeTab === 'leads' ? 'var(--primary-dark)' : 'var(--text-light)',
                cursor: 'pointer',
                boxShadow: activeTab === 'leads' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Leads del Simulador ({leads.length})
            </button>
            <button
              onClick={() => { setActiveTab('agendas'); setSearchTerm(''); setStatusFilter('todos'); }}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'agendas' ? '#ffffff' : 'transparent',
                fontWeight: '700',
                fontSize: '13.5px',
                color: activeTab === 'agendas' ? 'var(--primary-dark)' : 'var(--text-light)',
                cursor: 'pointer',
                boxShadow: activeTab === 'agendas' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                transition: 'var(--transition-smooth)'
              }}
            >
              Citas Agendadas ({agendas.length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '480px', flexWrap: 'wrap' }}>
            {/* Filtro de Estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                fontSize: '13.5px',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer',
                fontWeight: '600',
                color: 'var(--text-medium)'
              }}
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="completado">Completados</option>
              <option value="rechazado">Rechazados</option>
            </select>

            {/* Buscador */}
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder={activeTab === 'leads' ? 'Buscar lead por nombre, banco...' : 'Buscar cita por cliente...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  fontSize: '13.5px',
                  outline: 'none'
                }}
              />
              <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '12px' }}>
            <RefreshCw size={36} color="var(--accent-blue)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: '600' }}>Cargando información desde la base de datos...</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
           TAB: LEADS
           ═══════════════════════════════════════════════════ */}
        {!loading && activeTab === 'leads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px', color: 'var(--text-light)' }}>
                No se encontraron leads cargados que coincidan con la búsqueda.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isExpanded = expandedLead === lead.id;
                return (
                  <div key={lead.id} style={{ ...cardStyle, padding: '16px 20px', border: isExpanded ? '1px solid var(--accent-blue)' : '1px solid var(--border-light)' }}>
                    
                    {/* Fila Encabezado Lead */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>{lead.nombre}</strong>
                          <span style={badgeStyle(lead.tipoSociedad)}>{lead.tipoSociedad}</span>
                          <span style={getStatusBadgeStyle(lead.estado || 'pendiente')}>{lead.estado || 'pendiente'}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', gap: '12px' }}>
                          <span>🏦 {lead.banco}</span>
                          <span>Deuda: <strong>{lead.montoDeuda}</strong></span>
                          <span>📅 {lead.fecha ? new Date(lead.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                        </div>
                      </div>

                      {/* Botones de acción rápidos */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        
                        {/* Selector de Estado */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>Estado:</span>
                          <select
                            value={lead.estado || 'pendiente'}
                            onChange={(e) => handleUpdateLeadStatus(lead.id!, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-light)',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--text-medium)',
                              background: '#ffffff',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="completado">Completado</option>
                            <option value="rechazado">Rechazado</option>
                          </select>
                        </div>

                        {lead.extractoUrl ? (
                          <a
                            href={lead.extractoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: 'rgba(34, 197, 94, 0.08)',
                              color: '#16a34a',
                              fontSize: '12px',
                              fontWeight: '700',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FileText size={14} /> Ver PDF <ExternalLink size={11} />
                          </a>
                        ) : (lead.tienePdf || lead.extractoBase64) ? (
                          <button
                            onClick={async (e) => {
                              const btn = e.currentTarget;
                              const originalText = btn.innerHTML;
                              btn.disabled = true;
                              btn.innerHTML = '<span style="font-size:11px;font-weight:normal">Cargando...</span>';
                              try {
                                const pdfBase64 = lead.extractoBase64 || await getLeadPdfFromFirebase(lead.id!);
                                if (pdfBase64) {
                                  openBase64PDF(pdfBase64, lead.nombre);
                                } else {
                                  alert('No se pudo cargar el archivo PDF del servidor.');
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Error al recuperar el archivo PDF.');
                              } finally {
                                btn.disabled = false;
                                btn.innerHTML = originalText;
                              }
                            }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: 'rgba(59, 130, 246, 0.08)',
                              color: 'var(--accent-blue)',
                              fontSize: '12px',
                              fontWeight: '700',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FileText size={14} /> Ver PDF <ExternalLink size={11} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', padding: '6px 10px', background: 'var(--bg-light)', borderRadius: '6px' }}>Sin PDF</span>
                        )}
                        <button
                          onClick={() => setExpandedLead(isExpanded ? null : (lead.id || null))}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            color: 'var(--text-medium)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        
                        {/* Botón Borrar Lead */}
                        <button
                          onClick={() => handleDeleteLead(lead.id!)}
                          title="Eliminar Lead"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Fila Detalles Extendida */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '16px', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        
                        {/* Datos de contacto */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Información de Contacto</h4>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
                            <Phone size={15} color="var(--text-light)" />
                            <a href={`https://wa.me/57${lead.celular.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none' }}>
                              {lead.celular} <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-light)' }}>(Abrir WhatsApp)</span>
                            </a>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
                            <Mail size={15} color="var(--text-light)" />
                            <a href={`mailto:${lead.correo}`} style={{ color: 'var(--text-medium)', textDecoration: 'none' }}>
                              {lead.correo}
                            </a>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
                            <User size={15} color="var(--text-light)" />
                            <span style={{ color: 'var(--text-medium)' }}>Contacto: {lead.nombre}</span>
                          </div>

                          {lead.tieneFRECH && (
                            <div style={{ background: 'rgba(34, 197, 94, 0.04)', padding: '12px', borderRadius: '8px', marginTop: '12px', fontSize: '12px', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                              🏛️ <strong>Subsidio FRECH Registrado:</strong>
                              <div style={{ marginTop: '4px' }}>• Cuota FRECH: {formatCurrency(lead.cuotaMensualFRECH || 0)}</div>
                              <div>• Cuotas Pagadas FRECH: {lead.cuotasSubsidiadasPagas || 0}</div>
                            </div>
                          )}
                        </div>

                        {/* Simulador / Inputs de Carga de Datos */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                          <h4 style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--primary-dark)', textTransform: 'uppercase', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ⚙️ Simulador Cuota Inteligente
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Desembolso Original ($)</label>
                              <input 
                                type="number" 
                                value={simDesembolso} 
                                onChange={(e) => setSimDesembolso(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 150000000"
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Saldo Capital ($)</label>
                              <input 
                                type="number" 
                                value={simSaldo} 
                                onChange={(e) => setSimSaldo(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 130000000"
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Plazo Total (meses)</label>
                              <input 
                                type="number" 
                                value={simPlazo} 
                                onChange={(e) => setSimPlazo(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 240"
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Cuotas Pagadas (meses)</label>
                              <input 
                                type="number" 
                                value={simPagas} 
                                onChange={(e) => setSimPagas(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 36"
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Cuota Mensual ($)</label>
                              <input 
                                type="number" 
                                value={simCuota} 
                                onChange={(e) => setSimCuota(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 1850000"
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-medium)' }}>Ingresos Cliente ($)</label>
                              <input 
                                type="number" 
                                value={simIngresos} 
                                onChange={(e) => setSimIngresos(e.target.value === '' ? '' : Number(e.target.value))} 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', outline: 'none' }}
                                placeholder="Ej: 3500000"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Propuesta de Cuota Inteligente calculada en el Panel */}
                        {simDesembolso !== '' && simSaldo !== '' && simCuota !== '' && simPlazo !== '' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(59, 130, 246, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)', gridColumn: 'span 2', marginTop: '8px' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, textTransform: 'uppercase' }}>
                              <BadgeDollarSign size={18} color="var(--accent-yellow)" /> Propuesta de Cuota Inteligente (Ley 546)
                            </h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>
                              Simulación del potencial de ahorro e incremento de cuota calculada en tiempo real para el lead.
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                              {[
                                { label: 'Moderado (15% abono)', pct: 0.15 },
                                { label: 'Recomendado (25% abono)', pct: 0.25 },
                                { label: 'Acelerado (35% abono)', pct: 0.35 },
                              ].map((esc, i) => {
                                const currentCuota = Number(simCuota) || 0;
                                const currentSaldo = Number(simSaldo) || 0;
                                const totalMeses = Number(simPlazo) || 0;
                                const pagas = Number(simPagas) || 0;
                                const tiempoPendiente = Math.max(12, totalMeses - pagas);

                                const abono = Math.round((currentCuota * esc.pct) / 5000) * 5000;
                                const nuevaCuota = currentCuota + abono;

                                const resultado = simularReduccionCredito({
                                  saldoPendiente: currentSaldo,
                                  tasaInteresEA: 14.0, // tasa estándar de simulación
                                  plazoRestanteMeses: tiempoPendiente,
                                  cuotaActualPura: currentCuota,
                                  abonoMensualAdicional: abono,
                                });

                                const ingresoFinal = nuevaCuota / 0.3;

                                return (
                                  <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                                      {esc.label}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                                      <div style={rowStyle}><span style={{ color: 'var(--text-light)' }}>Abono Extra</span><strong style={{ color: '#b45309' }}>+{formatCurrency(abono)}</strong></div>
                                      <div style={rowStyle}><span style={{ color: 'var(--text-light)' }}>Nueva Cuota</span><strong>{formatCurrency(nuevaCuota)}</strong></div>
                                      <div style={{ ...rowStyle, borderTop: '1px solid #f3f4f6', paddingTop: '6px', marginTop: '2px' }}><span style={{ color: 'var(--text-light)', fontWeight: '600' }}>Ahorro Intereses</span><strong style={{ color: '#16a34a' }}>{formatCurrency(resultado.ahorroIntereses)}</strong></div>
                                      <div style={rowStyle}><span style={{ color: 'var(--text-light)' }}>Plazo Reducido</span><strong style={{ color: '#b45309' }}>-{(resultado.mesesAhorrados / 12).toFixed(1)} años</strong></div>
                                      <div style={rowStyle}><span style={{ color: 'var(--text-light)' }}>Nuevo Plazo</span><strong>{(resultado.plazoNuevoMeses / 12).toFixed(1)} años</strong></div>
                                      <div style={{ ...rowStyle, borderTop: '1px solid #f3f4f6', paddingTop: '6px', marginTop: '2px' }}><span style={{ color: 'var(--text-light)', fontSize: '11px' }}>Ingreso Necesario</span><strong style={{ color: 'var(--accent-blue)' }}>{formatCurrency(ingresoFinal)}</strong></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div style={{ gridColumn: 'span 2', background: 'rgba(245, 158, 11, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)', textAlign: 'center', fontSize: '13px', color: '#b45309', fontWeight: '500' }}>
                            ⚠️ Ingresa los valores del crédito en la sección de simulador de la derecha para calcular la Propuesta de Cuota Inteligente en tiempo real.
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
           TAB: CITAS AGENDADAS
           ═══════════════════════════════════════════════════ */}
        {!loading && activeTab === 'agendas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredAgendas.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px', color: 'var(--text-light)' }}>
                No se encontraron citas agendadas que coincidan con la búsqueda.
              </div>
            ) : (
              filteredAgendas.map((agenda) => (
                <div key={agenda.id} style={{ ...cardStyle, padding: '18px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          background: 'rgba(245, 158, 11, 0.08)',
                          color: 'var(--accent-yellow)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Clock size={22} />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '16px', color: 'var(--primary-dark)' }}>{agenda.cliente.nombre}</strong>
                          <span style={{ padding: '2px 8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#b45309', fontSize: '11px', fontWeight: '700' }}>Cita Agendada</span>
                          <span style={getStatusBadgeStyle(agenda.estado || 'pendiente')}>{agenda.estado || 'pendiente'}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-light)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={13} /> {agenda.cliente.celular}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={13} /> {agenda.cliente.correo}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--primary-dark)' }}>
                          {new Date(agenda.fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>
                          Hora: {agenda.hora}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>
                          Creado el: {agenda.creadoEl ? new Date(agenda.creadoEl).toLocaleDateString('es-CO') : '—'}
                        </span>
                      </div>

                      {/* Controles de Cita */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                        {/* Selector de Estado */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>Estado:</span>
                          <select
                            value={agenda.estado || 'pendiente'}
                            onChange={(e) => handleUpdateAgendaStatus(agenda.id!, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-light)',
                              fontSize: '11px',
                              fontWeight: '600',
                              color: 'var(--text-medium)',
                              background: '#ffffff',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="completado">Completado</option>
                            <option value="rechazado">Rechazado</option>
                          </select>
                        </div>

                        {/* Botón Borrar Cita */}
                        <button
                          onClick={() => handleDeleteAgenda(agenda.id!)}
                          title="Eliminar Cita"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
