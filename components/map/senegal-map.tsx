'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, X, MapPin, Users, Building2, Phone, Mail, ChevronRight, RotateCcw } from 'lucide-react';
import { SENEGAL_REGIONS, SENEGAL_CENTER, type RegionData } from '@/lib/data/senegal-regions';

// Mapping GADM NAME_1 → our internal region id
const GADM_NAME_TO_ID: Record<string, string> = {
  'Dakar': 'dakar', 'Diourbel': 'diourbel', 'Fatick': 'fatick',
  'Kaffrine': 'kaffrine', 'Kaolack': 'kaolack', 'Kédougou': 'kedougou',
  'Kolda': 'kolda', 'Louga': 'louga', 'Matam': 'matam',
  'Saint-Louis': 'saint-louis', 'Sédhiou': 'sedhiou', 'Tambacounda': 'tambacounda',
  'Thiès': 'thies', 'Ziguinchor': 'ziguinchor',
};
import { MOCK_CLUBS, searchClubs, getClubsByRegion, type Club } from '@/lib/data/mock-clubs';
import type { Map as LeafletMap } from 'leaflet';

// ─── Dynamic imports (no SSR) ─────────────────────────────────────────────────

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then((m) => m.TileLayer),    { ssr: false });
const GeoJSONLayer = dynamic(() => import('react-leaflet').then((m) => m.GeoJSON),      { ssr: false });
const Marker       = dynamic(() => import('react-leaflet').then((m) => m.Marker),       { ssr: false });
const Tooltip      = dynamic(() => import('react-leaflet').then((m) => m.Tooltip),      { ssr: false });

// ─── Loading state ────────────────────────────────────────────────────────────

function MapLoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0d1b2e]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
        <p className="text-sm text-white/50">Chargement de la carte…</p>
      </div>
    </div>
  );
}

// ─── Stats overlay ────────────────────────────────────────────────────────────

function StatsOverlay({ total }: { total: { clubs: number; members: number } }) {
  return (
    <div className="absolute left-3 top-3 z-[1000] flex gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-primary/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-lg">
        <Building2 className="h-3 w-3 text-accent" />
        <span className="font-bold text-accent">{total.clubs}</span> clubs
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-primary/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm shadow-lg">
        <Users className="h-3 w-3 text-accent" />
        <span className="font-bold text-accent">{total.members}</span> membres
      </div>
    </div>
  );
}

// ─── Club modal ───────────────────────────────────────────────────────────────

