'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { formatDate } from '@/lib/utils/dateUtils'
import { Calendar as CalendarIcon, MapPin, AlertTriangle, TreePine, Info } from "lucide-react"
import { createWorkArea } from './actions'
import dynamic from 'next/dynamic'

const CreateWorkAreaMap = dynamic(() => import('@/components/maps/CreateWorkAreaMap'), {
  loading: () => <p>Karte wird geladen...</p>,
  ssr: false
})

export default function CreateWorkAreaForm() {
  const [area, setArea] = useState<any>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    name: '',
    type: 'forestwork',
    restrictionLevel: 'none',
    autoEnd: false,
    description: '',
    rerouting: '',
  })

  const { toast } = useToast()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, autoEnd: checked }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch (true) {
      case !formData.name:
        toast({
          title: 'Name ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !formData.type:
        toast({
          title: 'Typ ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !formData.restrictionLevel:
        toast({
          title: 'Einschränkungsstufe ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !startDate:
        toast({
          title: 'Startdatum ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !endDate:
        toast({
          title: 'Enddatum ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !formData.description:
        toast({
          title: 'Beschreibung ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !formData.rerouting:
        toast({
          title: 'Umleitung ist erforderlich',
          variant: 'destructive',
        });
        return;
      case !area:
        toast({
          title: 'Arbeitsbereich ist erforderlich',
          variant: 'destructive',
        });
        return;
      default:
        break;
    }

    const form = new FormData(event.target as HTMLFormElement);
    form.append('createdById', 'YOUR_USER_ID');
    form.append('name', formData.name);
    form.append('type', formData.type);
    form.append('restrictionLevel', formData.restrictionLevel);
    form.append('startTime', startDate ? startDate.toISOString() : '');
    form.append('endTime', endDate ? endDate.toISOString() : '');
    form.append('autoEnd', formData.autoEnd.toString());
    form.append('description', formData.description);
    form.append('rerouting', formData.rerouting);
    form.append('area', JSON.stringify(area));

    const result = await createWorkArea(form);
    console.log(result);
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return '';
    return formatDate(date);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Neuen Arbeitsbereich erstellen</CardTitle>
          <CardDescription>Fülle das Formular aus, um einen neuen Arbeitsbereich zu erstellen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info">
              <AccordionTrigger>Grundinformationen</AccordionTrigger>
              <AccordionContent className="space-y-4 m-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Typ</Label>
                  <RadioGroup 
                    name="type" 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))} 
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="forestwork" id="forestwork" />
                      <Label htmlFor="forestwork"><TreePine className="w-4 h-4 inline mr-2" />Waldarbeit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nature" id="nature" />
                      <Label htmlFor="nature"><Info className="w-4 h-4 inline mr-2" />Natur</Label>
                    </div>
                  </RadioGroup>
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

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="autoEnd" 
                    name="autoEnd" 
                    checked={formData.autoEnd}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="autoEnd">Automatisches Ende</Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="description">
              <AccordionTrigger>Beschreibung und Umleitung</AccordionTrigger>
              <AccordionContent className="space-y-4 m-2">
                <div className="space-y-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rerouting">Umleitung</Label>
                  <Textarea 
                    id="rerouting" 
                    name="rerouting" 
                    value={formData.rerouting}
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
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            Arbeitsbereich erstellen
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}