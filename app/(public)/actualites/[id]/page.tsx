import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, User, Share2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Actualite {
    id: number;
    titre: string;
    slug: string;
    contenu: string;
    imageUrl: string | null;
    publishedAt: string | null;
    createdAt: string;
}

async function getArticle(slug: string): Promise<Actualite | null> {
    try {
        const res = await fetch(`${API_URL}/actualites/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? null;
    } catch {
        return null;
    }
}

async function getRecentArticles(excludeSlug: string): Promise<Actualite[]> {
    try {
        const res = await fetch(`${API_URL}/actualites?page=1&limit=4`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data ?? []).filter((a: Actualite) => a.slug !== excludeSlug).slice(0, 3);
    } catch {
        return [];
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);
    return {
        title: article ? article.titre : 'Actualité',
        description: article ? article.contenu.replace(/<[^>]*>/g, '').slice(0, 160) : '',
    };
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const [article, recent] = await Promise.all([getArticle(id), getRecentArticles(id)]);

    if (!article) notFound();

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-12">
                    <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
                        <Link href="/actualites">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour aux actualités
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.publishedAt)}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {article.titre}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Secrétariat ADSS</p>
                                    <p className="text-xs text-muted-foreground">Association Disciples Shaolin Si Sénégal</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="w-4 h-4" />
                                Partager
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* Cover image */}
                        <div className="aspect-video bg-muted rounded-2xl mb-8 overflow-hidden relative">
                            {article.imageUrl ? (
                                <img src={article.imageUrl} alt={article.titre} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                                    <span className="absolute inset-0 flex items-center justify-center text-9xl opacity-10">龍</span>
                                </>
                            )}
                        </div>

                        {/* Article body — rendered as plain paragraphs (no dangerouslySetInnerHTML) */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {article.contenu
                                .replace(/<[^>]*>/g, '')
                                .split('\n')
                                .filter(Boolean)
                                .map((paragraph, i) => (
                                    <p key={i} className="mb-4 text-foreground/80 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <Card className="border-none shadow-sm bg-muted/30">
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-4">Plus d&apos;informations</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Pour toute question relative à cet article, contactez-nous directement.
                                </p>
                                <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                                    <Link href="/contact">Nous contacter</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {recent.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-bold">Actualités récentes</h3>
                                {recent.map((n) => (
                                    <Link key={n.id} href={`/actualites/${n.slug}`} className="block group">
                                        <p className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
                                            {n.titre}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{formatDate(n.publishedAt)}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}
