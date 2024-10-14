'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { createArea, getForestryRanges } from './actions'
import AreaForm from '@/components/forms/AreaForm'

export default function CreateAreaForm() {
  const [forestryRanges, setForestryRanges] = useState<any>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchForestryRanges = async () => {
      const ranges = await getForestryRanges()
      setForestryRanges(ranges)
    }
    fetchForestryRanges()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    formData.append('createdById', 'YOUR_USER_ID');

    const result = await createArea(formData);
    console.log(result);
    
    toast({
      title: 'Bereich erfolgreich erstellt',
      description: 'Der neue Arbeitsbereich wurde erfolgreich angelegt.',
    })
  };

  return (
    <AreaForm
      onSubmit={handleSubmit}
      forestryRanges={forestryRanges}
      title="Neuen Bereich erstellen"
      description="Fülle das Formular aus, um einen neuen Bereich zu erstellen."
      submitButtonText="Bereich erstellen"
    />
  )
}
