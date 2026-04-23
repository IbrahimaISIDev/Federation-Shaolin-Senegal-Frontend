import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { SOCIAL_LINKS, CONTACT_INFO, PUBLIC_NAV_ITEMS } from '@/lib/constants';

const footerLinks = {
  federation: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Notre histoire', href: '/histoire' },
    { label: 'Équipe dirigeante', href: '/equipe' },
    { label: 'Règlements', href: '/reglements' },
  ],
  members: [
    { label: 'S\'affilier', href: '/affiliation' },
    { label: 'Renouveler ma licence', href: '/affiliation?type=renouvellement' },
    { label: 'Espace membre', href: '/membre' },
    { label: 'Trouver un club', href: '/carte' },
  ],
  resources: [
    { label: 'Actualités', href: '/actualites' },
    { label: 'Compétitions', href: '/competitions' },
    { label: 'Galerie', href: '/galerie' },
    { label: 'FAQ', href: '/faq' },
  ],
};

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8 text-accent-foreground"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L3 7h18L12 2z" fill="currentColor" />
                    <path d="M5 7v3h14V7" />
                    <path d="M12 7L4 11h16L12 7z" fill="currentColor" />
                    <path d="M6 11v3h12v-3" />
                    <path d="M12 11L5 15h14L12 11z" fill="currentColor" />
                    <path d="M7 15v7h10v-7" />
                    <path d="M10 18h4v4h-4z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">Fédération Shaolin</span>
                  <span className="text-sm text-primary-foreground/70">Sénégal</span>
                </div>
              </Link>
            </div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              La Fédération Shaolin Sénégal promeut et développe les arts martiaux chinois 
              à travers le pays. Rejoignez notre communauté de passionnés.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {Object.entries(SOCIAL_LINKS).map(([key, url]) => {
                if (key === 'whatsapp') return null;
                const Icon = socialIcons[key as keyof typeof socialIcons];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
                    aria-label={`Suivez-nous sur ${key}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              La Fédération
            </h3>
            <ul className="space-y-3">
              {footerLinks.federation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Membres
            </h3>
            <ul className="space-y-3">
              {footerLinks.members.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-primary-foreground/60 md:flex-row">
          <p>&copy; {currentYear} Fédération Shaolin Sénégal. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-accent">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-accent">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