function ClubModal({ club, onClose }: { club: Club; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-primary px-6 py-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/30">
              <span className="font-serif text-xl font-bold text-accent">功</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">{club.name}</h3>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
                {club.regionCode} · {club.regionName}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <div className="text-2xl font-bold text-primary">{club.students}</div>
              <div className="text-xs text-muted-foreground">élèves</div>
            </div>
            <div className="rounded-xl bg-accent/8 p-4 text-center">
              <div className="truncate text-sm font-semibold text-foreground">{club.master}</div>
              <div className="text-xs text-muted-foreground">Maître</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disciplines</div>
            <div className="flex flex-wrap gap-1.5">
              {club.disciplines.map((d) => (
                <span key={d} className="rounded-full border border-accent/25 bg-accent/8 px-3 py-0.5 text-xs font-medium text-accent">{d}</span>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground">{club.address}</span>
            </div>
            <a href={`tel:${club.phone}`} className="flex items-center gap-2 text-sm transition-colors hover:text-accent">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{club.phone}</span>
            </a>
            <a href={`mailto:${club.email}`} className="flex items-center gap-2 text-sm transition-colors hover:text-accent">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{club.email}</span>
            </a>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Voir les membres
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Side panel ───────────────────────────────────────────────────────────────

function RegionPanel({
  region,
  clubs,
  filterType,
  onFilterType,
  onClubClick,
  onClose,
}: {
  region: RegionData | null;
  clubs: Club[];
  filterType: 'clubs' | 'membres' | 'tous';
  onFilterType: (t: 'clubs' | 'membres' | 'tous') => void;
  onClubClick: (c: Club) => void;
  onClose: () => void;
}) {
  if (!region) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <MapPin className="h-7 w-7 text-accent/60" />
        </div>
        <p className="font-semibold text-foreground">Cliquez sur une région</p>
        <p className="text-sm text-muted-foreground">Les clubs de la région s&apos;afficheront ici.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative shrink-0 bg-primary px-5 py-4">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="pr-8">
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent/20 px-1.5 py-0.5 font-mono text-xs font-bold text-accent">{region.code}</span>
            <h3 className="font-serif font-bold text-white">{region.name}</h3>
          </div>
          <div className="mt-2 flex gap-3 text-xs text-white/60">
            <span><strong className="text-accent">{region.clubCount}</strong> clubs</span>
            <span><strong className="text-accent">{region.memberCount}</strong> membres</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-1.5 border-b border-border/60 px-4 py-3">
        {(['tous', 'clubs', 'membres'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onFilterType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${filterType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {clubs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun club dans cette région.</p>
        ) : (
          clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => onClubClick(club)}
              className="group w-full rounded-xl border border-border/60 bg-card p-4 text-left transition-all hover:border-accent/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">{club.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Maître {club.master}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {club.disciplines.map((d) => (
                  <span key={d} className="rounded-full bg-accent/8 px-2 py-0.5 text-[10px] font-medium text-accent">{d}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{club.students} élèves</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({ onResult }: { onResult: (club: Club) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Club[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (v: string) => {
    setQuery(v);
    if (timer.current) clearTimeout(timer.current);
    if (v.length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(() => {
      const r = searchClubs(v);
      setResults(r.slice(0, 6));
      setOpen(r.length > 0);
    }, 300);
  };

  const pick = (club: Club) => {
    setQuery(club.name);
    setOpen(false);
    onResult(club);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-primary/90 px-3 py-2 shadow-lg backdrop-blur-sm">
        <Search className="h-4 w-4 shrink-0 text-white/50" />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Rechercher un club, maître, région…"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }}>
            <X className="h-4 w-4 text-white/40 hover:text-white/70" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-[1001] mt-1 overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl">
          {results.map((club) => (
            <button
              key={club.id}
              onClick={() => pick(club)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/60"
            >
              <MapPin className="h-4 w-4 shrink-0 text-accent/70" />
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{club.name}</div>
                <div className="text-xs text-muted-foreground">{club.regionName}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inner map (needs useMap hook — only works inside MapContainer) ────────────

function MapInner({
  hoveredRegion,
  selectedRegion,
  visibleClubs,
  geoJson,
  onRegionHover,
  onRegionClick,
  onClubClick,
  mapRef,
}: {
  hoveredRegion: string | null;
  selectedRegion: RegionData | null;
  visibleClubs: Club[];
  geoJson: GeoJSON.FeatureCollection | null;
  onRegionHover: (id: string | null) => void;
  onRegionClick: (id: string) => void;
  onClubClick: (c: Club) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
}) {
  const { useMap } = require('react-leaflet') as typeof import('react-leaflet');
  const map = useMap();
  const [clubIcon, setClubIcon] = useState<import('leaflet').DivIcon | null>(null);

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  useEffect(() => {
    import('leaflet').then((L) => {
      // @ts-expect-error leaflet internal
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setClubIcon(L.divIcon({
        className: '',
        html: `<div style="width:26px;height:26px;background:#c49a1a;border:2px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:10px;color:#0d1b2e;font-weight:900;line-height:1">功</span></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        popupAnchor: [0, -28],
      }));
    });
  }, []);

  const resolveId = (feature: GeoJSON.Feature | undefined) =>
    GADM_NAME_TO_ID[feature?.properties?.NAME_1 as string] ?? '';

  const styleFeature = useCallback((feature: GeoJSON.Feature | undefined) => {
    const id = resolveId(feature);
    const isSelected = selectedRegion?.id === id;
    const isHovered = hoveredRegion === id;
    return {
      fillColor: isSelected ? '#c49a1a' : isHovered ? '#1A5276' : '#1E3A5F',
      weight: isSelected ? 2.5 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#c49a1a' : '#ffffff',
      fillOpacity: isSelected ? 0.55 : isHovered ? 0.40 : 0.28,
    };
  }, [selectedRegion, hoveredRegion]);

  const onEachFeature = useCallback((feature: GeoJSON.Feature, layer: import('leaflet').Layer) => {
    const id = resolveId(feature);
    const region = SENEGAL_REGIONS.find((r) => r.id === id);
    if (!region) return;

    (layer as import('leaflet').Path).bindTooltip(
      `<strong>${region.name}</strong><br/><span style="color:#c49a1a">${region.clubCount} clubs · ${region.memberCount} membres</span>`,
      { sticky: true, opacity: 0.95, className: 'leaflet-region-tooltip' }
    );

    layer.on({
      mouseover: () => onRegionHover(id),
      mouseout:  () => onRegionHover(null),
      click:     () => onRegionClick(id),
    });
  }, [onRegionHover, onRegionClick]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {geoJson && (
        <GeoJSONLayer
          key={`${hoveredRegion ?? ''}-${selectedRegion?.id ?? ''}`}
          data={geoJson}
          style={(f) => styleFeature(f)}
          onEachFeature={onEachFeature}
        />
      )}
      {clubIcon && visibleClubs.map((club) => (
        <Marker
          key={club.id}
          position={club.coordinates}
          icon={clubIcon}
          eventHandlers={{ click: () => onClubClick(club) }}
        >
          <Tooltip direction="top" offset={[0, -28]} opacity={0.95}>
            <div style={{ fontWeight: 600, fontSize: 12 }}>{club.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{club.students} élèves</div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface SenegalMapProps {
  className?: string;
  showLegend?: boolean;
}

export function SenegalMap({ className }: SenegalMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion]   = useState<string | null>(null);
  const [selectedClub, setSelectedClub]     = useState<Club | null>(null);
  const [filterType, setFilterType]         = useState<'clubs' | 'membres' | 'tous'>('tous');
  const [isMounted, setIsMounted]           = useState(false);
  const [geoJson, setGeoJson]               = useState<GeoJSON.FeatureCollection | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch('/geojson/senegal-regions.json')
      .then((r) => r.json())
      .then((data) => setGeoJson(data as GeoJSON.FeatureCollection));
  }, []);

  const totals = useMemo(() => ({
    clubs:   MOCK_CLUBS.length,
    members: SENEGAL_REGIONS.reduce((a, r) => a + r.memberCount, 0),
  }), []);

  const visibleClubs = useMemo(
    () => selectedRegion ? getClubsByRegion(selectedRegion.id) : [],
    [selectedRegion]
  );

  const handleRegionClick = useCallback((id: string) => {
    const region = SENEGAL_REGIONS.find((r) => r.id === id);
    if (!region) return;
    const deselect = selectedRegion?.id === id;
    setSelectedRegion(deselect ? null : region);
    if (!deselect) {
      import('leaflet').then((L) => {
        const clubs = getClubsByRegion(id);
        if (clubs.length > 0) {
          const bounds = L.latLngBounds(clubs.map((c) => c.coordinates));
          mapRef.current?.fitBounds(bounds.pad(0.35), { animate: true, duration: 0.8 });
        } else {
          mapRef.current?.setView(region.coordinates, 9, { animate: true, duration: 0.8 });
        }
      });
    }
  }, [selectedRegion]);

  const handleSearchResult = useCallback((club: Club) => {
    const region = SENEGAL_REGIONS.find((r) => r.id === club.region);
    if (region) setSelectedRegion(region);
    setSelectedClub(club);
    mapRef.current?.setView(club.coordinates, 11, { animate: true, duration: 0.8 });
  }, []);

  const resetFilters = () => {
    setSelectedRegion(null);
    setFilterType('tous');
    mapRef.current?.setView(SENEGAL_CENTER, 7, { animate: true, duration: 0.8 });
  };

  return (
    <div className={className}>
      {/* Leaflet CSS */}
      {isMounted && (
        <style>{`
          @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
          .leaflet-region-tooltip {
            background: rgba(13,27,46,0.95) !important;
            border: 1px solid rgba(196,154,26,0.3) !important;
            border-radius: 8px !important;
            color: white !important;
            font-size: 12px !important;
            padding: 6px 10px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
          }
          .leaflet-region-tooltip::before { display:none !important; }
          .leaflet-control-zoom { display:none; }
        `}</style>
      )}

      <div className="grid h-[680px] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-navy lg:grid-cols-[1fr_320px]">

        {/* Map pane */}
        <div className="relative min-h-0">
          {/* Search bar */}
          <div className="absolute left-1/2 top-3 z-[1000] w-full max-w-sm -translate-x-1/2 px-3">
            <SearchBar onResult={handleSearchResult} />
          </div>

          {/* Stats */}
          <StatsOverlay total={totals} />

          {/* Reset */}
          {selectedRegion && (
            <button
              onClick={resetFilters}
              className="absolute bottom-4 left-3 z-[1000] flex items-center gap-1.5 rounded-lg border border-white/10 bg-primary/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary"
            >
              <RotateCcw className="h-3 w-3" />
              Vue nationale
            </button>
          )}

          {isMounted ? (
            <MapContainer
              center={SENEGAL_CENTER}
              zoom={7}
              scrollWheelZoom
              className="h-full w-full"
              style={{ background: '#0d1b2e' }}
              zoomControl={false}
            >
              <MapInner
                hoveredRegion={hoveredRegion}
                selectedRegion={selectedRegion}
                visibleClubs={visibleClubs}
                geoJson={geoJson}
                onRegionHover={setHoveredRegion}
                onRegionClick={handleRegionClick}
                onClubClick={setSelectedClub}
                mapRef={mapRef}
              />
            </MapContainer>
          ) : (
            <MapLoadingState />
          )}
        </div>

        {/* Side panel */}
        <div className="hidden overflow-hidden border-l border-border/60 lg:flex lg:flex-col">
          <RegionPanel
            region={selectedRegion}
            clubs={visibleClubs}
            filterType={filterType}
            onFilterType={setFilterType}
            onClubClick={setSelectedClub}
            onClose={() => setSelectedRegion(null)}
          />
        </div>
      </div>

      {/* Club modal */}
      {selectedClub && (
        <ClubModal club={selectedClub} onClose={() => setSelectedClub(null)} />
      )}
    </div>
  );
}

export default SenegalMap;
