'use strict';

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../lib/calculosFinancieros';
import Card3D from '../ui/Card3D';
import ButtonPulse from '../ui/ButtonPulse';
import { saveLeadToFirebase, fileToBase64 } from '../../lib/firebase/client';
import {
  Building,
  DollarSign,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  FileCheck,
  CreditCard,
  User,
  Upload,
  FileText,
  Trash2,
  Mail,
  Phone,
  Lock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Clock,
  ArrowLeft,
  FileImage,
  Info,
  CheckCircle,
  Zap
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   ESTILOS REUTILIZABLES
   ────────────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border-light)',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#ffffff',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--primary-dark)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const fieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const BANCOS_LIST = [
  'Bancolombia',
  'Davivienda',
  'Banco de Bogotá',
  'Banco Caja Social',
  'Scotiabank Colpatria',
  'FNA (Fondo Nacional del Ahorro)',
  'Banco AV Villas',
  'Banco de Occidente',
  'Banco Popular',
  'Bancoomeva',
  'BBVA Colombia',
  'La Hipotecaria',
  'Otro Banco / Entidad'
];

const TIPOS_CREDITO = [
  'Crédito Hipotecario (Pesos)',
  'Crédito en UVR (Deseo pasar a Pesos)',
  'Leasing Habitacional',
  'Crédito Vivienda VIS',
  'Crédito Vivienda No VIS'
];

