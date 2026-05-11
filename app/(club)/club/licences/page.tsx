'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CreditCard, Loader2, Inbox, CheckCircle2, Clock, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { clubApi } from '@/lib/api/club';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
  ACTIVE:    { label: 'Active',     cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  PENDING:   { label: 'En attente', cls: 'bg-amber-100 text-amber-700',    icon: Clock },
  EXPIRED:   { label: 'Expirée',    cls: 'bg-rose-100 text-rose-700',      icon: XCircle },
  SUSPENDED: { label: 'Suspendue',  cls: 'bg-muted text-muted-foreground', icon: AlertTriangle },
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ClubLicencesPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [page, setPage]     = useState(1);
  const limit = 20;

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatus(s);
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['club', 'licences', { status, page }],
    queryFn: () => clubApi.licenses({ status: status || undefined, page, limit }),
    staleTime: 60 * 1000,
  });

  const licenses: any[] = data?.data ?? [];
  const total  = data?.total ?? 0;
  const pages  = Math.ceil(total / limit);

  const handleStatus = (v: string) => { setStatus(v === 'all' ? '' : v); setPage(1); };

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={FADE_IN_UP}>
        <h1 className="text-2xl font-bold md:text-3xl">Licences du club</h1>
        <p className="text-muted-foreground">{total} licence{total !== 1 ? 's' : ''}</p>
      </motion.div>

      {/* Filtre */}
      <motion.div variants={FADE_IN_UP}>
        <Select value={status || 'all'} onValueChange={handleStatus}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actives</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="EXPIRED">Expirées</SelectItem>
            <SelectItem value="SUSPENDED">Suspendues</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={FADE_IN_UP}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Liste des licences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : licenses.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Aucune licence trouvée</p>
              </div>
            ) : (
              <>
                <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  <span>Membre</span>
                  <span>Numéro</span>
                  <span>Validité</span>
                  <span>Statut</span>
                </div>

                <div className="divide-y divide-border">
                  {licenses.map((lic: any) => {
                    const cfg = STATUS_CONFIG[lic.status] ?? STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={lic.id} className="py-4 px-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 md:gap-4 md:items-center">
                        {/* Membre */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                            {lic.member?.prenom?.[0]}{lic.member?.nom?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{lic.member?.prenom} {lic.member?.nom}</p>
                            <p className="text-xs text-muted-foreground">{lic.member?.user?.email}</p>
                            {lic.member?.grade && (
                              <p className="text-xs text-muted-foreground">{lic.member.grade}</p>
                            )}
                          </div>
                        </div>

                        {/* Numéro */}
                        <div className="hidden md:block text-sm font-mono text-muted-foreground">
                          SHN-{lic.annee}-{String(lic.id).padStart(5, '0')}
                        </div>

                        {/* Dates */}
                        <div className="hidden md:block text-sm text-muted-foreground">
                          <p>{formatDate(lic.dateDebut)} → {formatDate(lic.dateFin)}</p>
                          <p className="text-xs">Saison {lic.annee}</p>
                        </div>

                        {/* Statut */}
                        <Badge className={`border-none text-xs w-fit flex items-center gap-1 ${cfg.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                {pages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                    <p className="text-sm text-muted-foreground">Page {page} sur {pages}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
