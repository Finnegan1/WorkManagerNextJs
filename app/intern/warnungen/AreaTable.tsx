"use client"

import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Area } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AreaTable({ areas }: { areas: Area[] }) {
    const [search, setSearch] = useState("")
    const router = useRouter()
    return <>
        <Input placeholder="Type a keyword..." className="mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Table className="min-w-full bg-white">
            <TableHeader className="bg-gray-200">
                <TableRow>
                    <TableCell className="px-4 py-2 border">ID</TableCell>
                    <TableCell className="px-4 py-2 border">Art</TableCell>
                    <TableCell className="px-4 py-2 border">Zugangsbeschränkung</TableCell>
                    <TableCell className="px-4 py-2 border">Startzeit</TableCell>
                    <TableCell className="px-4 py-2 border">Endzeit</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {areas.filter((area) => area.shortDescription.toLowerCase().includes(search.toLowerCase())).map((area) => (
                    <TableRow key={area.id} className="hover:bg-gray-100" onClick={() => router.push(`/intern/warnungen/${area.id}`)}>
                        <TableCell className="px-4 py-2 border">{area.id}</TableCell>
                        <TableCell className="px-4 py-2 border">{area.shortDescription}</TableCell>
                        <TableCell className="px-4 py-2 border">{area.restrictionLevel}</TableCell>
                        <TableCell className="px-4 py-2 border">{new Date(area.startTime).toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-2 border">{new Date(area.endTime).toLocaleString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}