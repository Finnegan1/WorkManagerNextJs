"use client"

import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet'
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet';
import EditControlFC from './EditControlFC'
import type { FeatureCollection } from 'geojson';
import { calculateBounds } from './FitBounds'

interface CreateReroutingMapProps {
    currentArea: FeatureCollection
    currentRerouting: FeatureCollection
    onReroutingChange: (rerouting: FeatureCollection) => void
}

export default function CreateReroutingMap({ currentArea, currentRerouting, onReroutingChange }: CreateReroutingMapProps) {
    const featureGroupRef = useRef<LeafletFeatureGroup | null>(null)

    useEffect(() => {
        return () => {
            if (featureGroupRef.current) {
                featureGroupRef.current.clearLayers()
            }
        }
    }, [])

    useEffect(() => {
        if (featureGroupRef.current && currentRerouting) {
            featureGroupRef.current.clearLayers()
            const geoJsonLayer = L.geoJSON(currentRerouting)
            geoJsonLayer.eachLayer((layer: any) => {
                featureGroupRef.current!.addLayer(layer);
            });
        }
    }, [currentRerouting])

    return (
        <MapContainer
            style={{ height: '100%', width: '100%' }}
            bounds={calculateBounds([{
                restrictedArea: JSON.stringify(currentArea)
            }])}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={currentArea} style={{ color: 'red', fillOpacity: 0.2 }} />
            <FeatureGroup ref={featureGroupRef}>
                <EditControlFC geojson={currentRerouting} setGeojson={onReroutingChange} />
            </FeatureGroup>
        </MapContainer>
    )
}