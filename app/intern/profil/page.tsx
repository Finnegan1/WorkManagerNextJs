"use client"

import { useSession, signOut } from 'next-auth/react' // Updated import
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MailIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (status === "loading") {
    return <ProfileSkeleton />
  }

  if (!session?.user) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="text-center py-10">
          <p className="text-xl font-semibold text-gray-700">Keine Benutzerdaten verfügbar</p>
        </CardContent>
      </Card>
    )
  }

  const { user } = session

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess('Password changed successfully')
      setIsDialogOpen(false)
    } else {
      setError(data.error || 'An error occurred')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center flex flex-col items-center">
        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        <Badge variant="secondary" className="mt-2 w-fit">
          {user.role}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 justify-center">
          <MailIcon className="text-gray-500" />
          <span>{user.email}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button onClick={() => setIsDialogOpen(true)}>Passwort ändern</Button>
        <Button variant="destructive" onClick={() => signOut()}>Abmelden</Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passwort ändern</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Altes Passwort</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Neues Passwort</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <DialogFooter>
              <Button type="submit">Passwort ändern</Button>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function ProfileSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-center">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-1/4 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  )
}