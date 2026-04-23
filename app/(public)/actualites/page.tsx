import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Actualités',
  description: 'Toutes les actualités de la Fédération Shaolin Sénégal : événements, compétitions, stages et annonces.',
};

// Mock news data
const mockNews = [
  {
    id: '1',
    title: 'Championnat National 2024 : Les inscriptions sont ouvertes',
    excerpt: 'Le Championnat National de Wushu se tiendra les 15 et 16 mars à Dakar. Les inscriptions sont ouvertes pour toutes les catégories.',
    category: 'competition',
    author: 'Admin FSS',
    date: '2024-02-15',
    image: null,
    featured: true,
  },
  {
    id: '2',
    title: 'Stage international avec Maître Zhang Wei',
    excerpt: 'La Fédération accueille Maître Zhang Wei pour un stage exceptionnel de Tai Chi traditionnel du 20 au 25 février.',
    category: 'evenement',
    author: 'Admin FSS',
    date: '2024-02-10',
    image: null,
    featured: true,
  },
  {
    id: '3',
    title: 'Nouveau club affilié à Ziguinchor',
    excerpt: 'Nous souhaitons la bienvenue au club "Dragon du Sud" qui rejoint la fédération ce mois-ci.',
    category: 'club',
    author: 'Admin FSS',
    date: '2024-02-05',
    image: null,
    featured: false,
  },
  {
    id: '4',
    title: 'Résultats du Tournoi Inter-Clubs de Saint-Louis',
    excerpt: 'Retour sur le Tournoi Inter-Clubs qui s\'est tenu le week-end dernier avec plus de 150 participants.',
    category: 'competition',
    author: 'Admin FSS',
    date: '2024-01-28',
    image: null,
    featured: false,
  },
  {
    id: '5',
    title: 'Formation des arbitres : Session de mars',
    excerpt: 'Une nouvelle session de formation des arbitres est programmée pour le mois de mars. Candidatures ouvertes.',
    category: 'formation',
    author: 'Admin FSS',
    date: '2024-01-20',
    image: null,
    featured: false,
  },
  {
    id: '6',
    title: 'Assemblée Générale Annuelle 2024',
    excerpt: 'L\'Assemblée Générale de la Fédération se tiendra le 10 avril. Tous les clubs affiliés sont invités.',
    category: 'federation',
    author: 'Secrétariat FSS',
    date: '2024-01-15',
    image: null,
    featured: false,
  },
];

const categoryLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  competition: { label: 'Compétition', variant: 'default' },
  evenement: { label: 'Événement', variant: 'secondary' },
  club: { label: 'Club', variant: 'outline' },
  formation: { label: 'Formation', variant: 'secondary' },
  federation: { label: 'Fédération', variant: 'default' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function NewsPage() {
  const featuredNews = mockNews.filter((n) => n.featured);
  const regularNews = mockNews.filter((n) => !n.featured);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Actualités
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Restez informé des dernières nouvelles de la Fédération Shaolin Sénégal.
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">À la une</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((news) => (
                <Card key={news.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-6xl opacity-30">龍</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={categoryLabels[news.category]?.variant || 'default'}>
                        {categoryLabels[news.category]?.label || news.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(news.date)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {news.author}
                      </span>
                      <Button variant="link" className="gap-1 p-0 text-accent" asChild>
                        <Link href={`/actualites/${news.id}`}>
                          Lire la suite
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular News */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Toutes les actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((news) => (
              <Card key={news.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={categoryLabels[news.category]?.variant || 'default'}>
                      {categoryLabels[news.category]?.label || news.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(news.date)}
                    </span>
                    <Button variant="link" className="gap-1 p-0 text-accent h-auto" asChild>
                      <Link href={`/actualites/${news.id}`}>
                        Lire
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            <Button variant="outline" disabled>
              Précédent
            </Button>
            <Button variant="outline" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">
              Suivant
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
