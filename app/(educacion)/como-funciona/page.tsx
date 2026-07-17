'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, HelpCircle, FileText, CheckSquare, Sparkles, Building, Milestone, ShieldCheck, Calculator } from 'lucide-react';
import Card3D from '../../../components/ui/Card3D';
import ButtonPulse from '../../../components/ui/ButtonPulse';
import AnimatedTitle from '../../../components/animations/AnimatedTitle';

export default function ComoFuncionaPage() {
  return (
    <div style={{ position: 'relative', background: 'var(--bg-light)', padding: '60px 0 100px 0' }}>
      
      {/* HEADER SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.08)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>
              <BookOpen size={16} /> Guía Interactiva Educativa
            </div>
            <AnimatedTitle
              tag="h1"
              style={{ fontSize: '38px', fontWeight: '900', color: 'var(--primary-dark)', maxWidth: '800px', lineHeight: '1.2' }}
            >
              ¿Cómo funciona la <span className="text-gradient-blue">Reducción de Crédito</span> por Ley de Vivienda?
            </AnimatedTitle>
            <p style={{ color: 'var(--text-medium)', fontSize: '16px', maxWidth: '600px' }}>
              La Ley 546 de 1999 ampara a todos los deudores hipotecarios en Colombia, permitiendo abonar directamente al capital para ahorrar intereses y reducir tiempo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* EDUCATIONAL CORE: ORIGINAL VS LEY DE VIVIENDA */}
      <section style={{ marginBottom: '80px' }}>
        <div className="container">
          <div className="grid-2">
            
            {/* Plan Tradicional del Banco */}
            <Card3D variant="light" tilt={true} maxRotation={6}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Esquema Tradicional
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  🏦 Amortización del Banco
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-medium)' }}>
                  En los primeros 10 años de un crédito a 15 o 20 años, la mayor parte de tu cuota mensual se destina únicamente a pagar **intereses y seguros**, amortizando muy poco capital.
                </p>
                <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px', fontSize: '13px', color: 'var(--text-medium)' }}>
                  ❌ Pagas hasta 3 veces el valor que te prestaron inicialmente en puros intereses.
                </div>
              </div>
            </Card3D>

            {/* Plan Ley de Vivienda */}
            <Card3D variant="navy" glowColor="yellow" tilt={true} maxRotation={6} className="glow-card-yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Esquema Abono Inteligente
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
                  ✨ Reducción por Ley de Vivienda
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                  Realizamos un estudio para inyectar abonos inteligentes directo a capital. La Ley obliga al banco a recalcular el tiempo, permitiéndote extinguir la deuda mucho antes.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: 'var(--accent-yellow-bright)' }}>
                  ✅ Reducción del plazo hasta del 50% y ahorro directo de hasta un 60% de intereses.
                </div>
              </div>
            </Card3D>

          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE ROADMAP */}
      <section style={{ position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <AnimatedTitle style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-dark)' }}>
              Nuestro Proceso en 5 Pasos Sencillos
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>
              Desde el análisis gratuito hasta la aprobación bancaria.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
            
            {/* Conector visual lineal vertical */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '20px',
              bottom: '20px',
              width: '4px',
              background: 'linear-gradient(180deg, var(--accent-blue), var(--accent-yellow))',
              zIndex: 0,
              borderRadius: '2px'
            }} />

            {[
              {
                num: '1',
                title: 'Envío de Extracto Hipotecario',
                desc: 'Nos envías el último extracto de tu crédito de vivienda actual en formato PDF o foto legible. Este análisis no afecta tu historial de crédito ni tiene costo.',
                icon: <FileText size={20} color="#ffffff" />,
                bg: 'var(--accent-blue)',
              },
              {
                num: '2',
                title: 'Estudio Financiero Gratis',
                desc: 'Nuestros analistas realizan una simulación matemática exacta comparando las opciones de reducción (ej: reducir plazo manteniendo cuota similar o reduciendo cuota). Te presentamos la propuesta de ahorro.',
                icon: <Calculator size={20} color="#ffffff" />,
                bg: 'var(--accent-blue)',
              },
              {
                num: '3',
                title: 'Radicación de la Solicitud',
                desc: 'Elaboramos los requerimientos y argumentos jurídicos sustentados en la Ley de Vivienda de 1999 y los radicamos directamente ante el área jurídica de tu banco.',
                icon: <Building size={20} color="#ffffff" />,
                bg: 'var(--accent-blue)',
              },
              {
                num: '4',
                title: 'Trámite y Aprobación Bancaria',
                desc: 'Hacemos seguimiento continuo de la radicación. El banco aprueba la solicitud y genera la modificación en sus sistemas contables (este paso toma entre 30 a 60 días según el banco).',
                icon: <ShieldCheck size={20} color="#ffffff" />,
                bg: 'var(--accent-yellow)',
              },
              {
                num: '5',
                title: 'Cobro Contra Resultados',
                desc: 'Una vez que se genera tu nuevo extracto bancario oficial reflejando los años reducidos y el ahorro de intereses, emitimos nuestros honorarios. ¡Solo pagas si ganamos!',
                icon: <Sparkles size={20} color="#ffffff" />,
                bg: 'var(--accent-yellow)',
              },
            ].map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  display: 'flex',
                  gap: '24px',
                  position: 'relative',
                  zIndex: 1,
                  alignItems: 'start',
                }}
              >
                {/* Círculo indicador */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: step.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  flexShrink: 0,
                }}>
                  {step.icon}
                </div>

                {/* Contenido descriptivo */}
                <div style={{
                  background: '#ffffff',
                  padding: '24px',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-light)',
                  flex: 1,
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: step.bg, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Paso {step.num}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* DEDICATED CTA */}
      <section style={{ textAlign: 'center', marginTop: '80px' }}>
        <div className="container">
          <Card3D variant="glass" tilt={false} className="shadow-lg" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary-dark)' }}>
                ¿Listo para ver tu proyección de ahorro?
              </h3>
              <p style={{ color: 'var(--text-medium)', fontSize: '15px', maxWidth: '500px' }}>
                Usa nuestro simulador interactivo gratuito o solicita el agendamiento directo con un experto.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <ButtonPulse variant="primary" onClick={() => window.location.href = '/simulador'}>
                  Ir al Simulador Avanzado
                </ButtonPulse>
                <ButtonPulse variant="secondary" onClick={() => window.location.href = '/agendar'} pulse={false}>
                  Agendar Cita Directa
                </ButtonPulse>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

    </div>
  );
}
