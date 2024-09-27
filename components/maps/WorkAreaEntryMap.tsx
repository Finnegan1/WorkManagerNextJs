"use client"

import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { WorkArea } from "@prisma/client";
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  workAreas: WorkArea[]
  className?: string
}

function FitBounds({ workAreas }: { workAreas: WorkArea[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds = workAreas.map(workArea => {
      const area = JSON.parse(workArea.area as string);
      return area.geometry.coordinates[0].map((coord: [number, number]) => [coord[1], coord[0]]);
    }).flat();

    if (bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [map, workAreas]);

  return null;
}

export default function WorkAreaEntryMap({ workAreas, className }: MapProps) {
  return (
    <MapContainer center={[0, 0]} zoom={2} className={`z-0 ${className}`}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBounds workAreas={workAreas} />
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