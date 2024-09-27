'use client'

import { useState } from 'react'
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
import { createWorkArea } from './actions'
import dynamic from 'next/dynamic'

const CreateWorkAreaMap = dynamic(() => import('@/components/maps/CreateWorkAreaMap'), {
  loading: () => <p>A map is loading</p>,
  ssr: false
})

export default function CreateWorkAreaForm() {
  const [area, setArea] = useState<any>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append('createdById', 'YOUR_USER_ID'); // Append createdById to formData

    // Ensure the type is set correctly
    if (!formData.get('type')) {
      console.error('Type is required');
      return; // Prevent submission if type is not set
    }

    // Call the server action
    const result = await createWorkArea(formData);
    
    console.log(result); // Handle the response from the server action
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="area" value={JSON.stringify(area)} />
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue="forestwork">
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
        <Select name="restrictionLevel" defaultValue="none">
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
        <Input type="datetime-local" id="startTime" name="startTime" required />
      </div>

      <div>
        <Label htmlFor="endTime">End Time</Label>
        <Input type="datetime-local" id="endTime" name="endTime" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" />
      </div>

      <div>
        <Label htmlFor="rerouting">Rerouting</Label>
        <Textarea id="rerouting" name="rerouting" />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="autoEnd" name="autoEnd" />
        <Label htmlFor="autoEnd">Auto End</Label>
      </div>

      <div>
        <Label>Work Area</Label>
        <div className="h-[400px] w-full">
          <CreateWorkAreaMap onAreaChange={setArea} />
        </div>
      </div>

      <Button type="submit">Create Work Area</Button>
    </form>
  )
}