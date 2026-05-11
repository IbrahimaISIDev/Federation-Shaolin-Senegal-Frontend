# 04 — Carte Interactive — Spécifications Techniques

**Projet** : Plateforme Web — Fédération Shaolin Sénégal  
**Page** : `/clubs`  
**Version** : 1.0

---

## 1. Objectif

Permettre à tout utilisateur de visualiser la présence de la fédération sur le territoire sénégalais : explorer les 14 régions, consulter les clubs et membres géolocalisés, et accéder à leurs fiches détaillées.

---

## 2. Stack cartographique

| Librairie | Version | Rôle |
|---|---|---|
| **Leaflet.js** | 1.9.x | Moteur cartographique (open source, gratuit) |
| **react-leaflet** | 4.x | Intégration React |
| **leaflet.markercluster** | 1.5.x | Regroupement automatique de marqueurs |
| **OpenStreetMap** | — | Fond de carte (tuiles gratuites) |
| **GeoJSON Sénégal** | — | Contours des 14 régions (fichier statique) |

> **Pourquoi Leaflet plutôt que Google Maps ?**  
> Open source, sans clé API payante, léger (~42KB), parfaitement adapté à une couverture nationale sans coût variable.

---

## 3. Flux utilisateur

```
1. Arrivée sur /clubs
   └── Affichage carte Sénégal centrée (zoom national)
       └── Contours des 14 régions visibles (GeoJSON)

2. Survol d'une région
   └── Highlight de la région (couleur + curseur pointer)

3. Clic sur une région (ex: Dakar)
   └── GET /api/clubs?region=dakar&page=1
   └── Zoom automatique sur la région
   └── Affichage des marqueurs clubs (icône spécifique)
   └── Affichage des marqueurs membres (icône différente)
   └── Clustering si densité élevée

4. Clic sur un marqueur club
   └── Affichage modal / panneau latéral :
       - Nom du club
       - Région / Ville
       - Nom du maître
       - Nombre d'élèves
       - Discipline(s)
       - Contact (téléphone, email)

5. Clic sur un marqueur membre
   └── Affichage modal :
       - Nom prénom
       - Club affilié
       - Grade / Discipline
       - Région / Ville

6. Barre de recherche
   └── Recherche par nom (club ou membre)
   └── Résultats en liste + centrage carte

7. Filtres
   └── Par région (select)
   └── Par type (club / membre / tous)
```

---

## 4. Structure du composant React

```
components/map/
├── InteractiveMap.tsx       ← Composant principal
├── RegionLayer.tsx          ← Couche GeoJSON régions
├── ClubMarker.tsx           ← Marqueur club
├── MemberMarker.tsx         ← Marqueur membre
├── ClusterGroup.tsx         ← Wrapper markercluster
├── ClubModal.tsx            ← Fiche club
├── MemberModal.tsx          ← Fiche membre
├── MapSearchBar.tsx         ← Barre de recherche
├── MapFilters.tsx           ← Filtres région / type
└── senegal-regions.geojson  ← Contours statiques
```

---

## 5. Implémentation — Code de base

### 5.1 Composant principal

