'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    History,
    Loader2,
    Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { membersApi } from '@/lib/api/members';
import { toast } from 'sonner';

const licenseStatusConfig: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    EXPIRED: { label: 'Expirée', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    SUSPENDED: { label: 'Suspendue', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function formatDate(d: string | null | undefined) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{value || '—'}</p>
            </div>
        </div>
    );
}

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const memberId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'member', memberId],
        queryFn: () => membersApi.adminGet(memberId),
        enabled: !!memberId,
    });
    const member = data?.data;

    const { data: historyData, isLoading: loadingHistory } = useQuery({
        queryKey: ['admin', 'member', memberId, 'grade-history'],
        queryFn: () => membersApi.gradeHistory(memberId),
        enabled: !!memberId,
    });
    const gradeHistory = historyData?.data ?? [];

    const deleteMutation = useMutation({
        mutationFn: () => membersApi.adminDelete(memberId),
        onSuccess: () => {
            toast.success('Membre supprimé');
            queryClient.invalidateQueries({ queryKey: ['admin', 'members'] });
            router.push('/admin/membres');
        },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError || !member) {
        return (
            <div className="space-y-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/membres"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <p className="text-muted-foreground">Membre introuvable.</p>
            </div>
        );
    }

    const latestLicense = member.licenses?.[0];
    const licenseStatus = latestLicense ? licenseStatusConfig[latestLicense.status] : null;

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
                            {member.prenom[0]}{member.nom[0]}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{member.prenom} {member.nom}</h1>
                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Supprimer ce membre ? Cette action est irréversible.')) deleteMutation.mutate();
                        }}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Supprimer
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
                                <InfoRow icon={User} label="Prénom" value={member.prenom} />
                                <InfoRow icon={User} label="Nom" value={member.nom} />
                                <InfoRow icon={Mail} label="Email" value={member.user?.email} />
                                <InfoRow icon={Phone} label="Téléphone" value={member.user?.phone} />
                                <InfoRow icon={Calendar} label="Date de naissance" value={formatDate(member.dateNaissance)} />
                                <InfoRow icon={Shield} label="Nationalité" value={member.nationalite} />
                                <InfoRow icon={Heart} label="Groupe sanguin" value={member.groupeSanguin} />
                                <InfoRow icon={Phone} label="Contact d'urgence" value={
                                    member.contactUrgenceNom
                                        ? `${member.contactUrgenceNom} — ${member.contactUrgencePhone ?? ''}`
                                        : null
                                } />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Adresse</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <InfoRow icon={MapPin} label="Adresse" value={member.adresse} />
                        </CardContent>
                    </Card>

                    {/* Club & Sport */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Club & Discipline</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-full">
                                    <InfoRow icon={Building2} label="Club" value={member.club ? `${member.club.nom} — ${member.club.region?.nom ?? ''}` : null} />
                                </div>
                                <InfoRow icon={Shield} label="Discipline" value={member.discipline} />
                                <InfoRow icon={Shield} label="Grade" value={member.grade} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Grade history */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><History className="w-5 h-5" /> Historique des grades</CardTitle></CardHeader>
                        <CardContent>
                            {loadingHistory ? (
                                <p className="text-sm text-muted-foreground">Chargement…</p>
                            ) : gradeHistory.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucun changement de grade enregistré.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {gradeHistory.map((entry) => (
                                        <li key={entry.id} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                                <History className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm">
                                                    {entry.ancienGrade ? (
                                                        <>
                                                            <span className="text-muted-foreground">{entry.ancienGrade}</span>{' '}
                                                            → <span className="font-medium">{entry.nouveauGrade}</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-medium">{entry.nouveauGrade}</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(entry.createdAt)}
                                                    {entry.changedBy?.email ? ` · par ${entry.changedBy.email}` : ''}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader><CardTitle>Statut du compte & licence</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Compte</span>
                                <Badge variant="outline" className={member.user?.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                                    {member.user?.isActive ? 'Actif' : 'En attente de validation'}
                                </Badge>
                            </div>
                            {licenseStatus && (
                                <div className={`p-3 rounded-lg border text-center font-medium ${licenseStatus.color}`}>
                                    Licence {licenseStatus.label}
                                </div>
                            )}
                            <Separator />
                            <div className="space-y-3">
                                <InfoRow icon={Calendar} label="Membre depuis" value={formatDate(member.createdAt)} />
                                {latestLicense && (
                                    <>
                                        <InfoRow icon={CreditCard} label="Saison de licence" value={String(latestLicense.annee)} />
                                        <InfoRow icon={Calendar} label="Expiration licence" value={formatDate(latestLicense.dateFin)} />
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
