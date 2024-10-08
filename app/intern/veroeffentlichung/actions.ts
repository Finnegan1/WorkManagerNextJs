'use server'

import prisma from '@/lib/prisma'
import { Area } from "@prisma/client";
import StaticMaps from 'staticmaps';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib'
import type { FeatureCollection } from 'geojson';
import { formatDate } from '@/lib/utils/dateUtils';
import Handlebars from 'handlebars';

export async function fetchWorkAreas(startDate: Date, endDate: Date) {

  console.log('Fetching work areas for date range:', startDate, endDate);
  // all the work areas that are overlapping with the time range
  // this means that they start before the start date and end after the end date or in the time range
  // as well as the other overlapping options
  return prisma.area.findMany({
    where: {
      OR: [
        {
          startTime: { lte: startDate },
          endTime: { gte: startDate }
        },
        {
          startTime: { gte: startDate, lte: endDate },
        },
        {
          endTime: { gte: startDate, lte: endDate },
        },
      ]
    },
  })
}

export async function sendPDFByEmail(email: string, selectedAreaIds: number[]) {
  console.log('Sending PDF to email:', email, selectedAreaIds)
  return { success: true, message: 'PDF sent successfully' }
}

export async function generateAreaImage(area: Area) {
  try {
    console.log('Area received:', area);

    if (!area.restrictedAreas) {
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
    
    console.log('Area:', area.restrictedAreas);

    const geojsonRestrictedArea: FeatureCollection = area.restrictedAreas as any as FeatureCollection;
    const geojsonRerouting: FeatureCollection = area.rerouting as any as FeatureCollection || null;


    console.log('Parsed GeoJSON:', geojsonRestrictedArea);
    console.log('Parsed GeoJSON:', geojsonRerouting);

    if (geojsonRestrictedArea && Array.isArray(geojsonRestrictedArea.features)) {
      geojsonRestrictedArea.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon') {
          const polygon = {
            coords: feature.geometry.coordinates[0],
            color: 'red',
            width: 3,
          };
          map.addPolygon({
            ...polygon,
            coords: polygon.coords.map(pos => [pos[0], pos[1]])
          });
        } else if (feature.geometry.type === 'LineString') {
          const line = {
            coords: feature.geometry.coordinates,
            color: 'red',
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
      console.log('geojson is undefined or not an array', geojsonRestrictedArea)
      console.error('geojson is undefined or not an array');
    }

    if (geojsonRerouting) {
      geojsonRerouting.features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {
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

async function generatePdfPage(area: Area, template: string) {
  const form = new FormData();
  const baseFilePath = path.join(process.cwd(), 'assets', 'templates', template);

  const templateFilePath = path.join(baseFilePath, 'template.hbs');
  const templateSource = fs.readFileSync(templateFilePath, 'utf-8');

  const image = await generateAreaImage(area);

  const templateHandlebars = Handlebars.compile(templateSource);
  const html = templateHandlebars({
    currentDate: formatDate(new Date()),
    startDate: formatDate(area.startTime),
    endDate: formatDate(area.endTime),
    image: image,
    description: area.information || '',
    workDescription: area.workDescription,
    forstrevier: area.forestryRangeId || '',
    information: area.information || '',
    forestSection: area.forestSection || '',
    trailsInArea: area.trailsInArea || []
  });

  // Add files to the form
  form.append('index.html', new Blob([html]), 'index.html');

  fs.readdirSync(baseFilePath).forEach((file) => {
    const filePath = path.join(baseFilePath, file);
    const fileContent = fs.readFileSync(filePath);
    form.append(file, new Blob([fileContent]), file);
  });

  // Set margins
  form.append('marginTop', '0');
  form.append('marginRight', '0');
  form.append('marginBottom', '0');
  form.append('marginLeft', '0');

  const response = await fetch(
    `${process.env.GOTENBERG_URL}/forms/chromium/convert/html`,
    {
      method: 'POST',
      body: form
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } 
  
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

export async function generatePDF(areas: Area[], template: string) {
  try {
   
    const pdfBuffers = await Promise.all(areas.map((area) => generatePdfPage(area, template)))

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