'use client';

import { Trophy, Plus, Search, Calendar, MapPin, Users, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExportButton } from '@/components/shared/export-button';

const mockCompetitions = [
    { id: '1', title: 'Championnat National Wushu 2024', date: '2024-06-15', location: 'Dakar', discipline: 'Wushu', status: 'upcoming', participants: 124 },
    { id: '2', title: 'Tournoi Inter-Clubs Sanda', date: '2024-05-20', location: 'Saint-Louis', discipline: 'Sanda', status: 'open', participants: 87 },
    { id: '3', title: 'Coupe du Sénégal Taolu', date: '2024-03-10', location: 'Thiès', discipline: 'Taolu', status: 'completed', participants: 56 },
    { id: '4', title: 'Grand Prix Dakar 2024', date: '2024-07-22', location: 'Dakar', discipline: 'Kung Fu', status: 'upcoming', participants: 0 },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    upcoming: { label: 'À venir', variant: 'secondary' },
    open: { label: 'Inscriptions ouvertes', variant: 'default' },
    completed: { label: 'Terminée', variant: 'outline' },
};

function getCompetitionsForExport() {
    return mockCompetitions.map((c) => ({
        title: c.title,
        discipline: c.discipline,
        date: c.date,
        location: c.location,
        status: c.status,
        participants: c.participants,
        maxParticipants: '',
    }));
}

export default function AdminCompetitionsPage() {
    const [search, setSearch] = useState('');

    const filtered = mockCompetitions.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Compétitions</h1>
                    <p className="text-muted-foreground">Gérez les compétitions et tournois.</p>
                </div>
                <div className="flex gap-2">
                    <ExportButton entity="competitions" getData={getCompetitionsForExport} />
                    <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                        <Link href="/admin/competitions/nouvelle">
                            <Plus className="w-4 h-4" /> Nouvelle compétition
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: mockCompetitions.length, icon: Trophy, color: 'text-primary' },
                    { label: 'À venir', value: mockCompetitions.filter((c) => c.status === 'upcoming').length, icon: Calendar, color: 'text-blue-500' },
                    { label: 'Ouvertes', value: mockCompetitions.filter((c) => c.status === 'open').length, icon: Users, color: 'text-green-500' },
                    { label: 'Terminées', value: mockCompetitions.filter((c) => c.status === 'completed').length, icon: Trophy, color: 'text-muted-foreground' },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher une compétition..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.map((competition) => {
                    const statusInfo = statusConfig[competition.status];
                    return (
                        <Card key={competition.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Trophy className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{competition.title}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {competition.date}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {competition.location}</span>
                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {competition.participants} participants</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Badge variant={statusInfo.variant} className="hidden sm:flex">{statusInfo.label}</Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild><Link href={`/admin/competitions/${competition.id}`}><Eye className="w-4 h-4 mr-2" /> Voir</Link></DropdownMenuItem>
                                            <DropdownMenuItem asChild><Link href={`/admin/competitions/${competition.id}/modifier`}><Pencil className="w-4 h-4 mr-2" /> Modifier</Link></DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Supprimer</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-center py-16 bg-muted/20 rounded-lg border-2 border-dashed">
                        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Aucune compétition trouvée.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
