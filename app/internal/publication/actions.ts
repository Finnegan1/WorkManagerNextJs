'use server'

import prisma from '@/lib/prisma'
import { WorkArea, PdfTemplate } from "@prisma/client";
import { generate } from '@pdfme/generator';
import { Template } from '@pdfme/common';
import { barcodes, ellipse, line, multiVariableText, rectangle, svg, table, image } from '@pdfme/schemas'
import StaticMaps from 'staticmaps';



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
    let pdfTemplate: Template;
    try {
      pdfTemplate = {
        basePdf: template.basePdf,
        schemas: template.schemas as any[],
      };
    } catch (parseError) {
      console.error('Error parsing template:', parseError);
      throw new Error('Invalid template format: Unable to parse JSON');
    }

    if (workAreas.length === 0) {
      throw new Error('No work areas provided for PDF generation');
    }

    const multiVariableTextInputs: string[] = [];
    let imageInput: string = '';

    pdfTemplate.schemas.forEach(schema => {
      schema.forEach(field => {
        if(field.type === 'multiVariableText') {
          multiVariableTextInputs.push(field.name)
        }
        if(field.type === 'image') {
          imageInput = field.name
        }
      })
    })

    console.log('multiVariableTextInputs', multiVariableTextInputs)

    const inputData = await Promise.all(workAreas.map(async area => {
      const obj: { [key: string]: any } = {};
      multiVariableTextInputs.forEach(input => {
        obj[input] = JSON.stringify({
          name: area.name,
          typ: area.type,
          beschreibung: area.description,
          restriktion: area.restrictionLevel,
          start: area.startTime.toLocaleString(),
          ende: area.endTime.toLocaleString(),
          umleitung: area.rerouting,
        });
      });
      obj[imageInput] = await generateAreaImage(area);
      return obj;
    }));

    console.log('Input data for PDF generation:', inputData);

    const pdf = await generate({
      template: pdfTemplate,
      inputs: inputData,
      plugins: {
        image,
        svg,
        qrcode: barcodes.qrcode,
        multiVariableText,
        line,
        rectangle,
        ellipse,
        table
      },
    });

    console.log('PDF generated, size:', pdf.byteLength, 'bytes');

    return Buffer.from(pdf).toString('base64');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF: ' + (error as Error).message);
  }
}
