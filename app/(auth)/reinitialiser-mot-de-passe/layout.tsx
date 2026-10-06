import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: 'Nouveau mot de passe',
  description: 'Choisissez un nouveau mot de passe.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
