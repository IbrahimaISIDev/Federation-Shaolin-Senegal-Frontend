import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: 'Clubs affiliés',
  description: "Trouvez un club de Shaolin affilié à l'ADSS près de chez vous, partout au Sénégal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
