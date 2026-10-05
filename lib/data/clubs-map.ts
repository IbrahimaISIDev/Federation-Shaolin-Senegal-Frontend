// ============================================================
// Données réelles de la carte des clubs (API /clubs), regroupées par région.
// Remplace les anciennes données fictives (mock-clubs).
// ============================================================
'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clubsApi, type Club } from '@/lib/api/clubs';
import { SENEGAL_REGIONS, type RegionData } from '@/lib/data/senegal-regions';

export interface MapClub {
  id: number;
  name: string;
  regionId: string;        // id interne de la région (ex: 'thies')
  regionName: string;
  regionCode: string;
  master: string | null;
  members: number;
  city: string | null;
  phone: string | null;
  email: string | null;
  coordinates: [number, number] | null; // null : club non géolocalisé
}

export interface RegionWithStats extends RegionData {
  clubCount: number;
  memberCount: number;
}

// Les codes de région du frontend et de la base diffèrent (DL/DB, KD/KO…) :
// on rapproche par nom normalisé (« Thiès » → « thies »).
const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const regionIdByName = new Map(SENEGAL_REGIONS.map((r) => [normalize(r.name), r.id]));

const toMapClub = (c: Club): MapClub => ({
  id: c.id,
  name: c.nom,
  regionId: regionIdByName.get(normalize(c.region?.nom ?? '')) ?? '',
  regionName: c.region?.nom ?? '',
  regionCode: c.region?.code ?? '',
  master: c.nomMaitre,
  members: c._count?.members ?? 0,
  city: c.ville,
  phone: c.telephone,
  email: c.email,
  coordinates: c.latitude != null && c.longitude != null ? [c.latitude, c.longitude] : null,
});

export function useClubsMapData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['clubs', 'map-data'],
    queryFn: () => clubsApi.list({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    const clubs = ((data as { data?: Club[] } | undefined)?.data ?? []).map(toMapClub);

    const regions: RegionWithStats[] = SENEGAL_REGIONS.map((r) => {
      const inRegion = clubs.filter((c) => c.regionId === r.id);
      return {
        ...r,
        clubCount: inRegion.length,
        memberCount: inRegion.reduce((sum, c) => sum + c.members, 0),
      };
    });

    const totals = {
      clubs: clubs.length,
      members: clubs.reduce((sum, c) => sum + c.members, 0),
    };

    return { clubs, regions, totals, isLoading, isError };
  }, [data, isLoading, isError]);
}

export function searchMapClubs(clubs: MapClub[], query: string): MapClub[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  return clubs.filter((c) =>
    [c.name, c.city, c.master, c.regionName].some((v) => v && normalize(v).includes(q))
  );
}
