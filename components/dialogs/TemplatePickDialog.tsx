import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PdfTemplate } from "@prisma/client";
import { getTemplates } from "@/app/internal/publication/templates/actions";
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
    handleSelectTemplate: (template: PdfTemplate) => void, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>> 
}) {
    const [templates, setTemplates] = useState<PdfTemplate[]>([]);

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
                <DialogTitle>Select Template</DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        handleSelectTemplate(template);
                        setIsOpen(false);
                      }}>
                        Select
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