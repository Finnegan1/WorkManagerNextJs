'use client'

import { useState } from 'react'
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
import { Calendar as CalendarIcon, MapPin, AlertTriangle, X, Plus } from "lucide-react"
import dynamic from 'next/dynamic'
import { Area, WorkAreaRestrictionLevel } from '@prisma/client'

const FormRestrictedAreaMap = dynamic(() => import('@/components/maps/FormRestrictedAreaMap'), {
  loading: () => <p>Karte wird geladen...</p>,
  ssr: false
})

const FormReroutingMap = dynamic(() => import('@/components/maps/FormReroutingMap'), {
  loading: () => <p>Karte wird geladen...</p>,
  ssr: false
})

interface AreaFormProps {
  defaultValues?: Partial<Area>
  onSubmit: (formData: FormData) => Promise<void>
  forestryRanges: any[]
  title: string
  description: string
  submitButtonText: string
}

export default function AreaForm({ 
  defaultValues, 
  onSubmit, 
  forestryRanges, 
  title, 
  description, 
  submitButtonText 
}: AreaFormProps) {
  const [restrictedArea, setRestrictedArea] = useState<any>(defaultValues?.restrictedAreas || null)
  const [rerouting, setRerouting] = useState<any>(defaultValues?.rerouting || null)
  const [startDate, setStartDate] = useState<Date | undefined>(defaultValues?.startTime ? new Date(defaultValues.startTime) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(defaultValues?.endTime ? new Date(defaultValues.endTime) : undefined)
  const [formData, setFormData] = useState({
    shortDescription: defaultValues?.shortDescription || '',
    information: defaultValues?.information || '',
    workDescription: defaultValues?.workDescription || '',
    forestSection: defaultValues?.forestSection || '',
    trailsInArea: defaultValues?.trailsInArea || [],
    restrictionLevel: defaultValues?.restrictionLevel || 'none' as WorkAreaRestrictionLevel,
    forestryRangeId: defaultValues?.forestryRangeId || '',
  })
  const [trailsInAreaInput, setTrailsInAreaInput] = useState('')

  const { toast } = useToast()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    if (name === 'newTrailInArea') {
      setTrailsInAreaInput(value)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddTrail = (event: React.FormEvent) => {
    event.preventDefault()
    if (trailsInAreaInput.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        trailsInArea: [...prev.trailsInArea, trailsInAreaInput.trim()]
      }))
      setTrailsInAreaInput('')
    }
  }

  const handleRemoveTrail = (trailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      trailsInArea: prev.trailsInArea.filter(trail => trail !== trailToRemove)
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation checks
    switch (true) {
      case !formData.shortDescription:
      case !formData.information:
      case !startDate:
      case !endDate:
      case !formData.workDescription:
      case !formData.forestSection:
      case formData.trailsInArea.length === 0:
      case !formData.forestryRangeId:
      case !rerouting:
      case !restrictedArea:
        toast({
          title: 'Alle Felder sind erforderlich',
          variant: 'destructive',
        });
        return;
      default:
        break;
    }

    const form = new FormData(event.target as HTMLFormElement);
    form.append('shortDescription', formData.shortDescription);
    form.append('information', formData.information);
    form.append('startTime', startDate!.toISOString());
    form.append('endTime', endDate!.toISOString());
    form.append('workDescription', formData.workDescription);
    form.append('forestSection', formData.forestSection);
    form.append('trailsInArea', formData.trailsInArea.join('&,&'));
    form.append('restrictionLevel', formData.restrictionLevel);
    form.append('forestryRangeId', formData.forestryRangeId.toString());
    form.append('restrictedAreas', JSON.stringify(restrictedArea));
    form.append('rerouting', JSON.stringify(rerouting));

    await onSubmit(form);
    toast({
      title: 'Bereich erfolgreich gespeichert',
      variant: 'default',
    });
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
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, restrictionLevel: value as WorkAreaRestrictionLevel }))}
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
                    value={formData.forestryRangeId.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, forestryRangeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Forstamt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {forestryRanges.map((range: any) => (
                        <SelectItem key={range.id} value={range.id.toString()}>{range.name}</SelectItem>
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
                  <Label htmlFor="forestSection">Waldgebiet</Label>
                  <Input 
                    id="forestSection" 
                    name="forestSection" 
                    value={formData.forestSection}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailsInArea">Betroffene Wege</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="trailsInArea" 
                      name="newTrailInArea" 
                      value={trailsInAreaInput}
                      onChange={handleInputChange}
                      placeholder="Neuen Weg eingeben"
                    />
                    <Button type="button" onClick={handleAddTrail}>
                      <Plus className="w-4 h-4 mr-2" />
                      Hinzufügen
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.trailsInArea.map((trail, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveTrail(trail)}
                      >
                        {trail}
                        <X className="w-4 h-4 ml-2" />
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area">
              <AccordionTrigger>Arbeitsbereich</AccordionTrigger>
              <AccordionContent className="m-2">
                <div className="space-y-2">
                  <div className="h-[400px] w-full border rounded-md overflow-hidden">
                    <FormRestrictedAreaMap currentArea={restrictedArea} onAreaChange={setRestrictedArea} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rerouting">
              <AccordionTrigger>Umleitung</AccordionTrigger>
              <AccordionContent className="m-2">
                <div className="space-y-2">
                  <div className="h-[400px] w-full border rounded-md overflow-hidden">
                    <FormReroutingMap currentArea={restrictedArea} currentRerouting={rerouting} onReroutingChange={setRerouting} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            {submitButtonText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}