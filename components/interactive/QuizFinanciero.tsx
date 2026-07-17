'use strict';

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Landmark, Coins, FileText, User } from 'lucide-react';
import ButtonPulse from '../ui/ButtonPulse';
import { saveLeadToFirebase } from '../../lib/firebase/client';

interface QuizAnswers {
  tipoSociedad: string;
  banco: string;
  modalidad: string;
  montoDeuda: string;
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
    modalidad: '',
    montoDeuda: '',
    nombre: '',
    celular: '',
    correo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectOption = (field: keyof QuizAnswers, value: string) => {
    setAnswers({ ...answers, [field]: value });
    nextStep();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });
  };

  const nextStep = () => {
    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.nombre || !answers.celular || !answers.correo) {
      alert('Por favor completa todos los campos.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await saveLeadToFirebase(answers);
      if (res.success) {
        setIsSuccess(true);
      } else {
        alert('Hubo un problema al procesar tu solicitud, pero la guardamos localmente. Nos comunicaremos contigo.');
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Error en submit de formulario:', err);
      setIsSuccess(true); // Tratamos de no bloquear al usuario si hay fallos de red
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variantes para la animación de Giro 3D (Y-axis Card Flip)
  const flipVariants = {
    initial: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      transformPerspective: 1000,
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transformPerspective: 1000,
      transition: { duration: 0.4, ease: 'easeInOut' as const }
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      transformPerspective: 1000,
      transition: { duration: 0.4, ease: 'easeInOut' as const }
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
              <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>¿Qué tipo de inmueble tienes financiado?</h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Vivienda Familiar (Casa/Apto)', desc: 'Crédito residencial tradicional' },
                { label: 'Vivienda de Interés Social (VIS)', desc: 'Crédito subsidiado o tope VIS' },
                { label: 'Inmueble Comercial o Consultorio', desc: 'Locales, oficinas o bodegas' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption('tipoSociedad', opt.label)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: answers.tipoSociedad === opt.label ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.tipoSociedad === opt.label ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{opt.desc}</div>
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
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark color="var(--accent-blue)" size={24} />
              <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>¿Con qué banco tienes el crédito hipotecario?</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['Bancolombia', 'Davivienda', 'Banco de Bogotá', 'Caja Social', 'BBVA', 'Colpatria', 'FNA', 'Otro'].map((banco) => (
                <button
                  key={banco}
                  type="button"
                  onClick={() => handleSelectOption('banco', banco)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: answers.banco === banco ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.banco === banco ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    fontWeight: '600',
                    color: 'var(--primary-dark)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
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
              <Coins color="var(--accent-blue)" size={24} />
              <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>¿En qué moneda se encuentra el crédito?</h4>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Pesos ($)', desc: 'Tus cuotas se mantienen estables en pesos colombianos' },
                { label: 'UVR (Unidad de Valor Real)', desc: 'Tus cuotas varían de acuerdo a la inflación mensual' },
                { label: 'No estoy seguro / no sé', desc: 'Nosotros te ayudamos a verificarlo en tu extracto' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption('modalidad', opt.label)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: answers.modalidad === opt.label ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                    background: answers.modalidad === opt.label ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{opt.desc}</div>
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
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard color="var(--accent-blue)" size={24} />
              <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>¿Cuánto debes actualmente en tu crédito?</h4>
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
                    background: answers.montoDeuda === monto ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                    fontWeight: '700',
                    color: 'var(--primary-dark)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)',
                  }}
                >
                  {monto}
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
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', backfaceVisibility: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <User color="var(--accent-yellow)" size={24} />
              <h4 style={{ fontSize: '18px', fontWeight: 'bold' }}>¡Último paso! Déjanos tus datos de contacto</h4>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={answers.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Celular / WhatsApp</label>
                <input
                  type="tel"
                  name="celular"
                  value={answers.celular}
                  onChange={handleInputChange}
                  placeholder="Ej: 300 123 4567"
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={answers.correo}
                  onChange={handleInputChange}
                  placeholder="Ej: juan@ejemplo.com"
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>

              <ButtonPulse
                type="submit"
                variant="primary"
                className="w-full"
                pulse={true}
              >
                {isSubmitting ? 'Procesando...' : 'Calcular mi Reducción Ahora'}
              </ButtonPulse>
            </form>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <CheckCircle2 size={64} color="#10b981" />
        <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary-dark)' }}>
          ¡Estudio Solicitado con Éxito!
        </h3>
        <p style={{ color: 'var(--text-medium)', maxWidth: '400px' }}>
          Hemos recibido tu solicitud de reducción. Williams Cruz y su equipo de analistas financieros revisarán tu caso y te contactarán por WhatsApp en menos de 24 horas hábiles.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', width: '100%' }}>
          <ButtonPulse variant="secondary" onClick={() => window.location.href = '/agendar'}>
            Agendar Videollamada de Diagnóstico
          </ButtonPulse>
          <button 
            type="button" 
            onClick={() => { setStep(1); setIsSuccess(false); setAnswers({ tipoSociedad: '', banco: '', modalidad: '', montoDeuda: '', nombre: '', celular: '', correo: '' }); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
          >
            Volver a empezar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ 
      background: '#ffffff', 
      borderRadius: '16px', 
      padding: '32px', 
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
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
      <div style={{ minHeight: '320px', position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Botones de navegación inferior */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '24px', 
        paddingTop: '16px', 
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
              fontSize: '14px'
            }}
          >
            <ChevronLeft size={16} /> Atrás
          </button>
        ) : (
          <div />
        )}

        {step < 5 && answers[([null, 'tipoSociedad', 'banco', 'modalidad', 'montoDeuda'][step]) as keyof QuizAnswers] !== '' && (
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
              fontSize: '14px'
            }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
