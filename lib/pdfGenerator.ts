import { WorkArea, PdfTemplate } from "@prisma/client";
import { generate } from '@pdfme/generator';
import { Template } from '@pdfme/common';
import { barcodes, ellipse, line, multiVariableText, rectangle, svg, table, image } from '@pdfme/schemas'
import puppeteer from 'puppeteer';

export async function generateAreaImage(workArea: WorkArea) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // Increase viewport size for higher resolution
  await page.setViewport({
    width: 1920, // Increase width
    height: 1080, // Increase height
    deviceScaleFactor: 4, // Further increase pixel density
  });

  const geojson = JSON.parse(workArea.area as string);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        #map { height: 1080px; width: 1920px; }
        .leaflet-control-zoom { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        const geojsonData = ${JSON.stringify(geojson)};
        const geoJsonLayer = L.geoJSON(geojsonData).addTo(map);
        
        const bounds = geoJsonLayer.getBounds();
        const areaSize = Math.abs(bounds.getNorth() - bounds.getSouth()) * Math.abs(bounds.getEast() - bounds.getWest());
        const basePadding = 0.5;
        const adaptivePadding = Math.max(0.2, basePadding - (areaSize * 100));
        
        map.fitBounds(bounds.pad(adaptivePadding));
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  await page.waitForSelector('#map');

  // Wait for tiles to load
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const checkTiles = setInterval(() => {
        const tilesLoaded = document.getElementsByClassName('leaflet-tile-loaded').length > 0;
        if (tilesLoaded) {
          clearInterval(checkTiles);
          resolve(true);
        }
      }, 100);
    });
  });

  // Take a high-quality screenshot
  const imageBuffer = await page.screenshot({
    fullPage: true,
    type: 'jpeg',
    quality: 100,
  });

  await browser.close();

  return imageBuffer;
}


export async function generatePDF(workAreas: WorkArea[], template: PdfTemplate) {
  try {
    let pdfTemplate: Template;
    try {
      pdfTemplate = {
        basePdf: template.basePdf,
        schemas: JSON.parse(template.schemas),
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