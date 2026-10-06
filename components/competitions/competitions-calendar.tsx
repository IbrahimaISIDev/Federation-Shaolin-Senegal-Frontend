'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { competitionsApi, type Competition } from '@/lib/api/competitions';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Grille de 6 semaines commençant un lundi, englobant le mois affiché
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // lundi = 0
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Compétitions couvrant un jour donné (du jour de début au jour de fin inclus)
function coversDay(c: Competition, day: Date) {
  const start = startOfDay(new Date(c.dateDebut));
  const end = startOfDay(new Date(c.dateFin ?? c.dateDebut));
  return day >= start && day <= end;
}

export function CompetitionsCalendar() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const days = useMemo(() => monthGrid(month), [month]);
  const from = days[0];
  const to = new Date(days[41]);
  to.setHours(23, 59, 59, 999);

  const { data, isLoading } = useQuery({
    queryKey: ['public', 'competitions', 'calendar', month.getFullYear(), month.getMonth()],
    queryFn: () => competitionsApi.list({ from: from.toISOString(), to: to.toISOString(), limit: 200 }),
  });
  const competitions: Competition[] = data?.data ?? [];

  const byDay = useMemo(() => {
    const map = new Map<string, Competition[]>();
    for (const d of days) map.set(dayKey(d), competitions.filter((c) => coversDay(c, d)));
    return map;
  }, [days, competitions]);

  const inMonth = competitions.filter((c) => {
    const start = new Date(c.dateDebut);
    const end = new Date(c.dateFin ?? c.dateDebut);
    const mStart = month;
    const mEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
    return start <= mEnd && end >= mStart;
  });

  const shift = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));
  const today = dayKey(new Date());
  const label = month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Mois précédent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold capitalize text-foreground">{label}</h2>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { const n = new Date(); setMonth(new Date(n.getFullYear(), n.getMonth(), 1)); }}
          >
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Mois suivant">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {WEEKDAYS.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const items = byDay.get(dayKey(d)) ?? [];
            const outside = d.getMonth() !== month.getMonth();
            const isToday = dayKey(d) === today;
            return (
              <div
                key={dayKey(d)}
                className={cn(
                  'min-h-16 border-b border-r p-1 md:min-h-24 md:p-1.5 [&:nth-child(7n)]:border-r-0',
                  outside && 'bg-muted/20 text-muted-foreground/60',
                )}
              >
                <div className={cn(
                  'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs',
                  isToday && 'bg-accent font-bold text-accent-foreground',
                )}>
                  {d.getDate()}
                </div>
                {/* Mobile : pastilles ; écran large : titres */}
                <div className="flex flex-wrap gap-1 md:hidden">
                  {items.map((c) => <span key={c.id} className="h-2 w-2 rounded-full bg-accent" title={c.titre} />)}
                </div>
                <div className="hidden space-y-1 md:block">
                  {items.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/competitions/${c.id}`}
                      title={c.titre}
                      className="block truncate rounded bg-accent/15 px-1.5 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-accent/30"
                    >
                      {c.titre}
                    </Link>
                  ))}
                  {items.length > 3 && <span className="px-1 text-[11px] text-muted-foreground">+{items.length - 3}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-foreground">Ce mois-ci</h3>
        {inMonth.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune compétition programmée en {label}.</p>
        ) : (
          <ul className="space-y-2">
            {inMonth.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/competitions/${c.id}`}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:border-accent/40 hover:bg-muted/30"
                >
                  <div className="w-14 shrink-0 text-center">
                    <div className="text-xl font-bold leading-none text-primary">{new Date(c.dateDebut).getDate()}</div>
                    <div className="text-xs uppercase text-muted-foreground">
                      {new Date(c.dateDebut).toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{c.titre}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" /> {c.lieu ?? c.region?.nom}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
