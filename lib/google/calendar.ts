'use strict';

interface CalendarEventInput {
  nombre: string;
  correo: string;
  celular: string;
  fecha: string; // YYYY-MM-DD
  hora: string;  // Ej: "09:00 AM" o "02:00 PM"
}

/**
 * Checks if the Google Calendar API credentials are configured in environment variables.
 */
export function isCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

/**
 * Gets a fresh access token from Google using the refresh token.
 */
async function getAccessToken(): Promise<string | null> {
  if (!isCalendarConfigured()) {
    console.warn('Google Calendar credentials not configured.');
    return null;
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Failed to refresh Google access token:', errText);
      return null;
    }

    const data = await res.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error refreshing Google access token:', error);
    return null;
  }
}

/**
 * Converts date and time slot strings into Colombia timezone ISO strings.
 */
export function parseSlotTimes(fecha: string, hora: string): { startIso: string; endIso: string } {
  // hora is in format "09:00 AM" or "02:00 PM"
  const match = hora.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
  let hour = 9;
  
  if (match) {
    let h = parseInt(match[1]);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    hour = h;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  
  // Colombia is always UTC-5
  const startIso = `${fecha}T${pad(hour)}:00:00-05:00`;
  const endIso = `${fecha}T${pad(hour + 1)}:00:00-05:00`;
  
  return { startIso, endIso };
}

/**
 * Fetches events for a specific day from Google Calendar to check busy times.
 */
export async function getCalendarBusySlots(fecha: string): Promise<Array<{ start: Date; end: Date }>> {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  // Time window: whole day in Colombia timezone
  const timeMin = `${fecha}T00:00:00-05:00`;
  const timeMax = `${fecha}T23:59:59-05:00`;

  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(
      timeMax
    )}&singleEvents=true&orderBy=startTime`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch events from Google Calendar:', await res.text());
      return [];
    }

    const data = await res.json();
    const items = data.items || [];

    return items
      .filter((item: any) => item.status !== 'cancelled')
      .map((item: any) => {
        const startStr = item.start?.dateTime || item.start?.date;
        const endStr = item.end?.dateTime || item.end?.date;
        return {
          start: new Date(startStr),
          end: new Date(endStr),
        };
      });
  } catch (error) {
    console.error('Error listing events from Google Calendar:', error);
    return [];
  }
}

/**
 * Creates an event in Google Calendar with Google Meet video call.
 */
export async function createCalendarEvent(input: CalendarEventInput): Promise<{ success: boolean; eventId?: string; meetLink?: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false };
  }

  const { startIso, endIso } = parseSlotTimes(input.fecha, input.hora);
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  const eventPayload = {
    summary: `Asesoría de Reducción Hipotecaria - ${input.nombre}`,
    description: `Asesoría personalizada con Williams Cruz.\n\nDatos de contacto:\n- Celular: ${input.celular}\n- Correo: ${input.correo}\n\nCreado automáticamente desde el Simulador Susfinanzas.`,
    start: {
      dateTime: startIso,
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: endIso,
      timeZone: 'America/Bogota',
    },
    attendees: [
      { email: input.correo, displayName: input.nombre }
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    );

    if (!res.ok) {
      console.error('Failed to create event in Google Calendar:', await res.text());
      return { success: false };
    }

    const data = await res.json();
    const meetLink = data.hangoutLink || data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;
    
    console.log('Event successfully created in Google Calendar:', data.id, 'Meet Link:', meetLink);
    return { success: true, eventId: data.id, meetLink };
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return { success: false };
  }
}
