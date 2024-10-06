import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import dynamic from "next/dynamic";
import { useMemo } from "react";
import prisma from '@/lib/prisma';
import { tokenDecoded } from '@/lib/utils/auth';
import Link from 'next/link';

const DynamicButton = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), {
  ssr: false
});

const DynamicInput = dynamic(() => import('@/components/ui/input').then(mod => mod.Input), {
  ssr: false
});

const WorkAreasPage = async () => {
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/WorkAreasOverviewMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const token = await tokenDecoded()
    console.log(token)
    console.log(token.user.id)
    const workAreas = await prisma.workArea.findMany({
        where: {
            createdById: token.user.id
        }
    });

    console.log(workAreas)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Verwalte deine Waldarbeiten</h1>
            <p className="text-base mb-4">Hier kannst du deine Waldarbeiten verwalten und planen.</p>
            <Card className="mb-4">
                <h2 className="text-xl font-semibold m-4">Übersicht der Arbeitsbereiche</h2>
                <div className="h-[400px] w-full">
                    <Map workAreas={workAreas} posix={[51.505, 13.7373]} zoom={7} />
                </div>
            </Card>

            <Link href="/intern/warnungen/erstellen">
                <DynamicButton className="mb-4">
                    Neue Workarea erstellen
                </DynamicButton>
            </Link>


            {workAreas.length === 0 ? (
                <p className="text-red-500">Keine Arbeitsbereiche gefunden</p>
            ) : (
                <>
                    <DynamicInput placeholder="Type a keyword..." className="mb-4" />
                    <Table className="min-w-full bg-white">
                        <TableHeader className="bg-gray-200">
                            <TableRow>
                                <TableCell className="px-4 py-2 border">ID</TableCell>
                                <TableCell className="px-4 py-2 border">Name</TableCell>
                                <TableCell className="px-4 py-2 border">Art</TableCell>
                                <TableCell className="px-4 py-2 border">Zugangsbeschränkung</TableCell>
                                <TableCell className="px-4 py-2 border">Startzeit</TableCell>
                                <TableCell className="px-4 py-2 border">Endzeit</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workAreas.map((workArea) => (
                                <TableRow key={workArea.id} className="hover:bg-gray-100">
                                    <TableCell className="px-4 py-2 border">{workArea.id}</TableCell>
                                    <TableCell className="px-4 py-2 border">{workArea.name}</TableCell>
                                    <TableCell className="px-4 py-2 border">{workArea.type}</TableCell>
                                    <TableCell className="px-4 py-2 border">{workArea.restrictionLevel}</TableCell>
                                    <TableCell className="px-4 py-2 border">{new Date(workArea.startTime).toLocaleString()}</TableCell>
                                    <TableCell className="px-4 py-2 border">{new Date(workArea.endTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default WorkAreasPage;
