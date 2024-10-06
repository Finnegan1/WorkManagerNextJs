"use server"

import prisma from "@/lib/prisma";
import { tokenDecoded } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

export const updateWorkArea = async (workAreaId: number, data: any) => {
  const token = await tokenDecoded();
  console.log(token);
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  // Capture the previous state of the WorkArea
  const previousWorkArea = await prisma.workArea.findUnique({
    where: { id: workAreaId },
  });

  // Perform the update
  const updatedWorkArea = await prisma.workArea.update({
    where: { id: workAreaId },
    data: {
      name: data.name,
      type: data.type,
      restrictionLevel: data.restrictionLevel,
      startTime: startTime,
      endTime: endTime,
      description: data.description,
      rerouting: data.rerouting,
      autoEnd: data.autoEnd == "on",
      area: data.area,
    },
  });

  // Log the changes
  await prisma.workAreaChangeLog.create({
    data: {
      changeType: "UPDATED",
      previousValues: previousWorkArea,
      newValues: updatedWorkArea,
      changedBy: {
        connect: {
          id: token.user!.id
        },
      },
      workArea: {
        connect: {
          id: workAreaId,
        },
      },
    },
  });

  redirect(`/intern/warnungen/${workAreaId}`);
};