export default function SimuladorAhorro() {
  // Pestaña activa: 'evaluar' (Pre-diagnóstico con duda) o 'upload' (Subir extracto directo)
  const [activeTab, setActiveTab] = useState<'evaluar' | 'upload'>('evaluar');

  // Estado del flujo: 'setup' -> 'teaser' -> 'success'
  const [viewState, setViewState] = useState<'setup' | 'teaser' | 'success'>('setup');

  // Datos del crédito
  const [banco, setBanco] = useState('Bancolombia');
  const [tipoCredito, setTipoCredito] = useState('Crédito Hipotecario (Pesos)');
  const [saldoCapital, setSaldoCapital] = useState<number | ''>('');
  const [cuotaMensual, setCuotaMensual] = useState<number | ''>('');
  const [plazoAnos, setPlazoAnos] = useState<number | ''>('');
  const [cuotasPagasAnos, setCuotasPagasAnos] = useState<number | ''>('');
  const [abonoDeseado, setAbonoDeseado] = useState('$200.000 a $400.000 / mes');

  // Datos de contacto
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [noTieneExtractoAhora, setNoTieneExtractoAhora] = useState(false);

  // Archivo de extracto (PDF o imagen)
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados UI
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejo de archivo (PDF, JPG, PNG, WEBP)
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const isPdfOrImage = validTypes.includes(selectedFile.type) ||
      /\.(pdf|jpe?g|png|webp)$/i.test(selectedFile.name);

    if (!isPdfOrImage) {
      alert('Por favor selecciona únicamente archivos en formato PDF o imágenes (JPG, PNG).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      alert('El archivo supera el tamaño máximo permitido de 15 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    setNoTieneExtractoAhora(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // 1. Envío inicial de viabilidad: Lleva a la pantalla teaser que deja con la duda
  const handleEvaluarViabilidad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saldoCapital || Number(saldoCapital) <= 0) {
      alert('Por favor ingresa un saldo de capital aproximado para evaluar tu crédito.');
      return;
    }
    setViewState('teaser');
  };

  // 2. Envío Final: Guarda el lead y el extracto en Neon DB / localStorage
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !celular.trim() || !email.trim()) {
      alert('Por favor completa todos los campos de contacto obligatorios.');
      return;
    }

    if (!file && !noTieneExtractoAhora) {
      alert('Por favor adjunta tu extracto bancario (PDF o imagen), o marca la casilla indicando que requieres asesoría para descargarlo.');
      return;
    }

    setIsSubmitting(true);

    try {
      let extractoBase64 = '';
      if (file) {
        try {
          extractoBase64 = await fileToBase64(file);
        } catch (err) {
          console.warn('No se pudo convertir el archivo a Base64:', err);
        }
      }

      await saveLeadToFirebase({
        tipoSociedad: tipoCredito,
        banco,
        modalidad: file
          ? `Auditoría con Extracto (${abonoDeseado})`
          : `Solicitud de Asesoría para Extracto (${abonoDeseado})`,
        montoDeuda: saldoCapital ? formatCurrency(Number(saldoCapital)) : 'Pendiente según extracto',
        nombre: nombre.trim(),
        celular: celular.trim(),
        correo: email.trim(),
        extractoBase64: extractoBase64 || undefined,
        saldoCapital: saldoCapital ? Number(saldoCapital) : undefined,
        cuotaMensualCredito: cuotaMensual ? Number(cuotaMensual) : undefined,
        plazoTotalMeses: plazoAnos ? Number(plazoAnos) * 12 : undefined,
        cuotasPagas: cuotasPagasAnos ? Number(cuotasPagasAnos) * 12 : undefined,
        abonoInteligente: abonoDeseado,
        estado: 'pendiente'
      });

      setIsSubmitting(false);
      setViewState('success');
    } catch (error) {
      console.error('Error durante el envío del extracto:', error);
      alert('Ocurrió un error al procesar tu solicitud. Por favor inténtalo de nuevo o contáctanos directamente por WhatsApp.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>

      {/* Selector de Pestañas Superiores */}
      {viewState !== 'success' && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('evaluar'); setViewState('setup'); }}
            style={{
              flex: '1 1 280px',
              maxWidth: '380px',
              padding: '14px 20px',
              borderRadius: '16px',
              border: activeTab === 'evaluar' ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
              background: activeTab === 'evaluar' ? 'rgba(59, 130, 246, 0.08)' : '#ffffff',
              color: activeTab === 'evaluar' ? 'var(--accent-blue)' : 'var(--text-medium)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: activeTab === 'evaluar' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Sparkles size={18} color={activeTab === 'evaluar' ? 'var(--accent-blue)' : 'var(--text-light)'} />
            <span>1. Diagnóstico de Viabilidad Ley 546</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setViewState('setup'); }}
            style={{
              flex: '1 1 280px',
              maxWidth: '380px',
              padding: '14px 20px',
              borderRadius: '16px',
              border: activeTab === 'upload' ? '2px solid #16a34a' : '1px solid var(--border-light)',
              background: activeTab === 'upload' ? 'rgba(34, 197, 94, 0.08)' : '#ffffff',
              color: activeTab === 'upload' ? '#16a34a' : 'var(--text-medium)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: activeTab === 'upload' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Upload size={18} color={activeTab === 'upload' ? '#16a34a' : 'var(--text-light)'} />
            <span>2. Tengo mi Extracto Listo (Auditoría Directa)</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ========================================================
            TAB 1: DIAGNÓSTICO DE VIABILIDAD - PASO 1 (CONFIGURACIÓN INICIAL)
           ======================================================== */}
        {activeTab === 'evaluar' && viewState === 'setup' && (
          <motion.div
            key="tab-evaluar-setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card3D variant="light" className="shadow-lg" tilt={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Header de la tarjeta */}
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '18px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.08)', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800', color: 'var(--accent-blue)', marginBottom: '8px' }}>
                    <ShieldCheck size={16} /> Auditoría Financiera y Legal Amparada en la Ley 546 de 1999
                  </div>
                  <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary-dark)', margin: '4px 0' }}>
                    ¿Cuánto Dinero y Tiempo Puedes Ahorrar en Tu Crédito?
                  </h2>
                  <p style={{ color: 'var(--text-medium)', fontSize: '14.5px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.5' }}>
                    Ingresa los datos generales de tu crédito de vivienda para comprobar si cumples los requisitos de ley para recortar años de deuda sin cambiar de banco.
                  </p>
                </div>

                <form onSubmit={handleEvaluarViabilidad} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                  
                  {/* Banco */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Building size={15} color="var(--accent-blue)" /> Banco de tu crédito*</label>
                    <select value={banco} onChange={(e) => setBanco(e.target.value)} style={inputStyle} required>
                      {BANCOS_LIST.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de crédito */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><CreditCard size={15} color="var(--accent-blue)" /> Modalidad actual*</label>
                    <select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)} style={inputStyle} required>
                      {TIPOS_CREDITO.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Saldo de Capital */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} color="#16a34a" /> Saldo aproximado de capital ($)*</label>
                    <input
                      type="number"
                      value={saldoCapital}
                      onChange={(e) => setSaldoCapital(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 130000000"
                      style={inputStyle}
                      min={5000000}
                      required
                    />
                    {/* Botones de sugerencia rápida */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                      {[80000000, 140000000, 220000000, 350000000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSaldoCapital(val)}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: saldoCapital === val ? 'var(--accent-blue)' : '#f8fafc',
                            color: saldoCapital === val ? '#ffffff' : 'var(--text-medium)',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          {val >= 1000000 ? `$${val / 1000000}M` : `$${val}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuota mensual aproximada */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} color="#16a34a" /> Cuota mensual actual ($)*</label>
                    <input
                      type="number"
                      value={cuotaMensual}
                      onChange={(e) => setCuotaMensual(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 1650000"
                      style={inputStyle}
                      min={100000}
                      required
                    />
                  </div>

                  {/* Plazo inicial en años */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Calendar size={15} color="var(--accent-yellow)" /> Plazo pactado inicial (Años)*</label>
                    <input
                      type="number"
                      value={plazoAnos}
                      onChange={(e) => setPlazoAnos(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 20"
                      style={inputStyle}
                      min={1}
                      max={30}
                      required
                    />
                  </div>

                  {/* Años ya pagados */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Clock size={15} color="var(--accent-yellow)" /> Años que llevas pagando*</label>
                    <input
                      type="number"
                      value={cuotasPagasAnos}
                      onChange={(e) => setCuotasPagasAnos(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 3"
                      style={inputStyle}
                      min={0}
                      max={25}
                      required
                    />
                  </div>

                  {/* Abono Inteligente deseado */}
                  <div style={{ ...fieldGroup, gridColumn: 'span 2' }}>
                    <label style={labelStyle}>
                      <TrendingUp size={15} color="var(--accent-blue)" /> ¿Cuánto podrías aumentarle a tu cuota para abonar directo a capital?
                    </label>
                    <select
                      value={abonoDeseado}
                      onChange={(e) => setAbonoDeseado(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="$100.000 a $200.000 / mes">$100.000 a $200.000 adicionales al mes (Abono moderado — reduce entre 3 y 5 años)</option>
                      <option value="$200.000 a $400.000 / mes">$200.000 a $400.000 adicionales al mes (Abono recomendado — reduce entre 5 y 8 años)</option>
                      <option value="$400.000 a $700.000 / mes">$400.000 a $700.000 adicionales al mes (Abono acelerado — reduce entre 7 y 11 años)</option>
                      <option value="Más de $700.000 / mes">Más de $700.000 adicionales al mes (Abono máximo — mayor ahorro en intereses)</option>
                      <option value="El menor valor posible">Quiero evaluar con el menor incremento posible</option>
                    </select>
                  </div>

                  {/* Mensaje de Garantía */}
                  <div style={{ gridColumn: 'span 2', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', padding: '14px 16px', borderRadius: '12px', fontSize: '13px', color: 'var(--text-medium)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ShieldCheck size={22} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Estudio 100% Gratuito y sin Anticipos:</strong> Williams Cruz evalúa tu caso bajo la Ley de Vivienda. Si tu crédito no califica o el banco no aprueba la reducción, no pagas un solo peso.
                    </div>
                  </div>

                  {/* Botón Submit */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                    <ButtonPulse type="submit" variant="primary" pulse={true} style={{ width: '100%', padding: '16px 24px', fontSize: '15px' }}>
                      Comprobar Viabilidad y Potencial de Ahorro <ArrowRight size={18} />
                    </ButtonPulse>
                  </div>
                </form>

              </div>
            </Card3D>
          </motion.div>
        )}

        {/* ========================================================
            TAB 1: PANTALLA TEASER ("DEJAR CON LA DUDA" + CAPTURA DE LEAD Y EXTRACTO)
           ======================================================== */}
        {activeTab === 'evaluar' && viewState === 'teaser' && (
          <motion.div
            key="tab-evaluar-teaser"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <Card3D variant="light" className="shadow-xl" tilt={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '10px' }}>
                
                {/* Banner Resultado Preliminar */}
                <div style={{ background: 'linear-gradient(135deg, #0b1329 0%, #1e293b 100%)', color: '#ffffff', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#22c55e', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800', marginBottom: '12px' }}>
                    <CheckCircle2 size={16} /> ¡Crédito con {banco} Viable para Reducción!
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', marginBottom: '8px' }}>
                    Alto Potencial de Ahorro Detectado
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.5' }}>
                    Tu crédito con saldo aproximado de <strong style={{ color: 'var(--accent-yellow-bright)' }}>{saldoCapital ? formatCurrency(Number(saldoCapital)) : ''}</strong> califica bajo la Ley 546 de 1999 para recortar sustancialmente años de cuotas e intereses sin cambiar de banco.
                  </p>
                </div>

                {/* Tarjetas de Cifras con Candado (Genera la Duda) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  
                  {/* Tarjeta 1: Años a Reducir */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Plazo Reducible Estimado
                    </span>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary-dark)', margin: '10px 0' }}>
                      Entre 4 y 10 Años
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '8px' }}>
                      <Lock size={13} /> Cifra exacta según tu extracto
                    </div>
                  </div>

                  {/* Tarjeta 2: Ahorro en Intereses */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Ahorro Proyectado en Intereses
                    </span>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#16a34a', margin: '10px 0' }}>
                      Decenas de Millones
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '8px' }}>
                      <Lock size={13} /> Requiere auditoría de seguros
                    </div>
                  </div>

                  {/* Tarjeta 3: Nueva Cuota Optimizada */}
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#9333ea', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Propuesta de Cuota Legal
                    </span>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary-dark)', margin: '10px 0' }}>
                      Cuota Inteligente
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', color: '#d97706', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '8px' }}>
                      <Lock size={13} /> Adaptada a tu capacidad de pago
                    </div>
                  </div>

                </div>

                {/* Explicación de Seguridad: ¿Por qué no damos una cifra automática? */}
                <div style={{ background: '#fffbeb', border: '1px solid #fef08a', borderRadius: '14px', padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '13.5px', color: '#92400e', lineHeight: '1.6' }}>
                    <strong style={{ fontSize: '14.5px', display: 'block', marginBottom: '4px', color: '#78350f' }}>
                      ⚠️ ¿Por qué las cifras exactas están protegidas y no en un simulador automático?
                    </strong>
                    Los simuladores genéricos de internet inducen a errores graves porque <strong>no conocen los cobros mensuales de seguros obligatorios (vida, incendio, terremoto)</strong> ni la fórmula de liquidación exacta de tu banco ({banco}).
                    <br /><br />
                    Bajo la <strong>Ley 546 de 1999</strong>, una propuesta financiera mal calculada ante el banco será rechazada. Para garantizar tu ahorro con aprobación legal en tu extracto, <strong>Williams Cruz</strong> audita directamente tu extracto bancario oficial sin costo alguno.
                  </div>
                </div>

                {/* Formulario de Captura de Lead y Extracto */}
                <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  
                  <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-dark)', margin: '0 0 6px 0' }}>
                      Desbloquea tu Estudio Oficial de Reducción
                    </h4>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', margin: 0 }}>
                      Déjanos tus datos de contacto y adjunta tu extracto para que Williams Cruz te entregue tu propuesta formal de ahorro.
                    </p>
                  </div>

                  {/* Campos de Contacto */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ ...fieldGroup, gridColumn: 'span 2' }}>
                      <label style={labelStyle}><User size={15} color="var(--accent-blue)" /> Tu Nombre Completo (Titular del crédito)*</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Carlos Alberto Gómez"
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div style={fieldGroup}>
                      <label style={labelStyle}><Phone size={15} color="#16a34a" /> WhatsApp / Celular*</label>
                      <input
                        type="tel"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        placeholder="Ej: 316 977 3057"
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div style={fieldGroup}>
                      <label style={labelStyle}><Mail size={15} color="var(--accent-blue)" /> Correo Electrónico*</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej: carlos@gmail.com"
                        style={inputStyle}
                        required
                      />
                    </div>
                  </div>

                  {/* Área de Carga de Extracto Bancario */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}>
                      <FileText size={16} color="var(--accent-blue)" /> Adjuntar Extracto Bancario Más Reciente (PDF o Imagen)
                    </label>

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: dragOver ? '2px dashed var(--accent-blue)' : '2px dashed #cbd5e1',
                        borderRadius: '14px',
                        padding: '22px 18px',
                        textAlign: 'center',
                        background: dragOver ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                        style={{ display: 'none' }}
                      />
                      
                      {!file ? (
                        <>
                          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                            <Upload size={22} />
                          </div>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-dark)', display: 'block' }}>
                              Haz clic para seleccionar tu extracto o arrástralo aquí
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px', display: 'block' }}>
                              Formatos permitidos: PDF o fotos claras (JPG, PNG) • Máximo 15 MB
                            </span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)' }} onClick={(e) => e.stopPropagation()}>
                          {file.type === 'application/pdf' ? (
                            <FileText size={28} color="#ef4444" style={{ flexShrink: 0 }} />
                          ) : (
                            <FileImage size={28} color="#3b82f6" style={{ flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                            <strong style={{ fontSize: '13.5px', color: 'var(--primary-dark)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-light)' }}>
                              {(file.size / (1024 * 1024)).toFixed(2)} MB • Extracto listo para auditoría
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444' }}
                            title="Eliminar archivo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Checkbox alternativo: Si no tiene el extracto a mano */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                      <input
                        type="checkbox"
                        id="no-tiene-extracto-teaser"
                        checked={noTieneExtractoAhora}
                        onChange={(e) => {
                          setNoTieneExtractoAhora(e.target.checked);
                          if (e.target.checked) setFile(null);
                        }}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                      />
                      <label htmlFor="no-tiene-extracto-teaser" style={{ fontSize: '12.5px', color: 'var(--text-medium)', cursor: 'pointer' }}>
                        No tengo el extracto a la mano. Deseo que Williams Cruz me contacte por WhatsApp y me ayude a descargarlo de la app de mi banco.
                      </label>
                    </div>
                  </div>

                  {/* Términos y Autorización */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '4px' }}>
                    <input
                      type="checkbox"
                      id="acepta-terminos-teaser"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      required
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                    />
                    <label htmlFor="acepta-terminos-teaser" style={{ fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.4', cursor: 'pointer' }}>
                      Autorizo el tratamiento de mis datos personales para evaluar la reducción de mi crédito bajo la <strong>Ley 546 de 1999</strong>. Entiendo que este estudio inicial es <strong>100% gratuito, confidencial y sin anticipos</strong>.
                    </label>
                  </div>

                  {/* Botón Submit Final */}
                  <ButtonPulse
                    type="submit"
                    variant="primary"
                    pulse={aceptaTerminos && !isSubmitting && (!!file || noTieneExtractoAhora)}
                    style={{
                      background: (aceptaTerminos && (!!file || noTieneExtractoAhora) && !isSubmitting)
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : '#cbd5e1',
                      color: '#ffffff',
                      fontWeight: '800',
                      padding: '16px 24px',
                      fontSize: '15px',
                      boxShadow: (aceptaTerminos && (!!file || noTieneExtractoAhora)) ? '0 4px 18px rgba(34, 197, 94, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: (!aceptaTerminos || (!file && !noTieneExtractoAhora) || isSubmitting) ? 'not-allowed' : 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    {isSubmitting ? 'Procesando y Asegurando Información...' : 'Solicitar Mi Auditoría Gratuita y Desbloquear Cifras'}
                    <MessageCircle size={20} />
                  </ButtonPulse>

                  {/* Botón Volver a editar valores */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setViewState('setup')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ArrowLeft size={14} /> Modificar datos de mi crédito
                    </button>
                  </div>

                </form>

              </div>
            </Card3D>
          </motion.div>
        )}

        {/* ========================================================
            TAB 2: SUBIDA DIRECTA DE EXTRACTO (VÍA RÁPIDA)
           ======================================================== */}
        {activeTab === 'upload' && viewState === 'setup' && (
          <motion.div
            key="tab-upload-setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card3D variant="light" className="shadow-lg" tilt={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '18px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800', color: '#16a34a', marginBottom: '8px' }}>
                    <ShieldCheck size={16} /> Canal Oficial Seguro • Ley 546 de 1999
                  </div>
                  <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--primary-dark)', margin: '4px 0' }}>
                    Sube Tu Extracto Bancario (PDF o Foto)
                  </h2>
                  <p style={{ color: 'var(--text-medium)', fontSize: '14.5px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.5' }}>
                    Para no darte cifras aproximadas ni falsas expectativas, Williams Cruz analiza directamente los cobros de amortización y seguros de tu extracto oficial sin ningún costo.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                  
                  {/* File Upload Dropzone */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}>
                      <FileText size={16} color="var(--accent-blue)" /> Adjuntar Extracto Bancario (.pdf, .jpg, .png)*
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: dragOver ? '2px dashed #16a34a' : '2px dashed #cbd5e1',
                        borderRadius: '16px',
                        padding: '28px 20px',
                        textAlign: 'center',
                        background: dragOver ? 'rgba(34, 197, 94, 0.05)' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                        style={{ display: 'none' }}
                      />
                      
                      {!file ? (
                        <>
                          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                            <Upload size={26} />
                          </div>
                          <div>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-dark)', display: 'block' }}>
                              Haz clic para seleccionar tu extracto o arrástralo aquí
                            </span>
                            <span style={{ fontSize: '12.5px', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                              Formatos permitidos: PDF o fotos claras (JPG, PNG) • Máximo 15 MB
                            </span>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)' }} onClick={(e) => e.stopPropagation()}>
                          {file.type === 'application/pdf' ? (
                            <FileText size={32} color="#ef4444" style={{ flexShrink: 0 }} />
                          ) : (
                            <FileImage size={32} color="#3b82f6" style={{ flexShrink: 0 }} />
                          )}
                          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                            <strong style={{ fontSize: '14px', color: 'var(--primary-dark)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </strong>
                            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                              {(file.size / (1024 * 1024)).toFixed(2)} MB • Archivo listo para auditoría
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444' }}
                            title="Eliminar archivo"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Datos del Banco y Modalidad */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={fieldGroup}>
                      <label style={labelStyle}><Building size={15} color="var(--accent-blue)" /> Banco de tu crédito*</label>
                      <select value={banco} onChange={(e) => setBanco(e.target.value)} style={inputStyle} required>
                        {BANCOS_LIST.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div style={fieldGroup}>
                      <label style={labelStyle}><CreditCard size={15} color="var(--accent-blue)" /> Modalidad*</label>
                      <select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)} style={inputStyle} required>
                        {TIPOS_CREDITO.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Saldo Aproximado (Opcional) */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}>
                      <DollarSign size={15} color="#16a34a" /> Saldo aproximado de deuda (opcional)
                    </label>
                    <input
                      type="number"
                      value={saldoCapital}
                      onChange={(e) => setSaldoCapital(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 140000000"
                      style={inputStyle}
                      min={1000000}
                    />
                  </div>

                  {/* Datos Personales */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Datos para entregarte los resultados:
                    </span>

                    <div style={fieldGroup}>
                      <label style={labelStyle}><User size={15} color="var(--accent-blue)" /> Tu Nombre Completo*</label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Carolina Morales"
                        style={inputStyle}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={fieldGroup}>
                        <label style={labelStyle}><Phone size={15} color="#16a34a" /> WhatsApp / Celular*</label>
                        <input
                          type="tel"
                          value={celular}
                          onChange={(e) => setCelular(e.target.value)}
                          placeholder="Ej: 316 977 3057"
                          style={inputStyle}
                          required
                        />
                      </div>

                      <div style={fieldGroup}>
                        <label style={labelStyle}><Mail size={15} color="var(--accent-blue)" /> Correo Electrónico*</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ej: carolina@gmail.com"
                          style={inputStyle}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Términos y Condiciones */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '6px' }}>
                    <input
                      type="checkbox"
                      id="acepta-terminos-upload"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      required
                      style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                    />
                    <label htmlFor="acepta-terminos-upload" style={{ fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.4', cursor: 'pointer' }}>
                      Autorizo a Susfinanzas SAS y a Williams Cruz el tratamiento de mis datos personales para evaluar la reducción de mi crédito bajo la <strong>Ley 546 de 1999</strong>. Entiendo que este estudio es 100% gratuito y sin anticipos.
                    </label>
                  </div>

                  {/* Botón de Enviar */}
                  <ButtonPulse
                    type="submit"
                    variant="primary"
                    pulse={aceptaTerminos && !isSubmitting && !!file}
                    style={{
                      background: (aceptaTerminos && file && !isSubmitting)
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : '#cbd5e1',
                      color: '#ffffff',
                      fontWeight: '800',
                      padding: '16px 24px',
                      fontSize: '15px',
                      boxShadow: (aceptaTerminos && file) ? '0 4px 18px rgba(34, 197, 94, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: (!aceptaTerminos || !file || isSubmitting) ? 'not-allowed' : 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    {isSubmitting ? 'Cargando y Asegurando Información...' : 'Solicitar Estudio Seguro de mi Extracto'}
                    <MessageCircle size={20} />
                  </ButtonPulse>
                </form>

              </div>
            </Card3D>
          </motion.div>
        )}

        {/* ========================================================
            PANTALLA DE ÉXITO (POST-ENVÍO CONFIRMADO)
           ======================================================== */}
        {viewState === 'success' && (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto' }}
          >
            <Card3D variant="navy" glowColor="yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '24px 16px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <FileCheck size={44} />
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
                  ¡Solicitud Recibida con Éxito!
                </h2>

                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                  Muchas gracias, <strong>{nombre}</strong>. Tu información para el crédito con <strong>{banco}</strong> ha sido registrada en nuestro sistema de manera confidencial y segura.
                </p>

                <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', width: '100%', textAlign: 'left', fontSize: '13.5px', color: '#ffffff' }}>
                  <ShieldCheck size={22} color="var(--accent-yellow-bright)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Procedimiento de Auditoría:</strong> Williams Cruz auditará tu caso bajo la Ley 546 de 1999 para estructurar tu propuesta de ahorro y cuota inteligente sin margen de error.
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', margin: 0 }}>
                  Para agilizar tu respuesta o coordinar la entrega de tu informe, escríbenos directamente por WhatsApp:
                </p>

                <ButtonPulse
                  type="button"
                  variant="white"
                  pulse={true}
                  onClick={() => {
                    const message = encodeURIComponent(
                      `Hola Williams! Acabo de registrar mis datos en la web para la auditoría de mi crédito con ${banco}.\n\n` +
                      `Mi nombre es ${nombre} y mi celular es ${celular}.\n` +
                      (file ? `Adjunté mi extracto bancario en la web.` : `Deseo coordinar la descarga y revisión de mi extracto para iniciar el estudio.`)
                    );
                    window.open(`https://wa.me/573169773057?text=${message}`, '_blank');
                  }}
                  style={{
                    width: '100%',
                    background: '#25D366',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '800',
                    padding: '16px',
                    fontSize: '15.5px',
                    boxShadow: '0 4px 18px rgba(37, 211, 102, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Abrir WhatsApp con Williams Cruz <MessageCircle size={20} />
                </ButtonPulse>

                <button
                  type="button"
                  onClick={() => {
                    setViewState('setup');
                    setFile(null);
                    setNombre('');
                    setCelular('');
                    setEmail('');
                    setNoTieneExtractoAhora(false);
                    setAceptaTerminos(false);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', marginTop: '6px' }}
                >
                  Realizar otra consulta o subir otro documento
                </button>
              </div>
            </Card3D>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
