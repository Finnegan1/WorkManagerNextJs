import { LatLngBounds, latLng, latLngBounds } from 'leaflet';

// @ts-expect-error no glue what type is this
export function calculateBounds(geoJson): LatLngBounds {
  const bounds = latLngBounds([[-90, -180], [90, 180]]);
  
  const addCoordinatesToBounds = (coord: number[]) => {
    bounds.extend(latLng(coord[1], coord[0]));
  };

  const traverseCoordinates = (coordinates: any[]) => {
    if (typeof coordinates[0] === 'number') {
      addCoordinatesToBounds(coordinates);
    } else {
      coordinates.forEach(traverseCoordinates);
    }
  };

  traverseCoordinates(geoJson.geometry.coordinates);
  return bounds;
}