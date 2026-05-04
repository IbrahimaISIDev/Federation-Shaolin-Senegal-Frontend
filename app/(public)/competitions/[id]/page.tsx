import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Competition {
    id: number;
    titre: string;
    description: string | null;
    lieu: string | null;
    dateDebut: string;
    dateFin: string | null;
    categories: string[] | null;
    imageUrl: string | null;
    region: { nom: string; code: string };
    _count: { inscriptions: number };
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

interface PageProps { params: Promise<{ id: string }> }

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatDateRange(start: string, end?: string | null) {
    if (!end || start === end) return formatDate(start);
    return `${new Date(start).getDate()} – ${formatDate(end)}`;
}
function getStatus(comp: Competition) {
    const now = new Date();
    const debut = new Date(comp.dateDebut);
    const fin = comp.dateFin ? new Date(comp.dateFin) : debut;
    if (now < debut) return { label: 'À venir', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    if (now <= fin)  return { label: 'Inscriptions ouvertes', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' };
    return { label: 'Terminée', cls: 'bg-muted text-muted-foreground' };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const comp = await getCompetition(id);
    return {
        title: comp ? comp.titre : 'Compétition',
        description: comp
            ? (comp.description?.slice(0, 160) ?? `Compétition à ${comp.lieu ?? comp.region.nom}`)
            : '',
    };
}

export default async function CompetitionDetailPage({ params }: PageProps) {
    const { id } = await params;
    const comp = await getCompetition(id);
    if (!comp) notFound();

    const status = getStatus(comp);
    const now = new Date();
    const isPast = now > new Date(comp.dateFin ?? comp.dateDebut);
    const categories: string[] = Array.isArray(comp.categories) ? comp.categories : [];

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-16">
                    <Button variant="ghost" size="sm" asChild
                        className="mb-6 -ml-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
                        <Link href="/competitions">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour aux compétitions
                        </Link>
                    </Button>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge className={`border-none ${status.cls}`}>{status.label}</Badge>
                        <Badge className="bg-white/20 text-white border-none">{comp.region.nom}</Badge>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-6">{comp.titre}</h1>

                    <div className="flex flex-wrap gap-6 text-primary-foreground/80 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDateRange(comp.dateDebut, comp.dateFin)}
                        </div>
                        {comp.lieu && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {comp.lieu}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {comp._count.inscriptions} inscrit{comp._count.inscriptions !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {comp.description && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4">À propos</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">{comp.description}</p>
                            </section>
                        )}

                        {categories.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Catégories</h2>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((cat) => (
                                        <Badge key={cat} variant="secondary" className="text-sm px-4 py-1.5">{cat}</Badge>
                                    ))}
                                </div>
                            </section>
                        )}

                        {isPast && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Résultats</h2>
                                <Button asChild variant="outline" className="gap-2">
                                    <Link href={`/competitions/${comp.id}/resultats`}>
                                        <Trophy className="w-4 h-4" />
                                        Voir les résultats officiels
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-lg">Informations</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Date</p>
                                            <p className="text-muted-foreground">{formatDateRange(comp.dateDebut, comp.dateFin)}</p>
                                        </div>
                                    </div>
                                    {comp.lieu && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-medium">Lieu</p>
                                                <p className="text-muted-foreground">{comp.lieu}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <Users className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium">Participants</p>
                                            <p className="text-muted-foreground">{comp._count.inscriptions} inscrits</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {!isPast && (
                            <Card className="bg-primary text-primary-foreground border-none">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-2">Participer</h3>
                                    <p className="text-sm opacity-80 mb-4">
                                        Licence ADSS valide requise pour s&apos;inscrire.
                                    </p>
                                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                        <Link href={`/competitions/${comp.id}/inscription`}>
                                            S&apos;inscrire
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
