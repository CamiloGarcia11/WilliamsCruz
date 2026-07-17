'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, PiggyBank, ArrowRight, Star, CheckCircle } from 'lucide-react';
import SimuladorAhorro from '../components/interactive/SimuladorAhorro';
import QuizFinanciero from '../components/interactive/QuizFinanciero';
import Card3D from '../components/ui/Card3D';
import ButtonPulse from '../components/ui/ButtonPulse';
import AnimatedTitle from '../components/animations/AnimatedTitle';
import FinancialEcosystem3D from '../components/interactive/FinancialEcosystem3D';
import FloatingNetwork3D from '../components/interactive/FloatingNetwork3D';
import Floating3DGeometries from '../components/interactive/Floating3DGeometries';
import SubtleGridBg from '../components/animations/SubtleGridBg';

export default function Home() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 100px 0',
          background: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            {/* Texto del Hero */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  alignSelf: 'flex-start',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--accent-blue)',
                }}
              >
                <Sparkles size={16} /> Williams Cruz | Asesor Financiero Independiente
              </div>

              <AnimatedTitle
                tag="h1"
                style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  lineHeight: '1.15',
                  color: 'var(--primary-dark)',
                  letterSpacing: '-1px',
                }}
              >
                Rediseñamos Futuros <br />
                <span className="text-gradient-blue">Liberamos vidas</span>
              </AnimatedTitle>

              <p style={{ fontSize: '17px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                Con el respaldo de más de 1.000 profesionales aliados a nivel nacional, te ayudo a liberarte de la deuda hipotecaria a través de un sistema estratégico y humano que transforma el miedo financiero en confianza y tranquilidad.
              </p>

              <div
                style={{
                  padding: '16px 20px',
                  background: 'var(--bg-light)',
                  borderLeft: '4px solid var(--accent-yellow)',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '14px',
                  color: 'var(--text-medium)',
                  fontWeight: '500',
                }}
              >
                🔒 <strong>Estudio Sin Costo:</strong> Si tienes un crédito de vivienda o leasing habitacional, solicita un análisis personalizado para descubrir cuánto tiempo e intereses puedes ahorrar en tu deuda actual.
                <div style={{ color: 'var(--accent-blue)', fontWeight: '700', marginTop: '6px' }}>
                  📈 Ahorro de HASTA el 40% en intereses totales.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>
                <span style={{ color: 'var(--accent-yellow)', fontSize: '18px' }}>★★★★★</span>
                <span>Haciendo de Colombia un país de MENOS deudores y MÁS propietarios.</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                <ButtonPulse variant="primary" onClick={() => scrollToSection('simulador-ahorro')}>
                  Simular mi Ahorro <ArrowRight size={18} />
                </ButtonPulse>
                <ButtonPulse variant="outline" onClick={() => scrollToSection('servicios-categorias')} pulse={false}>
                  Ver Servicios y Categorías
                </ButtonPulse>
              </div>
            </motion.div>

            {/* Elemento 3D Visual Hero - REDESIGNED WITH DYNAMIC 3D ECOSYSTEM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                height: '380px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-light)',
                alignSelf: 'center',
                justifySelf: 'center',
              }}
            >
              <FinancialEcosystem3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DIVISION DE SERVICIOS POR CATEGORIAS */}
      <section id="servicios-categorias" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Portafolio de Asesoría
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              División de Servicios y Soluciones
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Encuentra la solución ideal para optimizar o asegurar tu financiación de vivienda, explicada de forma clara y sin presiones.
            </p>
          </div>

          <div className="grid-2">
            {/* Categoría 1: Reducción Hipotecaria */}
            <Card3D variant="light" glowColor="blue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '20px', color: 'var(--accent-blue)', fontSize: '12px', fontWeight: '700' }}>
                    SERVICIO PRINCIPAL (FUERTE)
                  </span>
                  <Shield color="var(--accent-blue)" size={24} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    📉 Reducción de Crédito Hipotecario
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                    Optimizamos la estructura de tu deuda hipotecaria o leasing habitacional actual bajo la <strong>Ley 546 de 1999</strong>. Reducimos el tiempo de tu crédito (ej. de 15 a 8 años) y te ahorramos hasta el 40% en intereses totales sin cambiarte de banco ni aumentar significativamente tu cuota.
                  </p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-medium)', flex: 1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-blue)" /> Tu crédito permanece en tu banco actual.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-blue)" /> Honorarios cobrados únicamente al finalizar con éxito.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-blue)" /> Estudio y análisis de viabilidad financiera 100% gratis.
                  </li>
                </ul>

                <ButtonPulse variant="primary" onClick={() => scrollToSection('simulador-ahorro')} style={{ marginTop: '12px' }}>
                  Simular Reducción Ahora
                </ButtonPulse>
              </div>
            </Card3D>

            {/* Categoría 2: Asesoría de Créditos Inmobiliarios */}
            <Card3D variant="light" glowColor="yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '20px', color: 'var(--accent-yellow)', fontSize: '12px', fontWeight: '700' }}>
                    NUEVA FINANCIACIÓN e INMOBILIARIO
                  </span>
                  <PiggyBank color="var(--accent-yellow)" size={24} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    🏠 Asesoría de Créditos Inmobiliarios
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                    Te acompaño en el proceso de conseguir las mejores condiciones de financiación para la compra de tu vivienda nueva o usada. Analizamos las tasas de interés de múltiples entidades financieras y te ayudamos a radicar y preaprobar tu crédito de manera ágil.
                  </p>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-medium)', flex: 1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-yellow)" /> Comparativo objetivo de tasas efectivas y costos de seguros.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-yellow)" /> Estructuración de perfil para compra de cartera hipotecaria.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="var(--accent-yellow)" /> Acompañamiento personalizado desde el preaprobado hasta el desembolso.
                  </li>
                </ul>

                <ButtonPulse variant="outline" onClick={() => scrollToSection('quiz-lead')} style={{ marginTop: '12px' }} pulse={false}>
                  Consultar Preaprobado
                </ButtonPulse>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* 3. MÉTRICAS Y CASO DE ÉXITO DESTACADO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', backgroundColor: '#0b1329', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Floating3DGeometries />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Experiencia y Respaldo
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginTop: '8px' }}>
              Nuestra Experiencia es tu Respaldo
            </AnimatedTitle>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Con el amparo de la Ley 546 de 1999 y una red de más de 1.000 profesionales financieros aliados a nivel nacional.
            </p>
          </div>


          <div className="grid-2" style={{ alignItems: 'center' }}>
            {/* Lado izquierdo: Caso de éxito destacado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: 'var(--shadow-lg)' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--accent-yellow-bright)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  ★ Caso de Éxito Destacado
                </span>
                <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '20px' }}>
                  "Muchas gracias por el acompañamiento; la verdad es que ha sido una asesoría en la que hemos podido confiar plenamente y los resultados son reales. ¡Gracias de corazón por ayudarnos a reducir nuestra hipoteca!"
                </p>
                <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '15px' }}>Familia Velásquez Vásquez</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Beneficiados con Reducción de Plazo</div>
              </div>

              {/* Estadísticas en barras */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: '700', color: '#ffffff' }}>
                    <span>Plazos Acortados (Hasta 25 años)</span>
                    <span style={{ color: 'var(--accent-yellow-bright)' }}>99% Efectividad</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '99%', height: '100%', background: 'var(--accent-yellow)', borderRadius: '5px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: '700', color: '#ffffff' }}>
                    <span>Procesos Exitosos (+22.000 Familias)</span>
                    <span style={{ color: 'var(--accent-blue)' }}>95% Satisfacción</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', background: 'var(--accent-blue)', borderRadius: '5px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Lado derecho: Imagen de Equipo Aliado */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <Card3D variant="dark" glowColor="blue" maxRotation={6} style={{ padding: '0px', overflow: 'hidden', width: '100%', maxWidth: '420px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <img
                    src="/equipo-aliado.png"
                    alt="Nuestro Equipo, Tu Aliado Financiero"
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      objectFit: 'cover',
                      objectPosition: 'center 15%'
                    }}
                  />
                </div>
              </Card3D>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', maxWidth: '420px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: '900', color: 'var(--accent-blue)' }}>+22k</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '700' }}>Casos de Éxito</span>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ display: 'block', fontSize: '24px', fontWeight: '900', color: 'var(--accent-yellow-bright)' }}>Ley 546</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '700' }}>Amparo Jurídico</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALCULADORA INTERACTIVA DE AHORRO */}
      <section id="simulador-ahorro" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)' }}>
              Simula tu Ahorro Hipotecario en Tiempo Real
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Mueve los controles para ver cuántos millones en intereses y cuántos años de cuotas puedes restarle a tu deuda.
            </p>
          </div>

          <SimuladorAhorro />
        </div>
      </section>

      {/* 5. GUÍAS E INFORMACIÓN FINANCIERA */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', backgroundColor: 'var(--bg-light)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Guías y Recursos
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              Educación e Información Financiera
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Decisiones inteligentes y transparentes para proteger tu patrimonio de vivienda.
            </p>
          </div>

          <div className="grid-3">
            {/* Guía 1 */}
            <Card3D variant="light" glowColor="blue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                  Educación Financiera
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)', lineHeight: '1.3' }}>
                  ¿Con qué frecuencia deberías revisar tu crédito de vivienda?
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Mantener el control de tu crédito no debe ser un misterio. Monitorear tu extracto bancario mensualmente te permite vigilar que cada peso adicional amortice directamente a capital y que los cobros de seguros se mantengan en los niveles correctos para proteger tu dinero a largo plazo.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Lectura: 4 min</span>
                  <a href="#quiz-lead" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Consultar gratis <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </Card3D>

            {/* Guía 2 */}
            <Card3D variant="light" glowColor="yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>
                  Beneficios de Ley
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)', lineHeight: '1.3' }}>
                  ¿Puedo usar la Ley de Vivienda si mi crédito es reciente?
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Aplica de inmediato los beneficios de la Ley 546 de 1999 sin esperas innecesarias. Actuar tempranamente, incluso desde la primera cuota, te permite ahorrar la mayor cantidad de intereses futuros, reduciendo significativamente los plazos y protegiendo tu patrimonio familiar.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Lectura: 5 min</span>
                  <a href="#quiz-lead" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Consultar gratis <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </Card3D>

            {/* Guía 3 */}
            <Card3D variant="light" glowColor="blue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                  Amortización Inteligente
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-dark)', lineHeight: '1.3' }}>
                  Abono inteligente vs. abono tradicional: diferencias clave
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  El abono inteligente reestructura legalmente el plazo completo y la amortización del crédito bancario, logrando reducir años de cuotas e intereses. Los abonos tradicionales simples solo reducen la deuda de ese mes de forma pasiva, sin alterar la carga financiera a largo plazo.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>Lectura: 6 min</span>
                  <a href="#quiz-lead" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Consultar gratis <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* 6. QUIZ FUNNEL PARA CAPTAR LEADS */}
      <section
        id="quiz-lead"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '80px 0',
          background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--primary-dark) 100%)',
          color: '#ffffff',
        }}
      >
        <FloatingNetwork3D />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Estudio Financiero Sin Costo
              </span>
              <AnimatedTitle style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                ¿Califica tu crédito para reducción de plazo?
              </AnimatedTitle>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                No todos los créditos son iguales. Responde estas 5 preguntas rápidas para que Williams Cruz y su equipo calculen la viabilidad de tu caso y presenten una propuesta de optimización.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Estudio financiero 100% gratis', 'Respuesta en menos de 24 horas hábiles', 'Análisis personalizado bajo la Ley 546 de 1999'].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
                    <CheckCircle size={18} color="var(--accent-yellow-bright)" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quiz Dinámico */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QuizFinanciero />
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIOS CON TILT 3D */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)' }}>
              Opiniones de Clientes Satisfechos
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0 auto' }}>
              Descubre las valoraciones de personas que ya lograron asesorarse con éxito y optimizar su hipoteca.
            </p>
          </div>

          {/* Video Testimonio Destacado */}
          {/* Videos de Testimonios y Opiniones */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '32px', marginBottom: '48px', width: '100%' }}>
            
            {/* Video 1: YouTube Testimonio (Horizontal) */}
            <Card3D variant="light" glowColor="blue" style={{ padding: '0px', overflow: 'hidden', width: '100%', maxWidth: '540px', border: '1px solid var(--border-light)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-medium)', marginLeft: '8px' }}>
                  Video Testimonio: Experiencia de Éxito Real
                </span>
              </div>
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '16/9',
                  background: '#000000',
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/xWrkPvQNR-k?start=3"
                  title="Testimonio de cliente satisfecho"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            </Card3D>

            {/* Video 2: Local Video Opinión (Vertical - Estilo Reel/Shorts) */}
            <Card3D variant="light" glowColor="yellow" style={{ padding: '0px', overflow: 'hidden', width: '100%', maxWidth: '300px', border: '1px solid var(--border-light)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-medium)', marginLeft: '8px' }}>
                  Opinión del Cliente (Estudio Hipoteca)
                </span>
              </div>
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '9/16',
                  background: '#000000',
                }}
              >
                <video 
                  src="/opinion.mp4" 
                  controls 
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }}
                />
              </div>
            </Card3D>

          </div>

          <div className="grid-3" style={{ gap: '20px' }}>
            {[
              {
                nombre: 'Andrés Morales',
                banco: 'Davivienda',
                ahorro: 'Redujo de 15 a 9 años',
                texto: 'Estaba pagando una cuota altísima y sentía que todo se iba a intereses. Con la asesoría de Williams Cruz logré reducir 6 años de cuotas sin cambiarme de banco. Excelente servicio y muy transparente.',
                stars: 5,
              },
              {
                nombre: 'Sandra Milena',
                banco: 'Bancolombia',
                ahorro: 'Ahorro de $38 millones',
                texto: 'Mi banco no me explicaba cómo hacer abonos inteligentes de forma legal. Williams redactó toda la solicitud y en menos de 45 días ya tenía mi nuevo extracto con menos cuotas pendientes.',
                stars: 5,
              },
              {
                nombre: 'Carlos E. Restrepo',
                banco: 'Banco de Bogotá',
                ahorro: 'Redujo 7.5 años de plazo',
                texto: 'Excelente servicio. Hacen el estudio gratis y te dicen con exactitud cuánto ahorrarás. Todo el trámite es directo con tu banco actual. Muy satisfecho con el resultado y acompañamiento.',
                stars: 5,
              },
            ].map((t, idx) => (
              <Card3D key={idx} variant="light" glowColor="blue">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="var(--accent-yellow)" color="var(--accent-yellow)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-medium)', fontStyle: 'italic', flex: 1 }}>
                    "{t.texto}"
                  </p>
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '8px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)', fontSize: '15px' }}>{t.nombre}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-light)' }}>
                      <span>Banco: {t.banco}</span>
                      <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>{t.ahorro}</span>
                    </div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
