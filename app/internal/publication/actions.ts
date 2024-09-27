'use server'

import prisma from '@/lib/prisma'
import { generatePDF } from '@/lib/pdfGenerator'

export async function fetchWorkAreas(startDate: Date, endDate: Date) {
  return prisma.workArea.findMany({
    where: {
      startTime: { gte: startDate },
      endTime: { lte: endDate }
    }
  })
}

export async function generatePDFForAreas(selectedAreaIds: number[]) {
  try {
    const workAreas = await prisma.workArea.findMany({
      where: {
        id: { in: selectedAreaIds }
      }
    });

    const pdfData = await generatePDF(workAreas);
    
    return { success: true, message: 'PDF generated successfully', pdfData };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, message: 'Error generating PDF: ' + (error instanceof Error ? error.message : String(error)) };
  }
}

export async function sendPDFByEmail(email: string, selectedAreaIds: number[]) {
  // In a real application, you would generate a PDF and send it via email
  // For this example, we'll just return a success message
  console.log('Sending PDF to email:', email)
  return { success: true, message: 'PDF sent successfully' }
}
