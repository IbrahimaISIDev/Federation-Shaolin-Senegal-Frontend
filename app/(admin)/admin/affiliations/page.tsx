'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import {
  Search, CheckCircle, XCircle, Eye, Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { affiliationApi } from '@/lib/api/affiliation';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

const typeLabels: Record<string, string> = {
  CLUB: 'Club',
  MAITRE: 'Maître',
  MEMBRE: 'Membre',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING:  { label: 'En attente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  APPROVED: { label: 'Approuvée',  className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Rejetée',    className: 'bg-rose-100 text-rose-700 border-rose-200' },
};

const typeConfig: Record<string, { className: string }> = {
  CLUB:   { className: 'bg-blue-100 text-blue-700 border-blue-200' },
  MAITRE: { className: 'bg-purple-100 text-purple-700 border-purple-200' },
  MEMBRE: { className: 'bg-slate-100 text-slate-700 border-slate-200' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminAffiliationsPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search] = useDebounce(searchInput, 400);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);

  // Detail / approve / reject dialog
  const [viewId, setViewId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [motifRejet, setMotifRejet] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-affiliations', search, typeFilter, statusFilter, page],
    queryFn: () =>
      affiliationApi.list({
        search: search || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const { data: viewData, isLoading: viewLoading } = useQuery({
    queryKey: ['admin-affiliation', viewId],
    queryFn: () => affiliationApi.get(viewId!),
    enabled: viewId !== null,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => affiliationApi.approve(id, note),
    onSuccess: () => {
      toast.success('Demande approuvée');
      setViewId(null);
      setAdminNote('');
      queryClient.invalidateQueries({ queryKey: ['admin-affiliations'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erreur lors de l\'approbation'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, motif }: { id: number; motif: string }) => affiliationApi.reject(id, motif),
    onSuccess: () => {
      toast.success('Demande rejetée');
      setRejectId(null);
      setMotifRejet('');
      queryClient.invalidateQueries({ queryKey: ['admin-affiliations'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erreur lors du rejet'),
  });

  const demandes: any[] = (data as any)?.data ?? [];
  const meta = (data as any)?.meta ?? { total: 0, totalPages: 1 };
  const detailDemande: any = (viewData as any)?.data;

  // Stats summary
  const stats = [
    { label: 'En attente', value: '-', type: 'PENDING',  color: 'text-amber-600' },
    { label: 'Approuvées', value: '-', type: 'APPROVED', color: 'text-emerald-600' },
    { label: 'Rejetées',   value: '-', type: 'REJECTED', color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demandes d&apos;affiliation</h1>
        <p className="text-muted-foreground">Gérez les demandes d&apos;affiliation Club, Maître et Membre.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, code..."
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="CLUB">Club</SelectItem>
                <SelectItem value="MAITRE">Maître</SelectItem>
                <SelectItem value="MEMBRE">Membre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="APPROVED">Approuvées</SelectItem>
                <SelectItem value="REJECTED">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Demandes ({meta.total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : demandes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">Aucune demande trouvée</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandes.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{d.prenom} {d.nom}</p>
                        <p className="text-xs text-muted-foreground">{d.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeConfig[d.type]?.className}>
                        {typeLabels[d.type] ?? d.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {d.code ? (
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{d.code}</code>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[d.status]?.className}>
                        {statusConfig[d.status]?.label ?? d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(d.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setViewId(d.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {d.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => approveMutation.mutate({ id: d.id })}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              onClick={() => setRejectId(d.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} sur {meta.totalPages} — {meta.total} demandes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={viewId !== null} onOpenChange={(open) => { if (!open) setViewId(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détail de la demande #{viewId}</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : detailDemande ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Type', typeLabels[detailDemande.type]],
                  ['Statut', statusConfig[detailDemande.status]?.label],
                  ['Code', detailDemande.code ?? '—'],
                  ['Date', formatDate(detailDemande.createdAt)],
                  ['Prénom', detailDemande.prenom],
                  ['Nom', detailDemande.nom],
                  ['Email', detailDemande.email],
                  ['Téléphone', detailDemande.telephone],
                  ['Adresse', detailDemande.adresse ?? '—'],
                  ['Ville', detailDemande.ville ?? '—'],
                  ['Région', detailDemande.region?.nom ?? '—'],
                  ['Nationalité', detailDemande.nationalite ?? '—'],
                  ['Club', detailDemande.club?.nom ?? '—'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {detailDemande.donneesSpecifiques && (
                <div>
                  <p className="text-muted-foreground text-xs font-medium mb-2">Données spécifiques</p>
                  <pre className="bg-muted rounded p-3 text-xs overflow-x-auto">
                    {JSON.stringify(detailDemande.donneesSpecifiques, null, 2)}
                  </pre>
                </div>
              )}
              {detailDemande.motifRejet && (
                <div className="bg-rose-50 border border-rose-200 rounded p-3">
                  <p className="text-xs font-medium text-rose-700">Motif de rejet</p>
                  <p className="text-rose-800">{detailDemande.motifRejet}</p>
                </div>
              )}

              {detailDemande.status === 'PENDING' && (
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="adminNote">Note admin (optionnel)</Label>
                  <Textarea
                    id="adminNote"
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Note interne..."
                  />
                </div>
              )}
            </div>
          ) : null}
          {detailDemande?.status === 'PENDING' && (
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={() => { setViewId(null); setRejectId(detailDemande.id); }}
              >
                <XCircle className="w-4 h-4 mr-1" /> Rejeter
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={approveMutation.isPending}
                onClick={() => approveMutation.mutate({ id: detailDemande.id, note: adminNote || undefined })}
              >
                {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                Approuver
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectId !== null} onOpenChange={(open) => { if (!open) { setRejectId(null); setMotifRejet(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande #{rejectId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="motif">Motif du rejet *</Label>
            <Textarea
              id="motif"
              rows={3}
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              placeholder="Expliquez la raison du rejet (visible par le demandeur)..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectId(null); setMotifRejet(''); }}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={!motifRejet.trim() || rejectMutation.isPending}
              onClick={() => rejectId && rejectMutation.mutate({ id: rejectId, motif: motifRejet })}
            >
              {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
