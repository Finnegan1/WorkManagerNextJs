'use client'

import { useState } from 'react'
import { fetchWorkAreas, generatePDFForAreas, sendPDFByEmail } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WorkArea } from '@prisma/client'
import WorkAreaDetailsDialog from '@/components/dialogs/WorkAreaDetailsDialog'

export default function PublishPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0])
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([])
  const [selectedAreas, setSelectedAreas] = useState<number[]>([])
  const [detailsWorkArea, setDetailsWorkArea] = useState<WorkArea | null>(null)
  const [email, setEmail] = useState('')

  const handleFetchAreas = async () => {
    if (startDate && endDate) {
      const areas = await fetchWorkAreas(new Date(startDate), new Date(endDate))
      setWorkAreas(areas)
      setSelectedAreas(areas.map(area => area.id))
    }
  }

  const handleSelectArea = (id: number) => {
    setSelectedAreas(prev => 
      prev.includes(id) ? prev.filter(areaId => areaId !== id) : [...prev, id]
    )
  }

  const handleGeneratePDF = async () => {
    const result = await generatePDFForAreas(selectedAreas)
    if (result.success && result.pdfData) {
      // Convert base64 to Blob
      const byteCharacters = atob(result.pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'work_areas_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(result.message || 'Failed to generate PDF');
    }
  }

  const handleSendPDF = async () => {
    if (email) {
      const result = await sendPDFByEmail(email, selectedAreas)
      if (result.success) {
        alert(result.message)
      }
    }
  }

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Publish Work Areas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <Button onClick={handleFetchAreas} className="w-full">Fetch Areas</Button>
      </div>
      <div className="overflow-x-auto mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Restriction Level</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAreas.includes(area.id)}
                    onCheckedChange={() => handleSelectArea(area.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{area.name}</TableCell>
                <TableCell>{area.type}</TableCell>
                <TableCell>{area.restrictionLevel}</TableCell>
                <TableCell>{area.startTime.toLocaleDateString()}</TableCell>
                <TableCell>{area.endTime.toLocaleDateString()}</TableCell>
                <TableCell><Button size="sm" onClick={() => setDetailsWorkArea(area)}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Button onClick={handleGeneratePDF} className="w-full">Generate and Download PDF</Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
          />
          <Button onClick={handleSendPDF} className="w-full">Send PDF by Email</Button>
        </div>
      </div>
      {detailsWorkArea && <WorkAreaDetailsDialog workArea={detailsWorkArea} onClose={() => setDetailsWorkArea(null)} />}
    </div>
  )
}