import { Area } from "@prisma/client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { LatLng, LatLngBounds } from "leaflet";
import type { Feature } from 'geojson';
import { JsonValue } from "@prisma/client/runtime/library";

// Define the PartialWorkArea type
type PartialArea = Partial<Area> & {
  restrictedArea: JsonValue;
};

export function FitBounds({ areas }: { areas: PartialArea[] }) {
    const map = useMap();
  
    useEffect(() => {
      if (areas.length > 0) {
        const bounds = new LatLngBounds([]);
  
        areas.forEach((area) => {
          const restrictedArea = JSON.parse(area.restrictedArea as string);
  
          console.log("Parsed GeoJSON Area:", restrictedArea);
  
          if (restrictedArea.type === "FeatureCollection") {
            restrictedArea.features.forEach((feature: Feature) => {
              console.log("Feature Geometry Type:", feature.geometry.type);
  
              if (feature.geometry.type === "Polygon") {
                feature.geometry.coordinates.forEach((polygon: number[][]) => {
                  polygon.forEach((coord: number[]) => {
                    console.log("Polygon Coordinate:", coord);
                    bounds.extend(new LatLng(coord[1], coord[0]));
                  });
                });
              } else if (feature.geometry.type === "MultiPolygon") {
                feature.geometry.coordinates.forEach((multiPolygon: number[][][]) => {
                  multiPolygon.forEach((polygon: number[][]) => {
                    polygon.forEach((coord: number[]) => {
                      console.log("MultiPolygon Coordinate:", coord);
                      bounds.extend(new LatLng(coord[1], coord[0]));
                    });
                  });
                });
              } else if (feature.geometry.type === "LineString") {
                feature.geometry.coordinates.forEach((coord: number[]) => {
                  console.log("LineString Coordinate:", coord);
                  bounds.extend(new LatLng(coord[1], coord[0]));
                });
              }
            });
          }
        });
  
        // Log the final bounds for debugging
        console.log("Final Bounds:", bounds);
  
        if (!bounds.isValid()) {
          map.setView([0, 0], 2);
        } else {
          map.fitBounds(bounds);
        }
      }
    }, [map, areas]);
  
    return null;
  }


export function calculateBounds(areas: PartialArea[]) {
  console.log("areas", areas[0].restrictedArea);
  if (areas.length === 0 || areas[0].restrictedArea === null) {
    return new LatLngBounds([[50.65, 12.3], [51.65, 13.3]]);
  }

  const bounds = new LatLngBounds([]);

  areas.forEach((area) => {
    const restrictedArea = area.restrictedArea as any as FeatureCollection;
    console.log("Parsed GeoJSON Area:", restrictedArea);

    const processFeature = (feature: Feature) => {
      console.log("Feature Geometry Type:", feature.geometry.type);

      if (feature.geometry.type === "Polygon") {
        feature.geometry.coordinates.forEach((polygon: number[][]) => {
          polygon.forEach((coord: number[]) => {
            console.log("Polygon Coordinate:", coord);
            bounds.extend(new LatLng(coord[1], coord[0]));
          });
        });
      } else if (feature.geometry.type === "MultiPolygon") {
        feature.geometry.coordinates.forEach((multiPolygon: number[][][]) => {
          multiPolygon.forEach((polygon: number[][]) => {
            polygon.forEach((coord: number[]) => {
              console.log("MultiPolygon Coordinate:", coord);
              bounds.extend(new LatLng(coord[1], coord[0]));
            });
          });
        });
      } else if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord: number[]) => {
          console.log("LineString Coordinate:", coord);
          bounds.extend(new LatLng(coord[1], coord[0]));
        });
      }
    };

    if (restrictedArea.type === "FeatureCollection") {
      restrictedArea.features.forEach(processFeature);
    } else if (restrictedArea.type === "Feature") {
      processFeature(restrictedArea);
    }
  });

  console.log("Final Bounds:", bounds);

  if (!bounds.isValid()) {
    return new LatLngBounds([[0, 0], [0, 0]]);
  }

  return bounds;
}