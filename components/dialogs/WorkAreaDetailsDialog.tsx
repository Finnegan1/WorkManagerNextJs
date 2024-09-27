'use client'

import { useEffect } from 'react'
import { WorkArea } from '@prisma/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import 'leaflet/dist/leaflet.css'
import React from 'react'
import WorkAreaEntryMap from '../maps/WorkAreaEntryMap'

interface WorkAreaDetailsDialogProps {
  workArea: WorkArea
  onClose: () => void
}

export default function WorkAreaDetailsDialog({ workArea, onClose }: WorkAreaDetailsDialogProps) {
  useEffect(() => {
    // This is a workaround for a known issue with Leaflet in React
    const L = require('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    })
  }, [])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-11/12 max-w-lg max-h-[90vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle>{workArea.name}</DialogTitle>
          <DialogDescription>Work Area Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <div>
            <strong>Type:</strong> {workArea.type}
          </div>
          <div>
            <strong>Restriction Level:</strong> {workArea.restrictionLevel}
          </div>
          <div>
            <strong>Start Time:</strong> {workArea.startTime.toLocaleString()}
          </div>
          <div>
            <strong>End Time:</strong> {workArea.endTime.toLocaleString()}
          </div>
          <div>
            <strong>Description:</strong> {workArea.description}
          </div>
          <div>
            <strong>Rerouting:</strong> {workArea.rerouting}
          </div>
          <div className="h-[200px] w-full mt-2">
            <WorkAreaEntryMap workAreas={[workArea]} className='h-[200px] w-full' />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
/*

            <MapContainer
              center={[0, 0]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON data={JSON.parse(workArea.area as string)} />
            </MapContainer>
            */