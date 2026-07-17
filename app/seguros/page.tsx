'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, AlertTriangle, Heart, Flame, Umbrella, MessageCircle, DollarSign, FileSearch, TrendingDown, Star, Search } from 'lucide-react';
import AnimatedTitle from '../../components/animations/AnimatedTitle';
import Card3D from '../../components/ui/Card3D';
import ButtonPulse from '../../components/ui/ButtonPulse';
import SubtleGridBg from '../../components/animations/SubtleGridBg';

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function SegurosPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
         1. HERO
         ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 60px', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...fade} style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.08)', padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>
              <Shield size={16} /> Seguros Asociados a Tu Crédito de Vivienda
            </span>

            <AnimatedTitle tag="h1" style={{ fontSize: '42px', fontWeight: '900', lineHeight: '1.15', color: 'var(--primary-dark)', letterSpacing: '-1px' }}>
              Protege Tu Patrimonio{' '}
              <span className="text-gradient-blue">Sin Pagar de Más</span>
            </AnimatedTitle>

            <p style={{ fontSize: '17px', color: 'var(--text-medium)', lineHeight: '1.65', maxWidth: '680px' }}>
              Los seguros asociados a tu crédito hipotecario son <strong>obligatorios por ley</strong>, pero eso no significa que debas pagar más de lo justo. Te ayudamos a revisar, optimizar y gestionar tus pólizas para que pagues lo correcto y protejas tu vivienda de forma inteligente.
            </p>

            {/* Alert stat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(245, 158, 11, 0.08)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)', maxWidth: '560px' }}>
              <AlertTriangle size={24} color="var(--accent-yellow)" style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: 'var(--primary-dark)', fontSize: '15px', display: 'block' }}>Hasta 40% de sobrecosto detectado</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-medium)' }}>en seguros hipotecarios analizados por nuestro equipo de auditoría financiera.</span>
              </div>
            </div>

            <ButtonPulse
              variant="primary"
              onClick={() => window.open('https://wa.me/573155030333?text=Hola Williams! Me interesa la auditor%C3%ADa de seguros de mi cr%C3%A9dito hipotecario.', '_blank')}
              style={{ marginTop: '4px' }}
            >
              Solicitar Auditoría de Seguros <Search size={18} />
            </ButtonPulse>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         2. TIPOS DE SEGUROS OBLIGATORIOS
         ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Conoce Tus Pólizas
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              Seguros Asociados a Tu Crédito de Vivienda
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '620px', margin: '8px auto 0 auto' }}>
              Entiende qué cubre cada seguro, por qué es obligatorio y cómo puedes verificar que te estén cobrando lo justo.
            </p>
          </div>

          <div className="grid-3">
            {/* Vida Grupo */}
            <motion.div {...fade}>
              <Card3D variant="light" glowColor="blue">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={22} color="#ef4444" />
                    <span style={{ padding: '3px 8px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', fontSize: '10px', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>Obligatorio</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)' }}>Seguro de Vida Grupo Deudores</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {[
                      'Cubre el saldo total de la deuda en caso de fallecimiento o incapacidad total y permanente del titular.',
                      'El banco lo cobra mensualmente dentro de tu cuota hipotecaria.',
                      'La prima debe disminuir proporcionalmente a medida que baja el saldo de tu crédito.',
                      'Es el seguro donde más frecuentemente detectamos sobrecostos y cobros excesivos.',
                    ].map((t, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px', color: 'var(--text-medium)', lineHeight: '1.45' }}>
                        <CheckCircle size={14} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '3px' }} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card3D>
            </motion.div>

            {/* Incendio y Terremoto */}
            <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }}>
              <Card3D variant="light" glowColor="yellow">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={22} color="#f59e0b" />
                    <span style={{ padding: '3px 8px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', fontSize: '10px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase' }}>Obligatorio</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)' }}>Seguro de Incendio y Terremoto</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {[
                      'Protege el inmueble hipotecado contra daños por incendio, terremoto, explosión y otros eventos catastróficos.',
                      'Es obligatorio mientras exista la obligación hipotecaria con el banco.',
                      'El valor asegurado debe corresponder al valor de reconstrucción del inmueble, NO al valor comercial.',
                      'Un error común: calcular la prima sobre el valor comercial genera sobrecostos importantes.',
                    ].map((t, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px', color: 'var(--text-medium)', lineHeight: '1.45' }}>
                        <CheckCircle size={14} color="var(--accent-yellow)" style={{ flexShrink: 0, marginTop: '3px' }} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card3D>
            </motion.div>

            {/* Desempleo */}
            <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card3D variant="light" glowColor="blue">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Umbrella size={22} color="var(--accent-blue)" />
                    <span style={{ padding: '3px 8px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '12px', fontSize: '10px', fontWeight: '700', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Opcional</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)' }}>Seguro de Desempleo</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {[
                      'Seguro opcional que cubre entre 3 y 6 cuotas mensuales en caso de pérdida involuntaria del empleo.',
                      'No todos los bancos lo ofrecen y su costo varía considerablemente entre entidades.',
                      'Williams te asesora sobre si realmente te conviene contratarlo según tu perfil laboral y financiero.',
                      'En algunos casos el costo no justifica el beneficio. Te damos un análisis objetivo.',
                    ].map((t, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '13px', color: 'var(--text-medium)', lineHeight: '1.45' }}>
                        <CheckCircle size={14} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '3px' }} /> {t}
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
         3. PROBLEMAS COMUNES
         ══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: 'var(--primary-navy)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Atención: Revisa Tu Extracto
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginTop: '8px' }}>
              ¿Sabías Que Podrías Estar Pagando de Más?
            </AnimatedTitle>
          </div>

          <div className="grid-2" style={{ gap: '20px' }}>
            {[
              { title: 'Primas Infladas', desc: 'Algunos bancos negocian pólizas colectivas con aseguradoras a tarifas preferenciales, pero trasladan al cliente tarifas por encima del promedio del mercado, generando márgenes ocultos.' },
              { title: 'Base de Cálculo Incorrecta', desc: 'El seguro de incendio y terremoto debe calcularse sobre el valor de reconstrucción del inmueble, no sobre el valor comercial. Este error puede significar hasta un 30% de sobrecosto mensual.' },
              { title: 'Prima de Vida No Actualizada', desc: 'A medida que pagas tu crédito, el saldo disminuye. La prima de vida debería reducirse proporcionalmente. Muchos bancos no ajustan este valor automáticamente.' },
              { title: 'Cobros No Autorizados', desc: 'Seguros adicionales como desempleo, asistencia hogar o pólizas todo riesgo incluidos en tu cuota sin tu autorización explícita. Revisa cada línea de tu extracto.' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fade} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                <div style={{ display: 'flex', gap: '14px', background: 'rgba(255, 255, 255, 0.04)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <AlertTriangle size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.55' }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Highlight */}
          <motion.div {...fade} style={{ marginTop: '40px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(34, 197, 94, 0.08)', padding: '18px 28px', borderRadius: '14px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <DollarSign size={28} color="#22c55e" />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#22c55e', fontSize: '18px', display: 'block' }}>$15.000 a $45.000 de ahorro mensual</strong>
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>promedio que nuestros clientes ahorran solo optimizando sus seguros hipotecarios.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
         4. NUESTRO SERVICIO
         ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)' }}>
              ¿Qué Hacemos por Ti?
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '560px', margin: '8px auto 0 auto' }}>
              Nuestro proceso de auditoría de seguros es riguroso, transparente y sin costo inicial.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              { step: '01', icon: <FileSearch size={28} color="var(--accent-blue)" />, title: 'Auditoría de Pólizas', desc: 'Revisamos detalladamente cada seguro cobrado en tu extracto bancario mensual.' },
              { step: '02', icon: <Search size={28} color="var(--accent-yellow)" />, title: 'Detección de Sobrecostos', desc: 'Comparamos tus primas contra las tarifas vigentes del mercado asegurador colombiano.' },
              { step: '03', icon: <Shield size={28} color="var(--accent-blue)" />, title: 'Gestión de Reclamación', desc: 'Si detectamos cobros excesivos, radicamos la solicitud de ajuste directamente ante tu banco.' },
              { step: '04', icon: <Star size={28} color="var(--accent-yellow)" />, title: 'Seguimiento', desc: 'Verificamos que el ajuste se refleje correctamente en tu próximo extracto bancario.' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fade} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                <div style={{ background: '#ffffff', padding: '28px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', height: '100%', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-blue)', letterSpacing: '0.5px' }}>PASO {item.step}</span>
                  {item.icon}
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-dark)' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
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
              Solicita Tu Auditoría de Seguros Gratuita
            </AnimatedTitle>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.6' }}>
              Envíanos tu último extracto bancario y te diremos exactamente cuánto podrías estar ahorrando en seguros. La auditoría es <strong style={{ color: 'var(--accent-yellow-bright)' }}>100% gratuita</strong>.
            </p>

            <ButtonPulse
              variant="primary"
              pulse={true}
              onClick={() => window.open('https://wa.me/573155030333?text=Hola Williams! Me interesa la auditor%C3%ADa de seguros de mi cr%C3%A9dito hipotecario.', '_blank')}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '16px 32px',
                fontSize: '16px',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
              }}
            >
              Solicitar Auditoría por WhatsApp <MessageCircle size={20} />
            </ButtonPulse>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '600' }}>
              Auditoría sin costo • Sin compromiso • Resultado en 48 horas
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
