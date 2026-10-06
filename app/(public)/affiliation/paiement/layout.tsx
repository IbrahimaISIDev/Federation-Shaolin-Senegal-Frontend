import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: "Paiement de l'affiliation",
  description: "Réglez les frais de votre demande d'affiliation.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
