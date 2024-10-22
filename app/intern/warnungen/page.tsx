'use client'

import { Card } from '@/components/ui/card';
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import AreaTable from "./AreaTable";
import { Switch } from '@/components/ui/switch';
import { Area } from '@prisma/client';
import { getAreas } from './action';

const DynamicButton = dynamic(() => import('@/components/ui/button').then(mod => mod.Button), {
    ssr: false
});

const WorkAreasPage = () => {
    const Map = useMemo(() => dynamic(
        () => import('@/components/maps/AreasOverviewMapIntern'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const [areas, setAreas] = useState<Area[]>([]);
    const [onlyOwn, setOnlyOwn] = useState(false);

    useEffect(() => {
        getAreas(onlyOwn).then(setAreas);
    }, [onlyOwn]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Verwalte Waldarbeiten</h1>
            <p className="text-base mb-4">Hier kannst du Waldarbeiten verwalten und planen.</p>
            <Card className="mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold m-4">Übersicht der Arbeitsbereiche</h2>
                    <div className="flex items-center gap-2 m-4">
                        Nur eigene Arbeitsbereiche <Switch checked={onlyOwn} onCheckedChange={setOnlyOwn} />
                    </div>
                </div>
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
