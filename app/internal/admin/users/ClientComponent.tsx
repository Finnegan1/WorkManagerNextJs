'use client'

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, TrashIcon } from 'lucide-react'
import { CreateUser, DeleteUser } from './actions'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ClientComponent = (
    {
        initialUsers
    }: {
        initialUsers: {
            id: string
            email: string
            role: string
            createdAt: Date
        }[]
    }
) => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('USER')
    const [users, setUsers] = useState(initialUsers)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const response = await CreateUser(formData)
        console.log(response)
        if (response) {
            setUsers([...users, response])
        }
    }

    const handleDeleteUser = async (id: string) => {
        await DeleteUser(id)
        setUsers(users.filter(user => user.id !== id))
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div>
                <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter user's email"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="PUBLISHER">Publisher</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">
                            <PlusIcon className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    </form>
                </Suspense>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-4">Existing Users</h2>
                <Suspense fallback={<div>Loading...</div>}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{format(new Date(user.createdAt), 'dd.MM.yyyy')}</TableCell>
                                    <TableCell>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Suspense>
            </div>
        </div>
    )
}

export { ClientComponent }