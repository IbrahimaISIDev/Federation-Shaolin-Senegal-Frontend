'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, User, LogOut, Phone, Mail, Clock,
  Facebook, Instagram, Youtube,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { PUBLIC_NAV_ITEMS, CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { settingsApi } from '@/lib/api/settings';

const topBarSocialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
} as const;
import { useAuthStore } from '@/lib/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
    staleTime: 5 * 60 * 1000,
  });
  const orgName = settingsData?.data.orgName || 'Association Disciples Shaolin Si Sénégal';
  const contactPhone = settingsData?.data.contactPhone || CONTACT_INFO.phone;
  const contactEmail = settingsData?.data.contactEmail || CONTACT_INFO.email;

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getDashboardLink = () => {
    if (!user) return '/membre';
    switch (user.role) {
      case 'ADMIN':
        return '/admin';
      case 'PRESIDENT_CLUB':
        return '/club';
      default:
        return '/membre';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Gold accent line */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Top info bar — desktop */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="hidden border-b border-primary/10 bg-primary text-primary-foreground/80 lg:block"
      >
        <div className="container mx-auto flex h-10 items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-accent">少林寺</span>
            <span className="font-medium tracking-wide text-white/85">
              {orgName}
            </span>
            <span className="hidden items-center gap-1.5 border-l border-white/15 pl-4 text-white/55 xl:flex">
              <Clock className="h-3 w-3" />
              {CONTACT_INFO.hours}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <Phone className="h-3 w-3" />
              {contactPhone}
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-accent"
            >
              <Mail className="h-3 w-3" />
              {contactEmail}
            </a>
            <div className="flex items-center gap-2.5 border-l border-white/15 pl-4">
              {Object.entries(topBarSocialIcons).map(([key, Icon]) => (
                <a
                  key={key}
                  href={SOCIAL_LINKS[key as keyof typeof SOCIAL_LINKS]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="text-white/55 transition-colors hover:text-accent"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top info bar — mobile (click-to-call only) */}
      <div className="border-b border-primary/10 bg-primary lg:hidden">
        <a
          href={`tel:${contactPhone}`}
          className="flex h-8 items-center justify-center gap-1.5 text-xs font-medium text-white/80 transition-colors active:text-accent"
        >
          <Phone className="h-3 w-3" />
          {contactPhone}
        </a>
      </div>

      {/* Main nav */}
      <div className="border-b border-border/60 bg-white/95 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-[72px]">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3.5 py-2 text-sm font-medium transition-colors',
                  isActiveLink(item.href)
                    ? 'text-primary'
                    : 'text-foreground/60 hover:text-primary'
                )}
              >
                {item.label}
                {isActiveLink(item.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hover:bg-secondary">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-32 truncate text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mon espace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-sm font-medium hover:bg-secondary">
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button
                  asChild
                  className="bg-accent text-sm font-semibold text-accent-foreground shadow-gold hover:bg-accent/90"
                >
                  <Link href="/affiliation">S&apos;affilier</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-b border-border bg-white shadow-lg lg:hidden"
          >
            <nav className="container mx-auto flex flex-col px-4 py-3">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    isActiveLink(item.href)
                      ? 'bg-secondary text-primary'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                {isAuthenticated ? (
                  <>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Mon espace
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href="/affiliation" onClick={() => setIsMobileMenuOpen(false)}>
                        S&apos;affilier maintenant
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
