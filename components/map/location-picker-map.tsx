'use client';

// Carte de sélection d'un point (client uniquement : chargée via next/dynamic).
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { SENEGAL_CENTER } from '@/lib/data/senegal-regions';

const pinIcon = L.divIcon({
    className: '',
    html: '<div style="width:26px;height:26px;background:#c49a1a;border:2px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 26],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
    useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
    return null;
}

// Recentre la carte quand la position change depuis l'extérieur (saisie, GPS)
function FollowPosition({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, Math.max(map.getZoom(), 12));
    }, [map, position]);
    return null;
}

export default function LocationPickerMap({
    value,
    onPick,
}: {
    value: [number, number] | null;
    onPick: (lat: number, lng: number) => void;
}) {
    const initialCenter = useMemo(() => value ?? SENEGAL_CENTER, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MapContainer
            center={initialCenter}
            zoom={value ? 12 : 7}
            scrollWheelZoom
            className="h-72 w-full rounded-lg border"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onPick={onPick} />
            <FollowPosition position={value} />
            {value && (
                <Marker
                    position={value}
                    icon={pinIcon}
                    draggable
                    eventHandlers={{
                        dragend: (e) => {
                            const p = (e.target as L.Marker).getLatLng();
                            onPick(p.lat, p.lng);
                        },
                    }}
                />
            )}
        </MapContainer>
    );
}
