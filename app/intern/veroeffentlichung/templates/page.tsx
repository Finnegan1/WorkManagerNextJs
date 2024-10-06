'use client'

import React, { useState, useEffect } from "react";
import { createTemplate, getTemplates, deleteTemplate } from './actions';
import { PdfTemplate } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BLANK_PDF } from "@pdfme/common";
import Link from "next/link";

export default function Page() {
    const router = useRouter()
    const [templates, setTemplates] = useState<PdfTemplate[]>([]);

    useEffect(() => {
        async function fetchTemplates() {
            const templates = await getTemplates();
            setTemplates(templates);
        }
        fetchTemplates();
    }, []);

    const handleCreate = async () => {
        const template = await createTemplate({
            name: 'Neue Vorlage',
            description: 'Beschreibung der neuen Vorlage',
            schemas: [],
            basePdf: BLANK_PDF,
            neededFields: [],
        })
        router.push(`/intern/veroeffentlichung/templates/bearbeiten/${template.id}`);
    };

    const handleDelete = async (id: number) => {
        await deleteTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
    };

    return (
        <Card className="mb-8">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-4">
          <CardTitle>Alle Vorlagen</CardTitle>
            <Button onClick={() => handleCreate()}>Vorlage erstellen</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Beschreibung</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(template => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>
                    <Link href={`/intern/veroeffentlichung/templates/bearbeiten/${template.id}`}>
                        <Button
                            onClick={() => {}}
                            variant="outline"
                            className="mr-2"
                        >
                            Bearbeiten
                        </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(template.id)}
                      variant="destructive"
                    >
                      Löschen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
}