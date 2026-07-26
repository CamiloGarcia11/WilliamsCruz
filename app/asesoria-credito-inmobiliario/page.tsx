'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Shield, Building, Landmark, PiggyBank, FileCheck, MessageCircle, Users, Star, TrendingDown, Briefcase, UserCheck } from 'lucide-react';
import AnimatedTitle from '../../components/animations/AnimatedTitle';
import Card3D from '../../components/ui/Card3D';
import ButtonPulse from '../../components/ui/ButtonPulse';
import SubtleGridBg from '../../components/animations/SubtleGridBg';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function AsesoriaCredito() {
  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
         1. HERO
         ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 60px', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...fade} style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-yellow)' }}>
              <Landmark size={16} /> Asesoría Especializada en Crédito Inmobiliario
            </span>

            <AnimatedTitle tag="h1" style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.15', color: 'var(--primary-dark)', letterSpacing: '-1px' }}>
              Tu Vivienda Propia con las{' '}
              <span className="text-gradient-blue">Mejores Condiciones</span> del Mercado
            </AnimatedTitle>

            <p style={{ fontSize: '17px', color: 'var(--text-medium)', lineHeight: '1.65', maxWidth: '680px' }}>
              Te acompaño en todo el proceso de financiación para la compra de tu vivienda nueva o usada a través de <strong>Banco Caja Social</strong>, una de las entidades con mejores condiciones para vivienda de interés social y créditos inmobiliarios en Colombia.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%', maxWidth: '560px', marginTop: '12px' }}>
              {[
                { value: 'Desde 10.5%', label: 'Tasa E.A. Competitiva' },
                { value: 'Hasta 90%', label: 'Financiación VIS' },
                { value: 'Hasta 20', label: 'Años de Plazo' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg-light)', padding: '16px 12px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                  <strong style={{ fontSize: '22px', fontWeight: '900', color: 'var(--accent-blue)', display: 'block' }}>{s.value}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <ButtonPulse
              variant="primary"
              onClick={() => window.open('https://wa.me/573155030333?text=Hola Williams! Me interesa la asesor%C3%ADa para cr%C3%A9dito de vivienda con Banco Caja Social.', '_blank')}
              style={{ marginTop: '8px' }}
            >
              Solicitar Asesoría Gratuita <MessageCircle size={18} />
            </ButtonPulse>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         2. ¿POR QUÉ CAJA SOCIAL?
         ══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--primary-navy)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Alianza Estratégica
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginTop: '8px' }}>
              ¿Por Qué Banco Caja Social para Tu Crédito?
            </AnimatedTitle>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Banco Caja Social tiene más de 110 años de trayectoria y es líder en financiación de vivienda social en Colombia.
            </p>
          </div>

          <div className="grid-3">
            {[
              { icon: <TrendingDown size={24} color="var(--accent-yellow-bright)" />, title: 'Tasas Competitivas', desc: 'Tasas de interés por debajo del promedio del mercado bancario, especialmente para créditos VIS y VIP. Tu cuota mensual será significativamente menor.' },
              { icon: <Shield size={24} color="var(--accent-yellow-bright)" />, title: 'Subsidio FRECH', desc: 'Compatible con el subsidio de tasa del Gobierno Nacional (FRECH) para vivienda de interés social. Hasta 84 meses de cuota reducida con apoyo del Estado.' },
              { icon: <PiggyBank size={24} color="var(--accent-yellow-bright)" />, title: 'Financiación Hasta el 90%', desc: 'Para viviendas VIS, Caja Social financia hasta el 90% del valor del inmueble. Solo necesitas el 10% de cuota inicial para empezar.' },
              { icon: <Building size={24} color="var(--accent-yellow-bright)" />, title: 'Leasing Habitacional', desc: 'Opción de leasing con beneficios tributarios ideales para independientes y profesionales. Tu canon mensual incluye un ahorro en impuestos.' },
              { icon: <FileCheck size={24} color="var(--accent-yellow-bright)" />, title: 'Crédito para Vivienda Usada', desc: 'No solo financia vivienda nueva. Accede a excelentes condiciones para compra de vivienda usada en todo el territorio nacional.' },
              { icon: <Star size={24} color="var(--accent-yellow-bright)" />, title: 'Sin Cobros Ocultos', desc: 'Transparencia total desde el día uno. Te explicamos cada costo del proceso: estudio de crédito, seguros, gastos notariales y registro.' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fade} transition={{ duration: 0.5, delay: idx * 0.08 }}>
                <Card3D variant="dark" glowColor="yellow">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px' }}>
                    {item.icon}
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>{item.title}</h3>
                    <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.55' }}>{item.desc}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         3. PROCESO PASO A PASO
         ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Metodología Clara y Transparente
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              Proceso de Asesoría Paso a Paso
            </AnimatedTitle>
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { step: 1, title: 'Consulta Inicial Gratuita', desc: 'Analizamos tu perfil financiero, ingresos y capacidad de endeudamiento sin ningún costo ni compromiso. Evaluamos si cumples los requisitos básicos.', icon: <Users size={20} /> },
              { step: 2, title: 'Simulación Personalizada', desc: 'Calculamos la cuota mensual exacta, el monto máximo a financiar, los costos asociados al crédito (seguros, estudio, notaría) y el flujo de caja mensual.', icon: <TrendingDown size={20} /> },
              { step: 3, title: 'Pre-Aprobación del Crédito', desc: 'Radicamos tu solicitud directamente ante Banco Caja Social con toda la documentación necesaria. Te acompañamos en cada requerimiento del banco.', icon: <FileCheck size={20} /> },
              { step: 4, title: 'Avalúo y Estudio de Títulos', desc: 'Acompañamiento completo en el avalúo del inmueble y la verificación jurídica de la propiedad para garantizar que todo esté en orden legal.', icon: <Building size={20} /> },
              { step: 5, title: 'Desembolso', desc: 'Te acompañamos hasta la firma de escritura pública ante notaría y el desembolso efectivo del crédito. Tu vivienda propia es una realidad.', icon: <Landmark size={20} /> },
            ].map((item, idx) => (
              <motion.div key={idx} {...fade} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                <div style={{ display: 'flex', gap: '20px', paddingBottom: idx < 4 ? '32px' : '0', position: 'relative' }}>
                  {/* Timeline Line */}
                  {idx < 4 && (
                    <div style={{ position: 'absolute', left: '19px', top: '44px', width: '2px', height: 'calc(100% - 44px)', background: 'linear-gradient(to bottom, var(--accent-blue), var(--border-light))' }} />
                  )}
                  {/* Step Circle */}
                  <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '50%', background: 'var(--accent-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', boxShadow: 'var(--shadow-glow-blue)', zIndex: 1 }}>
                    {item.step}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {item.icon} {item.title}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         4. REQUISITOS
         ══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)' }}>
              Requisitos Básicos para Aplicar
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '500px', margin: '8px auto 0 auto' }}>
              Verifica si cumples con los requisitos antes de agendar tu consulta gratuita.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '24px' }}>
            {/* Empleados */}
            <motion.div {...fade}>
              <Card3D variant="light" glowColor="blue">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={22} color="var(--accent-blue)" />
                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--primary-dark)' }}>Empleados</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Ingresos mínimos de 1 SMMLV ($1.300.000 aprox.)',
                      'Antigüedad laboral mínima de 6 meses',
                      'Cédula de ciudadanía vigente',
                      'Certificado laboral y últimos 3 desprendibles de nómina',
                      'Declaración de renta (si aplica por ingresos)',
                      'Buen historial crediticio (no estar reportado)',
                    ].map((req, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: '1.4' }}>
                        <CheckCircle size={16} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card3D>
            </motion.div>

            {/* Independientes */}
            <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }}>
              <Card3D variant="light" glowColor="yellow">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserCheck size={22} color="var(--accent-yellow)" />
                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--primary-dark)' }}>Independientes</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      'Ingresos demostrables y estables',
                      'Certificado de Cámara de Comercio o RUT activo',
                      'Extractos bancarios de los últimos 3 meses',
                      'Declaración de renta de los últimos 2 años',
                      'Referencias comerciales y bancarias',
                      'Buen historial crediticio (no estar reportado)',
                    ].map((req, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: '1.4' }}>
                        <CheckCircle size={16} color="var(--accent-yellow)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card3D>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         5. CTA FINAL
         ══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-dark) 100%)' }}>
        <div className="container">
          <motion.div {...fade} style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff' }}>
              Comienza el Proceso de Tu Crédito de Vivienda Hoy
            </AnimatedTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.6' }}>
              No esperes más para dar el paso hacia tu vivienda propia. La consulta inicial es <strong style={{ color: 'var(--accent-yellow-bright)' }}>100% gratuita</strong> y sin compromiso.
            </p>

            <ButtonPulse
              variant="primary"
              pulse={true}
              onClick={() => window.open('https://wa.me/573155030333?text=Hola Williams! Me interesa la asesor%C3%ADa para cr%C3%A9dito de vivienda con Banco Caja Social.', '_blank')}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '16px 32px',
                fontSize: '16px',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
              }}
            >
              Solicitar Asesoría por WhatsApp <MessageCircle size={20} />
            </ButtonPulse>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>
              Sin costo de estudio • Sin compromiso • Respuesta en menos de 48 horas hábiles
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
