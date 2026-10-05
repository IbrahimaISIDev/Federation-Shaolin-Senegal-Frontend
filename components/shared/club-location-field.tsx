'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Crosshair, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LocationPickerMap = dynamic(() => import('@/components/map/location-picker-map'), {
    ssr: false,
    loading: () => <div className="flex h-72 items-center justify-center rounded-lg border bg-muted/40 text-sm text-muted-foreground">Chargement de la carte…</div>,
});

// Bornes du Sénégal (avec marge) — mêmes que la validation côté API
export const SENEGAL_BOUNDS = { latMin: 12, latMax: 17, lngMin: -18, lngMax: -11 };

export const isInSenegal = (lat: number, lng: number) =>
    lat >= SENEGAL_BOUNDS.latMin && lat <= SENEGAL_BOUNDS.latMax &&
    lng >= SENEGAL_BOUNDS.lngMin && lng <= SENEGAL_BOUNDS.lngMax;

const round = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Position d'un club : clic sur la carte, déplacement du repère, saisie
 * manuelle ou position GPS de l'appareil. Valeurs en texte ('' = non
 * renseigné) pour s'intégrer simplement à react-hook-form.
 */
export function ClubLocationField({
    latitude,
    longitude,
    onChange,
    error,
}: {
    latitude: string;
    longitude: string;
    onChange: (latitude: string, longitude: string) => void;
    error?: string;
}) {
    const [locating, setLocating] = useState(false);
    const [geoError, setGeoError] = useState('');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const position: [number, number] | null =
        Number.isFinite(lat) && Number.isFinite(lng) && isInSenegal(lat, lng) ? [lat, lng] : null;

    const pick = (la: number, ln: number) => onChange(String(round(la)), String(round(ln)));

    const useMyPosition = () => {
        setGeoError('');
        if (!navigator.geolocation) {
            setGeoError("La géolocalisation n'est pas disponible sur cet appareil.");
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                pick(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                setLocating(false);
                setGeoError("Position introuvable (autorisation refusée ou signal GPS indisponible).");
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };

    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
                Cliquez sur la carte pour placer le club (le repère peut ensuite être déplacé), ou
                saisissez les coordonnées. Sans position, le club n&apos;apparaît pas sur la carte publique.
            </p>

            <LocationPickerMap value={position} onPick={pick} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-1.5">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                        id="latitude"
                        inputMode="decimal"
                        placeholder="14.6937"
                        value={latitude}
                        onChange={(e) => onChange(e.target.value.replace(',', '.'), longitude)}
                        className={error ? 'border-destructive' : ''}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                        id="longitude"
                        inputMode="decimal"
                        placeholder="-17.4441"
                        value={longitude}
                        onChange={(e) => onChange(latitude, e.target.value.replace(',', '.'))}
                        className={error ? 'border-destructive' : ''}
                    />
                </div>
                <div className="flex items-end gap-2">
                    <Button type="button" variant="outline" onClick={useMyPosition} disabled={locating} className="gap-2">
                        {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
                        Ma position
                    </Button>
                    {(latitude || longitude) && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => onChange('', '')} aria-label="Effacer la position">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {(error || geoError) && <p className="text-sm text-destructive">{error || geoError}</p>}
        </div>
    );
}

/** Règle zod commune (formulaires création / modification de club). */
export const coordinatesRefinement = {
    check: (d: { latitude?: string; longitude?: string }) => {
        const la = d.latitude?.trim() ?? '';
        const ln = d.longitude?.trim() ?? '';
        if (!la && !ln) return true;
        const lat = Number(la);
        const lng = Number(ln);
        return la !== '' && ln !== '' && Number.isFinite(lat) && Number.isFinite(lng) && isInSenegal(lat, lng);
    },
    message: {
        message: 'Position invalide : renseignez latitude et longitude, situées au Sénégal (ex : 14.69 / -17.44).',
        path: ['latitude'],
    },
};

/** Conversion vers le format API : nombres, ou null pour effacer. */
export const toApiCoordinates = (latitude?: string, longitude?: string) => {
    const la = latitude?.trim();
    const ln = longitude?.trim();
    if (!la || !ln) return { latitude: null, longitude: null };
    return { latitude: Number(la), longitude: Number(ln) };
};
