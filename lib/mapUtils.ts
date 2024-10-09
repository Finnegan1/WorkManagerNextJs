import { LatLngBounds, latLng, latLngBounds } from 'leaflet';
import { FeatureCollection } from 'geojson';

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