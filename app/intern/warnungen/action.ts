"use server"
import prisma from '@/lib/prisma';
import { tokenDecoded } from '@/lib/utils/auth';

export async function getAreas(onlyOwn: boolean) {
    const token = await tokenDecoded()
    if (onlyOwn) {
        return await prisma.area.findMany({
            where: {
            createdById: token.user.id
            }
        });
    }
    return await prisma.area.findMany();
}