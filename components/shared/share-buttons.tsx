'use client';

import { useEffect, useState } from 'react';
import { Check, Link2, Share2 } from 'lucide-react';
import { SITE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88zm8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

/**
 * Partage d'une page : WhatsApp (canal principal au Sénégal), Facebook, copie
 * du lien. Sur mobile, le bouton « Partager » ouvre le menu natif du téléphone.
 */
export function ShareButtons({ path, title, className }: { path: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}${path}`;
  // Détecté après le montage : le rendu serveur et le premier rendu navigateur doivent être identiques
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => setCanNativeShare(typeof navigator.share === 'function'), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copiez le lien :', url);
    }
  };

  const nativeShare = () => navigator.share({ title, url }).catch(() => {});

  const btn = 'flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="mr-1 text-sm text-muted-foreground">Partager :</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btn, 'border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10')}
        aria-label="Partager sur WhatsApp"
      >
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(btn, 'border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/10')}
        aria-label="Partager sur Facebook"
      >
        <FacebookIcon className="h-4 w-4" /> Facebook
      </a>
      <button type="button" onClick={copy} className={cn(btn, 'text-muted-foreground hover:text-foreground')} aria-label="Copier le lien">
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
        {copied ? 'Lien copié' : 'Copier le lien'}
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={cn(btn, 'text-muted-foreground hover:text-foreground sm:hidden')} aria-label="Plus d'options de partage">
          <Share2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
