'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2, Globe, EyeOff, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { competitionsApi, type ResultRowPayload } from '@/lib/api/competitions';
import { toast } from 'sonner';

type RowState = { classement: string; points: string };

const rowKey = (memberId: number, categorie: string) => `${memberId}|${categorie}`;

const medalFor = (classement: string) => {
    const n = Number(classement);
    if (n === 1) return { label: 'OR', cls: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (n === 2) return { label: 'ARGENT', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
    if (n === 3) return { label: 'BRONZE', cls: 'bg-orange-100 text-orange-800 border-orange-200' };
    return null;
};

const apiError = (err: any, fallback: string) =>
    err?.response?.data?.error ?? err?.response?.data?.message ?? fallback;

export default function CompetitionResultsAdminPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const competitionId = Number(id);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'competition', competitionId, 'resultats'],
        queryFn: () => competitionsApi.adminResults(competitionId),
        enabled: !!competitionId,
    });
    const competition = data?.data;

    // Saisie locale : clé « membre|catégorie » → classement / points (texte)
    const [rows, setRows] = useState<Record<string, RowState>>({});
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!competition) return;
        const initial: Record<string, RowState> = {};
        for (const r of competition.resultats) {
            initial[rowKey(r.memberId, r.categorie)] = {
                classement: String(r.classement),
                points: r.points != null ? String(r.points) : '',
            };
        }
        setRows(initial);
        setDirty(false);
    }, [competition]);

    // Participants regroupés par catégorie d'inscription
    const groups = useMemo(() => {
        const map = new Map<string, NonNullable<typeof competition>['inscriptions']>();
        for (const ins of competition?.inscriptions ?? []) {
            const cat = ins.categorie?.trim() ?? '';
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(ins);
        }
        return [...map.entries()];
    }, [competition]);

    const update = (key: string, field: keyof RowState, value: string) => {
        setRows((prev) => ({ ...prev, [key]: { ...(prev[key] ?? { classement: '', points: '' }), [field]: value } }));
        setDirty(true);
    };

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'competition', competitionId] });
    };

    const saveMutation = useMutation({
        mutationFn: () => {
            const payload: ResultRowPayload[] = [];
            for (const [cat, inscriptions] of groups) {
                for (const ins of inscriptions) {
                    const row = rows[rowKey(ins.member.id, cat)];
                    if (!row?.classement.trim()) continue; // non classé
                    payload.push({
                        memberId: ins.member.id,
                        categorie: cat,
                        classement: Number(row.classement),
                        points: row.points.trim() ? Number(row.points.replace(',', '.')) : null,
                    });
                }
            }
            const invalid = payload.find((p) => !Number.isInteger(p.classement) || p.classement < 1
                || (p.points != null && !Number.isFinite(p.points)));
            if (invalid) throw new Error('Classement : nombre entier à partir de 1 ; points : nombre.');
            return competitionsApi.saveResults(competitionId, payload);
        },
        onSuccess: () => {
            toast.success('Résultats enregistrés');
            setDirty(false);
            invalidate();
        },
        onError: (err: any) => toast.error(err instanceof Error && !('response' in err) ? err.message : apiError(err, "Erreur lors de l'enregistrement")),
    });

    const publishMutation = useMutation({
        mutationFn: (publie: boolean) => competitionsApi.publishResults(competitionId, publie),
        onSuccess: (res) => {
            toast.success(res.message);
            invalidate();
        },
        onError: (err: any) => toast.error(apiError(err, 'Erreur lors de la publication')),
    });

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }
    if (isError || !competition) {
        return (
            <div className="space-y-4 py-20 text-center">
                <p className="text-muted-foreground">Compétition introuvable.</p>
                <Button variant="outline" asChild><Link href="/admin/competitions">Retour</Link></Button>
            </div>
        );
    }

    const published = competition.resultatsPublies;
    const savedCount = competition.resultats.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/competitions/${competitionId}`}><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">Résultats</h1>
                            {published
                                ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Publiés</Badge>
                                : <Badge variant="outline">Non publiés</Badge>}
                        </div>
                        <p className="text-muted-foreground">{competition.titre}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => saveMutation.mutate()}
                        disabled={saveMutation.isPending || !dirty}
                        className="gap-2 bg-accent hover:bg-accent/90"
                    >
                        {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer
                    </Button>
                    {published ? (
                        <Button variant="outline" className="gap-2" disabled={publishMutation.isPending} onClick={() => publishMutation.mutate(false)}>
                            <EyeOff className="w-4 h-4" /> Retirer du site
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="gap-2"
                            disabled={publishMutation.isPending || dirty || savedCount === 0}
                            title={dirty ? "Enregistrez d'abord vos modifications" : savedCount === 0 ? 'Aucun résultat enregistré' : undefined}
                            onClick={() => publishMutation.mutate(true)}
                        >
                            <Globe className="w-4 h-4" /> Publier sur le site
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                    Indiquez le classement des participants inscrits dans chaque catégorie (laisser vide = non
                    classé). Les places 1, 2 et 3 donnent la médaille d&apos;or, d&apos;argent et de bronze ; les
                    ex aequo sont possibles (ex. deux 3<sup>e</sup> en combat). Les résultats ne sont visibles sur le
                    site qu&apos;après publication.
                    {dirty && <span className="mt-2 block font-medium text-amber-700">Modifications non enregistrées.</span>}
                </CardContent>
            </Card>

            {groups.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">Aucun participant inscrit</p>
                        <p className="text-sm text-muted-foreground">Les résultats se saisissent à partir des inscriptions à la compétition.</p>
                    </CardContent>
                </Card>
            ) : (
                groups.map(([cat, inscriptions]) => (
                    <Card key={cat || '__none__'}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Trophy className="h-5 w-5 text-accent" />
                                {cat || 'Sans catégorie'}
                            </CardTitle>
                            <CardDescription>{inscriptions.length} participant{inscriptions.length > 1 ? 's' : ''}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="hidden grid-cols-[1fr_110px_110px_90px] gap-3 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
                                <span>Participant</span><span>Classement</span><span>Points</span><span>Médaille</span>
                            </div>
                            {inscriptions.map((ins) => {
                                const key = rowKey(ins.member.id, cat);
                                const row = rows[key] ?? { classement: '', points: '' };
                                const medal = medalFor(row.classement);
                                return (
                                    <div key={key} className="grid grid-cols-2 items-center gap-3 rounded-lg border p-2 sm:grid-cols-[1fr_110px_110px_90px]">
                                        <div className="col-span-2 min-w-0 sm:col-span-1">
                                            <p className="truncate text-sm font-medium">{ins.member.prenom} {ins.member.nom}</p>
                                            <p className="truncate text-xs text-muted-foreground">{ins.member.club.nom}</p>
                                        </div>
                                        <Input
                                            aria-label={`Classement de ${ins.member.prenom} ${ins.member.nom}`}
                                            inputMode="numeric"
                                            placeholder="—"
                                            value={row.classement}
                                            onChange={(e) => update(key, 'classement', e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                        <Input
                                            aria-label={`Points de ${ins.member.prenom} ${ins.member.nom}`}
                                            inputMode="decimal"
                                            placeholder="Points"
                                            value={row.points}
                                            onChange={(e) => update(key, 'points', e.target.value)}
                                        />
                                        <div>{medal && <Badge className={medal.cls}>{medal.label}</Badge>}</div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
