'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ExportButton } from '@/components/shared/export-button';

// Mock members data
const mockMembers = [
  { id: '1', licenseNumber: 'FSS-2024-001', firstName: 'Amadou', lastName: 'Ba', email: 'amadou.ba@email.com', phone: '771234567', club: 'Temple Shaolin Dakar', region: 'Dakar', status: 'active', discipline: 'Kung Fu', registrationDate: '2024-01-15' },
  { id: '2', licenseNumber: 'FSS-2024-002', firstName: 'Fatou', lastName: 'Diop', email: 'fatou.diop@email.com', phone: '772345678', club: 'Dragon de Feu Saint-Louis', region: 'Saint-Louis', status: 'active', discipline: 'Tai Chi', registrationDate: '2024-01-20' },
  { id: '3', licenseNumber: 'FSS-2024-003', firstName: 'Moussa', lastName: 'Ndiaye', email: 'moussa.ndiaye@email.com', phone: '773456789', club: 'Wushu Academy Thiès', region: 'Thiès', status: 'pending', discipline: 'Wushu', registrationDate: '2024-02-01' },
  { id: '4', licenseNumber: 'FSS-2024-004', firstName: 'Aissatou', lastName: 'Sall', email: 'aissatou.sall@email.com', phone: '774567890', club: 'Temple Shaolin Dakar', region: 'Dakar', status: 'active', discipline: 'Kung Fu', registrationDate: '2024-02-05' },
  { id: '5', licenseNumber: 'FSS-2024-005', firstName: 'Omar', lastName: 'Sy', email: 'omar.sy@email.com', phone: '775678901', club: 'Shaolin Ziguinchor', region: 'Ziguinchor', status: 'expired', discipline: 'Sanda', registrationDate: '2023-06-10' },
  { id: '6', licenseNumber: 'FSS-2024-006', firstName: 'Mariama', lastName: 'Fall', email: 'mariama.fall@email.com', phone: '776789012', club: 'Kung Fu Diourbel', region: 'Diourbel', status: 'active', discipline: 'Qi Gong', registrationDate: '2024-02-10' },
  { id: '7', licenseNumber: 'FSS-2024-007', firstName: 'Ibrahima', lastName: 'Gueye', email: 'ibrahima.gueye@email.com', phone: '777890123', club: 'Temple Shaolin Dakar', region: 'Dakar', status: 'pending', discipline: 'Kung Fu', registrationDate: '2024-02-12' },
  { id: '8', licenseNumber: 'FSS-2024-008', firstName: 'Khady', lastName: 'Mbaye', email: 'khady.mbaye@email.com', phone: '778901234', club: 'Dragon de Feu Saint-Louis', region: 'Saint-Louis', status: 'active', discipline: 'Tai Chi', registrationDate: '2024-02-14' },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Actif', variant: 'default' },
  pending: { label: 'En attente', variant: 'secondary' },
  expired: { label: 'Expiré', variant: 'destructive' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Reshape for Excel
function getMembersForExport() {
  return mockMembers.map((m) => ({
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
    phone: m.phone,
    clubName: m.club,
    region: m.region,
    discipline: m.discipline,
    grade: '',
    status: m.status,
    licenseNumber: m.licenseNumber,
    registeredAt: m.registrationDate,
  }));
}

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map((m) => m.id));
    }
  };

  const toggleSelectMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Membres</h1>
          <p className="text-muted-foreground">
            Gérez les membres de la fédération.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton entity="membres" getData={getMembersForExport} />
          <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
            <Link href="/admin/membres/nouveau">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau membre</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Actifs</p>
            <p className="text-2xl font-bold text-success">1,089</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-warning">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Expirés</p>
            <p className="text-2xl font-bold text-destructive">113</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, licence..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="expired">Expirés</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                      checked={
                        selectedMembers.length === filteredMembers.length &&
                        filteredMembers.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Licence</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead className="hidden md:table-cell">Club</TableHead>
                  <TableHead className="hidden lg:table-cell">Discipline</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleSelectMember(member.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {member.licenseNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.club}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {member.discipline}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[member.status].variant}>
                        {statusConfig[member.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(member.registrationDate)}
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
                            <Link href={`/admin/membres/${member.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/membres/${member.id}/modifier`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedMembers.length > 0
                ? `${selectedMembers.length} sélectionné(s)`
                : `${filteredMembers.length} résultat(s)`}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Page 1 / 10</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
