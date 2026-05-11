'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, ChevronRight, Search, Loader2, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { clubsApi, type Club } from '@/lib/api';

export default function ClubsPage() {
    const [searchInput, setSearchInput] = useState('');
    const [search] = useDebounce(searchInput, 400);

    const { data, isLoading } = useQuery({
        queryKey: ['public', 'clubs', { search }],
        queryFn: () => clubsApi.list({ search: search || undefined }),
    });

    const clubs: Club[] = data?.data ?? [];

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
                        <div className="relative flex-1 w-full max-w-lg mx-auto md:mx-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                className="pl-10 h-11"
                                placeholder="Rechercher par nom, ville ou région..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <Button className="bg-accent hover:bg-accent/90 h-11 w-full md:w-auto" asChild>
                            <Link href="/carte">Voir sur la carte</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Clubs Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="border-none shadow-sm flex flex-col">
                                    <div className="h-24 bg-muted animate-pulse rounded-t-lg" />
                                    <CardContent className="p-5 flex-1 flex flex-col gap-3">
                                        <div className="h-4 bg-muted animate-pulse rounded w-3/4 mb-2" />
                                        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                                        <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : clubs.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Aucun club trouvé</h3>
                            <p className="text-muted-foreground">
                                Essayez de modifier vos critères de recherche.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clubs.map((club) => (
                                <Card key={club.id} className="group hover:shadow-lg transition-all border-none shadow-sm flex flex-col">
                                    <div className="h-32 bg-primary/5 p-4 flex items-end justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
                                        {club.logoUrl ? (
                                            <img src={club.logoUrl} alt={club.nom} className="h-20 w-auto object-contain drop-shadow-md z-10" />
                                        ) : (
                                            <Building2 className="w-16 h-16 text-primary/20 z-10" />
                                        )}
                                        {/* Background decorative element */}
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
                                    </div>
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-foreground text-lg leading-tight mb-4 group-hover:text-primary transition-colors">
                                            {club.nom}
                                        </h3>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4 shrink-0 text-accent" />
                                                <span className="truncate">{club.ville ? `${club.ville}, ` : ''}{club.region?.nom ?? 'NC'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="w-4 h-4 shrink-0 text-accent" />
                                                <span>{club._count?.members ?? 0} membre{club._count?.members !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20">
                                                Active
                                            </Badge>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-border/50">
                                            <Button variant="ghost" className="w-full justify-between group/btn text-muted-foreground hover:text-accent hover:bg-accent/10 p-0 h-auto" asChild>
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
                    )}
                </div>
            </section>
        </main>
    );
}
