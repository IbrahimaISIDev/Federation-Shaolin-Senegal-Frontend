export interface Club {
  id: string;
  name: string;
  region: string; // region id
  regionName: string;
  regionCode: string;
  master: string;
  students: number;
  disciplines: string[];
  phone: string;
  email: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface Member {
  id: string;
  clubId: string;
  name: string;
  photo?: string;
  grade: string;
  discipline: string;
  licenceStatus: 'active' | 'expired' | 'pending';
}

export const MOCK_CLUBS: Club[] = [
  // Dakar (DK)
  { id: 'dk-1', name: 'Shaolin Dakar Plateau', region: 'dakar', regionName: 'Dakar', regionCode: 'DK', master: 'Ousmane Ngom', students: 85, disciplines: ['Kung Fu', 'Wushu', 'Sanda'], phone: '+221 77 123 45 67', email: 'plateau@shaolin-dakar.sn', address: 'Plateau, Dakar', coordinates: [14.6937, -17.4441] },
  { id: 'dk-2', name: 'Shaolin Almadies', region: 'dakar', regionName: 'Dakar', regionCode: 'DK', master: 'Ibrahima Diallo', students: 62, disciplines: ['Kung Fu', 'Qi Gong'], phone: '+221 77 234 56 78', email: 'almadies@shaolin-dakar.sn', address: 'Almadies, Dakar', coordinates: [14.7469, -17.5218] },
  { id: 'dk-3', name: 'Shaolin Parcelles Assainies', region: 'dakar', regionName: 'Dakar', regionCode: 'DK', master: 'Moussa Cissé', students: 48, disciplines: ['Wushu', 'Tai Chi'], phone: '+221 76 345 67 89', email: 'parcelles@shaolin-dakar.sn', address: 'Parcelles Assainies, Dakar', coordinates: [14.7820, -17.4123] },
  { id: 'dk-4', name: 'Shaolin Guédiawaye', region: 'dakar', regionName: 'Dakar', regionCode: 'DK', master: 'Fatou Sow', students: 55, disciplines: ['Kung Fu', 'Sanda'], phone: '+221 70 456 78 90', email: 'guediawaye@shaolin-dakar.sn', address: 'Guédiawaye, Dakar', coordinates: [14.7728, -17.3940] },
  { id: 'dk-5', name: 'Shaolin Pikine', region: 'dakar', regionName: 'Dakar', regionCode: 'DK', master: 'Cheikh Ba', students: 71, disciplines: ['Kung Fu', 'Wushu', 'Tai Chi'], phone: '+221 77 567 89 01', email: 'pikine@shaolin-dakar.sn', address: 'Pikine, Dakar', coordinates: [14.7456, -17.3889] },
  // Thiès (TH)
  { id: 'th-1', name: 'Shaolin Thiès Centre', region: 'thies', regionName: 'Thiès', regionCode: 'TH', master: 'Abdoulaye Faye', students: 42, disciplines: ['Kung Fu', 'Wushu'], phone: '+221 77 678 90 12', email: 'centre@shaolin-thies.sn', address: 'Centre-ville, Thiès', coordinates: [14.7910, -16.9359] },
  { id: 'th-2', name: 'Shaolin Mbour', region: 'thies', regionName: 'Thiès', regionCode: 'TH', master: 'Lamine Ndiaye', students: 35, disciplines: ['Kung Fu', 'Sanda'], phone: '+221 76 789 01 23', email: 'mbour@shaolin-thies.sn', address: 'Mbour, Thiès', coordinates: [14.4050, -16.9650] },
  { id: 'th-3', name: 'Shaolin Tivaouane', region: 'thies', regionName: 'Thiès', regionCode: 'TH', master: 'Omar Diop', students: 28, disciplines: ['Kung Fu'], phone: '+221 70 890 12 34', email: 'tivaouane@shaolin-thies.sn', address: 'Tivaouane, Thiès', coordinates: [14.9524, -16.8142] },
  // Saint-Louis (SL)
  { id: 'sl-1', name: 'Shaolin Saint-Louis', region: 'saint-louis', regionName: 'Saint-Louis', regionCode: 'SL', master: 'Mamadou Traoré', students: 38, disciplines: ['Kung Fu', 'Wushu'], phone: '+221 77 901 23 45', email: 'stlouis@shaolin.sn', address: 'Saint-Louis', coordinates: [16.0326, -16.4818] },
  { id: 'sl-2', name: 'Shaolin Richard Toll', region: 'saint-louis', regionName: 'Saint-Louis', regionCode: 'SL', master: 'Modou Fall', students: 24, disciplines: ['Kung Fu'], phone: '+221 76 012 34 56', email: 'richardtoll@shaolin.sn', address: 'Richard Toll, Saint-Louis', coordinates: [16.4614, -15.6985] },
  // Kaolack (KL)
  { id: 'kl-1', name: 'Shaolin Kaolack', region: 'kaolack', regionName: 'Kaolack', regionCode: 'KL', master: 'Serigne Mbaye', students: 45, disciplines: ['Kung Fu', 'Tai Chi'], phone: '+221 77 123 45 68', email: 'kaolack@shaolin.sn', address: 'Kaolack', coordinates: [14.1652, -16.0726] },
  { id: 'kl-2', name: 'Shaolin Ndoffane', region: 'kaolack', regionName: 'Kaolack', regionCode: 'KL', master: 'Awa Diallo', students: 18, disciplines: ['Kung Fu'], phone: '+221 76 234 56 79', email: 'ndoffane@shaolin.sn', address: 'Ndoffane, Kaolack', coordinates: [14.0823, -16.2910] },
  // Ziguinchor (ZG)
  { id: 'zg-1', name: 'Shaolin Ziguinchor', region: 'ziguinchor', regionName: 'Ziguinchor', regionCode: 'ZG', master: 'Ibou Diatta', students: 52, disciplines: ['Kung Fu', 'Wushu', 'Sanda'], phone: '+221 77 345 67 90', email: 'ziguinchor@shaolin.sn', address: 'Ziguinchor', coordinates: [12.5681, -16.2719] },
  { id: 'zg-2', name: 'Shaolin Bignona', region: 'ziguinchor', regionName: 'Ziguinchor', regionCode: 'ZG', master: 'Marie Badji', students: 31, disciplines: ['Kung Fu', 'Qi Gong'], phone: '+221 76 456 78 91', email: 'bignona@shaolin.sn', address: 'Bignona, Ziguinchor', coordinates: [12.8085, -16.2279] },
  // Tambacounda (TC)
  { id: 'tc-1', name: 'Shaolin Tambacounda', region: 'tambacounda', regionName: 'Tambacounda', regionCode: 'TC', master: 'Bocar Diallo', students: 29, disciplines: ['Kung Fu', 'Wushu'], phone: '+221 77 567 89 02', email: 'tamba@shaolin.sn', address: 'Tambacounda', coordinates: [13.7707, -13.6673] },
  // Louga (LG)
  { id: 'lg-1', name: 'Shaolin Louga', region: 'louga', regionName: 'Louga', regionCode: 'LG', master: 'Ndiaga Sall', students: 33, disciplines: ['Kung Fu'], phone: '+221 76 678 90 13', email: 'louga@shaolin.sn', address: 'Louga', coordinates: [15.6144, -16.2281] },
  // Diourbel (DL)
  { id: 'dl-1', name: 'Shaolin Touba', region: 'diourbel', regionName: 'Diourbel', regionCode: 'DL', master: 'Fallou Diop', students: 27, disciplines: ['Kung Fu', 'Tai Chi'], phone: '+221 77 789 01 24', email: 'touba@shaolin.sn', address: 'Touba, Diourbel', coordinates: [14.8608, -15.8831] },
  // Matam (MT)
  { id: 'mt-1', name: 'Shaolin Matam', region: 'matam', regionName: 'Matam', regionCode: 'MT', master: 'Souleymane Bâ', students: 22, disciplines: ['Kung Fu'], phone: '+221 76 890 12 35', email: 'matam@shaolin.sn', address: 'Matam', coordinates: [15.6559, -13.2555] },
  // Kédougou (KG)
  { id: 'kg-1', name: 'Shaolin Kédougou', region: 'kedougou', regionName: 'Kédougou', regionCode: 'KG', master: 'Alioune Kouyaté', students: 19, disciplines: ['Kung Fu'], phone: '+221 77 901 23 46', email: 'kedougou@shaolin.sn', address: 'Kédougou', coordinates: [12.5605, -12.1747] },
  // Kolda (KD)
  { id: 'kd-1', name: 'Shaolin Kolda', region: 'kolda', regionName: 'Kolda', regionCode: 'KD', master: 'Pape Camara', students: 26, disciplines: ['Kung Fu', 'Wushu'], phone: '+221 76 012 34 57', email: 'kolda@shaolin.sn', address: 'Kolda', coordinates: [12.8983, -14.9508] },
  // Fatick (FK)
  { id: 'fk-1', name: 'Shaolin Fatick', region: 'fatick', regionName: 'Fatick', regionCode: 'FK', master: 'Aminata Diouf', students: 21, disciplines: ['Kung Fu', 'Qi Gong'], phone: '+221 77 123 45 69', email: 'fatick@shaolin.sn', address: 'Fatick', coordinates: [14.3390, -16.4111] },
  // Kaffrine (KF)
  { id: 'kf-1', name: 'Shaolin Kaffrine', region: 'kaffrine', regionName: 'Kaffrine', regionCode: 'KF', master: 'Tidiane Gueye', students: 17, disciplines: ['Kung Fu'], phone: '+221 76 234 56 80', email: 'kaffrine@shaolin.sn', address: 'Kaffrine', coordinates: [14.1059, -15.5508] },
  // Sédhiou (SD)
  { id: 'sd-1', name: 'Shaolin Sédhiou', region: 'sedhiou', regionName: 'Sédhiou', regionCode: 'SD', master: 'Boubacar Mané', students: 20, disciplines: ['Kung Fu'], phone: '+221 77 345 67 91', email: 'sedhiou@shaolin.sn', address: 'Sédhiou', coordinates: [12.7081, -15.5569] },
];

export const MOCK_MEMBERS: Member[] = [
  { id: 'm1', clubId: 'dk-1', name: 'Oumar Diallo', grade: '3e Duan', discipline: 'Kung Fu', licenceStatus: 'active' },
  { id: 'm2', clubId: 'dk-1', name: 'Aissatou Sow', grade: '2e Duan', discipline: 'Wushu', licenceStatus: 'active' },
  { id: 'm3', clubId: 'dk-1', name: 'Cheikh Diop', grade: '1er Duan', discipline: 'Sanda', licenceStatus: 'pending' },
  { id: 'm4', clubId: 'dk-2', name: 'Fatima Ba', grade: '2e Duan', discipline: 'Kung Fu', licenceStatus: 'active' },
  { id: 'm5', clubId: 'th-1', name: 'Ibrahima Sall', grade: '1er Duan', discipline: 'Wushu', licenceStatus: 'active' },
  { id: 'm6', clubId: 'sl-1', name: 'Mariama Ndiaye', grade: '2e Duan', discipline: 'Kung Fu', licenceStatus: 'expired' },
];

export function getClubsByRegion(regionId: string): Club[] {
  return MOCK_CLUBS.filter((c) => c.region === regionId);
}

export function searchClubs(query: string): Club[] {
  const q = query.toLowerCase();
  return MOCK_CLUBS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.master.toLowerCase().includes(q) ||
      c.regionName.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
  );
}
