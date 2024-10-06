'use server'

import prisma from '@/lib/prisma'
import { WorkArea, PdfTemplate } from "@prisma/client";
import StaticMaps from 'staticmaps';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib'
import type { FeatureCollection } from 'geojson';
import { formatDate } from '@/lib/utils/dateUtils';

export async function fetchWorkAreas(startDate: Date, endDate: Date) {
  return prisma.workArea.findMany({
    where: {
      startTime: { gte: startDate },
      endTime: { lte: endDate }
    }
  })
}

export async function sendPDFByEmail(email: string, selectedAreaIds: number[]) {
  console.log('Sending PDF to email:', email, selectedAreaIds)
  return { success: true, message: 'PDF sent successfully' }
}

export async function generateAreaImage(workArea: WorkArea) {
  try {
    console.log('WorkArea received:', workArea);

    if (!workArea.area) {
      throw new Error('WorkArea area is undefined');
    }

    const mapOptions = {
      width: 800,
      height: 600,
      paddingX: 10,
      paddingY: 10,
      tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    };

    const map = new StaticMaps(mapOptions);
    
    console.log('WorkArea area:', workArea.area);
    let geojson;
    try {
      geojson = JSON.parse(workArea.area as string) as FeatureCollection;
    } catch (parseError) {
      console.error('Error parsing workArea.area:', parseError);
      throw new Error('Failed to parse workArea.area as JSON');
    }

    console.log('Parsed GeoJSON:', geojson);

    if (geojson && Array.isArray(geojson.features)) {
      geojson.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon') {
          const polygon = {
            coords: feature.geometry.coordinates[0],
            color: '#0000FFBB',
            width: 3,
          };
          map.addPolygon({
            ...polygon,
            coords: polygon.coords.map(pos => [pos[0], pos[1]])
          });
        } else if (feature.geometry.type === 'LineString') {
          const line = {
            coords: feature.geometry.coordinates,
            color: '#0000FFBB',
            width: 3,
          };
          map.addLine(
            {
              ...line,
              coords: line.coords.map(pos => [pos[0], pos[1]])
            }
          );
        }
      });
    } else {
      console.log('geojson is undefined or not an array', geojson)
      console.error('geojson is undefined or not an array');
    }

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

async function generatePdfPage(workArea: WorkArea) {
  const form = new FormData();
  const baseFilePath = path.join(process.cwd(), 'assets', 'templates', "standard");

  const baseTemplateFilePath = path.join(baseFilePath, 'template.html');
  const baseTemplate = fs.readFileSync(baseTemplateFilePath);

  const footerFilePath = path.join(baseFilePath, 'footer.png');
  const footer = fs.readFileSync(footerFilePath);

  const headerFilePath = path.join(baseFilePath, 'header.png');
  const header = fs.readFileSync(headerFilePath);

  const logoNaturErlebenLangFilePath = path.join(baseFilePath, 'logo_natur_erleben_lang.png');
  const logoNaturErlebenLang = fs.readFileSync(logoNaturErlebenLangFilePath);

  const image = await generateAreaImage(workArea)

  console.log('workArea', workArea)

  const html = baseTemplate.toString()
    .replace(/{{CURRENT_DATE}}/g, formatDate(new Date()))
    .replace(/{{START_DATE}}/g, formatDate(workArea.startTime))
    .replace(/{{END_DATE}}/g, formatDate(workArea.endTime))
    .replace(/{{IMAGE}}/g, image)
    .replace(/{{DESCRIPTION}}/g, workArea.description || '')
    .replace(/{{TYPE}}/g, workArea.type)

  //baseTemplate
  form.append('index.html', new Blob([html]), 'index.html');
  //assets
  form.append('footer.png', new Blob([footer]), 'footer.png');
  form.append('header.png', new Blob([header]), 'header.png');
  form.append('logo_natur_erleben_lang.png', new Blob([logoNaturErlebenLang]), 'logo_natur_erleben_lang.png');
  //styling
  form.append('marginTop', '0');
  form.append('marginRight', '0');
  form.append('marginBottom', '0');
  form.append('marginLeft', '0');

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
  return arrayBuffer 
}


export async function generatePDF(workAreas: WorkArea[], template: PdfTemplate) {
  try {
   
    console.log(template.id)
    const pdfBuffers = await Promise.all(workAreas.map((workArea) => generatePdfPage(workArea)))

    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();

    const base64 = Buffer.from(mergedPdfBytes).toString('base64');
    return base64;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
}