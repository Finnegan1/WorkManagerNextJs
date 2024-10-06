"use client"

import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet';
import EditControlFC from './EditControlFC'
import type { FeatureCollection } from 'geojson';
import { calculateBounds } from './FitBounds'

interface CreateWorkAreaMapProps {
  onAreaChange: (area: FeatureCollection) => void
  currentArea: FeatureCollection
}

export default function CreateWorkAreaMap({ onAreaChange, currentArea }: CreateWorkAreaMapProps) {
  const featureGroupRef = useRef<LeafletFeatureGroup | null>(null)

  useEffect(() => {
    return () => {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers()
      }
    }
  }, [])

  useEffect(() => {
    if (featureGroupRef.current && currentArea) {
      featureGroupRef.current.clearLayers()
      const geoJsonLayer = L.geoJSON(currentArea)
      geoJsonLayer.eachLayer((layer: any) => {
        featureGroupRef.current!.addLayer(layer);
      });
    }
  }, [currentArea])

  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      bounds={calculateBounds([{
        restrictedArea: JSON.stringify(currentArea)
      }])}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControlFC geojson={currentArea} setGeojson={onAreaChange} />
      </FeatureGroup>
    </MapContainer>
  )
}
