import { NextResponse } from 'next/server';
import { getAgendasFromDb } from '../../../../lib/db/neon';
import { getCalendarBusySlots, parseSlotTimes } from '../../../../lib/google/calendar';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Parámetro date es requerido en formato YYYY-MM-DD' }, { status: 400 });
    }

    // 1. Obtener citas de la Base de Datos (Neon DB)
    const dbAgendas = await getAgendasFromDb();
    const bookedTimesInDb = dbAgendas
      .filter((a) => a.fecha === date && a.estado !== 'rechazado')
      .map((a) => a.hora.toUpperCase().trim());

    // 2. Obtener bloqueos de Google Calendar (si está configurado)
    const busyPeriods = await getCalendarBusySlots(date);

    // 3. Ranuras estándar y sus rangos de hora
    const standardSlots = [
      { time: '09:00 AM', startHour: 9, endHour: 10 },
      { time: '10:00 AM', startHour: 10, endHour: 11 },
      { time: '11:00 AM', startHour: 11, endHour: 12 },
      { time: '02:00 PM', startHour: 14, endHour: 15 },
      { time: '03:00 PM', startHour: 15, endHour: 16 },
      { time: '04:00 PM', startHour: 16, endHour: 17 },
    ];

    const resultSlots = standardSlots.map((slot) => {
      // A. Verificar contra base de datos local
      const isBookedInDb = bookedTimesInDb.includes(slot.time.toUpperCase().trim());
      if (isBookedInDb) {
        return { time: slot.time, available: false };
      }

      // B. Verificar contra Google Calendar (cruzar horarios)
      const { startIso, endIso } = parseSlotTimes(date, slot.time);
      const slotStart = new Date(startIso);
      const slotEnd = new Date(endIso);

      const isOverlapping = busyPeriods.some((period) => {
        // Un traslape ocurre si la ranura comienza antes del fin del evento, y termina después del inicio del evento.
        // Toleramos desfases pequeños (ej. si el slot y el periodo coinciden exactamente en el segundo de término).
        return slotStart < period.end && slotEnd > period.start;
      });

      return {
        time: slot.time,
        available: !isOverlapping,
      };
    });

    return NextResponse.json({ slots: resultSlots });
  } catch (error: any) {
    console.error('Error en API GET /api/agendas/check-slots:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
