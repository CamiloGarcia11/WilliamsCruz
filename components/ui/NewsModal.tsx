'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Tv, Video, MessageCircle, Sparkles, Megaphone } from 'lucide-react';

interface NewsItem {
  id: number;
  categoryBadge: string;
  badgeBg: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  time: string;
  platform: string;
  hostsOrGuest: string;
  description: string;
  whatsappMessage: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    categoryBadge: '🔴 EVENTO EN VIVO',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeColor: '#ef4444',
    title: 'Te explicamos tu crédito de vivienda en palabras claras',
    subtitle: 'Preguntas y Respuestas: Ley de Vivienda',
    image: '/noticia1.png',
    date: 'Miércoles 22 de Julio',
    time: '8:00 P.M. (Hora Colombia)',
    platform: 'LIVE en Instagram, Facebook y YouTube',
    hostsOrGuest: 'Dennys Daza (Gerente Comercial) & Adriana Peña (Agente Financiera)',
    description: 'Aprende a optimizar tu crédito hipotecario o leasing habitacional, reducir intereses y tomar las mejores decisiones financieras en un espacio de diálogo claro, directo y transparente.',
    whatsappMessage: 'Hola! Vi el anuncio del Live sobre Ley de Vivienda (22 de Julio) y me gustaría reservar mi cupo para recibir el enlace y asesoría.'
  },
  {
    id: 2,
    categoryBadge: '📺 ENTREVISTA EXCLUSIVA',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#2563eb',
    title: '¡Paga tu crédito de vivienda más rápido y ahorra en intereses!',
    subtitle: 'Entrevista Exclusiva en Citytv - Bravíssimo',
    image: '/noticia2.jpg',
    date: 'Sábado 25 de Julio',
    time: '7:30 A.M.',
    platform: 'Canal Citytv / Programa Bravíssimo',
    hostsOrGuest: 'Carlos Puyo (Presidente de Sus Finanzas)',
    description: '¡No te pierdas esta oportunidad única! Si tienes un crédito de vivienda, sintoniza nuestro programa y descubre cómo reducir el tiempo de tu crédito con un ahorro significativo en intereses usando las mejores estrategias financieras.',
    whatsappMessage: 'Hola! Vi la noticia de la entrevista en Citytv Bravíssimo con Carlos Puyo y deseo información para reducir los intereses de mi crédito.'
  }
];

export default function NewsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Abre automáticamente al cargar la página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const currentNews = NEWS_DATA[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % NEWS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + NEWS_DATA.length) % NEWS_DATA.length);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto'
        }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '860px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            margin: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Superior del Modal */}
          <div
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa'
                }}
              >
                <Megaphone size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    display: 'block'
                  }}
                >
                  Noticias & Novedades Destacadas
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
                  Susfinanzas | Especial Crédito de Vivienda
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'rgba(255, 255, 255, 0.7)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                {currentIndex + 1} de {NEWS_DATA.length}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Cerrar notificación"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cuerpo del Modal con Contenido de la Noticia */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Pestañas de Selección Rápida */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {NEWS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: idx === currentIndex ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: idx === currentIndex ? 'rgba(37, 99, 235, 0.06)' : '#f8fafc',
                    color: idx === currentIndex ? '#1e40af' : '#64748b',
                    fontWeight: idx === currentIndex ? '800' : '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Sparkles size={14} color={idx === currentIndex ? '#2563eb' : '#94a3b8'} />
                  {idx === 0 ? '1. Evento En Vivo (22 Jul)' : '2. Entrevista Citytv (25 Jul)'}
                </button>
              ))}
            </div>

            {/* Tarjeta Principal de Noticia */}
            <motion.div
              key={currentNews.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '20px',
                alignItems: 'start'
              }}
              className="news-modal-grid"
            >
              {/* Imagen Promocional */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                  backgroundColor: '#0f172a',
                  border: '1px solid #e2e8f0'
                }}
              >
                <img
                  src={currentNews.image}
                  alt={currentNews.title}
                  style={{
                    width: '100%',
                    maxHeight: '380px',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: '#0b1329'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: currentNews.badgeBg,
                    color: currentNews.badgeColor,
                    fontSize: '11px',
                    fontWeight: '900',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(6px)',
                    border: `1px solid ${currentNews.badgeColor}33`
                  }}
                >
                  {currentNews.categoryBadge}
                </div>
              </div>

              {/* Información y Texto de la Noticia */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '900',
                      color: '#0f172a',
                      lineHeight: '1.3',
                      marginBottom: '6px'
                    }}
                  >
                    {currentNews.title}
                  </h3>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>
                    {currentNews.subtitle}
                  </p>
                </div>

                {/* Detalles Clave (Fecha, Hora, Canal/Plataforma) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '10px',
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <Calendar size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>FECHA</strong>
                      <span style={{ fontWeight: '700' }}>{currentNews.date}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <Clock size={16} color="#d97706" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>HORA</strong>
                      <span style={{ fontWeight: '700' }}>{currentNews.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', gridColumn: 'span 2' }}>
                    {currentNews.id === 1 ? <Video size={16} color="#ef4444" style={{ flexShrink: 0 }} /> : <Tv size={16} color="#2563eb" style={{ flexShrink: 0 }} />}
                    <div>
                      <strong style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>DÓNDE VERLO / TRANSMISIÓN</strong>
                      <span style={{ fontWeight: '700' }}>{currentNews.platform}</span>
                    </div>
                  </div>
                </div>

                {/* Expositores / Presentadores */}
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(234, 179, 8, 0.1)',
                    borderLeft: '4px solid #eab308',
                    borderRadius: '0 10px 10px 0',
                    fontSize: '13px',
                    color: '#1e293b'
                  }}
                >
                  <strong>🎙️ {currentNews.id === 1 ? 'Presentan' : 'Invitado Especial'}:</strong>{' '}
                  <span style={{ fontWeight: '600' }}>{currentNews.hostsOrGuest}</span>
                </div>

                {/* Texto descriptivo completo */}
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.55' }}>
                  {currentNews.description}
                </p>

                {/* Botón de Acción WhatsApp */}
                <a
                  href={`https://wa.me/573155030333?text=${encodeURIComponent(currentNews.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                    marginTop: '4px'
                  }}
                >
                  <MessageCircle size={20} />
                  {currentNews.id === 1 ? 'Solicitar Recordatorio por WhatsApp' : 'Más Información por WhatsApp'}
                </a>
              </div>
            </motion.div>

            {/* Pie de Modal con Controles de Navegación */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePrev}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Entendido, continuar a la página
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .news-modal-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
