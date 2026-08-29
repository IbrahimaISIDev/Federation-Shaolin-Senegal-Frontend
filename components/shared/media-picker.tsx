'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Image as ImageIcon,
    Search,
    CheckCircle2,
    Upload,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mediaApi } from '@/lib/api/media';
import { toast } from 'sonner';

interface MediaPickerProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    helperText?: string;
}

export function MediaPicker({ value, onChange, label, helperText }: MediaPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUrl, setSelectedUrl] = useState(value || '');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'media', searchQuery],
        queryFn: () => mediaApi.list({ search: searchQuery || undefined, limit: 60 }),
        enabled: isOpen,
    });
    const items = data?.data ?? [];

    const uploadMutation = useMutation({
        mutationFn: (file: File) => mediaApi.upload(file),
        onSuccess: (item) => {
            toast.success('Fichier ajouté à la bibliothèque');
            queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
            setSelectedUrl(item.url);
        },
        onError: () => toast.error("Erreur lors de l'upload"),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadMutation.mutate(file);
        e.target.value = '';
    };

    const confirmSelection = () => {
        onChange(selectedUrl);
        setIsOpen(false);
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium">{label}</label>}

            <div className="flex flex-col gap-3">
                {value ? (
                    <div className="relative aspect-video w-full max-w-[300px] rounded-lg border overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button type="button" variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
                                Changer
                            </Button>
                            <Button type="button" variant="destructive" size="sm" onClick={() => onChange('')}>
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full max-w-[300px] aspect-video flex flex-col items-center justify-center gap-2 border-dashed border-2 h-auto py-8"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">Sélectionner une image</span>
                        <span className="text-xs text-muted-foreground">ou uploader un nouveau fichier</span>
                    </Button>
                )}

                {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Bibliothèque de médias</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Search and Upload */}
                        <div className="p-6 pb-4 flex flex-col sm:flex-row gap-4 border-b">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button
                                type="button"
                                className="bg-accent hover:bg-accent/90 gap-2 shrink-0"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadMutation.isPending}
                            >
                                {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Uploader
                            </Button>
                        </div>

                        {/* Media Grid */}
                        <ScrollArea className="flex-1 p-6">
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : items.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-12">
                                    Aucun fichier dans la bibliothèque. Uploadez-en un pour commencer.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`relative aspect-square rounded-lg border overflow-hidden cursor-pointer group transition-all ${selectedUrl === item.url ? 'ring-4 ring-accent' : ''
                                                }`}
                                            onClick={() => setSelectedUrl(item.url)}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.url} alt={item.title ?? ''} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {selectedUrl === item.url && (
                                                <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-8 h-8 text-accent fill-white" />
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <div className="p-6 border-t flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {selectedUrl ? "1 fichier sélectionné" : "Aucun fichier sélectionné"}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                            <Button disabled={!selectedUrl} onClick={confirmSelection} className="bg-accent hover:bg-accent/90">
                                Confirmer la sélection
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
