'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Upload,
    Plus,
    MoreHorizontal,
    Eye,
    Trash2,
    Image as ImageIcon,
    Play,
    FileText,
    Filter,
    CheckCircle2,
    X,
    Grid,
    List as ListIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// Mock media data
const mockMedia = [
    { id: '1', type: 'image', title: 'Championnat Dakar 1', category: 'Compétitions', size: '1.2 Mo', dimension: '1920x1080', uploadedAt: '2024-02-10', url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400' },
    { id: '2', type: 'image', title: 'Stage Saint-Louis', category: 'Stages', size: '850 Ko', dimension: '1200x800', uploadedAt: '2024-02-05', url: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=400' },
    { id: '3', type: 'video', title: 'Démo Sanda', category: 'Vidéo', size: '15.4 Mo', duration: '0:45', uploadedAt: '2024-02-01', url: '#' },
    { id: '4', type: 'image', title: 'Logo Fédération', category: 'Branding', size: '45 Ko', dimension: '512x512', uploadedAt: '2024-01-20', url: '/icon.svg' },
    { id: '5', type: 'image', title: 'Temple Dakar Façade', category: 'Clubs', size: '2.1 Mo', dimension: '2560x1440', uploadedAt: '2024-01-15', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400' },
    { id: '6', type: 'image', title: 'Groupe Formation', category: 'Formation', size: '1.8 Mo', dimension: '2000x1333', uploadedAt: '2024-01-10', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400' },
];

export default function AdminMediaPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);

    const filteredMedia = mockMedia.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const toggleSelect = (id: string) => {
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
                    <p className="text-muted-foreground">Gérez vos images, vidéos et documents.</p>
                </div>
                <div className="flex gap-2">
                    {selectedMedia.length > 0 && (
                        <Button variant="destructive" className="gap-2">
                            <Trash2 className="w-4 h-4" /> Supprimer ({selectedMedia.length})
                        </Button>
                    )}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-accent hover:bg-accent/90 gap-2">
                                <Upload className="w-4 h-4" /> Uploader
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Uploader des médias</DialogTitle>
                                <DialogDescription>
                                    Glissez-déposez vos fichiers ici ou cliquez pour parcourir.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-accent" />
                                    </div>
                                    <p className="text-sm font-medium">Sélectionner des fichiers</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, MP4 jusqu&apos;à 50 Mo</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Annuler</Button>
                                <Button>Uploader</Button>
                            </DialogFooter>
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
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[130px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="image">Images</SelectItem>
                                    <SelectItem value="video">Vidéos</SelectItem>
                                </SelectContent>
                            </Select>
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
                    </div>
                </CardContent>
            </Card>

            {/* Media Content */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'group relative aspect-square rounded-lg border overflow-hidden bg-muted cursor-pointer transition-all',
                                selectedMedia.includes(item.id) && 'ring-2 ring-accent'
                            )}
                            onClick={() => toggleSelect(item.id)}
                        >
                            {item.type === 'image' ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <Play className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{item.duration}</span>
                                </div>
                            )}

                            {/* Selection overlay */}
                            {selectedMedia.includes(item.id) && (
                                <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-accent fill-white" />
                                </div>
                            )}

                            {/* Hover info */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                                <p className="text-[8px] text-white/70">{item.size}</p>
                            </div>

                            {/* Actions dropdown button */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="secondary" size="icon" className="h-6 w-6 bg-white/50 backdrop-blur-sm">
                                            <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Voir</DropdownMenuItem>
                                        <DropdownMenuItem><ImageIcon className="w-4 h-4 mr-2" /> Inspecter</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Supprimer</DropdownMenuItem>
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
                                        <th className="p-4 text-left font-medium">Type</th>
                                        <th className="p-4 text-left font-medium">Taille</th>
                                        <th className="p-4 text-left font-medium">Date</th>
                                        <th className="p-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedia.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                                        {item.type === 'image' ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Play className="w-5 h-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium truncate max-w-[200px]">{item.title}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground italic capitalize">{item.type}</td>
                                            <td className="p-4 text-muted-foreground">{item.size}</td>
                                            <td className="p-4 text-muted-foreground">{item.uploadedAt}</td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Voir</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Supprimer</DropdownMenuItem>
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

            {filteredMedia.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground italic">Aucun média trouvé</h3>
                    <p className="text-sm text-muted-foreground">Essayez d&apos;ajuster vos filtres de recherche.</p>
                </div>
            )}
        </div>
    );
}

// Utility for conditional classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
