"use client"

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { FeatureCollection } from 'geojson';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FitBounds } from "./FitBounds";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Area } from '@prisma/client';

interface AreasOverviewMapProps {
  areas: Area[];
  initialCenter?: LatLngExpression | LatLngTuple;
  initialZoom?: number;
}

export default function AreasOverviewMap({ areas, initialCenter = [51.1657, 10.4515], initialZoom = 6 }: AreasOverviewMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <MapContainer center={initialCenter} zoom={initialZoom} className="h-[400px] w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBounds areas={areas.map((area) => ({
        restrictedArea: JSON.stringify(area.restrictedAreas)
      }))} />
      {areas.map((area) => (
        <React.Fragment key={area.id}>
          <GeoJSON
            data={area.restrictedAreas}
            pathOptions={{
              color: 'red',
              weight: 2,
              fillColor: 'red',
              fillOpacity: 0.2,
            }}
          >
            <Popup>
              <div className="font-sans max-w-[300px]">
                <h3 className="text-slate-800 font-bold text-lg mb-2">{area.shortDescription}</h3>
                <p className="text-slate-700 mb-4">{area.information || 'Keine Beschreibung verfügbar.'}</p>
                <Link href={`/intern/warnungen/${area.id}`}>
                  <Button>
                    Details anzeigen
                  </Button>
                </Link>
              </div>
            </Popup>
          </GeoJSON>
          {area.rerouting && (
            <GeoJSON
              data={area.rerouting}
              pathOptions={{
                color: 'blue',
                weight: 2,
                fillColor: 'blue',
                fillOpacity: 0.2,
              }}
            >
              <Popup>
                <div className="font-sans max-w-[300px]">
                  <h3 className="text-slate-800 font-bold text-lg mb-2">Umleitung für {area.shortDescription}</h3>
                  <Link href={`/intern/warnungen/${area.id}`}>
                    <Button>
                      Details anzeigen
                    </Button>
                  </Link>
                </div>
              </Popup>
            </GeoJSON>
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
}
