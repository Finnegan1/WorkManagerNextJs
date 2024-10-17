'use server'

import prisma from '@/lib/prisma'
import { tokenDecoded } from '@/lib/utils/auth'
import { WorkAreaRestrictionLevel } from '@prisma/client'
import { z } from 'zod'

const AreaSchema = z.object({
  shortDescription: z.string().min(1).max(255),
  information: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  workDescription: z.string().min(1),
  forestSection: z.string().min(1),
  trailsInArea: z.string().transform(s => s.split('&,&').map(trail => trail.trim())),
  restrictionLevel: z.nativeEnum(WorkAreaRestrictionLevel),
  restrictedAreas: z.string().transform((s, ctx) => {
    try {
      return JSON.parse(s);
    } catch (e) {
      console.log(e)
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  }),
  rerouting: z.string().transform((s, ctx) => {
    try {
      return JSON.parse(s);
    } catch (e) {
      console.log(e)
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
  }),
  forestryRangeId: z.string().transform((s) => Number(s)),
});

export async function createArea(formData: FormData) {
  const token = await tokenDecoded()

  try {
    const validatedData = AreaSchema.parse({
      shortDescription: formData.get('shortDescription'),
      information: formData.get('information'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      workDescription: formData.get('workDescription'),
      forestSection: formData.get('forestSection'),
      trailsInArea: formData.get('trailsInArea'),
      restrictionLevel: formData.get('restrictionLevel'),
      restrictedAreas: formData.get('restrictedAreas'),
      rerouting: formData.get('rerouting'),
      forestryRangeId: formData.get('forestryRangeId'),
    });

    const { forestryRangeId, ...areaData } = validatedData;

    const area = await prisma.area.create({
      data: {
        ...areaData,
        startTime: new Date(areaData.startTime),
        endTime: new Date(areaData.endTime),
        createdBy: {
          connect: { email: token.email! }
        },
        forestryRange: {
          connect: { id: forestryRangeId }
        }
      } as any,
    });

    if (area) {
      return { success: true, id: area.id };
    }
  } catch (error) {
    console.error('Validation error:', error);
    return { error: 'Invalid input data' };
  }

  return { error: 'Unknown error occurred' };
}

export const getForestryRanges = async () => {
  const forestryRanges = await prisma.forestryRange.findMany()
  return forestryRanges
}
