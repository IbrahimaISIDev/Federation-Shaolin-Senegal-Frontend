'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    PlusCircle,
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Building2,
    Users,
    MapPin,
    ChevronLeft,
    ChevronRight,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const mockClubs = [
    { id: '1', code: 'TSK-001', name: 'Temple Shaolin Dakar', region: 'Dakar', city: 'Dakar', president: 'Cheikh Diallo', memberCount: 145, phone: '771234567', email: 'tsdk@email.com', isActive: true, createdAt: '2019-03-15' },
    { id: '2', code: 'DFS-002', name: 'Dragon de Feu Saint-Louis', region: 'Saint-Louis', city: 'Saint-Louis', president: 'Ibrahima Fall', memberCount: 78, phone: '772345678', email: 'dfs@email.com', isActive: true, createdAt: '2020-06-20' },
    { id: '3', code: 'WAT-003', name: 'Wushu Academy Thiès', region: 'Thiès', city: 'Thiès', president: 'Fatou Ndiaye', memberCount: 92, phone: '773456789', email: 'wat@email.com', isActive: true, createdAt: '2020-09-01' },
    { id: '4', code: 'SHZ-004', name: 'Shaolin Ziguinchor', region: 'Ziguinchor', city: 'Ziguinchor', president: 'Omar Bodian', memberCount: 54, phone: '774567890', email: 'shz@email.com', isActive: false, createdAt: '2021-01-10' },
    { id: '5', code: 'KFD-005', name: 'Kung Fu Diourbel', region: 'Diourbel', city: 'Diourbel', president: 'Aissatou Sarr', memberCount: 38, phone: '775678901', email: 'kfd@email.com', isActive: true, createdAt: '2021-04-05' },
    { id: '6', code: 'SKO-006', name: 'Shaolin Kaolack', region: 'Kaolack', city: 'Kaolack', president: 'Moussa Diouf', memberCount: 61, phone: '776789012', email: 'sko@email.com', isActive: true, createdAt: '2022-02-14' },
];

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminClubsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');

    const filteredClubs = mockClubs.filter((club) => {
        const matchesSearch =
            club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.president.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? club.isActive : !club.isActive);
        const matchesRegion = regionFilter === 'all' || club.region.toLowerCase() === regionFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesRegion;
    });

    const regions = [...new Set(mockClubs.map((c) => c.region))].sort();

    const totalMembers = mockClubs.reduce((acc, c) => acc + c.memberCount, 0);
    const activeClubs = mockClubs.filter((c) => c.isActive).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
                    <p className="text-muted-foreground">Gérez les clubs affiliés à la fédération.</p>
                </div>
                <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                    <Link href="/admin/clubs/nouveau">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Nouveau club</span>
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-2xl font-bold">{mockClubs.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Actifs</p>
                            <p className="text-2xl font-bold text-emerald-600">{activeClubs}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Membres</p>
                            <p className="text-2xl font-bold">{totalMembers}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Régions</p>
                            <p className="text-2xl font-bold">{regions.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, code, président..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="active">Actifs</SelectItem>
                                <SelectItem value="inactive">Inactifs</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Région" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les régions</SelectItem>
                                {regions.map((r) => (
                                    <SelectItem key={r} value={r.toLowerCase()}>{r}</SelectItem>
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
                                    <TableHead>Code</TableHead>
                                    <TableHead>Club</TableHead>
                                    <TableHead className="hidden md:table-cell">Président</TableHead>
                                    <TableHead className="hidden sm:table-cell">Région</TableHead>
                                    <TableHead>Membres</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="hidden lg:table-cell">Date d'adhésion</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClubs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            Aucun club trouvé.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClubs.map((club) => (
                                        <TableRow key={club.id}>
                                            <TableCell className="font-mono text-sm text-muted-foreground">{club.code}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{club.name}</p>
                                                        <p className="text-xs text-muted-foreground">{club.city}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{club.president}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {club.region}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-medium">
                                                    <Users className="w-3 h-3 text-muted-foreground" />
                                                    {club.memberCount}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={club.isActive ? 'default' : 'secondary'}>
                                                    {club.isActive ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                                {formatDate(club.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clubs/${club.id}`}>
                                                                <Eye className="w-4 h-4 mr-2" /> Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/clubs/${club.id}/modifier`}>
                                                                <Pencil className="w-4 h-4 mr-2" /> Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="w-4 h-4 mr-2" /> Désaffilier
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <p className="text-sm text-muted-foreground">{filteredClubs.length} résultat(s)</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">Page 1 / 1</span>
                            <Button variant="outline" size="sm" disabled>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
