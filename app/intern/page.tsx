import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, AlertTriangle, Plus } from 'lucide-react'
import { PrismaClient } from '@prisma/client'
import { tokenDecoded } from '@/lib/utils/auth'
import { formatDate } from '@/lib/utils/dateUtils'

export default async function Home() {
  const prisma = new PrismaClient()
  const token = await tokenDecoded()

  // Fetch current projects (work areas that have started but not ended)
  const currentDate = new Date( (new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }) )).setHours(0, 0, 0, 0))

  const currentAreas = await prisma.area.findMany({
    where: {
      startTime: { lte: currentDate },
      endTime: { gte: currentDate },
      createdById: token.user.id
    },
    orderBy: { startTime: 'asc' },
    take: 5,
  })
  
  // Fetch upcoming tasks (work areas that haven't started yet)
  const upcomingAreas = await prisma.area.findMany({
    where: {
      startTime: { gt: new Date() },
      createdById: token.user.id
    },
    orderBy: { startTime: 'asc' },
    take: 5 // Limit to 5 results
  })

  // Count areas with restricted access
  const restrictedAreasCount = await prisma.area.count({
    where: {
      restrictionLevel: { not: 'none' },
      endTime: { gt: new Date() },
      createdById: token.user.id
    }
  })

  //await prisma.$disconnect()

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Übersicht</h1>
        <Link href="/intern/warnungen/erstellen">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Neuen Sperreintrag hinzufügen
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Deine aktuellen Sperrungen</CardTitle>
            <CardDescription>Laufende Sperrungen im Wald</CardDescription>
          </CardHeader>
          <CardContent>
            {currentAreas.map(area => (
              <Link href={`/intern/warnungen/${area.id}`} key={area.id}>
                <div key={area.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{area.shortDescription}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <CalendarDays className="mr-2 h-4 w-4" /> {formatDate(area.startTime)} bis {formatDate(area.endTime)}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deine anstehenden Sperrungen</CardTitle>
            <CardDescription>Geplante Sperrungen für die nahe Zukunft</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAreas.map(area => (
              <Link href={`/intern/warnungen/${area.id}`} key={area.id}>
                <div key={area.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{area.shortDescription}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <CalendarDays className="mr-2 h-4 w-4" /> {formatDate(area.startTime)} bis {formatDate(area.endTime)}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Aktive Warnungen</AlertTitle>
        <AlertDescription>
          Es gibt derzeit {restrictedAreasCount} Bereiche mit eingeschränktem Zugang aufgrund laufender Sperrungen. 
          <Link href="/warnings" className="underline ml-1">Details anzeigen</Link>
        </AlertDescription>
      </Alert>

    </div>
  )
}