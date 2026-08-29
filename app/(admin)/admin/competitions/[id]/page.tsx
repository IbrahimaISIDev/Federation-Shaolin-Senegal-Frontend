'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Loader2,
    Calendar,
    MapPin,
    Globe,
    EyeOff,
    Users,
    Medal,
    Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { competitionsApi } from '@/lib/api/competitions';
import { toast } from 'sonner';

function formatDate(d: string | null | undefined) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CompetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const competitionId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'competition', competitionId],
        queryFn: () => competitionsApi.adminGet(competitionId),
        enabled: !!competitionId,
    });
    const competition = data?.data as any;

    const deleteMutation = useMutation({
        mutationFn: () => competitionsApi.delete(competitionId),
        onSuccess: () => {
            toast.success('Compétition supprimée');
            queryClient.invalidateQueries({ queryKey: ['admin', 'competitions'] });
            router.push('/admin/competitions');
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

    if (isError || !competition) {
        return (
            <div className="space-y-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/competitions"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <p className="text-muted-foreground">Compétition introuvable.</p>
            </div>
        );
    }

    const categories: string[] = Array.isArray(competition.categories) ? competition.categories : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/competitions"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">{competition.titre}</h1>
                            <p className="text-sm text-muted-foreground">{competition.region?.nom}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant={competition.isPublished ? 'default' : 'secondary'} className="gap-1">
                        {competition.isPublished ? <><Globe className="w-3 h-3" /> Publiée</> : <><EyeOff className="w-3 h-3" /> Brouillon</>}
                    </Badge>
                    <Button
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                            if (confirm('Supprimer cette compétition ?')) deleteMutation.mutate();
                        }}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Supprimer
                    </Button>
                    <Button className="gap-2 bg-accent hover:bg-accent/90" asChild>
                        <Link href={`/admin/competitions/${competition.id}/modifier`}>
                            <Pencil className="w-4 h-4" /> Modifier
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {competition.imageUrl && (
                        <div className="relative h-64 w-full rounded-xl overflow-hidden border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={competition.imageUrl} alt={competition.titre} className="object-cover w-full h-full" />
                        </div>
                    )}

                    {competition.description && (
                        <Card>
                            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{competition.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Participants ({competition.inscriptions?.length ?? 0})</CardTitle></CardHeader>
                        <CardContent>
                            {!competition.inscriptions || competition.inscriptions.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucune inscription pour l&apos;instant.</p>
                            ) : (
                                <div className="space-y-3">
                                    {competition.inscriptions.map((inscription: any) => (
                                        <Link
                                            key={inscription.id}
                                            href={`/admin/membres/${inscription.member.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {inscription.member.prenom[0]}{inscription.member.nom[0]}
                                                </div>
                                                <p className="font-medium text-sm">{inscription.member.prenom} {inscription.member.nom}</p>
                                            </div>
                                            {inscription.categorie && <Badge variant="outline">{inscription.categorie}</Badge>}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {competition.resultats && competition.resultats.length > 0 && (
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Medal className="w-5 h-5" /> Résultats</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {competition.resultats.map((r: any) => (
                                        <div key={r.id} className="flex items-center justify-between p-2 rounded-lg border text-sm">
                                            <span>{r.classement ? `#${r.classement}` : '—'} {r.categorie ?? ''}</span>
                                            {r.medaille && <Badge className="bg-accent">{r.medaille}</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Détails</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Dates</p>
                                    <p className="text-sm font-medium">
                                        {formatDate(competition.dateDebut)}
                                        {competition.dateFin ? ` → ${formatDate(competition.dateFin)}` : ''}
                                    </p>
                                </div>
                            </div>
                            {competition.lieu && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Lieu</p>
                                        <p className="text-sm font-medium">{competition.lieu}</p>
                                    </div>
                                </div>
                            )}
                            {categories.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">Catégories</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categories.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
