'use client';

import { useState } from 'react';
import {
    Image as ImageIcon,
    Plus,
    X,
    Search,
    CheckCircle2,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface MediaPickerProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    helperText?: string;
}

// Mock media for picker
const mockMedia = [
    { id: '1', title: 'Championnat Dakar 1', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400' },
    { id: '2', title: 'Stage Saint-Louis', url: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=400' },
    { id: '5', title: 'Temple Dakar Façade', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400' },
    { id: '6', title: 'Groupe Formation', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400' },
];

export function MediaPicker({ value, onChange, label, helperText }: MediaPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUrl, setSelectedUrl] = useState(value || '');

    const filteredMedia = mockMedia.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (url: string) => {
        setSelectedUrl(url);
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
                            <Button className="bg-accent hover:bg-accent/90 gap-2 shrink-0">
                                <Upload className="w-4 h-4" /> Uploader
                            </Button>
                        </div>

                        {/* Media Grid */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {filteredMedia.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative aspect-square rounded-lg border overflow-hidden cursor-pointer group transition-all ${selectedUrl === item.url ? 'ring-4 ring-accent' : ''
                                            }`}
                                        onClick={() => handleSelect(item.url)}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
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
