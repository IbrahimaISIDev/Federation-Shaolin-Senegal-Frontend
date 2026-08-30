'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    Newspaper,
    Trophy,
    Image,
    Settings,
    BarChart3,
    X,
    ClipboardList,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';

const adminNavItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/membres', label: 'Membres', icon: Users },
    { href: '/admin/clubs', label: 'Clubs', icon: Building2 },
    { href: '/admin/affiliations', label: 'Affiliations', icon: ClipboardList },
    { href: '/admin/renouvellements', label: 'Renouvellements', icon: RefreshCw },
    { href: '/admin/actualites', label: 'Actualités', icon: Newspaper },
    { href: '/admin/competitions', label: 'Compétitions', icon: Trophy },
    { href: '/admin/galerie', label: 'Galerie', icon: Image },
    { href: '/admin/rapports', label: 'Rapports', icon: BarChart3 },
    { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

interface AdminSidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-primary-foreground/10">
                <div className="flex items-center gap-2">
                    <Logo size="sm" variant="light" />
                    <div>
                        <p className="text-sm font-semibold text-primary-foreground">Admin</p>
                        <p className="text-xs text-primary-foreground/60">Back-office</p>
                    </div>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 text-primary-foreground lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {adminNavItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={isMobile ? () => setOpen(false) : undefined}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-primary-foreground/70 hover:bg-white/5 hover:text-primary-foreground'
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User info (hidden if mobile, will be in header or mobile menu) */}
            {!isMobile && (
                <div className="border-t border-primary-foreground/10 p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-foreground truncate">
                                Administrateur
                            </p>
                            <p className="text-xs text-primary-foreground/60 truncate">
                                admin@shaolin-senegal.sn
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-primary hidden lg:block">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                            onClick={() => setOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -256 }}
                            animate={{ x: 0 }}
                            exit={{ x: -256 }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed left-0 top-0 z-50 h-screen w-64 bg-primary lg:hidden"
                        >
                            <SidebarContent isMobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
