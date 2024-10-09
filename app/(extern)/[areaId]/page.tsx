import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangleIcon, FileTextIcon, ArrowRightIcon, MapPinIcon, TreePineIcon } from 'lucide-react'
import { FeatureCollection } from 'geojson'

const AreaMap = dynamic(() => import('@/components/maps/AreaDetailsMap'), {
  loading: () => <Skeleton className="h-[600px w-full" />,
  ssr: false
})

export default async function AreaDetail({ params }: { params: { areaId: string } }) {
  const areaId = parseInt(params.areaId)
  const area = await prisma.area.findUnique({
    where: { id: areaId },
    include: {
      forestryRange: true,
    }
  })

  if (!area) {
    notFound()
  }

  const getRestrictionLevelBadge = (level: string) => {
    switch (level) {
      case 'none':
        return <Badge variant="outline">Keine Einschränkung</Badge>
      case 'attention':
        return <Badge variant="secondary">Achtung</Badge>
      case 'danger':
        return <Badge variant="destructive">Gefahr</Badge>
      case 'forbidden':
        return <Badge variant="destructive">Verboten</Badge>
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-0 max-w-7xl">
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Übersicht</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="font-semibold text-foreground">{area.shortDescription}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{area.shortDescription}</h1>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="map">Karte</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informationen</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <AlertTriangleIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-semibold mr-2">Einschränkungsstufe:</span>
                {getRestrictionLevelBadge(area.restrictionLevel)}
              </div>
              <div className="flex items-center">
                <TreePineIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-semibold mr-2">Forstamt:</span>
                {area.forestryRange.name}
              </div>
              <div className="flex items-start col-span-2">
                <FileTextIcon className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <span className="font-semibold">Information:</span>
                  <p className="mt-1">{area.information}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-semibold mr-2">Forstabschnitt:</span>
                {area.forestSection}
              </div>
              <div className="flex items-start col-span-2">
                <ArrowRightIcon className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <span className="font-semibold">Betroffene Wege:</span>
                  <ul className="list-disc list-inside mt-1">
                    {area.trailsInArea.map((trail, index) => (
                      <li key={index}>{trail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Karte</CardTitle>
              <CardDescription>Arbeitsbereich und Umleitung</CardDescription>
            </CardHeader>
            <CardContent className="h-[600px]">
              <AreaMap
                area={area.restrictedAreas as unknown as FeatureCollection}
                rerouting={area.rerouting as unknown as FeatureCollection}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}