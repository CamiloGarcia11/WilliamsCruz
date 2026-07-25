'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Clock, Tv, Video, MessageCircle, Sparkles, Megaphone, ExternalLink, PlayCircle, ZoomIn, Film } from 'lucide-react';

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
  tabLabel: string;
  image?: string;
  isVideo?: boolean;
  videoUrl?: string;
  youtubeUrl?: string;
  date: string;
  time: string;
  platform: string;
  hostsOrGuest: string;
  description: string;
  whatsappMessage: string;
  isVertical?: boolean;
  buttonText?: string;
  directLinks?: SocialLink[];
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    categoryBadge: '🚀 CONVOCATORIA COMERCIAL',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#d97706',
    title: '¡Únete al Equipo Comercial de Susfinanzas SAS!',
    subtitle: 'Convocatoria Abierta para Asesores Financieros',
    tabLabel: '1. Convocatoria Comercial',
    image: '/comercial.jpeg',
    date: 'Convocatoria Abierta',
    time: 'Horario Flexible / Cobertura Nacional',
    platform: 'Susfinanzas SAS - Red Nacional de Asesores',
    hostsOrGuest: 'Dirección Comercial & Selección de Talento',
    description: `💼 ¿Quieres generar excelentes ingresos ayudando a miles de familias colombianas a reducir su crédito de vivienda o leasing habitacional?\n\nEn Susfinanzas SAS estamos en búsqueda de personas emprendedoras, líderes y comerciales para sumarse a nuestro equipo en todo el país.\n\n✨ ¿De qué se trata el trabajo?\n- Asesorar a deudores hipotecarios sobre los beneficios de la Ley de Vivienda (Ley 546 de 1999).\n- Presentar estudios financieros de reducción de plazo e intereses o cambio de UVR a Pesos.\n- Contarás con un sistema comercial 100% estandarizado, capacitaciones constantes y el respaldo de una empresa con más de 12 años de trayectoria, marca registrada y supervisada por Supersociedades.\n- Prestamos un servicio sin anticipos para los clientes, lo que garantiza una altísima efectividad y confianza en las gestiones.\n\n📲 ¡Haz clic en el botón a continuación para ponerte en contacto con nuestro equipo y comenzar tu proceso de selección!`,
    whatsappMessage: 'Hola! Vi la convocatoria comercial en la sección de noticias de Susfinanzas SAS y deseo más información para unirme al equipo de asesores. ¡Quiero empezar ya!',
    buttonText: 'Quiero empezar ya',
    isVertical: true
  },
  {
    id: 2,
    categoryBadge: '🎬 VIDEO ENTREVISTA',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: '#10b981',
    title: 'Ley de Vivienda en CityTV: Reduce Años e Intereses',
    subtitle: 'Entrevista Especial con Carlos Puyo (Fundador)',
    tabLabel: '2. Video Entrevista Ley de Vivienda',
    isVideo: true,
    videoUrl: '/video_whatsapp.mp4',
    youtubeUrl: 'https://www.youtube.com/live/Cu5ORyvPuJU?si=XkmL6ewlJqI7ciz-',
    date: 'Especial Televisión',
    time: 'Disponible en Video',
    platform: 'CityTV Colombia',
    hostsOrGuest: 'Carlos Puyo (Gerente & Fundador)',
    description: `📺 Te invito a ver la entrevista de nuestro gerente y fundador, Carlos Puyo, en CityTV, donde hablamos sobre cómo la Ley de Vivienda puede ayudar a miles de familias a reducir el tiempo de su crédito hipotecario o leasing habitacional.\n\n🏡 Si estás pagando tu casa o apartamento a un banco, podrías terminar de pagarlo entre 3, 5, 7, 10 o más años antes, ahorrando además millones de pesos en intereses, según las condiciones de tu crédito.\n\n📲 Escríbeme y con gusto revisaré tu caso sin compromiso. Te ayudaré a identificar si puedes acceder a los beneficios de la Ley de Vivienda y cuáles son las mejores opciones para tu crédito.`,
    whatsappMessage: 'Hola! Vi el video de la entrevista en CityTV con Carlos Puyo y me gustaría revisar mi caso para acceder a los beneficios de la Ley de Vivienda.'
  }
];

