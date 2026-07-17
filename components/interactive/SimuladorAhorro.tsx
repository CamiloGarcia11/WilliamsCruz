'use strict';

'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  formatCurrency,
  calcularAnalisisExtracto,
  AnalisisExtractoResult
} from '../../lib/calculosFinancieros';
import Card3D from '../ui/Card3D';
import ButtonPulse from '../ui/ButtonPulse';
import { saveLeadToFirebase, uploadFileToFirebase, fileToBase64 } from '../../lib/firebase/client';
import {
  Building,
  DollarSign,
  Calendar,
  ShieldCheck,
  Info,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  FileCheck,
  CreditCard,
  Landmark,
  User,
  Upload,
  FileText,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   ESTILOS REUTILIZABLES
   ────────────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--text-medium)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const fieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #f3f4f6',
  paddingBottom: '8px',
  fontSize: '13px',
  alignItems: 'center',
};

/* ──────────────────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ────────────────────────────────────────────────────────── */
export default function SimuladorAhorro() {
  const [step, setStep] = useState(1);

  // ── DATOS DEL CRÉDITO (Step 1) ─────────────────────────
  const [banco, setBanco] = useState('Bancolombia');
  const [tipoCredito, setTipoCredito] = useState('Crédito Hipotecario');
  const [valorDesembolso, setValorDesembolso] = useState<number | ''>('');
  const [saldoCapital, setSaldoCapital] = useState<number | ''>('');
  const [plazoTotalInput, setPlazoTotalInput] = useState<number | ''>('');
  const [plazoTotalUnidad, setPlazoTotalUnidad] = useState<'anos' | 'meses'>('anos');
  const [cuotasPagasInput, setCuotasPagasInput] = useState<number | ''>('');
  const [cuotasPagasUnidad, setCuotasPagasUnidad] = useState<'anos' | 'meses'>('anos');
  const [cuotaMensualCredito, setCuotaMensualCredito] = useState<number | ''>('');
  const [ingresos, setIngresos] = useState<number | ''>('');

  // FRECH
  const [tieneFRECH, setTieneFRECH] = useState(false);
  const [cuotaMensualFRECH, setCuotaMensualFRECH] = useState<number | ''>('');
  const [cuotasSubsidiadasPagas, setCuotasSubsidiadasPagas] = useState<number | ''>('');

  // ── ARCHIVO EXTRACTO & CONTACTO (Step 3) ───────────────
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // ── UI STATE ──────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── CONVERSIONES A MESES ──────────────────────────────
  const plazoTotalMeses = plazoTotalInput ? (plazoTotalUnidad === 'anos' ? Number(plazoTotalInput) * 12 : Number(plazoTotalInput)) : 0;
  const cuotasPagas = cuotasPagasInput ? (cuotasPagasUnidad === 'anos' ? Number(cuotasPagasInput) * 12 : Number(cuotasPagasInput)) : 0;

  // ── CÁLCULOS REACTIVOS ────────────────────────────────
  const analisis = useMemo<AnalisisExtractoResult | null>(() => {
    if (!valorDesembolso || !saldoCapital || !cuotaMensualCredito || !plazoTotalInput) return null;
    return calcularAnalisisExtracto({
      valorDesembolso: Number(valorDesembolso),
      saldoCapital: Number(saldoCapital),
      plazoTotalMeses,
      cuotasPagas,
      cuotaMensualCredito: Number(cuotaMensualCredito),
      cuotaMensualFRECH: tieneFRECH ? Number(cuotaMensualFRECH) : 0,
      cuotasSubsidiadasPagas: tieneFRECH ? Number(cuotasSubsidiadasPagas) : 0,
      duracionSubsidioFRECH: 84,
      ingresos: ingresos ? Number(ingresos) : 0,
      abonoExtra: 0,
    });
  }, [
    valorDesembolso, saldoCapital, plazoTotalMeses, cuotasPagas,
    cuotaMensualCredito, cuotaMensualFRECH, cuotasSubsidiadasPagas,
    tieneFRECH, ingresos,
  ]);

  // ── VALIDACIÓN PASO 1 ─────────────────────────────────
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valDes = Number(valorDesembolso);
    const salCap = Number(saldoCapital);
    const cuotas = Number(cuotasPagas);
    const plazo = Number(plazoTotalMeses);

    if (!valDes || !salCap || !plazo) {
      alert('Por favor, rellena todos los campos requeridos.');
      return;
    }
    if (salCap > valDes) {
      alert('El saldo actual no puede ser mayor que el valor de desembolso original.');
      return;
    }
    if (cuotas >= plazo) {
      alert('Las cuotas pagas no pueden ser iguales o mayores al plazo total.');
      return;
    }
    setStep(2);
  };

  // ── MANEJO DE ARCHIVOS (PDF) ──────────────────────────
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      alert('Por favor, selecciona un archivo en formato PDF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > 12 * 1024 * 1024) {
      alert('El archivo supera el tamaño máximo permitido de 12MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
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

  // ── ENVÍO FINAL ───────────────────────────────────────
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !celular || !email) {
      alert('Por favor completa todos los campos de contacto.');
      return;
    }
    if (!file) {
      alert('Por favor adjunta tu extracto bancario en formato PDF para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      let extractoBase64 = '';
      try {
        extractoBase64 = await fileToBase64(file);
      } catch (err) {
        console.warn('No se pudo convertir el PDF a Base64:', err);
      }

      let extractoUrl: string | null = null;
      try {
        const cleanName = nombre.trim().replace(/\s+/g, '_').toLowerCase();
        const fileName = `${Date.now()}_${cleanName}_extracto.pdf`;
        extractoUrl = await uploadFileToFirebase(file, fileName);
      } catch (err) {
        console.error('Error al subir a Firebase Storage (posiblemente plan Spark):', err);
      }

      let pdfIncluidoEnEnvio = true;
      if (!extractoUrl) {
        if (file.size > 4 * 1024 * 1024) {
          const confirmSubmit = window.confirm(
            'El archivo PDF de tu extracto supera el límite de tamaño para procesamiento directo (4 MB).\n\n' +
            '¿Deseas enviar tu información por ahora y enviarnos el archivo PDF directamente a Williams Cruz por WhatsApp?'
          );
          if (!confirmSubmit) {
            setIsSubmitting(false);
            return;
          }
          extractoBase64 = '';
          pdfIncluidoEnEnvio = false;
        }
      }

      await saveLeadToFirebase({
        tipoSociedad: tipoCredito,
        banco,
        modalidad: pdfIncluidoEnEnvio ? 'Auditoría Profunda de Extracto PDF' : 'Solicitud de Asesoría sin PDF',
        montoDeuda: formatCurrency(Number(saldoCapital)),
        nombre,
        celular,
        correo: email,
        extractoUrl: extractoUrl || undefined,
        extractoBase64: extractoBase64 || undefined,
        valorDesembolso: Number(valorDesembolso),
        saldoCapital: Number(saldoCapital),
        plazoTotalMeses,
        cuotasPagas,
        cuotaMensualCredito: Number(cuotaMensualCredito),
        ingresos: Number(ingresos),
        tieneFRECH,
        cuotaMensualFRECH: tieneFRECH ? Number(cuotaMensualFRECH) : 0,
        cuotasSubsidiadasPagas: tieneFRECH ? Number(cuotasSubsidiadasPagas) : 0,
      });
      setIsSubmitting(false);
      setStep(4);
    } catch (error) {
      console.error('Error durante el envío del extracto y lead:', error);
      alert('Ocurrió un error al enviar tu información. Por favor inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>

      {/* Progress Tracker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 10px' }}>
        {[
          { label: 'Crédito', icon: '🏦' },
          { label: 'Análisis', icon: '📊' },
          { label: 'Adjuntar PDF', icon: '📎' },
          { label: 'Éxito', icon: '✅' },
        ].map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <React.Fragment key={s.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive ? 'var(--accent-blue)' : isDone ? 'var(--primary-dark)' : '#e2e8f0',
                    color: isActive || isDone ? '#ffffff' : 'var(--text-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    boxShadow: isActive ? 'var(--shadow-glow-blue)' : 'none',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                <span className="step-label" style={{ fontSize: '12px', fontWeight: isActive ? '700' : '500', color: isActive ? 'var(--primary-dark)' : 'var(--text-light)' }}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    background: isDone ? 'var(--primary-dark)' : '#e2e8f0',
                    margin: '0 8px',
                    transition: 'var(--transition-smooth)',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* PASO 1: DATOS DEL CRÉDITO */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card3D variant="light" className="shadow-lg" tilt={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Landmark size={22} color="var(--accent-blue)" /> Datos de tu Crédito Hipotecario
                  </h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '13.5px', marginTop: '4px' }}>
                    Ingresa las cifras de tu extracto bancario en los campos vacíos de abajo para comenzar tu análisis.
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

                  {/* Banco */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Building size={15} /> Banco</label>
                    <select value={banco} onChange={(e) => setBanco(e.target.value)} style={{ ...inputStyle, background: '#fff' }} required>
                      {['Bancolombia', 'Davivienda', 'BBVA', 'Banco de Bogotá', 'Banco Colpatria', 'Caja Social', 'FNA', 'Banco Popular', 'Scotiabank', 'Otro'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de crédito */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><CreditCard size={15} /> Tipo de Crédito</label>
                    <select value={tipoCredito} onChange={(e) => setTipoCredito(e.target.value)} style={{ ...inputStyle, background: '#fff' }} required>
                      {['Crédito Hipotecario', 'Leasing Habitacional', 'Crédito Vivienda VIS', 'Crédito Vivienda No VIS'].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Valor Desembolso */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} /> Valor Desembolso (Original)</label>
                    <input
                      type="number"
                      value={valorDesembolso}
                      onChange={(e) => setValorDesembolso(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 150000000"
                      style={inputStyle}
                      min={10000000}
                      required
                    />
                  </div>

                  {/* Saldo Capital */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} /> Saldo del Capital Según Extracto</label>
                    <input
                      type="number"
                      value={saldoCapital}
                      onChange={(e) => setSaldoCapital(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 130000000"
                      style={inputStyle}
                      min={1000000}
                      required
                    />
                  </div>

                  {/* Plazo Total */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Calendar size={15} /> Plazo Total del Crédito</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={plazoTotalInput}
                        onChange={(e) => setPlazoTotalInput(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ej: 20"
                        style={{ ...inputStyle, flex: 1 }}
                        min={1}
                        required
                      />
                      <select value={plazoTotalUnidad} onChange={(e) => setPlazoTotalUnidad(e.target.value as 'anos' | 'meses')} style={{ ...inputStyle, width: '100px' }}>
                        <option value="anos">Años</option>
                        <option value="meses">Meses</option>
                      </select>
                    </div>
                  </div>

                  {/* Cuotas Pagas */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Calendar size={15} /> Número de Cuotas Pagas</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        value={cuotasPagasInput}
                        onChange={(e) => setCuotasPagasInput(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ej: 36"
                        style={{ ...inputStyle, flex: 1 }}
                        min={0}
                        required
                      />
                      <select value={cuotasPagasUnidad} onChange={(e) => setCuotasPagasUnidad(e.target.value as 'anos' | 'meses')} style={{ ...inputStyle, width: '100px' }}>
                        <option value="anos">Años</option>
                        <option value="meses">Meses</option>
                      </select>
                    </div>
                  </div>

                  {/* Cuota mensual */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} /> Cuota Mensual del Crédito ($)</label>
                    <input
                      type="number"
                      value={cuotaMensualCredito}
                      onChange={(e) => setCuotaMensualCredito(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 1850000"
                      style={inputStyle}
                      min={100000}
                      required
                    />
                  </div>

                  {/* Ingresos */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><DollarSign size={15} /> Ingresos Mensuales ($)</label>
                    <input
                      type="number"
                      value={ingresos}
                      onChange={(e) => setIngresos(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ej: 3500000"
                      style={inputStyle}
                      min={0}
                      required
                    />
                  </div>

                  {/* Tiempo Pendiente */}
                  <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-medium)', fontWeight: '600' }}>⏳ Tiempo Pendiente de Pago:</span>
                      <strong style={{ color: 'var(--primary-dark)' }}>
                        {Math.max(0, plazoTotalMeses - cuotasPagas)} meses ({(Math.max(0, plazoTotalMeses - cuotasPagas) / 12).toFixed(1)} años)
                      </strong>
                    </div>
                  </div>

                  {/* FRECH Toggle */}
                  <div style={{ gridColumn: 'span 2', background: tieneFRECH ? 'rgba(34, 197, 94, 0.04)' : '#f8fafc', border: tieneFRECH ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid #e2e8f0', padding: '16px', borderRadius: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', color: 'var(--primary-dark)' }}>
                      <input
                        type="checkbox"
                        checked={tieneFRECH}
                        onChange={(e) => setTieneFRECH(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-blue)' }}
                      />
                      <ShieldCheck size={18} color={tieneFRECH ? '#22c55e' : 'var(--text-light)'} />
                      ¿Tu crédito tiene subsidio FRECH del Gobierno?
                    </label>

                    {tieneFRECH && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        <div style={fieldGroup}>
                          <label style={{ ...labelStyle, fontSize: '12px' }}>Cuota Mensual Tasa FRECH ($)</label>
                          <input
                            type="number"
                            value={cuotaMensualFRECH}
                            onChange={(e) => setCuotaMensualFRECH(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Ej: 120000"
                            style={inputStyle}
                            min={0}
                          />
                          <span style={{ fontSize: '10px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                            El valor que el Gobierno paga por ti cada mes.
                          </span>
                        </div>
                        <div style={fieldGroup}>
                          <label style={{ ...labelStyle, fontSize: '12px' }}>No. Cuotas Subsidiadas Pagas</label>
                          <input
                            type="number"
                            value={cuotasSubsidiadasPagas}
                            onChange={(e) => setCuotasSubsidiadasPagas(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Ej: 24"
                            style={inputStyle}
                            min={0}
                            max={84}
                          />
                          <span style={{ fontSize: '10px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                            Duración máxima del FRECH: 84 meses (7 años).
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px', background: 'rgba(34, 197, 94, 0.06)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.4' }}>
                    <ShieldCheck size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>🔒 100% Anónimo:</strong> Los datos se procesan en tu navegador. Te solicitaremos adjuntar tu PDF en el Paso 3 para el estudio formal.
                    </div>
                  </div>

                  {/* Submit */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <ButtonPulse type="submit" variant="primary" pulse={true}>
                      Generar Análisis del Extracto <ArrowRight size={16} />
                    </ButtonPulse>
                  </div>
                </form>

              </div>
            </Card3D>
          </motion.div>
        )}

        {/* PASO 2: ANÁLISIS DEL EXTRACTO BANCARIO */}
        {step === 2 && analisis && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* DOCUMENT REPORT */}
            <div style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-yellow))', position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '12px 12px 0 0' }} />

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Análisis del Extracto Bancario
                  </h2>
                  <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '2px' }}>
                    Diagnóstico Financiero • Ley 546 de 1999
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary-blue)' }}>
                    Williams <span style={{ color: 'var(--accent-blue)' }}>Cruz</span>
                  </span>
                  <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0 }}>Asesoría Financiera</p>
                </div>
              </div>

              {/* Variables del Crédito */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', paddingBottom: '4px', marginBottom: '10px' }}>
                  Variables del Crédito
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Banco</span><strong>{banco}</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Tipo de Crédito</span><strong>{tipoCredito}</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Valor Desembolso</span><strong>{formatCurrency(Number(valorDesembolso))}</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Saldo del Capital Según Extracto</span><strong>{formatCurrency(Number(saldoCapital))}</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Plazo Total del Crédito</span><strong>{plazoTotalMeses} meses ({(plazoTotalMeses / 12).toFixed(1)} años)</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuotas del Crédito Pagas</span><strong>{cuotasPagas} meses ({(cuotasPagas / 12).toFixed(1)} años)</strong></div>
                  <div style={{ ...rowStyle, color: 'var(--accent-blue)', fontWeight: 'bold' }}><span>Tiempo Pendiente de Pago</span><strong>{analisis.tiempoPendienteMeses} meses ({analisis.tiempoPendienteAnos.toFixed(1)} años)</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuota Mensual Crédito</span><strong>{formatCurrency(Number(cuotaMensualCredito))}</strong></div>
                </div>
              </div>

              {/* FRECH Section */}
              {tieneFRECH && Number(cuotaMensualFRECH) > 0 && (
                <div style={{ marginBottom: '20px', background: 'rgba(34, 197, 94, 0.03)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', borderBottom: '1px solid rgba(34, 197, 94, 0.15)', paddingBottom: '4px', marginBottom: '10px' }}>
                    🏛️ Subsidio FRECH del Gobierno
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuota Mensual Tasa FRECH</span><strong>{formatCurrency(Number(cuotaMensualFRECH))}</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuotas Subsidiadas Pagas</span><strong>{cuotasSubsidiadasPagas} meses ({(Number(cuotasSubsidiadasPagas) / 12).toFixed(1)} años)</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Valor Cuotas Subsidiadas Pagas</span><strong style={{ color: '#16a34a' }}>{formatCurrency(analisis.valorCuotasSubsidiadasPagas)}</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuotas Pendientes de Subsidio</span><strong>{analisis.cuotasPendientesSubsidio} meses ({(analisis.cuotasPendientesSubsidio / 12).toFixed(1)} años)</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Valor Cuotas Pendientes de Subsidio</span><strong style={{ color: '#16a34a' }}>{formatCurrency(analisis.valorCuotasPendientesSubsidio)}</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Total Beneficio FRECH pagado por el Gobierno</span><strong style={{ color: '#16a34a' }}>{formatCurrency(analisis.valorTotalBeneficioFRECH)}</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuotas Pendiente por Asumir el Cliente (sin FRECH)</span><strong>{analisis.cuotasPendienteAsumirCliente} meses ({(analisis.cuotasPendienteAsumirCliente / 12).toFixed(1)} años)</strong></div>
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Valor Cuotas Pendiente por Asumir</span><strong>{formatCurrency(analisis.valorCuotasPendienteAsumirCliente)}</strong></div>
                  </div>
                </div>
              )}

              {/* TOTALES DE PAGO */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', paddingBottom: '4px', marginBottom: '10px' }}>
                  💰 Totales de Pago
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {tieneFRECH && (
                    <div style={rowStyle}><span style={{ color: '#6b7280' }}>Valor Total Entregado al Banco (Modalidad FRECH)</span><strong>{formatCurrency(analisis.valorTotalEntregadoBancoFRECH)}</strong></div>
                  )}
                  <div style={{ ...rowStyle, background: 'rgba(239, 68, 68, 0.04)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ color: '#dc2626', fontWeight: '700' }}>Cuánto Va a Pagar por su Crédito (Vida Total)</span>
                    <strong style={{ color: '#dc2626', fontSize: '15px' }}>{formatCurrency(analisis.cuantoVaAPagarPorCredito)}</strong>
                  </div>
                  <div style={{ ...rowStyle, background: 'rgba(245, 158, 11, 0.06)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                    <span style={{ color: '#b45309', fontWeight: '700' }}>Número de Veces que Pagará su Vivienda</span>
                    <strong style={{ color: '#b45309', fontSize: '18px' }}>{analisis.numeroVecesPagaCredito.toFixed(1)}x</strong>
                  </div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Cuánto Dinero Le Ha Llevado al Banco</span><strong>{formatCurrency(analisis.dineroLlevadoAlBanco)}</strong></div>
                  <div style={rowStyle}><span style={{ color: '#6b7280' }}>Dinero Pendiente por Pagar al Banco</span><strong>{formatCurrency(analisis.dineroPendientePorPagar)}</strong></div>
                </div>
              </div>

              {/* AMORTIZACIÓN A CAPITAL, INTERESES Y SEGUROS */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6', paddingBottom: '4px', marginBottom: '10px' }}>
                  📊 ¿Cuánto Ha Amortizado a Capital, Intereses y Seguros?
                </h4>

                {/* Capital Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#22c55e', fontWeight: '700' }}>Amortizado a Capital</span>
                    <strong style={{ color: '#22c55e' }}>{formatCurrency(analisis.amortizadoCapital)} ({analisis.porcentajeAmortizacionCapital.toFixed(1)}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, analisis.porcentajeAmortizacionCapital)}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '8px', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                    Promedio amortizado a capital por cada cuota: <strong>{formatCurrency(analisis.promedioCapitalPorCuota)}</strong>
                  </div>
                </div>

                {/* Intereses + Seguros Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#ef4444', fontWeight: '700' }}>Amortizado a Intereses y Seguros</span>
                    <strong style={{ color: '#ef4444' }}>{formatCurrency(analisis.amortizadoInteresesSeguros)} ({analisis.porcentajeInteresesSeguros.toFixed(1)}%)</strong>
                  </div>
                  <div style={{ width: '100%', height: '16px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, analisis.porcentajeInteresesSeguros)}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #dc2626)', borderRadius: '8px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: '10px', fontSize: '12px', color: '#92400e', lineHeight: '1.5' }}>
                <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>⚠️ Conclusión:</strong> De cada peso que has pagado al banco, solo <strong>{analisis.porcentajeAmortizacionCapital.toFixed(0)} centavos</strong> han ido a reducir tu deuda.
                  Los otros <strong>{analisis.porcentajeInteresesSeguros.toFixed(0)} centavos</strong> son ganancia neta del banco en intereses y seguros.
                  {analisis.numeroVecesPagaCredito >= 2 && (
                    <> Al finalizar el crédito, habrás pagado <strong>{analisis.numeroVecesPagaCredito.toFixed(1)} veces</strong> el valor original de tu vivienda.</>
                  )}
                </div>
              </div>

              {/* Legal Note */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '16px', display: 'flex', alignItems: 'start', gap: '8px', fontSize: '10px', color: '#6b7280', lineHeight: '1.4' }}>
                <Info size={14} color="#9ca3af" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <strong>Nota:</strong> Este análisis es una simulación basada en las fórmulas estándar de amortización del mercado hipotecario colombiano. Las cifras pueden variar según las políticas específicas del banco.
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(1)} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-medium)' }}>
                <ArrowLeft size={16} /> Ajustar datos del crédito
              </button>
              <ButtonPulse type="button" variant="primary" onClick={() => setStep(3)} pulse={true}>
                Adjuntar Extracto PDF para Análisis Completo <ArrowRight size={16} />
              </ButtonPulse>
            </div>
          </motion.div>
        )}

        {/* PASO 3: CARGA DE EXTRACTO PDF Y DATOS DE CONTACTO */}
        {step === 3 && analisis && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* UPLOADER & FORM SECTION */}
            <Card3D variant="light" className="shadow-lg" tilt={false}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Upload size={22} color="var(--accent-blue)" /> Radicación de Análisis de Extracto
                  </h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '13.5px', marginTop: '4px' }}>
                    Para verificar los cobros exactos del seguro y la tasa real aplicada por {banco}, adjunta tu extracto de crédito en formato PDF.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '580px', margin: '0 auto', width: '100%' }}>
                  
                  {/* File Upload Zone */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}>
                      <FileText size={15} /> Adjuntar Extracto Bancario (Requerido, solo .pdf)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: dragOver ? '2px dashed var(--accent-blue)' : '2px dashed var(--border-light)',
                        borderRadius: '12px',
                        padding: '32px 20px',
                        textAlign: 'center',
                        background: dragOver ? 'rgba(59, 130, 246, 0.04)' : '#f8fafc',
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
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                        style={{ display: 'none' }}
                      />
                      
                      {!file ? (
                        <>
                          <Upload size={32} color="var(--text-light)" />
                          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-medium)' }}>
                            Arrastra y suelta tu archivo PDF aquí o haz clic para buscarlo
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                            Tamaño máximo permitido: 12MB. Solo archivos .pdf
                          </span>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }} onClick={(e) => e.stopPropagation()}>
                          <FileText size={28} color="#ef4444" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                            <strong style={{ fontSize: '13px', color: 'var(--primary-dark)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </strong>
                            <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-light)' }}
                          >
                            <Trash2 size={18} className="hover-text-red" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nombre */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><User size={15} /> Nombre completo</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sandra Patricia Gómez" style={inputStyle} required />
                  </div>

                  {/* Celular */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Phone size={15} /> Celular / WhatsApp</label>
                    <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ej: 315 123 4567" style={inputStyle} required />
                  </div>

                  {/* Correo */}
                  <div style={fieldGroup}>
                    <label style={labelStyle}><Mail size={15} /> Correo electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej: sandra@correo.com" style={inputStyle} required />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'start', marginTop: '10px', marginBottom: '16px' }}>
                    <input
                      type="checkbox"
                      id="acepta-terminos-simulador"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      required
                      style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                    />
                    <label htmlFor="acepta-terminos-simulador" style={{ fontSize: '11px', color: 'var(--text-medium)', lineHeight: '1.4', cursor: 'pointer' }}>
                      Acepto el <strong>Tratamiento de Datos Personales</strong> (Ley 1581 de 2012) y autorizo voluntariamente el análisis seguro de mi extracto bancario PDF con el único fin de evaluar las opciones de reducción de mi crédito de vivienda.
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setStep(2)} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff', cursor: 'pointer', fontWeight: '600', color: 'var(--text-medium)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowLeft size={16} /> Atrás
                    </button>
                    
                    <ButtonPulse
                      type="submit"
                      variant="primary"
                      className="w-full"
                      pulse={aceptaTerminos && !isSubmitting}
                      style={{
                        background: aceptaTerminos ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#e2e8f0',
                        color: aceptaTerminos ? '#ffffff' : 'var(--text-light)',
                        fontWeight: 'bold',
                        boxShadow: aceptaTerminos ? '0 4px 14px rgba(34, 197, 94, 0.4)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: (!aceptaTerminos || isSubmitting) ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.8 : 1,
                        pointerEvents: (!aceptaTerminos || isSubmitting) ? 'none' : 'auto'
                      }}
                    >
                      {isSubmitting ? 'Subiendo y Enviando...' : 'Subir Extracto y Chatear con Williams'} <MessageCircle size={18} />
                    </ButtonPulse>
                  </div>
                </form>
              </div>
            </Card3D>
          </motion.div>
        )}

        {/* PASO 4: ÉXITO */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}
          >
            <Card3D variant="navy" glowColor="yellow" className="glow-card-yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '24px 12px' }}>
                <FileCheck size={64} color="var(--accent-yellow-bright)" />
                <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>
                  ¡Extracto Cargado Exitosamente!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14.5px', lineHeight: '1.6' }}>
                  Hola <strong>{nombre}</strong>. Hemos registrado tu extracto bancario de <strong>{banco}</strong> de manera segura en nuestro sistema y te hemos redirigido a WhatsApp para iniciar tu caso.
                </p>

                <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', width: '100%', textAlign: 'left', fontSize: '13px' }}>
                  <ShieldCheck size={20} color="var(--accent-yellow-bright)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Siguiente paso:</strong> Williams Cruz verificará el archivo PDF cargado, preparará los escenarios legales y te contactará para agendar la llamada de presentación.
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                  Si la redirección automática no funcionó, usa el botón de abajo:
                </p>

                <ButtonPulse
                  type="button"
                  variant="white"
                  pulse={true}
                  onClick={() => {
                    const message = encodeURIComponent(
                      `Hola Williams! He realizado la simulación de mi extracto en tu web para el banco ${banco} y acabo de subir mi PDF para el análisis formal.\n\n` +
                      `Mi saldo de deuda es de ${formatCurrency(Number(saldoCapital))}. Mi nombre es ${nombre}.`
                    );
                    window.open(`https://wa.me/573155030333?text=${message}`, '_blank');
                  }}
                  style={{
                    width: '100%',
                    background: '#22c55e',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Abrir Chat de WhatsApp <MessageCircle size={18} />
                </ButtonPulse>

                <button
                  type="button"
                  onClick={() => { setStep(1); setFile(null); }}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', marginTop: '10px' }}
                >
                  Realizar otro análisis
                </button>
              </div>
            </Card3D>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
