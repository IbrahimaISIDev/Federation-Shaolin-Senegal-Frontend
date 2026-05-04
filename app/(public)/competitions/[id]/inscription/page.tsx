'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, ArrowLeft, CheckCircle2, ShieldCheck, Loader2, Trophy } from 'lucide-react';
import { competitionsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CompetitionInscriptionPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [done, setDone] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['competition', id],
        queryFn: () => competitionsApi.get(Number(id)),
        staleTime: 60 * 1000,
    });

    const comp = data?.data;
    const categories: string[] = Array.isArray(comp?.categories) ? comp.categories : [];

    const inscriptionMutation = useMutation({
        mutationFn: () => competitionsApi.inscrire(Number(id), selectedCategory || undefined),
        onSuccess: () => setDone(true),
        onError: (err: any) => {
            const msg = err?.response?.data?.message ?? 'Erreur lors de l\'inscription';
            toast.error(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push('/connexion');
            return;
        }
        inscriptionMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !comp) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4 px-4">
                    <h2 className="text-2xl font-bold">Compétition introuvable</h2>
                    <Button asChild variant="outline"><Link href="/competitions">Retour</Link></Button>
                </div>
            </main>
        );
    }

    if (done) {
        return (
            <main className="min-h-screen bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-6 p-8 max-w-md">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Inscription confirmée !</h2>
                    <p className="text-muted-foreground">
                        Vous êtes inscrit(e) à <strong>{comp.titre}</strong>.
                        Vous recevrez une confirmation prochainement.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button asChild className="bg-accent hover:bg-accent/90">
                            <Link href="/membre/competitions">Mes compétitions</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/competitions">Retour</Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-muted/30 pb-20">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
                    <Link href={`/competitions/${id}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à la compétition
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-background rounded-2xl p-6 shadow-sm border">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-accent text-accent-foreground">Inscriptions ouvertes</Badge>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">{comp.titre}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {formatDate(comp.dateDebut)}
                                </div>
                                {comp.lieu && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {comp.lieu}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Formulaire d&apos;inscription</CardTitle>
                                <CardDescription>Votre licence doit être active pour valider l&apos;inscription.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {categories.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Catégorie de participation</Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                                                        className={`rounded-lg border p-3 text-sm font-medium text-left transition-colors ${
                                                            selectedCategory === cat
                                                                ? 'border-primary bg-primary/10 text-primary'
                                                                : 'border-border hover:bg-muted/50'
                                                        }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes complémentaires (optionnel)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Informations médicales, spécificités, etc."
                                            rows={4}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl mb-6">
                                            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                            <p className="text-xs text-muted-foreground">
                                                En soumettant ce formulaire, vous confirmez l&apos;exactitude des informations
                                                et acceptez le règlement intérieur de la compétition.
                                            </p>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-accent hover:bg-accent/90 h-11 gap-2"
                                            disabled={inscriptionMutation.isPending}
                                        >
                                            {inscriptionMutation.isPending ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Inscription en cours...</>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    {isAuthenticated ? 'Confirmer mon inscription' : 'Se connecter pour s\'inscrire'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-primary text-primary-foreground border-none">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4">Informations importantes</h3>
                                <ul className="space-y-3 text-sm">
                                    {[
                                        'Licence ADSS valide obligatoire',
                                        'Certificat médical de moins de 3 mois',
                                        'Équipement réglementaire exigé',
                                    ].map((item) => (
                                        <li key={item} className="flex gap-2">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-2xl border bg-background flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">Date de la compétition</p>
                            <p className="text-xl font-bold">{formatDate(comp.dateDebut)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
