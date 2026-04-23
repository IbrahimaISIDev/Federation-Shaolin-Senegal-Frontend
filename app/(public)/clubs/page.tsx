import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ChevronRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
    title: 'Tous les Clubs',
    description: 'Découvrez tous les clubs affiliés à la Fédération Shaolin Sénégal.',
};

// Mock data
const mockClubs = [
    {
        id: '1',
        name: 'Club Shaolin Dakar Centre',
        region: 'Dakar',
        address: 'Plateau, Dakar',
        memberCount: 120,
        disciplines: ['Kung Fu', 'Wushu', 'Tai Chi'],
        isHiring: true,
    },
    {
        id: '2',
        name: 'Dragon Rouge Thiès',
        region: 'Thiès',
        address: 'Centre-ville, Thiès',
        memberCount: 85,
        disciplines: ['Kung Fu', 'Sanda'],
        isHiring: false,
    },
    {
        id: '3',
        name: 'Temple Shaolin Saint-Louis',
        region: 'Saint-Louis',
        address: 'Île de Saint-Louis',
        memberCount: 65,
        disciplines: ['Kung Fu', 'Qi Gong'],
        isHiring: true,
    },
    {
        id: '4',
        name: 'Académie Wu Shu Kaolack',
        region: 'Kaolack',
        address: 'Médina Baye, Kaolack',
        memberCount: 45,
        disciplines: ['Wushu', 'Wing Chun'],
        isHiring: false,
    },
];

export default function ClubsPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <section className="bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Clubs Affiliés
                    </h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        Trouvez un club près de chez vous parmi nos nombreux centres à travers le Sénégal.
                    </p>
                </div>
            </section>

            {/* Filters & Search */}
            <section className="py-8 border-b bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input className="pl-10 h-11" placeholder="Rechercher un club par nom, ville ou région..." />
                        </div>
                        <Button variant="outline" className="gap-2 h-11">
                            <Filter className="w-4 h-4" />
                            Trier par
                        </Button>
                        <Button className="bg-accent hover:bg-accent/90 h-11" asChild>
                            <Link href="/carte">Voir sur la carte</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Clubs Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mockClubs.map((club) => (
                            <Card key={club.id} className="group hover:shadow-lg transition-all border-none shadow-sm flex flex-col">
                                <div className="h-24 bg-gradient-to-br from-primary/80 to-primary p-4 flex items-end relative overflow-hidden">
                                    {club.isHiring && (
                                        <Badge className="absolute right-3 top-3 bg-accent text-accent-foreground border-none">
                                            Recrute
                                        </Badge>
                                    )}
                                    <h3 className="font-bold text-primary-foreground text-lg leading-tight line-clamp-2">
                                        {club.name}
                                    </h3>
                                </div>
                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 shrink-0 text-accent" />
                                            <span className="truncate">{club.address}, {club.region}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4 shrink-0 text-accent" />
                                            <span>{club.memberCount} membres</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {club.disciplines.map((d) => (
                                            <Badge key={d} variant="secondary" className="text-[10px]">
                                                {d}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-4 border-t">
                                        <Button variant="ghost" className="w-full justify-between group/btn text-primary hover:text-accent p-0 h-auto" asChild>
                                            <Link href={`/clubs/${club.id}`}>
                                                Voir les détails
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
