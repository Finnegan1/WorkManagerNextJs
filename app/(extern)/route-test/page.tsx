"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, AlertCircle} from 'lucide-react'
import { fetchAreas } from '../public_actions'
import { Area } from '@prisma/client'
import dynamic from 'next/dynamic'
import toGeoJSON from '@mapbox/togeojson'
import turf from '@turf/turf'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export const convertGPXToGeoJSON = (gpxContent: string) => {
    const parser = new DOMParser();
    const gpxDom = parser.parseFromString(gpxContent, 'text/xml');
    const geojson = toGeoJSON.gpx(gpxDom);
    console.log(geojson)
    return geojson;
  };

const MapComponent = dynamic(() => import('@/components/maps/RouteTestMap'), { ssr: false })

export default function RouteChecker() {
    const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null)
    const [tourDate, setTourDate] = useState<Date>(new Date())
    const [areas, setAreas] = useState<Area[]>([])
    const [activeTab, setActiveTab] = useState("upload")
    const [intersectionFound, setIntersectionFound] = useState(false)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const geojson = convertGPXToGeoJSON(await file.text())
            setGeoJson(geojson)
        }
    }

    //L.LeafletMouseEvent
    const handleDrawCreated = (e: any) => {
        const { layer } = e
        const geoJSON = layer.toGeoJSON()
        setGeoJson(geoJSON as GeoJSON.FeatureCollection)
    }

    const handleCheckRoute = async () => {
        console.log(geoJson)
        if (geoJson && tourDate) {
            const response = await fetchAreas(tourDate, tourDate)
            //check if any of the areas are intersected by the route
            const intersectedAreas = response.filter((area) => {
                const areaGeoJSON = (area.restrictedAreas as any as GeoJSON.FeatureCollection).features[0]
                const routeFeature = (geoJson as GeoJSON.FeatureCollection).features[0]
                return turf.booleanIntersects(routeFeature, areaGeoJSON)
            })
            setAreas(intersectedAreas)
            setIntersectionFound(intersectedAreas.length > 0)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-4xl font-bold mb-6 text-center">Routenprüfer</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">GPX-Datei hochladen</TabsTrigger>
                    <TabsTrigger value="draw">Route auf der Karte zeichnen</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                    <Card>
                        <CardHeader>
                            <CardTitle>GPX-Datei hochladen</CardTitle>
                            <CardDescription>Wählen Sie eine GPX-Datei mit Ihrer geplanten Route aus</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Klicken Sie zum Hochladen</span> oder ziehen Sie die Datei hierher</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Nur GPX-Dateien</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" accept=".gpx" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                    {geoJson && (
                        <Card>
                            <CardContent>
                                {intersectionFound && (
                                    <Alert>
                                        <AlertCircle className="w-4 h-4" />
                                        <AlertTitle>Intersection found</AlertTitle>
                                        <AlertDescription>Die Route schneidet sich mit den folgenden Bereichen:</AlertDescription>
                                    </Alert>
                                )}
                                <MapComponent
                                    geoJson={geoJson}
                                    areas={areas}
                                    isDrawMode={false}
                                    onDrawCreated={() => {}}
                                />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="draw">
                    <Card>
                        <CardHeader>
                            <CardTitle>Route auf der Karte zeichnen</CardTitle>
                            <CardDescription>Verwenden Sie die Zeichenwerkzeuge, um Ihre Route zu erstellen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">Klicken Sie auf das Polyline-Werkzeug <MapPin className="inline w-4 h-4" /> auf der Karte, um mit dem Zeichnen Ihrer Route zu beginnen.</p>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="p-0">
                            {intersectionFound && (
                                <Alert>
                                    <AlertCircle className="w-4 h-4" />
                                    <AlertTitle>Intersection found</AlertTitle>
                                    <AlertDescription>Die Route schneidet sich mit den folgenden Bereichen:</AlertDescription>
                                </Alert>
                            )}
                            <MapComponent
                                geoJson={geoJson}
                                areas={areas}
                                isDrawMode={true}
                                onDrawCreated={handleDrawCreated}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="flex justify-center mb-6">
                <Input
                    type="date"
                    defaultValue={tourDate?.toISOString().split('T')[0]}
                    onChange={(e) => setTourDate(new Date(e.target.value))}
                    placeholder="Tourdatum"
                />
                <Button onClick={handleCheckRoute} size="lg">
                    Check Route
                </Button>
            </div>
        </div>
    )
}
