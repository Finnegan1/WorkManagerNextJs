import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

const MapEditor = ({ initialArea, onAreaChange }: { initialArea: any, onAreaChange: (area: any) => void }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && initialArea) {
      const geoJsonLayer = L.geoJSON(initialArea);
      geoJsonLayer.addTo(mapRef.current);
      mapRef.current.fitBounds(geoJsonLayer.getBounds());
    }
  }, [initialArea]);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();
    onAreaChange(geoJson);
  };

  const handleEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      const geoJson = layer.toGeoJSON();
      onAreaChange(geoJson);
    });
  };

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onEdited={handleEdited}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapEditor;