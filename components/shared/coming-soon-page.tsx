import Link from 'next/link';
import { Construction, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT_INFO } from '@/lib/constants';

interface ComingSoonPageProps {
    title: string;
    description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
    return (
        <main className="min-h-screen bg-background">
            <section className="bg-primary py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{title}</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">{description}</p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 text-center max-w-lg">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Construction className="w-8 h-8 text-accent" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Page en préparation</h2>
                    <p className="text-muted-foreground mb-8">
                        Cette page n&apos;est pas encore disponible. Pour toute question en attendant, contacte-nous directement.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/"><ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil</Link>
                        </Button>
                        <Button asChild className="gap-2 bg-accent hover:bg-accent/90">
                            <a href={`mailto:${CONTACT_INFO.email}`}><Mail className="w-4 h-4" /> Nous contacter</a>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
