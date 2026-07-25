'use strict';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '16px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} className="hover-scale">
          <img
            src="/logo-wc.png"
            alt="Williams Cruz WC Logo"
            style={{
              height: '38px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary-dark)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Williams<span style={{ color: 'var(--accent-blue)' }}>Cruz</span>
            </span>
            <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-light)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Finanzas &amp; Vivienda
            </span>
          </div>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--primary-dark)',
            zIndex: 110,
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        {/* Menu Links */}
        <nav 
          className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}
          style={{ display: 'flex', gap: '28px', alignItems: 'center' }}
        >
          <Link onClick={() => setMobileMenuOpen(false)} href="/" style={{ color: 'var(--text-medium)', fontWeight: '600', fontSize: '15px', transition: 'var(--transition-smooth)' }}>
            Inicio
          </Link>

          {/* Asesoría Link */}
          <Link onClick={() => setMobileMenuOpen(false)} href="/asesoria-credito-inmobiliario" style={{ color: 'var(--text-medium)', fontWeight: '600', fontSize: '15px', transition: 'var(--transition-smooth)' }}>
            Asesoría Hipotecaria
          </Link>

          <Link onClick={() => setMobileMenuOpen(false)} href="/empresa" style={{ color: 'var(--text-medium)', fontWeight: '600', fontSize: '15px', transition: 'var(--transition-smooth)' }}>
            Sobre Susfinanzas
          </Link>

          <Link onClick={() => setMobileMenuOpen(false)} href="/simulador" style={{ color: 'var(--text-medium)', fontWeight: '600', fontSize: '15px', transition: 'var(--transition-smooth)' }}>
            Simulador
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            href="/agendar"
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              backgroundColor: 'var(--primary-dark)',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '14px',
              transition: 'var(--transition-smooth)',
              textAlign: 'center',
            }}
            className="hover-scale"
          >
            Agendar Estudio Gratis
          </Link>
        </nav>
      </div>
    </header>
  );
}
