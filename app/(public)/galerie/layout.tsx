import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: 'Galerie',
  description: "Photos des stages, délégations, compétitions et cérémonies de l'ADSS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
