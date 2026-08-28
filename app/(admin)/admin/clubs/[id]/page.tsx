'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Pencil,
    Users,
    MapPin,
    Phone,
    Mail,
    Building2,
    Calendar,
    UserCircle,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const mockClub = {
    id: '1',
    code: 'TSK-001',
    name: 'Temple Shaolin Dakar',
    region: 'Dakar',
    city: 'Dakar',
    address: 'Avenue Cheikh Anta Diop, Point-E',
    phone: '771234567',
    email: 'tsdk@email.com',
    president: 'Cheikh Diallo',
    presidentPhone: '771234567',
    memberCount: 145,
    isActive: true,
    createdAt: '2019-03-15',
    description: 'Le Temple Shaolin Dakar est l\'un des clubs pionniers de l\'association, fondé en 2019 par Maître Cheikh Diallo. Spécialisé dans le Kung Fu traditionnel Shaolin et le Wushu moderne.',
};

const mockMembers = [
    { id: '1', name: 'Amadou Ba', discipline: 'Kung Fu', status: 'active', registrationDate: '2024-01-15' },
    { id: '4', name: 'Aissatou Sall', discipline: 'Kung Fu', status: 'active', registrationDate: '2024-02-05' },
    { id: '7', name: 'Ibrahima Gueye', discipline: 'Kung Fu', status: 'pending', registrationDate: '2024-02-12' },
];

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{value}</p>
            </div>
        </div>
    );
}

export default function ClubDetailPage({ params: _params }: { params: Promise<{ id: string }> }) {
    const club = mockClub; // TODO: fetch by params.id

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/clubs"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{club.name}</h1>
                            <p className="text-sm font-mono text-muted-foreground">{club.code}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant={club.isActive ? 'default' : 'secondary'} className="gap-1">
                        {club.isActive
                            ? <><CheckCircle className="w-3 h-3" /> Actif</>
                            : <><XCircle className="w-3 h-3" /> Inactif</>}
                    </Badge>
                    <Button className="gap-2 bg-accent hover:bg-accent/90" asChild>
                        <Link href={`/admin/clubs/${club.id}/modifier`}>
                            <Pencil className="w-4 h-4" /> Modifier
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    {club.description && (
                        <Card>
                            <CardHeader><CardTitle>À propos</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{club.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Contact */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Coordonnées</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoRow icon={MapPin} label="Adresse" value={club.address} />
                                <InfoRow icon={MapPin} label="Ville / Région" value={`${club.city}, ${club.region}`} />
                                <InfoRow icon={Phone} label="Téléphone" value={club.phone} />
                                <InfoRow icon={Mail} label="Email" value={club.email} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Members preview */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Membres récents</CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/membres?club=${club.id}`}>Tous les membres</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockMembers.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {member.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.discipline}</p>
                                            </div>
                                        </div>
                                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                            {member.status === 'active' ? 'Actif' : 'En attente'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Stats */}
                    <Card>
                        <CardHeader><CardTitle>Statistiques</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center p-4 bg-primary/5 rounded-xl">
                                <p className="text-4xl font-bold text-primary">{club.memberCount}</p>
                                <p className="text-sm text-muted-foreground">membres actifs</p>
                            </div>
                            <Separator />
                            <InfoRow icon={Calendar} label="Date d'affiliation" value={formatDate(club.createdAt)} />
                        </CardContent>
                    </Card>

                    {/* President */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="w-5 h-5" /> Président</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <InfoRow icon={UserCircle} label="Nom" value={club.president} />
                            {club.presidentPhone && <InfoRow icon={Phone} label="Téléphone" value={club.presidentPhone} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
