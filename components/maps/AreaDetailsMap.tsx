"use client"

import { useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateBounds } from '@/lib/mapUtils';

export default function AreaDetailsMap({ area, rerouting }: { area: FeatureCollection, rerouting: FeatureCollection }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    // Calculate bounds based on the area GeoJSON
    const bounds = calculateBounds(area.features[0]);

    return (
        <MapContainer style={{ height: '100%', width: '100%' }} bounds={bounds}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {area && <GeoJSON data={area} style={{ color: 'red' }} />}
            {rerouting && <GeoJSON data={rerouting} style={{ color: 'blue' }} />}
        </MapContainer>
    )
}