'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  History, 
  Award, 
  Scale, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  Banknote,
  FileCheck,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Card3D from '../../components/ui/Card3D';
import ButtonPulse from '../../components/ui/ButtonPulse';
import AnimatedTitle from '../../components/animations/AnimatedTitle';
import SubtleGridBg from '../../components/animations/SubtleGridBg';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function EmpresaPage() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden', background: 'var(--bg-light)' }}>
      
      {/* 1. HERO INSTITUCIONAL */}
      <section
        style={{
          position: 'relative',
          padding: '90px 0 80px',
          background: 'radial-gradient(circle at 75% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%), var(--primary-navy)',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <SubtleGridBg />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '8px 20px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--accent-yellow-bright)',
              }}
            >
              <Award size={16} /> Marca Registrada | Supervisada por Supersociedades
            </motion.div>

            <AnimatedTitle
              tag="h1"
              style={{
                fontSize: '44px',
                fontWeight: '900',
                lineHeight: '1.15',
                color: '#ffffff',
                letterSpacing: '-1px',
              }}
            >
              ¿Qué es <span className="text-gradient-blue">Susfinanzas SAS</span>?
            </AnimatedTitle>

            <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.65' }}>
              Somos una compañía privada especializada en asesorar y gestionar ante las entidades bancarias la aplicación de la <strong>Ley de Vivienda (Ley 546 de 1999)</strong>. Reducimos el plazo de créditos hipotecarios y leasing habitacional para lograr los beneficios legales en favor de los deudores en Colombia.
            </p>

            {/* Badges Destacados de Garantía */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck color="var(--accent-yellow-bright)" size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>Marca Registrada</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Uso exclusivo y servicio 100% legal</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale color="var(--accent-blue)" size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>Supervisados por Supersociedades</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Cumplimiento riguroso de ley</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap color="var(--accent-yellow-bright)" size={22} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>Sin Anticipos</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>Garantía total contra resultados</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HISTORIA Y EVOLUCIÓN */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Nuestra Trayectoria
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              Historia de Susfinanzas SAS
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Desde nuestros inicios en 2012, nos hemos dedicado a perfeccionar el proceso de mejoramiento de créditos de vivienda en Colombia.
            </p>
          </motion.div>

          <div className="grid-2" style={{ alignItems: 'center', gap: '40px' }}>
            
            <motion.div {...fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.06)', padding: '24px', borderRadius: '16px', borderLeft: '5px solid var(--accent-blue)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <History color="var(--accent-blue)" size={24} /> Fundada en el 2012
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                  Fundada por <strong>Carlos Ernesto Puyo</strong> y <strong>Jorge Salazar</strong>, Susfinanzas nació pequeña con la misión clara de democratizar los beneficios financieros concedidos por la Ley de Vivienda a las familias colombianas.
                </p>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '24px', borderRadius: '16px', borderLeft: '5px solid var(--accent-yellow)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp color="var(--accent-yellow)" size={24} /> De 12 Créditos a Cobertura Nacional
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-medium)', lineHeight: '1.6' }}>
                  En su primer año, la compañía logró el mejoramiento de <strong>12 créditos</strong>. Desde entonces ha tenido un crecimiento acelerado impulsado por un sistema comercial robusto que ha creado grupos de asesores capacitados en todo el país.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp}>
              <Card3D variant="light" glowColor="blue">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Proceso Estandarizado y Legal
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-dark)' }}>
                    Garantía y Compromiso con las Familias
                  </h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--text-medium)', lineHeight: '1.65' }}>
                    Actualmente, Susfinanzas SAS cuenta con un <strong>proceso altamente estandarizado</strong> que garantiza a los clientes el cumplimiento de la promesa de ahorro en el menor tiempo posible.
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-medium)' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Sin anticipos:</strong> No se solicitan pagos previos; se cobra únicamente contra resultados aprobados.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Exigencia de cumplimiento de la ley:</strong> Amparo estricto a favor de las familias amparados en la Ley 546 de 1999.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Saber Hacer (Know-How):</strong> Logramos que el re-cálculo inteligente se vea reflejado formalmente en la documentación y extracto del banco.</span>
                    </li>
                  </ul>
                </div>
              </Card3D>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. SUPERVISIÓN Y MARCA REGISTRADA */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Transparencia y Marco Jurídico
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              ¿Por qué somos una Empresa Transparente y Legal?
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Cumplimos rigurosamente con todas las normativas exigidas para el ejercicio de asesoría y gestión financiera en Colombia.
            </p>
          </motion.div>

          <div className="grid-2">
            
            {/* Card Supersociedades */}
            <Card3D variant="light" glowColor="blue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', color: 'var(--accent-blue)', fontSize: '12px', fontWeight: '800' }}>
                    ENTIDAD DE SUPERVISIÓN
                  </span>
                  <Scale color="var(--accent-blue)" size={26} />
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  Supervisados por Supersociedades
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Somos supervisados por la <strong>Superintendencia de Sociedades (Supersociedades)</strong> como una empresa comercial que cumple con todos los requisitos de ley para asesorar y gestionar el mejoramiento de créditos de vivienda en Colombia.
                </p>

                <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', fontSize: '13px', color: 'var(--text-medium)', borderLeft: '3px solid var(--accent-blue)' }}>
                  <strong>¿Por qué NO nos vigila la Superfinanciera?</strong><br />
                  No somos vigilados por la Superintendencia Financiera porque <strong>NO prestamos dinero ni captamos recursos del público</strong>. Asesoramos y gestionamos directo ante el banco del cliente.
                </div>
              </div>
            </Card3D>

            {/* Card Marca Registrada */}
            <Card3D variant="light" glowColor="yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '20px', color: 'var(--accent-yellow)', fontSize: '12px', fontWeight: '800' }}>
                    RESPALDO LEGAL
                  </span>
                  <Award color="var(--accent-yellow)" size={26} />
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  Marca Registrada de Uso Exclusivo
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Somos <strong>Marca Registrada</strong>. Por lo tanto, hemos superado una serie de aprobaciones legales rigorosas que garantizan que nuestro servicio es plenamente legal y que nuestra marca cuenta con el uso exclusivo de este servicio de gestión hipotecaria.
                </p>

                <div style={{ background: '#fffbeb', padding: '14px 16px', borderRadius: '10px', fontSize: '13px', color: 'var(--text-medium)', borderLeft: '3px solid var(--accent-yellow)' }}>
                  <strong>Garantía de Confianza:</strong><br />
                  Nuestro saber hacer radica en estructurar la solicitud jurídica para que el banco modifique las condiciones en la documentación oficial sin cambiar tu banco ni afectar tu historial crediticio.
                </div>
              </div>
            </Card3D>

          </div>
        </div>
      </section>

      {/* 4. LOS 2 SERVICIOS QUE PRESTA SUSFINANZAS SAS */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Portafolio Oficial
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              ¿Qué hace Susfinanzas SAS? Los 2 Servicios Oficiales
            </AnimatedTitle>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Asesoramos a las familias sobre sus créditos de vivienda o leasing habitacionales para mejorar sustancialmente sus condiciones.
            </p>
          </motion.div>

          <div className="grid-2">
            
            {/* Servicio 1: Reducción de tiempo */}
            <Card3D variant="light" glowColor="blue">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                  <Clock size={26} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Servicio 1</span>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '4px' }}>
                    1. Reducción del Tiempo e Intereses
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Negociamos directamente ante tu banco actual para que no pagues como inicialmente acordaste. Recalculamos la cuota de amortización para que la deuda se pague de manera inteligente, ahorrando años de plazo y recortando millones en intereses.
                </p>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '700' }}>
                  ✓ Reflejado oficialmente en tu extracto bancario
                </div>
              </div>
            </Card3D>

            {/* Servicio 2: Cambio de UVR a Pesos */}
            <Card3D variant="light" glowColor="yellow">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', padding: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-yellow)' }}>
                  <Banknote size={26} style={{ margin: 'auto' }} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Servicio 2</span>
                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '4px' }}>
                    2. Cambio de UVR a Pesos
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-medium)', lineHeight: '1.6', flex: 1 }}>
                  Convertimos créditos de vivienda o leasing habitacional pactados en Unidades de Valor Real (UVR) a cuotas en Pesos colombianos. Esto protege a la familia de la inflación futura y fija una cuota estable en el tiempo.
                </p>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '13px', color: 'var(--accent-yellow)', fontWeight: '700' }}>
                  ✓ Tranquilidad frente al incremento de la cuota
                </div>
              </div>
            </Card3D>

          </div>
        </div>
      </section>

      {/* 5. ACLARACIONES IMPORTANTES: ¿REFINANCIACIÓN? ¿COMPRA DE CARTERA? */}
      <section style={{ padding: '80px 0', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div className="container">
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-yellow-bright)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Claridad Financiera
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginTop: '8px' }}>
              Lo que Hacemos vs. Lo que NO Hacemos
            </AnimatedTitle>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', maxWidth: '650px', margin: '8px auto 0 auto' }}>
              Es muy importante aclarar las diferencias entre los términos financieros para la tranquilidad del cliente.
            </p>
          </motion.div>

          <div className="grid-3" style={{ gap: '24px' }}>
            
            {/* Card 1: ¿Es Refinanciación? NO */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <XCircle color="#ef4444" size={24} />
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  ¿Es una Refinanciación?
                </h4>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.65', marginBottom: '16px' }}>
                <strong>NO.</strong> Refinanciar significa reemplazar una obligación de deuda existente por otra nueva obligación bajo diferentes términos.
              </p>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var(--accent-blue-bright)', fontWeight: '600' }}>
                👉 Lo que hace Susfinanzas es una <strong>reducción de tiempo e intereses</strong> sobre tu misma obligación bancaria.
              </div>
            </div>

            {/* Card 2: ¿Hace Compra de Cartera? NO */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <XCircle color="#ef4444" size={24} />
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  ¿Hace Compra de Cartera?
                </h4>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.65', marginBottom: '16px' }}>
                <strong>NO.</strong> No somos un banco y por esta razón <strong>no generamos compra de cartera</strong> ni otorgamos préstamos.
              </p>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: 'var(--accent-yellow-bright)', fontWeight: '600' }}>
                👉 Tu crédito permanece en tu banco actual sin cambiar de entidad.
              </div>
            </div>

            {/* Card 3: ¿En qué consiste la reducción de tiempo? */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 color="var(--accent-yellow-bright)" size={24} />
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  ¿En qué consiste la reducción?
                </h4>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.65', marginBottom: '16px' }}>
                Negociamos ante tu banco para recalcular la cuota y pagar la deuda de manera inteligente, ahorrando tiempo e intereses.
              </p>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#34d399', fontWeight: '600' }}>
                👉 El cambio se refleja 100% en la documentación oficial del banco.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FAQ CORPOATIVO SECCIÓN ACORDEÓN */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Preguntas Frecuentes Institucionales
            </span>
            <AnimatedTitle style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-dark)', marginTop: '8px' }}>
              Resolvemos tus dudas sobre Susfinanzas SAS
            </AnimatedTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                q: '¿Qué es Susfinanzas SAS?',
                a: 'Susfinanzas SAS es una compañía privada que asesora y gestiona ante las entidades bancarias la aplicación de la Ley de Vivienda (Ley 546 de 1999) para reducir el plazo de créditos hipotecarios o leasing habitacional, obteniendo los beneficios que la ley concede a favor del deudor.'
              },
              {
                q: '¿Cuál es la historia de la empresa?',
                a: 'Fundada en el 2012 por Carlos Ernesto Puyo y Jorge Salazar, Susfinanzas nació en su primer año logrando el mejoramiento de 12 créditos. A lo largo de más de una década ha crecido aceleradamente con un sistema comercial de asesores a nivel nacional y un proceso estandarizado que garantiza cumplir la promesa en el menor tiempo posible, sin anticipos y exigiendo el cumplimiento de la ley.'
              },
              {
                q: '¿Somos marca registrada?',
                a: 'Sí, somos Marca Registrada. Pasamos por una serie de rigorosas aprobaciones que garantizan que nuestro servicio es plenamente legal y que nuestra marca tiene uso exclusivo de este servicio en Colombia.'
              },
              {
                q: '¿Somos vigilados por la Superintendencia Financiera?',
                a: 'No, porque no prestamos dinero ni captamos recursos del público. Somos supervisados por la Superintendencia de Sociedades (Supersociedades), como una empresa comercial que cumple con todos los requisitos de ley para asesorar y gestionar el mejoramiento de créditos.'
              },
              {
                q: '¿Qué servicios presta Susfinanzas?',
                a: 'Prestamos dos servicios principales: 1) Reducción del tiempo e intereses del crédito hipotecario o leasing habitacional, y 2) Cambio de cuota pactada en UVR a Pesos colombianos.'
              },
              {
                q: '¿El proceso que hace Susfinanzas es una refinanciación?',
                a: 'No. Una refinanciación implica reemplazar una obligación por otra bajo nuevos términos. Lo que hace Susfinanzas es una reducción de tiempo e intereses negociando ante el banco sobre el crédito actual.'
              },
              {
                q: '¿Susfinanzas hace compra de cartera?',
                a: 'No. No somos un banco y por esta razón no realizamos compra de cartera.'
              },
              {
                q: '¿En qué consiste el saber hacer (know-how) de Susfinanzas?',
                a: 'Consiste en negociar técnicamente ante el banco para que la familia pague su deuda de forma inteligente ahorrando tiempo e intereses, y lograr que esta modificación se vea reflejada formalmente en la documentación y extractos oficiales del banco.'
              }
            ].map((faq, idx) => (
              <motion.div key={idx} {...fadeUp}>
                <Card3D variant="light" tilt={false}>
                  <div style={{ padding: '8px 4px' }}>
                    <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={20} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
                      {faq.q}
                    </h4>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-medium)', lineHeight: '1.65', paddingLeft: '30px' }}>
                      {faq.a}
                    </p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <ButtonPulse variant="primary" onClick={() => window.location.href = '/simulador'}>
              Simular mi Ahorro Ahora <ArrowRight size={18} />
            </ButtonPulse>
          </div>
        </div>
      </section>

    </div>
  );
}
