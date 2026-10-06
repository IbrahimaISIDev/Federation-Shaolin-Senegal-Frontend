'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaPicker } from '@/components/shared/media-picker';
import { contentApi } from '@/lib/api/content';
import {
    CONTENT_DEFAULTS,
    type BureauContent,
    type ContentKey,
    type HomeContent,
} from '@/lib/content/defaults';
import { toast } from 'sonner';

const apiError = (err: any, fallback: string) =>
    err?.response?.data?.error ?? err?.response?.data?.message ?? fallback;

const TIER_LABELS = {
    presidency: 'Présidence',
    executive: 'Direction (bureau exécutif)',
    commission: 'Commission',
} as const;

// Données d'un bloc + statut (personnalisé / par défaut) + enregistrement
function useEditableContent<T>(key: ContentKey) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['content', key],
        queryFn: () => contentApi.get<T>(key),
    });
    const [draft, setDraft] = useState<T | null>(null);
    const [dirty, setDirty] = useState(false);

    // Copie de travail initialisée au chargement (puis après enregistrement)
    useEffect(() => {
        if (!isLoading && !dirty) {
            setDraft(structuredClone((data?.data ?? CONTENT_DEFAULTS[key]) as T));
        }
    }, [data, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    const update = (next: T) => { setDraft(next); setDirty(true); };

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['content', key] });

    const save = useMutation({
        mutationFn: () => contentApi.save<T>(key, draft as T),
        onSuccess: () => { toast.success('Enregistré — visible immédiatement sur le site'); setDirty(false); invalidate(); },
        onError: (err) => toast.error(apiError(err, "Erreur lors de l'enregistrement")),
    });

    const reset = useMutation({
        mutationFn: () => contentApi.reset(key),
        onSuccess: () => {
            toast.success('Contenu d\'origine rétabli');
            setDirty(false);
            setDraft(structuredClone(CONTENT_DEFAULTS[key] as T));
            invalidate();
        },
        onError: (err) => toast.error(apiError(err, 'Erreur')),
    });

    return { draft, update, dirty, save, reset, isCustom: !!data?.data, updatedAt: data?.updatedAt ?? null, isLoading };
}

function SaveBar({ dirty, isCustom, updatedAt, save, reset, previewHref }: {
    dirty: boolean; isCustom: boolean; updatedAt: string | null;
    save: { mutate: () => void; isPending: boolean }; reset: { mutate: () => void; isPending: boolean };
    previewHref: string;
}) {
    return (
        <div className="sticky top-16 z-20 flex flex-wrap items-center gap-3 rounded-lg border bg-background/95 p-3 backdrop-blur">
            {isCustom
                ? <Badge variant="secondary">Personnalisé{updatedAt ? ` · modifié le ${new Date(updatedAt).toLocaleDateString('fr-FR')}` : ''}</Badge>
                : <Badge variant="outline">Contenu d&apos;origine</Badge>}
            {dirty && <span className="text-sm font-medium text-amber-700">Modifications non enregistrées</span>}
            <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link href={previewHref} target="_blank"><ExternalLink className="h-4 w-4" /> Voir sur le site</Link>
                </Button>
                {isCustom && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        disabled={reset.isPending}
                        onClick={() => { if (confirm('Revenir au contenu d\'origine ? Vos modifications seront perdues.')) reset.mutate(); }}
                    >
                        <RotateCcw className="h-4 w-4" /> Contenu d&apos;origine
                    </Button>
                )}
                <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
                    {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                </Button>
            </div>
        </div>
    );
}

// ─── Onglet Accueil ───────────────────────────────────────────────────────────

