'use client'

import { Area, ForestryRange } from '@prisma/client'
import { updateArea } from './actions'
import { useSession } from 'next-auth/react'
import AreaForm from '@/components/forms/AreaForm'

export default function EditWorkAreaForm({ area, forestryRanges }: { area: Area, forestryRanges: ForestryRange[] }) {
  const session = useSession()

  const handleSubmit = async (formData: FormData) => {
    await updateArea(area.id, formData);
  };

  if(session.status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <AreaForm
      defaultValues={area}
      onSubmit={handleSubmit}
      forestryRanges={forestryRanges}
      title="Arbeitsbereich bearbeiten"
      description="Aktualisieren Sie die Details des Arbeitsbereichs"
      submitButtonText="Arbeitsbereich aktualisieren"
    />
  )
}
