import { LatLngBounds, latLng, latLngBounds } from 'leaflet';
import { FeatureCollection } from 'geojson';
import * as toGeoJSON from '@mapbox/togeojson';

export function calculateBounds(geoJson: FeatureCollection): LatLngBounds {
  const bounds = latLngBounds([]);
  const addCoordinatesToBounds = (coord: number[]) => {
    console.log(coord)
    bounds.extend(latLng(coord[1], coord[0]));
  };

  const traverseCoordinates = (coordinates: any[]) => {
    console.log(coordinates)
    if (typeof coordinates[0] === 'number') {
      console.log(coordinates)
      addCoordinatesToBounds(coordinates);
    } else {
      coordinates.forEach(traverseCoordinates);
    }
  };

  traverseCoordinates(geoJson.features[0].geometry.coordinates);
  return bounds;
}


export const convertGPXToGeoJSON = (gpxContent: string) => {
  const parser = new DOMParser();
  const gpxDom = parser.parseFromString(gpxContent, 'text/xml');
  const geojson = toGeoJSON.gpx(gpxDom);
  console.log(geojson)
  return geojson;
};