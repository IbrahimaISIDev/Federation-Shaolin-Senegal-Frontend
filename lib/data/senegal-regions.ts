// GeoJSON data for Senegal's 14 regions
// Simplified boundaries for visualization purposes

export interface RegionData {
  id: string;
  name: string;
  code: string;
  clubCount: number;
  memberCount: number;
  coordinates: [number, number]; // [lat, lng] center point
}

export const SENEGAL_REGIONS: RegionData[] = [
  { id: 'dakar', name: 'Dakar', code: 'DK', clubCount: 45, memberCount: 1250, coordinates: [14.7167, -17.4677] },
  { id: 'thies', name: 'Thiès', code: 'TH', clubCount: 18, memberCount: 420, coordinates: [14.7910, -16.9359] },
  { id: 'diourbel', name: 'Diourbel', code: 'DL', clubCount: 8, memberCount: 180, coordinates: [14.6553, -16.2314] },
  { id: 'fatick', name: 'Fatick', code: 'FK', clubCount: 6, memberCount: 140, coordinates: [14.3390, -16.4111] },
  { id: 'kaolack', name: 'Kaolack', code: 'KL', clubCount: 12, memberCount: 280, coordinates: [14.1652, -16.0726] },
  { id: 'kaffrine', name: 'Kaffrine', code: 'KF', clubCount: 4, memberCount: 90, coordinates: [14.1059, -15.5508] },
  { id: 'kolda', name: 'Kolda', code: 'KD', clubCount: 5, memberCount: 110, coordinates: [12.8983, -14.9508] },
  { id: 'kedougou', name: 'Kédougou', code: 'KG', clubCount: 3, memberCount: 65, coordinates: [12.5605, -12.1747] },
  { id: 'louga', name: 'Louga', code: 'LG', clubCount: 7, memberCount: 160, coordinates: [15.6144, -16.2281] },
  { id: 'matam', name: 'Matam', code: 'MT', clubCount: 4, memberCount: 85, coordinates: [15.6559, -13.2555] },
  { id: 'saint-louis', name: 'Saint-Louis', code: 'SL', clubCount: 10, memberCount: 230, coordinates: [16.0326, -16.4818] },
  { id: 'sedhiou', name: 'Sédhiou', code: 'SD', clubCount: 3, memberCount: 70, coordinates: [12.7081, -15.5569] },
  { id: 'tambacounda', name: 'Tambacounda', code: 'TC', clubCount: 6, memberCount: 130, coordinates: [13.7707, -13.6673] },
  { id: 'ziguinchor', name: 'Ziguinchor', code: 'ZG', clubCount: 9, memberCount: 200, coordinates: [12.5681, -16.2719] },
];

// Simplified GeoJSON boundaries for Senegal regions
export const SENEGAL_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { id: 'dakar', name: 'Dakar', code: 'DK' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-17.55, 14.85], [-17.35, 14.85], [-17.25, 14.75], [-17.25, 14.65],
          [-17.35, 14.55], [-17.55, 14.55], [-17.60, 14.65], [-17.60, 14.75], [-17.55, 14.85]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'thies', name: 'Thiès', code: 'TH' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-17.25, 14.95], [-16.75, 14.95], [-16.55, 14.85], [-16.45, 14.55],
          [-16.55, 14.35], [-16.85, 14.25], [-17.15, 14.35], [-17.25, 14.55],
          [-17.25, 14.75], [-17.25, 14.95]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'diourbel', name: 'Diourbel', code: 'DL' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.55, 14.95], [-16.05, 14.95], [-15.85, 14.75], [-15.85, 14.45],
          [-16.05, 14.25], [-16.45, 14.25], [-16.55, 14.55], [-16.55, 14.95]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'fatick', name: 'Fatick', code: 'FK' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.85, 14.25], [-16.45, 14.25], [-16.25, 14.05], [-16.25, 13.75],
          [-16.55, 13.55], [-16.85, 13.65], [-17.05, 13.95], [-16.85, 14.25]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'kaolack', name: 'Kaolack', code: 'KL' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.25, 14.25], [-15.75, 14.35], [-15.45, 14.15], [-15.35, 13.85],
          [-15.55, 13.55], [-16.05, 13.55], [-16.25, 13.85], [-16.25, 14.25]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'kaffrine', name: 'Kaffrine', code: 'KF' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-15.75, 14.45], [-15.15, 14.55], [-14.75, 14.35], [-14.65, 13.95],
          [-14.95, 13.65], [-15.45, 13.65], [-15.75, 13.95], [-15.75, 14.45]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'louga', name: 'Louga', code: 'LG' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.75, 15.95], [-15.85, 15.95], [-15.55, 15.65], [-15.45, 15.15],
          [-15.75, 14.85], [-16.35, 14.85], [-16.75, 15.25], [-16.85, 15.65], [-16.75, 15.95]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'saint-louis', name: 'Saint-Louis', code: 'SL' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.55, 16.55], [-15.35, 16.55], [-14.75, 16.15], [-14.65, 15.65],
          [-15.15, 15.25], [-15.85, 15.25], [-16.35, 15.55], [-16.65, 16.05], [-16.55, 16.55]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'matam', name: 'Matam', code: 'MT' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-14.75, 16.15], [-13.25, 16.55], [-12.85, 15.95], [-13.05, 15.35],
          [-13.75, 14.95], [-14.45, 15.15], [-14.75, 15.75], [-14.75, 16.15]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'tambacounda', name: 'Tambacounda', code: 'TC' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-14.45, 14.95], [-12.85, 15.25], [-12.25, 14.55], [-12.25, 13.55],
          [-13.15, 13.15], [-14.25, 13.35], [-14.75, 13.95], [-14.45, 14.95]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'kedougou', name: 'Kédougou', code: 'KG' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-12.85, 13.25], [-11.85, 13.35], [-11.35, 12.75], [-11.55, 12.25],
          [-12.25, 12.05], [-12.85, 12.45], [-12.95, 12.95], [-12.85, 13.25]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'kolda', name: 'Kolda', code: 'KD' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-15.25, 13.35], [-14.25, 13.45], [-13.85, 13.05], [-13.95, 12.55],
          [-14.55, 12.35], [-15.35, 12.55], [-15.55, 13.05], [-15.25, 13.35]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'sedhiou', name: 'Sédhiou', code: 'SD' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.15, 13.15], [-15.35, 13.25], [-15.05, 12.85], [-15.15, 12.45],
          [-15.75, 12.25], [-16.25, 12.55], [-16.35, 12.95], [-16.15, 13.15]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { id: 'ziguinchor', name: 'Ziguinchor', code: 'ZG' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-16.85, 13.15], [-16.15, 13.25], [-15.85, 12.85], [-15.95, 12.35],
          [-16.45, 12.15], [-16.95, 12.45], [-17.05, 12.95], [-16.85, 13.15]
        ]]
      }
    }
  ]
};

export const SENEGAL_BOUNDS: [[number, number], [number, number]] = [
  [12.0, -17.7],
  [16.7, -11.3]
];

export const SENEGAL_CENTER: [number, number] = [14.4974, -14.4524];