function HomeEditor() {
    const { draft, update, dirty, save, reset, isCustom, updatedAt } = useEditableContent<HomeContent>('home');
    if (!draft) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

    const setHero = (patch: Partial<HomeContent['hero']>) => update({ ...draft, hero: { ...draft.hero, ...patch } });
    const setHeroStat = (i: number, patch: Partial<HomeContent['hero']['stats'][number]>) =>
        setHero({ stats: draft.hero.stats.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
    const setFigure = (i: number, patch: Partial<HomeContent['keyFigures'][number]>) =>
        update({ ...draft, keyFigures: draft.keyFigures.map((f, j) => (j === i ? { ...f, ...patch } : f)) });

    return (
        <div className="space-y-6">
            <SaveBar dirty={dirty} isCustom={isCustom} updatedAt={updatedAt} save={save} reset={reset} previewHref="/" />

            <Card>
                <CardHeader>
                    <CardTitle>Bandeau principal</CardTitle>
                    <CardDescription>Le haut de la page d&apos;accueil. Le titre « Association Shaolin Si Sénégal » reste fixe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="badge">Mention au-dessus du titre</Label>
                        <Input id="badge" maxLength={150} value={draft.hero.badge} onChange={(e) => setHero({ badge: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Texte de présentation *</Label>
                        <Textarea id="description" rows={3} maxLength={600} value={draft.hero.description} onChange={(e) => setHero({ description: e.target.value })} />
                        <p className="text-right text-xs text-muted-foreground">{draft.hero.description.length} / 600</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <MediaPicker
                            label="Photo du bandeau"
                            value={draft.hero.photoUrl}
                            onChange={(url) => setHero({ photoUrl: url })}
                            helperText="De préférence un portrait détouré (fond transparent)."
                        />
                        <div className="space-y-1.5">
                            <Label htmlFor="caption">Légende de la photo</Label>
                            <Input id="caption" maxLength={120} value={draft.hero.photoCaption} onChange={(e) => setHero({ photoCaption: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Chiffres sous le texte</Label>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {draft.hero.stats.map((s, i) => (
                                <div key={i} className="space-y-2 rounded-lg border p-3">
                                    <Input aria-label={`Valeur ${i + 1}`} placeholder="Valeur" maxLength={20} value={s.value} onChange={(e) => setHeroStat(i, { value: e.target.value })} />
                                    <Input aria-label={`Libellé ${i + 1}`} placeholder="Libellé" maxLength={40} value={s.label} onChange={(e) => setHeroStat(i, { label: e.target.value })} />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Chiffres clés</CardTitle>
                    <CardDescription>Les cartes affichées juste sous le bandeau (de 1 à 6).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {draft.keyFigures.map((f, i) => (
                        <div key={i} className="grid items-start gap-2 rounded-lg border p-3 sm:grid-cols-[140px_1fr_1.5fr_auto]">
                            <Input aria-label="Valeur" placeholder="Valeur" maxLength={20} value={f.value} onChange={(e) => setFigure(i, { value: e.target.value })} />
                            <Input aria-label="Libellé" placeholder="Libellé" maxLength={50} value={f.label} onChange={(e) => setFigure(i, { label: e.target.value })} />
                            <Input aria-label="Description" placeholder="Description" maxLength={120} value={f.description} onChange={(e) => setFigure(i, { description: e.target.value })} />
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Supprimer ce chiffre"
                                disabled={draft.keyFigures.length <= 1}
                                onClick={() => update({ ...draft, keyFigures: draft.keyFigures.filter((_, j) => j !== i) })}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {draft.keyFigures.length < 6 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => update({ ...draft, keyFigures: [...draft.keyFigures, { value: '', label: '', description: '' }] })}
                        >
                            <Plus className="h-4 w-4" /> Ajouter un chiffre
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ─── Onglet Bureau ────────────────────────────────────────────────────────────

function BureauEditor() {
    const { draft, update, dirty, save, reset, isCustom, updatedAt } = useEditableContent<BureauContent>('bureau');
    if (!draft) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

    const commissionNames = [...new Set(draft.map((m) => m.commission).filter(Boolean))] as string[];
    const setMember = (i: number, patch: Partial<BureauContent[number]>) =>
        update(draft.map((m, j) => (j === i ? { ...m, ...patch } : m)));
    const move = (i: number, dir: -1 | 1) => {
        const next = [...draft];
        [next[i], next[i + dir]] = [next[i + dir], next[i]];
        update(next);
    };

    return (
        <div className="space-y-6">
            <SaveBar dirty={dirty} isCustom={isCustom} updatedAt={updatedAt} save={save} reset={reset} previewHref="/federation" />

            <Card>
                <CardHeader>
                    <CardTitle>Membres du bureau</CardTitle>
                    <CardDescription>
                        Présidence et direction apparaissent sur l&apos;accueil et sur la page « L&apos;Association » ;
                        les commissions, sur « L&apos;Association » uniquement, regroupées par nom. L&apos;ordre de la liste est
                        l&apos;ordre d&apos;affichage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <datalist id="commissions">
                        {commissionNames.map((c) => <option key={c} value={c} />)}
                    </datalist>
                    {draft.map((m, i) => (
                        <div key={m.id} className="space-y-3 rounded-lg border p-3">
                            <div className="grid gap-2 md:grid-cols-[1fr_1fr_220px_auto]">
                                <Input aria-label="Nom" placeholder="Prénom Nom *" maxLength={100} value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} />
                                <Input aria-label="Fonction" placeholder="Fonction *" maxLength={100} value={m.role} onChange={(e) => setMember(i, { role: e.target.value })} />
                                <Select
                                    value={m.tier}
                                    onValueChange={(v) => v && setMember(i, { tier: v as BureauContent[number]['tier'], ...(v !== 'commission' ? { commission: undefined } : {}) })}
                                >
                                    <SelectTrigger aria-label="Niveau"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(TIER_LABELS).map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" aria-label="Monter" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" aria-label="Descendre" disabled={i === draft.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Supprimer ce membre"
                                        onClick={() => { if (confirm(`Retirer ${m.name || 'ce membre'} du bureau ?`)) update(draft.filter((_, j) => j !== i)); }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                                {m.tier === 'commission' && (
                                    <Input
                                        aria-label="Commission"
                                        list="commissions"
                                        placeholder="Nom de la commission (ex : Commission Organisation)"
                                        maxLength={100}
                                        value={m.commission ?? ''}
                                        onChange={(e) => setMember(i, { commission: e.target.value })}
                                    />
                                )}
                                <MediaPicker
                                    value={m.photoUrl ?? ''}
                                    onChange={(url) => setMember(i, { photoUrl: url || undefined })}
                                    helperText="Photo facultative (les initiales sont affichées sinon)."
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => update([...draft, { id: `membre-${Date.now()}`, name: '', role: '', tier: 'executive' }])}
                    >
                        <Plus className="h-4 w-4" /> Ajouter un membre
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AdminContentPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Contenu du site</h1>
                <p className="text-muted-foreground">
                    Textes, chiffres et composition du bureau affichés sur le site public. Les modifications sont visibles
                    dès l&apos;enregistrement.
                </p>
            </div>
            <Tabs defaultValue="home">
                <TabsList>
                    <TabsTrigger value="home">Accueil</TabsTrigger>
                    <TabsTrigger value="bureau">Bureau</TabsTrigger>
                </TabsList>
                <TabsContent value="home" className="mt-6"><HomeEditor /></TabsContent>
                <TabsContent value="bureau" className="mt-6"><BureauEditor /></TabsContent>
            </Tabs>
        </div>
    );
}
