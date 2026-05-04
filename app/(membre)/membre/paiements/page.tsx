'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Receipt, CreditCard, CheckCircle2, Clock, XCircle, Loader2, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { membersApi } from '@/lib/api';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
    SUCCESS:  { label: 'Payé',      cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    PENDING:  { label: 'En attente', cls: 'bg-amber-100 text-amber-700',   icon: Clock },
    FAILED:   { label: 'Échoué',    cls: 'bg-rose-100 text-rose-700',      icon: XCircle },
    REFUNDED: { label: 'Remboursé', cls: 'bg-blue-100 text-blue-700',      icon: Receipt },
};

const PROVIDER_LABELS: Record<string, string> = {
    WAVE:         'Wave',
    ORANGE_MONEY: 'Orange Money',
    CARD:         'Carte bancaire',
    CASH:         'Espèces',
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatAmount(amount: number, devise: string) {
    return `${Number(amount).toLocaleString('fr-FR')} ${devise}`;
}

export default function MemberPaiementsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['member', 'payments'],
        queryFn: () => membersApi.myPayments(),
        staleTime: 5 * 60 * 1000,
    });

    const payments: any[] = data?.data ?? [];
    const totalPaid = payments
        .filter((p) => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + Number(p.montant), 0);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <motion.div variants={FADE_IN_UP}>
                <h1 className="text-2xl font-bold md:text-3xl">Mes Paiements</h1>
                <p className="text-muted-foreground">Historique de vos paiements de licence.</p>
            </motion.div>

            {/* Summary */}
            {payments.length > 0 && (
                <motion.div variants={FADE_IN_UP} className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Total payé</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {formatAmount(totalPaid, 'XOF')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Transactions</p>
                            <p className="text-2xl font-bold">{payments.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Dernier paiement</p>
                            <p className="text-lg font-semibold">
                                {payments[0]?.paidAt ? formatDate(payments[0].paidAt) : '—'}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Payments list */}
            <motion.div variants={FADE_IN_UP}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-primary" />
                            Historique
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
                                    <Inbox className="w-7 h-7 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">Aucun paiement</p>
                                    <p className="text-sm text-muted-foreground">
                                        Vos paiements de licence apparaîtront ici.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {payments.map((payment) => {
                                    const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.PENDING;
                                    const StatusIcon = cfg.icon;
                                    return (
                                        <div key={payment.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex items-start gap-4">
                                                <div className={`rounded-full p-2 ${cfg.cls}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Licence {payment.license?.annee ?? '—'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            {PROVIDER_LABELS[payment.provider] ?? payment.provider}
                                                        </span>
                                                        {payment.paidAt && (
                                                            <span>{formatDate(payment.paidAt)}</span>
                                                        )}
                                                    </div>
                                                    {payment.transactionRef && (
                                                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                            Réf: {payment.transactionRef}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                                <p className="text-lg font-bold">
                                                    {formatAmount(payment.montant, payment.devise)}
                                                </p>
                                                <Badge className={`border-none text-xs ${cfg.cls}`}>
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
