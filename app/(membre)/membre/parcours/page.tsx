'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Calendar, CalendarClock, ChevronRight, CreditCard, Loader2, MapPin, Medal, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { membersApi, type MemberJourney } from '@/lib/api/members';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';
import { cn } from '@/lib/utils';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const MEDAL = {
  OR: { label: 'Or', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  ARGENT: { label: 'Argent', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  BRONZE: { label: 'Bronze', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
} as const;

const LICENSE_STATUS: Record<MemberJourney['licenses'][number]['status'], { label: string; cls: string }> = {
  ACTIVE: { label: 'Active', cls: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  EXPIRED: { label: 'Expirée', cls: 'border-border bg-muted text-muted-foreground' },
  PENDING: { label: 'En attente', cls: 'border-amber-200 bg-amber-50 text-amber-800' },
  SUSPENDED: { label: 'Suspendue', cls: 'border-red-200 bg-red-50 text-red-700' },
};

const ordinal = (n: number) => (n === 1 ? '1er' : `${n}e`);

function StatTile({ icon: Icon, value, label }: { icon: typeof Trophy; value: React.ReactNode; label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold leading-tight text-foreground">{value}</div>
          <div className="truncate text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MemberJourneyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['member', 'journey'],
    queryFn: () => membersApi.journey(),
  });
  const j = data?.data;

  if (isLoading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }
  if (isError || !j) {
    return <p className="py-24 text-center text-muted-foreground">Votre parcours n&apos;a pas pu être chargé. Réessayez dans un instant.</p>;
  }

  const { medailles } = j.bilan;
  const totalMedals = medailles.or + medailles.argent + medailles.bronze;
  const upcoming = j.competitions.filter((c) => c.aVenir);
  const past = j.competitions.filter((c) => !c.aVenir);
  const initials = `${j.prenom[0] ?? ''}${j.nom[0] ?? ''}`.toUpperCase();

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
      {/* En-tête */}
      <motion.div variants={FADE_IN_UP}>
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />
          <CardContent className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ring-accent/30">
              {j.photoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={j.photoUrl} alt="" className="h-full w-full object-cover" />
                : <span className="font-serif text-2xl font-bold text-primary">{initials}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-foreground">Mon parcours</h1>
              <p className="text-muted-foreground">{j.prenom} {j.nom} · {j.club.nom} ({j.club.region.nom})</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge className="gap-1 bg-accent text-accent-foreground"><Award className="h-3 w-3" /> {j.grade || 'Grade non renseigné'}</Badge>
                {j.discipline && <Badge variant="secondary">{j.discipline}</Badge>}
                <Badge variant="outline">Membre depuis {new Date(j.createdAt).getFullYear()}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bilan */}
      <motion.div variants={FADE_IN_UP} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Trophy} value={j.bilan.competitionsDisputees} label="Compétitions disputées" />
        <StatTile
          icon={Medal}
          value={totalMedals ? <span className="text-base">🥇 {medailles.or} · 🥈 {medailles.argent} · 🥉 {medailles.bronze}</span> : 0}
          label="Médailles"
        />
        <StatTile icon={CreditCard} value={j.bilan.saisonsLicenciees} label="Saisons licenciées" />
        <StatTile icon={TrendingUp} value={j.bilan.passagesDeGrade} label="Passages de grade" />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Progression des grades */}
        <motion.div variants={FADE_IN_UP}>
          <Card className="h-full">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-5 w-5 text-accent" /> Progression des grades</CardTitle></CardHeader>
            <CardContent>
              {j.gradeHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Grade actuel : <strong className="text-foreground">{j.grade || 'non renseigné'}</strong>. Les passages de
                  grade validés par l&apos;association apparaîtront ici.
                </p>
              ) : (
                <ol className="relative space-y-5 border-l-2 border-accent/20 pl-6">
                  {j.gradeHistory.map((g, i) => (
                    <li key={g.id} className="relative">
                      <span className={cn(
                        'absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background',
                        i === 0 ? 'bg-accent' : 'bg-accent/40'
                      )} />
                      <p className="font-semibold text-foreground">{g.nouveauGrade}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(g.createdAt)}{g.ancienGrade ? ` · après ${g.ancienGrade}` : ''}
                      </p>
                      {g.notes && <p className="mt-1 text-sm text-muted-foreground">{g.notes}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Compétitions */}
        <motion.div variants={FADE_IN_UP}>
          <Card className="h-full">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Trophy className="h-5 w-5 text-accent" /> Compétitions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {j.competitions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune participation pour le moment.{' '}
                  <Link href="/competitions" className="text-accent hover:underline">Voir les compétitions à venir</Link>
                </p>
              )}
              {[...upcoming, ...past].map((c) => (
                <Link
                  key={c.id}
                  href={c.resultats.length ? `/competitions/${c.competition.id}/resultats` : `/competitions/${c.competition.id}`}
                  className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:border-accent/40 hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground group-hover:text-primary">{c.competition.titre}</p>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(c.competition.dateDebut)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.competition.lieu ?? c.competition.region.nom}</span>
                      {c.categorie && <span>{c.categorie}</span>}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.aVenir ? (
                        <Badge variant="outline" className="gap-1 border-blue-200 text-blue-700"><CalendarClock className="h-3 w-3" /> À venir — inscrit</Badge>
                      ) : c.resultats.length ? (
                        c.resultats.map((r, k) => (
                          <Badge key={k} variant="outline" className={r.medaille ? MEDAL[r.medaille].cls : ''}>
                            {ordinal(r.classement)}{r.categorie && r.categorie !== c.categorie ? ` · ${r.categorie}` : ''}
                            {r.medaille ? ` · ${MEDAL[r.medaille].label}` : ''}
                            {r.points != null ? ` · ${r.points} pts` : ''}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          {c.competition.resultatsPublies ? 'Non classé' : 'Résultats pas encore publiés'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Licences par saison */}
      <motion.div variants={FADE_IN_UP}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5 text-accent" /> Licences par saison</CardTitle></CardHeader>
          <CardContent>
            {j.licenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune licence enregistrée.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {j.licenses.map((l) => (
                  <div key={l.id} className={cn('rounded-lg border px-4 py-2 text-center', LICENSE_STATUS[l.status].cls)}>
                    <div className="text-lg font-bold">{l.annee}</div>
                    <div className="text-xs">{LICENSE_STATUS[l.status].label}</div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/membre/licence" className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline">
              Gérer ma licence <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
