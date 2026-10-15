'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SimuladorAhorro from '../../../components/interactive/SimuladorAhorro';
import Card3D from '../../../components/ui/Card3D';
import { ShieldCheck, AlertCircle, Award, Scale, HelpCircle } from 'lucide-react';
import AnimatedTitle from '../../../components/animations/AnimatedTitle';

export default function SimuladorPage() {
  return (
    <div style={{ background: 'var(--bg-light)', padding: '60px 0 100px 0', minHeight: '80vh' }}>
      
      {/* HEADER SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.08)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>
              <ShieldCheck size={16} /> Asesoría Segura Bajo la Ley 546 de 1999
            </div>
            <AnimatedTitle
              tag="h1"
              style={{ fontSize: '38px', fontWeight: '900', color: 'var(--primary-dark)' }}
            >
              Estudio y Diagnóstico de Reducción Hipotecaria
            </AnimatedTitle>
            <p style={{ color: 'var(--text-medium)', fontSize: '16px', maxWidth: '640px', lineHeight: '1.6' }}>
              Por la seguridad de tu patrimonio, no arriesgues tu crédito con cálculos automáticos imprecisos. Adjunta tu extracto bancario (PDF o foto) o evalúa la viabilidad de tu caso para un estudio legal y financiero seguro con Williams Cruz.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CORE SIMULATOR WRAPPER */}
      <section style={{ marginBottom: '60px' }}>
        <div className="container">
          <SimuladorAhorro />
        </div>
      </section>

      {/* INSTRUCTIONS & FAQS SECTION */}
      <section>
        <div className="container" style={{ maxWidth: '820px' }}>
          <Card3D variant="light" tilt={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '8px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle color="var(--accent-blue)" size={22} />
                <h3 style={{ fontSize: '19px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  Por qué es más seguro auditar tu extracto con nosotros:
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.65' }}>
                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid var(--accent-blue)' }}>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '4px' }}>
                    1. ¿Por qué es indispensable auditar tu extracto real?
                  </strong>
                  Los bancos en Colombia cobran seguros obligatorios (vida, incendio y terremoto) que cambian mensualmente, además de cobros comisionales o indexaciones en UVR. Un simulador genérico online no puede predecir estos cobros y puede inducir a errores graves o a falsas expectativas.
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid var(--accent-yellow)' }}>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '4px' }}>
                    2. ¿Por qué protegemos las cifras preliminares?
                  </strong>
                  Para radicar una solicitud exitosa bajo la Ley 546 de 1999 ante tu banco, la ingeniería financiera debe coincidir exactamente con el extracto más reciente. Dejarte con la duda constructiva nos permite contactarte directamente, revisar tu documentación y evitar que tu banco rechace la reducción.
                </div>

                <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                  <strong style={{ color: 'var(--primary-dark)', display: 'block', marginBottom: '4px' }}>
                    3. ¿Tiene algún costo o anticipo el estudio?
                  </strong>
                  No. El estudio inicial es <strong>100% gratuito</strong>. Susfinanzas SAS y Williams Cruz trabajan con total garantía: <strong>cero anticipos</strong> y honorarios únicamente contra resultados formales aprobados en el extracto del banco.
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12.5px', color: 'var(--text-light)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={16} color="var(--accent-blue)" /> Supervisados por Supersociedades
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} color="var(--accent-yellow)" /> Marca Registrada • Ley 546 de 1999
                </span>
              </div>

            </div>
          </Card3D>
        </div>
      </section>

    </div>
  );
}
