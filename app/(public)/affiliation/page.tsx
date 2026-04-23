import type { Metadata } from 'next';
import { AffiliationForm } from '@/components/affiliation/affiliation-form';

export const metadata: Metadata = {
  title: 'Affiliation',
  description: 'Rejoignez la Fédération Shaolin Sénégal. Remplissez le formulaire d\'affiliation pour devenir membre et obtenir votre licence.',
};

export default function AffiliationPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Rejoignez notre communauté
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Devenez membre officiel de la Fédération Shaolin Sénégal et bénéficiez 
            d&apos;une licence reconnue, d&apos;assurances et d&apos;accès aux compétitions.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AffiliationForm />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Avantages de l&apos;affiliation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Assurance incluse</h3>
              <p className="text-sm text-muted-foreground">
                Couverture responsabilité civile et accidents corporels pendant vos activités.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Compétitions officielles</h3>
              <p className="text-sm text-muted-foreground">
                Participez aux championnats régionaux, nationaux et internationaux.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Communauté active</h3>
              <p className="text-sm text-muted-foreground">
                Rejoignez un réseau de passionnés et partagez votre passion pour les arts martiaux.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
