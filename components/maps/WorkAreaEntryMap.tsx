"use client"

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Area } from "@prisma/client";
import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { calculateBounds } from "./FitBounds";

interface MapProps {
  areas: Area[]
  className?: string
}

export default function WorkAreaEntryMap({ areas, className }: MapProps) {
  return (
    <MapContainer bounds={calculateBounds(areas.map(area => ({ restrictedArea: area.restrictedAreas })))} className={`z-0 ${className}`}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {areas.map((area) => {
        return (
          <>
          <GeoJSON
            key={area.id}
            data={area.restrictedAreas}
            pathOptions={{
              color: 'red',
              weight: 2,
              fillColor: 'red',
              fillOpacity: 0.2,
            }}
          />
          <GeoJSON
            key={area.id}
            data={area.rerouting}
            pathOptions={{
              color: 'blue',
              weight: 2,
              fillColor: 'blue',
              fillOpacity: 0.2,
            }}
          />
          </>
        )
      })}
    </MapContainer>
  )
}