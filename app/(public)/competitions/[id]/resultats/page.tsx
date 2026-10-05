import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, MapPin, ArrowLeft, Users, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Competition {
    id: number;
    titre: string;
    lieu: string | null;
    dateDebut: string;
    dateFin: string | null;
    region: { nom: string; code: string };
    _count: { inscriptions: number };
    resultats: unknown[];
}

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

// Les résultats officiels ne sont pas encore saisissables depuis l'admin :
// la page affiche la compétition réelle et un état « résultats à venir »,
// au lieu des anciens podiums fictifs.
export default async function CompetitionResultsPage({ params }: PageProps) {
    const { id } = await params;
    const comp = await getCompetition(id);
    if (!comp) notFound();

    const isPast = new Date(comp.dateFin ?? comp.dateDebut) < new Date();

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
            </div>
        </main>
    );
}
