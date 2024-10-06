"use client"

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { WorkArea } from "@prisma/client";
import React from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { calculateBounds } from "./FitBounds";

interface MapProps {
  workAreas: WorkArea[]
  className?: string
}

export default function WorkAreaEntryMap({ workAreas, className }: MapProps) {
  return (
    <MapContainer bounds={calculateBounds(workAreas)} className={`z-0 ${className}`}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {workAreas.map((workArea) => {
        const area = JSON.parse(workArea.area as string);
        return (
          <GeoJSON
            key={workArea.id}
            data={area}
            pathOptions={{
              color: 'blue',
              weight: 2,
              fillColor: 'blue',
              fillOpacity: 0.2,
            }}
          />
        )
      })}
    </MapContainer>
  )
}