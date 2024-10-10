"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin} from 'lucide-react'
import { fetchAreas } from '../public_actions'
import { Area } from '@prisma/client'
import dynamic from 'next/dynamic'
import toGeoJSON from '@mapbox/togeojson'

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
        if (geoJson && tourDate) {
            const response = await fetchAreas(tourDate, tourDate)
            setAreas(response)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-4xl font-bold mb-6 text-center">Forest Route Checker</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload GPX</TabsTrigger>
                    <TabsTrigger value="draw">Draw Route</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload GPX File</CardTitle>
                            <CardDescription>Choose a GPX file containing your planned route</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">GPX files only</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" accept=".gpx" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                    {geoJson && (
                        <Card>
                            <CardContent>
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
                            <CardTitle>Draw Route on Map</CardTitle>
                            <CardDescription>Use the drawing tools to create your route</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">Click the polyline tool <MapPin className="inline w-4 h-4" /> on the map to start drawing your route.</p>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="p-0">
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
