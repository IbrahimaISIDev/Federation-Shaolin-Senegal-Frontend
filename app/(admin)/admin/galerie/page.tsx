'use client';

import { useRef, useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { mediaApi } from '@/lib/api/media';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function formatSize(bytes: number | null) {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function AdminMediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
    const [uploadOpen, setUploadOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'media', searchQuery],
        queryFn: () => mediaApi.list({ search: searchQuery || undefined, limit: 100 }),
    });
    const items = data?.data ?? [];

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });

    const uploadMutation = useMutation({
        mutationFn: (file: File) => mediaApi.upload(file),
        onSuccess: () => {
            toast.success('Fichier uploadé');
            invalidate();
            setUploadOpen(false);
        },
        onError: () => toast.error("Erreur lors de l'upload"),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => mediaApi.delete(id),
        onSuccess: () => {
            invalidate();
            setSelectedMedia([]);
        },
        onError: () => toast.error('Erreur lors de la suppression'),
    });

    const deleteSelected = async () => {
        if (!confirm(`Supprimer ${selectedMedia.length} fichier(s) ?`)) return;
        await Promise.all(selectedMedia.map((id) => mediaApi.delete(id)));
        toast.success('Fichiers supprimés');
        invalidate();
        setSelectedMedia([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadMutation.mutate(file);
        e.target.value = '';
    };

    const toggleSelect = (id: number) => {
        setSelectedMedia((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Bibliothèque de médias</h1>
                    <p className="text-muted-foreground">Gérez les images utilisées sur le site.</p>
                </div>
                <div className="flex gap-2">
                    {selectedMedia.length > 0 && (
                        <Button variant="destructive" className="gap-2" onClick={deleteSelected}>
                            <Trash2 className="w-4 h-4" /> Supprimer ({selectedMedia.length})
                        </Button>
                    )}
                    <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                        <Button className="bg-accent hover:bg-accent/90 gap-2" onClick={() => setUploadOpen(true)}>
                            <Upload className="w-4 h-4" /> Uploader
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Uploader un média</DialogTitle>
                                <DialogDescription>
                                    Formats acceptés : JPG, PNG, WebP — 5 Mo maximum.
                                </DialogDescription>
                            </DialogHeader>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadMutation.isPending}
                                className="border-2 border-dashed border-muted rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer w-full"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                        {uploadMutation.isPending ? (
                                            <Loader2 className="w-6 h-6 text-accent animate-spin" />
                                        ) : (
                                            <Plus className="w-6 h-6 text-accent" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium">
                                        {uploadMutation.isPending ? 'Envoi en cours...' : 'Sélectionner un fichier'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP jusqu&apos;à 5 Mo</p>
                                </div>
                            </button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex border rounded-lg overflow-hidden shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('rounded-none', viewMode === 'grid' && 'bg-muted')}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('rounded-none', viewMode === 'list' && 'bg-muted')}
                                onClick={() => setViewMode('list')}
                            >
                                <ListIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
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
                    <p className="text-sm text-muted-foreground">Uploadez votre premier fichier pour commencer.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'group relative aspect-square rounded-lg border overflow-hidden bg-muted cursor-pointer transition-all',
                                selectedMedia.includes(item.id) && 'ring-2 ring-accent'
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

                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                                <p className="text-[8px] text-white/70">{formatSize(item.size)}</p>
                            </div>

                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="secondary" size="icon" className="h-6 w-6 bg-white/50 backdrop-blur-sm">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <ImageIcon className="w-4 h-4 mr-2" /> Voir en grand
                                            </a>
                                        </DropdownMenuItem>
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
                                </DropdownMenu>
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
                                        <th className="p-4 text-left font-medium">Nom</th>
                                        <th className="p-4 text-left font-medium">Taille</th>
                                        <th className="p-4 text-left font-medium">Ajouté par</th>
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
                                            <td className="p-4 text-muted-foreground">{formatSize(item.size)}</td>
                                            <td className="p-4 text-muted-foreground">{item.uploadedBy?.email ?? '—'}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                                <ImageIcon className="w-4 h-4 mr-2" /> Voir en grand
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                if (confirm('Supprimer ce fichier ?')) deleteMutation.mutate(item.id);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
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
        </div>
    );
}
