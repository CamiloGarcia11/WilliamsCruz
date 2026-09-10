'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Music, Disc3, Sparkles, Phone, Flame, CheckCircle, Radio } from 'lucide-react';
import Card3D from './Card3D';

interface AudioPlayerCardProps {
  src: string;
  title?: string;
  subtitle?: string;
  speaker?: string;
  description?: string;
  whatsappMessage?: string;
  badgeText?: string;
}

export default function AudioPlayerCard({
  src,
  title = '🎵 "El Ritmo de tu Ahorro" - Canción Oficial Susfinanzas SAS',
  subtitle = '¡Aprende cantando cómo pagar tu casa en menos tiempo!',
  speaker = 'Susfinanzas SAS & Williams Cruz',
  description = 'Una forma divertida, clara y musical de entender cómo aplicar la Ley 546 de 1999 para reducir años de tu crédito y ahorrar millones en intereses bancarios.',
  whatsappMessage = 'Hola! Escuché la canción interactiva de Susfinanzas SAS y deseo saber cuánto puedo ahorrar en mi crédito de vivienda.',
  badgeText = '🎶 CANCIÓN EXPLICATIVA',
}: AudioPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'lyrics'>('visualizer');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Error playing audio:', err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cyclePlaybackRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const rates = [1, 1.2, 1.5, 0.8];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec) || !isFinite(timeInSec)) return '0:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 28 Barras para el ecualizador visualizador dinámico
  const barHeights = [40, 75, 50, 95, 80, 45, 90, 100, 65, 85, 55, 90, 75, 50, 95, 70, 85, 60, 90, 45, 75, 55, 85, 40, 70, 95, 60, 85];

  // Puntos clave de la canción interactiva
  const keySongPoints = [
    { icon: '🏠', title: '¿Tienes crédito hipotecario?', desc: 'Aprende cómo dejar de pagar cuotas eternas.' },
    { icon: '⚖️', title: 'Bajo la Ley 546 de 1999', desc: 'Todo el proceso es 100% legal y con tu mismo banco.' },
    { icon: '📉', title: 'Ahorro millonario en intereses', desc: 'Reduce entre 5 y 12 años sin aumentar tu cuota drásticamente.' },
    { icon: '🤝', title: 'Honorarios contra éxito', desc: 'Pagas únicamente cuando recibas tu nuevo extracto bancario.' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1020px', margin: '0 auto' }}>
      <Card3D
        variant="light"
        glowColor="yellow"
        style={{
          padding: '0px',
          overflow: 'hidden',
          width: '100%',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px -15px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Header estilo ventana con toques musicales */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span
              style={{
                fontSize: '13px',
                fontWeight: '900',
                color: 'var(--primary-dark)',
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Music size={16} color="#f59e0b" /> Canción Interactiva: Así Funciona Susfinanzas SAS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '900',
                color: '#b45309',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                padding: '4px 12px',
                borderRadius: '20px',
                letterSpacing: '0.6px',
                border: '1px solid #fcd34d',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={13} color="#d97706" /> {badgeText}
            </span>
          </div>
        </div>

        {/* Contenedor principal estilo DJ / Studio Musical */}
        <div
          style={{
            padding: '28px 24px',
            background: 'radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Elementos decorativos de fondo */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <audio ref={audioRef} src={src} preload="metadata" />

          {/* Fila superior: Disco de Vinilo Giratorio + Info + Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            {/* Lado Izquierdo: Disco de Vinilo Musical y Estado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Disco de Vinilo con Animación de Giro */}
              <div
                style={{
                  position: 'relative',
                  width: '95px',
                  height: '95px',
                  flexShrink: 0,
                }}
              >
                {/* Disco exterior */}
                <div
                  className={`vinyl-disc ${isPlaying ? 'vinyl-spinning' : ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #18181b 30%, #09090b 70%, #000000 100%)',
                    border: '3px solid #27272a',
                    boxShadow: isPlaying
                      ? '0 0 25px rgba(245, 158, 11, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.15)'
                      : '0 8px 20px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  {/* Surcos de vinilo */}
                  <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px dashed rgba(255, 255, 255, 0.1)' }} />
                  <div style={{ position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.08)' }} />

                  {/* Centro del Disco con Logo de Susfinanzas */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <Disc3 size={20} color="#ffffff" className={isPlaying ? 'disc-center-icon' : ''} />
                  </div>
                </div>

                {/* Aguja / Indicador Musical Flotante */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-4px',
                    padding: '3px 7px',
                    borderRadius: '12px',
                    background: isPlaying ? '#10b981' : '#64748b',
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: '900',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  <Radio size={10} /> {isPlaying ? 'ON AIR' : 'PAUSA'}
                </div>
              </div>

              {/* Título de la pista y Artista */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#fbbf24',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '4px',
                  }}
                >
                  <Flame size={13} color="#f59e0b" /> {subtitle}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', margin: 0, lineHeight: '1.3' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  🎤 <strong>Voz & Producción:</strong> {speaker}
                </p>
              </div>
            </div>

            {/* Lado Derecho: Selector de Pestañas (Visualizador vs Letra / Resumen de Pasos) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('visualizer')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '12px',
                  border: activeTab === 'visualizer' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: activeTab === 'visualizer' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: activeTab === 'visualizer' ? '#fbbf24' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Music size={13} /> Onda Musical
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '12px',
                  border: activeTab === 'lyrics' ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: activeTab === 'lyrics' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  color: activeTab === 'lyrics' ? '#a5b4fc' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={13} /> Pasos Clave Explicados
              </button>
            </div>
          </div>

          {/* Área Central: Visualizador de Ondas Musicales o Pasos de la Canción */}
          {activeTab === 'visualizer' ? (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  🎛️ FRECUENCIA & RITMO DE LA CANCIÓN:
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: isPlaying ? '#fbbf24' : '#64748b' }}>
                  {isPlaying ? '🎵 Ritmo Activo • Dale play y canta' : 'Presiona Reproducir'}
                </span>
              </div>

              {/* Ondas Dinámicas del Ecualizador Ultra Fluidas */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '3px',
                  height: '55px',
                  padding: '4px 0',
                }}
              >
                {barHeights.map((h, i) => {
                  const animType = (i % 6) + 1;
                  const durationSpeed = (0.38 + ((i * 7) % 7) * 0.08) / playbackRate;
                  const delay = (i * 0.035);
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        borderRadius: '4px 4px 1px 1px',
                        background: isPlaying
                          ? `linear-gradient(180deg, #f59e0b 0%, #ec4899 ${50 + (i % 30)}%, #6366f1 100%)`
                          : 'rgba(255, 255, 255, 0.2)',
                        height: isPlaying ? undefined : `${(h * 0.28) + 10}%`,
                        animation: isPlaying
                          ? `eqSmoothWave${animType} ${durationSpeed}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s infinite alternate`
                          : 'none',
                        transition: isPlaying ? 'none' : 'height 0.4s ease',
                        boxShadow: isPlaying ? '0 0 8px rgba(245, 158, 11, 0.35)' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            /* Vista de Pasos Clave Explicados en la Canción */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {keySongPoints.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{pt.icon}</span> {pt.title}
                  </div>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Barra de Progreso y Duración */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '5px',
                cursor: 'pointer',
                overflow: 'hidden',
                marginBottom: '8px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #f59e0b 0%, #ec4899 50%, #6366f1 100%)',
                  borderRadius: '5px',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.7)',
                }}
              />
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  margin: 0,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#cbd5e1' }}>
              <span>⏱️ {formatTime(currentTime)}</span>
              <span>Total: {formatTime(duration)}</span>
            </div>
          </div>

          {/* Consola de Mandos de Audio: Botón Gigante Play, Velocidades y Volumen */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingTop: '6px',
            }}
          >
            {/* Controles de Reproducción */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* -10s */}
              <button
                onClick={() => skipTime(-10)}
                title="Retroceder 10 segundos"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCcw size={16} />
              </button>

              {/* Botón Principal Play / Pause Brillante */}
              <button
                onClick={togglePlay}
                style={{
                  background: isPlaying
                    ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                    : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  border: 'none',
                  color: '#0f172a',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.6), 0 4px 15px rgba(0,0,0,0.4)',
                  transform: isPlaying ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                }}
                title={isPlaying ? 'Pausar canción' : 'Reproducir canción interactiva'}
              >
                {isPlaying ? <Pause size={24} color="#0f172a" /> : <Play size={24} color="#0f172a" style={{ marginLeft: '3px' }} />}
              </button>

              {/* +10s */}
              <button
                onClick={() => skipTime(10)}
                title="Adelantar 10 segundos"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCw size={16} />
              </button>
            </div>

            {/* Controles de DJ: Velocidad & Silencio */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={cyclePlaybackRate}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Cambiar velocidad de la canción"
              >
                ⚡ {playbackRate}x Ritmo
              </button>

              <button
                onClick={toggleMute}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: isMuted ? '#ef4444' : '#ffffff',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          {/* Texto descriptivo */}
          <p
            style={{
              fontSize: '13px',
              color: '#cbd5e1',
              lineHeight: '1.6',
              margin: 0,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
            {description}
          </p>
        </div>

        {/* Números de Contacto / WhatsApp abajo del reproductor */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            🎵 ¿Te gustó la canción? Consulta tu caso sin costo por WhatsApp:
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <a
              href={`https://wa.me/573155030333?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#25D366',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '800',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.2s ease',
              }}
            >
              <Phone size={14} /> WhatsApp: 315 503 0333
            </a>
            <a
              href={`https://wa.me/573169773057?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#25D366',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '800',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.2s ease',
              }}
            >
              <Phone size={14} /> WhatsApp: 316 977 3057
            </a>
          </div>
        </div>
      </Card3D>

      <style jsx global>{`
        @keyframes eqSmoothWave1 {
          0% { height: 18%; }
          50% { height: 94%; }
          100% { height: 42%; }
        }
        @keyframes eqSmoothWave2 {
          0% { height: 35%; }
          50% { height: 16%; }
          100% { height: 88%; }
        }
        @keyframes eqSmoothWave3 {
          0% { height: 12%; }
          50% { height: 100%; }
          100% { height: 50%; }
        }
        @keyframes eqSmoothWave4 {
          0% { height: 55%; }
          50% { height: 22%; }
          100% { height: 78%; }
        }
        @keyframes eqSmoothWave5 {
          0% { height: 28%; }
          50% { height: 85%; }
          100% { height: 15%; }
        }
        @keyframes eqSmoothWave6 {
          0% { height: 40%; }
          50% { height: 95%; }
          100% { height: 60%; }
        }
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .vinyl-spinning {
          animation: spinSlow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
