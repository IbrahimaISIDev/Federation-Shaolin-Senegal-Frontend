'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClubError({ reset }: { error: Error; reset: () => void }) {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
                <h2 className="text-2xl font-bold">Impossible de charger le club</h2>
                <p className="text-muted-foreground">Une erreur s&apos;est produite. Veuillez réessayer.</p>
                <div className="flex justify-center gap-3">
                    <Button onClick={reset}>Réessayer</Button>
                    <Button variant="outline" asChild>
                        <Link href="/clubs">Retour aux clubs</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
