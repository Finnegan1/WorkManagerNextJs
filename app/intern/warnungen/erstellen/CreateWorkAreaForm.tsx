'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatDate } from '@/lib/utils/dateUtils'
import { Calendar as CalendarIcon, MapPin, AlertTriangle } from "lucide-react"
import { createArea, getForestryRanges } from './actions'
import dynamic from 'next/dynamic'

const CreateWorkAreaMap = dynamic(() => import('@/components/maps/CreateWorkAreaMap'), {
  loading: () => <p>Karte wird geladen...</p>,
  ssr: false
})

const CreateReroutingMap = dynamic(() => import('@/components/maps/CreateReroutingMap'), {
  loading: () => <p>Karte wird geladen...</p>,
  ssr: false
})

export default function CreateAreaForm() {
  const [forestryRanges, setForestryRanges] = useState<any>([])
  const [area, setArea] = useState<any>(null)
  const [rerouting, setRerouting] = useState<any>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    shortDescription: '',
    information: '',
    workDescription: '',
    forestSection: '',
    trailsInArea: '',
    restrictionLevel: 'none',
    forestryRangeId: '',
  })

  useEffect(() => {
    const fetchForestryRanges = async () => {
      const ranges = await getForestryRanges()
      setForestryRanges(ranges)
    }
    fetchForestryRanges()
  }, [])

  const { toast } = useToast()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch (true) {
      case !formData.shortDescription:
      case !formData.information:
      case !startDate:
      case !endDate:
      case !formData.workDescription:
      case !formData.forestSection:
      case !formData.trailsInArea:
      case !formData.restrictionLevel:
      case !formData.forestryRangeId:
      case !rerouting:
      case !area:
        toast({
          title: 'Alle Felder sind erforderlich',
          variant: 'destructive',
        });
        return;
      default:
        break;
    }

    const form = new FormData(event.target as HTMLFormElement);
    form.append('createdById', 'YOUR_USER_ID');
    form.append('shortDescription', formData.shortDescription);
    form.append('information', formData.information);
    form.append('startTime', startDate ? startDate.toISOString() : '');
    form.append('endTime', endDate ? endDate.toISOString() : '');
    form.append('workDescription', formData.workDescription);
    form.append('forestSection', formData.forestSection);
    form.append('trailsInArea', formData.trailsInArea);
    form.append('restrictionLevel', formData.restrictionLevel);
    form.append('forestryRangeId', formData.forestryRangeId);
    form.append('restrictedAreas', JSON.stringify(area));
    form.append('rerouting', JSON.stringify(rerouting));

    const result = await createArea(form);
    console.log(result);
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return '';
    return formatDate(date);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Neuen Bereich erstellen</CardTitle>
          <CardDescription>Fülle das Formular aus, um einen neuen Bereich zu erstellen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info">
              <AccordionTrigger>Grundinformationen</AccordionTrigger>
              <AccordionContent className="space-y-4 m-2">
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Kurzbeschreibung</Label>
                  <Input 
                    id="shortDescription" 
                    name="shortDescription" 
                    value={formData.shortDescription} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="information">Information</Label>
                  <Textarea 
                    id="information" 
                    name="information" 
                    value={formData.information} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restrictionLevel">Einschränkungsstufe</Label>
                  <Select 
                    name="restrictionLevel" 
                    value={formData.restrictionLevel} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, restrictionLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Einschränkungsstufe auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Keine</SelectItem>
                      <SelectItem value="attention">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />Achtung
                      </SelectItem>
                      <SelectItem value="danger">
                        <AlertTriangle className="w-4 h-4 inline mr-2 text-red-500" />Gefahr
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forestryRangeId">Forstamt</Label>
                  <Select 
                    name="forestryRangeId" 
                    value={formData.forestryRangeId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, forestryRangeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Forstamt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {forestryRanges.map((range: any) => (
                        <SelectItem key={range.id} value={range.id}>{range.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="time-info">
              <AccordionTrigger>Zeitinformationen</AccordionTrigger>
              <AccordionContent className="space-y-4 m-2">
                <div className="flex flex-col space-y-2">
                  <Label>Startzeit</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? formatDateForDisplay(startDate) : <span>Startdatum auswählen</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label>Endzeit</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDateForDisplay(endDate) : <span>Enddatum auswählen</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="description">
              <AccordionTrigger>Beschreibung und Details</AccordionTrigger>
              <AccordionContent className="space-y-4 m-2">
                <div className="space-y-2">
                  <Label htmlFor="workDescription">Arbeitsbeschreibung</Label>
                  <Textarea 
                    id="workDescription" 
                    name="workDescription" 
                    value={formData.workDescription}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forestSection">Forstabschnitt</Label>
                  <Input 
                    id="forestSection" 
                    name="forestSection" 
                    value={formData.forestSection}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailsInArea">Betroffene Wege</Label>
                  <Input 
                    id="trailsInArea" 
                    name="trailsInArea" 
                    value={formData.trailsInArea}
                    onChange={handleInputChange}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area">
              <AccordionTrigger>Arbeitsbereich</AccordionTrigger>
              <AccordionContent className="m-2">
                <div className="space-y-2">
                  <div className="h-[400px] w-full border rounded-md overflow-hidden">
                    <CreateWorkAreaMap currentArea={area} onAreaChange={setArea} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rerouting">
              <AccordionTrigger>Umleitung</AccordionTrigger>
              <AccordionContent className="m-2">
                <div className="space-y-2">
                  <div className="h-[400px] w-full border rounded-md overflow-hidden">
                    <CreateReroutingMap currentArea={area} currentRerouting={rerouting} onReroutingChange={setRerouting} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

                
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Bereich erstellen
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}