import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: 'Vérification de licence',
  description: "Vérifiez la validité d'une licence ADSS à partir de son QR code.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
