import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientComponent } from './ClientComponent'

const prisma = new PrismaClient()

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}

export default async function AdminPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Administrationsbereich</CardTitle>
          <CardDescription>Verwalten Sie die Benutzer für die Plattform</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientComponent initialUsers={users} /> 
        </CardContent>
      </Card>
    </div>
  )
}