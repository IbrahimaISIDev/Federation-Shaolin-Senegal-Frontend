import type { Metadata } from 'next';

// Titre et description de la page (rendue côté navigateur, elle ne peut pas
// les déclarer elle-même).
export const metadata: Metadata = {
  title: "L'Association",
  description: "Histoire, bureau, missions et présence nationale de l'Association Disciples Shaolin Si Sénégal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
