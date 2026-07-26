'use strict';

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, User, MessageCircle, X, ArrowRight } from 'lucide-react';
import { saveLeadToFirebase } from '../../lib/firebase/client';
import ButtonPulse from './ButtonPulse';

export default function FloatingWhatsapp() {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappNumber = '573155030333'; // Celular de Williams Cruz

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !celular) {
      alert('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Guardar el contacto en Firebase Firestore como un Lead de contacto directo
      await saveLeadToFirebase({
        nombre,
        celular,
        correo: 'williamscruzsusfinanzss@gmail.com',
        tipoSociedad: 'Contacto Directo WhatsApp',
        banco: 'No especificado',
        modalidad: 'No especificado',
        montoDeuda: 'No especificado',
      });

      // Redirigir a WhatsApp
      const customMessage = encodeURIComponent(
        `Hola Williams! Mi nombre es ${nombre}. Deseo recibir una asesoría gratuita sobre mi crédito de vivienda.`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${customMessage}`;
      
      setIsOpen(false);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Botón Flotante Principal */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Mensaje flotante de bienvenida */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '10px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            fontSize: '13px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
          onClick={handleOpen}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          ¿Tienes dudas? Escríbenos
        </motion.div>

        {/* Botón Circular 3D */}
        <motion.button
          type="button"
          onClick={handleOpen}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          style={{
            width: '60px',
            height: '60px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4), inset 0 -4px 0 rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
          }}
        >
          {/* SVG de WhatsApp */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </motion.button>
      </div>

      {/* Modal interactivo de WhatsApp Form */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
              }}
            >
              {/* Encabezado del Modal */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  padding: '24px',
                  color: '#ffffff',
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                >
                  <X size={16} />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MessageCircle size={24} />
                  <h4 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Chatea con un Asesor</h4>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: '1.4' }}>
                  Por favor déjanos tu nombre y teléfono para registrar tu solicitud e iniciar el chat en WhatsApp.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-medium)' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="Ej: Camilo Torres"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-medium)' }}>
                    WhatsApp / Celular
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="tel"
                      placeholder="Ej: 310 123 4567"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-light)', lineHeight: '1.4', background: 'var(--bg-light)', padding: '10px', borderRadius: '8px' }}>
                  🔒 Al enviar, autorizas a Williams Cruz a tratar tus datos con la única finalidad de comunicarse contigo para brindarte asesoría de vivienda.
                </div>

                <ButtonPulse
                  type="submit"
                  variant="primary"
                  className="w-full"
                  pulse={true}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                  }}
                >
                  {isSubmitting ? 'Guardando...' : 'Iniciar Chat en WhatsApp'} <ArrowRight size={16} />
                </ButtonPulse>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
