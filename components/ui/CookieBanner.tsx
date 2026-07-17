'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó previamente el aviso
    const isAccepted = localStorage.getItem('susfinanzas_cookie_accepted');
    if (!isAccepted) {
      // Mostrar el aviso con un pequeño delay de 1.5 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('susfinanzas_cookie_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            right: '24px',
            maxWidth: '600px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 9999, // Asegurar que quede arriba de todo
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            margin: '0 auto',
          }}
        >
          {/* Contenido del Banner */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
            <ShieldCheck size={24} color="var(--accent-yellow-bright)" style={{ flexShrink: 0, marginTop: '2px' }} />
             <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.5' }}>
              <strong>Aviso de Privacidad y Cookies:</strong> Como asesor experto Williams Cruz valoro tu privacidad. 
              Al navegar en mi portal, aceptas el uso de cookies y me autorizas a tratar tu información de contacto 
              (nombre, celular y correo) con el único fin de realizar simulaciones financieras, llamarte o comunicarnos 
              contigo vía WhatsApp para asesorarte sobre tu crédito de vivienda u opciones de reducción (Ley 546 de 1999).
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
            <a 
              href="/como-funciona" 
              style={{ 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.6)', 
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Leer marco legal
            </a>
            
            <button
              type="button"
              onClick={handleAccept}
              style={{
                backgroundColor: 'var(--accent-yellow)',
                color: 'var(--primary-dark)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.backgroundColor = 'var(--accent-yellow-bright)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'var(--accent-yellow)';
              }}
            >
              Entendido y Aceptar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
