import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import prisma from '@/lib/prisma'
import { formatDate } from '@/lib/utils/dateUtils'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, AlertTriangleIcon, ClockIcon, UserIcon, FileTextIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { DeleteAlertDialog } from './DeleteWorkAreaDialog'

const WorkAreaEntryMap = dynamic(() => import('@/components/maps/WorkAreaEntryMap'), {
  loading: () => <p>A map is loading</p>,
  ssr: false
})


export default async function WorkAreaDetail({ params }: { params: { workAreaId: string } }) {
  const workAreaId = parseInt(params.workAreaId)
  const workArea = await prisma.workArea.findUnique({
    where: { id: workAreaId },
    include: {
      workers: true,
      changeLogs: {
        include: {
          changedBy: true
        }
      }
    }
  })
  
  if (!workArea) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/intern/warnungen" className="hover:text-primary">Arbeitsbereiche</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="font-semibold text-foreground">{workArea.name}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-6">{workArea.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Details zum Arbeitsbereich</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-semibold mr-2">Typ:</span> {workArea.type}
            </div>
            <div className="flex items-center">
              <AlertTriangleIcon className="mr-2 h-5 w-5 text-warning" />
              <span className="font-semibold mr-2">Einschränkungsstufe:</span> {workArea.restrictionLevel}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-semibold mr-2">Startzeit:</span> {formatDate(workArea.startTime)}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-semibold mr-2">Endzeit:</span> {formatDate(workArea.endTime)}
            </div>
            <div className="flex items-start">
              <FileTextIcon className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <span className="font-semibold">Beschreibung:</span>
                <p className="mt-1">{workArea.description}</p>
              </div>
            </div>
            <div className="flex items-start">
              <ArrowRightIcon className="mr-2 h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <span className="font-semibold">Umleitung:</span>
                <p className="mt-1">{workArea.rerouting}</p>
              </div>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-semibold mr-2">Automatisches Ende:</span>
              {workArea.autoEnd ? (
                <CheckCircleIcon className="h-5 w-5 text-success" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Karte</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <WorkAreaEntryMap
                workAreas={[workArea]}
                className="h-full w-full"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Zugewiesene Mitarbeiter</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {workArea.workers.map(worker => (
                <li key={worker.id} className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  {worker.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Änderungsverlauf</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {workArea.changeLogs.map(log => (
                <li key={log.id} className="flex items-center">
                  <ClockIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{log.changeType} von {log.changedBy.name} am {formatDate(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 flex space-x-4">
        <Button asChild>
          <Link href={`/intern/warnungen/${workArea.id}/bearbeiten`}>Bearbeiten</Link>
        </Button>
        <DeleteAlertDialog workAreaId={workArea.id} />
      </div>
    </div>
  )
}