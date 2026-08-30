'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { renewalsApi } from '@/lib/api/renewals';
import { toast } from 'sonner';

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminRenouvellementsPage() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin-renewals'],
        queryFn: () => renewalsApi.list(),
    });
    const renewals = data?.data ?? [];

    const confirmMutation = useMutation({
        mutationFn: (paymentId: number) => renewalsApi.confirm(paymentId),
        onSuccess: () => {
            toast.success('Renouvellement confirmé — la licence est active');
            queryClient.invalidateQueries({ queryKey: ['admin-renewals'] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erreur lors de la confirmation'),
    });

    const rejectMutation = useMutation({
        mutationFn: (paymentId: number) => renewalsApi.reject(paymentId),
        onSuccess: () => {
            toast.success('Renouvellement rejeté');
            queryClient.invalidateQueries({ queryKey: ['admin-renewals'] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erreur lors du rejet'),
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Renouvellements</h1>
                <p className="text-muted-foreground">Vérifiez et confirmez les paiements de renouvellement de licence.</p>
            </div>

            {isError && (
                <p className="text-sm text-destructive">Impossible de charger les renouvellements.</p>
            )}

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Membre</TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead>Saison</TableHead>
                                    <TableHead>Montant</TableHead>
                                    <TableHead>Moyen</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Preuve</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-40" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <TableRow key={i}>
                                            {[...Array(9)].map((__, j) => (
                                                <TableCell key={j}><div className="h-5 rounded bg-muted animate-pulse" /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : renewals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                                            <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                            Aucun renouvellement en attente de vérification.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    renewals.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>
                                                <p className="font-medium">{r.license.member.prenom} {r.license.member.nom}</p>
                                                <p className="text-xs text-muted-foreground">{r.license.member.user.email}</p>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{r.license.member.club?.nom ?? '—'}</TableCell>
                                            <TableCell>{r.license.annee}</TableCell>
                                            <TableCell>{Number(r.montant).toLocaleString('fr-FR')} FCFA</TableCell>
                                            <TableCell>{r.provider === 'WAVE' ? 'Wave' : 'Orange Money'}</TableCell>
                                            <TableCell className="font-mono text-xs">{r.transactionRef ?? '—'}</TableCell>
                                            <TableCell>
                                                {r.preuveUrl ? (
                                                    <a href={r.preuveUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">
                                                        Voir la preuve
                                                    </a>
                                                ) : '—'}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{formatDate(r.createdAt)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                                                        disabled={confirmMutation.isPending || !r.transactionRef}
                                                        onClick={() => confirmMutation.mutate(r.id)}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Confirmer
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                                        disabled={rejectMutation.isPending}
                                                        onClick={() => { if (confirm('Rejeter ce paiement de renouvellement ?')) rejectMutation.mutate(r.id); }}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
