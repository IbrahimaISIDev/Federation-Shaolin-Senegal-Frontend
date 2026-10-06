'use client';

import { CalendarPlus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SITE_URL } from '@/lib/constants';

interface CalendarEvent {
  id: number;
  titre: string;
  dateDebut: string;
  dateFin?: string | null;
  lieu?: string | null;
  description?: string | null;
}

// Les compétitions sont saisies à la journée : événement « journée entière »,
// du jour de début au lendemain du jour de fin (fin exclusive, norme iCalendar).
const ymd = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

function eventDays(e: CalendarEvent) {
  const start = new Date(e.dateDebut);
  const end = new Date(e.dateFin ?? e.dateDebut);
  end.setDate(end.getDate() + 1);
  return { start: ymd(start), end: ymd(end) };
}

const icsEscape = (v: string) => v.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

function downloadIcs(e: CalendarEvent) {
  const { start, end } = eventDays(e);
  const url = `${SITE_URL}/competitions/${e.id}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ADSS Senegal//Competitions//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:competition-${e.id}@shaolin-senegal.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${icsEscape(e.titre)}`,
    e.lieu ? `LOCATION:${icsEscape(e.lieu)}` : '',
    `DESCRIPTION:${icsEscape(`${e.description ? `${e.description}\n\n` : ''}${url}`)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `competition-adss-${e.id}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function googleUrl(e: CalendarEvent) {
  const { start, end } = eventDays(e);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.titre,
    dates: `${start}/${end}`,
    details: `${e.description ? `${e.description}\n\n` : ''}${SITE_URL}/competitions/${e.id}`,
    ...(e.lieu ? { location: e.lieu } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** « Ajouter à mon agenda » : Google Agenda, ou fichier .ics (iPhone, Outlook…). */
export function AddToCalendar({ event, className }: { event: CalendarEvent; className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Ajouter à mon agenda <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <a href={googleUrl(event)} target="_blank" rel="noopener noreferrer">Google Agenda</a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadIcs(event)}>
          iPhone, Outlook… (fichier .ics)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
