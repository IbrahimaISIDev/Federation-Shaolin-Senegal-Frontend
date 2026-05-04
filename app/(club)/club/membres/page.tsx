'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Users, Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { clubApi } from '@/lib/api/club';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const LICENSE_STATUS: Record<string, { label: string; cls: string }> = {
  ACTIVE:    { label: 'Actif',      cls: 'bg-emerald-100 text-emerald-700' },
  PENDING:   { label: 'En attente', cls: 'bg-amber-100 text-amber-700' },
  EXPIRED:   { label: 'Expiré',     cls: 'bg-rose-100 text-rose-700' },
  SUSPENDED: { label: 'Suspendu',   cls: 'bg-muted text-muted-foreground' },
};

export default function ClubMembresPage() {
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [page, setPage]       = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['club', 'membres', { search, status, page }],
    queryFn: () => clubApi.members({ search: search || undefined, status: status || undefined, page, limit }),
    staleTime: 60 * 1000,
  });

  const members: any[] = data?.data ?? [];
  const total  = data?.total ?? 0;
  const pages  = Math.ceil(total / limit);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleStatus = (v: string) => { setStatus(v === 'all' ? '' : v); setPage(1); };

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={FADE_IN_UP}>
        <h1 className="text-2xl font-bold md:text-3xl">Membres du club</h1>
        <p className="text-muted-foreground">{total} membre{total !== 1 ? 's' : ''} enregistré{total !== 1 ? 's' : ''}</p>
      </motion.div>

      {/* Filtres */}
      <motion.div variants={FADE_IN_UP} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={status || 'all'} onValueChange={handleStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut licence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="EXPIRED">Expiré</SelectItem>
            <SelectItem value="SUSPENDED">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={FADE_IN_UP}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Liste des membres
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Aucun membre trouvé</p>
                <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres.</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  <span>Membre</span>
                  <span>Contact</span>
                  <span>Grade / Discipline</span>
                  <span>Licence</span>
                </div>

                <div className="divide-y divide-border">
                  {members.map((m: any) => {
                    const lic    = m.licenses?.[0];
                    const s      = LICENSE_STATUS[lic?.status ?? 'PENDING'];
                    return (
                      <div key={m.id} className="py-4 px-4 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:gap-4 md:items-center">
                        {/* Nom */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                            {m.prenom?.[0]}{m.nom?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{m.prenom} {m.nom}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{m.user?.email}</p>
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="hidden md:block">
                          <p className="text-sm text-muted-foreground">{m.user?.email}</p>
                          {m.user?.phone && <p className="text-xs text-muted-foreground">{m.user.phone}</p>}
                        </div>

                        {/* Grade */}
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {m.grade && <p>{m.grade}</p>}
                          {m.discipline && <p className="text-xs">{m.discipline}</p>}
                          {!m.grade && !m.discipline && <span className="text-xs">—</span>}
                        </div>

                        {/* Statut */}
                        <div className="flex items-center gap-2">
                          <Badge className={`border-none text-xs ${s.cls}`}>{s.label}</Badge>
                          {lic?.annee && <span className="text-xs text-muted-foreground">{lic.annee}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {page} sur {pages}
                    </p>
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
