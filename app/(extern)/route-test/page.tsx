"use client"

import { useState, useRef } from 'react'
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { convertGPXToGeoJSON } from '@/lib/mapUtils'
import { Upload, MapPin } from 'lucide-react'
import { fetchAreas } from '../public_actions'
import { Area } from '@prisma/client'


export default function RouteChecker() {
    const [geoJson, setGeoJson] = useState<GeoJSON.FeatureCollection | null>(null)
    const [tourDate, setTourDate] = useState<Date>(new Date())
    const [areas, setAreas] = useState<Area[]>([])
    const [activeTab, setActiveTab] = useState("upload")
    const mapRef = useRef<L.Map | null>(null)

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const geojson = convertGPXToGeoJSON(await file.text())
            setGeoJson(geojson)
        }
    }

    const handleDrawCreated = (e: L.LeafletMouseEvent) => {
        const { layer } = e
        const geoJSON = layer.toGeoJSON()
        setGeoJson(geoJSON)
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
                    {
                        geoJson && (
                            <Card>
                                <CardContent>
                                    <div className="h-[500px]">
                                        <MapContainer center={[51.0504, 13.7373]} zoom={8} ref={mapRef} style={{ height: '100%', width: '100%' }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <GeoJSON data={geoJson} style={{ color: 'green' }} />
                                            {
                                                areas.map((area) => (
                                                    <>
                                                        <GeoJSON data={area.restrictedAreas as unknown as GeoJSON.FeatureCollection} style={{ color: 'red' }} />
                                                        <GeoJSON data={area.rerouting as unknown as GeoJSON.FeatureCollection} style={{ color: 'blue' }} />
                                                    </>
                                                ))
                                            }
                                        </MapContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
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
                            <div className="h-[500px]">
                                <MapContainer center={[51.0504, 13.7373]} zoom={8} ref={mapRef} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <FeatureGroup>
                                        <EditControl
                                            position="topright"
                                            onCreated={handleDrawCreated}
                                            draw={{
                                                rectangle: false,
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polygon: false,
                                            }}
                                        />
                                    </FeatureGroup>
                                </MapContainer>
                            </div>
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