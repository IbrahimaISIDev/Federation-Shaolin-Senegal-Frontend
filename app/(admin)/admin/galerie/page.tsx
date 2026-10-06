'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Upload,
    Plus,
    MoreHorizontal,
    Trash2,
    Image as ImageIcon,
    Grid,
    List as ListIcon,
    CheckCircle2,
    Loader2,
    Eye,
    EyeOff,
    Pencil,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { mediaApi, type MediaItem } from '@/lib/api/media';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function formatSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

type VisibilityFilter = 'all' | 'public' | 'hidden';

const apiError = (err: any, fallback: string) =>
    err?.response?.data?.error ?? err?.response?.data?.message ?? fallback;

export default function AdminMediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibility, setVisibility] = useState<VisibilityFilter>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
    const queryClient = useQueryClient();

    // Upload
    const [uploadOpen, setUploadOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadAlbum, setUploadAlbum] = useState('');
    const [uploadPublic, setUploadPublic] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Édition
    const [editing, setEditing] = useState<MediaItem | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAlbum, setEditAlbum] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'media', searchQuery, visibility],
        queryFn: () =>
            mediaApi.list({
                search: searchQuery || undefined,
                inGallery: visibility === 'all' ? undefined : visibility === 'public',
                limit: 100,
            }),
    });
    const items = data?.data ?? [];

    // Albums existants (suggestions de saisie)
    const { data: galleryData } = useQuery({
        queryKey: ['gallery', 'public'],
        queryFn: () => mediaApi.publicGallery({ limit: 1 }),
    });
    const albumSuggestions = useMemo(() => {
        const set = new Set<string>((galleryData?.albums ?? []).map((a) => a.album));
        items.forEach((i) => i.album && set.add(i.album));
        return [...set].sort((a, b) => a.localeCompare(b, 'fr'));
    }, [galleryData, items]);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
    };

    const uploadMutation = useMutation({
        mutationFn: async () => {
            // Envoi séquentiel : évite de saturer la connexion sur mobile
            for (const [i, file] of uploadFiles.entries()) {
                await mediaApi.upload(file, {
                    title: uploadFiles.length === 1 ? uploadTitle || undefined
                        : uploadTitle ? `${uploadTitle} (${i + 1})` : undefined,
                    album: uploadAlbum || undefined,
                    inGallery: uploadPublic,
                });
            }
        },
        onSuccess: () => {
            toast.success(
                uploadPublic
                    ? `${uploadFiles.length} photo(s) ajoutée(s) et visible(s) dans la galerie publique`
                    : `${uploadFiles.length} fichier(s) ajouté(s) à la médiathèque (non publiés)`
            );
            invalidate();
            setUploadOpen(false);
            setUploadFiles([]);
            setUploadTitle('');
        },
        onError: (err) => {
            invalidate(); // une partie a pu être envoyée
            toast.error(apiError(err, "Erreur lors de l'upload"));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Parameters<typeof mediaApi.update>[1] }) =>
            mediaApi.update(id, data),
        onSuccess: (_res, { data }) => {
            if (data.inGallery === true) toast.success('Photo publiée dans la galerie');
            else if (data.inGallery === false) toast.success('Photo retirée de la galerie publique');
            else toast.success('Photo mise à jour');
            invalidate();
            setEditing(null);
        },
        onError: (err) => toast.error(apiError(err, 'Erreur lors de la mise à jour')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => mediaApi.delete(id),
        onSuccess: () => {
            invalidate();
            setSelectedMedia([]);
        },
        onError: (err) => toast.error(apiError(err, 'Erreur lors de la suppression')),
    });

    const bulk = async (action: 'publish' | 'hide' | 'delete') => {
        if (action === 'delete' && !confirm(`Supprimer ${selectedMedia.length} fichier(s) ?`)) return;
        try {
            await Promise.all(selectedMedia.map((id) =>
                action === 'delete' ? mediaApi.delete(id) : mediaApi.update(id, { inGallery: action === 'publish' })
            ));
            toast.success(
                action === 'delete' ? 'Fichiers supprimés'
                    : action === 'publish' ? 'Photos publiées dans la galerie' : 'Photos retirées de la galerie'
            );
        } catch (err) {
            toast.error(apiError(err, "Une partie de l'opération a échoué"));
        }
        invalidate();
        setSelectedMedia([]);
    };

    const toggleSelect = (id: number) => {
        setSelectedMedia((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const openEdit = (item: MediaItem) => {
        setEditing(item);
        setEditTitle(item.title ?? '');
        setEditAlbum(item.album ?? '');
    };

    const ItemMenu = ({ item }: { item: MediaItem }) => (
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateMutation.mutate({ id: item.id, data: { inGallery: !item.inGallery } }); }}>
                {item.inGallery
                    ? <><EyeOff className="w-4 h-4 mr-2" /> Retirer de la galerie</>
                    : <><Eye className="w-4 h-4 mr-2" /> Publier dans la galerie</>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEdit(item); }}>
                <Pencil className="w-4 h-4 mr-2" /> Titre et album
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Voir en grand
                </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Supprimer ce fichier ?')) deleteMutation.mutate(item.id);
                }}
            >
                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </DropdownMenuItem>
        </DropdownMenuContent>
    );

    const VisibilityBadge = ({ item, className }: { item: MediaItem; className?: string }) =>
        item.inGallery
            ? <Badge className={cn('gap-1 bg-emerald-600 text-white hover:bg-emerald-600', className)}><Eye className="h-3 w-3" /> En ligne</Badge>
            : <Badge variant="secondary" className={cn('gap-1', className)}><EyeOff className="h-3 w-3" /> Masquée</Badge>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Galerie & médias</h1>
                    <p className="text-muted-foreground">
                        Les photos « En ligne » apparaissent sur la{' '}
                        <Link href="/galerie" target="_blank" className="inline-flex items-center gap-1 text-accent hover:underline">
                            galerie publique <ExternalLink className="h-3 w-3" />
                        </Link>{' '}
                        et sur la page d&apos;accueil.
                    </p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 gap-2" onClick={() => setUploadOpen(true)}>
                    <Upload className="w-4 h-4" /> Ajouter des photos
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par titre ou album..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-1 rounded-lg border p-1">
                            {([['all', 'Toutes'], ['public', 'En ligne'], ['hidden', 'Masquées']] as const).map(([v, label]) => (
                                <Button
                                    key={v}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(visibility === v && 'bg-muted')}
                                    onClick={() => { setVisibility(v); setSelectedMedia([]); }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                        <div className="flex border rounded-lg overflow-hidden shrink-0">
                            <Button variant="ghost" size="icon" className={cn('rounded-none', viewMode === 'grid' && 'bg-muted')} onClick={() => setViewMode('grid')} aria-label="Vue grille">
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className={cn('rounded-none', viewMode === 'list' && 'bg-muted')} onClick={() => setViewMode('list')} aria-label="Vue liste">
                                <ListIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {selectedMedia.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                            <span className="text-sm text-muted-foreground">{selectedMedia.length} sélectionnée(s)</span>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => bulk('publish')}><Eye className="h-4 w-4" /> Publier</Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => bulk('hide')}><EyeOff className="h-4 w-4" /> Masquer</Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => bulk('delete')}><Trash2 className="h-4 w-4" /> Supprimer</Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedMedia([])}>Annuler</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground italic">Aucun média trouvé</h3>
                    <p className="text-sm text-muted-foreground">Ajoutez des photos pour commencer.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="space-y-1.5">
                            <div
                                className={cn(
                                    'group relative aspect-square rounded-lg border overflow-hidden bg-muted cursor-pointer transition-all',
                                    selectedMedia.includes(item.id) && 'ring-2 ring-accent',
                                    !item.inGallery && 'opacity-70'
                                )}
                                onClick={() => toggleSelect(item.id)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.url} alt={item.title ?? ''} className="w-full h-full object-cover transition-transform group-hover:scale-105" />

                                {selectedMedia.includes(item.id) && (
                                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-accent fill-white" />
                                    </div>
                                )}

                                <VisibilityBadge item={item} className="absolute left-1.5 top-1.5 text-[10px]" />

                                <div className="absolute top-1 right-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="secondary" size="icon" className="h-6 w-6 bg-white/70 backdrop-blur-sm" aria-label="Actions">
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <ItemMenu item={item} />
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="px-0.5">
                                <p className="truncate text-xs font-medium">{item.title}</p>
                                <p className="truncate text-[11px] text-muted-foreground">{item.album ?? 'Sans album'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="p-4 text-left font-medium">Titre</th>
                                        <th className="p-4 text-left font-medium">Album</th>
                                        <th className="p-4 text-left font-medium">Statut</th>
                                        <th className="p-4 text-left font-medium">Taille</th>
                                        <th className="p-4 text-left font-medium">Date</th>
                                        <th className="p-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-medium truncate max-w-[200px]">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{item.album ?? '—'}</td>
                                            <td className="p-4"><VisibilityBadge item={item} /></td>
                                            <td className="p-4 text-muted-foreground">{formatSize(item.size)}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <ItemMenu item={item} />
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <datalist id="gallery-albums">
                {albumSuggestions.map((a) => <option key={a} value={a} />)}
            </datalist>

            {/* Upload */}
            <Dialog open={uploadOpen} onOpenChange={(o) => { if (!uploadMutation.isPending) setUploadOpen(o); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter des photos</DialogTitle>
                        <DialogDescription>JPG, PNG ou WebP — 5 Mo maximum par photo. Sélection multiple possible.</DialogDescription>
                    </DialogHeader>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => { setUploadFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadMutation.isPending}
                        className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer w-full"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                <Plus className="w-6 h-6 text-accent" />
                            </div>
                            <p className="text-sm font-medium">
                                {uploadFiles.length ? `${uploadFiles.length} photo(s) sélectionnée(s)` : 'Sélectionner des photos'}
                            </p>
                            {uploadFiles.length > 0 && (
                                <p className="max-w-full truncate text-xs text-muted-foreground">{uploadFiles.map((f) => f.name).join(', ')}</p>
                            )}
                        </div>
                    </button>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="upload-title">Titre (facultatif)</Label>
                            <Input id="upload-title" placeholder="Ex : Stage de juillet" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="upload-album">Album (facultatif)</Label>
                            <Input id="upload-album" list="gallery-albums" placeholder="Ex : Compétitions" value={uploadAlbum} onChange={(e) => setUploadAlbum(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <p className="text-sm font-medium">Publier dans la galerie publique</p>
                            <p className="text-xs text-muted-foreground">Visible immédiatement sur le site.</p>
                        </div>
                        <Switch checked={uploadPublic} onCheckedChange={setUploadPublic} />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploadMutation.isPending}>Annuler</Button>
                        <Button
                            className="gap-2 bg-accent hover:bg-accent/90"
                            disabled={uploadFiles.length === 0 || uploadMutation.isPending}
                            onClick={() => uploadMutation.mutate()}
                        >
                            {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Envoyer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Édition */}
            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Titre et album</DialogTitle>
                        <DialogDescription>Le titre s&apos;affiche sous la photo dans la galerie publique.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-title">Titre</Label>
                            <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-album">Album</Label>
                            <Input id="edit-album" list="gallery-albums" placeholder="Sans album" value={editAlbum} onChange={(e) => setEditAlbum(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
                        <Button
                            className="gap-2 bg-accent hover:bg-accent/90"
                            disabled={updateMutation.isPending}
                            onClick={() => editing && updateMutation.mutate({ id: editing.id, data: { title: editTitle, album: editAlbum || null } })}
                        >
                            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
