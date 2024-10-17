'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { createArea, getForestryRanges } from './actions'
import AreaForm from '@/components/forms/AreaForm'
import { useRouter } from 'next/navigation'

export default function CreateAreaForm() {
  const [forestryRanges, setForestryRanges] = useState<any>([])
  const { toast } = useToast()
  const router = useRouter()

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
    
    if (result.error) {
      toast({
        title: 'Fehler',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result.success) {
      toast({
        title: 'Bereich erfolgreich erstellt',
        description: 'Der neue Arbeitsbereich wurde erfolgreich angelegt.',
      })
      router.push(`/intern/warnungen/${result.id}`)
    }
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
