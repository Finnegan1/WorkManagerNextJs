import { LatLngBounds, latLng, latLngBounds } from 'leaflet';
import { FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';

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


// Check if the tour intersects or lies within the GeoJSON features
export function checkTourWithinGeoJson(gpxGeoJson: GeoJSON.FeatureCollection, geoJson: GeoJSON.FeatureCollection): boolean {
  const gpxLineString = gpxGeoJson.features.find(feature => feature.geometry.type === 'LineString');

  if (!gpxLineString) {
    throw new Error('No LineString found in GPX data');
  }

  // Check for intersections or containment
  return geoJson.features.some(feature => {
    return (
      turf.booleanIntersects(gpxLineString as GeoJSON.Feature, feature) ||
      turf.booleanWithin(gpxLineString as GeoJSON.Feature, feature)
    );
  });
}
