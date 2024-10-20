import { Card } from '@/components/ui/card';
import dynamic from "next/dynamic";
import { useMemo } from "react";
import prisma from '@/lib/prisma';
import { tokenDecoded } from '@/lib/utils/auth';
import Link from 'next/link';
import AreaTable from "./AreaTable";

const DynamicButton = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), {
    ssr: false
});

const WorkAreasPage = async () => {
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/AreasOverviewMapIntern'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const token = await tokenDecoded()
    const areas = await prisma.area.findMany({
        where: {
            createdById: token.user.id
        }
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Verwalte deine Waldarbeiten</h1>
            <p className="text-base mb-4">Hier kannst du deine Waldarbeiten verwalten und planen.</p>
            <Card className="mb-4">
                <h2 className="text-xl font-semibold m-4">Übersicht der Arbeitsbereiche</h2>
                <div className="h-[400px] w-full">
                    <Map areas={areas} posix={[51.505, 13.7373]} zoom={7}/>
                </div>
            </Card>

            <Link href="/intern/warnungen/erstellen">
                <DynamicButton className="mb-4">
                    Neue Arbeitsbereich erstellen
                </DynamicButton>
            </Link>
            <AreaTable areas={areas} />
        </div>
    );
};

export default WorkAreasPage;
