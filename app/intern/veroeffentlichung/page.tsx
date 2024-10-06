'use client'

import { useState } from 'react'
import { fetchWorkAreas, generatePDF, sendPDFByEmail } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PdfTemplate, WorkArea } from '@prisma/client'
import dynamic from 'next/dynamic'
import TemplatePickDialog from '@/components/dialogs/TemplatePickDialog'
import { formatDate } from '@/lib/utils/dateUtils'

const WorkAreaDetailsDialog = dynamic(() => import('@/components/dialogs/WorkAreaDetailsDialog'), { ssr: false })

export default function PublishPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0])
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([])
  const [selectedAreas, setSelectedAreas] = useState<number[]>([])
  const [detailsWorkArea, setDetailsWorkArea] = useState<WorkArea | null>(null)
  const [email, setEmail] = useState('')
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

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

  const handleGeneratePDF = async (template: PdfTemplate) => {
    try {
      const selectedWorkAreas = workAreas.filter(area => selectedAreas.includes(area.id));
      const pdfData = await generatePDF(selectedWorkAreas, template);
      
      const byteCharacters = atob(pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'work_areas_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF: ' + (error as Error).message);
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
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Arbeitsbereiche veröffentlichen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Startdatum"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Enddatum"
        />
        <Button onClick={handleFetchAreas} className="w-full">Bereiche abrufen</Button>
      </div>
      <div className="overflow-x-auto mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Auswählen</TableHead>
              <TableHead>Kurzbeschreibung</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Einschränkungsstufe</TableHead>
              <TableHead>Startzeit</TableHead>
              <TableHead>Endzeit</TableHead>
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
                <TableCell className="font-medium">{area.shortDescription}</TableCell>
                <TableCell>{area.type}</TableCell>
                <TableCell>{area.restrictionLevel}</TableCell>
                <TableCell>{formatDate(area.startTime)}</TableCell>
                <TableCell>{formatDate(area.endTime)}</TableCell>
                <TableCell><Button size="sm" onClick={() => setDetailsWorkArea(area)}>Ansehen</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Button onClick={() => setIsTemplateDialogOpen(true)} className="w-full">PDF generieren und herunterladen</Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail-Adresse"
          />
          <Button onClick={handleSendPDF} className="w-full">PDF per E-Mail senden</Button>
        </div>
      </div>
      {detailsWorkArea && <WorkAreaDetailsDialog workArea={detailsWorkArea} onClose={() => setDetailsWorkArea(null)} />}
      {
        isTemplateDialogOpen && 
          <TemplatePickDialog 
            handleSelectTemplate={(template: PdfTemplate) => {handleGeneratePDF(template)}} 
            isOpen={isTemplateDialogOpen} 
            setIsOpen={setIsTemplateDialogOpen} 
          />
      }
    </div>
  )
}