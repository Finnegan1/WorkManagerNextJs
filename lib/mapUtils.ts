import { LatLngBounds, latLng, latLngBounds } from 'leaflet';
import { FeatureCollection } from 'geojson';

export function calculateBounds(geoJson: FeatureCollection): LatLngBounds {
  const bounds = latLngBounds([]);
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

  traverseCoordinates(geoJson.features[0].geometry.coordinates);
  return bounds;
}
