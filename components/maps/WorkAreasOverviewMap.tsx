"use client"

import { MapContainer, TileLayer, Popup, GeoJSON } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { WorkArea } from "@prisma/client";
import React from "react";
import { format } from 'date-fns';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FitBounds } from "./FitBounds";

interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
  workAreas: WorkArea[]
}

const defaults = {
  zoom: 19,
}

export default function WorkAreasOverviewMap(Map: MapProps) {
  const { zoom = defaults.zoom, posix } = Map

  const formatDate = (date: Date) => {
    return format(date, 'PPpp');
  };

  return (
    <MapContainer center={posix} zoom={zoom} className="h-[400px] w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBounds areas={Map.workAreas} />
      {Map.workAreas.map((workArea) => {
        const area = JSON.parse(workArea.area as string)
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
          >
            <Popup>
              <div className="font-sans max-w-[300px]">
                <h3 className="text-slate-800 font-bold text-lg mb-2">{workArea.name}</h3>
                <p className="text-slate-700 mb-4">{workArea.description || 'Keine Beschreibung verfügbar.'}</p>
                <ul className="list-none p-0 mb-4">
                  <li><span className="font-semibold">Typ:</span> {workArea.type}</li>
                  <li><span className="font-semibold">Einschränkungsstufe:</span> {workArea.restrictionLevel}</li>
                  <li><span className="font-semibold">Startzeit:</span> {formatDate(workArea.startTime)}</li>
                  <li><span className="font-semibold">Endzeit:</span> {formatDate(workArea.endTime)}</li>
                  <li><span className="font-semibold">Automatisches Ende:</span> {workArea.autoEnd ? 'Ja' : 'Nein'}</li>
                </ul>
                {workArea.rerouting && (
                  <p className="mb-4"><span className="font-semibold">Umleitung:</span> {workArea.rerouting}</p>
                )}
                <Link href={`/intern/warnungen/${workArea.id}`}>
                  <Button>
                    Details anzeigen
                  </Button>
                </Link>
              </div>
            </Popup>
          </GeoJSON>
        )
      })}
    </MapContainer>
  )
}