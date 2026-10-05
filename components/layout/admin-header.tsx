'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Bell, ChevronDown, LogOut, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/api/auth';
import { statsApi } from '@/lib/api/stats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const { data } = useQuery({
        queryKey: ['admin', 'notifications'],
        queryFn: () => statsApi.notifications(),
        refetchInterval: 60 * 1000,
    });
    const counts = data?.data;
    const total = counts?.total ?? 0;
    const notificationItems = [
        { label: 'Preuves de paiement à vérifier', count: counts?.paymentProofs ?? 0, href: '/admin/affiliations' },
        { label: 'Affiliations à valider', count: counts?.affiliationsToReview ?? 0, href: '/admin/affiliations' },
        { label: 'Renouvellements à confirmer', count: counts?.renewalsToVerify ?? 0, href: '/admin/renouvellements' },
    ];

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2"
                aria-label="Ouvrir le menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1" />

            {/* Notifications : éléments réellement en attente d'action */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                        <Bell className="h-5 w-5" />
                        {total > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground">
                                {total > 99 ? '99+' : total}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel>À traiter</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {total === 0 ? (
                        <p className="px-2 py-3 text-sm text-muted-foreground">Rien en attente pour le moment.</p>
                    ) : (
                        notificationItems
                            .filter((item) => item.count > 0)
                            .map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link href={item.href} className="flex items-center justify-between gap-2">
                                        <span>{item.label}</span>
                                        <span className="rounded-full bg-accent/15 px-2 text-xs font-semibold text-accent">{item.count}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                AD
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline-block">Admin</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/admin/parametres">
                            <Settings className="mr-2 h-4 w-4" />
                            Paramètres
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
