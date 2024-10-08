'use client'

import { useEffect } from 'react'
import { Area, WorkArea } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import 'leaflet/dist/leaflet.css'
import React from 'react'
import WorkAreaEntryMap from '../maps/WorkAreaEntryMap'
import L from 'leaflet' // Import Leaflet directly
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png' // Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

interface WorkAreaDetailsDialogProps {
  area: Area
  onClose: () => void
}

export default function WorkAreaDetailsDialog({ area, onClose }: WorkAreaDetailsDialogProps) {
  useEffect(() => {
    // This is a workaround for a known issue with Leaflet in React
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    })
  }, [])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-11/12 max-w-lg max-h-[90vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle>{area.shortDescription}</DialogTitle>
          <DialogDescription>Arbeitsbereich Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <div>
            <strong>Einschränkungsstufe:</strong> {area.restrictionLevel}
          </div>
          <div>
            <strong>Startzeit:</strong> {area.startTime.toLocaleString()}
          </div>
          <div>
            <strong>Endzeit:</strong> {area.endTime.toLocaleString()}
          </div>
          <div>
            <strong>Beschreibung:</strong> {area.information}
          </div>
          <div className="h-[200px] w-full mt-2">
            <WorkAreaEntryMap areas={[area]} className='h-[200px] w-full' />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}