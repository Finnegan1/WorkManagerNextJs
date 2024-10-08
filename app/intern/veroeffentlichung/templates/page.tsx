'use client'

import React, { useState, useEffect } from "react";
import { getTemplates, reloadTemplates } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
    const [templates, setTemplates] = useState<string[]>([]);
    const toast = useToast()

    useEffect(() => {
        async function fetchTemplates() {
            const templates = await getTemplates();
            setTemplates(templates);
        }
        fetchTemplates();
    }, []);

    const handleReloadTemplates = async () => {
        const result = await reloadTemplates()
        if (result) {
            toast.toast({
                title: 'Vorlagen neu geladen',
                description: 'Die Vorlagen wurden erfolgreich neu von der GitHub-Repository geladen.',
            })
            const templates = await getTemplates()
            setTemplates(templates)
        }
    }

    return (
        <Card className="mb-8">
        <CardHeader className="flex flex-row justify-between space-y-0 pb-4 gap-6">
          <CardTitle className="text-center text-nowrap flex items-center">Alle Vorlagen</CardTitle>
          <Button onClick={handleReloadTemplates}>Laden</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(template => (
                <TableRow key={template}>
                  <TableCell>{template}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
}