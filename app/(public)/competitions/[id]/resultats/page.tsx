import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, MapPin, ArrowLeft, Medal, Users } from 'lucide-react';

// Mock past competitions data
const mockPastCompetitions = [
    {
        id: '4',
        title: 'Tournoi Inter-Clubs Saint-Louis',
        type: 'regional',
        date: '2024-01-20',
        location: 'Gymnase Municipal de Saint-Louis',
        participants: 85,
        results: [
            {
                category: 'Taolu Senior Masculin',
                podium: [
                    { rank: 1, name: 'Moussa Ndiaye', club: 'Wushu Academy Thiès' },
                    { rank: 2, name: 'Amadou Ba', club: 'Temple Shaolin Dakar' },
                    { rank: 3, name: 'Ibrahima Fall', club: 'Dragon de Feu Saint-Louis' },
                ],
            },
            {
                category: 'Sanda -70kg',
                podium: [
                    { rank: 1, name: 'Ousmane Sow', club: 'Shaolin Ziguinchor' },
                    { rank: 2, name: 'Modou Diagne', club: 'Temple Shaolin Dakar' },
                    { rank: 3, name: 'Alioune Badara', club: 'Dragon Rouge Thiès' },
                ],
            },
        ],
        generalWinner: 'Dragon de Feu Saint-Louis',
    },
];

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const comp = mockPastCompetitions.find((c) => c.id === id);
    return {
        title: comp ? `Résultats - ${comp.title}` : 'Résultats Compétition',
        description: comp ? `Consultez les résultats du ${comp.title}.` : 'Résultats de la compétition',
    };
}

export default async function CompetitionResultsPage({ params }: PageProps) {
    const { id } = await params;
    const comp = mockPastCompetitions.find((c) => c.id === id);

    if (!comp) {
        // If not found in past, could be upcoming (no results yet)
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero Header */}
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-12">
                    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
                        <Link href="/competitions">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour aux compétitions
                        </Link>
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Terminé</Badge>
                                <Badge variant="secondary">{comp.type.toUpperCase()}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                                {comp.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(comp.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {comp.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {comp.participants} participants
                                </div>
                            </div>
                        </div>

                        {comp.generalWinner && (
                            <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-center gap-4">
                                <Trophy className="w-10 h-10 text-accent" />
                                <div>
                                    <p className="text-xs font-semibold text-accent uppercase tracking-wider">Grand Vainqueur</p>
                                    <p className="font-bold text-lg">{comp.generalWinner}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Content */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Podiums par catégorie</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {comp.results.map((category, idx) => (
                        <Card key={idx} className="overflow-hidden border shadow-sm">
                            <CardHeader className="bg-muted/50 border-b">
                                <CardTitle className="text-lg">{category.category}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {category.podium.map((rank) => (
                                        <div key={rank.rank} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${rank.rank === 1 ? 'bg-amber-100 text-amber-700' :
                                                    rank.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {rank.rank === 1 ? <Medal className="w-4 h-4" /> : rank.rank}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{rank.name}</p>
                                                    <p className="text-sm text-muted-foreground">{rank.club}</p>
                                                </div>
                                            </div>
                                            {rank.rank === 1 && <Badge className="bg-amber-100 text-amber-700 border-amber-200">OR</Badge>}
                                            {rank.rank === 2 && <Badge className="bg-slate-100 text-slate-700 border-slate-200">ARGENT</Badge>}
                                            {rank.rank === 3 && <Badge className="bg-orange-100 text-orange-700 border-orange-200">BRONZE</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <section className="mt-16 bg-muted/30 p-8 rounded-3xl text-center">
                    <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Félicitations à tous les participants !</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        L&apos;Association remercie tous les athlètes, entraîneurs et arbitres pour leur contribution
                        à la réussite de cet événement sportif.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/galerie">Voir les photos de l&apos;événement</Link>
                    </Button>
                </section>
            </div>
        </main>
    );
}
