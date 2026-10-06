import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, MapPin, ArrowLeft, Users, Clock, Medal } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Competition {
    id: number;
    titre: string;
    lieu: string | null;
    dateDebut: string;
    dateFin: string | null;
    region: { nom: string; code: string };
    _count: { inscriptions: number };
    resultatsPublies: boolean;
    // Renvoyés par l'API uniquement une fois publiés
    resultats: Array<{
        id: number;
        categorie: string;
        classement: number;
        points: number | null;
        medaille: 'OR' | 'ARGENT' | 'BRONZE' | null;
        member: { prenom: string; nom: string; club: { nom: string } };
    }>;
}

const MEDAL_STYLE: Record<string, { label: string; cls: string; circle: string }> = {
    OR: { label: 'OR', cls: 'bg-amber-100 text-amber-700 border-amber-200', circle: 'bg-amber-100 text-amber-700' },
    ARGENT: { label: 'ARGENT', cls: 'bg-slate-100 text-slate-700 border-slate-200', circle: 'bg-slate-100 text-slate-700' },
    BRONZE: { label: 'BRONZE', cls: 'bg-orange-100 text-orange-700 border-orange-200', circle: 'bg-orange-100 text-orange-700' },
};

async function getCompetition(id: string): Promise<Competition | null> {
    try {
        const res = await fetch(`${API_URL}/competitions/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? null;
    } catch {
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const comp = await getCompetition(id);
    return {
        title: comp ? `Résultats — ${comp.titre}` : 'Résultats de compétition',
        description: comp ? `Résultats officiels : ${comp.titre}.` : 'Résultats de compétition',
    };
}

// Résultats officiels saisis puis publiés depuis l'admin ; tant qu'ils ne sont
// pas publiés, la page affiche un état « résultats à venir ».
export default async function CompetitionResultsPage({ params }: PageProps) {
    const { id } = await params;
    const comp = await getCompetition(id);
    if (!comp) notFound();

    const isPast = new Date(comp.dateFin ?? comp.dateDebut) < new Date();
    const results = comp.resultatsPublies ? comp.resultats ?? [] : [];

    // Regroupement par catégorie (ordre déjà trié par l'API)
    const byCategory = new Map<string, Competition['resultats']>();
    for (const r of results) {
        if (!byCategory.has(r.categorie)) byCategory.set(r.categorie, []);
        byCategory.get(r.categorie)!.push(r);
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-12">
                    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
                        <Link href={`/competitions/${comp.id}`}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la compétition
                        </Link>
                    </Button>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{isPast ? 'Terminée' : 'À venir'}</Badge>
                            <Badge variant="secondary">{comp.region.nom}</Badge>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {comp.titre}
                        </h1>
                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(comp.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            {comp.lieu && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {comp.lieu}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {comp._count.inscriptions} inscrit{comp._count.inscriptions > 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {results.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-bold mb-8">Classements par catégorie</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {[...byCategory.entries()].map(([categorie, rows]) => (
                                <Card key={categorie || '__none__'} className="overflow-hidden border shadow-sm">
                                    <CardHeader className="bg-muted/50 border-b">
                                        <CardTitle className="text-lg">{categorie || 'Classement général'}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y">
                                            {rows.map((r) => {
                                                const medal = r.medaille ? MEDAL_STYLE[r.medaille] : null;
                                                return (
                                                    <div key={r.id} className="flex items-center justify-between gap-3 p-4">
                                                        <div className="flex min-w-0 items-center gap-4">
                                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${medal ? medal.circle : 'bg-muted text-muted-foreground'}`}>
                                                                {r.classement === 1 ? <Medal className="w-4 h-4" /> : r.classement}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="truncate font-semibold text-foreground">{r.member.prenom} {r.member.nom}</p>
                                                                <p className="truncate text-sm text-muted-foreground">{r.member.club.nom}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-2">
                                                            {r.points != null && <span className="text-sm text-muted-foreground">{r.points} pts</span>}
                                                            {medal && <Badge className={medal.cls}>{medal.label}</Badge>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <section className="mx-auto max-w-2xl rounded-3xl bg-muted/30 p-10 text-center">
                        {isPast ? (
                            <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
                        ) : (
                            <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                        )}
                        <h2 className="text-xl font-bold mb-2">Résultats officiels bientôt disponibles</h2>
                        <p className="text-muted-foreground">
                            {isPast
                                ? "Les résultats de cette compétition n'ont pas encore été publiés par l'association."
                                : 'Les résultats seront publiés après la compétition.'}
                        </p>
                        <Button variant="outline" asChild className="mt-6">
                            <Link href="/competitions">Voir toutes les compétitions</Link>
                        </Button>
                    </section>
                )}
            </div>
        </main>
    );
}
