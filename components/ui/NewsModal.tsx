'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Tv, Video, MessageCircle, Sparkles, Megaphone, ExternalLink, PlayCircle } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  color: string;
  bg: string;
  iconType: 'instagram' | 'facebook' | 'youtube';
}

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
  directLinks?: SocialLink[];
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
    whatsappMessage: 'Hola! Vi el anuncio del Live sobre Ley de Vivienda (22 de Julio) y me gustaría reservar mi cupo para recibir el enlace y asesoría.',
    directLinks: [
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/susfinanzas.co/',
        color: '#ffffff',
        bg: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
        iconType: 'instagram'
      },
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/susfinanzas.co',
        color: '#ffffff',
        bg: '#1877f2',
        iconType: 'facebook'
      },
      {
        name: 'YouTube',
        url: 'https://www.youtube.com/@susfinanzas',
        color: '#ffffff',
        bg: '#ff0000',
        iconType: 'youtube'
      }
    ]
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
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 7500; // 7.5 segundos por noticia

  useEffect(() => {
    // Abre automáticamente al cargar la página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Transición automática de noticias
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NEWS_DATA.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  const currentNews = NEWS_DATA[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % NEWS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + NEWS_DATA.length) % NEWS_DATA.length);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="news-modal-backdrop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.82)',
              backdropFilter: 'blur(8px)',
              overflowY: 'auto'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              key="news-modal-content-card"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="news-modal-container"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '880px',
                maxHeight: '92vh',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Barra de Progreso del Temporizador de Cambio Automático */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', position: 'relative', flexShrink: 0 }}>
                <motion.div
                  key={`progress-${currentIndex}-${isPaused ? 'paused' : 'running'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: isPaused ? '100%' : '100%' }}
                  transition={{ duration: isPaused ? 0 : SLIDE_DURATION / 1000, ease: 'linear' }}
                  style={{
                    height: '100%',
                    background: isPaused ? '#eab308' : 'linear-gradient(90deg, #2563eb, #3b82f6)',
                    borderRadius: '0 2px 2px 0'
                  }}
                />
              </div>

              {/* Header Superior del Modal */}
              <div
                className="news-modal-header"
                style={{
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      flexShrink: 0
                    }}
                  >
                    <Megaphone size={17} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        letterSpacing: '0.8px',
                        color: '#fbbf24',
                        textTransform: 'uppercase',
                        display: 'block'
                      }}
                    >
                      Novedades Destacadas
                    </span>
                    <span className="news-header-sub" style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
                      Susfinanzas | Especial Crédito de Vivienda
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isPaused && (
                    <span
                      className="news-paused-tag"
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#fef08a',
                        background: 'rgba(234, 179, 8, 0.2)',
                        padding: '3px 8px',
                        borderRadius: '12px'
                      }}
                    >
                      ⏸️ Pausado
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.85)',
                      background: 'rgba(255, 255, 255, 0.12)',
                      padding: '3px 9px',
                      borderRadius: '20px'
                    }}
                  >
                    {currentIndex + 1} / {NEWS_DATA.length}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                    title="Cerrar notificación"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Cuerpo del Modal con Contenido de la Noticia */}
              <div
                className="news-modal-body"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  overflowY: 'auto',
                  flex: 1
                }}
              >
                {/* Pestañas de Selección Rápida */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', flexShrink: 0 }}>
                  {NEWS_DATA.map((item, idx) => (
                    <button
                      key={`news-tab-item-${item.id}`}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '12px',
                        border: idx === currentIndex ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: idx === currentIndex ? 'rgba(37, 99, 235, 0.08)' : '#f8fafc',
                        color: idx === currentIndex ? '#1e40af' : '#64748b',
                        fontWeight: idx === currentIndex ? '800' : '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Sparkles size={13} color={idx === currentIndex ? '#2563eb' : '#94a3b8'} />
                      {idx === 0 ? '1. Evento En Vivo (22 Jul)' : '2. Entrevista Citytv (25 Jul)'}
                    </button>
                  ))}
                </div>

                {/* Tarjeta Principal de Noticia */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`news-card-slide-${currentNews.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="news-modal-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr)',
                      gap: '16px',
                      alignItems: 'start'
                    }}
                  >
                    {/* Imagen Promocional */}
                    <div
                      className="news-modal-image-wrapper"
                      style={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.15)',
                        backgroundColor: '#0f172a',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <img
                        src={currentNews.image}
                        alt={currentNews.title}
                        className="news-modal-img"
                        style={{
                          width: '100%',
                          maxHeight: '340px',
                          objectFit: 'contain',
                          display: 'block',
                          backgroundColor: '#0b1329'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: currentNews.badgeBg,
                          color: currentNews.badgeColor,
                          fontSize: '10.5px',
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <h3
                          className="news-title-heading"
                          style={{
                            fontSize: '18px',
                            fontWeight: '900',
                            color: '#0f172a',
                            lineHeight: '1.3',
                            marginBottom: '4px'
                          }}
                        >
                          {currentNews.title}
                        </h3>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb' }}>
                          {currentNews.subtitle}
                        </p>
                      </div>

                      {/* Detalles Clave (Fecha, Hora, Transmisión) */}
                      <div
                        className="news-details-box"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '8px',
                          background: '#f8fafc',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <Calendar size={15} color="#2563eb" style={{ flexShrink: 0 }} />
                          <div>
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>FECHA</strong>
                            <span style={{ fontWeight: '700' }}>{currentNews.date}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <Clock size={15} color="#d97706" style={{ flexShrink: 0 }} />
                          <div>
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>HORA</strong>
                            <span style={{ fontWeight: '700' }}>{currentNews.time}</span>
                          </div>
                        </div>

                        <div className="news-platform-col" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          {currentNews.id === 1 ? <Video size={15} color="#ef4444" style={{ flexShrink: 0 }} /> : <Tv size={15} color="#2563eb" style={{ flexShrink: 0 }} />}
                          <div>
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>TRANSMISIÓN</strong>
                            <span style={{ fontWeight: '700' }}>{currentNews.platform}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expositores / Presentadores */}
                      <div
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(234, 179, 8, 0.1)',
                          borderLeft: '4px solid #eab308',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '12px',
                          color: '#1e293b'
                        }}
                      >
                        <strong>🎙️ {currentNews.id === 1 ? 'Presentan' : 'Invitado Especial'}:</strong>{' '}
                        <span style={{ fontWeight: '600' }}>{currentNews.hostsOrGuest}</span>
                      </div>

                      {/* Enlaces Directos de Redes Sociales (Noticia 1) */}
                      {currentNews.directLinks && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>
                            🌐 INGRESAR DIRECTO A LA TRANSMISIÓN:
                          </span>
                          <div className="news-social-links-grid">
                            {currentNews.directLinks.map((link, lIdx) => (
                              <a
                                key={`social-direct-link-${lIdx}-${link.name}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px',
                                  padding: '8px 4px',
                                  borderRadius: '10px',
                                  background: link.bg,
                                  color: link.color,
                                  fontSize: '11.5px',
                                  fontWeight: '800',
                                  textDecoration: 'none',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                  transition: 'transform 0.2s ease',
                                  textAlign: 'center'
                                }}
                              >
                                <PlayCircle size={13} />
                                <span>{link.name}</span>
                                <ExternalLink size={11} style={{ opacity: 0.8 }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Texto descriptivo completo */}
                      <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
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
                          gap: '8px',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '14px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                          transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                          marginTop: '2px'
                        }}
                      >
                        <MessageCircle size={18} />
                        {currentNews.id === 1 ? 'Solicitar Recordatorio por WhatsApp' : 'Más Información por WhatsApp'}
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Pie de Modal con Controles de Navegación */}
                <div
                  className="news-modal-footer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid #f1f5f9',
                    flexShrink: 0
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handlePrev}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ChevronLeft size={15} /> Anterior
                    </button>
                    <button
                      onClick={handleNext}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Siguiente <ChevronRight size={15} />
                    </button>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#64748b',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Entendido, continuar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Estilos Adaptativos para Escritorio */
        @media (min-width: 768px) {
          .news-modal-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .news-platform-col {
            grid-column: span 2 !important;
          }
          .news-social-links-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
        }

        /* Estilos Adaptativos Especiales para Dispositivos Móviles (Smartphones) */
        @media (max-width: 767px) {
          .news-modal-container {
            max-height: 94vh !important;
            border-radius: 18px !important;
          }
          .news-modal-header {
            padding: 10px 14px !important;
          }
          .news-header-sub {
            display: none !important;
          }
          .news-paused-tag {
            display: none !important;
          }
          .news-modal-body {
            padding: 14px !important;
            gap: 12px !important;
          }
          .news-modal-img {
            max-height: 200px !important;
          }
          .news-title-heading {
            font-size: 16px !important;
          }
          .news-details-box {
            grid-template-columns: 1fr !important;
            gap: 6px !important;
            padding: 8px 10px !important;
          }
          .news-social-links-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 5px !important;
          }
          .news-modal-footer {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .news-modal-footer > div {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .news-modal-footer > button {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
