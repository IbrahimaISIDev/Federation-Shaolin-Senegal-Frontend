'use client';

import Link from 'next/link';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NewMemberPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/membres"><ArrowLeft className="w-4 h-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Nouveau membre</h1>
                    <p className="text-muted-foreground">Comment un membre rejoint l&apos;association.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                        <p className="font-medium text-foreground">
                            Les membres ne sont pas créés directement depuis l&apos;admin.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Un compte membre est créé automatiquement lorsqu&apos;une demande
                            d&apos;affiliation est soumise, payée puis approuvée. Pour ajouter
                            quelqu&apos;un, dirige-le vers le formulaire d&apos;affiliation, ou
                            gère les demandes déjà soumises depuis la page Affiliations.
                        </p>
                    </div>
                    <Button asChild className="gap-2 bg-accent hover:bg-accent/90">
                        <Link href="/admin/affiliations">
                            <ClipboardList className="w-4 h-4" /> Voir les demandes d&apos;affiliation
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
