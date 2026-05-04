'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, ArrowRight, Loader2, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { membersApi } from '@/lib/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCompStatus(dateDebut: string, dateFin: string | null) {
    const now = new Date();
    const debut = new Date(dateDebut);
    const fin = dateFin ? new Date(dateFin) : debut;
    if (now < debut) return { label: 'À venir', cls: 'bg-blue-100 text-blue-800' };
    if (now <= fin)  return { label: 'En cours', cls: 'bg-emerald-100 text-emerald-800' };
    return { label: 'Terminée', cls: 'bg-muted text-muted-foreground' };
}

export default function MemberCompetitionsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['member', 'inscriptions'],
        queryFn: () => membersApi.myInscriptions(),
        staleTime: 5 * 60 * 1000,
    });

    const inscriptions: any[] = data?.data ?? [];
    const upcoming = inscriptions.filter((i) => new Date(i.competition.dateDebut) >= new Date());
    const past     = inscriptions.filter((i) => new Date(i.competition.dateDebut) <  new Date());

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <motion.div variants={FADE_IN_UP} className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Mes Compétitions</h1>
                    <p className="text-muted-foreground">Vos inscriptions aux compétitions officielles.</p>
                </div>
                <Button asChild className="bg-accent hover:bg-accent/90 w-fit gap-2">
                    <Link href="/competitions">
                        Voir toutes les compétitions
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </Button>
            </motion.div>

            {inscriptions.length === 0 ? (
                <motion.div variants={FADE_IN_UP}>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Inbox className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">Aucune inscription</p>
                                <p className="text-muted-foreground text-sm">
                                    Vous n&apos;êtes inscrit(e) à aucune compétition pour le moment.
                                </p>
                            </div>
                            <Button asChild className="bg-accent hover:bg-accent/90">
                                <Link href="/competitions">Parcourir les compétitions</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <motion.div variants={FADE_IN_UP} className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-accent" />
                                À venir ({upcoming.length})
                            </h2>
                            {upcoming.map((ins) => {
                                const s = getCompStatus(ins.competition.dateDebut, ins.competition.dateFin);
                                return (
                                    <Card key={ins.id} className="border-l-4 border-l-accent">
                                        <CardContent className="p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`border-none text-xs ${s.cls}`}>{s.label}</Badge>
                                                        {ins.categorie && (
                                                            <Badge variant="outline" className="text-xs">{ins.categorie}</Badge>
                                                        )}
                                                    </div>
                                                    <p className="font-semibold text-foreground">{ins.competition.titre}</p>
                                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {formatDate(ins.competition.dateDebut)}
                                                        </span>
                                                        {ins.competition.lieu && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                {ins.competition.lieu}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/competitions/${ins.competition.id}`}>
                                                        Détails
                                                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </motion.div>
                    )}

                    {past.length > 0 && (
                        <motion.div variants={FADE_IN_UP} className="space-y-4">
                            <h2 className="text-lg font-semibold text-muted-foreground">
                                Passées ({past.length})
                            </h2>
                            {past.map((ins) => (
                                <Card key={ins.id} className="opacity-80">
                                    <CardContent className="p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">Terminée</Badge>
                                                    {ins.categorie && (
                                                        <Badge variant="secondary" className="text-xs">{ins.categorie}</Badge>
                                                    )}
                                                </div>
                                                <p className="font-medium text-foreground">{ins.competition.titre}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(ins.competition.dateDebut)}
                                                    </span>
                                                    {ins.competition.lieu && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {ins.competition.lieu}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/competitions/${ins.competition.id}/resultats`}>
                                                    Résultats
                                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
}
