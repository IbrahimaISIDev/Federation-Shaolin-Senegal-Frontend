import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { NewsletterForm } from '@/components/shared/newsletter-form';
import { SOCIAL_LINKS, CONTACT_INFO } from '@/lib/constants';

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
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.6'%3E%3Crect x='5' y='5' width='50' height='50'/%3E%3Crect x='15' y='15' width='30' height='30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Newsletter Band */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="mb-1 font-serif text-lg font-semibold text-white">
                Restez informé des actualités
              </h3>
              <p className="text-sm text-white/60">
                Compétitions, événements, nouvelles de la fédération — directement dans votre boîte mail.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Footer logo */}
            <div className="mb-5 flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-accent/30">
                <Image
                  src="/images/logo-adss.jpeg"
                  alt="Logo ADSS"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div>
                <div className="font-bold text-white">Disciples Shaolin Si Sénégal</div>
                <div className="text-xs text-accent/80">ADSS · 少林寺</div>
              </div>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/60">
              L&apos;Association Disciples Shaolin Si Sénégal (ADSS) promeut et développe
              le Shaolin authentique transmis par le Temple Shaolin de Chine,
              reconnue par le Ministère de l&apos;Intérieur.
            </p>

            {/* Social Links */}
            <div className="flex gap-2.5">
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                    aria-label={`Suivez-nous sur ${key}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-accent/80">
              La Fédération
            </h3>
            <ul className="space-y-3">
              {footerLinks.federation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-accent"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-accent/80">
              Membres
            </h3>
            <ul className="space-y-3">
              {footerLinks.members.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-accent"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-accent/80">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/55">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/50" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent/50" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2.5 text-sm text-white/55 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent/50" />
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/40 md:flex-row">
          <p>&copy; {currentYear} Association Disciples Shaolin Si Sénégal (ADSS). Tous droits réservés.</p>
          <div className="flex items-center gap-1 font-serif text-base text-accent/30">
            少林拳
          </div>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="transition-colors hover:text-accent/70">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-accent/70">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
