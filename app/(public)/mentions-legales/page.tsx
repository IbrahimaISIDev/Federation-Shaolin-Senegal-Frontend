import { CONTACT_INFO } from '@/lib/constants';

export const metadata = { title: 'Mentions légales — ADSS Sénégal' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
        </div>
    );
}

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-background">
            <section className="bg-primary py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Mentions légales</h1>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                        Informations légales relatives à l&apos;éditeur et à l&apos;hébergement de ce site.
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-3xl space-y-10">
                    <p className="text-sm text-muted-foreground">Dernière mise à jour : 30 août 2026</p>

                    <Section title="Éditeur du site">
                        <p>
                            Le site shaolin-senegal.com est édité par l&apos;<strong>Association Disciples Shaolin Si Sénégal (ADSS)</strong>,
                            association sportive à but non lucratif reconnue par le Ministère de l&apos;Intérieur du Sénégal.
                        </p>
                        <p>
                            Siège social : {CONTACT_INFO.address}<br />
                            Téléphone : {CONTACT_INFO.phone}<br />
                            Email : {CONTACT_INFO.email}
                        </p>
                        <p>Directeur de la publication : Ousmane Ngom, Président de l&apos;ADSS.</p>
                    </Section>

                    <Section title="Hébergement">
                        <p>
                            Ce site est hébergé sur une infrastructure serveur dédiée. Les coordonnées complètes de
                            l&apos;hébergeur peuvent être communiquées sur simple demande à l&apos;adresse de contact
                            ci-dessus.
                        </p>
                    </Section>

                    <Section title="Propriété intellectuelle">
                        <p>
                            L&apos;ensemble des contenus présents sur ce site (textes, photographies, logos, mise en page)
                            est la propriété de l&apos;ADSS ou de ses partenaires, sauf mention contraire. Toute
                            reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite
                            préalable, est interdite.
                        </p>
                    </Section>

                    <Section title="Responsabilité">
                        <p>
                            L&apos;ADSS s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
                            diffusées sur ce site, sans garantie d&apos;exhaustivité. L&apos;ADSS ne saurait être tenue
                            responsable des erreurs ou omissions, ni d&apos;une indisponibilité temporaire du service.
                        </p>
                    </Section>

                    <Section title="Liens hypertextes">
                        <p>
                            Ce site peut contenir des liens vers des sites tiers (partenaires, réseaux sociaux).
                            L&apos;ADSS n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité
                            quant à leur contenu.
                        </p>
                    </Section>

                    <Section title="Droit applicable">
                        <p>
                            Les présentes mentions légales sont soumises au droit sénégalais. Tout litige relatif à
                            l&apos;utilisation de ce site relève de la compétence des juridictions sénégalaises.
                        </p>
                    </Section>

                    <p className="text-sm text-muted-foreground pt-4 border-t">
                        Voir aussi notre{' '}
                        <a href="/confidentialite" className="text-accent hover:underline">politique de confidentialité</a>.
                    </p>
                </div>
            </section>
        </main>
    );
}
