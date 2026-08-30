'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import {
  Search, Filter, UserPlus, MoreHorizontal, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle, XCircle, FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ExportButton } from '@/components/shared/export-button';
import { ImportButton } from '@/components/shared/import-button';
import { membersApi, statsApi, type Member } from '@/lib/api';
import { downloadBlob } from '@/lib/utils';
import { toast } from 'sonner';

const PAGE_SIZE = 20;
const CURRENT_YEAR = new Date().getFullYear();
const SEASON_OPTIONS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  active: { label: 'Actif', variant: 'default', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  pending: { label: 'En attente', variant: 'secondary', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  expired: { label: 'Expiré', variant: 'destructive', className: 'bg-rose-100 text-rose-700 border-rose-200' },
  suspended: { label: 'Suspendu', variant: 'outline', className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getMemberStatus(member: Member): string {
  const license = member.licenses?.[0];
  if (!member.user?.isActive) return 'pending';
  if (!license) return 'pending';
  return license.status?.toLowerCase() ?? 'pending';
}

export default function AdminMembersPage() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search] = useDebounce(searchInput, 400);
  const [statusFilter, setStatusFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // ── Data fetching ────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'members', { search, status: statusFilter, annee: seasonFilter, page }],
    queryFn: () =>
      membersApi.adminList({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        annee: seasonFilter !== 'all' ? Number(seasonFilter) : undefined,
        page,
        limit: PAGE_SIZE,
      }),
    staleTime: 60 * 1000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => statsApi.dashboard(),
    staleTime: 2 * 60 * 1000,
  });

  const members: Member[] = data?.data ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const stats = statsData?.data;

  // ── Mutations ────────────────────────────────────────────────────────────────
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'members'] });

  const validateMutation = useMutation({
    mutationFn: (id: number) => membersApi.validate(id),
    onSuccess: () => { toast.success('Membre validé'); invalidate(); },
    onError: () => toast.error('Erreur lors de la validation'),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: number) => membersApi.suspend(id),
    onSuccess: () => { toast.success('Membre suspendu'); invalidate(); },
    onError: () => toast.error('Erreur lors de la suspension'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => membersApi.adminDelete(id),
    onSuccess: () => { toast.success('Membre supprimé'); invalidate(); },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  // ── Selection ────────────────────────────────────────────────────────────────
  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.length === members.length ? [] : members.map((m) => m.id)
    );
  }, [members]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // ── Export ───────────────────────────────────────────────────────────────────
  const getMembersForExport = () =>
    members.map((m) => ({
      firstName: m.prenom,
      lastName: m.nom,
      email: m.user?.email ?? '',
      phone: m.user?.phone ?? '',
      clubName: m.club?.nom ?? '',
      region: m.club?.region?.nom ?? '',
      discipline: m.discipline ?? '',
      grade: m.grade ?? '',
      status: getMemberStatus(m),
      licenseNumber: m.licenses?.[0]?.annee?.toString() ?? '',
      registeredAt: m.createdAt,
    }));

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const blob = await membersApi.exportPdf({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        annee: seasonFilter !== 'all' ? Number(seasonFilter) : undefined,
      });
      downloadBlob(blob, 'membres.pdf');
    } catch {
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Membres</h1>
          <p className="text-muted-foreground">Gérez les membres de l&apos;association.</p>
        </div>
        <div className="flex gap-2">
          <ExportButton entity="membres" getData={getMembersForExport} />
          <ImportButton
            label="membres"
            columnsHint="Prénom, Nom, Email, Téléphone, Sexe (M/F), Date de naissance, Nationalité, Ville, Club, Discipline, Grade"
            importFn={(file) => membersApi.import(file)}
            onImported={invalidate}
          />
          <Button variant="outline" className="gap-2" onClick={handleExportPdf} disabled={isExportingPdf}>
            {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span className="hidden sm:inline">Exporter PDF</span>
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
            <Link href="/admin/membres/nouveau">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau membre</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Impossible de charger les membres. Vérifiez que l&apos;API est démarrée.
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats?.totalMembers, color: 'text-foreground' },
          { label: 'Actifs', value: stats?.activeLicenses, color: 'text-emerald-600' },
          { label: 'En attente', value: stats?.pendingMembers, color: 'text-amber-600' },
          { label: 'Expirés', value: stats?.expiredLicenses, color: 'text-rose-600' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>
                {value !== undefined ? value.toLocaleString('fr-FR') : (
                  <span className="inline-block w-12 h-7 bg-muted animate-pulse rounded" />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="member-search"
                placeholder="Rechercher par nom, email..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => { setStatusFilter(v); setPage(1); }}
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="EXPIRED">Expirés</SelectItem>
                <SelectItem value="SUSPENDED">Suspendus</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={seasonFilter}
              onValueChange={(v) => { setSeasonFilter(v); setPage(1); }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Saison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes saisons</SelectItem>
                {SEASON_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === members.length && members.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead className="hidden md:table-cell">Club</TableHead>
                  <TableHead className="hidden lg:table-cell">Discipline</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden sm:table-cell">Depuis</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((__, j) => (
                        <TableCell key={j}>
                          <div className="h-5 rounded bg-muted animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      Aucun membre trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => {
                    const status = getMemberStatus(member);
                    const cfg = statusConfig[status] ?? statusConfig.pending;
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(member.id)}
                            onCheckedChange={() => toggleSelect(member.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.prenom} {member.nom}
                            </p>
                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {member.club?.nom ?? '—'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {member.discipline ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-medium border shadow-none ${cfg.className}`}>
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                          {formatDate(member.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/membres/${member.id}`}>
                                  <Eye className="w-4 h-4 mr-2" /> Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/membres/${member.id}/modifier`}>
                                  <Pencil className="w-4 h-4 mr-2" /> Modifier
                                </Link>
                              </DropdownMenuItem>
                              {!member.user?.isActive && (
                                <DropdownMenuItem
                                  onClick={() => validateMutation.mutate(member.id)}
                                  className="text-emerald-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Valider
                                </DropdownMenuItem>
                              )}
                              {member.user?.isActive && (
                                <DropdownMenuItem
                                  onClick={() => suspendMutation.mutate(member.id)}
                                  className="text-amber-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" /> Suspendre
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm('Supprimer ce membre ?')) deleteMutation.mutate(member.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length > 0
                ? `${selectedIds.length} sélectionné(s)`
                : `${total.toLocaleString('fr-FR')} résultat(s)`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
