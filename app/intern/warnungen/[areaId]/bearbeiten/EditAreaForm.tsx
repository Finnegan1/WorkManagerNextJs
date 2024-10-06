'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { WorkArea } from '@prisma/client'
import { updateWorkArea } from './actions'
import { useSession } from 'next-auth/react'

export default function EditWorkAreaForm({ workArea }: { workArea: WorkArea }) {
  const [area, setArea] = useState<any>(JSON.parse(workArea.area as string))
  const session = useSession()
  console.log(session)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log(data);
    await updateWorkArea(workArea.id, data);
  };

  if(session.status === 'loading') {
    return <div>Loading...</div>
  }

  console.log(workArea)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="area" value={JSON.stringify(area)} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={workArea.name} />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={workArea.type}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="forestwork">Forest Work</SelectItem>
            <SelectItem value="nature">Nature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="restrictionLevel">Restriction Level</Label>
        <Select name="restrictionLevel" defaultValue={workArea.restrictionLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select restriction level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="attention">Attention</SelectItem>
            <SelectItem value="danger">Danger</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input type="datetime-local" id="startTime" name="startTime" required defaultValue={workArea.startTime.toISOString().slice(0, 16)} />
      </div>

      <div>
        <Label htmlFor="endTime">End Time</Label>
        <Input type="datetime-local" id="endTime" name="endTime" required defaultValue={workArea.endTime.toISOString().slice(0, 16)} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description">
            {workArea.description}
        </Textarea>
      </div>

      <div>
        <Label htmlFor="rerouting">Rerouting</Label>
        <Textarea id="rerouting" name="rerouting">
            {workArea.rerouting}
        </Textarea>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="autoEnd" name="autoEnd" defaultChecked={workArea.autoEnd} />
        <Label htmlFor="autoEnd">Auto End</Label>
      </div>

      <div>
        <Label>Work Area</Label>
        <div className="h-[400px] w-full">
          <MapContainer center={[51.0504, 13.7373]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={(e) => setArea(e.layer.toGeoJSON())}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                }}
              />
            </FeatureGroup>
            <GeoJSON 
              data={JSON.parse(workArea.area as string)} 
              pathOptions={{ color: 'red' }}
            />
          </MapContainer>
        </div>
      </div>

      <Button type="submit">Update Work Area</Button>
    </form>
  )
}