import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Trophy, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compétitions',
  description: 'Calendrier des compétitions de la Fédération Shaolin Sénégal : championnats, tournois et rencontres inter-clubs.',
};

// Mock competitions data
const mockCompetitions = {
  upcoming: [
    {
      id: '1',
      title: 'Championnat National de Wushu 2024',
      type: 'national',
      date: '2024-03-15',
      endDate: '2024-03-16',
      location: 'Stade Iba Mar Diop, Dakar',
      categories: ['Taolu', 'Sanda', 'Tai Chi'],
      registrationDeadline: '2024-03-01',
      participants: 120,
      maxParticipants: 200,
      status: 'inscriptions_ouvertes',
    },
    {
      id: '2',
      title: 'Tournoi Inter-Clubs Région Dakar',
      type: 'regional',
      date: '2024-04-20',
      endDate: '2024-04-20',
      location: 'Complexe Sportif Léopold Sédar Senghor',
      categories: ['Taolu Junior', 'Taolu Senior', 'Combat'],
      registrationDeadline: '2024-04-10',
      participants: 45,
      maxParticipants: 100,
      status: 'inscriptions_ouvertes',
    },
    {
      id: '3',
      title: 'Coupe de la Fédération',
      type: 'national',
      date: '2024-06-08',
      endDate: '2024-06-09',
      location: 'Dakar Arena',
      categories: ['Toutes catégories'],
      registrationDeadline: '2024-05-25',
      participants: 0,
      maxParticipants: 300,
      status: 'a_venir',
    },
  ],
  past: [
    {
      id: '4',
      title: 'Tournoi Inter-Clubs Saint-Louis',
      type: 'regional',
      date: '2024-01-20',
      location: 'Gymnase Municipal de Saint-Louis',
      categories: ['Taolu', 'Sanda'],
      participants: 85,
      winner: 'Dragon de Feu Saint-Louis',
    },
    {
      id: '5',
      title: 'Championnat National 2023',
      type: 'national',
      date: '2023-11-25',
      location: 'Stade Iba Mar Diop, Dakar',
      categories: ['Toutes catégories'],
      participants: 180,
      winner: 'Temple Shaolin Dakar',
    },
  ],
};

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  inscriptions_ouvertes: { label: 'Inscriptions ouvertes', variant: 'default' },
  a_venir: { label: 'À venir', variant: 'secondary' },
  complet: { label: 'Complet', variant: 'destructive' },
  termine: { label: 'Terminé', variant: 'outline' },
};

const typeLabels: Record<string, string> = {
  national: 'National',
  regional: 'Régional',
  international: 'International',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  if (!endDate || startDate === endDate) return start;
  
  const end = new Date(endDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
  });
  return `${new Date(startDate).getDate()} - ${end} ${new Date(endDate).getFullYear()}`;
}

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Compétitions
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Participez aux compétitions officielles de la Fédération et mesurez-vous aux meilleurs pratiquants.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">12</p>
              <p className="text-sm text-muted-foreground">Compétitions / an</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">500+</p>
              <p className="text-sm text-muted-foreground">Participants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">14</p>
              <p className="text-sm text-muted-foreground">Régions couvertes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">25</p>
              <p className="text-sm text-muted-foreground">Clubs participants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="w-4 h-4" />
                À venir
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <Trophy className="w-4 h-4" />
                Passées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {mockCompetitions.upcoming.map((comp) => (
                <Card key={comp.id} className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Date Badge */}
                    <div className="bg-primary text-primary-foreground p-6 lg:w-48 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">
                        {new Date(comp.date).getDate()}
                      </span>
                      <span className="text-sm uppercase">
                        {new Date(comp.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                      <span className="text-sm opacity-80">
                        {new Date(comp.date).getFullYear()}
                      </span>
                    </div>

                    {/* Content */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{typeLabels[comp.type]}</Badge>
                            <Badge variant={statusLabels[comp.status]?.variant || 'default'}>
                              {statusLabels[comp.status]?.label || comp.status}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-foreground">
                            {comp.title}
                          </h3>
                        </div>
                        {comp.status === 'inscriptions_ouvertes' && (
                          <Button className="bg-accent hover:bg-accent/90 gap-2" asChild>
                            <Link href={`/competitions/${comp.id}/inscription`}>
                              S&apos;inscrire
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          {formatDateRange(comp.date, comp.endDate)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          {comp.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4 text-primary" />
                          {comp.participants} / {comp.maxParticipants} participants
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          Inscriptions jusqu&apos;au {formatDate(comp.registrationDeadline)}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {comp.categories.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {mockCompetitions.past.map((comp) => (
                <Card key={comp.id} className="overflow-hidden opacity-80">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{typeLabels[comp.type]}</Badge>
                      <Badge variant="outline">Terminé</Badge>
                    </div>
                    <CardTitle className="text-lg">{comp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(comp.date)}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {comp.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {comp.participants} participants
                      </div>
                    </div>
                    {comp.winner && (
                      <div className="mt-4 p-3 bg-accent/10 rounded-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-accent" />
                        <span className="font-medium">Vainqueur : {comp.winner}</span>
                      </div>
                    )}
                    <Button variant="link" className="mt-4 p-0 text-accent" asChild>
                      <Link href={`/competitions/${comp.id}/resultats`}>
                        Voir les résultats
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Prêt à participer ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Pour participer aux compétitions officielles, vous devez être membre de la Fédération 
            et posséder une licence valide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/affiliation">Devenir membre</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
