'use strict';

import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import React from 'react';
import FloatingWhatsapp from '../components/ui/FloatingWhatsapp';
import CookieBanner from '../components/ui/CookieBanner';
import Navbar from '../components/ui/Navbar';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Williams Cruz | Asesoría Hipotecaria y Reducción de Créditos',
  description:
    'Reduce los años de tu deuda hipotecaria o leasing habitacional ahorrando hasta un 60% en intereses sin cambiar de banco, amparado por la Ley de Vivienda 546 de 1999.',
  keywords: 'reduccion credito hipotecario, ley de vivienda colombia, ahorrar intereses banco, abono a capital, leasing habitacional, asesoramiento financiero vivienda',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={outfit.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* FOOTER */}
        <footer
          style={{
            background: 'var(--primary-navy)',
            color: '#ffffff',
            padding: '48px 0 24px 0',
            borderTop: '4px solid var(--accent-yellow)',
          }}
        >
          <div className="container">
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img
                    src="/williams_cruz_avatar.jpg"
                    alt="Williams Cruz Avatar"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                      border: '2px solid var(--accent-yellow-bright)',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', lineHeight: 1.2 }}>
                      Williams <span style={{ color: 'var(--accent-yellow-bright)' }}>Cruz</span>
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Asesor Financiero en Reducción Hipotecaria
                    </span>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5', marginBottom: '16px' }}>
                  Especialista en ingeniería financiera aplicada a la reducción de créditos de vivienda y asesoría hipotecaria. Optimiza tu deuda de forma segura y transparente.
                </p>
                <style dangerouslySetInnerHTML={{ __html: `
                  .social-link-fb:hover {
                    color: #ffffff !important;
                    background-color: #1877f2 !important;
                  }
                  .social-link-yt:hover {
                    color: #ffffff !important;
                    background-color: #ff0000 !important;
                  }
                `}} />
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <a
                    href="https://www.facebook.com/share/1Ea58QQuCx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-fb"
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      background: 'rgba(255,255,255,0.05)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s, color 0.3s',
                    }}
                    title="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                  <a
                    href="https://youtube.com/@williamscruz9245?si=G0ctqbefAk80OFsN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-yt"
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      background: 'rgba(255,255,255,0.05)',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s, color 0.3s',
                    }}
                    title="YouTube"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
                  </a>
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
                  Susfinanzas SAS
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  <li><a href="/empresa" style={{ color: 'var(--accent-yellow-bright)', textDecoration: 'none', fontWeight: '600' }}>🏛️ Sobre Susfinanzas SAS (Fundada 2012)</a></li>
                  <li>📋 1. Reducción de Tiempo e Intereses</li>
                  <li>💵 2. Cambio de UVR a Pesos</li>
                  <li>⚖️ Supervisados por Supersociedades</li>
                  <li>®️ Marca Registrada de Uso Exclusivo</li>
                </ul>
              </div>

              <div>
                <h5 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
                  Contacto Directo
                </h5>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  <li>📞 Celulares: +57 (315) 503-0333 | +57 (316) 977-3057</li>
                  <li>✉️ Correo: williamscruzsusfinanzs@gmail.com</li>
                  <li>⏰ Horario: Lun a Vie 7:30 AM - 5:30 PM</li>
                  <li>🛡️ Amparados por la Ley 546 de 1999</li>
                  <li>🔒 Servicio Sin Anticipos</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              <span>© {new Date().getFullYear()} Susfinanzas SAS | Williams Cruz. Todos los derechos reservados.</span>
              <span>Supervisados por Supersociedades. Marca Registrada. Sin Anticipos.</span>
            </div>
          </div>
        </footer>

        {/* Botón flotante WhatsApp */}
        <FloatingWhatsapp />

        {/* Banner de Cookies y Privacidad */}
        <CookieBanner />
      </body>
    </html>
  );
}
