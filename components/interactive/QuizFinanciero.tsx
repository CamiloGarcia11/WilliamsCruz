'use strict';

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  CreditCard, 
  Landmark, 
  TrendingUp, 
  FileText, 
  User, 
  Sparkles, 
  FileCheck,
  MessageCircle,
  HelpCircle,
  Trash2
} from 'lucide-react';
import ButtonPulse from '../ui/ButtonPulse';
import { saveLeadToFirebase, fileToBase64 } from '../../lib/firebase/client';

interface QuizAnswers {
  tipoSociedad: string;
  banco: string;
  montoDeuda: string;
  abonoInteligente: string;
  cuotaActual: string;
  nombre: string;
  celular: string;
  correo: string;
}

export default function QuizFinanciero() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = adelante, -1 = atrás
  const [answers, setAnswers] = useState<QuizAnswers>({
    tipoSociedad: '',
    banco: '',
    montoDeuda: '',
    abonoInteligente: '',
    cuotaActual: '',
    nombre: '',
    celular: '',
    correo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectOption = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 5) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.nombre || !answers.celular || !answers.correo) {
      alert('Por favor completa los datos de contacto del titular.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let extractoBase64 = '';
      if (file) {
        try {
          extractoBase64 = await fileToBase64(file);
        } catch (fileErr) {
          console.warn('Error al convertir PDF en base64:', fileErr);
        }
      }

      const res = await saveLeadToFirebase({
        tipoSociedad: answers.tipoSociedad || 'Crédito Hipotecario',
        banco: answers.banco || 'Bancolombia',
        modalidad: answers.abonoInteligente ? `Abono Inteligente: ${answers.abonoInteligente}` : 'Pesos',
        montoDeuda: answers.montoDeuda || 'No especificado',
        nombre: answers.nombre,
        celular: answers.celular,
        correo: answers.correo,
        abonoInteligente: answers.abonoInteligente,
        cuotaActual: answers.cuotaActual,
        extractoBase64: extractoBase64 || undefined,
        tienePdf: !!extractoBase64,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        alert('Hubo un problema al procesar tu solicitud, pero la guardamos localmente. Nos comunicaremos contigo.');
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Error en submit de formulario:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes para la animación de Giro 3D (Y-axis Card Flip)
  const flipVariants = {
    initial: (dir: number) => ({
      rotateY: dir > 0 ? 80 : -80,
      opacity: 0,
      transformPerspective: 1000,
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transformPerspective: 1000,
      transition: { duration: 0.35, ease: 'easeInOut' as const }
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -80 : 80,
      opacity: 0,
      transformPerspective: 1000,
      transition: { duration: 0.35, ease: 'easeInOut' as const }
    })
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={direction}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--accent-blue)" size={24} />
              <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                ¿Qué tipo de inmueble tienes financiado?
              </h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Vivienda Familiar (Casa/Apto)', desc: 'Crédito residencial tradicional de vivienda' },
                { label: 'Vivienda de Interés Social (VIS)', desc: 'Crédito con o sin subsidio de vivienda VIS' },
                { label: 'Leasing Habitacional', desc: 'Financiación de vivienda bajo contrato de leasing con opción de compra' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption('tipoSociedad', opt.label)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: answers.tipoSociedad === opt.label ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.tipoSociedad === opt.label ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '14.5px' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            custom={direction}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '18px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark color="var(--accent-blue)" size={24} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                  ¿Con qué banco tienes el crédito?
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  Entidad financiera donde pagas tu crédito o leasing
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                'Bancolombia',
                'Davivienda',
                'Banco de Bogotá',
                'Banco Caja Social',
                'Scotiabank Colpatria',
                'FNA (Fondo Nal. del Ahorro)',
                'Banco AV Villas',
                'Banco de Occidente',
                'Banco Popular',
                'Bancoomeva',
                'BBVA Colombia',
                'Otro / La Hipotecaria',
              ].map((banco) => (
                <button
                  key={banco}
                  type="button"
                  onClick={() => handleSelectOption('banco', banco)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: answers.banco === banco ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.banco === banco ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                    fontWeight: '600',
                    fontSize: '12.5px',
                    color: 'var(--primary-dark)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    textAlign: 'center',
                  }}
                >
                  {banco}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            custom={direction}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard color="var(--accent-blue)" size={24} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                  ¿Cuánto debes actualmente en tu crédito?
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  Saldo aproximado de capital restante
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Menos de $50 Millones',
                'Entre $50 y $120 Millones',
                'Entre $120 y $250 Millones',
                'Más de $250 Millones',
              ].map((monto) => (
                <button
                  key={monto}
                  type="button"
                  onClick={() => handleSelectOption('montoDeuda', monto)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: answers.montoDeuda === monto ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.montoDeuda === monto ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                    fontWeight: '700',
                    color: 'var(--primary-dark)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '14.5px',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  {monto}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            custom={direction}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="var(--accent-blue)" size={24} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                  ¿Cuánto podrías subirle a la cuota?
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                  Abono Inteligente bajo Ley de Vivienda (Ley 546/99)
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--text-medium)', lineHeight: '1.4' }}>
              💡 El <strong>Abono Inteligente</strong> va 100% al capital del crédito, obligando por Ley al banco a reducir años de intereses futuros sin cambiarte de entidad.
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { label: '$100.000 a $200.000 adicionales al mes', desc: 'Abono moderado — Reducción estimada de 3 a 5 años' },
                { label: '$200.000 a $400.000 adicionales al mes', desc: 'Abono recomendado — Reducción estimada de 5 a 8 años' },
                { label: '$400.000 a $700.000 adicionales al mes', desc: 'Abono acelerado — Reducción estimada de 7 a 11 años' },
                { label: 'Más de $700.000 adicionales al mes', desc: 'Abono de alto impacto — Máximo recorte de tiempo e intereses' },
                { label: 'Quiero evaluar con el menor valor posible', desc: 'Estudio personalizado con el incremento mínimo viable' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption('abonoInteligente', opt.label)}
                  style={{
                    padding: '13px 15px',
                    borderRadius: '12px',
                    border: answers.abonoInteligente === opt.label ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.abonoInteligente === opt.label ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '13.5px' }}>{opt.label}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '2px' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            custom={direction}
            variants={flipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User color="var(--accent-yellow)" size={24} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                  Información de la persona titular ante el banco
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                  Datos de quien figura como titular del crédito para validar la viabilidad técnica
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-medium)' }}>
                  Nombre Completo del Titular ante el Banco *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={answers.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Carlos Pérez Gómez"
                  required
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-medium)' }}>
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    value={answers.celular}
                    onChange={handleInputChange}
                    placeholder="Ej: 300 123 4567"
                    required
                    style={{
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-medium)' }}>
                    Cuota mensual actual (aprox)
                  </label>
                  <input
                    type="text"
                    name="cuotaActual"
                    value={answers.cuotaActual}
                    onChange={handleInputChange}
                    placeholder="Ej: $1.450.000"
                    style={{
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-medium)' }}>
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={answers.correo}
                  onChange={handleInputChange}
                  placeholder="Ej: juan.perez@ejemplo.com"
                  required
                  style={{
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Adjuntar Extracto Bancario en PDF (Opcional) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-medium)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} color="var(--accent-blue)" />
                  ¿Deseas adjuntar tu extracto bancario en PDF? (Opcional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: file ? '1.5px solid #16a34a' : '1px dashed var(--border-light)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    background: file ? 'rgba(34, 197, 94, 0.06)' : '#fafafa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: file ? '#16a34a' : 'var(--text-light)', overflow: 'hidden' }}>
                    {file ? <FileCheck size={16} color="#16a34a" /> : <FileText size={16} />}
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {file ? file.name : 'Haz clic para seleccionar archivo PDF (máx. 12 MB)'}
                    </span>
                  </div>
                  {file ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                      title="Quitar archivo"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', fontWeight: '700' }}>Examinar</span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const sel = e.target.files?.[0];
                    if (sel) {
                      if (!sel.name.toLowerCase().endsWith('.pdf') && sel.type !== 'application/pdf') {
                        alert('Por favor selecciona únicamente archivos en formato PDF.');
                        return;
                      }
                      if (sel.size > 12 * 1024 * 1024) {
                        alert('El archivo supera los 12 MB permitidos.');
                        return;
                      }
                      setFile(sel);
                    }
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'start', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="acepta-terminos-quiz"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  required
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                />
                <label htmlFor="acepta-terminos-quiz" style={{ fontSize: '11px', color: 'var(--text-medium)', lineHeight: '1.4', cursor: 'pointer' }}>
                  Acepto el <strong>Tratamiento de Datos Personales</strong> conforme a la Ley 1581 de 2012 y autorizo a Williams Cruz / Susfinanzas SAS a realizar el análisis técnico de mi crédito.
                </label>
              </div>

              <ButtonPulse
                type="submit"
                variant="primary"
                className="w-full"
                pulse={aceptaTerminos && !isSubmitting}
                style={{
                  opacity: aceptaTerminos ? 1 : 0.6,
                  cursor: aceptaTerminos ? 'pointer' : 'not-allowed',
                  pointerEvents: aceptaTerminos ? 'auto' : 'none',
                  marginTop: '6px'
                }}
              >
                {isSubmitting ? 'Procesando datos...' : 'Solicitar Viabilidad de Abono Inteligente'}
              </ButtonPulse>
            </form>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    const waText = 
      `¡Hola Williams Cruz! Acabo de completar el test en la página web para el estudio de Abono Inteligente:\n\n` +
      `👤 Titular ante el Banco: ${answers.nombre}\n` +
      `🏦 Banco: ${answers.banco}\n` +
      `🏠 Tipo de Crédito: ${answers.tipoSociedad}\n` +
      `💵 Deuda aprox: ${answers.montoDeuda}\n` +
      `📈 Podría subirle a la cuota (Abono Inteligente): ${answers.abonoInteligente || 'A evaluar'}\n` +
      (answers.cuotaActual ? `💳 Cuota mensual actual: ${answers.cuotaActual}\n` : '') +
      `\nDeseo validar la viabilidad técnica con mi extracto bancario para confirmar cuánto tiempo e intereses puedo ahorrar.`;

    const waLink = `https://wa.me/573169773057?text=${encodeURIComponent(waText)}`;

    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '28px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <CheckCircle2 size={56} color="#10b981" />
        <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-dark)', margin: 0 }}>
          ¡Solicitud de Abono Inteligente Recibida!
        </h3>
        
        <p style={{ color: 'var(--text-medium)', fontSize: '13.5px', maxWidth: '420px', margin: 0, lineHeight: '1.5' }}>
          Hola <strong>{answers.nombre}</strong>, hemos registrado tu información con <strong>{answers.banco}</strong> y tu proyección de Abono Inteligente.
        </p>

        {/* Resumen Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '14px 16px',
          width: '100%',
          textAlign: 'left',
          fontSize: '12.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div>🏦 <strong>Banco:</strong> {answers.banco} ({answers.tipoSociedad})</div>
          <div>💰 <strong>Deuda aprox:</strong> {answers.montoDeuda}</div>
          <div>📈 <strong>Abono Inteligente proyectado:</strong> {answers.abonoInteligente}</div>
          {answers.cuotaActual && <div>💳 <strong>Cuota actual:</strong> {answers.cuotaActual}</div>}
        </div>

        {/* WhatsApp Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#25D366',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
            width: '100%',
          }}
        >
          <MessageCircle size={18} /> Chatear con Williams Cruz en WhatsApp
        </a>

        {/* PDF Link Button */}
        <a
          href="/simulador"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.08)',
            color: 'var(--accent-blue)',
            padding: '11px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '12.5px',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          <FileCheck size={16} /> ¿Tienes tu extracto bancario? Adjúntalo para auditoría aquí
        </a>

        <button 
          type="button" 
          onClick={() => { 
            setStep(1); 
            setIsSuccess(false); 
            setAnswers({ 
              tipoSociedad: '', 
              banco: '', 
              montoDeuda: '', 
              abonoInteligente: '', 
              cuotaActual: '', 
              nombre: '', 
              celular: '', 
              correo: '' 
            }); 
          }}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '12.5px', textDecoration: 'underline' }}
        >
          Realizar otra consulta
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ 
      background: '#ffffff', 
      borderRadius: '16px', 
      padding: '28px', 
      boxShadow: 'var(--shadow-lg)', 
      border: '1px solid var(--border-light)',
      maxWidth: '520px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      perspective: '1000px',
    }}>
      {/* Indicador de Progreso superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
          PASO {step} DE 5
        </span>
        <div style={{ display: 'flex', gap: '6px', flex: 1, marginLeft: '16px', height: '6px' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                borderRadius: '3px',
                background: s <= step ? 'linear-gradient(90deg, var(--accent-blue), var(--primary-blue))' : 'var(--border-light)',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Area del Formulario con Transición AnimatePresence */}
      <div style={{ minHeight: '330px', position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Botones de navegación inferior */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '20px', 
        paddingTop: '14px', 
        borderTop: '1px solid var(--border-light)' 
      }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-light)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '600',
              fontSize: '13.5px'
            }}
          >
            <ChevronLeft size={16} /> Atrás
          </button>
        ) : (
          <div />
        )}

        {step < 5 && answers[([null, 'tipoSociedad', 'banco', 'montoDeuda', 'abonoInteligente'][step]) as keyof QuizAnswers] !== '' && (
          <button
            type="button"
            onClick={nextStep}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-blue)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              fontSize: '13.5px'
            }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
