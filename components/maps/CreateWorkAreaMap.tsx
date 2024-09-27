"use client"

import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

interface CreateWorkAreaMapProps {
  onAreaChange: (area: any) => void
}

export default function CreateWorkAreaMap({ onAreaChange }: CreateWorkAreaMapProps) {
  const featureGroupRef = useRef<LeafletFeatureGroup | null>(null)

  useEffect(() => {
    return () => {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers()
      }
    }
  }, [])

  const handleCreated = (e: any) => {
    const layer = e.layer
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
      featureGroupRef.current.addLayer(layer)
    }
    onAreaChange(layer.toGeoJSON())
  }

  return (
    <MapContainer center={[51.0509, 13.7383]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}