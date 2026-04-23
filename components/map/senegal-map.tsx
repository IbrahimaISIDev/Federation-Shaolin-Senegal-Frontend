'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Users, MapPin, Building2 } from 'lucide-react';
import { SENEGAL_REGIONS, type RegionData } from '@/lib/data/senegal-regions';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapLoadingState /> }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

function MapLoadingState() {
  return (
    <div className="flex h-[500px] items-center justify-center rounded-lg bg-secondary/50">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  );
}

interface RegionInfoCardProps {
  region: RegionData | null;
}

function RegionInfoCard({ region }: RegionInfoCardProps) {
  if (!region) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sélectionnez une région</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cliquez sur une région de la carte pour voir les détails des clubs et membres.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-accent/20 bg-gradient-to-br from-card to-secondary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{region.name}</CardTitle>
          <Badge variant="secondary" className="font-mono">
            {region.code}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{region.clubCount}</p>
              <p className="text-xs text-muted-foreground">Clubs</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-accent/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{region.memberCount}</p>
              <p className="text-xs text-muted-foreground">Membres</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {region.coordinates[0].toFixed(4)}°N, {Math.abs(region.coordinates[1]).toFixed(4)}°W
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SenegalMapProps {
  className?: string;
  showLegend?: boolean;
}

export function SenegalMap({ className, showLegend = true }: SenegalMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Fix for Leaflet default marker icons in Next.js
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const totalStats = useMemo(() => ({
    clubs: SENEGAL_REGIONS.reduce((acc, r) => acc + r.clubCount, 0),
    members: SENEGAL_REGIONS.reduce((acc, r) => acc + r.memberCount, 0),
  }), []);

  const getRegionStyle = useCallback((regionId: string) => {
    const isSelected = selectedRegion?.id === regionId;
    const isHovered = hoveredRegion === regionId;

    return {
      fillColor: isSelected ? '#FF6B35' : isHovered ? '#3d5a80' : '#1E3A5F',
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#FF6B35' : '#ffffff',
      fillOpacity: isSelected ? 0.7 : isHovered ? 0.6 : 0.5,
    };
  }, [selectedRegion, hoveredRegion]);

  const handleRegionClick = useCallback((regionId: string) => {
    const region = SENEGAL_REGIONS.find(r => r.id === regionId);
    setSelectedRegion(prev => prev?.id === regionId ? null : region || null);
  }, []);

  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
          <MapContainer
            center={[14.4974, -14.4524]}
            zoom={6}
            scrollWheelZoom={true}
            className="h-[500px] w-full"
            style={{ background: '#e8f4f8' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {SENEGAL_REGIONS.map((region) => (
              <Marker
                key={region.id}
                position={region.coordinates}
                eventHandlers={{
                  click: () => handleRegionClick(region.id),
                  mouseover: () => setHoveredRegion(region.id),
                  mouseout: () => setHoveredRegion(null),
                }}
              >
                <Popup>
                  <div className="min-w-[180px] p-1">
                    <h3 className="mb-2 font-semibold text-primary">{region.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center justify-between">
                        <span className="text-muted-foreground">Clubs:</span>
                        <span className="font-medium">{region.clubCount}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-muted-foreground">Membres:</span>
                        <span className="font-medium">{region.memberCount}</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="flex flex-col gap-4">
          <RegionInfoCard region={selectedRegion} />

          {showLegend && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Statistiques nationales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total des clubs</span>
                  <span className="font-semibold text-primary">{totalStats.clubs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total des membres</span>
                  <span className="font-semibold text-accent">{totalStats.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Régions couvertes</span>
                  <span className="font-semibold">{SENEGAL_REGIONS.length}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default SenegalMap;
