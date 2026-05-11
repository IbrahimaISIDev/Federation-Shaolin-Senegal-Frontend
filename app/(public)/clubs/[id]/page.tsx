import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ArrowLeft, Phone, Mail, Building2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Club {
    id: number;
    nom: string;
    ville: string | null;
    description: string | null;
    telephone: string | null;
    email: string | null;
    logoUrl: string | null;
    nomMaitre: string | null;
    isActive: boolean;
    region: { nom: string; code: string };
    _count?: { members: number };
}

async function getClub(id: string): Promise<Club | null> {
    try {
        const res = await fetch(`${API_URL}/clubs/${id}`, { next: { revalidate: 60 } });
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
    const club = await getClub(id);
    return {
        title: club ? club.nom : 'Détail du Club',
        description: club
            ? `Découvrez le club ${club.nom} à ${club.ville ?? club.region.nom}.`
            : 'Détail du club',
    };
}

export default async function ClubDetailPage({ params }: PageProps) {
    const { id } = await params;
    const club = await getClub(id);

    if (!club) notFound();

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-16">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mb-6 -ml-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
                    >
                        <Link href="/clubs">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour aux clubs
                        </Link>
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {club.logoUrl ? (
                                <img
                                    src={club.logoUrl}
                                    alt={club.nom}
                                    className="h-20 w-20 rounded-xl object-contain bg-white/10 p-2"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/10">
                                    <Building2 className="h-10 w-10 text-primary-foreground/50" />
                                </div>
                            )}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-none">
                                        {club.region.nom}
                                    </Badge>
                                    {!club.isActive && (
                                        <Badge className="bg-destructive/80 text-white border-none">
                                            Inactif
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold mb-3">{club.nom}</h1>
                                <div className="flex flex-wrap gap-4 text-primary-foreground/80">
                                    {(club.ville || club.region.nom) && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {club.ville ? `${club.ville}, ` : ''}{club.region.nom}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {club._count?.members ?? 0} membre{(club._count?.members ?? 0) !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0" asChild>
                            <Link href="/affiliation">S&apos;inscrire au club</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-10">
                        {club.description && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4">À propos du club</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {club.description}
                                </p>
                            </section>
                        )}

                        {club.nomMaitre && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Responsable technique</h2>
                                <div className="flex items-center gap-4 rounded-xl border p-4 bg-muted/30">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                                        {club.nomMaitre.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{club.nomMaitre}</p>
                                        <p className="text-sm text-muted-foreground">Maître / Responsable</p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {club.telephone && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-4 h-4 text-primary shrink-0" />
                                        <span>{club.telephone}</span>
                                    </div>
                                )}
                                {club.email && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <span className="truncate">{club.email}</span>
                                    </div>
                                )}
                                {!club.telephone && !club.email && (
                                    <p className="text-sm text-muted-foreground">
                                        Coordonnées non renseignées.
                                    </p>
                                )}
                                <hr className="my-2" />
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/contact">Envoyer un message</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground border-none">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2">Licence ADSS</h3>
                                <p className="text-sm opacity-80 mb-4">
                                    Pour s&apos;inscrire dans ce club, vous devez être affilié à l&apos;Association Disciples Shaolin Si Sénégal.
                                </p>
                                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                    <Link href="/affiliation">Demander ma licence</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
