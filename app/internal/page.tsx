import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, AlertTriangle, Plus } from 'lucide-react'
import { PrismaClient } from '@prisma/client'
import { format } from 'date-fns'
import { getDecodedToken } from '@/lib/utils/auth'

export default async function Home() {
  const prisma = new PrismaClient()
  const token = await getDecodedToken()

  // Fetch current projects (work areas that have started but not ended)
  const currentProjects = await prisma.workArea.findMany({
    where: {
      startTime: { lte: new Date() },
      endTime: { gt: new Date() },
      createdById: token.user.id
    },
    orderBy: { startTime: 'asc' },
    take: 5,
  })

  // Fetch upcoming tasks (work areas that haven't started yet)
  const upcomingTasks = await prisma.workArea.findMany({
    where: {
      startTime: { gt: new Date() },
      createdById: token.user.id
    },
    orderBy: { startTime: 'asc' },
    take: 5 // Limit to 5 results
  })

  // Count areas with restricted access
  const restrictedAreasCount = await prisma.workArea.count({
    where: {
      restrictionLevel: { not: 'none' },
      endTime: { gt: new Date() },
      createdById: token.user.id
    }
  })

  await prisma.$disconnect()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">WorkManager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Projects</CardTitle>
            <CardDescription>Ongoing work in the forest</CardDescription>
          </CardHeader>
          <CardContent>
            {currentProjects.map(project => (
              <Link href={`/internal/work-areas/${project.id}`} key={project.id}>
                <div key={project.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <CalendarDays className="mr-2 h-4 w-4" /> {format(new Date(project.startTime), 'yyyy-MM-dd')} bis {format(new Date(project.endTime), 'yyyy-MM-dd')}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Scheduled work for the near future</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.map(task => (
              <Link href={`/internal/work-areas/${task.id}`} key={task.id}>
                <div key={task.id} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center mt-2">
                    <CalendarDays className="mr-2 h-4 w-4" /> {format(new Date(task.startTime), 'yyyy-MM-dd')} bis {format(new Date(task.endTime), 'yyyy-MM-dd')}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Active Warnings</AlertTitle>
        <AlertDescription>
          There are currently {restrictedAreasCount} areas with restricted access due to ongoing work. 
          <Link href="/warnings" className="underline ml-1">View details</Link>
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Work Entry
        </Button>
      </div>
    </div>
  )
}