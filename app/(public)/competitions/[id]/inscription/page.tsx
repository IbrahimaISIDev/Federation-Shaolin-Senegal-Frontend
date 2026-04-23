import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

// Mock competitions data
const mockCompetitions = [
    {
        id: '1',
        title: 'Championnat National de Wushu 2024',
        type: 'national',
        date: '2024-03-15',
        location: 'Stade Iba Mar Diop, Dakar',
        categories: ['Taolu', 'Sanda', 'Tai Chi'],
        registrationDeadline: '2024-03-01',
        status: 'inscriptions_ouvertes',
    },
];

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const comp = mockCompetitions.find((c) => c.id === id);
    return {
        title: comp ? `Inscription - ${comp.title}` : 'Inscription Compétition',
        description: comp ? `Inscrivez-vous au ${comp.title}.` : 'Inscription à la compétition',
    };
}

export default async function CompetitionInscriptionPage({ params }: PageProps) {
    const { id } = await params;
    const comp = mockCompetitions.find((c) => c.id === id);

    if (!comp) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-muted/30 pb-20">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
                    <Link href="/competitions">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour aux compétitions
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Header Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-background rounded-2xl p-6 shadow-sm border">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="default" className="bg-accent text-accent-foreground">
                                    Inscriptions Ouvertes
                                </Badge>
                                <Badge variant="outline">{comp.type.toUpperCase()}</Badge>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{comp.title}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {new Date(comp.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {comp.location}
                                </div>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <Card className="border shadow-sm">
                            <CardHeader>
                                <CardTitle>Formulaire d&apos;inscription</CardTitle>
                                <CardDescription>
                                    Veuillez remplir les informations suivantes pour valider votre participation.
                                    Votre licence doit être valide.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="licence">Numéro de Licence</Label>
                                        <Input id="licence" placeholder="FSS-2024-XXXX" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="club">Club Affilié</Label>
                                        <Input id="club" placeholder="Votre club" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catégories de participation</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {comp.categories.map((cat) => (
                                            <div key={cat} className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                                <input type="checkbox" id={cat} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                <Label htmlFor={cat} className="text-sm font-medium cursor-pointer">{cat}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes complémentaires (optionnel)</Label>
                                    <textarea
                                        id="notes"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Informations médicales, spécificités, etc."
                                    />
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl mb-6">
                                        <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                                        <p className="text-xs text-muted-foreground">
                                            En soumettant ce formulaire, vous confirmez l&apos;exactitude des informations fournies et acceptez le règlement intérieur de la compétition.
                                        </p>
                                    </div>
                                    <Button className="w-full bg-accent hover:bg-accent/90 h-11">
                                        Confirmer mon inscription
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-primary text-primary-foreground border-none">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4">Informations Importantes</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                                        <span>Licence FSS 2024 obligatoire</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                                        <span>Certificat médical de moins de 3 mois</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                                        <span>Equipement réglementaire exigé</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-2xl border bg-background flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">Date limite</p>
                            <p className="text-xl font-bold text-rose-600">
                                {new Date(comp.registrationDeadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Aucune inscription ne sera acceptée après cette date.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
