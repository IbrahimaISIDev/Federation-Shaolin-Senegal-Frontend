import { CONTACT_INFO } from '@/lib/constants';

export const metadata = { title: 'Politique de confidentialité — ADSS Sénégal' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
        </div>
    );
}

export default function ConfidentialitePage() {
    return (
        <main className="min-h-screen bg-background">
            <section className="bg-primary py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Politique de confidentialité</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        Comment l&apos;ADSS collecte, utilise et protège tes données personnelles.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-3xl space-y-10">
                    <p className="text-sm text-muted-foreground">Dernière mise à jour : 30 août 2026</p>

                    <Section title="Données que nous collectons">
                        <p>Selon ton usage du site, nous collectons :</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>À l&apos;affiliation ou l&apos;inscription : nom, prénom, date de naissance, sexe, nationalité, adresse, téléphone, email, photo, et informations spécifiques au type d&apos;affiliation (club, maître, membre).</li>
                            <li>Pour la licence : grade, discipline, club de rattachement, historique de licence.</li>
                            <li>Pour un paiement manuel : référence de transaction et preuve de paiement (photo/capture) que tu soumets toi-même.</li>
                            <li>Via le formulaire de contact : nom, email, téléphone (facultatif), message.</li>
                            <li>Techniques : adresse IP et données de navigation anonymisées, via Vercel Analytics (sans cookie de suivi publicitaire).</li>
                        </ul>
                    </Section>

                    <Section title="Pourquoi nous les utilisons">
                        <p>
                            Ces données servent à gérer ton affiliation et ta licence, produire ta carte de licence
                            et son QR code de vérification, t&apos;informer par email (confirmation, expiration de
                            licence, résultats de compétition), et administrer les clubs et compétitions de
                            l&apos;association. Nous ne vendons ni ne partageons tes données à des tiers à des fins
                            commerciales.
                        </p>
                    </Section>

                    <Section title="Conservation">
                        <p>
                            Tes données sont conservées pendant la durée de ton affiliation à l&apos;ADSS, puis
                            archivées pour l&apos;historique des licences et résultats de compétition. Tu peux
                            demander la suppression de ton compte à tout moment (sous réserve des obligations
                            légales de conservation de certains documents).
                        </p>
                    </Section>

                    <Section title="Tes droits">
                        <p>
                            Conformément à la loi sénégalaise sur la protection des données à caractère personnel,
                            tu disposes d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de
                            suppression de tes données. Pour l&apos;exercer, contacte-nous à{' '}
                            <a href={`mailto:${CONTACT_INFO.email}`} className="text-accent hover:underline">{CONTACT_INFO.email}</a>.
                            Tu peux aussi saisir la Commission de protection des Données personnelles (CDP) du Sénégal.
                        </p>
                    </Section>

                    <Section title="Sécurité">
                        <p>
                            Ton mot de passe est stocké de façon chiffrée. La connexion à ton espace utilise un
                            jeton d&apos;accès temporaire et un cookie sécurisé propre à ton navigateur — nous
                            n&apos;utilisons pas de cookies publicitaires ou de suivi tiers.
                        </p>
                    </Section>

                    <p className="text-sm text-muted-foreground pt-4 border-t">
                        Voir aussi nos{' '}
                        <a href="/mentions-legales" className="text-accent hover:underline">mentions légales</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
