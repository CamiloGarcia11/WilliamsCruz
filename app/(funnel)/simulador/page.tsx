'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SimuladorAhorro from '../../../components/interactive/SimuladorAhorro';
import Card3D from '../../../components/ui/Card3D';
import { Calculator, AlertCircle, RefreshCw } from 'lucide-react';
import AnimatedTitle from '../../../components/animations/AnimatedTitle';

export default function SimuladorPage() {
  return (
    <div style={{ background: 'var(--bg-light)', padding: '60px 0 100px 0', minHeight: '80vh' }}>
      
      {/* HEADER SECTION */}
      <section style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.08)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)' }}>
              <Calculator size={16} /> Analizador Financiero 100% Local
            </div>
            <AnimatedTitle
              tag="h1"
              style={{ fontSize: '38px', fontWeight: '900', color: 'var(--primary-dark)' }}
            >
              Analizador de Extractos Hipotecarios
            </AnimatedTitle>
            <p style={{ color: 'var(--text-medium)', fontSize: '16px', maxWidth: '600px' }}>
              Carga tu extracto de forma segura y privada. Nuestro analizador local calculará tu propuesta de reducción bajo la Ley 546 de 1999 de forma anónima e inmediata.
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
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card3D variant="light" tilt={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle color="var(--accent-blue)" size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                  Notas importantes sobre el simulador:
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                <p>
                  1. **¿Qué es la cuota pura?**
                  Los bancos cobran seguros (vida, incendio, terremoto) y a veces comisiones de manejo dentro de tu extracto. Este simulador calcula la **cuota pura de amortización** (capital + interés). Si tu cuota real es mayor, es debido a estos cargos adicionales del banco.
                </p>
                <p>
                  2. **¿Por qué varía el ahorro?**
                  El ahorro neto depende directamente de la tasa de interés de tu crédito. A mayor tasa de interés (como las vigentes actualmente), mayor es el impacto de los abonos inteligentes a capital y mayor será tu ahorro final.
                </p>
                <p>
                  3. **¿Cómo garantizo la validez?**
                  Nuestros cálculos se basan en fórmulas de amortización francesa certificada, que es la misma lógica que utilizan el 95% de los bancos en Colombia (Bancolombia, Davivienda, etc.).
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                <RefreshCw size={16} />
                <span>Última actualización de tasas promedio: Julio 2026.</span>
              </div>

            </div>
          </Card3D>
        </div>
      </section>

    </div>
  );
}
