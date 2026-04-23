'use client';

import Link from 'next/link';
import {
    ArrowLeft,
    Pencil,
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    CreditCard,
    Shield,
    User,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Mock member data — replace with real API call
const mockMember = {
    id: '1',
    licenseNumber: 'FSS-2024-001',
    firstName: 'Amadou',
    lastName: 'Ba',
    email: 'amadou.ba@email.com',
    phone: '771234567',
    birthDate: '1995-03-14',
    gender: 'M',
    nationality: 'Sénégalaise',
    address: 'Rue 14, Médina',
    city: 'Dakar',
    region: 'Dakar',
    club: 'Temple Shaolin Dakar',
    discipline: 'Kung Fu Shaolin',
    grade: 'Ceinture Verte',
    status: 'active',
    registrationDate: '2024-01-15',
    licenseExpiryDate: '2024-12-31',
    notes: '',
};

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Actif', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    expired: { label: 'Expiré', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

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

export default function MemberDetailPage({ params }: { params: { id: string } }) {
    const member = mockMember; // TODO: fetch by params.id
    const status = statusConfig[member.status];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/membres"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{member.firstName} {member.lastName}</h1>
                            <p className="text-sm font-mono text-muted-foreground">{member.licenseNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" /> Supprimer
                    </Button>
                    <Button className="gap-2 bg-accent hover:bg-accent/90" asChild>
                        <Link href={`/admin/membres/${member.id}/modifier`}>
                            <Pencil className="w-4 h-4" /> Modifier
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Identity */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Informations personnelles</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoRow icon={User} label="Prénom" value={member.firstName} />
                                <InfoRow icon={User} label="Nom" value={member.lastName} />
                                <InfoRow icon={Mail} label="Email" value={member.email} />
                                <InfoRow icon={Phone} label="Téléphone" value={member.phone} />
                                <InfoRow icon={Calendar} label="Date de naissance" value={formatDate(member.birthDate)} />
                                <InfoRow icon={Shield} label="Nationalité" value={member.nationality} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Adresse</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-full">
                                    <InfoRow icon={MapPin} label="Adresse" value={member.address} />
                                </div>
                                <InfoRow icon={MapPin} label="Ville" value={member.city} />
                                <InfoRow icon={MapPin} label="Région" value={member.region} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Club & Sport */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Club & Discipline</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-full">
                                    <InfoRow icon={Building2} label="Club" value={member.club} />
                                </div>
                                <InfoRow icon={Shield} label="Discipline" value={member.discipline} />
                                <InfoRow icon={Shield} label="Grade" value={member.grade} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader><CardTitle>Statut de la licence</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className={`p-3 rounded-lg border text-center font-medium ${status.color}`}>
                                {status.label}
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <InfoRow icon={CreditCard} label="Numéro de licence" value={member.licenseNumber} />
                                <InfoRow icon={Calendar} label="Date d'inscription" value={formatDate(member.registrationDate)} />
                                <InfoRow icon={Calendar} label="Expiration licence" value={formatDate(member.licenseExpiryDate)} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader><CardTitle>Actions rapides</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <CreditCard className="w-4 h-4" /> Renouveler la licence
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Mail className="w-4 h-4" /> Envoyer un email
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
