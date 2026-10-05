'use client';

import { useClubsMapData } from '@/lib/data/clubs-map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users } from 'lucide-react';

export function RegionsGrid() {
  const { regions } = useClubsMapData();
  // Régions triées par nombre de clubs puis de membres (données réelles)
  const sortedRegions = [...regions].sort(
    (a, b) => b.clubCount - a.clubCount || b.memberCount - a.memberCount
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedRegions.map((region, index) => (
        <Card
          key={region.id}
          className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-accent/30"
        >
          {index < 3 && region.clubCount > 0 && (
            <div className="absolute right-3 top-3">
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Top {index + 1}
              </Badge>
            </div>
          )}
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {region.code}
              </Badge>
              <h3 className="font-semibold">{region.name}</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{region.clubCount}</strong> clubs
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{region.memberCount}</strong> membres
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
