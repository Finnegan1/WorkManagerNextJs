import { WorkArea } from "@prisma/client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { LatLng, LatLngBounds } from "leaflet";
import type { Feature } from 'geojson';
import { JsonValue } from "@prisma/client/runtime/library";

// Define the PartialWorkArea type
type PartialWorkArea = Partial<WorkArea> & {
  area: JsonValue;
};

export function FitBounds({ workAreas }: { workAreas: PartialWorkArea[] }) {
    const map = useMap();
  
    useEffect(() => {
      if (workAreas.length > 0) {
        const bounds = new LatLngBounds([]);
  
        workAreas.forEach((workArea) => {
          const area = JSON.parse(workArea.area as string);
  
          console.log("Parsed GeoJSON Area:", area);
  
          if (area.type === "FeatureCollection") {
            area.features.forEach((feature: Feature) => {
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
    }, [map, workAreas]);
  
    return null;
  }


export function calculateBounds(workAreas: PartialWorkArea[]) {
  console.log("workAreas", workAreas);
  if (workAreas.length === 0 || JSON.parse(workAreas[0].area as string) === null) {
    return new LatLngBounds([[50.65, 12.3], [51.65, 13.3]]);
  }

  const bounds = new LatLngBounds([]);

  workAreas.forEach((workArea) => {
    const area = JSON.parse(workArea.area as string);
    console.log("Parsed GeoJSON Area:", area);

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

    if (area.type === "FeatureCollection") {
      area.features.forEach(processFeature);
    } else if (area.type === "Feature") {
      processFeature(area);
    }
  });

  console.log("Final Bounds:", bounds);

  if (!bounds.isValid()) {
    return new LatLngBounds([[0, 0], [0, 0]]);
  }

  return bounds;
}