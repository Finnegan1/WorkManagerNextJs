import { WorkArea } from "@prisma/client";
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add custom fonts
const addFonts = (doc: jsPDF) => {
  // Use relative paths and check if files exist
  const fontPaths = [
    path.join(process.cwd(), 'assets', 'fonts', 'OpenSans', 'OpenSans-Regular.ttf'),
    path.join(process.cwd(), 'assets', 'fonts', 'OpenSans', 'OpenSans-Bold.ttf')
  ];

  fontPaths.forEach((fontPath, index) => {
    if (fs.existsSync(fontPath)) {
      const fontData = fs.readFileSync(fontPath);
      doc.addFileToVFS(fontPath, fontData.toString('base64'));
      doc.addFont(fontPath, 'OpenSans', index === 0 ? 'normal' : 'bold');
    } else {
      console.warn(`Font file not found: ${fontPath}`);
    }
  });
};

// Load and add logo
const addLogo = (doc: jsPDF) => {
  const logoPath = path.join(process.cwd(), 'assets', 'images', 'logo.png');
  if (fs.existsSync(logoPath)) {
    const logoData = fs.readFileSync(logoPath);
    doc.addImage(logoData, 'PNG', 10, 10, 50, 20);
  } else {
    console.warn('Logo file not found:', logoPath);
  }
};

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

export async function generatePDF(workAreas: WorkArea[]) {
  try {
    const doc = new jsPDF();
    addFonts(doc);
    
    for (const [index, area] of workAreas.entries()) {
      if (index > 0) doc.addPage();
      
      // Add logo and title
      addLogo(doc);
      
      // Add area name
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(area.name, 20, 50);
      
      // Add information
      doc.setFont('OpenSans', 'normal');
      doc.setFontSize(12);
      let yPos = 70;
      
      doc.text(`Type: ${area.type}`, 20, yPos);
      yPos += 10;
      
      doc.text(`Restriction Level: ${area.restrictionLevel}`, 20, yPos);
      yPos += 10;
      
      doc.text(`Start Time: ${area.startTime.toLocaleString()}`, 20, yPos);
      yPos += 10;
      doc.text(`End Time: ${area.endTime.toLocaleString()}`, 20, yPos);
      yPos += 10;
      
      if (area.description) {
        doc.setFont('OpenSans', 'bold');
        doc.text('Description:', 20, yPos);
        yPos += 10;
        doc.setFont('OpenSans', 'normal');
        doc.text(area.description, 20, yPos, { maxWidth: 170 });
        yPos += 20;
      }
      
      if (area.rerouting) {
        doc.setFont('OpenSans', 'bold');
        doc.text('Rerouting Information:', 20, yPos);
        yPos += 10;
        doc.setFont('OpenSans', 'normal');
        doc.text(area.rerouting, 20, yPos, { maxWidth: 170 });
        yPos += 20;
      }
      
      // Add map image
      try {
        const mapImage = await generateAreaImage(area);
        doc.addImage(mapImage, 'JPEG', 20, yPos, 170, 100);
        yPos += 110;
      } catch (error) {
        console.error('Error generating map image:', error);
        doc.text('Error: Unable to generate map image', 20, yPos);
      }
      
      // Add footer
      doc.setFont('OpenSans', 'normal');
      doc.setFontSize(8);
      doc.text('For more information, please visit www.finnegan.dev', 20, 285);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 150, 285);
    }

    const pdfData = doc.output('arraybuffer');
    console.log('PDF generated, size:', pdfData.byteLength, 'bytes');

    return Buffer.from(pdfData).toString('base64');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}