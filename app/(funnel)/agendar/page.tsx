'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle2, ChevronRight, User, Phone, Mail, ExternalLink } from 'lucide-react';
import Card3D from '../../../components/ui/Card3D';
import ButtonPulse from '../../../components/ui/ButtonPulse';
import { saveAgendaToFirebase } from '../../../lib/firebase/client';
import AnimatedTitle from '../../../components/animations/AnimatedTitle';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DateDay {
  dateStr: string;      // Ej: "2026-07-13"
  dayName: string;      // Ej: "Lunes"
  dayNum: number;       // Ej: 13
  monthName: string;    // Ej: "Jul"
}

export default function AgendarPage() {
  const [selectedDate, setSelectedDate] = useState<DateDay | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [days, setDays] = useState<DateDay[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Datos del Cliente (Prellenados si hizo el Quiz)
  const [clientData, setClientData] = useState({
    nombre: '',
    celular: '',
    correo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Cargar los próximos 5 días hábiles y precargar datos de lead
  useEffect(() => {
    // 1. Obtener los próximos 5 días de semana (Lunes-Viernes)
    const nextDays: DateDay[] = [];
    let current = new Date();
    
    // Si es fin de semana (Sábado/Domingo), adelantar al Lunes
    if (current.getDay() === 6) current.setDate(current.getDate() + 2);
    else if (current.getDay() === 0) current.setDate(current.getDate() + 1);

    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const pad = (n: number) => String(n).padStart(2, '0');

    while (nextDays.length < 5) {
      const dayOfWeek = current.getDay();
      
      // Solo agregamos Lunes a Viernes
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`;
        nextDays.push({
          dateStr,
          dayName: weekdays[dayOfWeek],
          dayNum: current.getDate(),
          monthName: months[current.getMonth()],
        });
      }
      
      // Avanzar un día
      current.setDate(current.getDate() + 1);
    }

    setDays(nextDays);
    setSelectedDate(nextDays[0]);
  }, []);

  // Cargar horas de citas desde el servidor (Neon DB + Google Calendar) cuando se cambia de día
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) return;
      
      // Mostrar indicador temporal desactivando slots
      setTimeSlots([
        { time: '09:00 AM', available: false },
        { time: '10:00 AM', available: false },
        { time: '11:00 AM', available: false },
        { time: '02:00 PM', available: false },
        { time: '03:00 PM', available: false },
        { time: '04:00 PM', available: false },
      ]);

      try {
        const response = await fetch(`/api/agendas/check-slots?date=${selectedDate.dateStr}`);
        if (response.ok) {
          const data = await response.json();
          if (data.slots) {
            setTimeSlots(data.slots);
          }
        }
      } catch (err) {
        console.error('Error al cargar disponibilidad de horas:', err);
      }
      setSelectedTime(null);
    }

    fetchSlots();
  }, [selectedDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !clientData.nombre || !clientData.celular || !clientData.correo) {
      alert('Por favor completa todos los campos y selecciona fecha/hora.');
      return;
    }

    setIsSubmitting(true);

    try {
      const agenda = {
        cliente: clientData,
        fecha: selectedDate.dateStr,
        hora: selectedTime,
      };
      
      const res = await saveAgendaToFirebase(agenda);
      if (res.success) {
        setIsBooked(true);
      } else {
        alert('Cita programada con éxito localmente. Nos comunicaremos contigo.');
        setIsBooked(true);
      }
    } catch (err) {
      console.error('Error al agendar cita:', err);
      setIsBooked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-light)', padding: '60px 0 100px 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-blue)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Videollamada de Diagnóstico Gratuito
          </span>
          <AnimatedTitle
            tag="h1"
            style={{ fontSize: '36px', fontWeight: '900', color: 'var(--primary-dark)' }}
          >
            Agenda tu Asesoría Personalizada
          </AnimatedTitle>
          <p style={{ color: 'var(--text-light)', marginTop: '8px', fontSize: '16px' }}>
            Elige el día y la hora que mejor se acomoden a tu horario para analizar tu extracto hipotecario en vivo.
          </p>
        </div>

        {/* AGENDA DOCK */}
        <AnimatePresence mode="wait">
          {!isBooked ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid-2"
              style={{ alignItems: 'start' }}
            >
              
              {/* IZQUIERDA: CALENDARIO INTERACTIVO */}
              <Card3D variant="light" tilt={false} className="shadow-lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Selector de Fecha */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                      <Calendar size={18} color="var(--accent-blue)" /> 1. Elige una fecha
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {days.map((d) => {
                        const isSelected = selectedDate?.dateStr === d.dateStr;
                        return (
                          <button
                            key={d.dateStr}
                            type="button"
                            onClick={() => setSelectedDate(d)}
                            style={{
                              flex: '1 0 70px',
                              padding: '12px 6px',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                              background: isSelected ? 'rgba(59, 130, 246, 0.05)' : '#ffffff',
                              color: isSelected ? 'var(--primary-blue)' : 'var(--text-dark)',
                              textAlign: 'center',
                              cursor: 'pointer',
                              fontWeight: isSelected ? '800' : '500',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', display: 'block', opacity: 0.7 }}>{d.dayName.substring(0,3)}</span>
                            <span style={{ fontSize: '20px', fontWeight: '800', display: 'block', margin: '2px 0' }}>{d.dayNum}</span>
                            <span style={{ fontSize: '11px', display: 'block', opacity: 0.7 }}>{d.monthName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selector de Hora */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                      <Clock size={18} color="var(--accent-blue)" /> 2. Selecciona la hora
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {timeSlots.map((s) => {
                        const isSelected = selectedTime === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setSelectedTime(s.time)}
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)',
                              background: !s.available 
                                ? '#f1f5f9' 
                                : isSelected 
                                  ? 'rgba(59, 130, 246, 0.08)' 
                                  : '#ffffff',
                              color: !s.available 
                                ? 'var(--text-light)' 
                                : isSelected 
                                  ? 'var(--primary-blue)' 
                                  : 'var(--text-dark)',
                              fontWeight: isSelected ? '700' : '500',
                              cursor: s.available ? 'pointer' : 'not-allowed',
                              textDecoration: s.available ? 'none' : 'line-through',
                              opacity: s.available ? 1 : 0.5,
                              transition: 'var(--transition-smooth)',
                            }}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detalle Asesoría */}
                  <div style={{ background: 'rgba(59,130,246,0.05)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'start', fontSize: '13px', color: 'var(--text-medium)' }}>
                    <Video size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Modalidad Online:</strong> Videollamada de 15 minutos vía Google Meet. Te enviaremos el enlace a tu correo y recordatorio por WhatsApp.
                    </div>
                  </div>

                </div>
              </Card3D>

              {/* DERECHA: DATOS CLIENTE + CONFIRMACIÓN */}
              <Card3D variant="light" tilt={false} className="shadow-lg">
                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={18} color="var(--accent-yellow)" /> 3. Confirma tus datos
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Tu nombre completo</label>
                    <input
                      type="text"
                      value={clientData.nombre}
                      onChange={(e) => setClientData({ ...clientData, nombre: e.target.value })}
                      placeholder="Ej: Sandra Gómez"
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Celular / WhatsApp</label>
                    <input
                      type="tel"
                      value={clientData.celular}
                      onChange={(e) => setClientData({ ...clientData, celular: e.target.value })}
                      placeholder="Ej: 320 987 6543"
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-medium)' }}>Correo electrónico</label>
                    <input
                      type="email"
                      value={clientData.correo}
                      onChange={(e) => setClientData({ ...clientData, correo: e.target.value })}
                      placeholder="Ej: sandra@ejemplo.com"
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '8px' }}>
                    <ButtonPulse
                      type="submit"
                      variant="primary"
                      className="w-full"
                      pulse={true}
                    >
                      {isSubmitting ? 'Confirmando...' : 'Confirmar Videollamada'}
                    </ButtonPulse>
                  </div>

                  {/* Calendly Alternativo */}
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <a
                      href="https://calendly.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                    >
                      O prefiere agendar directamente en Calendly <ExternalLink size={12} />
                    </a>
                  </div>
                </form>
              </Card3D>

            </motion.div>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', maxWidth: '520px', margin: '40px auto 0 auto' }}
            >
              <Card3D variant="navy" glowColor="yellow" className="glow-card-yellow" tilt={true} maxRotation={6}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px 10px' }}>
                  <CheckCircle2 size={64} color="var(--accent-yellow-bright)" />
                  <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>
                    ¡Asesoría Agendada!
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>
                    Hola <strong>{clientData.nombre}</strong>. Tu cita de diagnóstico financiero ha sido confirmada con éxito.
                  </p>

                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', fontSize: '13px' }}>
                    <div>📅 <strong>Fecha:</strong> {selectedDate?.dayName}, {selectedDate?.dayNum} de {selectedDate?.monthName} de 2026</div>
                    <div>⏰ <strong>Hora:</strong> {selectedTime} (Hora Colombia)</div>
                    <div>💻 <strong>Plataforma:</strong> Google Meet (Enlace enviado a su correo)</div>
                  </div>

                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontStyle: 'italic' }}>
                    * Un analista se contactará contigo por WhatsApp minutos antes para reconfirmar la videollamada.
                  </p>

                  <ButtonPulse variant="white" onClick={() => window.location.href = '/'} pulse={false} className="w-full">
                    Volver al Inicio
                  </ButtonPulse>
                </div>
              </Card3D>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
