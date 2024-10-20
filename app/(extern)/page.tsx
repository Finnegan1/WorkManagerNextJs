'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import dynamic from 'next/dynamic';
import { Area } from "@prisma/client";
import { formatDate } from "@/lib/utils/dateUtils";
import { fetchAreas } from "./public_actions";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const AreasOverviewMapExtern = dynamic(() => import("@/components/maps/AreasOverviewMapExtern"), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full" />
});

export default function Home() {
  const router = useRouter()

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]);
  const [areas, setAreas] = useState<Area[]>([]);

  const handleFetchAreas = async () => {
    if (startDate && endDate) {
      const fetchedAreas = await fetchAreas(
        new Date((new Date(startDate + 'T00:00:00').toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))),
        new Date((new Date(endDate + 'T23:59:59').toLocaleString('en-US', { timeZone: 'Europe/Berlin' })))
      );
      setAreas(fetchedAreas);
    }
  };

  useEffect(() => {
    handleFetchAreas()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Willkommen bei dem Arbeits-Tracker des S. Forst</h1>
      <p className="mb-4">Hier können Sie Informationen zu laufenden Arbeiten und Einschränkungen in den Wäldern finden.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Startdatum"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Enddatum"
        />
        <Button onClick={handleFetchAreas}>Bereiche abrufen</Button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Kartenübersicht</h2>
        <AreasOverviewMapExtern areas={areas} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Detaillierte Übersicht</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kurzbeschreibung</TableHead>
              <TableHead>Beschreibung</TableHead>
              <TableHead>Einschränkungsstufe</TableHead>
              <TableHead>Startzeit</TableHead>
              <TableHead>Endzeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id} onClick={() => router.push(`/${area.id}`)}>
                <TableCell>{area.shortDescription}</TableCell>
                <TableCell>{area.workDescription}</TableCell>
                <TableCell>{area.restrictionLevel}</TableCell>
                <TableCell>{formatDate(area.startTime)}</TableCell>
                <TableCell>{formatDate(area.endTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
