import DrawControl from "@/components/DrawControl";
import { Hospital } from "@/types/hospital";
import { MeasureType } from "@/types/measures";
import { MeasureStats } from "@/utils/stats";
import { Feature, FeatureCollection } from "geojson";
import { useCallback, useMemo, useState } from "react";
import Map, { CircleLayer, Layer, LayerProps, Source } from "react-map-gl";
import { HospitalSlideOver } from "./HospitalSlideOver";

const clusterProperties = (Object.keys(MeasureType) as MeasureType[]).reduce(
  (result, type) => {
    result[`${type}_sum`] = ["+", ["coalesce", ["get", type], 0]];
    return result;
  },
  {} as Record<`${MeasureType}_sum`, any>
);

interface HcahpsMapProps {
  filteredHospitals: FeatureCollection<any, Hospital>;
  globalStats: Record<MeasureType, MeasureStats>;
  mapboxToken: string | undefined;
  onDeletePolygon: (e: { features: Feature[] }) => void;
  onUpdatePolygon: (e: { features: any[] }) => void;
  selectedMeasure: MeasureType;
}
export const HcahpsMap = ({
  filteredHospitals,
  globalStats,
  mapboxToken,
  onDeletePolygon,
  onUpdatePolygon,
  selectedMeasure,
}: HcahpsMapProps) => {
  const initialViewState = {
    longitude: -102.4,
    latitude: 50.8,
    zoom: 1.5,
  };
  const [viewState, setViewState] = useState(initialViewState);
  const [popupInfo, setPopupInfo] = useState<Hospital | null>(null);
  const onClick = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      const features = e.features?.[0];
      if (
        features?.layer?.id === "points" &&
        popupInfo === null &&
        !features?.properties?.cluster
      ) {
        setPopupInfo(features?.properties as Hospital);
      } else {
        setPopupInfo(null);
      }
    },
    [setPopupInfo, popupInfo]
  );

  const layerStyle: CircleLayer = useMemo(() => {
    const targetStats = globalStats[selectedMeasure];
    return {
      id: "points",
      type: "circle",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 0, 23, 25],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", "#5b21b6"],
          targetStats.high,
          ["to-color", "#34d399"],
        ],
        "circle-stroke-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", "#2e1065"],
          targetStats.high,
          ["to-color", "#ecfdf5"],
        ],
        "circle-stroke-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          4,
          0,
          23,
          6,
        ],
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0, 6, 1],
      },
    };
  }, [selectedMeasure, globalStats]);

  const clusterLayer: LayerProps = useMemo(() => {
    const targetStats = globalStats[selectedMeasure];
    return {
      id: "clusters",
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["/", ["get", `${selectedMeasure}_sum`], ["get", "point_count"]],
          targetStats.low,
          ["to-color", "#5b21b6"],
          targetStats.high,
          ["to-color", "#34d399"],
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-blur": 0.6,
        "circle-opacity": ["interpolate", ["linear"], ["zoom"], 1, 1, 23, 0],
      },
    };
  }, [selectedMeasure, globalStats]);

  return (
    <>
      <Map
        {...viewState}
        initialViewState={initialViewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onClick}
        reuseMaps
        mapboxAccessToken={mapboxToken}
        style={{
          width: "calc(100vw - 20rem)",
          height: "calc(100vh - 10rem)",
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        attributionControl={false}
        interactiveLayerIds={["points"]}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdatePolygon}
          onUpdate={onUpdatePolygon}
          onDelete={onDeletePolygon}
        />
        <Source
          id="hospitals"
          type="geojson"
          data={filteredHospitals}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterProperties={clusterProperties}
        >
          <Layer {...layerStyle} />
          <Layer {...clusterLayer} />
        </Source>
      </Map>
      <HospitalSlideOver
        open={!!popupInfo}
        setOpen={() => setPopupInfo(null)}
      />
    </>
  );
};
