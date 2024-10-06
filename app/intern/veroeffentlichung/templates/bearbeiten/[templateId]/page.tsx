'use client'

import { Designer } from '@pdfme/ui'
import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileUp, Download, Save, RefreshCw, FileText, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getTemplate, updateTemplate } from '../../actions'
import { PdfTemplate } from '@prisma/client'
import { barcodes, ellipse, line, multiVariableText, rectangle, svg, table, image } from '@pdfme/schemas'
import { useRouter } from 'next/navigation'


export default function CreateTemplatePage({ params }: { params: { templateId: string } }) {

  const { templateId } = params
  const [template, setTemplate] = useState<PdfTemplate | null>(null)
  const designerRef = useRef<HTMLDivElement | null>(null)
  const designer = useRef<Designer | null>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTemplate = async () => {
      const template = await getTemplate(Number(templateId))
      console.log('schemas', template.schemas)
      setTemplate({
        ...template,
        schemas: template.schemas,
      })
    }
    fetchTemplate()
  }, [templateId])

  const handleBasePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const basePdf = e.target?.result as string
        if (template) {
          setTemplate({ ...template, basePdf })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    console.log('designer.current', designer.current)
    if (designer.current) {
      console.log('template', template)
      console.log('template.schemas', template?.schemas)
      designer.current.updateTemplate({
        basePdf: template?.basePdf || '',
        schemas: template?.schemas as any[] || [],
      })
    }
  }, [template, designer, designer.current])

  const saveTemplate = async () => {
    console.log('template', template)
    console.log('template.schemas', template?.schemas)
    await updateTemplate(
      Number(templateId),
      {
        name: template?.name || '',
        description: template?.description || '',
        basePdf: template?.basePdf || '',
        schemas: designer.current?.getTemplate().schemas as any[] || [],
        neededFields: template?.neededFields || [],
      }
    )
    setIsSaveDialogOpen(false)
    router.push('/intern/veroeffentlichung/templates')
  }

  useEffect(() => {
    console.log('designerRef.current', designerRef.current)
    if (designerRef.current && template?.basePdf) {
      designer.current = new Designer({
        domContainer: designerRef.current,
        plugins: {
          image,
          svg,
          qrcode: barcodes.qrcode,
          multiVariableText,
          line,
          rectangle,
          ellipse,
          table
        },
        template: {
          basePdf: template.basePdf,
          schemas: designer.current?.getTemplate().schemas as any[] || template.schemas || [],
        },
      })
      designer.current.onSaveTemplate(saveTemplate)
    }

    return () => {
      if (designer.current) {
        designer.current.destroy()
      }
    }
  }, [designerRef, template?.basePdf])

  if (!template) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-auto flex flex-col">
      <Card className="flex-grow rounded-none border-0 shadow-none">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">PDF Template Designer</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <label htmlFor="basePdfUpload" className="flex items-center cursor-pointer w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Base PDF
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <label htmlFor="templateUpload" className="flex items-center cursor-pointer w-full">
                  <FileUp className="w-4 h-4 mr-2" />
                  Load Template
                </label>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsSaveDialogOpen(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="h-[calc(100%-5rem)] flex flex-col p-0">
          <div className="hidden">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleBasePdfChange}
              className="hidden"
              id="basePdfUpload"
            />
            <Button asChild variant="secondary">
              <label htmlFor="basePdfUpload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Change Base PDF
              </label>
            </Button>
            <Input
              type="file"
              accept="application/json"
              className="hidden"
              id="templateUpload"
            />
            <Button asChild variant="secondary">
              <label htmlFor="templateUpload" className="cursor-pointer">
                <FileUp className="w-4 h-4 mr-2" />
                Load Template
              </label>
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button variant="secondary" onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Template
            </Button>
            <Button variant="default">
              <FileText className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
          <div
            ref={designerRef}
            className="flex-grow border border-gray-200 rounded-lg mx-6"
          />
        </CardContent>
      </Card>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={template?.name || ''}
                onChange={(e) => setTemplate({ ...template!, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={template?.description || ''}
                onChange={(e) => setTemplate({ ...template!, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}