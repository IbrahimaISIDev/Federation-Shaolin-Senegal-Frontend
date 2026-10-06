import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: 'Actualités',
  description: "Les dernières nouvelles de l'Association Disciples Shaolin Si Sénégal : stages, compétitions, événements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
