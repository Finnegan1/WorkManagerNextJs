import prisma from '@/lib/prisma';
import EditWorkAreaForm from './EditAreaForm';

export default async function EditWorkArea({ params }: { params: { areaId: string } }) {
  const areaId = parseInt(params.areaId);
  const area = await prisma.area.findUnique({
    where: {
      id: areaId,
    },
  });

  if (!area) {
    return <div>Area not found</div>;
  }

  const forestryRanges = await prisma.forestryRange.findMany();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <EditWorkAreaForm area={area} forestryRanges={forestryRanges} />
    </div>
  );
}
