"use client"

import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import { Area } from '@prisma/client'
import { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

interface MapComponentProps {
  geoJson: GeoJSON.FeatureCollection | null
  areas: Area[]
  isDrawMode: boolean
  onDrawCreated: (e: L.LeafletMouseEvent) => void
}

export default function MapComponent({ geoJson, areas, isDrawMode, onDrawCreated }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
  }, [])

  if (!mapReady) {
    return null
  }

  return (
    <div className="h-[500px]">
      <MapContainer center={[51.0504, 13.7373]} zoom={8} ref={mapRef} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJson && <GeoJSON data={geoJson} style={{ color: 'green' }} />}
        {areas.map((area, index) => (
          <div key={index}>
            <GeoJSON data={area.restrictedAreas as unknown as GeoJSON.FeatureCollection} style={{ color: 'red' }} />
            <GeoJSON data={area.rerouting as unknown as GeoJSON.FeatureCollection} style={{ color: 'blue' }} />
          </div>
        ))}
        {isDrawMode && (
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={onDrawCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polygon: false,
              }}
            />
          </FeatureGroup>
        )}
      </MapContainer>
    </div>
  )
}