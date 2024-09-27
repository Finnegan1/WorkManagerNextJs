import EditAreaForm from './EditAreaForm';
import prisma from '@/lib/prisma';

export default async function EditWorkArea({ params }: { params: { workAreaId: string } }) {
  const workAreaId = parseInt(params.workAreaId);
  const workArea = await prisma.workArea.findUnique({
    where: {
      id: workAreaId,
    },
  });

  if (!workArea) {
    return <div>Work area not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Edit Work Area</h1>
      <EditAreaForm workArea={workArea} />
    </div>
  );
}