```tsx
// components/map/InteractiveMap.tsx
'use client';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import senegalGeoJSON from './senegal-regions.geojson';
import ClubMarker from './ClubMarker';
import MemberMarker from './MemberMarker';

const SENEGAL_CENTER: [number, number] = [14.4974, -14.4524];
const DEFAULT_ZOOM = 7;

export default function InteractiveMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'club' | 'member'>('all');

  const { data } = useQuery({
    queryKey: ['map-data', selectedRegion],
    queryFn: () =>
      fetch(`/api/clubs?region=${selectedRegion ?? ''}&limit=100`)
        .then(r => r.json()),
    enabled: !!selectedRegion,
  });

  const onRegionClick = (e: any) => {
    const regionCode = e.target.feature.properties.code;
    setSelectedRegion(regionCode);
  };

  const regionStyle = (feature: any) => ({
    fillColor: feature.properties.code === selectedRegion ? '#1A5276' : '#D6EAF8',
    weight: 1,
    color: '#1A5276',
    fillOpacity: feature.properties.code === selectedRegion ? 0.4 : 0.2,
  });

  return (
    <div className="relative w-full h-[600px]">
      <MapContainer
        center={SENEGAL_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Couche GeoJSON des régions */}
        <GeoJSON
          data={senegalGeoJSON}
          style={regionStyle}
          onEachFeature={(feature, layer) => {
            layer.on({ click: onRegionClick });
          }}
        />

        {/* Marqueurs avec clustering */}
        {data && (
          <MarkerClusterGroup chunkedLoading>
            {(filter === 'all' || filter === 'club') &&
              data.clubs?.map((club: any) => (
                <ClubMarker key={`club-${club.id}`} club={club} />
              ))}
            {(filter === 'all' || filter === 'member') &&
              data.members?.map((member: any) => (
                <MemberMarker key={`member-${member.id}`} member={member} />
              ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}
```

### 5.2 Icônes différenciées

```tsx
// lib/map-icons.ts
import L from 'leaflet';

export const clubIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#1A5276; color:white; border-radius:50%;
    width:32px; height:32px; display:flex;
    align-items:center; justify-content:center;
    font-size:14px; font-weight:bold; border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3)
  ">C</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const memberIcon = L.divIcon({
  className: '',
  html: `<div style="
    background:#E67E22; color:white; border-radius:50%;
    width:24px; height:24px; display:flex;
    align-items:center; justify-content:center;
    font-size:11px; font-weight:bold; border:2px solid white;
    box-shadow:0 2px 4px rgba(0,0,0,0.2)
  ">M</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
```

---

## 6. API endpoints — Carte

### `GET /api/map/clubs`

```
Paramètres :
  region    string   Code région (ex: "DK") — optionnel
  type      string   "club" | "member" | "all" — défaut: "all"
  search    string   Recherche par nom — optionnel
  page      number   Pagination — défaut: 1
  limit     number   Résultats par page — défaut: 100, max: 200

Réponse :
{
  "clubs": [
    {
      "id": 1,
      "nom": "Club Shaolin Dakar",
      "latitude": 14.6937,
      "longitude": -17.4441,
      "ville": "Dakar",
      "nomMaitre": "Maître Diallo",
      "nbMembres": 45,
      "discipline": "Kung Fu"
    }
  ],
  "members": [...],
  "total": 120,
  "page": 1
}
```

### `GET /api/map/verify-qr`

```
Paramètres :
  token   string   QR token signé JWT

Réponse :
{
  "valid": true,
  "member": {
    "nom": "Diallo",
    "prenom": "Moussa",
    "club": "Club Shaolin Dakar",
    "license": {
      "annee": 2026,
      "status": "ACTIVE",
      "dateFin": "2026-12-31"
    }
  }
}
```

---

## 7. Performance & optimisations

| Problème | Solution |
|---|---|
| Trop de marqueurs (10 000+) | `leaflet.markercluster` — regroupement automatique |
| Chargement global trop lourd | Chargement **par région** au clic uniquement |
| Requêtes BDD lentes | Index sur `region_id`, `latitude`, `longitude` |
| Rendu SSR impossible (Leaflet = browser only) | `dynamic(() => import(...), { ssr: false })` dans Next.js |
| Données périmées | React Query avec `staleTime: 5 * 60 * 1000` (5 min) |

### Import dynamique Next.js (obligatoire)

```tsx
// app/(public)/clubs/page.tsx
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl animate-pulse" />
    ),
  }
);
```

---

## 8. GeoJSON Sénégal

Le fichier `senegal-regions.geojson` contient les contours officiels des 14 régions administratives du Sénégal.

**Source recommandée** : [GADM - gadm.org](https://gadm.org) ou [geoBoundaries](https://www.geoboundaries.org)

**Structure attendue par région :**

```json
{
  "type": "Feature",
  "properties": {
    "code": "DK",
    "nom": "Dakar"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[...]]]
  }
}
```
