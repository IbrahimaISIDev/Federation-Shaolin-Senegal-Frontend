'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, User, Loader2, Newspaper } from 'lucide-react';
import { actualitesApi, type Actualite } from '@/lib/api';

const PAGE_SIZE = 9;

const categoryLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  competition: { label: 'Compétition', variant: 'default' },
  evenement: { label: 'Événement', variant: 'secondary' },
  club: { label: 'Club', variant: 'outline' },
  formation: { label: 'Formation', variant: 'secondary' },
  federation: { label: 'Fédération', variant: 'default' },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function extractText(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '');
}

export default function NewsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['public', 'actualites', { page }],
    queryFn: () => actualitesApi.list({ page, limit: PAGE_SIZE }),
    staleTime: 60 * 1000,
  });

  const newsList: Actualite[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const featuredNews = page === 1 ? newsList.slice(0, 1) : [];
  const regularNews = page === 1 ? newsList.slice(1) : newsList;

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

      {isLoading ? (
        <div className="container mx-auto px-4 py-20 flex justify-center items-center gap-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" /> Chargement des articles...
        </div>
      ) : newsList.length === 0 ? (
        <div className="container mx-auto px-4 py-20 text-center">
          <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Aucun article publié</h3>
          <p className="text-muted-foreground">Il n&apos;y a pas encore d&apos;actualités disponibles.</p>
        </div>
      ) : (
        <>
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">À la une</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredNews.map((news) => (
                    <Card key={news.id} className="overflow-hidden group hover:shadow-lg transition-shadow lg:col-span-2">
                      <div className="aspect-video lg:aspect-[21/9] bg-muted relative">
                        {news.imageUrl ? (
                          <img src={news.imageUrl} alt={news.titre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-6xl opacity-30">龍</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 lg:p-8">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="default" className="bg-primary hover:bg-primary/90">À la une</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                          {news.titre}
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3 lg:line-clamp-4 text-base">
                          {extractText(news.contenu)}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <User className="w-4 h-4" /> Secrétariat FSS
                          </span>
                          <Button className="gap-2 shrink-0 group/btn" asChild>
                            <Link href={`/actualites/${news.slug}`}>
                              Lire la suite
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
          {regularNews.length > 0 && (
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {page === 1 ? 'Récemment' : `Articles (page ${page})`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularNews.map((news) => (
                    <Card key={news.id} className="group hover:shadow-lg transition-shadow flex flex-col">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {news.imageUrl ? (
                          <img src={news.imageUrl} alt={news.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <span className="text-5xl opacity-20">龍</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium bg-background px-2 py-1 rounded-md border shadow-sm">
                            <Calendar className="w-3 h-3" />
                            {formatDate(news.publishedAt)}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 text-lg">
                          {news.titre}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                          {extractText(news.contenu)}
                        </p>
                        <div className="mt-auto border-t pt-4">
                          <Button variant="ghost" className="w-full justify-between group/btn text-muted-foreground hover:text-accent hover:bg-accent/10 p-0 h-auto font-medium" asChild>
                            <Link href={`/actualites/${news.slug}`}>
                              Lire l&apos;article
                              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Précédent
                    </Button>
                    <div className="flex gap-1 items-center">
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i}
                          variant={page === i + 1 ? 'default' : 'ghost'}
                          size="icon"
                          className={page === i + 1 ? 'w-10 h-10' : 'w-10 h-10'}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