export default function NewsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const SLIDE_DURATION = 8500; // 8.5 segundos por noticia

  useEffect(() => {
    // Abre automáticamente al cargar la página
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const currentNews = NEWS_DATA[currentIndex];

  // 1. Efecto exclusivo para cambio automático de noticias en imágenes
  useEffect(() => {
    if (!isOpen || isPaused || expandedImage !== null || currentNews.isVideo) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NEWS_DATA.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, expandedImage, currentIndex, currentNews.isVideo]);

  // 2. Efecto exclusivo para reproducir el video únicamente cuando se selecciona la noticia de video
  useEffect(() => {
    if (currentNews.isVideo) {
      setIsPaused(true);
      if (videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log('Autoplay intencional:', err);
          });
        }
      }
    }
  }, [currentIndex]);

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
              padding: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.82)',
              backdropFilter: 'blur(8px)',
              overflowY: 'auto',
              minHeight: '100vh'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              key="news-modal-content-card"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="news-modal-container"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '920px',
                maxHeight: '90vh',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => {
                if (!currentNews.isVideo) setIsPaused(true);
              }}
              onMouseLeave={() => {
                if (!currentNews.isVideo) setIsPaused(false);
              }}
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
                      {currentNews.isVideo ? '▶️ Reproduciendo Video' : '⏸️ Pausado'}
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
                      width: '34px',
                      height: '34px',
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
                      {item.isVideo ? (
                        <Film size={13} color={idx === currentIndex ? '#10b981' : '#94a3b8'} />
                      ) : (
                        <Sparkles size={13} color={idx === currentIndex ? '#2563eb' : '#94a3b8'} />
                      )}
                      {item.tabLabel}
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
                      alignItems: 'center'
                    }}
                  >
                    {/* Contenedor de Multimedia (Imagen o Video) */}
                    {currentNews.isVideo ? (
                      <div
                        className="news-modal-video-wrapper"
                        style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.25)',
                          backgroundColor: '#000000',
                          border: '1px solid #1e293b',
                          alignSelf: 'center'
                        }}
                      >
                        <video
                          ref={videoRef}
                          src={currentNews.videoUrl}
                          autoPlay
                          controls
                          playsInline
                          preload="auto"
                          className="news-modal-video"
                          style={{
                            width: '100%',
                            maxHeight: '420px',
                            objectFit: 'contain',
                            display: 'block',
                            backgroundColor: '#000000'
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`news-modal-image-wrapper ${currentNews.isVertical ? 'is-vertical-wrapper' : ''}`}
                        style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: currentNews.isVertical ? '0 10px 25px -5px rgba(0, 0, 0, 0.12)' : '0 8px 20px -4px rgba(0, 0, 0, 0.15)',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          alignSelf: 'center',
                          width: '100%',
                          maxWidth: currentNews.isVertical ? '350px' : '100%',
                          margin: '0 auto',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onClick={() => currentNews.image && setExpandedImage(currentNews.image)}
                        title="Haz clic o toca para ver en pantalla completa"
                      >
                        <img
                          src={currentNews.image}
                          alt={currentNews.title}
                          className={`news-modal-img ${currentNews.isVertical ? 'is-vertical-img' : ''}`}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: currentNews.isVertical ? '480px' : '340px',
                            objectFit: 'contain',
                            display: 'block',
                            backgroundColor: '#ffffff'
                          }}
                        />

                        {/* Botón Flotante de Ampliación */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backdropFilter: 'blur(6px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            zIndex: 2
                          }}
                        >
                          <ZoomIn size={13} color="#60a5fa" /> Ampliar flyer
                        </div>
                      </div>
                    )}

                    {/* Información y Texto de la Noticia */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        {/* Badge de Categoría */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            backgroundColor: currentNews.badgeBg,
                            color: currentNews.badgeColor,
                            fontSize: '11px',
                            fontWeight: '900',
                            letterSpacing: '0.5px',
                            marginBottom: '10px',
                            border: `1px solid ${currentNews.badgeColor}33`
                          }}
                        >
                          {currentNews.categoryBadge}
                        </div>

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
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>FECHA / EMISIÓN</strong>
                            <span style={{ fontWeight: '700' }}>{currentNews.date}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <Clock size={15} color="#d97706" style={{ flexShrink: 0 }} />
                          <div>
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>HORA / ESTADO</strong>
                            <span style={{ fontWeight: '700' }}>{currentNews.time}</span>
                          </div>
                        </div>

                        <div className="news-platform-col" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          {currentNews.isVideo ? <Film size={15} color="#10b981" style={{ flexShrink: 0 }} /> : currentNews.id === 1 ? <Video size={15} color="#ef4444" style={{ flexShrink: 0 }} /> : <Tv size={15} color="#2563eb" style={{ flexShrink: 0 }} />}
                          <div>
                            <strong style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>CANAL / MEDIO</strong>
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
                        <strong>🎙️ {currentNews.id === 1 ? 'Presentan' : 'Invitado / Vocero'}:</strong>{' '}
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

                      {/* Texto descriptivo completo con saltos de línea legibles */}
                      <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {currentNews.description}
                      </p>

                      {/* Botones de Acción (YouTube y WhatsApp) */}
                      <div
                        className="news-actions-grid"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: currentNews.youtubeUrl ? 'repeat(auto-fit, minmax(180px, 1fr))' : '1fr',
                          gap: '10px',
                          marginTop: '2px'
                        }}
                      >
                        {currentNews.youtubeUrl && (
                          <a
                            href={currentNews.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #ff0000 0%, #dc2626 100%)',
                              color: '#ffffff',
                              fontWeight: '800',
                              fontSize: '13.5px',
                              textDecoration: 'none',
                              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
                              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                              textAlign: 'center'
                            }}
                          >
                            <PlayCircle size={18} />
                            <span>Ver Entrevista Completa</span>
                            <ExternalLink size={13} style={{ opacity: 0.8 }} />
                          </a>
                        )}

                        <a
                          href={`https://wa.me/573155030333?text=${encodeURIComponent(currentNews.whatsappMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '13.5px',
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                            textAlign: 'center'
                          }}
                        >
                          <MessageCircle size={18} />
                          <span>
                            {currentNews.buttonText ? currentNews.buttonText : (currentNews.isVideo ? 'Revisar Mi Caso por WhatsApp' : 'Más Información')}
                          </span>
                        </a>
                      </div>
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

      {/* Lightbox / Visor de Imagen en Pantalla Completa */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999999,
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px'
            }}
            onClick={() => setExpandedImage(null)}
          >
            <button
              onClick={() => setExpandedImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1000000
              }}
            >
              <X size={24} />
            </button>
            <img
              src={expandedImage}
              alt="Flyer ampliado"
              style={{
                maxWidth: '98%',
                maxHeight: '94vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Estilos Adaptativos para Escritorio */
        @media (min-width: 768px) {
          .news-modal-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: center !important;
          }
          .news-platform-col {
            grid-column: span 2 !important;
          }
          .news-social-links-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .is-vertical-img {
            max-height: 480px !important;
          }
          .news-modal-video {
            max-height: 420px !important;
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
            max-height: 240px !important;
          }
          .news-modal-video {
            max-height: 260px !important;
          }
          .is-vertical-img {
            max-height: 380px !important;
            object-fit: contain !important;
            width: 100% !important;
          }
          .is-vertical-wrapper {
            max-height: 385px !important;
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
