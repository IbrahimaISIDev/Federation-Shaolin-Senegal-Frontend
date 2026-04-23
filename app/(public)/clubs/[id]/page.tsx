import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ArrowLeft, Phone, Mail, Globe, Calendar, CheckCircle2 } from 'lucide-react';

// Mock data (same as in featured clubs)
const mockClubs = [
    {
        id: '1',
        name: 'Club Shaolin Dakar Centre',
        region: 'Dakar',
        address: 'Plateau, Dakar, Sénégal',
        description: 'Le Club Shaolin Dakar Centre est l\'un des plus anciens et prestigieux clubs de la capitale. Nous enseignons le Wushu traditionnel et moderne pour tous les âges. Nos instructeurs sont certifiés par la fédération internationale.',
        memberCount: 120,
        disciplines: ['Kung Fu', 'Wushu', 'Tai Chi'],
        isHiring: true,
        email: 'contact@shaolindakar.sn',
        phone: '+221 33 800 00 00',
        website: 'www.shaolindakar.sn',
        schedules: [
            { day: 'Lundi', time: '18:00 - 20:00', discipline: 'Wushu' },
            { day: 'Mercredi', time: '18:00 - 20:00', discipline: 'Wushu' },
            { day: 'Samedi', time: '09:00 - 11:00', discipline: 'Tai Chi' },
        ],
    },
    {
        id: '2',
        name: 'Dragon Rouge Thiès',
        region: 'Thiès',
        address: 'Centre-ville, Thiès',
        description: 'Le club Dragon Rouge de Thiès est spécialisé dans le Sanda (boxe chinoise) et le Kung Fu traditionnel. Ambiance familiale et rigueur technique.',
        memberCount: 85,
        disciplines: ['Kung Fu', 'Sanda', 'Auto-défense'],
        isHiring: false,
        email: 'info@dragonrouge-thies.sn',
        phone: '+221 33 951 00 00',
        website: 'www.dragonrouge-thies.sn',
        schedules: [
            { day: 'Mardi', time: '17:30 - 19:30', discipline: 'Sanda' },
            { day: 'Jeudi', time: '17:30 - 19:30', discipline: 'Kung Fu' },
            { day: 'Dimanche', time: '08:30 - 10:30', discipline: 'Sanda' },
        ],
    },
    {
        id: '3',
        name: 'Temple Shaolin Saint-Louis',
        region: 'Saint-Louis',
        address: 'Île de Saint-Louis',
        description: 'Situé au cœur de la ville historique, le Temple Shaolin Saint-Louis perpétue les traditions ancestrales du Wushu et du Qi Gong.',
        memberCount: 65,
        disciplines: ['Kung Fu', 'Qi Gong', 'Tai Chi'],
        isHiring: true,
        email: 'temple@shaolin-saintlouis.sn',
        phone: '+221 33 961 00 00',
        schedules: [
            { day: 'Lundi', time: '18:30 - 20:30', discipline: 'Kung Fu' },
            { day: 'Vendredi', time: '18:30 - 20:30', discipline: 'Qi Gong' },
        ],
    },
    {
        id: '4',
        name: 'Académie Wu Shu Kaolack',
        region: 'Kaolack',
        address: 'Médina Baye, Kaolack',
        description: 'L\'Académie Wu Shu Kaolack forme les futurs champions de la région centre. Un entraînement intensif axé sur la performance sportive.',
        memberCount: 45,
        disciplines: ['Wushu', 'Wing Chun', 'Sanda'],
        isHiring: false,
        email: 'kaolack@wushu-academy.sn',
        phone: '+221 33 941 00 00',
        schedules: [
            { day: 'Mercredi', time: '17:00 - 19:00', discipline: 'Wushu' },
            { day: 'Samedi', time: '16:00 - 18:00', discipline: 'Sanda' },
        ],
    },
];

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const club = mockClubs.find((c) => c.id === id);
    return {
        title: club ? club.name : 'Détail du Club',
        description: club ? `Découvrez le club ${club.name} à ${club.region}.` : 'Détail du club',
    };
}

export default async function ClubDetailPage({ params }: PageProps) {
    const { id } = await params;
    const club = mockClubs.find((c) => c.id === id);

    if (!club) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero Header */}
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-16">
                    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10">
                        <Link href="/carte">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la carte
                        </Link>
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="secondary" className="bg-white/20 text-white border-none">
                                    {club.region}
                                </Badge>
                                {club.isHiring && (
                                    <Badge className="bg-accent text-accent-foreground border-none">
                                        Recrute
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{club.name}</h1>
                            <div className="flex flex-wrap gap-4 text-primary-foreground/80">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {club.address}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {club.memberCount} membres actifs
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                                <Link href="/affiliation">S&apos;inscrire au club</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">À propos du club</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {club.description || "Description non disponible pour ce club."}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6">Disciplines enseignées</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {club.disciplines.map((discipline) => (
                                    <Card key={discipline} className="border-none bg-muted/30">
                                        <CardContent className="p-4 flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-accent" />
                                            <span className="font-medium">{discipline}</span>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {club.schedules && (
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Horaires des cours</h2>
                                <div className="overflow-hidden rounded-xl border">
                                    <table className="w-full text-left bg-card">
                                        <thead className="bg-muted border-b">
                                            <tr>
                                                <th className="p-4 font-semibold">Jour</th>
                                                <th className="p-4 font-semibold">Horaire</th>
                                                <th className="p-4 font-semibold">Discipline</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {club.schedules.map((s, i) => (
                                                <tr key={i}>
                                                    <td className="p-4 font-medium">{s.day}</td>
                                                    <td className="p-4 text-muted-foreground">{s.time}</td>
                                                    <td className="p-4">
                                                        <Badge variant="secondary">{s.discipline}</Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                                {club.phone && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span>{club.phone}</span>
                                    </div>
                                )}
                                {club.email && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <span className="truncate">{club.email}</span>
                                    </div>
                                )}
                                {club.website && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Globe className="w-4 h-4 text-primary" />
                                        <span>{club.website}</span>
                                    </div>
                                )}
                                <hr className="my-4" />
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/contact">Envoyer un message</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground border-none">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-2">Licence FSS</h3>
                                <p className="text-sm opacity-80 mb-4">
                                    Pour s'inscrire dans ce club, vous devez être affilié à la Fédération Shaolin Sénégal.
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
