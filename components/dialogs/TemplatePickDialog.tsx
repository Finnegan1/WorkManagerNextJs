import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PdfTemplate } from "@prisma/client";
import { getTemplates } from "@/app/intern/veroeffentlichung/templates/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TemplatePickDialog({ 
    handleSelectTemplate, 
    isOpen, 
    setIsOpen 
}: { 
    handleSelectTemplate: (template: string) => void, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>> 
}) {
    const [templates, setTemplates] = useState<string[]>([]);

    useEffect(() => {
        async function fetchTemplates() {
            const templates = await getTemplates();
            setTemplates(templates);
        }
        fetchTemplates();
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Vorlage auswählen</DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template}>
                    <TableCell>{template}</TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        handleSelectTemplate(template);
                        setIsOpen(false);
                      }}>
                        Auswählen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
    )
}