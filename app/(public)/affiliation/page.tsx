import type { Metadata } from 'next';
import { Building2, User, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClubAffiliationForm } from '@/components/affiliation/ClubAffiliationForm';
import { MaitreAffiliationForm } from '@/components/affiliation/MaitreAffiliationForm';
import { MembreAffiliationForm } from '@/components/affiliation/MembreAffiliationForm';

export const metadata: Metadata = {
  title: 'Affiliation — ADSS Sénégal',
  description: 'Affiliez votre club ou rejoignez l\'ADSS en tant que Maître ou Membre/Disciple.',
};

export default function AffiliationPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Rejoindre l&apos;ADSS
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Association Disciples Shaolin Si Sénégal — Choisissez votre type d&apos;affiliation ci-dessous.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Tabs defaultValue="membre" className="space-y-8">
            <TabsList className="grid grid-cols-3 h-auto p-1 gap-1">
              <TabsTrigger value="membre" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Users className="w-5 h-5" />
                <span className="text-xs font-medium">Membre / Disciple</span>
              </TabsTrigger>
              <TabsTrigger value="maitre" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <User className="w-5 h-5" />
                <span className="text-xs font-medium">Maître</span>
              </TabsTrigger>
              <TabsTrigger value="club" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-medium">Club</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="membre">
              <div className="mb-6 bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
                <h2 className="font-semibold text-foreground mb-1">Affiliation Membre / Disciple</h2>
                <p className="text-sm text-muted-foreground">
                  Pour les pratiquants souhaitant s&apos;affilier à un club ADSS. Code généré : <code className="bg-muted px-1 rounded text-xs">003-YYYY-NNN</code>
                </p>
              </div>
              <MembreAffiliationForm />
            </TabsContent>

            <TabsContent value="maitre">
              <div className="mb-6 bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
                <h2 className="font-semibold text-foreground mb-1">Affiliation Maître</h2>
                <p className="text-sm text-muted-foreground">
                  Pour les maîtres et enseignants d&apos;arts martiaux Shaolin. Code généré : <code className="bg-muted px-1 rounded text-xs">002-YYYY-NNN</code>
                </p>
              </div>
              <MaitreAffiliationForm />
            </TabsContent>

            <TabsContent value="club">
              <div className="mb-6 bg-muted/50 rounded-lg p-4 border-l-4 border-accent">
                <h2 className="font-semibold text-foreground mb-1">Affiliation Club</h2>
                <p className="text-sm text-muted-foreground">
                  Pour affilier un nouveau club à l&apos;ADSS Sénégal. Code généré : <code className="bg-muted px-1 rounded text-xs">001-YYYY-NNN</code>
                </p>
              </div>
              <ClubAffiliationForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Avantages de l&apos;affiliation ADSS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: '🥋',
                title: 'Reconnaissance officielle',
                desc: 'Votre affiliation est reconnue par le Ministère de l\'Intérieur du Sénégal.',
              },
              {
                icon: '🏆',
                title: 'Accès aux compétitions',
                desc: 'Participez aux championnats nationaux et représentez le Sénégal à l\'international.',
              },
              {
                icon: '📜',
                title: 'Licence & QR Code',
                desc: 'Obtenez votre licence officielle avec QR Code vérifiable sur tout le territoire.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-card p-6 rounded-lg border text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
