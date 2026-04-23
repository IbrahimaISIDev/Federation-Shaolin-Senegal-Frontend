import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, User, Share2 } from 'lucide-react';

// Mock news data (same as in parent page)
const mockNews = [
    {
        id: '1',
        title: 'Championnat National 2024 : Les inscriptions sont ouvertes',
        content: `
      Le Championnat National de Wushu 2024 se tiendra les 15 et 16 mars au Stade Iba Mar Diop de Dakar. 
      Cet événement majeur rassemblera les meilleurs pratiquants du pays dans les disciplines Taolu (formes) et Sanda (combat).
      
      Les inscriptions sont officiellement ouvertes pour tous les clubs affiliés. Les athlètes souhaitant participer doivent se rapprocher de leurs dirigeants de club respectifs pour soumettre leur candidature avant le 1er mars.
      
      Cette année, plusieurs catégories sont à l'honneur, notamment les catégories Junior, Senior et Vétéran. Une section spéciale pour le Tai Chi traditionnel sera également incluse dans le programme.
    `,
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
        content: `
      La Fédération Shaolin Sénégal est honorée d'accueillir Maître Zhang Wei pour un stage exceptionnel de Tai Chi Chuan et Qi Gong traditionnel. 
      Le stage se déroulera du 20 au 25 février au centre national d'entraînement.
      
      Maître Zhang Wei, expert de renommée mondiale, partagera ses connaissances sur les principes fondamentaux du mouvement interne et de la respiration. 
      Ce stage est ouvert à tous les niveaux, des débutants aux pratiquants avancés.
    `,
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
        content: `
      L'expansion de notre fédération se poursuit avec l'affiliation officielle d'un nouveau club à Ziguinchor : "Le Dragon du Sud". 
      Dirigé par Maître Omar Sy, ce club propose des cours de Kung Fu Shaolin pour enfants et adultes.
      
      Cette nouvelle affiliation renforce notre présence dans la région de la Casamance et offre plus d'opportunités aux jeunes talents locaux de rejoindre le circuit national officiel.
    `,
        excerpt: 'Nous souhaitons la bienvenue au club "Dragon du Sud" qui rejoint la fédération ce mois-ci.',
        category: 'club',
        author: 'Admin FSS',
        date: '2024-02-05',
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

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const news = mockNews.find((n) => n.id === id);
    return {
        title: news ? news.title : 'Actualité',
        description: news ? news.excerpt : 'Détail de l\'actualité',
    };
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const news = mockNews.find((n) => n.id === id);

    if (!news) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Header / Hero */}
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
                            <Badge variant={categoryLabels[news.category]?.variant || 'default'}>
                                {categoryLabels[news.category]?.label || news.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(news.date)}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{news.author}</p>
                                    <p className="text-xs text-muted-foreground">Fédération Shaolin Sénégal</p>
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
                        <div className="aspect-video bg-muted rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                            <span className="text-9xl opacity-10">龍</span>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {news.content ? (
                                news.content.split('\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4 text-foreground/80 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))
                            ) : (
                                <p>{news.excerpt}</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <Card className="border-none shadow-sm bg-muted/30">
                            <CardContent className="p-6">
                                <h3 className="font-bold mb-4">À propos de cet événement</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Pour plus d'informations ou pour toute question relative à cet article, veuillez nous contacter directement.
                                </p>
                                <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                                    <Link href="/contact">Nous contacter</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="font-bold">Actualités récentes</h3>
                            {mockNews.filter(n => n.id !== news.id).slice(0, 3).map(n => (
                                <Link key={n.id} href={`/actualites/${n.id}`} className="block group">
                                    <p className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">
                                        {n.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{formatDate(n.date)}</p>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
