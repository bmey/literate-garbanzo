import DrawControl from "@/components/DrawControl";
import { theme } from "@/styles/theme";
import { Hospital } from "@/types/hospital";
import { MeasureGroups, MeasureType } from "@/types/measures";
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
  measures: MeasureGroups;
  onDeletePolygon: (e: { features: Feature[] }) => void;
  onUpdatePolygon: (e: { features: any[] }) => void;
  selectedMeasure: MeasureType;
}
export const HcahpsMap = ({
  filteredHospitals,
  globalStats,
  mapboxToken,
  measures,
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
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const onClick = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      const features = e.features?.[0];
      if (
        features?.layer?.id === "points" &&
        popupInfo === null &&
        !features?.properties?.cluster
      ) {
        setPopupInfo(features?.properties as Hospital);
        setPopupOpen(true);
      } else {
        setPopupInfo(null);
        setPopupOpen(false);
      }
    },
    [setPopupInfo, popupInfo, setPopupOpen]
  );

  const layerStyle: CircleLayer = useMemo(() => {
    const targetStats = globalStats[selectedMeasure];
    return {
      id: "points",
      type: "circle",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 1, 23, 25],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", theme.low],
          targetStats.high,
          ["to-color", theme.high],
        ],
        "circle-stroke-color": [
          "interpolate",
          ["linear"],
          ["get", selectedMeasure],
          targetStats.low,
          ["to-color", theme.lowStroke],
          targetStats.high,
          ["to-color", theme.highStroke],
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
          ["to-color", theme.low],
          targetStats.high,
          ["to-color", theme.high],
        ],
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "point_count"],
          2,
          10,
          10,
          30,
          600,
          100,
        ],
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
      <div className="absolute bottom-2 right-2 w-max">
        <div className="flex justify-between font-mono">
          <div>{globalStats[selectedMeasure].low}</div>
          <div>{globalStats[selectedMeasure].high}</div>
        </div>
        <div className="w-[15rem] h-3 bg-gradient-to-r from-violet-800 to-emerald-400 mb-1"></div>
        <div className="flex justify-between text-xs uppercase tracking-widest text-slate-300">
          <div>Low</div>
          <div>High</div>
        </div>
      </div>
      <HospitalSlideOver
        hospital={popupInfo}
        measures={measures}
        open={popupOpen}
        setOpen={setPopupOpen}
        setHospital={() => setPopupInfo(null)}
      />
    </>
  );
};
