'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Trophy, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { competitionsApi, type Competition } from '@/lib/api';

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  inscriptions_ouvertes: { label: 'Inscriptions ouvertes', variant: 'default' },
  a_venir: { label: 'À venir', variant: 'secondary' },
  complet: { label: 'Complet', variant: 'destructive' },
  termine: { label: 'Terminé', variant: 'outline' },
};

function getCompetitionStatus(c: Competition) {
  const now = new Date();
  const debut = new Date(c.dateDebut);
  const fin = c.dateFin ? new Date(c.dateFin) : debut;
  fin.setHours(23, 59, 59, 999);

  if (now < debut) return 'a_venir';
  if (now >= debut && now <= fin) return 'inscriptions_ouvertes';
  return 'termine';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateRange(startDate: string, endDate?: string | null): string {
  const start = formatDate(startDate);
  if (!endDate || startDate === endDate) return start;

  const end = new Date(endDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });
  return `${new Date(startDate).getDate()} - ${end} ${new Date(endDate).getFullYear()}`;
}

export default function CompetitionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public', 'competitions'],
    queryFn: () => competitionsApi.list({ limit: 100 }), // Fetching all for now
    staleTime: 60 * 1000,
  });

  const competitions: Competition[] = data?.data ?? [];

  const upcoming = competitions.filter(c => {
    const s = getCompetitionStatus(c);
    return s === 'a_venir' || s === 'inscriptions_ouvertes';
  });
  const past = competitions.filter(c => getCompetitionStatus(c) === 'termine');

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Compétitions
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Participez aux compétitions officielles de l&apos;ADSS et mesurez-vous aux meilleurs pratiquants.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="w-6 h-6 animate-spin" /> Chargement du calendrier...
        </div>
      ) : (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="upcoming" className="space-y-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="upcoming" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  À venir ({upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="gap-2">
                  <Trophy className="w-4 h-4" />
                  Passées ({past.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                {upcoming.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">Aucune compétition à venir pour le moment.</div>
                ) : upcoming.map((comp) => {
                  const statusInfo = statusLabels[getCompetitionStatus(comp)];
                  return (
                    <Card key={comp.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        {/* Date Badge */}
                        <div className="bg-primary/10 text-primary p-6 md:w-48 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border">
                          <span className="text-4xl font-bold">
                            {new Date(comp.dateDebut).getDate()}
                          </span>
                          <span className="text-sm uppercase font-semibold">
                            {new Date(comp.dateDebut).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                          <span className="text-sm opacity-80">
                            {new Date(comp.dateDebut).getFullYear()}
                          </span>
                        </div>

                        {/* Content */}
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold text-foreground">
                                {comp.titre}
                              </h3>
                            </div>
                            {(comp.dateFin && new Date() <= new Date(comp.dateFin)) && (
                              <Button className="bg-accent hover:bg-accent/90 gap-2 w-full md:w-auto" asChild>
                                <Link href={`/competitions/${comp.id}/inscription`}>
                                  S&apos;inscrire
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 shrink-0 text-muted-foreground" />
                              {formatDateRange(comp.dateDebut, comp.dateFin)}
                            </div>
                            {comp.lieu && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 shrink-0 text-muted-foreground" />
                                {comp.lieu}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 shrink-0 text-muted-foreground" />
                              {comp._count?.inscriptions ?? 0} inscrits
                            </div>
                          </div>

                          {comp.description && (
                            <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
                              <p className="line-clamp-2">{comp.description}</p>
                            </div>
                          )}
                          <div className="mt-4 pt-4 text-sm">
                            <Link href={`/competitions/${comp.id}`} className="text-accent font-medium hover:underline flex items-center gap-1">Voir les détails de la compétition <ArrowRight className="w-3 h-3" /></Link>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )
                })}
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                {past.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">Aucune compétition passée.</div>
                ) : past.map((comp) => (
                  <Card key={comp.id} className="overflow-hidden opacity-90 shadow-sm">
                    <CardHeader className="pb-2 bg-muted/20 border-b border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Terminée</Badge>
                      </div>
                      <CardTitle className="text-lg">{comp.titre}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 shrink-0" />
                          {formatDateRange(comp.dateDebut, comp.dateFin)}
                        </div>
                        {comp.lieu && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 shrink-0" />
                            {comp.lieu}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4 shrink-0" />
                          {comp._count?.inscriptions ?? 0} participants
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t flex justify-end">
                        <Button variant="outline" className="gap-2" asChild>
                          <Link href={`/competitions/${comp.id}`}>
                            Détails & Résultats
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Prêt à participer ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Pour participer aux compétitions officielles, vous devez être membre de l&apos;ADSS
            et posséder une licence valide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/affiliation">Devenir membre</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
