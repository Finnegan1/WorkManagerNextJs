'use server'

import prisma from '@/lib/prisma'
import { WorkArea, PdfTemplate } from "@prisma/client";
import StaticMaps from 'staticmaps';
import fs from 'fs';
import path from 'path';

export async function fetchWorkAreas(startDate: Date, endDate: Date) {
  return prisma.workArea.findMany({
    where: {
      startTime: { gte: startDate },
      endTime: { lte: endDate }
    }
  })
}

export async function sendPDFByEmail(email: string, selectedAreaIds: number[]) {
  // In a real application, you would generate a PDF and send it via email
  // For this example, we'll just return a success message
  console.log('Sending PDF to email:', email, selectedAreaIds)
  return { success: true, message: 'PDF sent successfully' }
}

export async function generateAreaImage(workArea: WorkArea) {

  try {
    const mapOptions = {
      width: 800,
      height: 600,
      paddingX: 10,
      paddingY: 10,
      tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    };

    const map = new StaticMaps(mapOptions);
    const geojson = JSON.parse(workArea.area as string);

    const line = {
      coords: geojson.geometry.coordinates[0],
      color: '#0000FFBB',
      width: 3,
    };

    map.addPolygon(line);
    await map.render();
    const buffer = await map.image.buffer('image/jpeg', { quality: 75 });

    const uint8Array = new Uint8Array(buffer);
    const base64Image = 'data:image/jpeg;base64,' + Buffer.from(uint8Array).toString('base64');

    return base64Image;
  } catch (error) {
    console.error('Error generating area image:', error);
    throw new Error('Failed to generate area image: ' + (error as Error).message);
  }
}


export async function generatePDF(workAreas: WorkArea[], template: PdfTemplate) {
  try {
    console.log(workAreas);
    console.log(template);
    const form = new FormData();
    const filePath = path.join(process.cwd(), 'assets', 'templates', 'template.html');
    const file = fs.readFileSync(filePath);
    //replace in the html file all {{url}} with the url http://localhost:3000
    const html = file.toString().replace(/{{BASE_URL}}/g, process.env.BASE_URL as string);
    form.append('index.html', new Blob([html]), 'index.html');

    const response = await fetch(
      'https://gotenberg.finnegan.dev/forms/chromium/convert/html',
      {
        method: 'POST',
        body: form
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    fs.writeFileSync('output.pdf', Buffer.from(uint8Array));
    const base64 = Buffer.from(uint8Array).toString('base64');
    return base64;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
}