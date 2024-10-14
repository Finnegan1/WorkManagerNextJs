"use client"

import React, { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { FeatureGroup as LeafletFeatureGroup } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet';
import EditControlFC from './EditControlFC'
import type { FeatureCollection } from 'geojson';
import { calculateBounds } from '@/lib/mapUtils'

interface FormRestrictedAreaMapProps {
  onAreaChange: (area: FeatureCollection) => void
  currentArea: FeatureCollection
}

export default function FormRestrictedAreaMap({ onAreaChange, currentArea }: FormRestrictedAreaMapProps) {
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
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      //saxony coordinates
      bounds={currentArea ? calculateBounds(currentArea) : [
        [50.95, 12.05],
        [50.95, 14.05],
        [49.95, 14.05],
        [49.95, 12.05]
      ]}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup ref={featureGroupRef}>
        <EditControlFC geojson={currentArea} setGeojson={onAreaChange} />
      </FeatureGroup>
    </MapContainer>
  )
}
