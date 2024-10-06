import CreateWorkAreaForm from './CreateWorkAreaForm'

export default function NewWorkAreaPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Neuen Arbeitsbereich erstellen</h1>
      <CreateWorkAreaForm />
    </div>
  )
}